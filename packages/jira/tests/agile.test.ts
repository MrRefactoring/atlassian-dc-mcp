import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';

const jira = vi.hoisted(() => {
  const group = () => new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, { get: (t, p: string) => (t[p] ??= vi.fn()) });

  return { issues: group(), projects: group(), users: group(), workflows: group(), agile: group(), admin: group(), request: vi.fn() };
});
vi.mock('../src/jiraClient/index.js', () => ({ createJiraClient: () => jira }));

describe('JiraService', () => {
  let jiraService: JiraService;

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('agile boards', () => {
    it('gets boards', async () => {
      const mockBoards = { values: [{ id: 1, name: 'Scrum Board' }] };
      (jira.agile.getAllBoards as Mock).mockResolvedValue(mockBoards);

      const result = await jiraService.getBoards();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBoards);
      expect(jira.agile.getAllBoards).toHaveBeenCalledWith({});
    });

    it('gets a single board', async () => {
      const mockBoard = { id: 1, name: 'Scrum Board' };
      (jira.agile.getBoard as Mock).mockResolvedValue(mockBoard);

      const result = await jiraService.getBoard(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBoard);
      expect(jira.agile.getBoard).toHaveBeenCalledWith({ boardId: 1 });
    });

    it('gets board configuration', async () => {
      const mockConfig = { id: 1, columnConfig: {} };
      (jira.agile.getConfiguration as Mock).mockResolvedValue(mockConfig);

      const result = await jiraService.getBoardConfiguration(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockConfig);
    });

    it('gets board issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (jira.agile.getIssuesForBoard as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardIssues(1, 'status = Open');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(jira.agile.getIssuesForBoard).toHaveBeenCalledWith({ boardId: 1, jql: 'status = Open' });
    });

    it('gets board sprints', async () => {
      const mockSprints = { values: [{ id: 1, name: 'Sprint 1' }] };
      (jira.agile.getAllSprints as Mock).mockResolvedValue(mockSprints);

      const result = await jiraService.getBoardSprints(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprints);
      expect(jira.agile.getAllSprints).toHaveBeenCalledWith({ boardId: 1 });
    });

    it('gets board versions', async () => {
      const mockVersions = { values: [{ id: 1, name: '1.0' }] };
      (jira.agile.getAllVersions as Mock).mockResolvedValue(mockVersions);

      const result = await jiraService.getBoardVersions(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersions);
    });

    it('handles errors', async () => {
      (jira.agile.getBoard as Mock).mockRejectedValue(new Error('The board does not exist'));

      const result = await jiraService.getBoard(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The board does not exist');
    });
  });
  describe('backlog and epics', () => {
    it('gets board backlog issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (jira.agile.getIssuesForBacklog as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardBacklogIssues(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(jira.agile.getIssuesForBacklog).toHaveBeenCalledWith({ boardId: 1 });
    });

    it('gets board epics', async () => {
      const mockEpics = { values: [{ id: 1, name: 'Epic 1' }] };
      (jira.agile.getEpics as Mock).mockResolvedValue(mockEpics);

      const result = await jiraService.getBoardEpics(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpics);
      expect(jira.agile.getEpics).toHaveBeenCalledWith({ boardId: 1 });
    });

    it('gets board issues without an epic', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-2' }] };
      (jira.agile.getIssuesWithoutEpic as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardIssuesWithoutEpic(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
    });

    it('gets board epic issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-3' }] };
      (jira.agile.getBoardIssuesForEpic as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardEpicIssues(1, 10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(jira.agile.getBoardIssuesForEpic).toHaveBeenCalledWith({ epicId: 10, boardId: 1 });
    });

    it('moves issues to backlog', async () => {
      (jira.agile.moveIssuesToBacklog as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToBacklog(['PROJ-1', 'PROJ-2']);

      expect(result.success).toBe(true);
      expect(jira.agile.moveIssuesToBacklog).toHaveBeenCalledWith({ requestBody: { issues: ['PROJ-1', 'PROJ-2'] } });
    });

    it('handles errors', async () => {
      (jira.agile.moveIssuesToBacklog as Mock).mockRejectedValue(new Error('Sprint does not exist'));

      const result = await jiraService.moveIssuesToBacklog(['PROJ-1']);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Sprint does not exist');
    });
  });
  describe('sprints', () => {
    it('creates a sprint', async () => {
      const mockSprint = { id: 1, name: 'Sprint 1' };
      (jira.agile.createSprint as Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.createSprint('Sprint 1', 1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(jira.agile.createSprint).toHaveBeenCalledWith({ requestBody: {
        name: 'Sprint 1',
        originBoardId: 1,
        startDate: undefined,
        endDate: undefined,
        goal: undefined,
      } });
    });

    it('gets a sprint', async () => {
      const mockSprint = { id: 1, name: 'Sprint 1' };
      (jira.agile.getSprint as Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.getSprint(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(jira.agile.getSprint).toHaveBeenCalledWith({ sprintId: 1 });
    });

    it('updates a sprint to start it', async () => {
      const mockSprint = { id: 1, state: 'active' };
      (jira.agile.updateSprint as Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.updateSprint(1, undefined, undefined, undefined, undefined, 'active');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(jira.agile.updateSprint).toHaveBeenCalledWith({ sprintId: 1, requestBody: {
        name: undefined,
        startDate: undefined,
        endDate: undefined,
        goal: undefined,
        state: 'active',
      } });
    });

    it('deletes a sprint', async () => {
      (jira.agile.deleteSprint as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteSprint(1);

      expect(result.success).toBe(true);
      expect(jira.agile.deleteSprint).toHaveBeenCalledWith({ sprintId: 1 });
    });

    it('gets sprint issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (jira.agile.getIssuesForSprint as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getSprintIssues(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(jira.agile.getIssuesForSprint).toHaveBeenCalledWith({ sprintId: 1 });
    });

    it('moves issues into a sprint', async () => {
      (jira.agile.moveIssuesToSprint as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToSprint(1, ['PROJ-1', 'PROJ-2']);

      expect(result.success).toBe(true);
      expect(jira.agile.moveIssuesToSprint).toHaveBeenCalledWith({ sprintId: 1, requestBody: { issues: ['PROJ-1', 'PROJ-2'] } });
    });

    it('handles errors', async () => {
      (jira.agile.deleteSprint as Mock).mockRejectedValue(new Error('The sprint is active or completed'));

      const result = await jiraService.deleteSprint(1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The sprint is active or completed');
    });
  });
  describe('epics', () => {
    it('gets an epic', async () => {
      const mockEpic = { id: 1, key: 'PROJ-1', name: 'Epic 1' };
      (jira.agile.getEpic as Mock).mockResolvedValue(mockEpic);

      const result = await jiraService.getEpic('PROJ-1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpic);
      expect(jira.agile.getEpic).toHaveBeenCalledWith({ epicIdOrKey: 'PROJ-1' });
    });

    it('updates an epic', async () => {
      const mockEpic = { id: 1, done: true };
      (jira.agile.partiallyUpdateEpic as Mock).mockResolvedValue(mockEpic);

      const result = await jiraService.updateEpic('PROJ-1', undefined, undefined, true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpic);
      expect(jira.agile.partiallyUpdateEpic).toHaveBeenCalledWith({ epicIdOrKey: 'PROJ-1', requestBody: {
        name: undefined,
        summary: undefined,
        done: true,
      } });
    });

    it('gets epic issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-2' }] };
      (jira.agile.getEpicIssuesForEpic as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getEpicIssues('PROJ-1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(jira.agile.getEpicIssuesForEpic).toHaveBeenCalledWith({ epicIdOrKey: 'PROJ-1' });
    });

    it('moves issues into an epic', async () => {
      (jira.agile.moveIssuesToEpic as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToEpic('PROJ-1', ['PROJ-2', 'PROJ-3']);

      expect(result.success).toBe(true);
      expect(jira.agile.moveIssuesToEpic).toHaveBeenCalledWith({ epicIdOrKey: 'PROJ-1', requestBody: { issues: ['PROJ-2', 'PROJ-3'] } });
    });

    it('ranks an epic', async () => {
      (jira.agile.rankEpics as Mock).mockResolvedValue(undefined);

      const result = await jiraService.rankEpic('PROJ-1', 'PROJ-4');

      expect(result.success).toBe(true);
      expect(jira.agile.rankEpics).toHaveBeenCalledWith({ epicIdOrKey: 'PROJ-1', requestBody: {
        rankBeforeEpic: 'PROJ-4',
        rankAfterEpic: undefined,
        rankCustomFieldId: undefined,
      } });
    });

    it('handles errors', async () => {
      (jira.agile.getEpic as Mock).mockRejectedValue(new Error('The epic does not exist'));

      const result = await jiraService.getEpic('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The epic does not exist');
    });
  });
});
