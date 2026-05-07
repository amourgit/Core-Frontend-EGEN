// Mock @eigen/esm-auth pour les tests
export const useAuthContext = () => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  permissions: [],
  roles: [],
  login: jest.fn(),
  logout: jest.fn(),
  hasPermission: jest.fn().mockReturnValue(false),
  hasRole: jest.fn().mockReturnValue(false),
  refreshUser: jest.fn(),
});
export const AuthProvider = ({ children }: { children: React.ReactNode }) => children;
export const tokenManager = { getAccessToken: () => null, hasValidToken: () => false };
export const usePermissions = () => ({ permissions: [], roles: [], hasPermission: () => false, hasRole: () => false });
export const useAuth = useAuthContext;
