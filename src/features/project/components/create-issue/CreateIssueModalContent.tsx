import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { useProjectView } from '@/features/project/query';
import { useProjectDataStore } from '@/features/project/stores/projectDataStore';
import { Button, Input, Select } from '@/shared/ui';
import type { IssuePriority, IssueType } from '@/shared/types/domain';

const schema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string(),
  type: z.enum(['bug', 'story', 'task']),
  priority: z.enum(['lowest', 'low', 'medium', 'high', 'highest']),
  reporterId: z.string().min(1, 'Reporter is required'),
  userIds: z.array(z.string()),
});

type FormValue = z.infer<typeof schema>;

type CreateIssueModalContentProps = {
  onCreated: (issueId: string) => void;
  onCancel: () => void;
};

const typeOptions: Array<{ label: string; value: IssueType }> = [
  { label: 'Bug', value: 'bug' },
  { label: 'Story', value: 'story' },
  { label: 'Task', value: 'task' },
];

const priorityOptions: Array<{ label: string; value: IssuePriority }> = [
  { label: 'Lowest', value: 'lowest' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Highest', value: 'highest' },
];

export function CreateIssueModalContent({ onCreated, onCancel }: CreateIssueModalContentProps) {
  const { users, currentUserId } = useProjectView();
  const createIssue = useProjectDataStore((state) => state.createIssue);

  const reporterOptions = useMemo(
    () => users.map((user) => ({ label: user.name, value: user.id })),
    [users],
  );

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      type: 'task',
      priority: 'medium',
      reporterId: currentUserId || users[0]?.id || '',
      userIds: currentUserId ? [currentUserId] : [],
    },
  });

  const selectedUserIds = useWatch({ control, name: 'userIds' }) ?? [];
  const selectedType = useWatch({ control, name: 'type' }) ?? 'task';
  const selectedPriority = useWatch({ control, name: 'priority' }) ?? 'medium';
  const selectedReporterId = useWatch({ control, name: 'reporterId' }) ?? '';

  const onSubmit = handleSubmit((value) => {
    const issueId = createIssue({
      title: value.title,
      description: value.description,
      type: value.type,
      priority: value.priority,
      reporterId: value.reporterId,
      userIds: value.userIds,
    });
    onCreated(issueId);
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]">
          Title
        </label>
        <Input {...register('title')} placeholder="Issue title" />
        {errors.title ? (
          <p className="mt-1 text-xs text-[#bf2600]">{errors.title.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]">
          Description
        </label>
        <textarea
          {...register('description')}
          className="min-h-24 w-full rounded-[3px] border border-[var(--color-border-light)] bg-white px-3 py-2 text-sm outline-none focus:border-[#4c9aff] focus:ring-1 focus:ring-[#4c9aff]"
          placeholder="Describe the issue"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]">
            Type
          </label>
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={(event) =>
              setValue('type', event.target.value as IssueType, { shouldValidate: true })
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]">
            Priority
          </label>
          <Select
            options={priorityOptions}
            value={selectedPriority}
            onChange={(event) =>
              setValue('priority', event.target.value as IssuePriority, { shouldValidate: true })
            }
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]">
          Reporter
        </label>
        <Select
          options={reporterOptions}
          value={selectedReporterId}
          onChange={(event) => setValue('reporterId', event.target.value, { shouldValidate: true })}
        />
        {errors.reporterId ? (
          <p className="mt-1 text-xs text-[#bf2600]">{errors.reporterId.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]">
          Assignees
        </label>
        <div className="max-h-40 space-y-2 overflow-auto rounded border border-[var(--color-border-light)] bg-white p-2">
          {users.map((user) => {
            const selected = selectedUserIds.includes(user.id);
            return (
              <label
                key={user.id}
                className="flex items-center gap-2 text-sm text-[var(--color-text-dark)]"
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => {
                    setValue(
                      'userIds',
                      selected
                        ? selectedUserIds.filter((id) => id !== user.id)
                        : [...selectedUserIds, user.id],
                      { shouldValidate: true },
                    );
                  }}
                />
                {user.name}
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="empty" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Create issue
        </Button>
      </div>
    </form>
  );
}
