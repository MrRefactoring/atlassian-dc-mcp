import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jira-service.js';
import {
  BacklogService,
  BoardService,
  EpicService,
  SprintService,
} from '../src/jira-client/index.js';

vi.mock('../src/jira-client/index.js', () => ({
  BoardService: {
    getAllBoards: vi.fn(),
    getBoard: vi.fn(),
    getConfiguration: vi.fn(),
    getIssuesForBoard: vi.fn(),
    getAllSprints: vi.fn(),
    getAllVersions: vi.fn(),
    getIssuesForBacklog: vi.fn(),
    getEpics: vi.fn(),
    getIssuesWithoutEpic: vi.fn(),
    getIssuesForEpic: vi.fn(),
  },
  BacklogService: {
    moveIssuesToBacklog: vi.fn(),
  },
  SprintService: {
    createSprint: vi.fn(),
    getSprint: vi.fn(),
    updateSprint: vi.fn(),
    deleteSprint: vi.fn(),
    getIssuesForSprint1: vi.fn(),
    moveIssuesToSprint: vi.fn(),
  },
  EpicService: {
    getEpic: vi.fn(),
    partiallyUpdateEpic: vi.fn(),
    getIssuesForEpic1: vi.fn(),
    moveIssuesToEpic: vi.fn(),
    rankEpics: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
  },
}));

