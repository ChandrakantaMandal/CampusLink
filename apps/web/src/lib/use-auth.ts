"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export function useAuth() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedRole = localStorage.getItem("hirebridge_role");
    const storedUserStr = localStorage.getItem("campuslink_user");

    let parsedUser: AuthUser | null = null;
    if (storedUserStr) {
      try {
        parsedUser = JSON.parse(storedUserStr);
      } catch {
        parsedUser = null;
      }
    }

    if (session?.user) {
      setIsAuthenticated(true);
      setUser(session.user);
      setRole(storedRole || "student");
    } else if (storedRole || parsedUser) {
      setIsAuthenticated(true);
      setUser(parsedUser || { name: "Student", email: "student@campuslink.edu" });
      setRole(storedRole || "student");
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    }

    setIsReady(true);
  }, [session, isSessionPending]);

  const signOut = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hirebridge_role");
      localStorage.removeItem("campuslink_user");
    }
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);

    try {
      await authClient.signOut();
    } catch {
      // ignore
    }

    window.location.href = "/login";
  }, []);

  return {
    isAuthenticated,
    user: session?.user || user,
    role,
    isPending: !isReady,
    signOut,
  };
}
