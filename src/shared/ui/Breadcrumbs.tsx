import { Fragment } from 'react';

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbsProps = {
  items: Array<string | BreadcrumbItem>;
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="text-sm text-[var(--color-text-medium)]">
      {items.map((item, index) => {
        const label = typeof item === 'string' ? item : item.label;
        return (
          <Fragment key={`${label}-${index}`}>
            {index > 0 ? <span className="mx-2">/</span> : null}
            <span>{label}</span>
          </Fragment>
        );
      })}
    </div>
  );
}
