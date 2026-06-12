import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom';
import { ProjectLayout } from '@/app/layouts/ProjectLayout';
import { BoardPage } from '@/features/project/pages/board/BoardPage';
import { SettingsPage } from '@/features/project/pages/settings/SettingsPage';
import { IssueDetailPage } from '@/features/project/pages/issue-detail/IssueDetailPage';
import { WipPage } from '@/features/wip/WipPage';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-lightest)] p-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-[var(--color-text-medium)]">
          Check the URL or return to the project board.
        </p>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/project/board" replace />} />
        <Route path="/project" element={<ProjectLayout />}>
          <Route index element={<Navigate to="board" replace />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="issue/:issueId" element={<IssueDetailPage />} />
        </Route>
        <Route path="/wip" element={<WipPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
