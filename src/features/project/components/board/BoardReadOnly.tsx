import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { issueStatuses } from '@/features/project/selectors/issues';
import { useProjectView } from '@/features/project/query/useProjectView';
import { useProjectDataStore } from '@/features/project/stores/projectDataStore';
import { BoardColumn } from '@/features/project/components/board/BoardColumn';
import type { IssueStatus } from '@/shared/types/domain';

export function BoardReadOnly() {
  const { groupedByStatus, allByStatus, issueById } = useProjectView();
  const moveIssue = useProjectDataStore((state) => state.moveIssue);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      return;
    }

    const movingIssue = issueById[String(active.id)];
    if (!movingIssue) {
      return;
    }

    const overData = over.data.current as
      | { type?: 'column' | 'issue'; status?: IssueStatus; issueId?: string }
      | undefined;

    const resolveColumnDrop = (status: IssueStatus) => {
      const visibleIssues = groupedByStatus[status];
      const lastVisible = visibleIssues[visibleIssues.length - 1];
      const allIssues = allByStatus[status];
      const insertionIndex = lastVisible
        ? Math.max(0, allIssues.findIndex((issue) => issue.id === lastVisible.id) + 1)
        : allIssues.length;
      return { toStatus: status, toIndex: insertionIndex };
    };

    if (overData?.type === 'column' && overData.status) {
      const { toStatus, toIndex } = resolveColumnDrop(overData.status);
      moveIssue({ issueId: movingIssue.id, toStatus, toIndex });
      return;
    }

    const targetIssueId = overData?.issueId ?? String(over.id);
    const overIssue = issueById[targetIssueId];
    if (!overIssue) {
      return;
    }

    const targetStatus = overData?.status ?? overIssue.status;
    const indexInTarget = allByStatus[targetStatus].findIndex((issue) => issue.id === overIssue.id);
    moveIssue({
      issueId: movingIssue.id,
      toStatus: targetStatus,
      toIndex: indexInTarget < 0 ? allByStatus[targetStatus].length : indexInTarget,
    });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="mt-7 grid gap-4 lg:grid-cols-4">
        {issueStatuses.map((status) => (
          <BoardColumn key={status} status={status} issues={groupedByStatus[status]} />
        ))}
      </div>
    </DndContext>
  );
}
