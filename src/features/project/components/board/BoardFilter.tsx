import { useMemo } from 'react';
import { useProjectView } from '@/features/project/query/useProjectView';
import { useFilterStore } from '@/features/project/stores/filterStore';
import { Avatar, Button, Input, Tooltip } from '@/shared/ui';

export function BoardFilter() {
  const users = useProjectView().users;
  const searchTerm = useFilterStore((state) => state.searchTerm);
  const userIds = useFilterStore((state) => state.userIds);
  const onlyMyIssues = useFilterStore((state) => state.onlyMyIssues);
  const ignoreResolved = useFilterStore((state) => state.ignoreResolved);
  const setSearchTerm = useFilterStore((state) => state.setSearchTerm);
  const toggleUserId = useFilterStore((state) => state.toggleUserId);
  const toggleOnlyMyIssues = useFilterStore((state) => state.toggleOnlyMyIssues);
  const toggleIgnoreResolved = useFilterStore((state) => state.toggleIgnoreResolved);
  const resetAll = useFilterStore((state) => state.resetAll);

  const hasAny = useMemo(
    () => searchTerm.length > 0 || userIds.length > 0 || onlyMyIssues || ignoreResolved,
    [ignoreResolved, onlyMyIssues, searchTerm.length, userIds.length],
  );

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <div className="w-52">
        <Input
          icon="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          clearable
          onClear={() => setSearchTerm('')}
          aria-label="Search issues"
        />
      </div>

      <div className="flex items-center gap-1">
        {users.map((user) => {
          const active = userIds.includes(user.id);
          return (
            <Tooltip key={user.id} content={user.name}>
              <button
                type="button"
                onClick={() => toggleUserId(user.id)}
                className={`rounded-full p-0.5 ${active ? 'ring-2 ring-[var(--color-primary)]' : ''}`}
                aria-label={`Filter by ${user.name}`}
              >
                <Avatar
                  src={user.avatarUrl}
                  fallbackText={user.name}
                  size={32}
                  className="border border-white"
                />
              </button>
            </Tooltip>
          );
        })}
      </div>

      <Button variant="empty" active={onlyMyIssues} onClick={toggleOnlyMyIssues}>
        Only My Issues
      </Button>
      <Button variant="empty" active={ignoreResolved} onClick={toggleIgnoreResolved}>
        Ignore Resolved
      </Button>

      {hasAny ? (
        <div className="ml-2 border-l border-[var(--color-border-light)] pl-3">
          <Button variant="secondary" onClick={resetAll}>
            Clear all
          </Button>
        </div>
      ) : null}
    </div>
  );
}
