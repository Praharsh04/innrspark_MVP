"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { SparkLogo } from "@/components/ui/SparkLogo";

export function LoginForm() {
  const router = useRouter();
  const loginWithGoogle = useUserStore((state) => state.loginWithGoogle);
  const hydrateFromSupabase = useUserStore((state) => state.hydrateFromSupabase);
  const authError = useUserStore((state) => state.error);
  const isLoading = useUserStore((state) => state.isLoading);
  const clearError = useUserStore((state) => state.clearError);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");
  const [formNotice, setFormNotice] = useState<string | null>(null);
  const visibleAuthError =
    authError && !authError.toLowerCase().includes("auth session missing") ? authError : null;
  const isSignUp = authMode === "signUp";

  useEffect(() => {
    hydrateFromSupabase().then((hasSession) => {
      if (hasSession) {
        router.push("/assessment/start");
      }
    });
  }, [hydrateFromSupabase, router]);

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormNotice(
      isSignUp
        ? "Email sign up is not connected yet. Continue with Google to create your account."
        : "Email sign in is not connected yet. Continue with Google to sign in.",
    );
  };

  const handleGoogleLogin = async () => {
    setFormNotice(null);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || window.location.origin;
    const redirectTo = `${siteUrl}/auth`;
    const started = await loginWithGoogle(redirectTo);

    if (started && useUserStore.getState().isLoggedIn) {
      router.push("/assessment/start");
    }
  };

  const switchMode = () => {
    clearError();
    setFormNotice(null);
    setAuthMode((mode) => (mode === "signIn" ? "signUp" : "signIn"));
  };

  return (
    <div className="flex flex-col h-full px-screen pb-[max(2rem,env(safe-area-inset-bottom))] pt-12 bg-brand-cream">
      <div className="mb-14 flex justify-center">
        <SparkLogo small />
      </div>

      <h1 className="mb-10 text-center text-[34px] font-black leading-none tracking-tight text-charcoal">
        {isSignUp ? "Create your account" : "Start your journey"}
      </h1>

      <form onSubmit={handleEmailAuth} noValidate className="space-y-6">
        <div className="space-y-2.5">
          <label className="ml-1 text-[13px] font-black uppercase tracking-widest text-charcoal/50">Email</label>
          <div className="flex min-h-[60px] items-center gap-3 rounded-2xl border border-charcoal/15 bg-white px-5 shadow-sm focus-within:border-brand-yellow transition-all">
            <Mail size={20} strokeWidth={2.2} className="text-charcoal/30" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-transparent text-[16px] font-bold text-charcoal placeholder:text-charcoal/30 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2.5 relative">
          <label className="ml-1 text-[13px] font-black uppercase tracking-widest text-charcoal/50">Password</label>
          <div className="flex min-h-[60px] items-center gap-3 rounded-2xl border border-charcoal/15 bg-white px-5 shadow-sm focus-within:border-brand-yellow transition-all">
            <LockKeyhole size={20} strokeWidth={2.2} className="text-charcoal/30" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-transparent text-[16px] font-bold text-charcoal placeholder:text-charcoal/30 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-charcoal/40 transition hover:bg-charcoal/5"       
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} strokeWidth={2.2} /> : <Eye size={20} strokeWidth={2.2} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button type="button" className="text-[14px] font-black text-brand-gold hover:underline underline-offset-4">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 min-h-[64px] w-full rounded-2xl border border-charcoal/10 bg-brand-yellow px-6 text-[20px] font-black text-charcoal shadow-button transition active:scale-[0.97] disabled:opacity-70"
        >
          {isLoading ? "PLEASE WAIT..." : isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
        </button>
      </form>

      {(formNotice || visibleAuthError) && (
        <p className={`mt-5 rounded-2xl border bg-white/90 px-5 py-4 text-center text-sm font-bold shadow-sm ${
          visibleAuthError ? "border-red-100 text-red-600" : "border-brand-gold/25 text-charcoal/65"
        }`}>
          {visibleAuthError ?? formNotice}
        </p>
      )}

      <div className="my-8 flex items-center justify-center gap-5">
        <div className="h-px flex-1 bg-charcoal/10" />
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-charcoal/30">
          {isSignUp ? "Or Sign Up with" : "Or Login with"}
        </span>
        <div className="h-px flex-1 bg-charcoal/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="flex min-h-[60px] w-full items-center justify-center gap-4 rounded-2xl border border-charcoal/15 bg-white px-6 shadow-sm transition active:scale-[0.97] hover:bg-neutral-50"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span className="text-[15px] font-black uppercase tracking-tight text-charcoal">
          {isLoading ? "CONNECTING..." : "CONTINUE WITH GOOGLE"}
        </span>
      </button>

      <div className="mt-auto pt-6 text-center">
        <p className="text-sm font-bold text-charcoal/50">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button type="button" onClick={switchMode} className="font-black text-brand-gold hover:underline underline-offset-4">
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );

}
