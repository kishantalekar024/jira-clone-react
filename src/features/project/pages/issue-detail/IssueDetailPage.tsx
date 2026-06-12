import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IssueDetailPanel } from '@/features/project/components/issues/IssueDetailPanel';
import { useProjectDataStore } from '@/features/project/stores/projectDataStore';
import { useProjectView } from '@/features/project/query/useProjectView';
import { Breadcrumbs, Button } from '@/shared/ui';

export function IssueDetailPage() {
  const navigate = useNavigate();
  const { issueId } = useParams();
  const { project, issueById } = useProjectView();
  const deleteIssue = useProjectDataStore((state) => state.deleteIssue);
  const issue = issueId ? issueById[issueId] : undefined;

  return (
    <section className="p-6 lg:p-8">
      <Breadcrumbs items={['Projects', project.name, 'Issues', issueId ?? 'Unknown']} />
      <h1 className="mt-3 text-2xl font-semibold text-[var(--color-text-darkest)]">Issue Detail</h1>

      <div className="mt-4 rounded bg-white p-4">
        {issueId && issue ? (
          <IssueDetailPanel
            issueId={issueId}
            onDelete={(targetIssueId) => {
              deleteIssue(targetIssueId);
              navigate('/project/board');
            }}
            onClose={() => navigate('/project/board')}
          />
        ) : issueId ? (
          <div className="space-y-3">
            <p className="text-sm text-[var(--color-text-medium)]">
              The issue was deleted or does not exist.
            </p>
            <Button variant="secondary" onClick={() => navigate('/project/board')}>
              Back to board
            </Button>
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-medium)]">Missing issue id.</p>
        )}
      </div>
    </section>
  );
}
