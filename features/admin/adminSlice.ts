import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Admin UI state only - data fetching is handled by React Query hooks in hooks/useAdmin.ts
interface AdminState {
  // Modal states
  isUserModalOpen: boolean;
  isCategoryModalOpen: boolean;
  isQuestionModalOpen: boolean;
  isSessionModalOpen: boolean;
  isReportModalOpen: boolean;

  // Selected item IDs for editing
  selectedUserId: string | null;
  selectedCategoryId: string | null;
  selectedQuestionId: string | null;
  selectedSessionId: string | null;
  selectedReportId: string | null;

  // Active tab in admin panel
  activeTab:
    | 'dashboard'
    | 'users'
    | 'categories'
    | 'questions'
    | 'sessions'
    | 'reports'
    | 'responses';
}

const initialState: AdminState = {
  // Modal states
  isUserModalOpen: false,
  isCategoryModalOpen: false,
  isQuestionModalOpen: false,
  isSessionModalOpen: false,
  isReportModalOpen: false,

  // Selected item IDs
  selectedUserId: null,
  selectedCategoryId: null,
  selectedQuestionId: null,
  selectedSessionId: null,
  selectedReportId: null,

  // Active tab
  activeTab: 'dashboard',
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Tab navigation
    setActiveTab: (state, action: PayloadAction<AdminState['activeTab']>) => {
      state.activeTab = action.payload;
    },

    // User modal
    openUserModal: (state, action: PayloadAction<string | null>) => {
      state.selectedUserId = action.payload;
      state.isUserModalOpen = true;
    },
    closeUserModal: (state) => {
      state.isUserModalOpen = false;
      state.selectedUserId = null;
    },

    // Category modal
    openCategoryModal: (state, action: PayloadAction<string | null>) => {
      state.selectedCategoryId = action.payload;
      state.isCategoryModalOpen = true;
    },
    closeCategoryModal: (state) => {
      state.isCategoryModalOpen = false;
      state.selectedCategoryId = null;
    },

    // Question modal
    openQuestionModal: (state, action: PayloadAction<string | null>) => {
      state.selectedQuestionId = action.payload;
      state.isQuestionModalOpen = true;
    },
    closeQuestionModal: (state) => {
      state.isQuestionModalOpen = false;
      state.selectedQuestionId = null;
    },

    // Session modal
    openSessionModal: (state, action: PayloadAction<string | null>) => {
      state.selectedSessionId = action.payload;
      state.isSessionModalOpen = true;
    },
    closeSessionModal: (state) => {
      state.isSessionModalOpen = false;
      state.selectedSessionId = null;
    },

    // Report modal
    openReportModal: (state, action: PayloadAction<string | null>) => {
      state.selectedReportId = action.payload;
      state.isReportModalOpen = true;
    },
    closeReportModal: (state) => {
      state.isReportModalOpen = false;
      state.selectedReportId = null;
    },

    // Reset state
    resetAdminState: () => initialState,
  },
});

export const {
  setActiveTab,
  openUserModal,
  closeUserModal,
  openCategoryModal,
  closeCategoryModal,
  openQuestionModal,
  closeQuestionModal,
  openSessionModal,
  closeSessionModal,
  openReportModal,
  closeReportModal,
  resetAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;
