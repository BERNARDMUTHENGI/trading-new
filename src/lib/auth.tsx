import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { email: string; name: string; balance: number };

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateBalance: (delta: number) => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem("auth_user", JSON.stringify(u));
    else localStorage.removeItem("auth_user");
  };

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    persist({ email, name: email.split("@")[0] || "Trader", balance: 10000 });
  };
  const signup = async (email: string, _password: string, name: string) => {
    await new Promise((r) => setTimeout(r, 500));
    persist({ email, name: name || email.split("@")[0], balance: 10000 });
  };
  const logout = () => persist(null);
  const updateBalance = (delta: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, balance: Math.max(0, prev.balance + delta) };
      localStorage.setItem("auth_user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ user, login, signup, logout, updateBalance }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
};