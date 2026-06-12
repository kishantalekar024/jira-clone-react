import { create } from 'zustand';

type ProjectUiState = {
  isCreateIssueModalOpen: boolean;
  isSearchDrawerOpen: boolean;
  activeIssueId: string | null;
  isSidebarExpanded: boolean;
};

type ProjectUiActions = {
  openCreateIssueModal: () => void;
  closeCreateIssueModal: () => void;
  openSearchDrawer: () => void;
  closeSearchDrawer: () => void;
  openIssueModal: (issueId: string) => void;
  closeIssueModal: () => void;
  toggleSidebar: () => void;
};

export const useProjectUiStore = create<ProjectUiState & ProjectUiActions>((set) => ({
  isCreateIssueModalOpen: false,
  isSearchDrawerOpen: false,
  activeIssueId: null,
  isSidebarExpanded: true,
  openCreateIssueModal: () => set({ isCreateIssueModalOpen: true }),
  closeCreateIssueModal: () => set({ isCreateIssueModalOpen: false }),
  openSearchDrawer: () => set({ isSearchDrawerOpen: true }),
  closeSearchDrawer: () => set({ isSearchDrawerOpen: false }),
  openIssueModal: (issueId) => set({ activeIssueId: issueId }),
  closeIssueModal: () => set({ activeIssueId: null }),
  toggleSidebar: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
}));
