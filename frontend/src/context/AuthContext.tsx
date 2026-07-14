import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { User, LoginPayload, RegisterPayload, UserRole } from "../types";
import { authService } from "../services/endpoints";
import { tokenStorage } from "../services/api";

// Helper function ya kusoma data iliyopo ndani ya token (Decryption)
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isStudent: boolean;
  isClient: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Kazi ya kutengeneza User object kutokana na token iliyopo
  const getUserFromToken = useCallback((accessToken: string): User | null => {
    const decoded = parseJwt(accessToken);
    if (!decoded) return null;

    // SASA HIVI: Tunasoma role, username, na email moja kwa moja kutoka kwenye Token 
    // tuliyoiandaa kule Django (SimpleJWT). Hakuna tena kukisia kulingana na jina!
    const role: UserRole = decoded.role || "student";
    const username: string = decoded.username || "User";
    const email: string = decoded.email || "";

    return {
      id: decoded.user_id || "1",
      username: username,
      email: email,
      role: role
    };
  }, []);

  useEffect(() => {
    const token = tokenStorage.getAccess();
    if (token) {
      const parsedUser = getUserFromToken(token);
      if (parsedUser) setUser(parsedUser);
    }
    setLoading(false);

    const handler = () => {
      tokenStorage.clear();
      setUser(null);
      window.location.href = "/login";
    };
    window.removeEventListener("sfm:logout", handler); // Safisha handler wa zamani kwanza
    window.addEventListener("sfm:logout", handler);
    return () => window.removeEventListener("sfm:logout", handler);
  }, [getUserFromToken]);

  const login = useCallback(async (data: LoginPayload) => {
    const res = await authService.login(data);
    tokenStorage.set(res);
    
    // Hapa tunatengeneza user state kutokana na token, huna haja ya kupitisha username tena
    const parsedUser = getUserFromToken(res.access);
    setUser(parsedUser);
  }, [getUserFromToken]);

  const register = useCallback(async (data: RegisterPayload) => {
    await authService.register(data);
    const loginRes = await authService.login({
      username: data.username,
      password: data.password,
    });
    tokenStorage.set(loginRes);
    
    // Hapa pia tunasoma data zote moja kwa moja kutoka kwenye ile token mpya
    const parsedUser = getUserFromToken(loginRes.access);
    setUser(parsedUser);
  }, [getUserFromToken]);

  const logout = useCallback(() => {
    authService.logout();
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isStudent: user?.role === "student",
    isClient: user?.role === "client",
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getHomeRoute(role?: UserRole) {
  if (role === "client") return "/dashboard/client";
  if (role === "student") return "/dashboard/student";
  return "/login";
}