"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MobileFrame } from "@/components/shared/MobileFrame";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/useUserStore";

export default function AuthCallbackPage() {
  const router = useRouter();
  const hydrateFromSupabase = useUserStore((state) => state.hydrateFromSupabase);
  const [message, setMessage] = useState("Finishing Google sign in...");

  useEffect(() => {
    let cancelled = false;

    async function finishAuth() {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        setMessage("Supabase is not configured yet. Check your environment variables.");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error_description") || params.get("error");

      if (error) {
        setMessage(error);
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          setMessage(exchangeError.message);
          return;
        }
      } else {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          setMessage("Google sign in did not return a session. Please try again.");
          return;
        }
      }

      const hasSession = await hydrateFromSupabase();

      if (!cancelled) {
        router.replace(hasSession ? "/assessment/start" : "/auth");
      }
    }

    finishAuth();

    return () => {
      cancelled = true;
    };
  }, [hydrateFromSupabase, router]);

  return (
    <MobileFrame padded={false}>
      <div className="grid h-full place-items-center bg-[linear-gradient(180deg,#fff7ce_0%,#fffdf4_100%)] px-screen text-center">
        <div className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_40px_rgba(33,33,33,0.08)]">
          <div className="mx-auto mb-5 h-12 w-12 animate-pulse rounded-full bg-brand-yellow shadow-[0_10px_24px_rgba(255,199,0,0.24)]" />
          <h1 className="text-[24px] font-black leading-tight text-charcoal">Signing you in</h1>
          <p className="mt-3 text-[14px] font-bold leading-relaxed text-charcoal/55">{message}</p>
        </div>
      </div>
    </MobileFrame>
  );
}
