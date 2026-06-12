import type { ReactNode } from 'react';

type TooltipProps = {
  content: string;
  children: ReactNode;
};

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span title={content} aria-label={content}>
      {children}
    </span>
  );
}
