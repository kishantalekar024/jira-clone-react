import { Breadcrumbs, Button, Input, Select } from '@/shared/ui';

const categoryOptions = [
  { label: 'Software', value: 'software' },
  { label: 'Business', value: 'business' },
  { label: 'Marketing', value: 'marketing' },
];

export function SettingsPage() {
  return (
    <section className="p-6 lg:p-8">
      <Breadcrumbs items={['Projects', 'Angular Jira Clone', 'Settings']} />
      <h1 className="mt-3 text-2xl font-semibold">Project Settings</h1>

      <form className="mt-6 max-w-2xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]">
            Name
          </label>
          <Input defaultValue="Angular Jira Clone" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]">
            URL
          </label>
          <Input defaultValue="https://jira.trungk18.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]">
            Category
          </label>
          <Select options={categoryOptions} defaultValue="software" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]">
            Description
          </label>
          <textarea
            className="min-h-28 w-full rounded-[3px] border border-[var(--color-border-light)] bg-white px-3 py-2 text-sm outline-none focus:border-[#4c9aff] focus:ring-1 focus:ring-[#4c9aff]"
            defaultValue="Issue tracker migration settings shell."
          />
        </div>
        <div className="flex gap-2">
          <Button variant="primary" disabled>
            Save
          </Button>
          <Button variant="empty">Cancel</Button>
        </div>
      </form>
    </section>
  );
}
