import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";
import type { Database } from "./types";

type ServerClientOptions = {
  accessToken?: string;
};

export function createSupabaseServerClient(options: ServerClientOptions = {}) {
  const { url, anonKey } = getSupabaseEnv();

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: options.accessToken
      ? {
          headers: {
            Authorization: `Bearer ${options.accessToken}`,
          },
        }
      : undefined,
  });
}
