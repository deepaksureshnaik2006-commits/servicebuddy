import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { AuthState, UserRole } from "@/lib/types";

interface AuthContextType extends AuthState {
  login: (role: UserRole, id: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    role: null,
    customerId: null,
    adminId: null,
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(() => {
    setAuth({ role: null, customerId: null, adminId: null });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const resetAdminTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAuth(prev => {
        if (prev.role === "admin") {
          return { role: null, customerId: null, adminId: null };
        }
        return prev;
      });
    }, ADMIN_TIMEOUT_MS);
  }, []);

  // Track activity for admin session timeout
  useEffect(() => {
    if (auth.role !== "admin") return;
    resetAdminTimer();
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    const handler = () => resetAdminTimer();
    events.forEach(e => window.addEventListener(e, handler));
    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [auth.role, resetAdminTimer]);

  const login = (role: UserRole, id: number) => {
    setAuth({
      role,
      customerId: role === "customer" ? id : null,
      adminId: role === "admin" ? id : null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
