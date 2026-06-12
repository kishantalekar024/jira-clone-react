import type { ComponentProps } from 'react';
import { Avatar, Icon, Tag } from '@/shared/ui';
import type { Issue, User } from '@/shared/types/domain';

type IssueResultItemProps = {
  issue: Issue;
  assignee?: User;
  onOpenIssue: (issueId: string) => void;
};

const issueIconMap: Record<Issue['type'], ComponentProps<typeof Icon>['name']> = {
  bug: 'bug',
  story: 'story',
  task: 'task',
};

export function IssueResultItem({ issue, assignee, onOpenIssue }: IssueResultItemProps) {
  return (
    <button
      type="button"
      onClick={() => onOpenIssue(issue.id)}
      className="flex w-full items-center gap-3 rounded border border-[var(--color-border-light)] bg-white px-3 py-2 text-left transition hover:bg-[var(--color-bg-light)]"
    >
      <Icon name={issueIconMap[issue.type]} size={18} className="text-[var(--color-text-medium)]" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm text-[var(--color-text-darkest)]">{issue.title}</div>
        <div className="text-xs uppercase text-[var(--color-text-medium)]">
          {issue.type}-{issue.id}
        </div>
      </div>
      <Tag tone="neutral">{issue.priority}</Tag>
      {assignee ? <Avatar src={assignee.avatarUrl} fallbackText={assignee.name} size={22} /> : null}
    </button>
  );
}
