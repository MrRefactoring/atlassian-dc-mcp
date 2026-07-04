import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jira-service.js';
import {
  CommentService,
  IssueService,
  IssuetypeService,
  PriorityService,
  ResolutionService,
  StatusService,
} from '../src/jira-client/index.js';

vi.mock('../src/jira-client/index.js', () => ({
  IssueService: {
    getTransitions: vi.fn(),
    doTransition: vi.fn(),
    deleteIssue: vi.fn(),
    updateComment: vi.fn(),
    deleteComment: vi.fn(),
    assign: vi.fn(),
    getPropertiesKeys2: vi.fn(),
    getProperty3: vi.fn(),
    setProperty2: vi.fn(),
    deleteProperty3: vi.fn(),
    notify: vi.fn(),
    setPinComment: vi.fn(),
    getPinnedComments: vi.fn(),
    getIssueWatchers: vi.fn(),
    addWatcher1: vi.fn(),
    removeWatcher1: vi.fn(),
    getVotes: vi.fn(),
    addVote: vi.fn(),
    removeVote: vi.fn(),
    getCreateIssueMetaProjectIssueTypes: vi.fn(),
    getCreateIssueMetaFields: vi.fn(),
    getEditIssueMeta: vi.fn(),
  },
  CommentService: {
    getPropertiesKeys1: vi.fn(),
    getProperty2: vi.fn(),
    setProperty1: vi.fn(),
    deleteProperty2: vi.fn(),
  },
  IssuetypeService: {
    getIssueAllTypes: vi.fn(),
  },
  PriorityService: {
    getPriorities: vi.fn(),
  },
  ResolutionService: {
    getResolutions: vi.fn(),
  },
  StatusService: {
    getStatuses: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
  },
}));

