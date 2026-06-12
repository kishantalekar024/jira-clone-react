import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  widthClassName?: string;
  hideHeader?: boolean;
};

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  widthClassName,
  hideHeader,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousActive = document.activeElement as HTMLElement | null;

    const focusables = () => {
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      return nodes ? Array.from(nodes) : [];
    };

    const first = focusables()[0];
    first?.focus();

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
        return;
      }

      if (event.key === 'Tab') {
        const nodes = focusables();
        if (!nodes.length) {
          return;
        }
        const firstNode = nodes[0];
        const lastNode = nodes[nodes.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;

        if (event.shiftKey && activeElement === firstNode) {
          event.preventDefault();
          lastNode.focus();
        } else if (!event.shiftKey && activeElement === lastNode) {
          event.preventDefault();
          firstNode.focus();
        }
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
      previousActive?.focus();
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={() => onOpenChange(false)}
      role="presentation"
    >
      <div
        ref={panelRef}
        className={cn(
          'flex max-h-[90vh] w-full max-w-2xl flex-col rounded bg-white shadow-xl',
          widthClassName,
        )}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Dialog'}
      >
        {!hideHeader ? (
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border-light)] px-4 py-3">
            <h2 className="text-base font-semibold text-[var(--color-text-darkest)]">{title}</h2>
            <Button
              variant="empty"
              icon="times"
              onClick={() => onOpenChange(false)}
              aria-label="Close modal"
            />
          </div>
        ) : null}
        <div className="overflow-y-auto p-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
