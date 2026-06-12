/**
 * Stateless card body used inside DragOverlay.
 * No dnd-kit hooks – just renders the issue visually.
 */
import type { ComponentProps } from 'react';
import type { Issue, User } from '@/shared/types/domain';
import { Avatar, Icon, Tooltip } from '@/shared/ui';

const priorityIconMap: Record<Issue['priority'], ComponentProps<typeof Icon>['name']> = {
  lowest: 'arrow-down',
  low: 'arrow-down',
  medium: 'arrow-up',
  high: 'arrow-up',
  highest: 'arrow-up',
};

const priorityColorMap: Record<Issue['priority'], string> = {
  lowest: '#57A55A',
  low: '#2D8738',
  medium: '#E97F33',
  high: '#E9494A',
  highest: '#CD1317',
};

const issueIconMap: Record<Issue['type'], ComponentProps<typeof Icon>['name']> = {
  bug: 'bug',
  story: 'story',
  task: 'task',
};

type IssueCardOverlayProps = {
  issue: Issue;
  assignees: User[];
};

export function IssueCardOverlay({ issue, assignees }: IssueCardOverlayProps) {
  return (
    <article className="cursor-grabbing select-none rounded-[3px] border border-[#4c9aff] bg-white p-3 shadow-xl opacity-95">
      <p className="text-sm text-[var(--color-text-darkest)]">{issue.title}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {assignees.map((assignee) => (
              <Tooltip key={assignee.id} content={`Assignee: ${assignee.name}`}>
                <Avatar
                  src={assignee.avatarUrl}
                  fallbackText={assignee.name}
                  size={22}
                  className="border border-white"
                />
              </Tooltip>
            ))}
          </div>
          <span className="text-xs uppercase text-[var(--color-text-medium)]">
            {issue.type}-{issue.id}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="rounded p-1">
            <Icon
              name={issueIconMap[issue.type]}
              size={18}
              className="text-[var(--color-text-medium)]"
            />
          </span>
          <Icon
            name={priorityIconMap[issue.priority]}
            size={18}
            style={{ color: priorityColorMap[issue.priority] }}
          />
        </div>
      </div>
    </article>
  );
}
