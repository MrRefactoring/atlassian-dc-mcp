import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';

// jira.js groups its Data Center surface into sixty-one modules, so the stand-in conjures a module the first time one
// is asked for and a mock the first time a method on it is. `createJiraClient` hands back a provider, which is what
// lets the service re-read its credentials per call.
const jira = vi.hoisted(() => {
  const module_ = () => new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, { get: (t, p: string) => (t[p] ??= vi.fn()) });

  return new Proxy({} as Record<string, unknown>, {
    get: (t, p: string) => (t[p] ??= p === 'request' ? vi.fn() : module_()),
  }) as Record<string, ReturnType<typeof module_>> & { request: ReturnType<typeof vi.fn> };
});
vi.mock('../src/jiraClient.js', () => ({ createJiraClient: () => () => jira }));

describe('JiraService', () => {
  let jiraService: JiraService;

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('agile boards', () => {
    it('gets boards', async () => {
      const mockBoards = { values: [{ id: 1, name: 'Scrum Board' }] };
      (jira.board.getAllBoards as Mock).mockResolvedValue(mockBoards);

      const result = await jiraService.getBoards();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBoards);
      expect(jira.board.getAllBoards).toHaveBeenCalledWith({});
    });

    it('gets a single board', async () => {
      const mockBoard = { id: 1, name: 'Scrum Board' };
      (jira.board.getBoard as Mock).mockResolvedValue(mockBoard);

      const result = await jiraService.getBoard(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBoard);
      expect(jira.board.getBoard).toHaveBeenCalledWith({ boardId: 1 });
    });

    it('gets board configuration', async () => {
      const mockConfig = { id: 1, columnConfig: {} };
      (jira.board.getBoardConfiguration as Mock).mockResolvedValue(mockConfig);

      const result = await jiraService.getBoardConfiguration(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockConfig);
    });

    it('gets board issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (jira.board.getIssuesForBoard as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardIssues(1, 'status = Open');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(jira.board.getIssuesForBoard).toHaveBeenCalledWith({ boardId: 1, jql: 'status = Open' });
    });

    it('gets board sprints', async () => {
      const mockSprints = { values: [{ id: 1, name: 'Sprint 1' }] };
      (jira.board.getAllSprints as Mock).mockResolvedValue(mockSprints);

      const result = await jiraService.getBoardSprints(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprints);
      expect(jira.board.getAllSprints).toHaveBeenCalledWith({ boardId: 1 });
    });

    it('gets board versions', async () => {
      const mockVersions = { values: [{ id: 1, name: '1.0' }] };
      (jira.board.getAllVersions as Mock).mockResolvedValue(mockVersions);

      const result = await jiraService.getBoardVersions(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersions);
    });

    it('handles errors', async () => {
      (jira.board.getBoard as Mock).mockRejectedValue(new Error('The board does not exist'));

      const result = await jiraService.getBoard(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The board does not exist');
    });
  });
  describe('backlog and epics', () => {
    it('gets board backlog issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (jira.board.getIssuesForBacklog as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardBacklogIssues(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(jira.board.getIssuesForBacklog).toHaveBeenCalledWith({ boardId: 1 });
    });

    it('gets board epics', async () => {
      const mockEpics = { values: [{ id: 1, name: 'Epic 1' }] };
      (jira.board.getEpics as Mock).mockResolvedValue(mockEpics);

      const result = await jiraService.getBoardEpics(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpics);
      expect(jira.board.getEpics).toHaveBeenCalledWith({ boardId: 1 });
    });

    it('gets board issues without an epic', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-2' }] };
      (jira.board.getIssuesWithoutEpicForBoard as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardIssuesWithoutEpic(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
    });

    it('gets board epic issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-3' }] };
      (jira.board.getIssuesForBoardEpic as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardEpicIssues(1, 10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(jira.board.getIssuesForBoardEpic).toHaveBeenCalledWith({ epicId: 10, boardId: 1 });
    });

    it('moves issues to backlog', async () => {
      (jira.backlog.moveIssuesToBacklog as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToBacklog(['PROJ-1', 'PROJ-2']);

      expect(result.success).toBe(true);
      expect(jira.backlog.moveIssuesToBacklog).toHaveBeenCalledWith({ issues: ['PROJ-1', 'PROJ-2'] });
    });

    it('handles errors', async () => {
      (jira.backlog.moveIssuesToBacklog as Mock).mockRejectedValue(new Error('Sprint does not exist'));

      const result = await jiraService.moveIssuesToBacklog(['PROJ-1']);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Sprint does not exist');
    });
  });
  describe('sprints', () => {
    it('creates a sprint', async () => {
      const mockSprint = { id: 1, name: 'Sprint 1' };
      (jira.sprint.createSprint as Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.createSprint('Sprint 1', 1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(jira.sprint.createSprint).toHaveBeenCalledWith({ name: 'Sprint 1',
        originBoardId: 1,
        startDate: undefined,
        endDate: undefined,
        goal: undefined });
    });

    it('gets a sprint', async () => {
      const mockSprint = { id: 1, name: 'Sprint 1' };
      (jira.sprint.getSprint as Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.getSprint(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(jira.sprint.getSprint).toHaveBeenCalledWith({ sprintId: 1 });
    });

    it('updates a sprint to start it', async () => {
      const mockSprint = { id: 1, state: 'active' };
      (jira.sprint.updateSprint as Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.updateSprint(1, undefined, undefined, undefined, undefined, 'active');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(jira.sprint.updateSprint).toHaveBeenCalledWith({ sprintId: 1, name: undefined,
        startDate: undefined,
        endDate: undefined,
        goal: undefined,
        state: 'active' });
    });

    it('deletes a sprint', async () => {
      (jira.sprint.deleteSprint as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteSprint(1);

      expect(result.success).toBe(true);
      expect(jira.sprint.deleteSprint).toHaveBeenCalledWith({ sprintId: 1 });
    });

    it('gets sprint issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (jira.sprint.getIssuesForSprint as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getSprintIssues(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(jira.sprint.getIssuesForSprint).toHaveBeenCalledWith({ sprintId: 1 });
    });

    it('moves issues into a sprint', async () => {
      (jira.sprint.moveIssuesToSprint as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToSprint(1, ['PROJ-1', 'PROJ-2']);

      expect(result.success).toBe(true);
      expect(jira.sprint.moveIssuesToSprint).toHaveBeenCalledWith({ sprintId: 1, issues: ['PROJ-1', 'PROJ-2'] });
    });

    it('handles errors', async () => {
      (jira.sprint.deleteSprint as Mock).mockRejectedValue(new Error('The sprint is active or completed'));

      const result = await jiraService.deleteSprint(1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The sprint is active or completed');
    });
  });
  describe('epics', () => {
    it('gets an epic', async () => {
      const mockEpic = { id: 1, key: 'PROJ-1', name: 'Epic 1' };
      (jira.epic.getEpic as Mock).mockResolvedValue(mockEpic);

      const result = await jiraService.getEpic('PROJ-1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpic);
      expect(jira.epic.getEpic).toHaveBeenCalledWith({ epicIdOrKey: 'PROJ-1' });
    });

    it('updates an epic', async () => {
      const mockEpic = { id: 1, done: true };
      (jira.epic.partiallyUpdateEpic as Mock).mockResolvedValue(mockEpic);

      const result = await jiraService.updateEpic('PROJ-1', undefined, undefined, true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpic);
      expect(jira.epic.partiallyUpdateEpic).toHaveBeenCalledWith({ epicIdOrKey: 'PROJ-1', name: undefined,
        summary: undefined,
        done: true });
    });

    it('gets epic issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-2' }] };
      (jira.epic.getIssuesForEpic as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getEpicIssues('PROJ-1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(jira.epic.getIssuesForEpic).toHaveBeenCalledWith({ epicIdOrKey: 'PROJ-1' });
    });

    it('moves issues into an epic', async () => {
      (jira.epic.moveIssuesToEpic as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToEpic('PROJ-1', ['PROJ-2', 'PROJ-3']);

      expect(result.success).toBe(true);
      expect(jira.epic.moveIssuesToEpic).toHaveBeenCalledWith({ epicIdOrKey: 'PROJ-1', issues: ['PROJ-2', 'PROJ-3'] });
    });

    it('ranks an epic', async () => {
      (jira.epic.rankEpics as Mock).mockResolvedValue(undefined);

      const result = await jiraService.rankEpic('PROJ-1', 'PROJ-4');

      expect(result.success).toBe(true);
      expect(jira.epic.rankEpics).toHaveBeenCalledWith({ epicIdOrKey: 'PROJ-1', rankBeforeEpic: 'PROJ-4',
        rankAfterEpic: undefined,
        rankCustomFieldId: undefined });
    });

    it('handles errors', async () => {
      (jira.epic.getEpic as Mock).mockRejectedValue(new Error('The epic does not exist'));

      const result = await jiraService.getEpic('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The epic does not exist');
    });
  });
});
