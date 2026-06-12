import { create } from 'zustand';

export type FilterState = {
  searchTerm: string;
  userIds: string[];
  onlyMyIssues: boolean;
  ignoreResolved: boolean;
};

type FilterActions = {
  setSearchTerm: (searchTerm: string) => void;
  toggleUserId: (userId: string) => void;
  toggleOnlyMyIssues: () => void;
  toggleIgnoreResolved: () => void;
  resetAll: () => void;
};

const initialState: FilterState = {
  searchTerm: '',
  userIds: [],
  onlyMyIssues: false,
  ignoreResolved: false,
};

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  toggleUserId: (userId) =>
    set((state) => ({
      userIds: state.userIds.includes(userId)
        ? state.userIds.filter((id) => id !== userId)
        : [...state.userIds, userId],
    })),
  toggleOnlyMyIssues: () => set((state) => ({ onlyMyIssues: !state.onlyMyIssues })),
  toggleIgnoreResolved: () => set((state) => ({ ignoreResolved: !state.ignoreResolved })),
  resetAll: () => set(initialState),
}));
