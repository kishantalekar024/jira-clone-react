import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Issue, IssueStatus } from '@/shared/types/domain';
import { getIssueStatusLabel } from '@/features/project/selectors/issues';
import { IssueCard } from '@/features/project/components/board/IssueCard';

type BoardColumnProps = {
  status: IssueStatus;
  issues: Issue[];
};

export function BoardColumn({ status, issues }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'column',
      status,
    },
  });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-64 rounded border p-2 transition-colors duration-200 ${
        isOver ? 'border-dashed border-[#4c9aff] bg-[#e9f2ff]' : 'border-transparent bg-[#f4f5f7]'
      }`}
    >
      <header className="px-2 pb-3 pt-2 text-xs uppercase tracking-wide text-[var(--color-text-medium)]">
        {getIssueStatusLabel(status)} <span className="normal-case">{issues.length}</span>
      </header>
      <SortableContext
        items={issues.map((issue) => issue.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
          {isOver ? (
            <div className="rounded border border-dashed border-[#4c9aff] bg-white/60 px-2 py-1 text-[11px] text-[#0052cc]">
              Drop issue here
            </div>
          ) : null}
        </div>
      </SortableContext>
    </section>
  );
}
