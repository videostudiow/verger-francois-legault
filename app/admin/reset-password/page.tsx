"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase places the recovery token in the URL hash — exchange it for a session
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    router.replace("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4edd8] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1e3a28] text-3xl">
            🍎
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-[#2d6a4f]">
            Espace administration
          </p>
          <h1 className="mt-2 font-heading text-2xl text-[#1e3a28]">
            Nouveau mot de passe
          </h1>
        </div>

        <div className="rounded-xl border border-[#1a2518]/15 bg-[#fdfaf2] p-6 shadow-sm">
          {!ready ? (
            <p className="text-center text-sm text-[#6b7a61]">Vérification du lien…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[#6b7a61]">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-[#1a2518]/20 bg-white px-3 py-2.5 text-sm text-[#1a2518] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[#6b7a61]">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#1a2518]/20 bg-white px-3 py-2.5 text-sm text-[#1a2518] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-[#c0392b]/10 px-3 py-2 text-xs text-[#c0392b]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1e3a28] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Enregistrement…" : "Enregistrer le mot de passe"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#6b7a61]">
          Site créé par <span className="font-semibold">Votre Agence</span>
        </p>
      </div>
    </div>
  );
}
