"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

const protectedRoutes = [
  "/assessment/start",
  "/assessment/question",
  "/assessment/loading",
  "/recommendations",
  "/roadmap/generating",
  "/roadmap",
  "/progress",
  "/chat",
  "/profile",
];

const publicRoutes = ["/", "/onboarding", "/auth"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const hydrateFromSupabase = useUserStore((state) => state.hydrateFromSupabase);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    const isPublic = isPublicRoute(pathname) || !isProtected;

    setIsReady(false);

    if (isPublic) {
      setIsReady(true);
      return;
    }

    if (isLoggedIn) {
      setIsReady(true);
      return;
    }

    hydrateFromSupabase().then((hasSession) => {
      if (cancelled) {
        return;
      }

      if (hasSession) {
        setIsReady(true);
      } else {
        router.replace("/auth");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [hydrateFromSupabase, isLoggedIn, pathname, router]);

  if (!isReady) {
    return <div className="min-h-dvh bg-brand-cream" />;
  }

  return <>{children}</>;
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)));
}
