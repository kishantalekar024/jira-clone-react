import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateIssueModalContent } from '@/features/project/components/create-issue/CreateIssueModalContent';
import { IssueDetailPanel } from '@/features/project/components/issues/IssueDetailPanel';
import { SearchDrawerContent } from '@/features/project/components/search/SearchDrawerContent';
import { useProjectView } from '@/features/project/query';
import { useProjectDataStore } from '@/features/project/stores/projectDataStore';
import { useProjectUiStore } from '@/features/project/stores/projectUiStore';
import { Button, Drawer, Modal } from '@/shared/ui';

export function ProjectOverlays() {
  const navigate = useNavigate();
  const [pendingDeleteIssueId, setPendingDeleteIssueId] = useState<string | null>(null);
  const issueById = useProjectView().issueById;

  const isCreateIssueModalOpen = useProjectUiStore((state) => state.isCreateIssueModalOpen);
  const isSearchDrawerOpen = useProjectUiStore((state) => state.isSearchDrawerOpen);
  const activeIssueId = useProjectUiStore((state) => state.activeIssueId);
  const closeCreateIssueModal = useProjectUiStore((state) => state.closeCreateIssueModal);
  const closeSearchDrawer = useProjectUiStore((state) => state.closeSearchDrawer);
  const closeIssueModal = useProjectUiStore((state) => state.closeIssueModal);

  const deleteIssue = useProjectDataStore((state) => state.deleteIssue);

  return (
    <>
      <Modal
        open={isCreateIssueModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeCreateIssueModal();
          }
        }}
        title="Create issue"
      >
        <CreateIssueModalContent
          onCreated={(issueId) => {
            closeCreateIssueModal();
            closeSearchDrawer();
            window.requestAnimationFrame(() => {
              useProjectUiStore.getState().openIssueModal(issueId);
            });
          }}
          onCancel={closeCreateIssueModal}
        />
      </Modal>

      <Drawer
        open={isSearchDrawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeSearchDrawer();
          }
        }}
        title="Search issues"
        side="left"
      >
        <SearchDrawerContent
          onOpenIssue={(issueId) => {
            closeSearchDrawer();
            useProjectUiStore.getState().openIssueModal(issueId);
          }}
        />
      </Drawer>

      <Modal
        open={Boolean(activeIssueId)}
        onOpenChange={(open) => {
          if (!open) {
            closeIssueModal();
          }
        }}
        widthClassName="max-w-5xl"
        hideHeader
      >
        {activeIssueId && issueById[activeIssueId] ? (
          <IssueDetailPanel
            issueId={activeIssueId}
            canClose
            canOpenFullPage
            onClose={closeIssueModal}
            onOpenFullPage={(issueId) => {
              closeIssueModal();
              navigate(`/project/issue/${issueId}`);
            }}
            onDelete={(issueId) => setPendingDeleteIssueId(issueId)}
          />
        ) : activeIssueId ? (
          <div className="space-y-3">
            <p className="text-sm text-[var(--color-text-medium)]">This issue no longer exists.</p>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={closeIssueModal}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(pendingDeleteIssueId)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteIssueId(null);
          }
        }}
        title="Delete issue"
      >
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-text-dark)]">
            Are you sure you want to delete this issue?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="empty" onClick={() => setPendingDeleteIssueId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!pendingDeleteIssueId) {
                  return;
                }
                deleteIssue(pendingDeleteIssueId);
                setPendingDeleteIssueId(null);
                closeIssueModal();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
