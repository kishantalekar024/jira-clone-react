import type { Issue, IssueStatus } from '@/shared/types/domain';

export const issueStatuses: IssueStatus[] = ['backlog', 'selected', 'in-progress', 'done'];

export function getIssueStatusLabel(status: IssueStatus): string {
  if (status === 'backlog') {
    return 'Backlog';
  }
  if (status === 'selected') {
    return 'Selected for Development';
  }
  if (status === 'in-progress') {
    return 'In Progress';
  }
  return 'Done';
}

export function groupIssuesByStatus(issues: Issue[]): Record<IssueStatus, Issue[]> {
  return issueStatuses.reduce<Record<IssueStatus, Issue[]>>(
    (acc, status) => {
      acc[status] = issues.filter((issue) => issue.status === status);
      return acc;
    },
    {
      backlog: [],
      selected: [],
      'in-progress': [],
      done: [],
    },
  );
}
