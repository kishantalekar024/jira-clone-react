import { useState } from 'react';
import { sanitizeRichHtml, stripHtmlToText } from '@/shared/lib/sanitizeHtml';
import { Button } from '@/shared/ui';

type IssueDescriptionSectionProps = {
  description: string;
  onSave: (description: string) => void;
};

export function IssueDescriptionSection({ description, onSave }: IssueDescriptionSectionProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(stripHtmlToText(description));

  const safeHtml = sanitizeRichHtml(description);
  const hasRenderableHtml = safeHtml.trim().length > 0;

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(stripHtmlToText(description));
          setEditing(true);
        }}
        className="min-h-24 w-full rounded-[3px] border border-transparent px-3 py-2 text-left text-sm text-[var(--color-text-dark)] hover:border-[var(--color-border-light)] hover:bg-[var(--color-bg-light)]"
      >
        {hasRenderableHtml ? (
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        ) : (
          'Add description...'
        )}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="min-h-24 w-full rounded-[3px] border border-[var(--color-border-light)] bg-white px-3 py-2 text-sm outline-none focus:border-[#4c9aff] focus:ring-1 focus:ring-[#4c9aff]"
      />
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            onSave(draft);
            setEditing(false);
          }}
        >
          Save
        </Button>
        <Button
          variant="empty"
          size="sm"
          onClick={() => {
            setDraft(stripHtmlToText(description));
            setEditing(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
