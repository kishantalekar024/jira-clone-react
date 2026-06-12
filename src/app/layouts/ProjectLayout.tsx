import { Outlet } from 'react-router-dom';
import { useProjectBootstrapQuery } from '@/features/project/query';
import { ProjectNavigation, ProjectOverlays } from '@/features/project/components/navigation';

export function ProjectLayout() {
  useProjectBootstrapQuery();
  return (
    <div className="min-h-screen w-full bg-[var(--color-bg-lightest)]">
      <div className="flex min-h-screen w-full max-w-[1680px]">
        <ProjectNavigation />
        <main className="min-h-screen flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <ProjectOverlays />
    </div>
  );
}