describe('JiraService', () => {
  let jiraService: JiraService;

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('agile boards', () => {
    it('gets boards', async () => {
      const mockBoards = { values: [{ id: 1, name: 'Scrum Board' }] };
      (BoardService.getAllBoards as Mock).mockResolvedValue(mockBoards);

      const result = await jiraService.getBoards();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBoards);
      expect(BoardService.getAllBoards).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, undefined);
    });

    it('gets a single board', async () => {
      const mockBoard = { id: 1, name: 'Scrum Board' };
      (BoardService.getBoard as Mock).mockResolvedValue(mockBoard);

      const result = await jiraService.getBoard(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBoard);
      expect(BoardService.getBoard).toHaveBeenCalledWith(1);
    });

    it('gets board configuration', async () => {
      const mockConfig = { id: 1, columnConfig: {} };
      (BoardService.getConfiguration as Mock).mockResolvedValue(mockConfig);

      const result = await jiraService.getBoardConfiguration(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockConfig);
    });

    it('gets board issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (BoardService.getIssuesForBoard as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardIssues(1, 'status = Open');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(BoardService.getIssuesForBoard).toHaveBeenCalledWith(1, undefined, 'status = Open', undefined, undefined, undefined, undefined);
    });

    it('gets board sprints', async () => {
      const mockSprints = { values: [{ id: 1, name: 'Sprint 1' }] };
      (BoardService.getAllSprints as Mock).mockResolvedValue(mockSprints);

      const result = await jiraService.getBoardSprints(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprints);
      expect(BoardService.getAllSprints).toHaveBeenCalledWith(1, undefined, undefined, undefined);
    });

    it('gets board versions', async () => {
      const mockVersions = { values: [{ id: 1, name: '1.0' }] };
      (BoardService.getAllVersions as Mock).mockResolvedValue(mockVersions);

      const result = await jiraService.getBoardVersions(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersions);
    });

    it('handles errors', async () => {
      (BoardService.getBoard as Mock).mockRejectedValue(new Error('The board does not exist'));

      const result = await jiraService.getBoard(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The board does not exist');
    });
  });
  describe('backlog and epics', () => {
    it('gets board backlog issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (BoardService.getIssuesForBacklog as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardBacklogIssues(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(BoardService.getIssuesForBacklog).toHaveBeenCalledWith(1, undefined, undefined, undefined, undefined, undefined, undefined);
    });

    it('gets board epics', async () => {
      const mockEpics = { values: [{ id: 1, name: 'Epic 1' }] };
      (BoardService.getEpics as Mock).mockResolvedValue(mockEpics);

      const result = await jiraService.getBoardEpics(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpics);
      expect(BoardService.getEpics).toHaveBeenCalledWith(1, undefined, undefined, undefined);
    });

    it('gets board issues without an epic', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-2' }] };
      (BoardService.getIssuesWithoutEpic as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardIssuesWithoutEpic(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
    });

    it('gets board epic issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-3' }] };
      (BoardService.getIssuesForEpic as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardEpicIssues(1, 10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(BoardService.getIssuesForEpic).toHaveBeenCalledWith(10, 1, undefined, undefined, undefined, undefined, undefined, undefined);
    });

    it('moves issues to backlog', async () => {
      (BacklogService.moveIssuesToBacklog as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToBacklog(['PROJ-1', 'PROJ-2']);

      expect(result.success).toBe(true);
      expect(BacklogService.moveIssuesToBacklog).toHaveBeenCalledWith({ issues: ['PROJ-1', 'PROJ-2'] });
    });

    it('handles errors', async () => {
      (BacklogService.moveIssuesToBacklog as Mock).mockRejectedValue(new Error('Sprint does not exist'));

      const result = await jiraService.moveIssuesToBacklog(['PROJ-1']);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Sprint does not exist');
    });
  });
  describe('sprints', () => {
    it('creates a sprint', async () => {
      const mockSprint = { id: 1, name: 'Sprint 1' };
      (SprintService.createSprint as Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.createSprint('Sprint 1', 1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(SprintService.createSprint).toHaveBeenCalledWith({
        name: 'Sprint 1',
        originBoardId: 1,
        startDate: undefined,
        endDate: undefined,
        goal: undefined,
      });
    });

    it('gets a sprint', async () => {
      const mockSprint = { id: 1, name: 'Sprint 1' };
      (SprintService.getSprint as Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.getSprint(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(SprintService.getSprint).toHaveBeenCalledWith(1);
    });

    it('updates a sprint to start it', async () => {
      const mockSprint = { id: 1, state: 'active' };
      (SprintService.updateSprint as Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.updateSprint(1, undefined, undefined, undefined, undefined, 'active');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(SprintService.updateSprint).toHaveBeenCalledWith(1, {
        name: undefined,
        startDate: undefined,
        endDate: undefined,
        goal: undefined,
        state: 'active',
      });
    });

    it('deletes a sprint', async () => {
      (SprintService.deleteSprint as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteSprint(1);

      expect(result.success).toBe(true);
      expect(SprintService.deleteSprint).toHaveBeenCalledWith(1);
    });

    it('gets sprint issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (SprintService.getIssuesForSprint1 as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getSprintIssues(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(SprintService.getIssuesForSprint1).toHaveBeenCalledWith(1, undefined, undefined, undefined, undefined, undefined, undefined);
    });

    it('moves issues into a sprint', async () => {
      (SprintService.moveIssuesToSprint as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToSprint(1, ['PROJ-1', 'PROJ-2']);

      expect(result.success).toBe(true);
      expect(SprintService.moveIssuesToSprint).toHaveBeenCalledWith(1, { issues: ['PROJ-1', 'PROJ-2'] });
    });

    it('handles errors', async () => {
      (SprintService.deleteSprint as Mock).mockRejectedValue(new Error('The sprint is active or completed'));

      const result = await jiraService.deleteSprint(1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The sprint is active or completed');
    });
  });
  describe('epics', () => {
    it('gets an epic', async () => {
      const mockEpic = { id: 1, key: 'PROJ-1', name: 'Epic 1' };
      (EpicService.getEpic as Mock).mockResolvedValue(mockEpic);

      const result = await jiraService.getEpic('PROJ-1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpic);
      expect(EpicService.getEpic).toHaveBeenCalledWith('PROJ-1');
    });

    it('updates an epic', async () => {
      const mockEpic = { id: 1, done: true };
      (EpicService.partiallyUpdateEpic as Mock).mockResolvedValue(mockEpic);

      const result = await jiraService.updateEpic('PROJ-1', undefined, undefined, true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpic);
      expect(EpicService.partiallyUpdateEpic).toHaveBeenCalledWith('PROJ-1', {
        name: undefined,
        summary: undefined,
        done: true,
      });
    });

    it('gets epic issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-2' }] };
      (EpicService.getIssuesForEpic1 as Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getEpicIssues('PROJ-1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(EpicService.getIssuesForEpic1).toHaveBeenCalledWith('PROJ-1', undefined, undefined, undefined, undefined, undefined, undefined);
    });

    it('moves issues into an epic', async () => {
      (EpicService.moveIssuesToEpic as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToEpic('PROJ-1', ['PROJ-2', 'PROJ-3']);

      expect(result.success).toBe(true);
      expect(EpicService.moveIssuesToEpic).toHaveBeenCalledWith('PROJ-1', { issues: ['PROJ-2', 'PROJ-3'] });
    });

    it('ranks an epic', async () => {
      (EpicService.rankEpics as Mock).mockResolvedValue(undefined);

      const result = await jiraService.rankEpic('PROJ-1', 'PROJ-4');

      expect(result.success).toBe(true);
      expect(EpicService.rankEpics).toHaveBeenCalledWith('PROJ-1', {
        rankBeforeEpic: 'PROJ-4',
        rankAfterEpic: undefined,
        rankCustomFieldId: undefined,
      });
    });

    it('handles errors', async () => {
      (EpicService.getEpic as Mock).mockRejectedValue(new Error('The epic does not exist'));

      const result = await jiraService.getEpic('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The epic does not exist');
    });
  });
});
