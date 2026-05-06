type SupabaseEnv = {
  url: string;
  anonKey: string;
};

export function hasSupabaseEnv(): boolean {
  try {
    getSupabaseEnv();
    return true;
  } catch {
    return false;
  }
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { url, anonKey };
}

function cleanEnvValue(value: string | undefined): string {
  return (value ?? "").trim().replace(/^['"]|['"]$/g, "");
}

function normalizeSupabaseUrl(value: string | undefined): string {
  const rawUrl = cleanEnvValue(value);

  if (!rawUrl) {
    return "";
  }

  const parsedUrl = new URL(rawUrl);
  const path = parsedUrl.pathname.replace(/\/+$/, "");

  if (path === "/rest/v1") {
    return parsedUrl.origin;
  }

  return rawUrl.replace(/\/+$/, "");
}
