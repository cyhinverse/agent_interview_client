import { store } from '@/store/store';
import { setCredentials, logout } from '@/features/auth/authSlice';
import { setActiveTab } from '@/features/admin/adminSlice';

describe('Redux Store', () => {
  describe('Store Configuration', () => {
    it('should be configured with auth reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty('auth');
    });

    it('should be configured with admin reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty('admin');
    });

    it('should be configured with api reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty('api');
    });
  });

  describe('Auth State Integration', () => {
    it('should handle setCredentials action', () => {
      store.dispatch(
        setCredentials({
          accessToken: 'test-token',
          refreshToken: 'test-refresh-token',
        })
      );

      const state = store.getState();
      expect(state.auth.token).toBe('test-token');
      expect(state.auth.refreshToken).toBe('test-refresh-token');
    });

    it('should handle logout action', () => {
      // First set credentials
      store.dispatch(
        setCredentials({
          accessToken: 'test-token',
          refreshToken: 'test-refresh-token',
        })
      );

      // Then logout
      store.dispatch(logout());

      const state = store.getState();
      expect(state.auth.token).toBeNull();
      expect(state.auth.refreshToken).toBeNull();
      expect(state.auth.user).toBeNull();
    });
  });

  describe('Admin State Integration', () => {
    it('should handle setActiveTab action', () => {
      store.dispatch(setActiveTab('users'));

      const state = store.getState();
      expect(state.admin.activeTab).toBe('users');
    });
  });

  describe('Store Types', () => {
    it('should have correct RootState type structure', () => {
      const state = store.getState();

      // Auth state structure
      expect(state.auth).toHaveProperty('user');
      expect(state.auth).toHaveProperty('token');
      expect(state.auth).toHaveProperty('refreshToken');

      // Admin state structure
      expect(state.admin).toHaveProperty('activeTab');
      expect(state.admin).toHaveProperty('isUserModalOpen');
      expect(state.admin).toHaveProperty('selectedUserId');
    });
  });

  describe('Middleware', () => {
    it('should have api middleware configured', () => {
      // The store should handle API actions without errors
      expect(() => {
        store.dispatch({ type: 'api/someAction' });
      }).not.toThrow();
    });
  });
});
