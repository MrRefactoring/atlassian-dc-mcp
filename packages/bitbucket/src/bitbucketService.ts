import { z } from 'zod';
import { createBitbucketClient, route } from './bitbucketClient/index.js';
import type { BitbucketClient, AccessTokenRequest } from './bitbucketClient/index.js';
import { handleApiOperation, resolveOpenApiBase } from 'datacenter-mcp-core';
import { simplifyInboxPullRequests } from './inboxPrMapper.js';
import { BITBUCKET_PRODUCT, getDefaultPageSize, getMissingConfig } from './config.js';
import type {
  BitbucketMutationOutputMode,
  BitbucketOutputMode } from './bitbucketResponseMapper.js';
import {
  shapePullRequestAck,
  shapePullRequestChangesResponse,
  shapePullRequestCommentAck,
  shapePullRequestCommentsResponse,
} from './bitbucketResponseMapper.js';

type DiffLineType = 'ADDED' | 'REMOVED' | 'CONTEXT';
type AccessTokenScope = 'user' | 'project' | 'repo';

/**
 * Build a Bitbucket DC inline comment anchor.
 *
 * For a multiline range, Bitbucket DC (>= 9.3.0) requires `multilineMarker` + `multilineSpan`.
 * The legacy `multilineStartLine`/`multilineStartLineType`/`multilineAnchor`/`multilineDestinationRange`
 * fields are silently ignored by the server, which then stores a single-line anchor — so a multiline
 * suggestion block only replaces its first line on Apply. Field names verified against BB DC 9.3.2.
 */
function buildCommentAnchor(params: {
  filePath: string;
  line?: number;
  lineType?: DiffLineType;
  startLine?: number;
  startLineType?: DiffLineType;
}): Record<string, any> {
  const { filePath, line, lineType } = params;
  const anchor: Record<string, any> = { path: filePath, diffType: 'EFFECTIVE' };
  if (line === undefined || !lineType) {
    return anchor;
  }

  if (params.startLine === undefined) {
    anchor.line = line;
    anchor.lineType = lineType;
    anchor.fileType = lineType === 'REMOVED' ? 'FROM' : 'TO';

    return anchor;
  }

  // Normalize so the marker sits on the lower line and `line` on the upper line.
  let startLine = params.startLine;
  let startLineType: DiffLineType = params.startLineType ?? lineType;
  let endLine = line;
  let endLineType: DiffLineType = lineType;
  if (startLine > endLine) {
    [startLine, endLine] = [endLine, startLine];
    [startLineType, endLineType] = [endLineType, startLineType];
  }

  const fileType = endLineType === 'REMOVED' ? 'FROM' : 'TO';
  anchor.line = endLine;
  anchor.lineType = endLineType;
  anchor.fileType = fileType;
  anchor.multilineMarker = { startLine, startLineType };
  anchor.multilineSpan =
    fileType === 'FROM'
      ? { srcSpanStart: startLine, srcSpanEnd: endLine }
      : { dstSpanStart: startLine, dstSpanEnd: endLine };

  return anchor;
}

const SUGGESTION_BLOCK_RE = /```suggestion\b[^\n]*\n([\s\S]*?)```/;

/**
 * Warn when a multi-line suggestion block is anchored to a single line: Bitbucket only replaces
 * the anchored line on Apply, leaving the rest (duplicated code). Returns undefined when there is no
 * concern. Heuristic — a 1-line anchor with a multi-line suggestion is the common failure shape.
 */
function multilineSuggestionWarning(text: string, startLine?: number): string | undefined {
  if (startLine !== undefined) {
    return undefined;
  }
  const match = SUGGESTION_BLOCK_RE.exec(text);
  if (!match) {
    return undefined;
  }
  const suggestionLineCount = match[1].replace(/\n$/, '').split('\n').length;
  if (suggestionLineCount <= 1) {
    return undefined;
  }

  return (
    'The comment contains a multi-line ```suggestion block but is anchored to a single line. ' +
    'On Apply, Bitbucket replaces only that one line and leaves the rest. To replace multiple lines, ' +
    'set startLine (first replaced line) and line (last replaced line) to span the whole range.'
  );
}

export class BitbucketService {
  private readonly getPageSize: () => number;
  private readonly bb: BitbucketClient;

  constructor(
    host: string | undefined,
    token: string | (() => string | undefined),
    apiBasePath?: string,
    getPageSize: () => number = getDefaultPageSize,
    username?: string | (() => string | undefined),
    password?: string | (() => string | undefined),
  ) {
    this.bb = createBitbucketClient({
      baseUrl: resolveOpenApiBase({
        host,
        apiBasePath,
        defaultBasePath: BITBUCKET_PRODUCT.defaultApiBasePath ?? '/rest',
        strippableSuffixes: BITBUCKET_PRODUCT.apiBasePathStrippableSuffixes,
      }),
      token,
      username,
      password,
    });
    this.getPageSize = getPageSize;
  }

