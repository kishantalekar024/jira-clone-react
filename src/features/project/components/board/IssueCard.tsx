import type { ComponentProps } from 'react';
import { useRef } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import type { Issue } from '@/shared/types/domain';
import { useProjectView } from '@/features/project/query/useProjectView';
import { useProjectUiStore } from '@/features/project/stores/projectUiStore';
import { Avatar, Icon, Tooltip } from '@/shared/ui';

type IssueCardProps = {
  issue: Issue;
};

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

export function IssueCard({ issue }: IssueCardProps) {
  const users = useProjectView().users;
  const openIssueModal = useProjectUiStore((state) => state.openIssueModal);
  const assignees = users.filter((user) => issue.userIds.includes(user.id));

  // Track pointer position on mousedown; suppress click if pointer moved (i.e. was a drag)
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: issue.id,
    data: {
      type: 'issue',
      issueId: issue.id,
      status: issue.status,
    },
    transition: {
      duration: 240,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer select-none rounded-[3px] border border-[var(--color-border-light)] bg-white p-3 shadow-sm transition-all duration-100 hover:bg-[var(--color-bg-light)] ${isDragging ? 'opacity-60 cursor-grabbing' : ''}`}
      {...attributes}
      {...listeners}
      onMouseDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e) => {
        const pos = pointerDownPos.current;
        if (!pos) return;
        if (Math.abs(e.clientX - pos.x) > 5 || Math.abs(e.clientY - pos.y) > 5) return;
        openIssueModal(issue.id);
      }}
    >
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
          <Tooltip content={issue.type}>
            <span className="rounded p-1">
              <Icon
                name={issueIconMap[issue.type]}
                size={18}
                className="text-[var(--color-text-medium)]"
              />
            </span>
          </Tooltip>
          <Tooltip content={issue.priority}>
            <Icon
              name={priorityIconMap[issue.priority]}
              size={18}
              style={{ color: priorityColorMap[issue.priority] }}
            />
          </Tooltip>
        </div>
      </div>
    </article>
  );
}
