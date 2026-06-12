import type { Issue } from '@/shared/types/domain';

export function matchesIssueSearch(issue: Issue, searchTerm: string): boolean {
  if (!searchTerm) {
    return true;
  }
  const term = searchTerm.toLowerCase();
  return issue.title.toLowerCase().includes(term) || issue.description.toLowerCase().includes(term);
}

export function sortByListPosition(issues: Issue[]): Issue[] {
  return [...issues].sort((a, b) => a.listPosition - b.listPosition);
}
