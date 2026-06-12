import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { issueStatuses } from '@/features/project/selectors/issues';
import { useProjectView } from '@/features/project/query/useProjectView';
import { useProjectDataStore } from '@/features/project/stores/projectDataStore';
import { BoardColumn } from '@/features/project/components/board/BoardColumn';
import { IssueCardOverlay } from '@/features/project/components/board/IssueCardOverlay';
import type { IssueStatus } from '@/shared/types/domain';

// Prefer hovering over a card (id = issue id) over the column background (id = status string).
// Falls back to rect-intersection when pointer is not inside any droppable.
const statusIds = new Set<string>(['backlog', 'selected', 'in-progress', 'done']);

const boardCollision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  // Issue cards have numeric-ish ids; column droppables have status string ids.
  const cardHits = hits.filter((c) => !statusIds.has(String(c.id)));
  if (cardHits.length > 0) return cardHits;
  const colHits = hits.filter((c) => statusIds.has(String(c.id)));
  if (colHits.length > 0) return colHits;
  return rectIntersection(args);
};

export function BoardReadOnly() {
  const { groupedByStatus, allByStatus, issueById, users } = useProjectView();
  const moveIssue = useProjectDataStore((state) => state.moveIssue);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over) return;

    const movingIssue = issueById[String(active.id)];
    if (!movingIssue) return;

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
    if (!overIssue) return;

    const targetStatus = overData?.status ?? overIssue.status;
    const indexInTarget = allByStatus[targetStatus].findIndex((issue) => issue.id === overIssue.id);
    moveIssue({
      issueId: movingIssue.id,
      toStatus: targetStatus,
      toIndex: indexInTarget < 0 ? allByStatus[targetStatus].length : indexInTarget,
    });
  };

  const activeIssue = activeId ? issueById[activeId] : null;
  const activeAssignees = activeIssue
    ? users.filter((u) => activeIssue.userIds.includes(u.id))
    : [];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={boardCollision}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="mt-7 grid gap-4 lg:grid-cols-4">
        {issueStatuses.map((status) => (
          <BoardColumn key={status} status={status} issues={groupedByStatus[status]} />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2,0,0,1)' }}>
        {activeIssue ? <IssueCardOverlay issue={activeIssue} assignees={activeAssignees} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
