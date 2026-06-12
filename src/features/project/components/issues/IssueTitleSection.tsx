import { useState } from 'react';
import { Input } from '@/shared/ui';

type IssueTitleSectionProps = {
  title: string;
  onSave: (title: string) => void;
};

export function IssueTitleSection({ title, onSave }: IssueTitleSectionProps) {
  const [draft, setDraft] = useState(title);

  return (
    <div>
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          const normalized = draft.trim();
          if (normalized.length > 0 && normalized !== title) {
            onSave(normalized);
          }
        }}
        className="h-10 text-base font-semibold"
        aria-label="Issue title"
      />
    </div>
  );
}
