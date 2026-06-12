import { NavLink } from 'react-router-dom';
import { useProjectView } from '@/features/project/query/useProjectView';
import { useProjectUiStore } from '@/features/project/stores/projectUiStore';
import { Avatar, Button, Dropdown, Icon, Tooltip } from '@/shared/ui';

const navItems = [
  { icon: 'search' as const, tooltip: 'Search issues', action: 'search' as const },
  { icon: 'plus' as const, tooltip: 'Create issue', action: 'create' as const },
];

export function ProjectNavigation() {
  const { project, users } = useProjectView();
  const isSidebarExpanded = useProjectUiStore((state) => state.isSidebarExpanded);
  const toggleSidebar = useProjectUiStore((state) => state.toggleSidebar);
  const openCreateIssueModal = useProjectUiStore((state) => state.openCreateIssueModal);
  const openSearchDrawer = useProjectUiStore((state) => state.openSearchDrawer);

  const user = users[0] ?? {
    id: 'fallback',
    name: 'User',
    avatarUrl: '',
  };

  const handleAction = (action: 'search' | 'create') => {
    if (action === 'search') {
      openSearchDrawer();
      return;
    }
    openCreateIssueModal();
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-16 flex-col bg-[var(--color-primary)] py-4 lg:flex">
        <div className="mb-4 flex h-10 items-center justify-center text-white">
          <Icon name="story" size={28} />
        </div>
        <div className="flex flex-col gap-2 px-2">
          {navItems.map((item) => (
            <Tooltip key={item.icon} content={item.tooltip}>
              <Button
                variant="empty"
                className="w-full text-white hover:bg-white/20"
                icon={item.icon}
                onClick={() => handleAction(item.action)}
                aria-label={item.tooltip}
              />
            </Tooltip>
          ))}
        </div>
        <div className="mt-auto flex flex-col items-center gap-2 px-2">
          <Avatar src={user.avatarUrl} fallbackText={user.name} size={28} />
          <Dropdown
            trigger={
              <Button
                variant="empty"
                className="w-full text-white hover:bg-white/20"
                icon="question-circle"
                aria-label="About"
              />
            }
            content={
              <div className="space-y-2 text-sm text-[var(--color-text-dark)]">
                <p>Simplified Jira clone migration in progress.</p>
                <a
                  href="https://trungk18.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--color-primary)]"
                >
                  Visit blog <Icon name="external-link" size={14} />
                </a>
              </div>
            }
          />
        </div>
      </aside>

      <aside
        className="hidden border-r border-[var(--color-border-light)] bg-white transition-all lg:block"
        style={{ width: isSidebarExpanded ? 240 : 24 }}
      >
        {isSidebarExpanded ? (
          <div className="px-4 py-6">
            <div className="mb-6 flex items-center gap-3">
              <Avatar src={user.avatarUrl} fallbackText={project.name} size={40} rounded={false} />
              <div>
                <div className="text-sm font-semibold text-[var(--color-text-darkest)]">
                  {project.name}
                </div>
                <div className="text-xs capitalize text-[var(--color-text-medium)]">
                  {project.category} Project
                </div>
              </div>
            </div>
            <nav className="space-y-1">
              <NavLink
                to="/project/board"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded px-3 py-2 text-sm ${isActive ? 'bg-[#ebf4ff] text-[var(--color-primary)]' : 'text-[var(--color-text-dark)] hover:bg-[var(--color-bg-light)]'}`
                }
              >
                <Icon name="menu" size={16} />
                Board
              </NavLink>
              <NavLink
                to="/project/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded px-3 py-2 text-sm ${isActive ? 'bg-[#ebf4ff] text-[var(--color-primary)]' : 'text-[var(--color-text-dark)] hover:bg-[var(--color-bg-light)]'}`
                }
              >
                <Icon name="settings" size={16} />
                Settings
              </NavLink>
            </nav>
          </div>
        ) : null}
      </aside>

      <button
        type="button"
        onClick={toggleSidebar}
        className="hidden h-8 w-8 self-center rounded border border-[var(--color-border-light)] bg-white text-[var(--color-text-dark)] lg:inline-flex lg:items-center lg:justify-center"
        aria-label="Toggle sidebar"
      >
        <Icon name={isSidebarExpanded ? 'chevron-left' : 'chevron-right'} size={16} />
      </button>
    </div>
  );
}
