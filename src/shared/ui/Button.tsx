import type { ButtonHTMLAttributes, ComponentProps, PropsWithChildren } from 'react';
import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/Icon';

type ButtonVariant = 'primary' | 'secondary' | 'empty' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = PropsWithChildren<
  {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ComponentProps<typeof Icon>['name'];
    iconSize?: number;
    loading?: boolean;
    active?: boolean;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:brightness-110',
  secondary:
    'bg-white text-[var(--color-text-darkest)] border border-[var(--color-border-light)] hover:bg-[var(--color-bg-light)]',
  empty: 'bg-transparent text-[var(--color-text-dark)] hover:bg-[var(--color-bg-light)]',
  danger: 'bg-[#de350b] text-white hover:brightness-105',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconSize = 16,
  loading,
  active,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[3px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        variantClass[variant],
        sizeClass[size],
        active && 'ring-1 ring-[var(--color-primary)]',
        className,
      )}
      {...props}
    >
      {loading ? <Icon name="in-progress" size={iconSize} className="animate-spin" /> : null}
      {!loading && icon ? <Icon name={icon} size={iconSize} /> : null}
      {children}
    </button>
  );
}
