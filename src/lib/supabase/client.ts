"use client";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv, hasSupabaseEnv } from "./env";
import type { Database } from "./types";

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  return createSupabaseBrowserClient();
}

export function createSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const { url, anonKey } = getSupabaseEnv();
  browserClient = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}
