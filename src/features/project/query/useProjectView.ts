import { useMemo } from 'react';
import { issueStatuses } from '@/features/project/selectors/issues';
import {
  matchesIssueSearch,
  sortByListPosition,
} from '@/features/project/selectors/projectSelectors';
import { useFilterStore } from '@/features/project/stores/filterStore';
import { useProjectDataStore } from '@/features/project/stores/projectDataStore';
import type { IssueStatus } from '@/shared/types/domain';

export function useProjectView() {
  const project = useProjectDataStore((state) => state.project);
  const users = useProjectDataStore((state) => state.users);
  const issues = useProjectDataStore((state) => state.issues);
  const currentUserId = useProjectDataStore((state) => state.currentUserId);

  const searchTerm = useFilterStore((state) => state.searchTerm);
  const selectedUserIds = useFilterStore((state) => state.userIds);
  const onlyMyIssues = useFilterStore((state) => state.onlyMyIssues);
  const ignoreResolved = useFilterStore((state) => state.ignoreResolved);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const includeSearch = matchesIssueSearch(issue, searchTerm);
      const includeUsers =
        selectedUserIds.length === 0 ||
        issue.userIds.some((userId) => selectedUserIds.includes(userId));
      const includeMine = !onlyMyIssues || issue.userIds.includes(currentUserId);
      const includeResolved = !ignoreResolved || issue.status !== 'done';
      return includeSearch && includeUsers && includeMine && includeResolved;
    });
  }, [currentUserId, ignoreResolved, issues, onlyMyIssues, searchTerm, selectedUserIds]);

  const groupedByStatus = useMemo(() => {
    const grouped = issueStatuses.reduce<Record<IssueStatus, typeof filteredIssues>>(
      (acc, status) => {
        acc[status] = sortByListPosition(filteredIssues.filter((issue) => issue.status === status));
        return acc;
      },
      {
        backlog: [],
        selected: [],
        'in-progress': [],
        done: [],
      },
    );
    return grouped;
  }, [filteredIssues]);

  const issueById = useMemo(() => {
    return issues.reduce<Record<string, (typeof issues)[number]>>((acc, issue) => {
      acc[issue.id] = issue;
      return acc;
    }, {});
  }, [issues]);

  const allByStatus = useMemo(() => {
    const grouped = issueStatuses.reduce<Record<IssueStatus, typeof issues>>(
      (acc, status) => {
        acc[status] = sortByListPosition(issues.filter((issue) => issue.status === status));
        return acc;
      },
      {
        backlog: [],
        selected: [],
        'in-progress': [],
        done: [],
      },
    );
    return grouped;
  }, [issues]);

  return {
    project,
    users,
    currentUserId,
    issues,
    filteredIssues,
    groupedByStatus,
    allByStatus,
    issueById,
  };
}
