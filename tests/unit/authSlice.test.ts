import authReducer, {
  setCredentials,
  logout,
  updateUser,
} from '@/features/auth/authSlice';
import type { User } from '@/features/users/usersApi';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('authSlice', () => {
  const mockUser: User = {
    id: '1',
    fullName: 'Test User',
    email: 'test@example.com',
    avatarUrl: null,
    role: 'CANDIDATE',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const initialState = {
    user: null,
    token: null,
    refreshToken: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual({
        user: null,
        token: null,
        refreshToken: null,
      });
    });
  });

  describe('setCredentials', () => {
    it('should set user and tokens', () => {
      const payload = {
        user: mockUser,
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      };

      const state = authReducer(initialState, setCredentials(payload));

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('access-token-123');
      expect(state.refreshToken).toBe('refresh-token-456');
    });

    it('should set tokens in localStorage', () => {
      const payload = {
        user: mockUser,
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      };

      authReducer(initialState, setCredentials(payload));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'token',
        'access-token-123'
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token-456'
      );
    });

    it('should only set accessToken when refreshToken is not provided', () => {
      const payload = {
        accessToken: 'access-token-123',
      };

      const state = authReducer(initialState, setCredentials(payload));

      expect(state.token).toBe('access-token-123');
      expect(state.refreshToken).toBeNull();
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'token',
        'access-token-123'
      );
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        'refreshToken',
        expect.anything()
      );
    });

    it('should not update user if not provided', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
      };

      const payload = {
        accessToken: 'new-access-token',
      };

      const state = authReducer(stateWithUser, setCredentials(payload));

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('new-access-token');
    });
  });

  describe('logout', () => {
    it('should clear user and tokens', () => {
      const stateWithAuth = {
        user: mockUser,
        token: 'access-token-123',
        refreshToken: 'refresh-token-456',
      };

      const state = authReducer(stateWithAuth, logout());

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
    });

    it('should remove tokens from localStorage', () => {
      const stateWithAuth = {
        user: mockUser,
        token: 'access-token-123',
        refreshToken: 'refresh-token-456',
      };

      authReducer(stateWithAuth, logout());

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('updateUser', () => {
    it('should update user fields', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
      };

      const state = authReducer(
        stateWithUser,
        updateUser({ fullName: 'Updated Name', email: 'updated@example.com' })
      );

      expect(state.user?.fullName).toBe('Updated Name');
      expect(state.user?.email).toBe('updated@example.com');
      expect(state.user?.id).toBe('1'); // Other fields should remain unchanged
    });

    it('should not update if user is null', () => {
      const state = authReducer(
        initialState,
        updateUser({ fullName: 'New Name' })
      );

      expect(state.user).toBeNull();
    });

    it('should handle partial updates', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
      };

      const state = authReducer(
        stateWithUser,
        updateUser({ avatarUrl: 'https://example.com/avatar.jpg' })
      );

      expect(state.user?.avatarUrl).toBe('https://example.com/avatar.jpg');
      expect(state.user?.fullName).toBe('Test User');
    });
  });
});
