import { format } from 'date-fns';
import { IssueCommentsSection } from '@/features/project/components/issues/IssueCommentsSection';
import { IssueDescriptionSection } from '@/features/project/components/issues/IssueDescriptionSection';
import { IssueMetaSection } from '@/features/project/components/issues/IssueMetaSection';
import { IssueTitleSection } from '@/features/project/components/issues/IssueTitleSection';
import { useProjectDataStore } from '@/features/project/stores/projectDataStore';
import { Button, Icon, Tooltip } from '@/shared/ui';
import type { ComponentProps } from 'react';

const typeColorMap: Record<string, string> = {
  bug: '#e44d42',
  story: '#65ba43',
  task: '#4bade8',
};

const typeIconMap: Record<string, ComponentProps<typeof Icon>['name']> = {
  bug: 'bug',
  story: 'story',
  task: 'task',
};

type IssueDetailPanelProps = {
  issueId: string;
  canClose?: boolean;
  canOpenFullPage?: boolean;
  onClose?: () => void;
  onOpenFullPage?: (issueId: string) => void;
  onDelete?: (issueId: string) => void;
};

export function IssueDetailPanel({
  issueId,
  canClose,
  canOpenFullPage,
  onClose,
  onOpenFullPage,
  onDelete,
}: IssueDetailPanelProps) {
  const issue = useProjectDataStore((state) => state.issues.find((item) => item.id === issueId));
  const users = useProjectDataStore((state) => state.users);
  const currentUserId = useProjectDataStore((state) => state.currentUserId);
  const updateIssue = useProjectDataStore((state) => state.updateIssue);
  const addComment = useProjectDataStore((state) => state.addComment);

  if (!issue) {
    return <p className="text-sm text-[var(--color-text-medium)]">Issue not found.</p>;
  }

  return (
    <div>
      {/* Toolbar: type icon left, actions right — matches Angular layout */}
      <div className="mb-4 flex items-center text-[var(--color-text-darkest)]">
        <Tooltip content={issue.type}>
          <Icon
            name={typeIconMap[issue.type] ?? 'task'}
            size={20}
            style={{ color: typeColorMap[issue.type] }}
          />
        </Tooltip>
        <div className="flex-1" />
        <Tooltip content="Delete issue">
          <Button variant="empty" icon="trash" onClick={() => onDelete?.(issue.id)} />
        </Tooltip>
        {canOpenFullPage ? (
          <Tooltip content="Open full page">
            <Button
              variant="empty"
              icon="external-link"
              onClick={() => onOpenFullPage?.(issue.id)}
            />
          </Tooltip>
        ) : null}
        {canClose ? (
          <Tooltip content="Close">
            <Button variant="empty" icon="times" onClick={onClose} />
          </Tooltip>
        ) : null}
      </div>

      {/* Two-column body */}
      <div className="flex flex-wrap pb-4">
        {/* Left: title, description, comments */}
        <div className="w-full space-y-4 pr-0 md:w-7/12 md:pr-8 lg:w-4/6">
          <IssueTitleSection
            title={issue.title}
            onSave={(title) => updateIssue(issue.id, { title })}
          />

          <section>
            <h3 className="mb-2 text-sm font-medium text-[var(--color-text-darkest)]">
              Description
            </h3>
            <IssueDescriptionSection
              description={issue.description}
              onSave={(description) => updateIssue(issue.id, { description })}
            />
          </section>

          <section>
            <h3 className="mb-2 text-sm font-medium text-[var(--color-text-darkest)]">Comments</h3>
            <IssueCommentsSection
              comments={issue.comments}
              users={users}
              currentUserId={currentUserId}
              onAddComment={(body) => addComment(issue.id, { body, userId: currentUserId })}
            />
          </section>
        </div>

        {/* Right: status, reporter, assignees, priority, dates */}
        <div className="w-full space-y-3 pt-1 md:w-5/12 lg:w-2/6">
          <IssueMetaSection
            issue={issue}
            users={users}
            onPatch={(patch) => updateIssue(issue.id, patch)}
          />
          <div className="border-t border-[var(--color-border-lightest)] pt-3 text-xs leading-loose text-[var(--color-text-medium)]">
            <div>Created - {format(new Date(issue.createdAt), 'MMM d, yyyy, h:mm a')}</div>
            <div>Updated - {format(new Date(issue.updatedAt), 'MMM d, yyyy, h:mm a')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
