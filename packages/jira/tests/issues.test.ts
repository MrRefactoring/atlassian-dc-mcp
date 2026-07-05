import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';

const jira = vi.hoisted(() => {
  const group = () => new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, { get: (t, p: string) => (t[p] ??= vi.fn()) });

  return { issues: group(), projects: group(), users: group(), workflows: group(), agile: group(), admin: group(), request: vi.fn() };
});
vi.mock('../src/jiraClient/index.js', () => ({ createJiraClient: () => jira }));

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
      (jira.issues.getTransitions as Mock).mockResolvedValue(mockTransitionsData);

      const result = await jiraService.getTransitions(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTransitionsData);
      expect(jira.issues.getTransitions).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey });
    });

    it('should return empty transitions array when no transitions available', async () => {
      const mockTransitionsData = {
        transitions: [],
      };
      (jira.issues.getTransitions as Mock).mockResolvedValue(mockTransitionsData);

      const result = await jiraService.getTransitions(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTransitionsData);
      expect(result.data?.transitions).toHaveLength(0);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Issue not found');
      (jira.issues.getTransitions as Mock).mockRejectedValue(mockError);

      const result = await jiraService.getTransitions(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Issue not found');
    });

    it('should handle permission errors', async () => {
      const mockError = new Error('Insufficient permissions to view transitions');
      (jira.issues.getTransitions as Mock).mockRejectedValue(mockError);

      const result = await jiraService.getTransitions('RESTRICTED-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient permissions to view transitions');
    });
  });
  describe('transitionIssue', () => {
    it('should successfully transition an issue to a new status', async () => {
      (jira.issues.doTransition as Mock).mockResolvedValue(undefined);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '21',
      });

      expect(result.success).toBe(true);
      expect(jira.issues.doTransition).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, requestBody: {
        transition: { id: '21' },
      } });
    });

    it('should successfully transition with additional fields', async () => {
      (jira.issues.doTransition as Mock).mockResolvedValue(undefined);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '31',
        fields: {
          resolution: { name: 'Done' },
          comment: { body: 'Closing this issue' },
        },
      });

      expect(result.success).toBe(true);
      expect(jira.issues.doTransition).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, requestBody: {
        transition: { id: '31' },
        fields: {
          resolution: { name: 'Done' },
          comment: { body: 'Closing this issue' },
        },
      } });
    });

    it('should handle invalid transition ID errors', async () => {
      const mockError = new Error('Invalid transition ID');
      (jira.issues.doTransition as Mock).mockRejectedValue(mockError);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '999',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid transition ID');
    });

    it('should handle missing required fields errors', async () => {
      const mockError = new Error('Resolution field is required');
      (jira.issues.doTransition as Mock).mockRejectedValue(mockError);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '31',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Resolution field is required');
    });

    it('should handle permission errors', async () => {
      const mockError = new Error('User does not have permission to transition this issue');
      (jira.issues.doTransition as Mock).mockRejectedValue(mockError);

      const result = await jiraService.transitionIssue({
        issueKey: 'RESTRICTED-1',
        transitionId: '21',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to transition this issue');
    });

    it('should handle issue not found errors', async () => {
      const mockError = new Error('Issue does not exist');
      (jira.issues.doTransition as Mock).mockRejectedValue(mockError);

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
      (jira.issues.deleteIssue as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssue(mockIssueKey);

      expect(result.success).toBe(true);
      expect(jira.issues.deleteIssue).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey });
    });

    it('forwards deleteSubtasks as a string', async () => {
      (jira.issues.deleteIssue as Mock).mockResolvedValue(undefined);

      await jiraService.deleteIssue(mockIssueKey, true);

      expect(jira.issues.deleteIssue).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, deleteSubtasks: 'true' });
    });

    it('handles permission errors', async () => {
      (jira.issues.deleteIssue as Mock).mockRejectedValue(new Error('User does not have permission to delete this issue'));

      const result = await jiraService.deleteIssue(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to delete this issue');
    });
  });
  describe('updateIssueComment', () => {
    it('updates a comment', async () => {
      const mockComment = { id: '10000', body: 'Updated text' };
      (jira.issues.updateComment as Mock).mockResolvedValue(mockComment);

      const result = await jiraService.updateIssueComment(mockIssueKey, '10000', 'Updated text');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComment);
      expect(jira.issues.updateComment).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, id: '10000', requestBody: { body: 'Updated text' } });
    });

    it('handles comment not found errors', async () => {
      (jira.issues.updateComment as Mock).mockRejectedValue(new Error('Comment does not exist'));

      const result = await jiraService.updateIssueComment(mockIssueKey, 'missing', 'text');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Comment does not exist');
    });
  });
  describe('deleteIssueComment', () => {
    it('deletes a comment', async () => {
      (jira.issues.deleteComment as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueComment(mockIssueKey, '10000');

      expect(result.success).toBe(true);
      expect(jira.issues.deleteComment).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, id: '10000' });
    });

    it('handles permission errors', async () => {
      (jira.issues.deleteComment as Mock).mockRejectedValue(new Error('User does not have permission to delete this comment'));

      const result = await jiraService.deleteIssueComment(mockIssueKey, '10000');

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to delete this comment');
    });
  });
  describe('comment entity properties', () => {
    it('gets comment property keys', async () => {
      const mockKeys = { keys: [{ key: 'my-property', self: 'https://example.com' }] };
      (jira.issues.getCommentPropertiesKeys as Mock).mockResolvedValue(mockKeys);

      const result = await jiraService.getCommentPropertyKeys('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockKeys);
      expect(jira.issues.getCommentPropertiesKeys).toHaveBeenCalledWith({ commentId: '10000' });
    });

    it('handles errors getting comment property keys', async () => {
      (jira.issues.getCommentPropertiesKeys as Mock).mockRejectedValue(new Error('The comment with given key or id does not exist'));

      const result = await jiraService.getCommentPropertyKeys('99999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The comment with given key or id does not exist');
    });

    it('gets a comment property', async () => {
      const mockProperty = { key: 'my-property', value: '{"a":1}' };
      (jira.issues.getCommentProperty as Mock).mockResolvedValue(mockProperty);

      const result = await jiraService.getCommentProperty('10000', 'my-property');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProperty);
      expect(jira.issues.getCommentProperty).toHaveBeenCalledWith({ propertyKey: 'my-property', commentId: '10000' });
    });

    it('handles errors getting a comment property', async () => {
      (jira.issues.getCommentProperty as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.getCommentProperty('10000', 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });

    it('sets a comment property', async () => {
      (jira.issues.setCommentProperty as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setCommentProperty('10000', 'my-property', '{"a":1}');

      expect(result.success).toBe(true);
      expect(jira.issues.setCommentProperty).toHaveBeenCalledWith({ propertyKey: 'my-property', commentId: '10000', requestBody: '{"a":1}' });
    });

    it('handles errors setting a comment property', async () => {
      (jira.issues.setCommentProperty as Mock).mockRejectedValue(new Error('The calling user does not have permission to administer the comment'));

      const result = await jiraService.setCommentProperty('10000', 'my-property', '{"a":1}');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The calling user does not have permission to administer the comment');
    });

    it('deletes a comment property', async () => {
      (jira.issues.deleteCommentProperty as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteCommentProperty('10000', 'my-property');

      expect(result.success).toBe(true);
      expect(jira.issues.deleteCommentProperty).toHaveBeenCalledWith({ propertyKey: 'my-property', commentId: '10000' });
    });

    it('handles errors deleting a comment property', async () => {
      (jira.issues.deleteCommentProperty as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.deleteCommentProperty('10000', 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });
  });
  describe('assignIssue', () => {
    it('assigns an issue to a user', async () => {
      (jira.issues.assign as Mock).mockResolvedValue(undefined);

      const result = await jiraService.assignIssue(mockIssueKey, 'john.doe');

      expect(result.success).toBe(true);
      expect(jira.issues.assign).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, requestBody: { name: 'john.doe' } });
    });

    it('unassigns an issue when username is null', async () => {
      (jira.issues.assign as Mock).mockResolvedValue(undefined);

      const result = await jiraService.assignIssue(mockIssueKey, null);

      expect(result.success).toBe(true);
      expect(jira.issues.assign).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, requestBody: { name: null } });
    });

    it('handles permission errors', async () => {
      (jira.issues.assign as Mock).mockRejectedValue(new Error('User does not have permission to assign the issue'));

      const result = await jiraService.assignIssue(mockIssueKey, 'john.doe');

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to assign the issue');
    });
  });
  describe('issue entity properties', () => {
    it('gets issue property keys', async () => {
      const mockKeys = { keys: [{ key: 'my-property', self: 'https://example.com' }] };
      (jira.issues.getIssuePropertiesKeys as Mock).mockResolvedValue(mockKeys);

      const result = await jiraService.getIssuePropertyKeys(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockKeys);
      expect(jira.issues.getIssuePropertiesKeys).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey });
    });

    it('handles errors getting issue property keys', async () => {
      (jira.issues.getIssuePropertiesKeys as Mock).mockRejectedValue(new Error('The issue with given key or id does not exist'));

      const result = await jiraService.getIssuePropertyKeys('PROJ-999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The issue with given key or id does not exist');
    });

    it('gets an issue property', async () => {
      const mockProperty = { key: 'my-property', value: '{"a":1}' };
      (jira.issues.getIssueProperty as Mock).mockResolvedValue(mockProperty);

      const result = await jiraService.getIssueProperty(mockIssueKey, 'my-property');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProperty);
      expect(jira.issues.getIssueProperty).toHaveBeenCalledWith({ propertyKey: 'my-property', issueIdOrKey: mockIssueKey });
    });

    it('handles errors getting an issue property', async () => {
      (jira.issues.getIssueProperty as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.getIssueProperty(mockIssueKey, 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });

    it('sets an issue property', async () => {
      (jira.issues.setIssueProperty as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setIssueProperty(mockIssueKey, 'my-property', '{"a":1}');

      expect(result.success).toBe(true);
      expect(jira.issues.setIssueProperty).toHaveBeenCalledWith({ propertyKey: 'my-property', issueIdOrKey: mockIssueKey, requestBody: '{"a":1}' });
    });

    it('handles errors setting an issue property', async () => {
      (jira.issues.setIssueProperty as Mock).mockRejectedValue(new Error('The calling user does not have permission to edit the issue'));

      const result = await jiraService.setIssueProperty(mockIssueKey, 'my-property', '{"a":1}');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The calling user does not have permission to edit the issue');
    });

    it('deletes an issue property', async () => {
      (jira.issues.deleteIssueProperty as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueProperty(mockIssueKey, 'my-property');

      expect(result.success).toBe(true);
      expect(jira.issues.deleteIssueProperty).toHaveBeenCalledWith({ propertyKey: 'my-property', issueIdOrKey: mockIssueKey });
    });

    it('handles errors deleting an issue property', async () => {
      (jira.issues.deleteIssueProperty as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.deleteIssueProperty(mockIssueKey, 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });
  });
  describe('issue lifecycle extras', () => {
    it('sends a manual notification', async () => {
      (jira.issues.notify as Mock).mockResolvedValue(undefined);

      const result = await jiraService.notifyIssue(mockIssueKey, 'Heads up', 'Please review', undefined, true, false, true, false, ['john.doe'], ['jira-admins'], ['jira-admins']);

      expect(result.success).toBe(true);
      expect(jira.issues.notify).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, requestBody: {
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
      } });
    });

    it('handles errors sending a manual notification', async () => {
      (jira.issues.notify as Mock).mockRejectedValue(new Error('Outgoing emails are disabled'));

      const result = await jiraService.notifyIssue(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Outgoing emails are disabled');
    });

    it('pins a comment', async () => {
      (jira.issues.setPinComment as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setCommentPinned(mockIssueKey, '10000', true);

      expect(result.success).toBe(true);
      expect(jira.issues.setPinComment).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, id: '10000', requestBody: true });
    });

    it('handles errors pinning a comment', async () => {
      (jira.issues.setPinComment as Mock).mockRejectedValue(new Error('The comment with the given id does not exist'));

      const result = await jiraService.setCommentPinned(mockIssueKey, '99999', true);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The comment with the given id does not exist');
    });

    it('gets pinned comments', async () => {
      const mockPinned = { comment: { id: '10000', body: 'Important' }, pinnedBy: 'john.doe' };
      (jira.issues.getPinnedComments as Mock).mockResolvedValue(mockPinned);

      const result = await jiraService.getPinnedComments(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPinned);
      expect(jira.issues.getPinnedComments).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey });
    });

    it('handles errors getting pinned comments', async () => {
      (jira.issues.getPinnedComments as Mock).mockRejectedValue(new Error('The issue does not exist'));

      const result = await jiraService.getPinnedComments(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The issue does not exist');
    });
  });
  describe('watchers', () => {
    it('gets issue watchers', async () => {
      const mockWatchers = { watchCount: 1, watchers: [{ name: 'john.doe' }] };
      (jira.issues.getIssueWatchers as Mock).mockResolvedValue(mockWatchers);

      const result = await jiraService.getIssueWatchers(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWatchers);
      expect(jira.issues.getIssueWatchers).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey });
    });

    it('adds a watcher', async () => {
      (jira.issues.addWatcher as Mock).mockResolvedValue(undefined);

      const result = await jiraService.addIssueWatcher(mockIssueKey, 'john.doe');

      expect(result.success).toBe(true);
      expect(jira.issues.addWatcher).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, requestBody: 'john.doe' });
    });

    it('removes a watcher', async () => {
      (jira.issues.removeWatcher as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueWatcher(mockIssueKey, 'john.doe');

      expect(result.success).toBe(true);
      expect(jira.issues.removeWatcher).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, userName: 'john.doe' });
    });
  });
  describe('votes', () => {
    it('gets issue votes', async () => {
      const mockVotes = { votes: 3, hasVoted: false };
      (jira.issues.getVotes as Mock).mockResolvedValue(mockVotes);

      const result = await jiraService.getIssueVotes(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVotes);
    });

    it('adds a vote', async () => {
      (jira.issues.addVote as Mock).mockResolvedValue(undefined);

      const result = await jiraService.addIssueVote(mockIssueKey);

      expect(result.success).toBe(true);
      expect(jira.issues.addVote).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey });
    });

    it('removes a vote', async () => {
      (jira.issues.removeVote as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueVote(mockIssueKey);

      expect(result.success).toBe(true);
      expect(jira.issues.removeVote).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey });
    });

    it('handles errors when voting is disabled', async () => {
      (jira.issues.addVote as Mock).mockRejectedValue(new Error('Voting is disabled'));

      const result = await jiraService.addIssueVote(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Voting is disabled');
    });
  });
  describe('reference data lookups', () => {
    it('gets issue types', async () => {
      const mockTypes = [{ name: 'Bug' }];
      (jira.workflows.getIssueAllTypes as Mock).mockResolvedValue(mockTypes);

      const result = await jiraService.getIssueTypes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTypes);
    });

    it('gets priorities', async () => {
      const mockPriorities = [{ name: 'High' }];
      (jira.workflows.getPriorities as Mock).mockResolvedValue(mockPriorities);

      const result = await jiraService.getPriorities();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPriorities);
    });

    it('gets resolutions', async () => {
      const mockResolutions = [{ name: 'Fixed' }];
      (jira.workflows.getResolutions as Mock).mockResolvedValue(mockResolutions);

      const result = await jiraService.getResolutions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResolutions);
    });

    it('gets statuses', async () => {
      const mockStatuses = [{ name: 'Open' }];
      (jira.workflows.getStatuses as Mock).mockResolvedValue(mockStatuses);

      const result = await jiraService.getStatuses();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockStatuses);
    });
  });
  describe('getCreateIssueMetaIssueTypes', () => {
    it('gets issue types available for creating an issue', async () => {
      const mockTypes = { values: [{ id: '10001', name: 'Bug' }] };
      (jira.issues.getCreateIssueMetaProjectIssueTypes as Mock).mockResolvedValue(mockTypes);

      const result = await jiraService.getCreateIssueMetaIssueTypes('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTypes);
      expect(jira.issues.getCreateIssueMetaProjectIssueTypes).toHaveBeenCalledWith({ projectIdOrKey: 'TEST' });
    });

    it('forwards pagination as strings', async () => {
      (jira.issues.getCreateIssueMetaProjectIssueTypes as Mock).mockResolvedValue({});

      await jiraService.getCreateIssueMetaIssueTypes('TEST', 10, 5);

      expect(jira.issues.getCreateIssueMetaProjectIssueTypes).toHaveBeenCalledWith({ projectIdOrKey: 'TEST', maxResults: '10', startAt: '5' });
    });
  });
  describe('getCreateIssueMetaFields', () => {
    it('gets fields available for creating an issue of a given type', async () => {
      const mockFields = { values: [{ fieldId: 'summary', required: true }] };
      (jira.issues.getCreateIssueMetaFields as Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getCreateIssueMetaFields('TEST', '10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(jira.issues.getCreateIssueMetaFields).toHaveBeenCalledWith({ issueTypeId: '10001', projectIdOrKey: 'TEST' });
    });
  });
  describe('getEditIssueMeta', () => {
    it('gets fields available for editing an issue', async () => {
      const mockMeta = { fields: { summary: { required: true } } };
      (jira.issues.getEditIssueMeta as Mock).mockResolvedValue(mockMeta);

      const result = await jiraService.getEditIssueMeta(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMeta);
      expect(jira.issues.getEditIssueMeta).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey });
    });

    it('handles permission errors', async () => {
      (jira.issues.getEditIssueMeta as Mock).mockRejectedValue(new Error('Issue does not exist'));

      const result = await jiraService.getEditIssueMeta('MISSING-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Issue does not exist');
    });
  });
});
