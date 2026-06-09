import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key";

// createBrowserClient (de @supabase/ssr) stocke la session dans des cookies,
// ce qui permet au middleware serveur (createServerClient) de la lire.
// Indispensable pour que la protection des routes /admin fonctionne.
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
