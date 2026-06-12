import { useMemo } from 'react';
import { Avatar, Dropdown, Icon } from '@/shared/ui';
import type { Issue, IssuePriority, IssueStatus, User } from '@/shared/types/domain';

type IssueMetaSectionProps = {
  issue: Issue;
  users: User[];
  onPatch: (patch: Partial<Issue>) => void;
};

/* ── Status ─────────────────────────────────────────────── */
const statusOptions: Array<{ label: string; value: IssueStatus; bg: string; color: string }> = [
  { label: 'Backlog', value: 'backlog', bg: '#dfe1e6', color: '#172b4d' },
  { label: 'Selected for Development', value: 'selected', bg: '#dae6ff', color: '#0747a6' },
  { label: 'In Progress', value: 'in-progress', bg: '#1878c8', color: '#fff' },
  { label: 'Done', value: 'done', bg: '#00875a', color: '#fff' },
];

/* ── Priority ────────────────────────────────────────────── */
type PriorityMeta = {
  label: string;
  value: IssuePriority;
  icon: 'arrow-up' | 'arrow-down';
  color: string;
};
const priorityOptions: PriorityMeta[] = [
  { label: 'Lowest', value: 'lowest', icon: 'arrow-down', color: '#57A55A' },
  { label: 'Low', value: 'low', icon: 'arrow-down', color: '#2D8738' },
  { label: 'Medium', value: 'medium', icon: 'arrow-up', color: '#E97F33' },
  { label: 'High', value: 'high', icon: 'arrow-up', color: '#E9494A' },
  { label: 'Highest', value: 'highest', icon: 'arrow-up', color: '#CD1317' },
];

/* ── Shared menu item style ──────────────────────────────── */
const menuItemCls =
  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-text-dark)] hover:bg-[var(--color-bg-light)] transition-colors';

export function IssueMetaSection({ issue, users, onPatch }: IssueMetaSectionProps) {
  const userById = useMemo(
    () => users.reduce<Record<string, User>>((acc, u) => ({ ...acc, [u.id]: u }), {}),
    [users],
  );

  const currentStatus = statusOptions.find((o) => o.value === issue.status)!;
  const currentPriority = priorityOptions.find((o) => o.value === issue.priority)!;
  const reporter = userById[issue.reporterId];
  const assignees = issue.userIds.map((id) => userById[id]).filter(Boolean) as User[];
  const unassigned = users.filter((u) => !issue.userIds.includes(u.id));

  return (
    <div className="space-y-5">
      {/* ── Status ── */}
      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-medium)]">
          Status
        </div>
        <Dropdown
          align="left"
          trigger={
            <button
              type="button"
              className="rounded px-3 py-1 text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-80"
              style={{ background: currentStatus.bg, color: currentStatus.color }}
            >
              {currentStatus.label}
            </button>
          }
          content={(close) => (
            <div>
              {statusOptions
                .filter((o) => o.value !== issue.status)
                .map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={menuItemCls}
                    onClick={() => {
                      onPatch({ status: o.value });
                      close();
                    }}
                  >
                    <span
                      className="rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
                      style={{ background: o.bg, color: o.color }}
                    >
                      {o.label}
                    </span>
                  </button>
                ))}
            </div>
          )}
        />
      </div>

      {/* ── Reporter ── */}
      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-medium)]">
          Reporter
        </div>
        <Dropdown
          align="left"
          trigger={
            reporter ? (
              <button
                type="button"
                className="flex items-center gap-2 rounded border border-[var(--color-border-light)] bg-white px-2 py-1.5 hover:bg-[var(--color-bg-light)] transition-colors"
              >
                <Avatar src={reporter.avatarUrl} fallbackText={reporter.name} size={20} />
                <span className="text-sm text-[var(--color-text-dark)]">{reporter.name}</span>
              </button>
            ) : (
              <button
                type="button"
                className="rounded border border-dashed border-[var(--color-border-light)] px-3 py-1.5 text-sm text-[var(--color-text-medium)]"
              >
                None
              </button>
            )
          }
          content={(close) => (
            <div>
              {users
                .filter((u) => u.id !== issue.reporterId)
                .map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className={menuItemCls}
                    onClick={() => {
                      onPatch({ reporterId: u.id });
                      close();
                    }}
                  >
                    <Avatar src={u.avatarUrl} fallbackText={u.name} size={20} />
                    {u.name}
                  </button>
                ))}
            </div>
          )}
        />
      </div>

      {/* ── Assignees ── */}
      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-medium)]">
          Assignees
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {assignees.map((u) => (
            <span
              key={u.id}
              className="flex items-center gap-1.5 rounded border border-[var(--color-border-light)] bg-white px-2 py-1"
            >
              <Avatar src={u.avatarUrl} fallbackText={u.name} size={18} />
              <span className="text-sm text-[var(--color-text-dark)]">{u.name}</span>
              <button
                type="button"
                title="Remove"
                className="ml-0.5 text-[var(--color-text-light)] hover:text-[var(--color-text-dark)]"
                onClick={() => onPatch({ userIds: issue.userIds.filter((id) => id !== u.id) })}
              >
                <Icon name="times" size={12} />
              </button>
            </span>
          ))}
          {unassigned.length > 0 ? (
            <Dropdown
              align="left"
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-1 rounded border border-dashed border-[var(--color-border-light)] px-2 py-1 text-sm text-[var(--color-text-medium)] hover:bg-[var(--color-bg-light)] transition-colors"
                >
                  <Icon name="plus" size={13} />
                  Add more
                </button>
              }
              content={(close) => (
                <div>
                  {unassigned.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      className={menuItemCls}
                      onClick={() => {
                        onPatch({ userIds: [...issue.userIds, u.id] });
                        close();
                      }}
                    >
                      <Avatar src={u.avatarUrl} fallbackText={u.name} size={20} />
                      {u.name}
                    </button>
                  ))}
                </div>
              )}
            />
          ) : null}
        </div>
      </div>

      {/* ── Priority ── */}
      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-medium)]">
          Priority
        </div>
        <Dropdown
          align="left"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded border border-[var(--color-border-light)] bg-white px-2 py-1.5 hover:bg-[var(--color-bg-light)] transition-colors"
            >
              <Icon
                name={currentPriority.icon}
                size={16}
                style={{ color: currentPriority.color }}
              />
              <span className="text-sm capitalize text-[var(--color-text-dark)]">
                {currentPriority.label}
              </span>
            </button>
          }
          content={(close) => (
            <div>
              {priorityOptions
                .filter((o) => o.value !== issue.priority)
                .map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={menuItemCls}
                    onClick={() => {
                      onPatch({ priority: o.value });
                      close();
                    }}
                  >
                    <Icon name={o.icon} size={16} style={{ color: o.color }} />
                    <span className="capitalize">{o.label}</span>
                  </button>
                ))}
            </div>
          )}
        />
      </div>
    </div>
  );
}
