import { useProjectView } from '@/features/project/query';
import { Breadcrumbs, Button, Icon } from '@/shared/ui';
import { BoardFilter, BoardReadOnly } from '@/features/project/components/board';

export function BoardPage() {
  const { project } = useProjectView();

  return (
    <section className="p-6 lg:p-8">
      <Breadcrumbs items={['Projects', project.name, 'Kanban Board']} />

      <header className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[var(--color-text-darkest)]">Kanban board</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">Support</Button>
          <Button variant="secondary">Storybook</Button>
          <a
            href="https://github.com/trungk18/jira-clone-angular"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-[3px] border border-[var(--color-border-light)] bg-white px-4 text-sm font-medium text-[var(--color-text-darkest)] hover:bg-[var(--color-bg-light)]"
          >
            <Icon name="external-link" size={16} />
            Source Code
          </a>
        </div>
      </header>

      <BoardFilter />
      <BoardReadOnly />
    </section>
  );
}
