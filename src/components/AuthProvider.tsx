"use client";

import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Tip koji opisuje korisnika kog dobijamo sa back-enda
export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

// Tip za stanje autentifikacije koje delimo kroz aplikaciju
// loading – proveravamo da li je korisnik ulogovan
// unauthenticated – korisnik nije ulogovan
// authenticated – korisnik je ulogovan i imamo njegove podatke
type AuthState =
  | { status: "loading"; user: null }
  | { status: "unauthenticated"; user: null }
  | { status: "authenticated"; user: User };

// Context Shape – tip podatka koji prosleđujemo React Context-u
// Pored stanja sadrži i funkcije za AuthProvider
type Ctx = AuthState & {
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

// Kreiramo AuthContext koji će biti dostupan kroz celu aplikaciju
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Lokalno stanje koje čuva auth status i korisnika
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
  });

  // refresh funkcija poziva /api/auth/me rutu na back-endu
  // Proverava da li postoji validna sesija (cookie)
  // useCallback obezbeđuje da se funkcija ne rekreira pri svakom renderu
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include", // omogućava slanje cookie-ja
      });
      const data = await res.json();
      if (data?.user) {
        setState({ status: "authenticated", user: data.user });
      } else {
        setState({ status: "unauthenticated", user: null });
      }
    } catch {
      // U slučaju greške smatramo da korisnik nije autentifikovan
      setState({ status: "unauthenticated", user: null });
    }
  }, []);

  const logout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setState({ status: "unauthenticated", user: null });
    router.refresh();
  };

  // useEffect se izvršava pri prvom renderu
  // Pokreće proveru autentifikacije čim se aplikacija učita
  useEffect(() => {
    refresh();
  }, [refresh]);

  // useMemo čuva istu referencu context vrednosti
  // Menja se samo kada se promeni state ili refresh funkcija
  const value = useMemo<Ctx>(
    () => ({ ...state, refresh, logout }),
    [state, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook za lakše korišćenje AuthContext-a
export function useAuth() {
  const ctx = useContext(AuthContext);

  // Sprečava runtime grešku ako se hook koristi van AuthProvider-a
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
