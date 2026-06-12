import { format } from 'date-fns';
import { useState } from 'react';
import { Avatar, Button } from '@/shared/ui';
import type { Comment, User } from '@/shared/types/domain';

type IssueCommentsSectionProps = {
  comments: Comment[];
  users: User[];
  currentUserId: string;
  onAddComment: (body: string) => void;
};

export function IssueCommentsSection({
  comments,
  users,
  currentUserId,
  onAddComment,
}: IssueCommentsSectionProps) {
  const [draft, setDraft] = useState('');

  const byId = users.reduce<Record<string, User>>((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  const currentUser = byId[currentUserId];

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-darkest)]">Comments</h3>

      <div className="mb-3 flex gap-2">
        <Avatar src={currentUser?.avatarUrl} fallbackText={currentUser?.name ?? 'User'} size={28} />
        <div className="flex-1 space-y-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-20 w-full rounded-[3px] border border-[var(--color-border-light)] bg-white px-3 py-2 text-sm outline-none focus:border-[#4c9aff] focus:ring-1 focus:ring-[#4c9aff]"
            placeholder="Add a comment..."
          />
          <Button
            size="sm"
            onClick={() => {
              const normalized = draft.trim();
              if (!normalized) {
                return;
              }
              onAddComment(normalized);
              setDraft('');
            }}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => {
          const author = byId[comment.userId];
          return (
            <article
              key={comment.id}
              className="rounded border border-[var(--color-border-light)] bg-white p-3"
            >
              <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-text-medium)]">
                <Avatar src={author?.avatarUrl} fallbackText={author?.name ?? 'User'} size={20} />
                <span className="font-semibold text-[var(--color-text-dark)]">
                  {author?.name ?? 'Unknown user'}
                </span>
                <span>{format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}</span>
              </div>
              <p className="text-sm text-[var(--color-text-dark)]">{comment.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
