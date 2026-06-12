import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/Icon';

type InputProps = {
  icon?: React.ComponentProps<typeof Icon>['name'];
  iconSize?: number;
  containerClassName?: string;
  clearable?: boolean;
  onClear?: () => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon, iconSize = 16, className, containerClassName, clearable, onClear, value, ...props },
  ref,
) {
  const hasValue = typeof value === 'string' ? value.length > 0 : false;

  return (
    <div className={cn('relative', containerClassName)}>
      {icon ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-medium)]">
          <Icon name={icon} size={iconSize} />
        </span>
      ) : null}
      <input
        ref={ref}
        value={value}
        className={cn(
          'h-9 w-full rounded-[3px] border border-[var(--color-border-light)] bg-white px-3 text-sm text-[var(--color-text-darkest)] outline-none transition focus:border-[#4c9aff] focus:ring-1 focus:ring-[#4c9aff]',
          icon && 'pl-10',
          clearable && hasValue && 'pr-10',
          className,
        )}
        {...props}
      />
      {clearable && hasValue ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--color-text-medium)] hover:bg-[var(--color-bg-light)]"
          aria-label="Clear input"
        >
          <Icon name="times" size={14} />
        </button>
      ) : null}
    </div>
  );
});
