import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  options: SelectOption[];
  placeholder?: string;
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ options, placeholder, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-9 w-full rounded-[3px] border border-[var(--color-border-light)] bg-white px-3 text-sm text-[var(--color-text-darkest)] outline-none transition focus:border-[#4c9aff] focus:ring-1 focus:ring-[#4c9aff]',
        className,
      )}
      {...props}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