  /**
   * Get commits for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param path Optional path to filter commits by
   * @param since Optional commit ID to retrieve commits after
   * @param until Optional commit ID to retrieve commits before
   * @param limit Optional pagination limit (default: 25)
   * @returns Promise with commits data
   */
  async getCommits(projectKey: string, repositorySlug: string, path?: string, since?: string, until?: string,
    limit?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getCommits({ projectKey: projectKey, repositorySlug: repositorySlug, path: path, until: until, since: since, start: 0, limit: limit ?? this.getPageSize() }),
      'Error fetching commits',
    );
  }

  /**
   * Get a single commit by id
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param commitId The commit id (hash) to retrieve
   * @param path Optional path; if given, the commit is only returned if it affects this path
   * @returns Promise with the commit data
   */
  async getCommit(projectKey: string, repositorySlug: string, commitId: string, path?: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getCommit({ projectKey: projectKey, commitId: commitId, repositorySlug: repositorySlug, path: path }),
      'Error fetching commit',
    );
  }

  /**
   * List build statuses for a commit
   * @param commitId The commit id (hash) whose build statuses to list
   * @param orderBy Optional ordering of the results
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with the build statuses
   * @remarks Uses the global (repository-agnostic) build-status API, keyed only by commit id.
   */
  async listBuildStatuses(commitId: string, orderBy?: string, start?: number, limit?: number) {
    return handleApiOperation(
      () => this.bb.builds.getBuildStatusStats({ commitId: commitId, orderBy: orderBy, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching build statuses',
    );
  }

  /**
   * Add (or update) a build status for a commit
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param commitId The commit id (hash) to attach the build status to
   * @param state The build state: SUCCESSFUL, FAILED, or INPROGRESS
   * @param key A unique key identifying the build (e.g. the pipeline/plan key)
   * @param url The URL to the build result
   * @param name Optional display name for the build
   * @param description Optional description for the build
   * @returns Promise resolving to an acknowledgement
   */
  async addBuildStatus(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    state: 'SUCCESSFUL' | 'FAILED' | 'INPROGRESS',
    key: string,
    url: string,
    name?: string,
    description?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody: any = { state, key, url, ...(name ? { name } : {}), ...(description ? { description } : {}) };
    const result = await handleApiOperation(
      () => this.bb.builds.add({ projectKey: projectKey, commitId: commitId, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error adding build status',
    );
    if (result.success) {
      return { ...result, data: { added: true, commitId, key } };
    }

    return result;
  }

  /**
   * Get a single build status for a commit by its key
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param commitId The commit id (hash)
   * @param key The unique key of the build status to fetch
   * @returns Promise with the build status
   */
  async getBuildStatus(projectKey: string, repositorySlug: string, commitId: string, key: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.builds.get({ projectKey: projectKey, commitId: commitId, repositorySlug: repositorySlug, key: key }),
      'Error fetching build status',
    );
  }

  /**
   * Get the raw content of a file at a given revision
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param path The path of the file to retrieve
   * @param at Optional commit hash or ref (e.g. 'refs/heads/main'); defaults to the default branch
   * @returns Promise with the raw file content
   */
  async getFileContent(
    projectKey: string,
    repositorySlug: string,
    path: string,
    at?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.streamRaw({ path: path, projectKey: projectKey, repositorySlug: repositorySlug, at: at }),
      'Error fetching file content',
    );
  }

  /**
   * Get the diff of a single commit
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param commitId The commit id (hash)
   * @param path Optional file path to limit the diff to; omit for the whole-commit diff
   * @param contextLines Optional number of context lines around changes
   * @param whitespace Optional whitespace flag (e.g. 'ignore-all')
   * @param srcPath Optional previous path if the file was copied/moved/renamed
   * @returns Promise with the commit diff
   */
  async getCommitDiff(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    path: string = '',
    contextLines?: string,
    whitespace?: string,
    srcPath?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.streamDiff({ commitId: commitId, repositorySlug: repositorySlug, path: path, projectKey: projectKey, srcPath: srcPath, contextLines: contextLines, whitespace: whitespace }),
      'Error fetching commit diff',
    );
  }

  /**
   * Browse a repository file or directory
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param path Optional path to browse; defaults to the repository root (directory listing)
   * @param at Optional commit hash or ref; defaults to the default branch
   * @param type If true, return only the node type (FILE, DIRECTORY, SUBMODULE) instead of content
   * @param blame If true, include blame information
   * @returns Promise with the browse result (directory children or paginated file lines)
   */
  async browseRepository(
    projectKey: string,
    repositorySlug: string,
    path: string = '',
    at?: string,
    type?: boolean,
    blame?: boolean,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getContent({ path: path, projectKey: projectKey, repositorySlug: repositorySlug, at: at, blame: blame ? 'true' : undefined, type: type ? 'true' : undefined }),
      'Error browsing repository content',
    );
  }

  /**
   * Get comments on a commit
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param commitId The commit id (hash)
   * @param path The file path to return comments for (required by Bitbucket when retrieving commit comments)
   * @param since Optional commit id; return comments added since that commit
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with the commit comments
   */
  async getCommitComments(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    path: string,
    since?: string,
    start?: number,
    limit?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getComments({ projectKey: projectKey, commitId: commitId, repositorySlug: repositorySlug, path: path, since: since, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching commit comments',
    );
  }

  /**
   * Compare two refs (commits or changes)
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param from The source ref/commit to compare from
   * @param to The target ref/commit to compare to
   * @param fromRepo Optional repository (projectKey/repositorySlug) the 'from' ref lives in, for cross-repo compares
   * @param compareType 'commits' (default) to list commits between the refs, or 'changes' to list changed files
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with the comparison data
   */
  async compareRefs(
    projectKey: string,
    repositorySlug: string,
    from: string,
    to: string,
    fromRepo?: string,
    compareType: 'commits' | 'changes' = 'commits',
    start?: number,
    limit?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const pageSize = limit ?? this.getPageSize();

    return handleApiOperation(
      () => compareType === 'changes'
        ? this.bb.repositories.streamChanges({ projectKey: projectKey, repositorySlug: repositorySlug, fromRepo: fromRepo, from: from, to: to, start: start, limit: pageSize })
        : this.bb.repositories.streamCommits({ projectKey: projectKey, repositorySlug: repositorySlug, fromRepo: fromRepo, from: from, to: to, start: start, limit: pageSize }),
      'Error comparing refs',
    );
  }

  /**
   * Create or replace a Code Insights report on a commit
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param commitId The commit id (hash) the report is attached to
   * @param key A unique key identifying the report (namespaced, e.g. 'mycompany.eslint')
   * @param report The report payload (title required; optional details, result PASS/FAIL, reporter, link, logoUrl, data[])
   * @returns Promise with the created report
   */
  async setInsightReport(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    key: string,
    report: Record<string, any>,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.builds.setACodeInsightsReport({ projectKey: projectKey, commitId: commitId, repositorySlug: repositorySlug, key: key, ...(report as any) }),
      'Error setting code insights report',
    );
  }

  /**
   * Get a Code Insights report on a commit
   */
  async getInsightReport(projectKey: string, repositorySlug: string, commitId: string, key: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.builds.getACodeInsightsReport({ projectKey: projectKey, commitId: commitId, repositorySlug: repositorySlug, key: key }),
      'Error fetching code insights report',
    );
  }

  /**
   * Delete a Code Insights report (and its annotations) on a commit
   */
  async deleteInsightReport(projectKey: string, repositorySlug: string, commitId: string, key: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.builds.deleteACodeInsightsReport({ projectKey: projectKey, commitId: commitId, repositorySlug: repositorySlug, key: key }),
      'Error deleting code insights report',
    );
    if (result.success) {
      return { ...result, data: { deleted: true, key } };
    }

    return result;
  }

  /**
   * Add annotations to a Code Insights report (bulk)
   * @param annotations Array of annotations; each: { externalId, path, line, message, severity (LOW/MEDIUM/HIGH), link?, type? }
   */
  async addInsightAnnotations(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    key: string,
    annotations: Array<Record<string, any>>,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.builds.addAnnotations({ projectKey: projectKey, commitId: commitId, repositorySlug: repositorySlug, key: key, ...({ annotations } as any) }),
      'Error adding code insights annotations',
    );
    if (result.success) {
      return { ...result, data: { added: annotations.length, key } };
    }

    return result;
  }

  /**
   * Get annotations of a Code Insights report
   */
  async getInsightAnnotations(projectKey: string, repositorySlug: string, commitId: string, key: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.builds.getAnnotations({ projectKey: projectKey, commitId: commitId, repositorySlug: repositorySlug, key: key }),
      'Error fetching code insights annotations',
    );
  }

  /**
   * Add a comment to a commit
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param commitId The commit id (hash) to comment on
   * @param text The comment text
   * @param path Optional file path to anchor the comment to a file
   * @param line Optional line number within the file to anchor the comment to
   * @param lineType Optional line type for the anchored line (ADDED, REMOVED, or CONTEXT)
   * @returns Promise with the created comment
   */
  async addCommitComment(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    text: string,
    path?: string,
    line?: number,
    lineType?: 'ADDED' | 'REMOVED' | 'CONTEXT',
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody: any = { text };
    if (path) {
      requestBody.anchor = {
        path,
        ...(line !== undefined ? { line, lineType: lineType ?? 'CONTEXT', fileType: 'TO' } : {}),
      };
    }

    return handleApiOperation(
      () => this.bb.repositories.createComment({ projectKey: projectKey, commitId: commitId, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error adding commit comment',
    );
  }

  /**
   * Delete annotations of a Code Insights report
   * @param externalId Optional external id; when given, only that annotation is deleted, otherwise all
   */
  async deleteInsightAnnotations(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    key: string,
    externalId?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.builds.deleteAnnotations({ projectKey: projectKey, commitId: commitId, repositorySlug: repositorySlug, key: key, externalId: externalId }),
      'Error deleting code insights annotations',
    );
    if (result.success) {
      return { ...result, data: { deleted: true, key, ...(externalId ? { externalId } : {}) } };
    }

    return result;
  }

  /**
   * Get a list of projects
   * @param name Optional filter by project name
   * @param permission Optional filter by permission
   * @param start Optional pagination start
   * @param limit Optional pagination limit (default: 25)
   * @returns Promise with projects data
   */
  async getProjects(name?: string, permission?: string, start?: number, limit?: number) {
    return handleApiOperation(
      () => this.bb.projects.getProjects({ name: name, permission: permission, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching projects',
    );
  }

  /**
   * Get a specific project by key
   * @param projectKey The project key
   * @returns Promise with project data
   */
  async getProject(projectKey: string) {
    projectKey = projectKey.toUpperCase();

    return handleApiOperation(
      () => this.bb.projects.getProject({ projectKey: projectKey }),
      'Error fetching project',
    );
  }

  /**
   * Get repositories for a project
   * @param projectKey The project key
   * @param start Optional pagination start
   * @param limit Optional pagination limit (default: 25)
   * @returns Promise with repositories data
   */
  async getRepositories(projectKey: string, start?: number, limit?: number) {
    projectKey = projectKey.toUpperCase();

    return handleApiOperation(
      () => this.bb.projects.getRepositories({ projectKey: projectKey, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching repositories',
    );
  }

  /**
   * Get a specific repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise with repository data
   */
  async getRepository(projectKey: string, repositorySlug: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.projects.getRepository({ projectKey: projectKey, repositorySlug: repositorySlug }),
      'Error fetching repository',
    );
  }

  /**
   * Create a branch in a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param name The name of the new branch (e.g. 'feature/login')
   * @param startPoint The commit hash or ref to branch from (e.g. 'refs/heads/master' or a commit id)
   * @returns Promise with the created branch
   */
  async createBranch(projectKey: string, repositorySlug: string, name: string, startPoint: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.createBranch({ projectKey: projectKey, repositorySlug: repositorySlug, name, startPoint }),
      'Error creating branch',
    );
  }

  /**
   * Delete a branch in a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param name The branch to delete (e.g. 'refs/heads/feature/login' or the branch name)
   * @param dryRun If true, validate the deletion without actually removing the branch
   * @returns Promise resolving to an acknowledgement
   */
  async deleteBranch(projectKey: string, repositorySlug: string, name: string, dryRun?: boolean) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody: any = { name, ...(dryRun !== undefined ? { dryRun } : {}) };
    const result = await handleApiOperation(
      () => this.bb.repositories.deleteBranch({ projectKey: projectKey, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error deleting branch',
    );
    if (result.success) {
      return { ...result, data: { deleted: !dryRun, name } };
    }

    return result;
  }

  /**
   * Get branches for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param filterText Optional text the branch name must contain
   * @param orderBy Optional ordering: ALPHABETICAL or MODIFICATION (most recently modified first)
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with branches data
   */
  async getBranches(
    projectKey: string,
    repositorySlug: string,
    filterText?: string,
    orderBy?: 'ALPHABETICAL' | 'MODIFICATION',
    start?: number,
    limit?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getBranches({ projectKey: projectKey, repositorySlug: repositorySlug, orderBy: orderBy, filterText: filterText, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching branches',
    );
  }

  /**
   * Get tags for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param filterText Optional text the tag name must contain
   * @param orderBy Optional ordering: ALPHABETICAL or MODIFICATION
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with tags data
   */
  async getTags(
    projectKey: string,
    repositorySlug: string,
    filterText?: string,
    orderBy?: string,
    start?: number,
    limit?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getTags({ projectKey: projectKey, repositorySlug: repositorySlug, orderBy: orderBy, filterText: filterText, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching tags',
    );
  }

  /**
   * Get the default branch of a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise with the default branch data
   */
  async getDefaultBranch(projectKey: string, repositorySlug: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getDefaultBranch({ projectKey: projectKey, repositorySlug: repositorySlug }),
      'Error fetching default branch',
    );
  }

  /**
   * Get a single tag by name
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param name The tag name (e.g. 'release-1.0.0')
   * @returns Promise with the tag data
   */
  async getTag(projectKey: string, repositorySlug: string, name: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getTag({ projectKey: projectKey, name: name, repositorySlug: repositorySlug }),
      'Error fetching tag',
    );
  }

  /**
   * Create or edit a file in a repository and commit the change
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param path The path of the file to create or modify
   * @param content The full new content of the file
   * @param message The commit message
   * @param branch The branch to commit on (e.g. 'refs/heads/master' or 'master')
   * @param sourceCommitId The commit id the file was last seen at; required when editing an existing file to detect conflicts. Omit for a new file.
   * @param sourceBranch When set, creates `branch` from this starting branch before committing
   * @returns Promise with the created commit
   */
  async editFile(
    projectKey: string,
    repositorySlug: string,
    path: string,
    content: string,
    message: string,
    branch: string,
    sourceCommitId?: string,
    sourceBranch?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const formData: any = {
      content,
      message,
      branch,
      ...(sourceCommitId ? { sourceCommitId } : {}),
      ...(sourceBranch ? { sourceBranch } : {}),
    };

    return handleApiOperation(
      () => this.bb.repositories.editFile({ path: path, projectKey: projectKey, repositorySlug: repositorySlug, ...(formData) }),
      'Error editing file',
    );
  }

  /**
   * Create a tag in a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param name The name of the new tag
   * @param startPoint The commit hash or ref the tag should point at
   * @param message Optional annotated-tag message
   * @returns Promise with the created tag
   */
  async createTag(
    projectKey: string,
    repositorySlug: string,
    name: string,
    startPoint: string,
    message?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody: any = { name, startPoint, ...(message ? { message } : {}) };

    return handleApiOperation(
      () => this.bb.repositories.createTagForRepository({ projectKey: projectKey, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error creating tag',
    );
  }

  /**
   * Get pull requests for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param withAttributes Optional flag to return additional pull request attributes (default: true)
   * @param at Optional fully-qualified branch ID to find pull requests to or from (e.g., refs/heads/master)
   * @param withProperties Optional flag to return additional pull request properties (default: true)
   * @param draft Optional draft status filter
   * @param filterText Optional text filter for title or description
   * @param state Optional state filter (OPEN, DECLINED, MERGED, or ALL; default: OPEN)
   * @param order Optional order (NEWEST or OLDEST; default: NEWEST)
   * @param direction Optional direction relative to repository (INCOMING or OUTGOING; default: INCOMING)
   * @param start Optional pagination start
   * @param limit Optional pagination limit (default: 25)
   * @returns Promise with pull requests data
   */
  async getPullRequests(
    projectKey: string,
    repositorySlug: string,
    withAttributes?: string,
    at?: string,
    withProperties?: string,
    draft?: string,
    filterText?: string,
    state?: string,
    order?: string,
    direction?: string,
    start?: number,
    limit?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.pullRequests.getPage({ projectKey: projectKey, repositorySlug: repositorySlug, withAttributes: withAttributes, at: at, withProperties: withProperties, draft: draft, filterText: filterText, state: state, order: order, direction: direction, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching pull requests',
    );
  }

  /**
   * Get a specific pull request by ID
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The ID of the pull request within the repository
   * @returns Promise with pull request data
   */
  async getPullRequest(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.pullRequests.get({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug }),
      'Error fetching pull request',
    );
  }

  async getPullRequestCommentsAndActions(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    start?: number,
    limit?: number,
    output: BitbucketOutputMode = 'compact',
    includeResolved = false,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.pullRequests.getActivities({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching pull request comments',
    );

    if (result.success && result.data) {
      return {
        success: true,
        data: shapePullRequestCommentsResponse(result.data, output, { includeResolved }),
      };
    }

    return result;
  }

  /**
   * Get pull request changes
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param sinceId Optional since commit hash to stream changes for a RANGE arbitrary change scope
   * @param changeScope Optional scope: 'UNREVIEWED' for unreviewed changes, 'RANGE' for changes between commits, 'ALL' for all changes (default)
   * @param untilId Optional until commit hash to stream changes for a RANGE arbitrary change scope
   * @param withComments Optional flag to include comment counts (default: true)
   * @param start Optional pagination start
   * @param limit Optional pagination limit (default: 25)
   * @returns Promise with PR changes data
   */
  async getPullRequestChanges(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    sinceId?: string,
    changeScope?: string,
    untilId?: string,
    withComments?: string,
    start?: number,
    limit?: number,
    output: BitbucketOutputMode = 'compact',
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.pullRequests.streamChanges({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug, sinceId: sinceId, changeScope: changeScope, untilId: untilId, withComments: withComments, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching pull request changes',
    );

    if (result.success && result.data) {
      return {
        ...result,
        data: shapePullRequestChangesResponse(result.data, output),
      };
    }

    return result;
  }

  /**
   * Post a comment to a pull request
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param text The comment text
   * @param parentId Optional parent comment ID for replies
   * @param filePath Optional file path for file-specific comments
   * @param startLine Optional start line for multiline comments; when provided together with line, creates a range comment
   * @param startLineType Optional line type for the start line; defaults to lineType if omitted
   * @param line Optional end line number for line/multiline comments
   * @param lineType Optional line type ('ADDED', 'REMOVED', 'CONTEXT') for the end line
   * @param pending Optional flag to create a pending (draft) comment, not visible to others until a review is submitted.
   *   Only works when filePath is provided (file-level or inline comments).
   *   Top-level PR comments (no filePath) are always posted live regardless of this flag.
   * @param severity Optional severity for the comment. 'BLOCKER' posts the comment as a task that must be resolved before the PR can be merged. Defaults to 'NORMAL' (regular comment) when omitted.
   * @returns Promise with created comment data
   */
  async postPullRequestComment(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    text: string,
    parentId?: number,
    filePath?: string,
    startLine?: number,
    startLineType?: 'ADDED' | 'REMOVED' | 'CONTEXT',
    line?: number,
    lineType?: 'ADDED' | 'REMOVED' | 'CONTEXT',
    pending?: boolean,
    severity?: 'NORMAL' | 'BLOCKER',
    output: BitbucketMutationOutputMode = 'ack',
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const comment: any = {
      text,
    };

    if (severity) {
      comment.severity = severity;
    }

    // Mark comment as pending (draft) — not visible to others until review is submitted
    // Note: Bitbucket DC uses state:'PENDING' not pending:true
    if (pending) {
      comment.state = 'PENDING';
    }

    // Add parent reference for replies
    if (parentId) {
      comment.parent = { id: parentId };
    }

    // Add anchor for file/line comments
    if (filePath) {
      comment.anchor = buildCommentAnchor({ filePath, line, lineType, startLine, startLineType });
    }

    const suggestionWarning = filePath ? multilineSuggestionWarning(text, startLine) : undefined;

    const result = await handleApiOperation(
      () => this.bb.pullRequests.createComment({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug, ...(comment) }),
      'Error posting pull request comment',
    );

    if (result.success && result.data && output !== 'full') {
      return {
        ...result,
        data: {
          ...shapePullRequestCommentAck(result.data),
          ...(suggestionWarning ? { warning: suggestionWarning } : {}),
        },
      };
    }

    if (result.success && suggestionWarning) {
      return { ...result, warning: suggestionWarning };
    }

    return result;
  }

  /**
   * Update an existing pull request comment. Use this to edit text, change severity, or resolve/reopen
   * it via state. On a regular comment, setting state to 'RESOLVED' resolves the comment thread (the
   * "Resolve" button in the UI, recording a resolver and resolvedDate) and 'OPEN' reopens it. On a
   * BLOCKER (task) comment, 'RESOLVED' ticks the task and 'OPEN' un-ticks it. In both cases resolution
   * is driven by the root comment's state.
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param commentId The comment ID to update
   * @param version The current version of the comment (required for optimistic locking)
   * @param text Optional new comment text
   * @param state Optional new state. 'RESOLVED' resolves the comment thread (ticks the task on a BLOCKER comment); 'OPEN' reopens it (un-ticks the task).
   * @param severity Optional new severity. 'BLOCKER' converts a comment into a task, 'NORMAL' converts a task back to a regular comment.
   * @returns Promise with updated comment data
   */
  async updatePullRequestComment(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    commentId: string,
    version: number,
    text?: string,
    state?: 'OPEN' | 'RESOLVED',
    severity?: 'NORMAL' | 'BLOCKER',
    output: BitbucketMutationOutputMode = 'ack',
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const comment: any = { version };

    if (text !== undefined) {
      comment.text = text;
    }

    if (state) {
      comment.state = state;
    }

    if (severity) {
      comment.severity = severity;
    }

    const result = await handleApiOperation(
      () => this.bb.pullRequests.updateComment({ projectKey: projectKey, commentId: commentId, pullRequestId: pullRequestId, repositorySlug: repositorySlug, ...(comment) }),
      'Error updating pull request comment',
    );

    if (result.success && result.data && output !== 'full') {
      return {
        ...result,
        data: shapePullRequestCommentAck(result.data),
      };
    }

    return result;
  }

  /**
   * Get a user by slug, or search for users by name/email filter
   * @param userSlug Optional exact slug to look up a specific user
   * @param filter Optional search string to find users by name or email
   * @returns Promise with user data
   */
  async getUser(userSlug?: string, filter?: string) {
    if (userSlug) {
      return handleApiOperation(
        () => this.bb.request({
          url: route`/api/latest/users/${userSlug}`,
          method: 'GET',
        }),
        'Error fetching user',
      );
    }

    return handleApiOperation(
      () => this.bb.request({
        url: '/api/latest/users',
        method: 'GET',
        searchParams: { filter },
      }),
      'Error fetching users',
    );
  }

  /**
   * Submit a pull request review, publishing all pending (draft) comments and updating the reviewer's status.
   * This is the equivalent of clicking "Submit Review" in the Bitbucket UI.
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param userSlug The username/slug of the reviewer submitting the review (the PAT token owner).
   * @param status The review verdict: 'APPROVED', 'NEEDS_WORK', or 'UNAPPROVED'
   * @param lastReviewedCommit Optional last reviewed commit hash (for tracking review progress)
   * @returns Promise with updated participant data
   */
  async submitPullRequestReview(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    userSlug: string,
    status: 'APPROVED' | 'NEEDS_WORK' | 'UNAPPROVED',
    lastReviewedCommit?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody: any = {
      status,
      ...(lastReviewedCommit ? { lastReviewedCommit } : {}),
    };

    return handleApiOperation(
      () => this.bb.pullRequests.updateStatus({ projectKey: projectKey, userSlug: userSlug, pullRequestId: pullRequestId, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error submitting pull request review',
    );
  }


  /**
   * Get text diff for a specific file in a pull request
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param path The path to the file which should be diffed
   * @param contextLines Optional number of context lines to include around added/removed lines
   * @param sinceId Optional since commit hash to stream a diff between two arbitrary hashes
   * @param srcPath Optional previous path to the file, if the file has been copied, moved or renamed
   * @param diffType Optional type of diff being requested
   * @param untilId Optional until commit hash to stream a diff between two arbitrary hashes
   * @param whitespace Optional whitespace flag which can be set to 'ignore-all'
   * @returns Promise with text diff data
   */
  async getPullRequestDiff(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    path: string,
    contextLines?: string,
    sinceId?: string,
    srcPath?: string,
    diffType?: string,
    untilId?: string,
    whitespace?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.request({
        url: route`/api/latest/projects/${projectKey}/repos/${repositorySlug}/pull-requests/${pullRequestId}/diff/${path}`,
        method: 'GET',
        searchParams: {
          'contextLines': contextLines,
          'sinceId': sinceId,
          'srcPath': srcPath,
          'diffType': diffType,
          'untilId': untilId,
          'whitespace': whitespace,
        },
        headers: {
          'Accept': 'text/plain',
        },
      }),
      'Error fetching pull request diff',
    );
  }

  /**
   * Create a pull request
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param title The pull request title
   * @param description Optional pull request description
   * @param fromRefId The source branch (e.g., 'refs/heads/feature-branch')
   * @param toRefId The destination branch (e.g., 'refs/heads/main')
   * @param reviewers Optional array of reviewer usernames
   * @param draft Optional flag to create the pull request as a draft
   * @param output Return a compact acknowledgement or the full API response. Defaults to 'ack'.
   * @returns Promise with created pull request data
   */
  async createPullRequest(
    projectKey: string,
    repositorySlug: string,
    title: string,
    description: string | undefined,
    fromRefId: string,
    toRefId: string,
    reviewers?: string[],
    draft?: boolean,
    output: BitbucketMutationOutputMode = 'ack',
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const pullRequestData: any = {
      title,
      description,
      fromRef: {
        id: fromRefId,
        repository: {
          slug: repositorySlug,
          project: {
            key: projectKey,
          },
        },
      },
      toRef: {
        id: toRefId,
        repository: {
          slug: repositorySlug,
          project: {
            key: projectKey,
          },
        },
      },
    };

    if (reviewers && reviewers.length > 0) {
      pullRequestData.reviewers = reviewers.map(username => ({
        user: {
          name: username,
        },
      }));
    }

    if (draft !== undefined) {
      pullRequestData.draft = draft;
    }

    const result = await handleApiOperation(
      () => this.bb.pullRequests.create({ projectKey: projectKey, repositorySlug: repositorySlug, ...(pullRequestData) }),
      'Error creating pull request',
    );

    if (result.success && result.data && output !== 'full') {
      return {
        ...result,
        data: shapePullRequestAck(result.data),
      };
    }

    return result;
  }

  /**
   * Update a pull request
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param version The version of the pull request (required for optimistic locking)
   * @param title Optional new title for the pull request
   * @param description Optional new description for the pull request
   * @param reviewers Optional array of reviewer usernames to set
   * @param draft Optional flag to mark the pull request as a draft or ready for review
   * @param output Return a compact acknowledgement or the full API response. Defaults to 'ack'.
   * @returns Promise with updated pull request data
   */
  async updatePullRequest(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    version: number,
    title?: string,
    description?: string,
    reviewers?: string[],
    draft?: boolean,
    output: BitbucketMutationOutputMode = 'ack',
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const pullRequestData: any = {
      version,
    };

    if (title !== undefined) {
      pullRequestData.title = title;
    }

    if (description !== undefined) {
      pullRequestData.description = description;
    }

    if (reviewers && reviewers.length > 0) {
      pullRequestData.reviewers = reviewers.map(username => ({
        user: {
          name: username,
        },
      }));
    }

    if (draft !== undefined) {
      pullRequestData.draft = draft;
    }

    const result = await handleApiOperation(
      () => this.bb.pullRequests.update({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug, ...(pullRequestData) }),
      'Error updating pull request',
    );

    if (result.success && result.data && output !== 'full') {
      return {
        ...result,
        data: shapePullRequestAck(result.data),
      };
    }

    return result;
  }

  /**
   * Check whether a pull request can be merged
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @returns Promise with mergeability data (canMerge, conflicted, vetoes)
   */
  async canMergePullRequest(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.pullRequests.canMerge({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug }),
      'Error checking pull request mergeability',
    );
  }

  /**
   * Merge a pull request
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param version The current version of the pull request (required for optimistic locking)
   * @param message Optional custom merge commit message
   * @param strategyId Optional merge strategy id (e.g. 'no-ff', 'ff', 'ff-only', 'rebase-no-ff', 'squash')
   * @param output Return a compact acknowledgement or the full API response. Defaults to 'ack'.
   * @returns Promise with merged pull request data
   */
  async mergePullRequest(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    version: number,
    message?: string,
    strategyId?: string,
    output: BitbucketMutationOutputMode = 'ack',
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody: any = {
      ...(message ? { message } : {}),
      ...(strategyId ? { strategyId } : {}),
    };

    const result = await handleApiOperation(
      () => this.bb.pullRequests.merge({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug, version: String(version), ...(requestBody) }),
      'Error merging pull request',
    );

    if (result.success && result.data && output !== 'full') {
      return { ...result, data: shapePullRequestAck(result.data) };
    }

    return result;
  }

  /**
   * Decline a pull request
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param version The current version of the pull request (required for optimistic locking)
   * @param comment Optional comment explaining why the pull request was declined
   * @param output Return a compact acknowledgement or the full API response. Defaults to 'ack'.
   * @returns Promise with declined pull request data
   */
  async declinePullRequest(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    version: number,
    comment?: string,
    output: BitbucketMutationOutputMode = 'ack',
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody: any = {
      ...(comment ? { comment } : {}),
    };

    const result = await handleApiOperation(
      () => this.bb.pullRequests.decline({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug, version: String(version), ...(requestBody) }),
      'Error declining pull request',
    );

    if (result.success && result.data && output !== 'full') {
      return { ...result, data: shapePullRequestAck(result.data) };
    }

    return result;
  }

  /**
   * Reopen a declined pull request
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param version The current version of the pull request (required for optimistic locking)
   * @param output Return a compact acknowledgement or the full API response. Defaults to 'ack'.
   * @returns Promise with reopened pull request data
   */
  async reopenPullRequest(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    version: number,
    output: BitbucketMutationOutputMode = 'ack',
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    const result = await handleApiOperation(
      () => this.bb.pullRequests.reopen({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug, version: String(version) }),
      'Error reopening pull request',
    );

    if (result.success && result.data && output !== 'full') {
      return { ...result, data: shapePullRequestAck(result.data) };
    }

    return result;
  }

  /**
   * Get required reviewers for PR creation
   * Returns a set of users who are required reviewers for pull requests created from the given source repository
   * and ref to the given target ref in this repository.
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param sourceRefId The ID of the source ref (e.g., 'refs/heads/feature-branch')
   * @param targetRefId The ID of the target ref (e.g., 'refs/heads/main')
   * @param sourceRepoId Optional ID of the repository in which the source ref exists
   * @param targetRepoId Optional ID of the repository in which the target ref exists
   * @returns Promise with required reviewers data
   */
  async getRequiredReviewers(
    projectKey: string,
    repositorySlug: string,
    sourceRefId: string,
    targetRefId: string,
    sourceRepoId?: string,
    targetRepoId?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.pullRequests.getReviewers({ projectKey: projectKey, repositorySlug: repositorySlug, targetRepoId: targetRepoId, sourceRepoId: sourceRepoId, sourceRefId: sourceRefId, targetRefId: targetRefId }),
      'Error fetching required reviewers',
    );
  }

  /**
   * Get pull requests from the dashboard API (across all repositories)
   * @param role Role filter: AUTHOR (default), REVIEWER, or PARTICIPANT
   * @param state State filter: OPEN (default), DECLINED, or MERGED
   * @param closedSince Optional timestamp (in milliseconds) to filter PRs closed after this date
   * @param order Order: NEWEST (default), OLDEST, or PARTICIPANT
   * @param start Optional pagination start
   * @param limit Pagination limit (defaults to the package page size)
   * @returns Promise with dashboard pull requests data
   */
  async getDashboardPullRequests(
    role: string = 'AUTHOR',
    state: string = 'OPEN',
    closedSince?: number,
    order: string = 'NEWEST',
    start?: number,
    limit?: number,
  ) {
    return handleApiOperation(
      () => this.bb.request({
        url: '/api/1.0/dashboard/pull-requests',
        method: 'GET',
        searchParams: {
          'role': role,
          'state': state,
          'closedSince': closedSince,
          'order': order,
          'start': start,
          'limit': limit ?? this.getPageSize(),
        },
      }),
      'Error fetching dashboard pull requests',
    );
  }

  /**
   * Get pull requests from the authenticated user's inbox (PRs awaiting review)
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with inbox pull requests data
   */
  async getInboxPullRequests(start?: number, limit?: number) {
    const result = await handleApiOperation(
      () => this.bb.request({
        url: '/api/latest/inbox/pull-requests',
        method: 'GET',
        searchParams: {
          'start': start,
          'limit': limit ?? this.getPageSize(),
        },
      }),
      'Error fetching inbox pull requests',
    );

    if (result.success && result.data) {
      return {
        success: true,
        data: simplifyInboxPullRequests(result.data),
      };
    }

    return result;
  }

  /**
   * Get the branch (ref) restrictions configured for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param matcherType Optional matcher type to filter on (BRANCH, PATTERN, MODEL_CATEGORY, MODEL_BRANCH)
   * @param matcherId Optional matcher id to filter on (requires matcherType)
   * @param type Optional restriction type to filter on (read-only, no-deletes, fast-forward-only, pull-request-only, no-creates)
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with the page of restrictions
   */
  async getBranchRestrictions(
    projectKey: string,
    repositorySlug: string,
    matcherType?: 'BRANCH' | 'PATTERN' | 'MODEL_CATEGORY' | 'MODEL_BRANCH',
    matcherId?: string,
    type?: 'read-only' | 'no-deletes' | 'fast-forward-only' | 'pull-request-only' | 'no-creates',
    start?: number,
    limit?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getRestrictions({ projectKey: projectKey, repositorySlug: repositorySlug, matcherType: matcherType, matcherId: matcherId, type: type, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching branch restrictions',
    );
  }

  /**
   * Find webhooks in a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param event Optional webhook event ID to filter for (e.g. 'repo:refs_changed')
   * @param statistics Optional flag to include invocation statistics for each webhook
   * @returns Promise with the page of webhooks
   */
  async getWebhooks(projectKey: string, repositorySlug: string, event?: string, statistics?: boolean) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.findWebhooks({ projectKey: projectKey, repositorySlug: repositorySlug, event: event, statistics: statistics }),
      'Error fetching webhooks',
    );
  }

  /**
   * Get a single webhook by ID
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param webhookId The ID of the webhook
   * @param statistics Optional flag to include invocation statistics
   * @returns Promise with the webhook
   */
  async getWebhook(projectKey: string, repositorySlug: string, webhookId: string, statistics?: boolean) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getWebhook({ projectKey: projectKey, webhookId: webhookId, repositorySlug: repositorySlug, statistics: statistics === undefined ? undefined : String(statistics) }),
      'Error fetching webhook',
    );
  }

  /**
   * Get the required-builds merge checks configured for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with the page of required-builds merge checks
   */
  async getRequiredBuildsMergeChecks(projectKey: string, repositorySlug: string, start?: number, limit?: number) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.builds.getPageOfRequiredBuildsMergeChecks({ projectKey: projectKey, repositorySlug: repositorySlug, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching required builds merge checks',
    );
  }

  /**
   * Get the default reviewer conditions configured for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise with the list of default reviewer conditions
   */
  async getDefaultReviewerConditions(projectKey: string, repositorySlug: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.pullRequests.getPullRequestConditions({ projectKey: projectKey, repositorySlug: repositorySlug }),
      'Error fetching default reviewer conditions',
    );
  }

  /**
   * Create a default reviewer condition for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param sourceMatcherType Matcher type for the source ref (ANY_REF, BRANCH, PATTERN, MODEL_CATEGORY, MODEL_BRANCH)
   * @param sourceMatcherValue Matcher value for the source ref (e.g. 'ANY_REF', 'refs/heads/main', a pattern, or a model id)
   * @param targetMatcherType Matcher type for the target ref
   * @param targetMatcherValue Matcher value for the target ref
   * @param reviewerIds Numeric user IDs of the default reviewers
   * @param requiredApprovals Optional number of required approvals
   * @param sourceMatcherDisplayId Optional display value for the source matcher (defaults to the value)
   * @param targetMatcherDisplayId Optional display value for the target matcher (defaults to the value)
   * @returns Promise with the created condition
   */
  async createDefaultReviewerCondition(
    projectKey: string,
    repositorySlug: string,
    sourceMatcherType: string,
    sourceMatcherValue: string,
    targetMatcherType: string,
    targetMatcherValue: string,
    reviewerIds: number[],
    requiredApprovals?: number,
    sourceMatcherDisplayId?: string,
    targetMatcherDisplayId?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody = this.buildDefaultReviewerBody(
      sourceMatcherType, sourceMatcherValue, targetMatcherType, targetMatcherValue,
      reviewerIds, requiredApprovals, sourceMatcherDisplayId, targetMatcherDisplayId,
    );

    return handleApiOperation(
      () => this.bb.pullRequests.createPullRequestCondition({ projectKey: projectKey, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error creating default reviewer condition',
    );
  }

  /**
   * Create a webhook for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param name The webhook name
   * @param url The endpoint URL the webhook will POST to
   * @param events List of event IDs to subscribe to (e.g. ['repo:refs_changed', 'pr:opened'])
   * @param active Optional flag controlling whether the webhook is enabled (default: true)
   * @param secret Optional secret used to sign webhook payloads (HMAC)
   * @param sslVerificationRequired Optional flag for SSL verification on the endpoint URL
   * @returns Promise with the created webhook
   */
  async createWebhook(
    projectKey: string,
    repositorySlug: string,
    name: string,
    url: string,
    events: string[],
    active?: boolean,
    secret?: string,
    sslVerificationRequired?: boolean,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody = this.buildWebhookBody(name, url, events, active, secret, sslVerificationRequired);

    return handleApiOperation(
      () => this.bb.repositories.createWebhook({ projectKey: projectKey, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error creating webhook',
    );
  }

  /**
   * Create a required-builds merge check for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param buildParentKeys Non-empty list of build parent keys that must have green builds for the check to pass
   * @param refMatcherType Matcher type for the target ref (ANY_REF, BRANCH, PATTERN, MODEL_CATEGORY, MODEL_BRANCH)
   * @param refMatcherValue Matcher value for the target ref (e.g. 'refs/heads/main')
   * @param refMatcherDisplayId Optional display value for the ref matcher (defaults to the value)
   * @param exemptRefMatcherType Optional matcher type for the exempt source ref
   * @param exemptRefMatcherValue Optional matcher value for the exempt source ref
   * @param exemptRefMatcherDisplayId Optional display value for the exempt ref matcher
   * @returns Promise with the created merge check
   */
  async createRequiredBuildsMergeCheck(
    projectKey: string,
    repositorySlug: string,
    buildParentKeys: string[],
    refMatcherType: string,
    refMatcherValue: string,
    refMatcherDisplayId?: string,
    exemptRefMatcherType?: string,
    exemptRefMatcherValue?: string,
    exemptRefMatcherDisplayId?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody = this.buildRequiredBuildsBody(
      buildParentKeys, refMatcherType, refMatcherValue, refMatcherDisplayId,
      exemptRefMatcherType, exemptRefMatcherValue, exemptRefMatcherDisplayId,
    );

    return handleApiOperation(
      () => this.bb.builds.createRequiredBuildsMergeCheck({ projectKey: projectKey, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error creating required builds merge check',
    );
  }

  /**
   * Update an existing webhook (replaces its configuration)
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param webhookId The ID of the webhook to update
   * @param name The webhook name
   * @param url The endpoint URL the webhook will POST to
   * @param events List of event IDs to subscribe to
   * @param active Optional flag controlling whether the webhook is enabled
   * @param secret Optional secret used to sign webhook payloads (HMAC)
   * @param sslVerificationRequired Optional flag for SSL verification on the endpoint URL
   * @returns Promise with the updated webhook
   */
  async updateWebhook(
    projectKey: string,
    repositorySlug: string,
    webhookId: string,
    name: string,
    url: string,
    events: string[],
    active?: boolean,
    secret?: string,
    sslVerificationRequired?: boolean,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody = this.buildWebhookBody(name, url, events, active, secret, sslVerificationRequired);

    return handleApiOperation(
      () => this.bb.repositories.updateWebhook({ projectKey: projectKey, webhookId: webhookId, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error updating webhook',
    );
  }

  /**
   * Create a branch (ref) restriction for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param type The restriction type (read-only, no-deletes, fast-forward-only, pull-request-only, no-creates)
   * @param matcherType Matcher type for the restricted ref (ANY_REF, BRANCH, PATTERN, MODEL_CATEGORY, MODEL_BRANCH)
   * @param matcherValue Matcher value (e.g. 'refs/heads/main', a pattern, or a model id)
   * @param matcherDisplayId Optional display value for the matcher (defaults to the value)
   * @param exemptUserSlugs Optional list of user slugs exempt from the restriction
   * @param exemptGroupNames Optional list of group names exempt from the restriction
   * @param exemptAccessKeyIds Optional list of SSH access key IDs exempt from the restriction
   * @returns Promise with the created restriction
   */
  async createBranchRestriction(
    projectKey: string,
    repositorySlug: string,
    type: string,
    matcherType: string,
    matcherValue: string,
    matcherDisplayId?: string,
    exemptUserSlugs?: string[],
    exemptGroupNames?: string[],
    exemptAccessKeyIds?: number[],
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const restriction: any = {
      type,
      matcher: {
        id: matcherValue,
        displayId: matcherDisplayId ?? matcherValue,
        type: { id: matcherType },
      },
      ...(exemptUserSlugs ? { userSlugs: exemptUserSlugs } : {}),
      ...(exemptGroupNames ? { groupNames: exemptGroupNames } : {}),
      ...(exemptAccessKeyIds ? { accessKeyIds: exemptAccessKeyIds } : {}),
    };

    return handleApiOperation(
      () => this.bb.repositories.createRestrictions({ projectKey: projectKey, repositorySlug: repositorySlug, restrictions: [restriction] }),
      'Error creating branch restriction',
    );
  }

  /**
   * Update an existing default reviewer condition (replaces the condition)
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param id The ID of the condition to update
   * @param sourceMatcherType Matcher type for the source ref
   * @param sourceMatcherValue Matcher value for the source ref
   * @param targetMatcherType Matcher type for the target ref
   * @param targetMatcherValue Matcher value for the target ref
   * @param reviewerIds Numeric user IDs of the default reviewers
   * @param requiredApprovals Optional number of required approvals
   * @param sourceMatcherDisplayId Optional display value for the source matcher
   * @param targetMatcherDisplayId Optional display value for the target matcher
   * @returns Promise with the updated condition
   */
  async updateDefaultReviewerCondition(
    projectKey: string,
    repositorySlug: string,
    id: string,
    sourceMatcherType: string,
    sourceMatcherValue: string,
    targetMatcherType: string,
    targetMatcherValue: string,
    reviewerIds: number[],
    requiredApprovals?: number,
    sourceMatcherDisplayId?: string,
    targetMatcherDisplayId?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody = this.buildDefaultReviewerBody(
      sourceMatcherType, sourceMatcherValue, targetMatcherType, targetMatcherValue,
      reviewerIds, requiredApprovals, sourceMatcherDisplayId, targetMatcherDisplayId,
    );

    return handleApiOperation(
      () => this.bb.pullRequests.updatePullRequestCondition({ projectKey: projectKey, id: id, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error updating default reviewer condition',
    );
  }

  /**
   * Update an existing required-builds merge check (replaces the check)
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param id The ID of the merge check to update
   * @param buildParentKeys Non-empty list of build parent keys
   * @param refMatcherType Matcher type for the target ref
   * @param refMatcherValue Matcher value for the target ref
   * @param refMatcherDisplayId Optional display value for the ref matcher
   * @param exemptRefMatcherType Optional matcher type for the exempt source ref
   * @param exemptRefMatcherValue Optional matcher value for the exempt source ref
   * @param exemptRefMatcherDisplayId Optional display value for the exempt ref matcher
   * @returns Promise with the updated merge check
   */
  async updateRequiredBuildsMergeCheck(
    projectKey: string,
    repositorySlug: string,
    id: string,
    buildParentKeys: string[],
    refMatcherType: string,
    refMatcherValue: string,
    refMatcherDisplayId?: string,
    exemptRefMatcherType?: string,
    exemptRefMatcherValue?: string,
    exemptRefMatcherDisplayId?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody = this.buildRequiredBuildsBody(
      buildParentKeys, refMatcherType, refMatcherValue, refMatcherDisplayId,
      exemptRefMatcherType, exemptRefMatcherValue, exemptRefMatcherDisplayId,
    );

    return handleApiOperation(
      () => this.bb.builds.updateRequiredBuildsMergeCheck({ projectKey: projectKey, id: Number(id), repositorySlug: repositorySlug, ...(requestBody) }),
      'Error updating required builds merge check',
    );
  }

  /**
   * Get a single branch (ref) restriction by ID
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param id The restriction ID
   * @returns Promise with the restriction
   */
  async getBranchRestriction(projectKey: string, repositorySlug: string, id: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getRestriction({ projectKey: projectKey, id: id, repositorySlug: repositorySlug }),
      'Error fetching branch restriction',
    );
  }

  /**
   * Delete a branch (ref) restriction by ID
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param id The restriction ID
   * @returns Promise with a delete acknowledgement
   */
  async deleteBranchRestriction(projectKey: string, repositorySlug: string, id: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.repositories.deleteRestriction({ projectKey: projectKey, id: id, repositorySlug: repositorySlug }),
      'Error deleting branch restriction',
    );

    return { ...result, data: { deleted: true, id } };
  }

  /**
   * Get the branch model configuration for a repository (development/production branches and branch type prefixes).
   *
   * Note: the branch-utils REST module is not part of the generated client, so this is issued via
   * the low-level request helper (same approach as the dashboard/inbox/search endpoints).
   *
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise with the branch model configuration
   */
  async getBranchModel(projectKey: string, repositorySlug: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.request({
        url: route`/branch-utils/1.0/projects/${projectKey}/repos/${repositorySlug}/branchmodel/configuration`,
        method: 'GET',
      }),
      'Error fetching branch model configuration',
    );
  }

  /**
   * Set (replace) the branch model configuration for a repository.
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param development Development branch config: { refId, useDefault? }
   * @param production Optional production branch config: { refId, useDefault? }
   * @param types Optional branch type config: [{ id (BUGFIX/FEATURE/HOTFIX/RELEASE), prefix?, enabled? }]
   * @returns Promise with the updated branch model configuration
   */
  async setBranchModel(
    projectKey: string,
    repositorySlug: string,
    development: { refId: string; useDefault?: boolean },
    production?: { refId: string; useDefault?: boolean },
    types?: Array<{ id: string; prefix?: string; enabled?: boolean }>,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const body: Record<string, any> = {
      development,
      ...(production ? { production } : {}),
      ...(types ? { types } : {}),
    };

    return handleApiOperation(
      () => this.bb.request({
        url: route`/branch-utils/1.0/projects/${projectKey}/repos/${repositorySlug}/branchmodel/configuration`,
        method: 'PUT',
        body: body,
        contentType: 'application/json',
      }),
      'Error setting branch model configuration',
    );
  }

  /**
   * Delete (reset to default) the branch model configuration for a repository.
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise with a reset acknowledgement
   */
  async deleteBranchModel(projectKey: string, repositorySlug: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.request({
        url: route`/branch-utils/1.0/projects/${projectKey}/repos/${repositorySlug}/branchmodel/configuration`,
        method: 'DELETE',
      }),
      'Error deleting branch model configuration',
    );
    if (result.success) {
      return { ...result, data: { reset: true, projectKey, repositorySlug } };
    }

    return result;
  }

  /**
   * Delete a required-builds merge check by ID
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param id The ID of the merge check to delete
   * @returns Promise with a delete acknowledgement
   */
  async deleteRequiredBuildsMergeCheck(projectKey: string, repositorySlug: string, id: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.builds.deleteRequiredBuildsMergeCheck({ projectKey: projectKey, id: Number(id), repositorySlug: repositorySlug }),
      'Error deleting required builds merge check',
    );

    return { ...result, data: { deleted: true, id } };
  }

  /**
   * Delete a default reviewer condition
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param id The ID of the condition to delete
   * @returns Promise with a delete acknowledgement
   */
  async deleteDefaultReviewerCondition(projectKey: string, repositorySlug: string, id: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.pullRequests.deletePullRequestCondition({ projectKey: projectKey, id: Number(id), repositorySlug: repositorySlug }),
      'Error deleting default reviewer condition',
    );

    return { ...result, data: { deleted: true, id } };
  }

  /**
   * Search code across Bitbucket using the search REST module.
   *
   * The query string supports Bitbucket search modifiers, e.g. `project:TEST`,
   * `repo:projectkey/repositoryslug` (e.g. `repo:TEST/demo`), `ext:js`, so scoping to a
   * project or repository is done inside the query text. Note: `repo:` must include the
   * project key (`repo:KEY/slug`); a bare `repo:slug` is rejected by the server.
   *
   * Note: the `/rest/search` endpoint is a separate Bitbucket REST module that is not part of
   * the generated client, so this is issued via the low-level request helper (same approach as
   * the dashboard/inbox endpoints).
   *
   * @param query The search query (may include modifiers like `repo:`, `project:`, `ext:`)
   * @param limit Optional primary result limit (defaults to the package page size)
   * @param secondaryLimit Optional secondary limit (number of hit contexts per match)
   * @returns Promise with the code search results
   */
  async searchCode(query: string, limit?: number, secondaryLimit?: number) {
    return handleApiOperation(
      () => this.bb.request({
        url: '/search/latest/search',
        method: 'POST',
        body: {
          query,
          entities: { code: {} },
          limits: {
            primary: limit ?? this.getPageSize(),
            ...(secondaryLimit !== undefined ? { secondary: secondaryLimit } : {}),
          },
        },
        contentType: 'application/json',
      }),
      'Error searching code',
    );
  }

  private buildDefaultReviewerBody(
    sourceMatcherType: string,
    sourceMatcherValue: string,
    targetMatcherType: string,
    targetMatcherValue: string,
    reviewerIds: number[],
    requiredApprovals?: number,
    sourceMatcherDisplayId?: string,
    targetMatcherDisplayId?: string,
  ): any {
    return {
      reviewers: reviewerIds.map(id => ({ id })),
      sourceMatcher: {
        id: sourceMatcherValue,
        displayId: sourceMatcherDisplayId ?? sourceMatcherValue,
        type: { id: sourceMatcherType },
      },
      targetMatcher: {
        id: targetMatcherValue,
        displayId: targetMatcherDisplayId ?? targetMatcherValue,
        type: { id: targetMatcherType },
      },
      ...(requiredApprovals !== undefined ? { requiredApprovals } : {}),
    };
  }

  private buildRequiredBuildsBody(
    buildParentKeys: string[],
    refMatcherType: string,
    refMatcherValue: string,
    refMatcherDisplayId?: string,
    exemptRefMatcherType?: string,
    exemptRefMatcherValue?: string,
    exemptRefMatcherDisplayId?: string,
  ): any {
    return {
      buildParentKeys,
      refMatcher: {
        id: refMatcherValue,
        displayId: refMatcherDisplayId ?? refMatcherValue,
        type: { id: refMatcherType },
      },
      ...(exemptRefMatcherType && exemptRefMatcherValue
        ? {
          exemptRefMatcher: {
            id: exemptRefMatcherValue,
            displayId: exemptRefMatcherDisplayId ?? exemptRefMatcherValue,
            type: { id: exemptRefMatcherType },
          },
        }
        : {}),
    };
  }

  /**
   * Delete a pull request comment
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param commentId The ID of the comment to delete
   * @param version The current version of the comment (optimistic locking)
   * @returns Promise with a delete acknowledgement
   */
  async deletePullRequestComment(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    commentId: string,
    version: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.pullRequests.deleteComment({ projectKey: projectKey, commentId: commentId, pullRequestId: pullRequestId, repositorySlug: repositorySlug, version: String(version) }),
      'Error deleting pull request comment',
    );

    return { ...result, data: { deleted: true, commentId } };
  }

  /**
   * Apply a code suggestion contained in a pull request comment to the source branch
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param commentId The ID of the comment that contains the suggestion
   * @param commentVersion The current version of the comment
   * @param pullRequestVersion The current version of the pull request
   * @param commitMessage Commit message for the commit that applies the suggestion (required by the server)
   * @param suggestionIndex Optional index of the suggestion within the comment (defaults to the first)
   * @returns Promise with an apply acknowledgement
   */
  async applyPullRequestSuggestion(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    commentId: string,
    commentVersion: number,
    pullRequestVersion: number,
    commitMessage: string,
    suggestionIndex?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    // The apply-suggestion endpoint reads the commit message from `message` (not `commitMessage`
    // as the generated model suggests) and rejects an empty value.
    const requestBody: any = {
      commentVersion,
      pullRequestVersion,
      message: commitMessage,
      ...(suggestionIndex !== undefined ? { suggestionIndex } : {}),
    };
    const result = await handleApiOperation(
      () => this.bb.pullRequests.applySuggestion({ projectKey: projectKey, commentId: commentId, pullRequestId: pullRequestId, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error applying pull request suggestion',
    );

    return { ...result, data: { applied: true, commentId } };
  }

  /**
   * Start watching a pull request (subscribe the authenticated user to notifications)
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @returns Promise with a watch acknowledgement
   */
  async watchPullRequest(projectKey: string, repositorySlug: string, pullRequestId: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.pullRequests.watch({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug }),
      'Error watching pull request',
    );

    return { ...result, data: { watching: true, pullRequestId } };
  }

  /**
   * Stop watching a pull request (unsubscribe the authenticated user)
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @returns Promise with an unwatch acknowledgement
   */
  async unwatchPullRequest(projectKey: string, repositorySlug: string, pullRequestId: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.pullRequests.unwatch({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug }),
      'Error unwatching pull request',
    );

    return { ...result, data: { watching: false, pullRequestId } };
  }

  /**
   * Add a reviewer to a pull request
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param userSlug The username/name of the user to add as a reviewer
   * @returns Promise with the participant details
   */
  async addPullRequestReviewer(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    userSlug: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody: any = { user: { name: userSlug }, role: 'REVIEWER' };

    return handleApiOperation(
      () => this.bb.pullRequests.assignParticipantRole({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error adding pull request reviewer',
    );
  }

  /**
   * Create a new project
   * @param key The project key
   * @param name The project name
   * @param description Optional project description
   * @returns Promise with the created project
   */
  async createProject(key: string, name: string, description?: string) {
    key = key.toUpperCase();
    const requestBody: any = {
      key,
      name,
      ...(description !== undefined ? { description } : {}),
    };

    return handleApiOperation(
      () => this.bb.projects.createProject({ ...(requestBody) }),
      'Error creating project',
    );
  }

  /**
   * Create a new repository in a project
   * @param projectKey The project key the repository will be created in
   * @param name The repository name
   * @param scmId The SCM type (defaults to 'git')
   * @param defaultBranch Optional default branch for the new repository
   * @returns Promise with the created repository
   */
  async createRepository(projectKey: string, name: string, scmId: string = 'git', defaultBranch?: string) {
    projectKey = projectKey.toUpperCase();
    const requestBody: any = {
      name,
      scmId,
      ...(defaultBranch ? { defaultBranch } : {}),
    };

    return handleApiOperation(
      () => this.bb.projects.createRepository({ projectKey: projectKey, ...(requestBody) }),
      'Error creating repository',
    );
  }

  /**
   * Remove a reviewer from a pull request
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param userSlug The username/name of the reviewer to remove
   * @returns Promise resolving to an acknowledgement
   */
  async removePullRequestReviewer(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    userSlug: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.pullRequests.unassignParticipantRole({ projectKey: projectKey, userSlug: userSlug, pullRequestId: pullRequestId, repositorySlug: repositorySlug }),
      'Error removing pull request reviewer',
    );
    if (result.success) {
      return { ...result, data: { removed: true, userSlug } };
    }

    return result;
  }

  /**
   * Get the participants of a pull request — everyone who has interacted with it (author, reviewers,
   * and anyone else who has commented or approved), as opposed to just the requested reviewers.
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param pullRequestId The pull request ID
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with the page of pull request participants
   */
  async getPullRequestParticipants(
    projectKey: string,
    repositorySlug: string,
    pullRequestId: string,
    start?: number,
    limit?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.pullRequests.listParticipants({ projectKey: projectKey, pullRequestId: pullRequestId, repositorySlug: repositorySlug, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching pull request participants',
    );
  }

  /**
   * Update an existing project (the project key is never changed)
   * @param key The project key
   * @param name Optional new project name
   * @param description Optional new description
   * @returns Promise with the updated project
   */
  async updateProject(key: string, name?: string, description?: string) {
    key = key.toUpperCase();
    const requestBody: any = {
      key,
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
    };

    return handleApiOperation(
      () => this.bb.projects.updateProject({ projectKey: key, ...(requestBody) }),
      'Error updating project',
    );
  }

  /**
   * Update an existing repository (rename, change description, default branch, or move project)
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param name Optional new repository name
   * @param description Optional new description
   * @param defaultBranch Optional new default branch
   * @param targetProjectKey Optional project key to move the repository into
   * @returns Promise with the updated repository
   */
  async updateRepository(
    projectKey: string,
    repositorySlug: string,
    name?: string,
    description?: string,
    defaultBranch?: string,
    targetProjectKey?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody: any = {
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(defaultBranch !== undefined ? { defaultBranch } : {}),
      ...(targetProjectKey ? { project: { key: targetProjectKey.toUpperCase() } } : {}),
    };

    return handleApiOperation(
      () => this.bb.projects.updateRepository({ projectKey: projectKey, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error updating repository',
    );
  }

  /**
   * Delete a project (must contain no repositories)
   * @param key The project key
   * @returns Promise with a deletion acknowledgement
   */
  async deleteProject(key: string) {
    key = key.toUpperCase();
    const result = await handleApiOperation(
      () => this.bb.projects.deleteProject({ projectKey: key }),
      'Error deleting project',
    );

    return { ...result, data: { deleted: true, key } };
  }

  /**
   * Fork an existing repository
   * @param projectKey The project key of the origin repository
   * @param repositorySlug The repository slug of the origin repository
   * @param name Optional name for the fork (defaults to the origin name)
   * @param targetProjectKey Optional target project key (defaults to the user's personal project)
   * @param defaultBranch Optional default branch for the fork
   * @returns Promise with the created fork
   */
  async forkRepository(
    projectKey: string,
    repositorySlug: string,
    name?: string,
    targetProjectKey?: string,
    defaultBranch?: string,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody: any = {
      ...(name ? { name } : {}),
      ...(targetProjectKey ? { project: { key: targetProjectKey.toUpperCase() } } : {}),
      ...(defaultBranch ? { defaultBranch } : {}),
    };

    return handleApiOperation(
      () => this.bb.projects.forkRepository({ projectKey: projectKey, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error forking repository',
    );
  }

  /**
   * Get the direct forks of a repository
   * @param projectKey The project key of the origin repository
   * @param repositorySlug The repository slug of the origin repository
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with the page of forked repositories
   */
  async getRepositoryForks(
    projectKey: string,
    repositorySlug: string,
    start?: number,
    limit?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.projects.getForkedRepositories({ projectKey: projectKey, repositorySlug: repositorySlug, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching repository forks',
    );
  }

  /**
   * Schedule a repository for deletion
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise with a deletion acknowledgement
   */
  async deleteRepository(projectKey: string, repositorySlug: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.projects.deleteRepository({ projectKey: projectKey, repositorySlug: repositorySlug }),
      'Error deleting repository',
    );

    return { ...result, data: { scheduledForDeletion: true, projectKey, repositorySlug } };
  }

  /**
   * Delete a webhook
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param webhookId The ID of the webhook to delete
   * @returns Promise with a delete acknowledgement
   */
  async deleteWebhook(projectKey: string, repositorySlug: string, webhookId: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.repositories.deleteWebhook({ projectKey: projectKey, webhookId: webhookId, repositorySlug: repositorySlug }),
      'Error deleting webhook',
    );

    return { ...result, data: { deleted: true, webhookId } };
  }

  /**
   * Get HTTP access tokens (PATs) for a user, project, or repository
   * @param scope The token scope: 'user' for personal access tokens, 'project' for project-scoped tokens, 'repo' for repository-scoped tokens
   * @param userSlug The user slug; required when scope is 'user'
   * @param projectKey The project key; required when scope is 'project' or 'repo'
   * @param repositorySlug The repository slug; required when scope is 'repo'
   * @param start Optional pagination start
   * @param limit Optional pagination limit (default: the package page size)
   * @returns Promise with a page of access tokens
   */
  async getAccessTokens(
    scope: AccessTokenScope,
    userSlug?: string,
    projectKey?: string,
    repositorySlug?: string,
    start?: number,
    limit?: number,
  ) {
    projectKey = projectKey?.toUpperCase();
    repositorySlug = repositorySlug?.toLowerCase();

    return handleApiOperation(
      () => {
        if (scope === 'user') {
          if (!userSlug) throw new Error('userSlug is required when scope is \'user\'');

          return this.bb.authentication.getUserAccessTokens({ userSlug: userSlug, start: start, limit: limit ?? this.getPageSize() });
        }
        if (scope === 'project') {
          if (!projectKey) throw new Error('projectKey is required when scope is \'project\'');

          return this.bb.authentication.getProjectAccessTokens({ projectKey: projectKey, start: start, limit: limit ?? this.getPageSize() });
        }
        if (!projectKey || !repositorySlug) throw new Error('projectKey and repositorySlug are required when scope is \'repo\'');

        return this.bb.authentication.getRepositoryAccessTokens({ projectKey: projectKey, repositorySlug: repositorySlug, start: start, limit: limit ?? this.getPageSize() });
      },
      'Error fetching access tokens',
    );
  }

  /**
   * Update the default branch of a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param branchId The full ref ID of the branch to set as default (e.g. 'refs/heads/main')
   * @returns Promise with an update acknowledgement
   */
  async setDefaultBranch(projectKey: string, repositorySlug: string, branchId: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.projects.setDefaultBranch({ projectKey: projectKey, repositorySlug: repositorySlug, id: branchId }),
      'Error setting default branch',
    );

    return { ...result, data: { updated: true, projectKey, repositorySlug, branchId } };
  }

  /**
   * Get the pull request settings for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise with the pull request settings
   */
  async getPullRequestSettings(projectKey: string, repositorySlug: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getPullRequestSettings({ projectKey: projectKey, repositorySlug: repositorySlug }),
      'Error fetching pull request settings',
    );
  }

  /**
   * Update the pull request settings for a repository. Only the provided keys are changed.
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param settings The settings to update (e.g. mergeConfig, requiredApprovers, requiredAllApprovers, requiredAllTasksComplete, requiredSuccessfulBuilds)
   * @returns Promise with the updated pull request settings
   */
  async updatePullRequestSettings(projectKey: string, repositorySlug: string, settings: Record<string, any>) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.updatePullRequestSettings({ projectKey: projectKey, repositorySlug: repositorySlug, ...(settings) }),
      'Error updating pull request settings',
    );
  }

  /**
   * Get the auto-decline settings for a repository (automatically decline inactive pull requests)
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise with the auto-decline settings
   */
  async getAutoDeclineSettings(projectKey: string, repositorySlug: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getAutoDeclineSettings({ projectKey: projectKey, repositorySlug: repositorySlug }),
      'Error fetching auto-decline settings',
    );
  }

  /**
   * Create or update the auto-decline settings for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param enabled Whether auto-decline is enabled
   * @param inactivityWeeks Optional number of inactivity weeks before decline (must be one of 1, 2, 4, 8, or 12)
   * @returns Promise with the updated auto-decline settings
   */
  async setAutoDeclineSettings(
    projectKey: string,
    repositorySlug: string,
    enabled: boolean,
    inactivityWeeks?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const requestBody: any = {
      enabled,
      ...(inactivityWeeks !== undefined ? { inactivityWeeks } : {}),
    };

    return handleApiOperation(
      () => this.bb.repositories.setAutoDeclineSettings({ projectKey: projectKey, repositorySlug: repositorySlug, ...(requestBody) }),
      'Error updating auto-decline settings',
    );
  }

  /**
   * Delete the auto-decline settings for a repository, reverting to the project/default settings
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise resolving to an acknowledgement
   */
  async deleteAutoDeclineSettings(projectKey: string, repositorySlug: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.repositories.deleteAutoDeclineSettings({ projectKey: projectKey, repositorySlug: repositorySlug }),
      'Error deleting auto-decline settings',
    );
    if (result.success) {
      return { ...result, data: { deleted: true, projectKey, repositorySlug } };
    }

    return result;
  }

  /**
   * Get the pull request auto-merge settings for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise with the auto-merge settings
   */
  async getAutoMergeSettings(projectKey: string, repositorySlug: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getAutoMergeSettings({ projectKey: projectKey, repositorySlug: repositorySlug }),
      'Error fetching auto-merge settings',
    );
  }

  /**
   * Create or update the pull request auto-merge settings for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param enabled Whether pull request auto-merge is enabled
   * @returns Promise with the updated auto-merge settings
   */
  async setAutoMergeSettings(projectKey: string, repositorySlug: string, enabled: boolean) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.setAutoMergeSettings({ projectKey: projectKey, repositorySlug: repositorySlug, enabled }),
      'Error updating auto-merge settings',
    );
  }

  /**
   * Delete the pull request auto-merge settings for a repository, reverting to the project/default settings
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise resolving to an acknowledgement
   */
  async deleteAutoMergeSettings(projectKey: string, repositorySlug: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.repositories.deleteAutoMergeSettings({ projectKey: projectKey, repositorySlug: repositorySlug }),
      'Error deleting auto-merge settings',
    );
    if (result.success) {
      return { ...result, data: { deleted: true, projectKey, repositorySlug } };
    }

    return result;
  }

  /**
   * Get the repository hooks configured for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param type Optional hook type to filter by (PRE_RECEIVE or POST_RECEIVE)
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with the page of repository hooks
   */
  async getRepoHooks(
    projectKey: string,
    repositorySlug: string,
    type?: 'PRE_RECEIVE' | 'POST_RECEIVE',
    start?: number,
    limit?: number,
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getRepositoryHooks({ projectKey: projectKey, repositorySlug: repositorySlug, type: type, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching repository hooks',
    );
  }

  /**
   * Create an HTTP access token (PAT) for a user, project, or repository
   * @param scope The token scope: 'user' for personal access tokens, 'project' for project-scoped tokens, 'repo' for repository-scoped tokens
   * @param name The name of the new access token
   * @param permissions The permissions to grant the token (e.g. ['REPO_READ', 'REPO_WRITE'] for repo scope, ['PROJECT_ADMIN'] for project scope)
   * @param expiryDays Optional number of days until the token expires
   * @param userSlug The user slug; required when scope is 'user'
   * @param projectKey The project key; required when scope is 'project' or 'repo'
   * @param repositorySlug The repository slug; required when scope is 'repo'
   * @returns Promise with the created token, including its raw (secret) value — shown only once
   */
  async createAccessToken(
    scope: AccessTokenScope,
    name: string,
    permissions: string[],
    expiryDays?: number,
    userSlug?: string,
    projectKey?: string,
    repositorySlug?: string,
  ) {
    projectKey = projectKey?.toUpperCase();
    repositorySlug = repositorySlug?.toLowerCase();
    const requestBody: AccessTokenRequest = {
      name,
      permissions,
      ...(expiryDays !== undefined ? { expiryDays } : {}),
    };

    return handleApiOperation(
      () => {
        if (scope === 'user') {
          if (!userSlug) throw new Error('userSlug is required when scope is \'user\'');

          return this.bb.authentication.createUserAccessToken({ userSlug: userSlug, ...(requestBody) });
        }
        if (scope === 'project') {
          if (!projectKey) throw new Error('projectKey is required when scope is \'project\'');

          return this.bb.authentication.createProjectAccessToken({ projectKey: projectKey, ...(requestBody) });
        }
        if (!projectKey || !repositorySlug) throw new Error('projectKey and repositorySlug are required when scope is \'repo\'');

        return this.bb.authentication.createRepositoryAccessToken({ projectKey: projectKey, repositorySlug: repositorySlug, ...(requestBody) });
      },
      'Error creating access token',
    );
  }

  /**
   * Enable a repository hook
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param hookKey The hook key (e.g. 'com.atlassian.bitbucket.server.bundled-hooks:requiredApproversMergeHook')
   * @returns Promise with the enabled hook
   */
  async enableRepoHook(projectKey: string, repositorySlug: string, hookKey: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.enableHook({ projectKey: projectKey, hookKey: hookKey, repositorySlug: repositorySlug }),
      'Error enabling repository hook',
    );
  }

  /**
   * Delete an HTTP access token (PAT) from a user, project, or repository
   * @param scope The token scope: 'user' for personal access tokens, 'project' for project-scoped tokens, 'repo' for repository-scoped tokens
   * @param tokenId The ID of the token to delete
   * @param userSlug The user slug; required when scope is 'user'
   * @param projectKey The project key; required when scope is 'project' or 'repo'
   * @param repositorySlug The repository slug; required when scope is 'repo'
   * @returns Promise with a delete acknowledgement
   */
  async deleteAccessToken(
    scope: AccessTokenScope,
    tokenId: string,
    userSlug?: string,
    projectKey?: string,
    repositorySlug?: string,
  ) {
    projectKey = projectKey?.toUpperCase();
    repositorySlug = repositorySlug?.toLowerCase();
    const result = await handleApiOperation(
      () => {
        if (scope === 'user') {
          if (!userSlug) throw new Error('userSlug is required when scope is \'user\'');

          return this.bb.authentication.deleteUserAccessToken({ tokenId: tokenId, userSlug: userSlug });
        }
        if (scope === 'project') {
          if (!projectKey) throw new Error('projectKey is required when scope is \'project\'');

          return this.bb.authentication.deleteProjectAccessToken({ projectKey: projectKey, tokenId: tokenId });
        }
        if (!projectKey || !repositorySlug) throw new Error('projectKey and repositorySlug are required when scope is \'repo\'');

        return this.bb.authentication.deleteRepositoryAccessToken({ projectKey: projectKey, tokenId: tokenId, repositorySlug: repositorySlug });
      },
      'Error deleting access token',
    );
    if (result.success) {
      return { ...result, data: { deleted: true, tokenId } };
    }

    return result;
  }

  /**
   * Disable a repository hook
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param hookKey The hook key
   * @returns Promise with the disabled hook
   */
  async disableRepoHook(projectKey: string, repositorySlug: string, hookKey: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.disableHook({ projectKey: projectKey, hookKey: hookKey, repositorySlug: repositorySlug }),
      'Error disabling repository hook',
    );
  }

  /**
   * Get the settings for a repository hook
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param hookKey The hook key
   * @returns Promise with the hook settings
   */
  async getRepoHookSettings(projectKey: string, repositorySlug: string, hookKey: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.getSettings({ projectKey: projectKey, hookKey: hookKey, repositorySlug: repositorySlug }),
      'Error fetching repository hook settings',
    );
  }

  /**
   * Update the settings for a repository hook
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param hookKey The hook key
   * @param settings The raw settings document for the hook (structure is decided by the hook's plugin)
   * @returns Promise with the updated hook settings
   */
  async setRepoHookSettings(projectKey: string, repositorySlug: string, hookKey: string, settings: Record<string, any>) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();

    return handleApiOperation(
      () => this.bb.repositories.setSettings({ projectKey: projectKey, hookKey: hookKey, repositorySlug: repositorySlug, ...(settings) }),
      'Error updating repository hook settings',
    );
  }

  private buildWebhookBody(
    name: string,
    url: string,
    events: string[],
    active?: boolean,
    secret?: string,
    sslVerificationRequired?: boolean,
  ): any {
    return {
      name,
      url,
      events,
      ...(active !== undefined ? { active } : {}),
      ...(secret ? { configuration: { secret } } : {}),
      ...(sslVerificationRequired !== undefined ? { sslVerificationRequired } : {}),
    };
  }

  /**
   * Get the users and groups with a permission on a project
   * @param projectKey The project key
   * @param filter Optional filter applied to both user and group names
   * @param start Optional pagination start
   * @param limit Optional pagination limit (default: 25)
   * @returns Promise with { users, groups } pages of permitted principals
   */
  async getProjectPermissions(projectKey: string, filter?: string, start?: number, limit?: number) {
    projectKey = projectKey.toUpperCase();
    const pageLimit = limit ?? this.getPageSize();

    return handleApiOperation(
      async () => {
        const [users, groups] = await Promise.all([
          this.bb.projects.getUsersWithAnyPermission({ projectKey: projectKey, filter: filter, start: start, limit: pageLimit }),
          this.bb.projects.getGroupsWithAnyPermission({ projectKey: projectKey, filter: filter, start: start, limit: pageLimit }),
        ]);

        return { users, groups };
      },
      'Error fetching project permissions',
    );
  }

  /**
   * Grant or change a user's permission level on a project
   * @param projectKey The project key
   * @param name The username to grant the permission to
   * @param permission The permission to grant: PROJECT_READ, PROJECT_WRITE, or PROJECT_ADMIN
   * @returns Promise with an acknowledgement
   */
  async setProjectUserPermission(
    projectKey: string,
    name: string,
    permission: 'PROJECT_READ' | 'PROJECT_WRITE' | 'PROJECT_ADMIN',
  ) {
    projectKey = projectKey.toUpperCase();
    const result = await handleApiOperation(
      () => this.bb.projects.setPermissionForUsers({ projectKey: projectKey, name: name, permission: permission }),
      'Error setting project user permission',
    );
    if (result.success) {
      return { ...result, data: { projectKey, name, permission } };
    }

    return result;
  }

  /**
   * Grant or change a group's permission level on a project
   * @param projectKey The project key
   * @param name The group name to grant the permission to
   * @param permission The permission to grant: PROJECT_READ, PROJECT_WRITE, or PROJECT_ADMIN
   * @returns Promise with an acknowledgement
   */
  async setProjectGroupPermission(
    projectKey: string,
    name: string,
    permission: 'PROJECT_READ' | 'PROJECT_WRITE' | 'PROJECT_ADMIN',
  ) {
    projectKey = projectKey.toUpperCase();
    const result = await handleApiOperation(
      () => this.bb.projects.setPermissionForGroups({ projectKey: projectKey, name: name, permission: permission }),
      'Error setting project group permission',
    );
    if (result.success) {
      return { ...result, data: { projectKey, name, permission } };
    }

    return result;
  }

  /**
   * Revoke a user's and/or a group's permissions on a project
   * @param projectKey The project key
   * @param user Optional username whose project permissions should be revoked
   * @param group Optional group name whose project permissions should be revoked
   * @returns Promise with an acknowledgement
   */
  async revokeProjectPermission(projectKey: string, user?: string, group?: string) {
    projectKey = projectKey.toUpperCase();
    const result = await handleApiOperation(
      () => this.bb.projects.revokePermissions({ projectKey: projectKey, user: user, group: group }),
      'Error revoking project permission',
    );
    if (result.success) {
      return { ...result, data: { revoked: true, projectKey, user, group } };
    }

    return result;
  }

  /**
   * Get the users and groups with a permission on a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param filter Optional filter applied to both user and group names
   * @param start Optional pagination start
   * @param limit Optional pagination limit (default: 25)
   * @returns Promise with { users, groups } pages of permitted principals
   */
  async getRepoPermissions(projectKey: string, repositorySlug: string, filter?: string, start?: number, limit?: number) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const pageLimit = limit ?? this.getPageSize();

    return handleApiOperation(
      async () => {
        const [users, groups] = await Promise.all([
          this.bb.permissions.getUsersWithAnyPermission({ projectKey: projectKey, repositorySlug: repositorySlug, filter: filter, start: start, limit: pageLimit }),
          this.bb.permissions.getGroupsWithAnyPermission({ projectKey: projectKey, repositorySlug: repositorySlug, filter: filter, start: start, limit: pageLimit }),
        ]);

        return { users, groups };
      },
      'Error fetching repository permissions',
    );
  }

  /**
   * Grant or change a user's permission level on a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param name The username to grant the permission to
   * @param permission The permission to grant: REPO_READ, REPO_WRITE, or REPO_ADMIN
   * @returns Promise with an acknowledgement
   */
  async setRepoUserPermission(
    projectKey: string,
    repositorySlug: string,
    name: string,
    permission: 'REPO_READ' | 'REPO_WRITE' | 'REPO_ADMIN',
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.permissions.setPermissionForUser({ projectKey: projectKey, name: [name], permission: permission, repositorySlug: repositorySlug }),
      'Error setting repository user permission',
    );
    if (result.success) {
      return { ...result, data: { projectKey, repositorySlug, name, permission } };
    }

    return result;
  }

  /**
   * Grant or change a group's permission level on a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param name The group name to grant the permission to
   * @param permission The permission to grant: REPO_READ, REPO_WRITE, or REPO_ADMIN
   * @returns Promise with an acknowledgement
   */
  async setRepoGroupPermission(
    projectKey: string,
    repositorySlug: string,
    name: string,
    permission: 'REPO_READ' | 'REPO_WRITE' | 'REPO_ADMIN',
  ) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.permissions.setPermissionForGroup({ projectKey: projectKey, name: [name], permission: permission, repositorySlug: repositorySlug }),
      'Error setting repository group permission',
    );
    if (result.success) {
      return { ...result, data: { projectKey, repositorySlug, name, permission } };
    }

    return result;
  }

  /**
   * Revoke a user's and/or a group's permissions on a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param user Optional username whose repository permissions should be revoked
   * @param group Optional group name whose repository permissions should be revoked
   * @returns Promise with an acknowledgement
   */
  async revokeRepoPermission(projectKey: string, repositorySlug: string, user?: string, group?: string) {
    projectKey = projectKey.toUpperCase();
    repositorySlug = repositorySlug.toLowerCase();
    const result = await handleApiOperation(
      () => this.bb.permissions.revokePermissions({ projectKey: projectKey, repositorySlug: repositorySlug, user: user, group: group }),
      'Error revoking repository permission',
    );
    if (result.success) {
      return { ...result, data: { revoked: true, projectKey, repositorySlug, user, group } };
    }

    return result;
  }

  /**
   * Get SSH keys for a user
   * @param userName Optional username to retrieve keys for. Defaults to the currently authenticated user; retrieving another user's keys requires ADMIN permission.
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with the page of SSH keys
   */
  async getSshKeys(userName?: string, start?: number, limit?: number) {
    return handleApiOperation(
      () => this.bb.authentication.getSshKeys({ userName: userName, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching SSH keys',
    );
  }

  /**
   * Add an SSH key for a user
   * @param text The public key text (e.g. 'ssh-rsa AAAA... comment')
   * @param userName Optional username to add the key for. Defaults to the currently authenticated user; adding for another user requires ADMIN permission.
   * @returns Promise with the created SSH key
   */
  async addSshKey(text: string, userName?: string) {
    return handleApiOperation(
      () => this.bb.authentication.addSshKey({ user: userName, text }),
      'Error adding SSH key',
    );
  }

  /**
   * Delete an SSH key by ID
   * @param keyId The ID of the SSH key to delete
   * @returns Promise with a delete acknowledgement
   */
  async deleteSshKey(keyId: string) {
    const result = await handleApiOperation(
      () => this.bb.authentication.deleteSshKey({ keyId: keyId }),
      'Error deleting SSH key',
    );

    return { ...result, data: { deleted: true, keyId } };
  }

  /**
   * Get GPG keys for a user
   * @param user Optional username to retrieve keys for. Defaults to the currently authenticated user; retrieving another user's keys requires ADMIN permission.
   * @param start Optional pagination start
   * @param limit Optional pagination limit (defaults to the package page size)
   * @returns Promise with the page of GPG keys
   */
  async getGpgKeys(user?: string, start?: number, limit?: number) {
    return handleApiOperation(
      () => this.bb.security.getKeysForUser({ user: user, start: start, limit: limit ?? this.getPageSize() }),
      'Error fetching GPG keys',
    );
  }

  /**
   * Add a GPG key for a user
   * @param text The ASCII-armored GPG public key text
   * @param user Optional username to add the key for. Defaults to the currently authenticated user; adding for another user requires ADMIN permission.
   * @returns Promise with the created GPG key
   */
  async addGpgKey(text: string, user?: string) {
    const requestBody: any = { text };

    return handleApiOperation(
      () => this.bb.security.addKey({ user: user, ...(requestBody) }),
      'Error adding GPG key',
    );
  }

  /**
   * Delete a GPG key by ID or fingerprint
   * @param fingerprintOrId The GPG key ID or fingerprint to delete
   * @returns Promise with a delete acknowledgement
   */
  async deleteGpgKey(fingerprintOrId: string) {
    const result = await handleApiOperation(
      () => this.bb.security.deleteKey({ fingerprintOrId: fingerprintOrId }),
      'Error deleting GPG key',
    );

    return { ...result, data: { deleted: true, fingerprintOrId } };
  }

  async validateSetup(): Promise<void> {
    await this.bb.request({
      url: '/api/latest/dashboard/pull-requests',
      method: 'GET',
      searchParams: { limit: 1 },
    });
  }

  static validateConfig(): string[] {
    return getMissingConfig();
  }
}

export const bitbucketToolSchemas = {
  getProjects: {
    name: z.string().optional().describe('Filter projects by name'),
    permission: z.string().optional().describe('Filter projects by permission'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  getPullRequests: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    withAttributes: z.string().optional().describe('(optional) defaults to true, whether to return additional pull request attributes'),
    at: z.string().optional().describe('(optional) a fully-qualified branch ID to find pull requests to or from, such as refs/heads/master'),
    withProperties: z.string().optional().describe('(optional) defaults to true, whether to return additional pull request properties'),
    draft: z.string().optional().describe('(optional) If specified, only pull requests matching the supplied draft status will be returned'),
    filterText: z.string().optional().describe('(optional) If specified, only pull requests where the title or description contains the supplied string will be returned'),
    state: z.string().optional().describe('(optional, defaults to OPEN). Supply ALL to return pull request in any state. If a state is supplied only pull requests in the specified state will be returned. Either OPEN, DECLINED or MERGED'),
    order: z.string().optional().describe('(optional, defaults to NEWEST) the order to return pull requests in, either OLDEST (as in: "oldest first") or NEWEST'),
    direction: z.string().optional().describe('(optional, defaults to INCOMING) the direction relative to the specified repository. Either INCOMING or OUTGOING'),
    start: z.number().optional().describe('Start number for the page (inclusive). If not passed, first page is assumed'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  getPullRequest: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The ID of the pull request within the repository'),
  },
  getProject: {
    projectKey: z.string().describe('The project key'),
  },
  getRepositories: {
    projectKey: z.string().describe('The project key'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  getRepository: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
  },
  createBranch: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    name: z.string().describe('The name of the new branch (e.g. \'feature/login\')'),
    startPoint: z.string().describe('The commit hash or ref to branch from (e.g. \'refs/heads/master\' or a commit id)'),
  },
  deleteBranch: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    name: z.string().describe('The branch to delete, as a full ref (e.g. \'refs/heads/feature/login\') or branch name'),
    dryRun: z.boolean().optional().describe('If true, validate the deletion without actually removing the branch'),
  },
  getBranches: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    filterText: z.string().optional().describe('Optional text that the returned branch names must contain (substring match)'),
    orderBy: z.enum(['ALPHABETICAL', 'MODIFICATION']).optional().describe('Ordering of the results: ALPHABETICAL by branch name, or MODIFICATION (most recently modified first)'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  getDefaultBranch: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
  },
  editFile: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    path: z.string().describe('The path of the file to create or modify (e.g. \'src/index.ts\')'),
    content: z.string().describe('The full new content of the file'),
    message: z.string().describe('The commit message'),
    branch: z.string().describe('The branch to commit on (e.g. \'master\' or \'refs/heads/master\')'),
    sourceCommitId: z.string().optional().describe('The commit id the file was last seen at. Required when editing an existing file (conflict detection); omit when creating a new file.'),
    sourceBranch: z.string().optional().describe('When set, the target branch is created from this starting branch before committing.'),
  },
  getTags: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    filterText: z.string().optional().describe('Optional text that the returned tag names must contain'),
    orderBy: z.enum(['ALPHABETICAL', 'MODIFICATION']).optional().describe('Ordering of the results: ALPHABETICAL or MODIFICATION (most recently modified first)'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  getTag: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    name: z.string().describe('The tag name (e.g. \'release-1.0.0\')'),
  },
  createTag: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    name: z.string().describe('The name of the new tag'),
    startPoint: z.string().describe('The commit hash or ref the tag should point at (e.g. \'refs/heads/master\' or a commit id)'),
    message: z.string().optional().describe('Optional message; when provided, an annotated tag is created'),
  },
  getCommits: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    path: z.string().optional().describe('Optional path to filter commits by'),
    since: z.string().optional().describe('The commit ID (exclusively) to retrieve commits after'),
    until: z.string().optional().describe('The commit ID (inclusively) to retrieve commits before'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  listBuildStatuses: {
    commitId: z.string().describe('The commit id (hash) whose build statuses to list. Note: build statuses are keyed by commit id globally, independent of project/repository.'),
    orderBy: z.string().optional().describe('Optional ordering of the results'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  addBuildStatus: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash) to attach the build status to'),
    state: z.enum(['SUCCESSFUL', 'FAILED', 'INPROGRESS']).describe('The build state'),
    key: z.string().describe('A unique key identifying the build (e.g. the pipeline or plan key)'),
    url: z.string().describe('The URL to the build result'),
    name: z.string().optional().describe('Optional display name for the build'),
    description: z.string().optional().describe('Optional description for the build'),
  },
  getBuildStatus: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash)'),
    key: z.string().describe('The unique key of the build status to fetch'),
  },
  setInsightReport: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash) the report is attached to'),
    key: z.string().describe('A unique, namespaced key identifying the report (e.g. \'mycompany.eslint\')'),
    report: z.object({
      title: z.string().describe('The report title'),
      details: z.string().optional().describe('Detailed description'),
      result: z.enum(['PASS', 'FAIL']).optional().describe('Overall report result'),
      reporter: z.string().optional().describe('Name of the tool/reporter that produced the report'),
      link: z.string().optional().describe('URL linking to the full report'),
      logoUrl: z.string().optional().describe('URL of a logo to display'),
      data: z.array(z.any()).optional().describe('Array of report data items ({ title, type, value })'),
    }).passthrough().describe('The Code Insights report payload'),
  },
  getInsightReport: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash)'),
    key: z.string().describe('The report key'),
  },
  deleteInsightReport: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash)'),
    key: z.string().describe('The report key'),
  },
  addInsightAnnotations: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash)'),
    key: z.string().describe('The report key the annotations belong to'),
    annotations: z.array(z.object({
      externalId: z.string().describe('Unique id of the annotation within the report'),
      path: z.string().describe('File path the annotation refers to'),
      line: z.number().describe('Line number the annotation refers to'),
      message: z.string().describe('The annotation message'),
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Annotation severity'),
      link: z.string().optional().describe('URL with more detail'),
      type: z.enum(['VULNERABILITY', 'CODE_SMELL', 'BUG']).optional().describe('Annotation type'),
    }).passthrough()).describe('Array of annotations to add to the report'),
  },
  getInsightAnnotations: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash)'),
    key: z.string().describe('The report key'),
  },
  deleteInsightAnnotations: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash)'),
    key: z.string().describe('The report key'),
    externalId: z.string().optional().describe('If given, delete only this annotation; otherwise delete all annotations of the report'),
  },
  getCommitComments: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash)'),
    path: z.string().describe('The file path to return comments for. Required: Bitbucket only returns commit comments scoped to a file path.'),
    since: z.string().optional().describe('Optional commit id; return comments added since that commit'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  addCommitComment: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash) to comment on'),
    text: z.string().describe('The comment text'),
    path: z.string().optional().describe('Optional file path to anchor the comment to a file'),
    line: z.number().optional().describe('Optional line number within the file to anchor the comment to (requires path)'),
    lineType: z.enum(['ADDED', 'REMOVED', 'CONTEXT']).optional().describe('Line type for the anchored line. Defaults to CONTEXT when a line is given.'),
  },
  getCommit: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash) to retrieve'),
    path: z.string().optional().describe('Optional path; the commit is only returned if it affects this path'),
  },
  getCommitDiff: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    commitId: z.string().describe('The commit id (hash)'),
    path: z.string().optional().describe('Optional file path to limit the diff to. Omit for the whole-commit diff.'),
    contextLines: z.string().optional().describe('Number of context lines to include around changes'),
    whitespace: z.string().optional().describe('Optional whitespace flag which can be set to \'ignore-all\''),
    srcPath: z.string().optional().describe('The previous path to the file, if it has been copied, moved or renamed'),
  },
  compareRefs: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    from: z.string().describe('The source ref or commit to compare from (e.g. \'refs/heads/feature\' or a commit hash)'),
    to: z.string().describe('The target ref or commit to compare to (e.g. \'refs/heads/master\')'),
    fromRepo: z.string().optional().describe('Optional \'projectKey/repositorySlug\' the \'from\' ref lives in, for cross-repository comparisons'),
    compareType: z.enum(['commits', 'changes']).optional().describe('\'commits\' (default) lists the commits between the refs; \'changes\' lists the changed files'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  getFileContent: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    path: z.string().describe('The path of the file to retrieve (e.g. \'src/index.ts\')'),
    at: z.string().optional().describe('Optional commit hash or ref to read the file at (e.g. \'refs/heads/main\' or a commit id). Defaults to the repository\'s default branch.'),
  },
  browseRepository: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    path: z.string().optional().describe('Path to browse. Omit or pass an empty string to list the repository root. A directory path returns its children; a file path returns the file content as paginated lines.'),
    at: z.string().optional().describe('Optional commit hash or ref to browse at. Defaults to the repository\'s default branch.'),
    type: z.boolean().optional().describe('If true, return only the node type (FILE, DIRECTORY, or SUBMODULE) of the path instead of its content.'),
    blame: z.boolean().optional().describe('If true, include blame information in the response.'),
  },
  getPullRequestComments: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
    output: z.enum(['summary', 'compact', 'full']).optional().describe('Choose between summary lines, compact structured output, or the full API payload. Defaults to compact.'),
    includeResolved: z.boolean().optional().describe('Include resolved comment threads and their replies. Defaults to false, so resolved threads are omitted.'),
  },
  getPullRequestChanges: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    sinceId: z.string().optional().describe('The since commit hash to stream changes for a RANGE arbitrary change scope'),
    changeScope: z.string().optional().describe('UNREVIEWED for unreviewed changes, RANGE for changes between commits, ALL for all changes (default)'),
    untilId: z.string().optional().describe('The until commit hash to stream changes for a RANGE arbitrary change scope'),
    withComments: z.string().optional().describe('true to apply comment counts in the changes (default), false to stream changes without comment counts'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
    output: z.enum(['summary', 'compact', 'full']).optional().describe('Choose between summary lines, compact structured output, or the full API payload. Defaults to compact.'),
  },
  postPullRequestComment: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    text: z.string().describe('The comment text'),
    parentId: z.number().optional().describe('Parent comment ID for replies'),
    filePath: z.string().optional().describe('File path for file-specific comments'),
    startLine: z.number().optional().describe('First line of a multiline range. Provide together with \'line\' (the last line) to span multiple lines. REQUIRED for a multi-line ```suggestion: the anchored range (startLine..line) is exactly what \'Apply suggestion\' replaces — omit it and only the single \'line\' is replaced, leaving the rest. Requires Bitbucket DC >= 9.3.0 for multiline suggestions.'),
    startLineType: z.enum(['ADDED', 'REMOVED', 'CONTEXT']).optional().describe('Line type for the start line of a multiline range. Defaults to the same value as lineType if omitted.'),
    line: z.number().optional().describe('Single-line comments: the line. Multiline: the LAST line of the range (use startLine for the first). For a ```suggestion this is the last replaced line.'),
    lineType: z.enum(['ADDED', 'REMOVED', 'CONTEXT']).optional().describe('Line type for \'line\' (the end line, or the only line for single-line comments). Use \'ADDED\'/\'CONTEXT\' for the new/target file, \'REMOVED\' for the original/source file.'),
    pending: z.boolean().optional().describe('If true, creates a pending (draft) comment not visible to others until the review is submitted via bitbucket_submitPullRequestReview. Only works when filePath is provided — top-level PR comments (no filePath) are always posted live.'),
    severity: z.enum(['NORMAL', 'BLOCKER']).optional().describe('Comment severity. Use \'BLOCKER\' to post the comment as a task that must be resolved before the PR can be merged. Defaults to \'NORMAL\' (regular comment).'),
    output: z.enum(['ack', 'full']).optional().describe('Return a compact acknowledgement or the full API response. Defaults to ack.'),
  },
  updatePullRequestComment: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    commentId: z.string().describe('The ID of the comment to update'),
    version: z.number().describe('The current version of the comment, required for optimistic locking. Get it from bitbucket_getPR_CommentsAndAction or from the response of the original post/update.'),
    text: z.string().optional().describe('New comment text. Omit to leave unchanged.'),
    state: z.enum(['OPEN', 'RESOLVED']).optional().describe('New state. \'RESOLVED\' resolves the comment thread — on a regular comment this is the \'Resolve\' button in the UI; on a BLOCKER (task) comment it also ticks the task. \'OPEN\' reopens the thread (un-ticks the task). Resolution is driven by the root comment\'s state.'),
    severity: z.enum(['NORMAL', 'BLOCKER']).optional().describe('New severity. Use \'BLOCKER\' to convert a comment into a task, \'NORMAL\' to convert it back.'),
    output: z.enum(['ack', 'full']).optional().describe('Return a compact acknowledgement or the full API response. Defaults to ack.'),
  },
  getUser: {
    userSlug: z.string().optional().describe('Exact slug of the user to look up (e.g. \'tdepole\'). Use this to confirm a known slug or fetch a user\'s details.'),
    filter: z.string().optional().describe('Search string to find users by name or email. Use this to discover a user\'s slug when it is not known.'),
  },
  submitPullRequestReview: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    userSlug: z.string().describe('The username/slug of the PAT token owner — the same user whose credentials are in BITBUCKET_API_TOKEN. Resolution order: (1) author.slug from any comment posted this session, (2) reviewers/participants array from getPullRequest, (3) bitbucket_getUser with a name/email filter.'),
    status: z.enum(['APPROVED', 'NEEDS_WORK', 'UNAPPROVED']).describe('The review verdict: APPROVED, NEEDS_WORK, or UNAPPROVED'),
    lastReviewedCommit: z.string().optional().describe('Optional hash of the last commit reviewed, used to track review progress'),
  },
  getPullRequestDiff: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    path: z.string().describe('The path to the file which should be diffed. Note: Before getting diff, use getPullRequestChanges to understand what files were changed in the PR'),
    contextLines: z.string().optional().describe('Number of context lines to include around added/removed lines in the diff'),
    sinceId: z.string().optional().describe('The since commit hash to stream a diff between two arbitrary hashes'),
    srcPath: z.string().optional().describe('The previous path to the file, if the file has been copied, moved or renamed'),
    diffType: z.string().optional().describe('The type of diff being requested'),
    untilId: z.string().optional().describe('The until commit hash to stream a diff between two arbitrary hashes'),
    whitespace: z.string().optional().describe('Optional whitespace flag which can be set to \'ignore-all\''),
  },
  createPullRequest: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    title: z.string().describe('The pull request title'),
    description: z.string().optional().describe('The pull request description'),
    fromRefId: z.string().describe('The source branch reference ID (e.g., \'refs/heads/feature-branch\')'),
    toRefId: z.string().describe('The destination branch reference ID (e.g., \'refs/heads/main\')'),
    draft: z.boolean().optional().describe('If true, the pull request is created as a draft (work-in-progress) and cannot be merged until marked ready.'),
    reviewers: z.array(z.string()).optional().describe('Optional array of reviewer usernames (use the \'name\' field from Bitbucket user objects, not \'slug\')'),
    output: z.enum(['ack', 'full']).optional().describe('Return a compact acknowledgement or the full API response. Defaults to ack.'),
  },
  updatePullRequest: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    version: z.number().describe('The current version of the pull request (required for optimistic locking). Obtain this by calling bitbucket_getPullRequest first.'),
    title: z.string().optional().describe('The new title for the pull request'),
    description: z.string().optional().describe('The new description for the pull request'),
    draft: z.boolean().optional().describe('If provided, sets the draft (work-in-progress) status of the pull request. Pass true to mark as draft, false to mark as ready for review.'),
    reviewers: z.array(z.string()).optional().describe('Optional array of reviewer usernames to set (use the \'name\' field from Bitbucket user objects, not \'slug\')'),
    output: z.enum(['ack', 'full']).optional().describe('Return a compact acknowledgement or the full API response. Defaults to ack.'),
  },
  canMergePullRequest: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
  },
  mergePullRequest: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    version: z.number().describe('The current version of the pull request (required for optimistic locking). Obtain it via bitbucket_getPullRequest. Use bitbucket_canMergePullRequest first to confirm there are no merge vetoes.'),
    message: z.string().optional().describe('Optional custom merge commit message'),
    strategyId: z.string().optional().describe('Optional merge strategy id, e.g. \'no-ff\', \'ff\', \'ff-only\', \'rebase-no-ff\', or \'squash\'. Must be enabled on the repository. Defaults to the repository\'s configured strategy.'),
    output: z.enum(['ack', 'full']).optional().describe('Return a compact acknowledgement or the full API response. Defaults to ack.'),
  },
  declinePullRequest: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    version: z.number().describe('The current version of the pull request (required for optimistic locking). Obtain it via bitbucket_getPullRequest.'),
    comment: z.string().optional().describe('Optional comment explaining why the pull request is being declined'),
    output: z.enum(['ack', 'full']).optional().describe('Return a compact acknowledgement or the full API response. Defaults to ack.'),
  },
  reopenPullRequest: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    version: z.number().describe('The current version of the declined pull request (required for optimistic locking). Obtain it via bitbucket_getPullRequest.'),
    output: z.enum(['ack', 'full']).optional().describe('Return a compact acknowledgement or the full API response. Defaults to ack.'),
  },
  addPullRequestReviewer: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    userSlug: z.string().describe('The username/name of the user to add as a reviewer (use the \'name\' field from Bitbucket user objects). Adds a single reviewer without replacing the existing ones, unlike bitbucket_updatePullRequest.'),
  },
  removePullRequestReviewer: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    userSlug: z.string().describe('The username/name of the reviewer to remove. The user remains a participant but loses the REVIEWER role.'),
  },
  getPullRequestParticipants: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  getRequiredReviewers: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    sourceRefId: z.string().describe('The ID of the source ref (e.g., \'refs/heads/feature-branch\')'),
    targetRefId: z.string().describe('The ID of the target ref (e.g., \'refs/heads/main\')'),
    sourceRepoId: z.string().optional().describe('Optional ID of the repository in which the source ref exists'),
    targetRepoId: z.string().optional().describe('Optional ID of the repository in which the target ref exists'),
  },
  getDashboardPullRequests: {
    role: z.enum(['AUTHOR', 'REVIEWER', 'PARTICIPANT']).optional().default('AUTHOR').describe('Filter by the user\'s role in the PR: AUTHOR (default), REVIEWER, or PARTICIPANT'),
    state: z.enum(['OPEN', 'DECLINED', 'MERGED']).optional().default('OPEN').describe('Filter by PR state: OPEN (default), DECLINED, or MERGED'),
    closedSince: z.number().optional().describe('Timestamp in milliseconds. If state is not OPEN, return only PRs closed after this date'),
    order: z.enum(['NEWEST', 'OLDEST', 'PARTICIPANT']).optional().default('NEWEST').describe('Order of results: NEWEST (default), OLDEST, or PARTICIPANT'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  getInboxPullRequests: {
    start: z.number().optional().describe('Start number for the page (inclusive). If not passed, first page is assumed'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  getBranchRestrictions: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    matcherType: z.enum(['BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).optional().describe('Filter by matcher type'),
    matcherId: z.string().optional().describe('Filter by matcher id (requires matcherType)'),
    type: z.enum(['read-only', 'no-deletes', 'fast-forward-only', 'pull-request-only', 'no-creates']).optional().describe('Filter by restriction type'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  createBranchRestriction: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    type: z.enum(['read-only', 'no-deletes', 'fast-forward-only', 'pull-request-only', 'no-creates']).describe('The restriction type: read-only (prevent changes), no-deletes, fast-forward-only (prevent rewriting history), pull-request-only (prevent changes without a PR), no-creates'),
    matcherType: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).describe('Matcher type for the restricted ref'),
    matcherValue: z.string().describe('Matcher value. For BRANCH use a ref id like \'refs/heads/main\'; for PATTERN use the pattern; for MODEL_* use the model id; for ANY_REF use \'ANY_REF\'.'),
    matcherDisplayId: z.string().optional().describe('Display value for the matcher (defaults to the matcher value, e.g. \'main\' for \'refs/heads/main\')'),
    exemptUserSlugs: z.array(z.string()).optional().describe('User slugs exempt from the restriction'),
    exemptGroupNames: z.array(z.string()).optional().describe('Group names exempt from the restriction'),
    exemptAccessKeyIds: z.array(z.number()).optional().describe('SSH access key IDs exempt from the restriction'),
  },
  getBranchRestriction: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    id: z.string().describe('The restriction ID'),
  },
  deleteBranchRestriction: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    id: z.string().describe('The restriction ID'),
  },
  getBranchModel: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
  },
  setBranchModel: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    development: z.object({
      refId: z.string().describe('Ref id for the development branch, e.g. \'refs/heads/develop\''),
      useDefault: z.boolean().optional().describe('If true, use the repository\'s default branch as development instead of refId'),
    }).describe('Development branch configuration'),
    production: z.object({
      refId: z.string().describe('Ref id for the production branch, e.g. \'refs/heads/master\''),
      useDefault: z.boolean().optional().describe('If true, use the repository\'s default branch as production instead of refId'),
    }).optional().describe('Optional production branch configuration'),
    types: z.array(z.object({
      id: z.enum(['BUGFIX', 'FEATURE', 'HOTFIX', 'RELEASE']).describe('Branch type identifier'),
      prefix: z.string().optional().describe('Branch name prefix for this type, e.g. \'feature/\''),
      enabled: z.boolean().optional().describe('Whether this branch type is enabled'),
    })).optional().describe('Optional branch type configuration (prefixes for bugfix/feature/hotfix/release branches)'),
  },
  deleteBranchModel: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
  },
  searchCode: {
    query: z.string().describe('The search query. Supports Bitbucket search modifiers, e.g. \'project:TEST authenticate\', \'repo:TEST/demo TODO\' (the repo modifier must be \'repo:projectkey/repositoryslug\'), \'ext:ts useState\'. Scope to a project or repository inside the query text.'),
    limit: z.number().optional().describe('Maximum number of matching files to return. If not passed, the package default page size is used.'),
    secondaryLimit: z.number().optional().describe('Maximum number of hit contexts (matching code snippets) to return per file'),
  },
  getDefaultReviewerConditions: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
  },
  createDefaultReviewerCondition: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    sourceMatcherType: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).describe('Matcher type for the source ref'),
    sourceMatcherValue: z.string().describe('Matcher value for the source ref. For ANY_REF use \'ANY_REF\'; for BRANCH use a ref id like \'refs/heads/main\'; for PATTERN use the pattern; for MODEL_* use the model id.'),
    targetMatcherType: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).describe('Matcher type for the target ref'),
    targetMatcherValue: z.string().describe('Matcher value for the target ref (see sourceMatcherValue)'),
    reviewerIds: z.array(z.number()).describe('Numeric user IDs of the default reviewers. Resolve a username to its numeric id via bitbucket_getUser.'),
    requiredApprovals: z.number().optional().describe('Number of approvals required from the default reviewers'),
    sourceMatcherDisplayId: z.string().optional().describe('Display value for the source matcher (defaults to the matcher value, e.g. \'main\' for \'refs/heads/main\')'),
    targetMatcherDisplayId: z.string().optional().describe('Display value for the target matcher (defaults to the matcher value)'),
  },
  updateDefaultReviewerCondition: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    id: z.string().describe('The ID of the condition to update'),
    sourceMatcherType: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).describe('Matcher type for the source ref'),
    sourceMatcherValue: z.string().describe('Matcher value for the source ref'),
    targetMatcherType: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).describe('Matcher type for the target ref'),
    targetMatcherValue: z.string().describe('Matcher value for the target ref'),
    reviewerIds: z.array(z.number()).describe('Numeric user IDs of the default reviewers. The update replaces the full condition, so pass the complete desired set.'),
    requiredApprovals: z.number().optional().describe('Number of approvals required from the default reviewers'),
    sourceMatcherDisplayId: z.string().optional().describe('Display value for the source matcher (defaults to the matcher value)'),
    targetMatcherDisplayId: z.string().optional().describe('Display value for the target matcher (defaults to the matcher value)'),
  },
  deleteDefaultReviewerCondition: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    id: z.string().describe('The ID of the condition to delete'),
  },
  getRequiredBuildsMergeChecks: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  createRequiredBuildsMergeCheck: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    buildParentKeys: z.array(z.string()).describe('Non-empty list of build parent keys that must have green builds for the check to pass'),
    refMatcherType: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).describe('Matcher type for the target ref the check applies to'),
    refMatcherValue: z.string().describe('Matcher value for the target ref. For BRANCH use a ref id like \'refs/heads/main\'; for PATTERN use the pattern; for MODEL_* use the model id; for ANY_REF use \'ANY_REF\'.'),
    refMatcherDisplayId: z.string().optional().describe('Display value for the ref matcher (defaults to the matcher value)'),
    exemptRefMatcherType: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).optional().describe('Matcher type for source refs exempt from the check'),
    exemptRefMatcherValue: z.string().optional().describe('Matcher value for source refs exempt from the check'),
    exemptRefMatcherDisplayId: z.string().optional().describe('Display value for the exempt ref matcher (defaults to its value)'),
  },
  updateRequiredBuildsMergeCheck: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    id: z.string().describe('The ID of the merge check to update'),
    buildParentKeys: z.array(z.string()).describe('Non-empty list of build parent keys. The update replaces the whole check, so pass the complete desired list.'),
    refMatcherType: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).describe('Matcher type for the target ref'),
    refMatcherValue: z.string().describe('Matcher value for the target ref'),
    refMatcherDisplayId: z.string().optional().describe('Display value for the ref matcher (defaults to the matcher value)'),
    exemptRefMatcherType: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).optional().describe('Matcher type for source refs exempt from the check'),
    exemptRefMatcherValue: z.string().optional().describe('Matcher value for source refs exempt from the check'),
    exemptRefMatcherDisplayId: z.string().optional().describe('Display value for the exempt ref matcher (defaults to its value)'),
  },
  deleteRequiredBuildsMergeCheck: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    id: z.string().describe('The ID of the merge check to delete'),
  },
  deletePullRequestComment: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    commentId: z.string().describe('The ID of the comment to delete'),
    version: z.number().describe('The current version of the comment, required for optimistic locking. A comment with replies cannot be deleted.'),
  },
  applyPullRequestSuggestion: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
    commentId: z.string().describe('The ID of the comment that contains the code suggestion'),
    commentVersion: z.number().describe('The current version of the comment containing the suggestion'),
    pullRequestVersion: z.number().describe('The current version of the pull request'),
    commitMessage: z.string().describe('Commit message for the commit that applies the suggestion. Required and must be non-empty.'),
    suggestionIndex: z.number().optional().describe('Index of the suggestion within the comment when it contains several. Defaults to the first suggestion.'),
  },
  watchPullRequest: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
  },
  unwatchPullRequest: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    pullRequestId: z.string().describe('The pull request ID'),
  },
  createProject: {
    key: z.string().describe('The project key (e.g. \'PROJ\'). Used in URLs and must be unique.'),
    name: z.string().describe('The project name'),
    description: z.string().optional().describe('Optional project description'),
  },
  updateProject: {
    key: z.string().describe('The project key. The key itself is never changed by this operation.'),
    name: z.string().optional().describe('New project name'),
    description: z.string().optional().describe('New project description'),
  },
  deleteProject: {
    key: z.string().describe('The project key. The project must contain no repositories.'),
  },
  createRepository: {
    projectKey: z.string().describe('The project key the repository will be created in'),
    name: z.string().describe('The repository name'),
    scmId: z.string().optional().describe('The SCM type. Defaults to \'git\'.'),
    defaultBranch: z.string().optional().describe('Optional default branch for the new repository (e.g. \'main\')'),
  },
  updateRepository: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    name: z.string().optional().describe('New repository name. Changing the name may change the slug.'),
    description: z.string().optional().describe('New repository description'),
    defaultBranch: z.string().optional().describe('New default branch (e.g. \'main\')'),
    targetProjectKey: z.string().optional().describe('Project key to move the repository into'),
  },
  forkRepository: {
    projectKey: z.string().describe('The project key of the origin repository'),
    repositorySlug: z.string().describe('The repository slug of the origin repository'),
    name: z.string().optional().describe('Name for the fork. Defaults to the origin repository name.'),
    targetProjectKey: z.string().optional().describe('Target project key for the fork. Defaults to the user\'s personal project.'),
    defaultBranch: z.string().optional().describe('Default branch for the fork. Defaults to the origin\'s default branch.'),
  },
  getRepositoryForks: {
    projectKey: z.string().describe('The project key of the origin repository'),
    repositorySlug: z.string().describe('The repository slug of the origin repository'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  deleteRepository: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
  },
  getWebhooks: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    event: z.string().optional().describe('Optional webhook event ID to filter for (e.g. \'repo:refs_changed\', \'pr:opened\')'),
    statistics: z.boolean().optional().describe('If true, include invocation statistics for each webhook'),
  },
  getWebhook: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    webhookId: z.string().describe('The ID of the webhook'),
    statistics: z.boolean().optional().describe('If true, include invocation statistics for the webhook'),
  },
  createWebhook: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    name: z.string().describe('The webhook name'),
    url: z.string().describe('The endpoint URL the webhook will POST to'),
    events: z.array(z.string()).describe('List of event IDs to subscribe to (e.g. [\'repo:refs_changed\', \'pr:opened\', \'pr:merged\'])'),
    active: z.boolean().optional().describe('Whether the webhook is enabled. Defaults to true on the server side.'),
    secret: z.string().optional().describe('Optional secret used to sign webhook payloads (HMAC)'),
    sslVerificationRequired: z.boolean().optional().describe('Whether SSL verification is required for the endpoint URL'),
  },
  updateWebhook: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    webhookId: z.string().describe('The ID of the webhook to update'),
    name: z.string().describe('The webhook name'),
    url: z.string().describe('The endpoint URL the webhook will POST to'),
    events: z.array(z.string()).describe('List of event IDs to subscribe to. This replaces the existing event set.'),
    active: z.boolean().optional().describe('Whether the webhook is enabled'),
    secret: z.string().optional().describe('Optional secret used to sign webhook payloads (HMAC)'),
    sslVerificationRequired: z.boolean().optional().describe('Whether SSL verification is required for the endpoint URL'),
  },
  deleteWebhook: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    webhookId: z.string().describe('The ID of the webhook to delete'),
  },
  getAccessTokens: {
    scope: z.enum(['user', 'project', 'repo']).describe('The token scope: \'user\' for personal access tokens, \'project\' for project-scoped tokens, \'repo\' for repository-scoped tokens'),
    userSlug: z.string().optional().describe('The user slug. Required when scope is \'user\'.'),
    projectKey: z.string().optional().describe('The project key. Required when scope is \'project\' or \'repo\'.'),
    repositorySlug: z.string().optional().describe('The repository slug. Required when scope is \'repo\'.'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  createAccessToken: {
    scope: z.enum(['user', 'project', 'repo']).describe('The token scope: \'user\' for personal access tokens, \'project\' for project-scoped tokens, \'repo\' for repository-scoped tokens'),
    name: z.string().describe('The name of the new access token'),
    permissions: z.array(z.string()).describe('The permissions to grant the token, e.g. [\'REPO_READ\', \'REPO_WRITE\', \'REPO_ADMIN\'] for repo scope, [\'PROJECT_READ\', \'PROJECT_WRITE\', \'PROJECT_ADMIN\'] for project scope, or a mix of project/repo permissions for a personal (user) token'),
    expiryDays: z.number().optional().describe('Optional number of days until the token expires. Omit for a non-expiring token, if allowed by the instance\'s token expiration policy.'),
    userSlug: z.string().optional().describe('The user slug. Required when scope is \'user\'.'),
    projectKey: z.string().optional().describe('The project key. Required when scope is \'project\' or \'repo\'.'),
    repositorySlug: z.string().optional().describe('The repository slug. Required when scope is \'repo\'.'),
  },
  deleteAccessToken: {
    scope: z.enum(['user', 'project', 'repo']).describe('The token scope: \'user\' for personal access tokens, \'project\' for project-scoped tokens, \'repo\' for repository-scoped tokens'),
    tokenId: z.string().describe('The ID of the token to delete'),
    userSlug: z.string().optional().describe('The user slug. Required when scope is \'user\'.'),
    projectKey: z.string().optional().describe('The project key. Required when scope is \'project\' or \'repo\'.'),
    repositorySlug: z.string().optional().describe('The repository slug. Required when scope is \'repo\'.'),
  },
  getProjectPermissions: {
    projectKey: z.string().describe('The project key'),
    filter: z.string().optional().describe('Optional filter applied to both returned user and group names'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return per principal type. If not passed, the package default page size is used.'),
  },
  setProjectUserPermission: {
    projectKey: z.string().describe('The project key'),
    name: z.string().describe('The username to grant the permission to'),
    permission: z.enum(['PROJECT_READ', 'PROJECT_WRITE', 'PROJECT_ADMIN']).describe('The permission to grant'),
  },
  setProjectGroupPermission: {
    projectKey: z.string().describe('The project key'),
    name: z.string().describe('The group name to grant the permission to'),
    permission: z.enum(['PROJECT_READ', 'PROJECT_WRITE', 'PROJECT_ADMIN']).describe('The permission to grant'),
  },
  revokeProjectPermission: {
    projectKey: z.string().describe('The project key'),
    user: z.string().optional().describe('Username whose project permissions should be revoked'),
    group: z.string().optional().describe('Group name whose project permissions should be revoked. At least one of user or group must be provided.'),
  },
  getRepoPermissions: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    filter: z.string().optional().describe('Optional filter applied to both returned user and group names'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return per principal type. If not passed, the package default page size is used.'),
  },
  setRepoUserPermission: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    name: z.string().describe('The username to grant the permission to'),
    permission: z.enum(['REPO_READ', 'REPO_WRITE', 'REPO_ADMIN']).describe('The permission to grant'),
  },
  setRepoGroupPermission: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    name: z.string().describe('The group name to grant the permission to'),
    permission: z.enum(['REPO_READ', 'REPO_WRITE', 'REPO_ADMIN']).describe('The permission to grant'),
  },
  revokeRepoPermission: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    user: z.string().optional().describe('Username whose repository permissions should be revoked'),
    group: z.string().optional().describe('Group name whose repository permissions should be revoked. At least one of user or group must be provided.'),
  },
  getSshKeys: {
    userName: z.string().optional().describe('Username to retrieve SSH keys for. Defaults to the currently authenticated user; retrieving another user\'s keys requires ADMIN permission.'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return (defaults to the package page size)'),
  },
  addSshKey: {
    text: z.string().describe('The public key text (e.g. \'ssh-rsa AAAA... comment\')'),
    userName: z.string().optional().describe('Username to add the SSH key for. Defaults to the currently authenticated user; adding for another user requires ADMIN permission.'),
  },
  deleteSshKey: {
    keyId: z.string().describe('The ID of the SSH key to delete'),
  },
  getGpgKeys: {
    user: z.string().optional().describe('Username to retrieve GPG keys for. Defaults to the currently authenticated user; retrieving another user\'s keys requires ADMIN permission.'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return (defaults to the package page size)'),
  },
  addGpgKey: {
    text: z.string().describe('The ASCII-armored GPG public key text'),
    user: z.string().optional().describe('Username to add the GPG key for. Defaults to the currently authenticated user; adding for another user requires ADMIN permission.'),
  },
  deleteGpgKey: {
    fingerprintOrId: z.string().describe('The GPG key ID or fingerprint to delete'),
  },
  setDefaultBranch: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    branchId: z.string().describe('The full ref ID of the branch to set as default (e.g. \'refs/heads/main\')'),
  },
  getPullRequestSettings: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
  },
  updatePullRequestSettings: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    settings: z.record(z.string(), z.any()).describe('Settings to update; only the provided keys are changed. Known keys: mergeConfig, requiredApprovers, requiredAllApprovers, requiredAllTasksComplete, requiredSuccessfulBuilds, \'com.atlassian.bitbucket.server.bundled-hooks.requiredApproversMergeHook\', \'com.atlassian.bitbucket.server.bitbucket-build.requiredBuildsMergeCheck\''),
  },
  getAutoDeclineSettings: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
  },
  setAutoDeclineSettings: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    enabled: z.boolean().describe('Whether auto-decline of inactive pull requests is enabled'),
    inactivityWeeks: z.number().optional().describe('Number of weeks of inactivity before a pull request is auto-declined. Must be one of 1, 2, 4, 8, or 12.'),
  },
  deleteAutoDeclineSettings: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
  },
  getAutoMergeSettings: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
  },
  setAutoMergeSettings: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    enabled: z.boolean().describe('Whether pull requests are automatically merged once all merge checks pass'),
  },
  deleteAutoMergeSettings: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
  },
  getRepoHooks: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    type: z.enum(['PRE_RECEIVE', 'POST_RECEIVE']).optional().describe('Optional hook type to filter by'),
    start: z.number().optional().describe('Start number for pagination'),
    limit: z.number().optional().describe('Number of items to return. If not passed, the package default page size is used.'),
  },
  enableRepoHook: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    hookKey: z.string().describe('The hook key (e.g. \'com.atlassian.bitbucket.server.bundled-hooks:requiredApproversMergeHook\')'),
  },
  disableRepoHook: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    hookKey: z.string().describe('The hook key'),
  },
  getRepoHookSettings: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    hookKey: z.string().describe('The hook key'),
  },
  setRepoHookSettings: {
    projectKey: z.string().describe('The project key'),
    repositorySlug: z.string().describe('The repository slug'),
    hookKey: z.string().describe('The hook key'),
    settings: z.record(z.string(), z.any()).describe('The raw settings document for the hook. Structure is decided by the hook\'s plugin.'),
  },
};
