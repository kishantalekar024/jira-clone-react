import { useMemo, useState } from 'react';
import { IssueResultItem } from '@/features/project/components/search/IssueResultItem';
import { useProjectView } from '@/features/project/query';
import { Input } from '@/shared/ui';

type SearchDrawerContentProps = {
  onOpenIssue: (issueId: string) => void;
};

export function SearchDrawerContent({ onOpenIssue }: SearchDrawerContentProps) {
  const { issues, users } = useProjectView();
  const [query, setQuery] = useState('');

  const byUserId = useMemo(
    () =>
      users.reduce<Record<string, (typeof users)[number]>>(
        (acc, user) => ({ ...acc, [user.id]: user }),
        {},
      ),
    [users],
  );

  const result = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return {
        title: 'Recent Issues',
        issues: issues.slice(0, 8),
      };
    }

    return {
      title: 'Issue Results',
      issues: issues.filter(
        (issue) =>
          issue.title.toLowerCase().includes(normalized) ||
          issue.description.toLowerCase().includes(normalized),
      ),
    };
  }, [issues, query]);

  return (
    <div className="space-y-3">
      <Input
        icon="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        clearable
        onClear={() => setQuery('')}
        placeholder="Search issues by summary, description..."
        autoFocus
      />

      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-medium)]">
        {result.title}
      </div>

      <div className="space-y-2">
        {result.issues.length ? (
          result.issues.map((issue) => (
            <IssueResultItem
              key={issue.id}
              issue={issue}
              assignee={byUserId[issue.userIds[0] ?? '']}
              onOpenIssue={onOpenIssue}
            />
          ))
        ) : (
          <div className="rounded border border-dashed border-[var(--color-border-light)] p-4 text-sm text-[var(--color-text-medium)]">
            No issues matched your search.
          </div>
        )}
      </div>
    </div>
  );
}
