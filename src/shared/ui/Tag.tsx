import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

type TagTone = 'neutral' | 'primary' | 'success' | 'danger' | 'warning';

type TagProps = {
  tone?: TagTone;
  children: ReactNode;
  className?: string;
};

const toneClass: Record<TagTone, string> = {
  neutral: 'bg-[var(--color-bg-light)] text-[var(--color-text-dark)]',
  primary: 'bg-[#d2e5fe] text-[#0747a6]',
  success: 'bg-[#e4fcef] text-[#006644]',
  danger: 'bg-[#ffebe6] text-[#bf2600]',
  warning: 'bg-[#fffae6] text-[#7a5d00]',
};

export function Tag({ tone = 'neutral', children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[3px] px-2 py-1 text-xs font-medium',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
