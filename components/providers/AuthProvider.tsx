"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authApi, tokenManager } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: "GUEST" | "OWNER") => Promise<void>;
  logout: () => void;
  updateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authApi.getMe();
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      tokenManager.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    await authApi.login({ email, password });
    await fetchUser();
    router.push("/rooms");
    router.refresh();
  };

  const register = async (email: string, password: string, name: string, role: "GUEST" | "OWNER" = "GUEST") => {
    await authApi.register({ email, password, name, role });
    await fetchUser();
    if (role === "OWNER") {
      router.push("/dashboard");
    } else {
      router.push("/rooms");
    }
    router.refresh();
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    router.push("/");
  };

  const updateUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
