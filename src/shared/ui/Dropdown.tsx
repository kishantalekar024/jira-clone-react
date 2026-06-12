import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type DropdownProps = {
  trigger: ReactNode;
  content: ReactNode | ((close: () => void) => ReactNode);
  align?: 'left' | 'right';
};

export function Dropdown({ trigger, content, align = 'right' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const renderedContent = typeof content === 'function' ? content(close) : content;

  return (
    <div ref={rootRef} className="relative inline-block">
      <span
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
          }
          if (event.key === 'Escape') close();
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {trigger}
      </span>

      {/* Always mounted so CSS transition works on close too */}
      <div
        className={`absolute z-20 mt-1 min-w-[160px] rounded border border-[var(--color-border-light)] bg-white py-1 shadow-lg ${
          align === 'left' ? 'left-0' : 'right-0'
        }`}
        style={{
          transition: 'opacity 150ms ease, transform 150ms ease',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-6px)',
          pointerEvents: open ? 'auto' : 'none',
          visibility: open ? 'visible' : 'hidden',
        }}
        role="menu"
      >
        {renderedContent}
      </div>
    </div>
  );
}
