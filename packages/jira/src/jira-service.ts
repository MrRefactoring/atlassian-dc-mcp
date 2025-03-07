import { z } from 'zod';
import { handleApiOperation } from '@atlassian-dc-mcp/common';
import { IssueService, OpenAPI, SearchService } from './jira-client/index.js';

export class JiraService {
  constructor(host: string, token: string) {
    OpenAPI.BASE = `https://${host}/rest`;
    OpenAPI.TOKEN = token;
    OpenAPI.VERSION = '2';
  }

  async searchIssues(jql: string, startAt?: number, expand?: string[], maxResults: number = 10) {
    return handleApiOperation(() => {
      return SearchService.searchUsingSearchRequest({
        jql,
        maxResults,
        expand,
        startAt
      });
    }, 'Error searching issues');
  }

  async getIssue(issueKey: string, expand?: string) {
    return handleApiOperation(() => IssueService.getIssue(issueKey, expand), 'Error getting issue');
  }

  async getIssueComments(issueKey: string, expand?: string) {
    return handleApiOperation(() => IssueService.getComments(issueKey, expand), 'Error getting issue comments');
  }

  async postIssueComment(issueKey: string, comment: string) {
    return handleApiOperation(() => IssueService.addComment(issueKey, undefined, { body: comment }), 'Error posting issue comment');
  }

  async createIssue(params: {
    projectId: string;
    summary: string;
    description: string;
    issueTypeId: string;
  }) {
    return handleApiOperation(async () => {
      return IssueService.createIssue(true, {
        fields: {
          project: { key: params.projectId },
          summary: params.summary,
          description: params.description,
          issuetype: { id: params.issueTypeId }
        }
      })
    }, 'Error creating issue');
  }

  static validateConfig(): string[] {
    const requiredEnvVars = ['JIRA_HOST', 'JIRA_API_TOKEN'] as const;
    return requiredEnvVars.filter(varName => !process.env[varName]);
  }
}

export const jiraToolSchemas = {
  searchIssues: {
    jql: z.string().describe("JQL query string"),
    maxResults: z.number().optional().describe("Maximum number of results to return"),
    startAt: z.number().optional().describe("Index of the first result to return"),
    expand: z.array(z.string()).optional().describe("Fields to expand")
  },
  getIssue: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    expand: z.string().optional().describe("Comma separated fields to expand")
  },
  getIssueComments: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    expand: z.string().optional().describe("Comma separated fields to expand")
  },
  postIssueComment: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    comment: z.string().describe("Comment text in the format suitable for JIRA DATA CENTER edition (JIRA Wiki Markup).")
  },
  createIssue: {
    projectId: z.string().describe("Project id"),
    summary: z.string().describe("Issue summary"),
    description: z.string().describe("Issue description in the format suitable for JIRA DATA CENTER edition (JIRA Wiki Markup)."),
    issueTypeId: z.string().describe("Issue type id (e.g. id of Task, Bug, Story). Should be found first a correct number for specific JIRA installation.")
  }
};