describe('JiraService', () => {
  let jiraService: JiraService;
  const mockIssueKey = 'PROJ-123';

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('getTransitions', () => {
    it('should successfully get available transitions for an issue', async () => {
      const mockTransitionsData = {
        transitions: [
          {
            id: '21',
            name: 'Start Progress',
            to: {
              id: '3',
              name: 'In Progress',
              statusCategory: { name: 'In Progress' },
            },
          },
          {
            id: '31',
            name: 'Done',
            to: {
              id: '4',
              name: 'Done',
              statusCategory: { name: 'Done' },
            },
          },
        ],
      };
      (IssueService.getTransitions as Mock).mockResolvedValue(mockTransitionsData);

      const result = await jiraService.getTransitions(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTransitionsData);
      expect(IssueService.getTransitions).toHaveBeenCalledWith(mockIssueKey);
    });

    it('should return empty transitions array when no transitions available', async () => {
      const mockTransitionsData = {
        transitions: [],
      };
      (IssueService.getTransitions as Mock).mockResolvedValue(mockTransitionsData);

      const result = await jiraService.getTransitions(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTransitionsData);
      expect(result.data?.transitions).toHaveLength(0);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Issue not found');
      (IssueService.getTransitions as Mock).mockRejectedValue(mockError);

      const result = await jiraService.getTransitions(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Issue not found');
    });

    it('should handle permission errors', async () => {
      const mockError = new Error('Insufficient permissions to view transitions');
      (IssueService.getTransitions as Mock).mockRejectedValue(mockError);

      const result = await jiraService.getTransitions('RESTRICTED-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient permissions to view transitions');
    });
  });
  describe('transitionIssue', () => {
    it('should successfully transition an issue to a new status', async () => {
      (IssueService.doTransition as Mock).mockResolvedValue(undefined);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '21',
      });

      expect(result.success).toBe(true);
      expect(IssueService.doTransition).toHaveBeenCalledWith(mockIssueKey, {
        transition: { id: '21' },
      });
    });

    it('should successfully transition with additional fields', async () => {
      (IssueService.doTransition as Mock).mockResolvedValue(undefined);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '31',
        fields: {
          resolution: { name: 'Done' },
          comment: { body: 'Closing this issue' },
        },
      });

      expect(result.success).toBe(true);
      expect(IssueService.doTransition).toHaveBeenCalledWith(mockIssueKey, {
        transition: { id: '31' },
        fields: {
          resolution: { name: 'Done' },
          comment: { body: 'Closing this issue' },
        },
      });
    });

    it('should handle invalid transition ID errors', async () => {
      const mockError = new Error('Invalid transition ID');
      (IssueService.doTransition as Mock).mockRejectedValue(mockError);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '999',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid transition ID');
    });

    it('should handle missing required fields errors', async () => {
      const mockError = new Error('Resolution field is required');
      (IssueService.doTransition as Mock).mockRejectedValue(mockError);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '31',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Resolution field is required');
    });

    it('should handle permission errors', async () => {
      const mockError = new Error('User does not have permission to transition this issue');
      (IssueService.doTransition as Mock).mockRejectedValue(mockError);

      const result = await jiraService.transitionIssue({
        issueKey: 'RESTRICTED-1',
        transitionId: '21',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to transition this issue');
    });

    it('should handle issue not found errors', async () => {
      const mockError = new Error('Issue does not exist');
      (IssueService.doTransition as Mock).mockRejectedValue(mockError);

      const result = await jiraService.transitionIssue({
        issueKey: 'NONEXISTENT-999',
        transitionId: '21',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Issue does not exist');
    });
  });
  describe('deleteIssue', () => {
    it('deletes an issue', async () => {
      (IssueService.deleteIssue as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssue(mockIssueKey);

      expect(result.success).toBe(true);
      expect(IssueService.deleteIssue).toHaveBeenCalledWith(mockIssueKey, undefined);
    });

    it('forwards deleteSubtasks as a string', async () => {
      (IssueService.deleteIssue as Mock).mockResolvedValue(undefined);

      await jiraService.deleteIssue(mockIssueKey, true);

      expect(IssueService.deleteIssue).toHaveBeenCalledWith(mockIssueKey, 'true');
    });

    it('handles permission errors', async () => {
      (IssueService.deleteIssue as Mock).mockRejectedValue(new Error('User does not have permission to delete this issue'));

      const result = await jiraService.deleteIssue(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to delete this issue');
    });
  });
  describe('updateIssueComment', () => {
    it('updates a comment', async () => {
      const mockComment = { id: '10000', body: 'Updated text' };
      (IssueService.updateComment as Mock).mockResolvedValue(mockComment);

      const result = await jiraService.updateIssueComment(mockIssueKey, '10000', 'Updated text');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComment);
      expect(IssueService.updateComment).toHaveBeenCalledWith(mockIssueKey, '10000', undefined, { body: 'Updated text' });
    });

    it('handles comment not found errors', async () => {
      (IssueService.updateComment as Mock).mockRejectedValue(new Error('Comment does not exist'));

      const result = await jiraService.updateIssueComment(mockIssueKey, 'missing', 'text');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Comment does not exist');
    });
  });
  describe('deleteIssueComment', () => {
    it('deletes a comment', async () => {
      (IssueService.deleteComment as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueComment(mockIssueKey, '10000');

      expect(result.success).toBe(true);
      expect(IssueService.deleteComment).toHaveBeenCalledWith(mockIssueKey, '10000');
    });

    it('handles permission errors', async () => {
      (IssueService.deleteComment as Mock).mockRejectedValue(new Error('User does not have permission to delete this comment'));

      const result = await jiraService.deleteIssueComment(mockIssueKey, '10000');

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to delete this comment');
    });
  });
  describe('comment entity properties', () => {
    it('gets comment property keys', async () => {
      const mockKeys = { keys: [{ key: 'my-property', self: 'https://example.com' }] };
      (CommentService.getPropertiesKeys1 as Mock).mockResolvedValue(mockKeys);

      const result = await jiraService.getCommentPropertyKeys('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockKeys);
      expect(CommentService.getPropertiesKeys1).toHaveBeenCalledWith('10000');
    });

    it('handles errors getting comment property keys', async () => {
      (CommentService.getPropertiesKeys1 as Mock).mockRejectedValue(new Error('The comment with given key or id does not exist'));

      const result = await jiraService.getCommentPropertyKeys('99999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The comment with given key or id does not exist');
    });

    it('gets a comment property', async () => {
      const mockProperty = { key: 'my-property', value: '{"a":1}' };
      (CommentService.getProperty2 as Mock).mockResolvedValue(mockProperty);

      const result = await jiraService.getCommentProperty('10000', 'my-property');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProperty);
      expect(CommentService.getProperty2).toHaveBeenCalledWith('my-property', '10000');
    });

    it('handles errors getting a comment property', async () => {
      (CommentService.getProperty2 as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.getCommentProperty('10000', 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });

    it('sets a comment property', async () => {
      (CommentService.setProperty1 as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setCommentProperty('10000', 'my-property', '{"a":1}');

      expect(result.success).toBe(true);
      expect(CommentService.setProperty1).toHaveBeenCalledWith('my-property', '10000', '{"a":1}');
    });

    it('handles errors setting a comment property', async () => {
      (CommentService.setProperty1 as Mock).mockRejectedValue(new Error('The calling user does not have permission to administer the comment'));

      const result = await jiraService.setCommentProperty('10000', 'my-property', '{"a":1}');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The calling user does not have permission to administer the comment');
    });

    it('deletes a comment property', async () => {
      (CommentService.deleteProperty2 as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteCommentProperty('10000', 'my-property');

      expect(result.success).toBe(true);
      expect(CommentService.deleteProperty2).toHaveBeenCalledWith('my-property', '10000');
    });

    it('handles errors deleting a comment property', async () => {
      (CommentService.deleteProperty2 as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.deleteCommentProperty('10000', 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });
  });
  describe('assignIssue', () => {
    it('assigns an issue to a user', async () => {
      (IssueService.assign as Mock).mockResolvedValue(undefined);

      const result = await jiraService.assignIssue(mockIssueKey, 'john.doe');

      expect(result.success).toBe(true);
      expect(IssueService.assign).toHaveBeenCalledWith(mockIssueKey, { name: 'john.doe' });
    });

    it('unassigns an issue when username is null', async () => {
      (IssueService.assign as Mock).mockResolvedValue(undefined);

      const result = await jiraService.assignIssue(mockIssueKey, null);

      expect(result.success).toBe(true);
      expect(IssueService.assign).toHaveBeenCalledWith(mockIssueKey, { name: null });
    });

    it('handles permission errors', async () => {
      (IssueService.assign as Mock).mockRejectedValue(new Error('User does not have permission to assign the issue'));

      const result = await jiraService.assignIssue(mockIssueKey, 'john.doe');

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to assign the issue');
    });
  });
  describe('issue entity properties', () => {
    it('gets issue property keys', async () => {
      const mockKeys = { keys: [{ key: 'my-property', self: 'https://example.com' }] };
      (IssueService.getPropertiesKeys2 as Mock).mockResolvedValue(mockKeys);

      const result = await jiraService.getIssuePropertyKeys(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockKeys);
      expect(IssueService.getPropertiesKeys2).toHaveBeenCalledWith(mockIssueKey);
    });

    it('handles errors getting issue property keys', async () => {
      (IssueService.getPropertiesKeys2 as Mock).mockRejectedValue(new Error('The issue with given key or id does not exist'));

      const result = await jiraService.getIssuePropertyKeys('PROJ-999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The issue with given key or id does not exist');
    });

    it('gets an issue property', async () => {
      const mockProperty = { key: 'my-property', value: '{"a":1}' };
      (IssueService.getProperty3 as Mock).mockResolvedValue(mockProperty);

      const result = await jiraService.getIssueProperty(mockIssueKey, 'my-property');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProperty);
      expect(IssueService.getProperty3).toHaveBeenCalledWith('my-property', mockIssueKey);
    });

    it('handles errors getting an issue property', async () => {
      (IssueService.getProperty3 as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.getIssueProperty(mockIssueKey, 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });

    it('sets an issue property', async () => {
      (IssueService.setProperty2 as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setIssueProperty(mockIssueKey, 'my-property', '{"a":1}');

      expect(result.success).toBe(true);
      expect(IssueService.setProperty2).toHaveBeenCalledWith('my-property', mockIssueKey, '{"a":1}');
    });

    it('handles errors setting an issue property', async () => {
      (IssueService.setProperty2 as Mock).mockRejectedValue(new Error('The calling user does not have permission to edit the issue'));

      const result = await jiraService.setIssueProperty(mockIssueKey, 'my-property', '{"a":1}');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The calling user does not have permission to edit the issue');
    });

    it('deletes an issue property', async () => {
      (IssueService.deleteProperty3 as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueProperty(mockIssueKey, 'my-property');

      expect(result.success).toBe(true);
      expect(IssueService.deleteProperty3).toHaveBeenCalledWith('my-property', mockIssueKey);
    });

    it('handles errors deleting an issue property', async () => {
      (IssueService.deleteProperty3 as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.deleteIssueProperty(mockIssueKey, 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });
  });
  describe('issue lifecycle extras', () => {
    it('sends a manual notification', async () => {
      (IssueService.notify as Mock).mockResolvedValue(undefined);

      const result = await jiraService.notifyIssue(mockIssueKey, 'Heads up', 'Please review', undefined, true, false, true, false, ['john.doe'], ['jira-admins'], ['jira-admins']);

      expect(result.success).toBe(true);
      expect(IssueService.notify).toHaveBeenCalledWith(mockIssueKey, {
        subject: 'Heads up',
        textBody: 'Please review',
        htmlBody: undefined,
        to: {
          reporter: true,
          assignee: false,
          watchers: true,
          voters: false,
          users: [{ name: 'john.doe' }],
          groups: [{ name: 'jira-admins' }],
        },
        restrict: { groups: [{ name: 'jira-admins' }] },
      });
    });

    it('handles errors sending a manual notification', async () => {
      (IssueService.notify as Mock).mockRejectedValue(new Error('Outgoing emails are disabled'));

      const result = await jiraService.notifyIssue(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Outgoing emails are disabled');
    });

    it('pins a comment', async () => {
      (IssueService.setPinComment as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setCommentPinned(mockIssueKey, '10000', true);

      expect(result.success).toBe(true);
      expect(IssueService.setPinComment).toHaveBeenCalledWith(mockIssueKey, '10000', true);
    });

    it('handles errors pinning a comment', async () => {
      (IssueService.setPinComment as Mock).mockRejectedValue(new Error('The comment with the given id does not exist'));

      const result = await jiraService.setCommentPinned(mockIssueKey, '99999', true);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The comment with the given id does not exist');
    });

    it('gets pinned comments', async () => {
      const mockPinned = { comment: { id: '10000', body: 'Important' }, pinnedBy: 'john.doe' };
      (IssueService.getPinnedComments as Mock).mockResolvedValue(mockPinned);

      const result = await jiraService.getPinnedComments(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPinned);
      expect(IssueService.getPinnedComments).toHaveBeenCalledWith(mockIssueKey);
    });

    it('handles errors getting pinned comments', async () => {
      (IssueService.getPinnedComments as Mock).mockRejectedValue(new Error('The issue does not exist'));

      const result = await jiraService.getPinnedComments(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The issue does not exist');
    });
  });
  describe('watchers', () => {
    it('gets issue watchers', async () => {
      const mockWatchers = { watchCount: 1, watchers: [{ name: 'john.doe' }] };
      (IssueService.getIssueWatchers as Mock).mockResolvedValue(mockWatchers);

      const result = await jiraService.getIssueWatchers(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWatchers);
      expect(IssueService.getIssueWatchers).toHaveBeenCalledWith(mockIssueKey);
    });

    it('adds a watcher', async () => {
      (IssueService.addWatcher1 as Mock).mockResolvedValue(undefined);

      const result = await jiraService.addIssueWatcher(mockIssueKey, 'john.doe');

      expect(result.success).toBe(true);
      expect(IssueService.addWatcher1).toHaveBeenCalledWith(mockIssueKey, undefined, 'john.doe');
    });

    it('removes a watcher', async () => {
      (IssueService.removeWatcher1 as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueWatcher(mockIssueKey, 'john.doe');

      expect(result.success).toBe(true);
      expect(IssueService.removeWatcher1).toHaveBeenCalledWith(mockIssueKey, 'john.doe');
    });
  });
  describe('votes', () => {
    it('gets issue votes', async () => {
      const mockVotes = { votes: 3, hasVoted: false };
      (IssueService.getVotes as Mock).mockResolvedValue(mockVotes);

      const result = await jiraService.getIssueVotes(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVotes);
    });

    it('adds a vote', async () => {
      (IssueService.addVote as Mock).mockResolvedValue(undefined);

      const result = await jiraService.addIssueVote(mockIssueKey);

      expect(result.success).toBe(true);
      expect(IssueService.addVote).toHaveBeenCalledWith(mockIssueKey);
    });

    it('removes a vote', async () => {
      (IssueService.removeVote as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueVote(mockIssueKey);

      expect(result.success).toBe(true);
      expect(IssueService.removeVote).toHaveBeenCalledWith(mockIssueKey);
    });

    it('handles errors when voting is disabled', async () => {
      (IssueService.addVote as Mock).mockRejectedValue(new Error('Voting is disabled'));

      const result = await jiraService.addIssueVote(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Voting is disabled');
    });
  });
  describe('reference data lookups', () => {
    it('gets issue types', async () => {
      const mockTypes = [{ name: 'Bug' }];
      (IssuetypeService.getIssueAllTypes as Mock).mockResolvedValue(mockTypes);

      const result = await jiraService.getIssueTypes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTypes);
    });

    it('gets priorities', async () => {
      const mockPriorities = [{ name: 'High' }];
      (PriorityService.getPriorities as Mock).mockResolvedValue(mockPriorities);

      const result = await jiraService.getPriorities();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPriorities);
    });

    it('gets resolutions', async () => {
      const mockResolutions = [{ name: 'Fixed' }];
      (ResolutionService.getResolutions as Mock).mockResolvedValue(mockResolutions);

      const result = await jiraService.getResolutions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResolutions);
    });

    it('gets statuses', async () => {
      const mockStatuses = [{ name: 'Open' }];
      (StatusService.getStatuses as Mock).mockResolvedValue(mockStatuses);

      const result = await jiraService.getStatuses();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockStatuses);
    });
  });
  describe('getCreateIssueMetaIssueTypes', () => {
    it('gets issue types available for creating an issue', async () => {
      const mockTypes = { values: [{ id: '10001', name: 'Bug' }] };
      (IssueService.getCreateIssueMetaProjectIssueTypes as Mock).mockResolvedValue(mockTypes);

      const result = await jiraService.getCreateIssueMetaIssueTypes('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTypes);
      expect(IssueService.getCreateIssueMetaProjectIssueTypes).toHaveBeenCalledWith('TEST', undefined, undefined);
    });

    it('forwards pagination as strings', async () => {
      (IssueService.getCreateIssueMetaProjectIssueTypes as Mock).mockResolvedValue({});

      await jiraService.getCreateIssueMetaIssueTypes('TEST', 10, 5);

      expect(IssueService.getCreateIssueMetaProjectIssueTypes).toHaveBeenCalledWith('TEST', '10', '5');
    });
  });
  describe('getCreateIssueMetaFields', () => {
    it('gets fields available for creating an issue of a given type', async () => {
      const mockFields = { values: [{ fieldId: 'summary', required: true }] };
      (IssueService.getCreateIssueMetaFields as Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getCreateIssueMetaFields('TEST', '10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(IssueService.getCreateIssueMetaFields).toHaveBeenCalledWith('10001', 'TEST', undefined, undefined);
    });
  });
  describe('getEditIssueMeta', () => {
    it('gets fields available for editing an issue', async () => {
      const mockMeta = { fields: { summary: { required: true } } };
      (IssueService.getEditIssueMeta as Mock).mockResolvedValue(mockMeta);

      const result = await jiraService.getEditIssueMeta(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMeta);
      expect(IssueService.getEditIssueMeta).toHaveBeenCalledWith(mockIssueKey);
    });

    it('handles permission errors', async () => {
      (IssueService.getEditIssueMeta as Mock).mockRejectedValue(new Error('Issue does not exist'));

      const result = await jiraService.getEditIssueMeta('MISSING-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Issue does not exist');
    });
  });
});
