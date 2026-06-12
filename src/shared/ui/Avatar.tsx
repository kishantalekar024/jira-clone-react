import { cn } from '@/shared/lib/cn';

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
  rounded?: boolean;
  className?: string;
  fallbackText?: string;
};

function getInitials(text: string): string {
  return text
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');
}

export function Avatar({
  src,
  alt,
  size = 24,
  rounded = true,
  className,
  fallbackText = '',
}: AvatarProps) {
  const initials = getInitials(fallbackText);

  if (!src && !initials) {
    return null;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center overflow-hidden bg-[var(--color-bg-light)] text-xs font-medium text-[var(--color-text-dark)]',
        rounded ? 'rounded-full' : 'rounded-[3px]',
        className,
      )}
      style={{ width: size, height: size }}
      aria-label={alt ?? fallbackText}
      title={alt ?? fallbackText}
    >
      {src ? (
        <img src={src} alt={alt ?? fallbackText} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
