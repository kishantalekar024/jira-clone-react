import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  side?: 'left' | 'right';
  children: ReactNode;
};

export function Drawer({ open, onOpenChange, title, side = 'left', children }: DrawerProps) {
  const panelRef = useRef<HTMLElement>(null);

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
    focusables()[0]?.focus();

    const onEsc = (event: KeyboardEvent) => {
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
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('keydown', onEsc);
      previousActive?.focus();
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-40 bg-black/30"
      onMouseDown={() => onOpenChange(false)}
      role="presentation"
    >
      <aside
        ref={panelRef}
        className={cn(
          'absolute top-0 h-full w-[460px] max-w-[92vw] bg-white p-4 shadow-xl',
          side === 'left' ? 'left-0' : 'right-0',
        )}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Drawer'}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            variant="empty"
            icon="times"
            onClick={() => onOpenChange(false)}
            aria-label="Close drawer"
          />
        </div>
        {children}
      </aside>
    </div>,
    document.body,
  );
}
