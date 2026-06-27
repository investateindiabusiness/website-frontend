"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const AuthContext = createContext(null);

const isSessionExpired = (userData) => {
  if (!userData) return false;

  // Rely on the backend to validate JWT expiration (which handles clock skews safely).
  // We only check a generous absolute session timeout (e.g. 24 hours) as a client-side fallback.
  if (userData.loginTime) {
    const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - userData.loginTime >= SESSION_TIMEOUT) {
      return true;
    }
  }

  return false;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user_session");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (isSessionExpired(parsedUser)) {
        const role = parsedUser.role;
        sessionStorage.removeItem("user_session");
        if (role === "admin") {
          window.location.href = "/admin/login?session_expired=true";
        } else if (role === "builder") {
          window.location.href = "/builder/login?session_expired=true";
        } else {
          window.location.href = "/investor/login?session_expired=true";
        }
      } else {
        setUser(parsedUser);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    const checkSession = () => {
      const savedUser = sessionStorage.getItem("user_session");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (isSessionExpired(parsedUser)) {
          const role = parsedUser.role;
          sessionStorage.removeItem("user_session");
          setUser(null);

          if (role === "admin") {
            window.location.href = "/admin/login?session_expired=true";
          } else if (role === "builder") {
            window.location.href = "/builder/login?session_expired=true";
          } else if (role === "serviceProvider") {
            window.location.href =
              "/service-provider/login?session_expired=true";
          } else {
            window.location.href = "/investor/login?session_expired=true";
          }
          return true;
        }
      }
      return false;
    };

    const isExpired = checkSession();
    if (isExpired) return;

    const interval = setInterval(() => {
      checkSession();
    }, 5000);

    return () => clearInterval(interval);
  }, [loading, pathname]);

  useEffect(() => {
    if (loading) return;

    const isAdminRoute =
      pathname.startsWith("/admin") && pathname !== "/admin/login";
    const isBuilderRoute =
      (pathname.startsWith("/builder/") &&
        pathname !== "/builder/login" &&
        pathname !== "/builder/register") ||
      pathname === "/builder/dashboard" ||
      pathname === "/builder/projects" ||
      pathname === "/builder/advertisements";
    const isInvestorRoute =
      pathname === "/dashboard" ||
      pathname === "/properties" ||
      (pathname.startsWith("/investor/") &&
        pathname !== "/investor/login" &&
        pathname !== "/investor/register") ||
      pathname.startsWith("/project/");
    const isServiceProviderRoute =
      (pathname.startsWith("/service-provider/") &&
        pathname !== "/service-provider/login" &&
        pathname !== "/service-provider/register") ||
      pathname === "/service-provider/dashboard" ||
      pathname === "/service-provider/advertisements";

    if (isAdminRoute) {
      if (!user) {
        router.push("/admin/login");
      } else if (user.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You do not have administrator privileges.",
          variant: "destructive",
        });
        router.push("/");
      }
    } else if (isBuilderRoute) {
      if (!user) {
        router.push("/builder/login");
      } else if (user.role !== "builder") {
        toast({
          title: "Access Denied",
          description: "You do not have builder privileges.",
          variant: "destructive",
        });
        router.push("/");
      }
    } else if (isInvestorRoute) {
      if (!user) {
        router.push("/investor/login");
      } else if (user.role !== "investor") {
        toast({
          title: "Access Denied",
          description: "You do not have investor privileges.",
          variant: "destructive",
        });
        router.push("/");
      }
    } else if (isServiceProviderRoute) {
      if (!user) {
        router.push("/service-provider?login=true&role=serviceProvider");
      } else if (user.role !== "serviceProvider") {
        toast({
          title: "Access Denied",
          description: "You do not have service provider privileges.",
          variant: "destructive",
        });
        router.push("/");
      }
    }
  }, [user, loading, pathname, router]);

  const login = (userData) => {
    const sessionData = { ...userData, loginTime: Date.now() };
    sessionStorage.setItem("user_session", JSON.stringify(sessionData));
    setUser(sessionData);
  };

  const logout = () => {
    sessionStorage.removeItem("user_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
