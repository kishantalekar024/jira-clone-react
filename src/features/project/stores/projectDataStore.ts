import { create } from 'zustand';
import { mockIssues, mockProject, mockUsers } from '@/features/project/mock/projectData';
import { issueStatuses } from '@/features/project/selectors/issues';
import type { Comment, Issue, IssueStatus, Project, User } from '@/shared/types/domain';

type ProjectDataState = {
  project: Project;
  users: User[];
  issues: Issue[];
  currentUserId: string;
};

type MoveIssuePayload = {
  issueId: string;
  toStatus: IssueStatus;
  toIndex: number;
};

type ProjectDataActions = {
  setInitialData: (payload: {
    project: Project;
    users: User[];
    issues: Issue[];
    currentUserId: string;
  }) => void;
  createIssue: (payload: {
    title: string;
    description: string;
    type: Issue['type'];
    priority: Issue['priority'];
    reporterId: string;
    userIds: string[];
  }) => string;
  moveIssue: (payload: MoveIssuePayload) => void;
  updateIssue: (issueId: string, patch: Partial<Issue>) => void;
  deleteIssue: (issueId: string) => void;
  addComment: (issueId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
};

const normalizePositions = (issues: Issue[]): Issue[] => {
  const byStatus = issueStatuses.reduce<Record<IssueStatus, Issue[]>>(
    (acc, status) => {
      acc[status] = issues
        .filter((issue) => issue.status === status)
        .sort((a, b) => a.listPosition - b.listPosition)
        .map((issue, index) => ({ ...issue, listPosition: index + 1 }));
      return acc;
    },
    {
      backlog: [],
      selected: [],
      'in-progress': [],
      done: [],
    },
  );

  return issueStatuses.flatMap((status) => byStatus[status]);
};

export const useProjectDataStore = create<ProjectDataState & ProjectDataActions>((set) => ({
  project: mockProject,
  users: mockUsers,
  issues: normalizePositions(mockIssues),
  currentUserId: mockUsers[0]?.id ?? '',

  setInitialData: ({ project, users, issues, currentUserId }) =>
    set({
      project,
      users,
      issues: normalizePositions(issues),
      currentUserId,
    }),

  createIssue: ({ title, description, type, priority, reporterId, userIds }) => {
    const issueId = `${Math.floor(1000 + Math.random() * 9000)}`;
    set((state) => {
      const backlogCount = state.issues.filter((issue) => issue.status === 'backlog').length;
      const now = new Date().toISOString();
      const issue: Issue = {
        id: issueId,
        title,
        description,
        type,
        priority,
        reporterId,
        userIds,
        status: 'backlog',
        listPosition: backlogCount + 1,
        comments: [],
        createdAt: now,
        updatedAt: now,
      };
      return {
        ...state,
        issues: normalizePositions([...state.issues, issue]),
      };
    });
    return issueId;
  },

  moveIssue: ({ issueId, toStatus, toIndex }) =>
    set((state) => {
      const movingIssue = state.issues.find((issue) => issue.id === issueId);
      if (!movingIssue) {
        return state;
      }

      const fromStatus = movingIssue.status;
      const fromIssues = state.issues
        .filter((issue) => issue.status === fromStatus)
        .sort((a, b) => a.listPosition - b.listPosition);
      const targetIssues = state.issues
        .filter((issue) => issue.status === toStatus)
        .sort((a, b) => a.listPosition - b.listPosition);

      const currentIndex = fromIssues.findIndex((issue) => issue.id === issueId);
      if (currentIndex < 0) {
        return state;
      }

      const updatedFrom = fromIssues.filter((issue) => issue.id !== issueId);
      const updatedTarget = fromStatus === toStatus ? updatedFrom : targetIssues;
      const clampedIndex = Math.max(0, Math.min(toIndex, updatedTarget.length));
      const insertionIndex =
        fromStatus === toStatus && clampedIndex > currentIndex ? clampedIndex - 1 : clampedIndex;

      if (fromStatus === toStatus && currentIndex === insertionIndex) {
        return state;
      }

      updatedTarget.splice(insertionIndex, 0, {
        ...movingIssue,
        status: toStatus,
        updatedAt: new Date().toISOString(),
      });

      const untouched = state.issues.filter(
        (issue) => issue.status !== fromStatus && issue.status !== toStatus,
      );

      const merged =
        fromStatus === toStatus
          ? [...untouched, ...updatedTarget]
          : [...untouched, ...updatedFrom, ...updatedTarget];

      return { ...state, issues: normalizePositions(merged) };
    }),

  updateIssue: (issueId, patch) =>
    set((state) => ({
      ...state,
      issues: state.issues.map((issue) =>
        issue.id === issueId ? { ...issue, ...patch, updatedAt: new Date().toISOString() } : issue,
      ),
    })),

  deleteIssue: (issueId) =>
    set((state) => ({
      ...state,
      issues: normalizePositions(state.issues.filter((issue) => issue.id !== issueId)),
    })),

  addComment: (issueId, comment) =>
    set((state) => ({
      ...state,
      issues: state.issues.map((issue) => {
        if (issue.id !== issueId) {
          return issue;
        }
        return {
          ...issue,
          comments: [
            ...issue.comments,
            {
              id: `c-${issueId}-${issue.comments.length + 1}`,
              userId: comment.userId,
              body: comment.body,
              createdAt: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      }),
    })),
}));
