import adminReducer, {
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
} from '@/features/admin/adminSlice';

describe('adminSlice', () => {
  const initialState = {
    isUserModalOpen: false,
    isCategoryModalOpen: false,
    isQuestionModalOpen: false,
    isSessionModalOpen: false,
    isReportModalOpen: false,
    selectedUserId: null,
    selectedCategoryId: null,
    selectedQuestionId: null,
    selectedSessionId: null,
    selectedReportId: null,
    activeTab: 'dashboard' as const,
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(adminReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('setActiveTab', () => {
    it('should set active tab to users', () => {
      const state = adminReducer(initialState, setActiveTab('users'));
      expect(state.activeTab).toBe('users');
    });

    it('should set active tab to categories', () => {
      const state = adminReducer(initialState, setActiveTab('categories'));
      expect(state.activeTab).toBe('categories');
    });

    it('should set active tab to sessions', () => {
      const state = adminReducer(initialState, setActiveTab('sessions'));
      expect(state.activeTab).toBe('sessions');
    });
  });

  describe('User Modal', () => {
    it('should open user modal with id', () => {
      const state = adminReducer(initialState, openUserModal('user-123'));
      expect(state.isUserModalOpen).toBe(true);
      expect(state.selectedUserId).toBe('user-123');
    });

    it('should open user modal without id (for creating)', () => {
      const state = adminReducer(initialState, openUserModal(null));
      expect(state.isUserModalOpen).toBe(true);
      expect(state.selectedUserId).toBeNull();
    });

    it('should close user modal and clear selected id', () => {
      const openState = {
        ...initialState,
        isUserModalOpen: true,
        selectedUserId: 'user-123',
      };
      const state = adminReducer(openState, closeUserModal());
      expect(state.isUserModalOpen).toBe(false);
      expect(state.selectedUserId).toBeNull();
    });
  });

  describe('Category Modal', () => {
    it('should open category modal with id', () => {
      const state = adminReducer(initialState, openCategoryModal('cat-123'));
      expect(state.isCategoryModalOpen).toBe(true);
      expect(state.selectedCategoryId).toBe('cat-123');
    });

    it('should close category modal', () => {
      const openState = {
        ...initialState,
        isCategoryModalOpen: true,
        selectedCategoryId: 'cat-123',
      };
      const state = adminReducer(openState, closeCategoryModal());
      expect(state.isCategoryModalOpen).toBe(false);
      expect(state.selectedCategoryId).toBeNull();
    });
  });

  describe('Question Modal', () => {
    it('should open question modal with id', () => {
      const state = adminReducer(initialState, openQuestionModal('q-123'));
      expect(state.isQuestionModalOpen).toBe(true);
      expect(state.selectedQuestionId).toBe('q-123');
    });

    it('should close question modal', () => {
      const openState = {
        ...initialState,
        isQuestionModalOpen: true,
        selectedQuestionId: 'q-123',
      };
      const state = adminReducer(openState, closeQuestionModal());
      expect(state.isQuestionModalOpen).toBe(false);
      expect(state.selectedQuestionId).toBeNull();
    });
  });

  describe('Session Modal', () => {
    it('should open session modal with id', () => {
      const state = adminReducer(initialState, openSessionModal('session-123'));
      expect(state.isSessionModalOpen).toBe(true);
      expect(state.selectedSessionId).toBe('session-123');
    });

    it('should close session modal', () => {
      const openState = {
        ...initialState,
        isSessionModalOpen: true,
        selectedSessionId: 'session-123',
      };
      const state = adminReducer(openState, closeSessionModal());
      expect(state.isSessionModalOpen).toBe(false);
      expect(state.selectedSessionId).toBeNull();
    });
  });

  describe('Report Modal', () => {
    it('should open report modal with id', () => {
      const state = adminReducer(initialState, openReportModal('report-123'));
      expect(state.isReportModalOpen).toBe(true);
      expect(state.selectedReportId).toBe('report-123');
    });

    it('should close report modal', () => {
      const openState = {
        ...initialState,
        isReportModalOpen: true,
        selectedReportId: 'report-123',
      };
      const state = adminReducer(openState, closeReportModal());
      expect(state.isReportModalOpen).toBe(false);
      expect(state.selectedReportId).toBeNull();
    });
  });

  describe('resetAdminState', () => {
    it('should reset to initial state', () => {
      const modifiedState = {
        isUserModalOpen: true,
        isCategoryModalOpen: true,
        isQuestionModalOpen: true,
        isSessionModalOpen: true,
        isReportModalOpen: true,
        selectedUserId: 'user-123',
        selectedCategoryId: 'cat-123',
        selectedQuestionId: 'q-123',
        selectedSessionId: 'session-123',
        selectedReportId: 'report-123',
        activeTab: 'users' as const,
      };
      const state = adminReducer(modifiedState, resetAdminState());
      expect(state).toEqual(initialState);
    });
  });
});
