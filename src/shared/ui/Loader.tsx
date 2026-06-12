import { cn } from '@/shared/lib/cn';

type LoaderProps = {
  size?: number;
  className?: string;
};

export function Loader({ size = 18, className }: LoaderProps) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-[var(--color-border-light)] border-t-[var(--color-primary)]',
        className,
      )}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
