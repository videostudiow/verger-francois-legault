"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [blockRemaining, setBlockRemaining] = useState(0);

  useEffect(() => {
    checkBlock();
    const interval = setInterval(checkBlock, 1000);
    return () => clearInterval(interval);
  }, []);

  function checkBlock() {
    const data = localStorage.getItem("admin_login_block");
    if (!data) { setBlocked(false); return; }
    const { blockedUntil } = JSON.parse(data);
    const remaining = blockedUntil - Date.now();
    if (remaining > 0) {
      setBlocked(true);
      setBlockRemaining(Math.ceil(remaining / 1000));
    } else {
      localStorage.removeItem("admin_login_block");
      localStorage.removeItem("admin_login_attempts");
      setBlocked(false);
    }
  }

  function recordFailedAttempt() {
    const raw = localStorage.getItem("admin_login_attempts");
    const attempts = raw ? parseInt(raw, 10) : 0;
    const next = attempts + 1;
    localStorage.setItem("admin_login_attempts", String(next));
    if (next >= MAX_ATTEMPTS) {
      localStorage.setItem(
        "admin_login_block",
        JSON.stringify({ blockedUntil: Date.now() + BLOCK_DURATION_MS })
      );
      setBlocked(true);
    }
    return next;
  }

  function clearAttempts() {
    localStorage.removeItem("admin_login_attempts");
    localStorage.removeItem("admin_login_block");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (blocked) return;
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      const attempts = recordFailedAttempt();
      const remaining = MAX_ATTEMPTS - attempts;
      if (remaining <= 0) {
        setError(`Trop de tentatives. Compte bloqué pendant 15 minutes.`);
      } else {
        setError(
          `Courriel ou mot de passe invalide. ${remaining} tentative${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}.`
        );
      }
      setLoading(false);
      return;
    }

    clearAttempts();
    router.replace("/admin");
  }

  async function handlePasswordReset() {
    if (!email) {
      setError("Entrez votre courriel pour réinitialiser le mot de passe.");
      return;
    }
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setResetSent(true);
    setLoading(false);
  }

  const minutes = Math.floor(blockRemaining / 60);
  const seconds = blockRemaining % 60;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4edd8] px-4">
      <div className="w-full max-w-sm">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1e3a28] text-3xl">
            🍎
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-[#2d6a4f]">
            Espace administration
          </p>
          <h1 className="mt-2 font-heading text-2xl text-[#1e3a28]">
            Verger François Legault
          </h1>
        </div>

        {/* Carte formulaire */}
        <div className="rounded-xl border border-[#1a2518]/15 bg-[#fdfaf2] p-6 shadow-sm">
          {resetSent ? (
            <div className="text-center">
              <p className="text-sm font-semibold text-[#2d6a4f]">✓ Courriel envoyé</p>
              <p className="mt-1 text-sm text-[#6b7a61]">
                Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.
              </p>
              <button
                onClick={() => setResetSent(false)}
                className="mt-4 text-sm text-[#c0392b] underline"
              >
                Retour à la connexion
              </button>
            </div>
          ) : blocked ? (
            <div className="text-center">
              <p className="text-sm font-semibold text-[#c0392b]">⛔ Compte temporairement bloqué</p>
              <p className="mt-2 text-sm text-[#6b7a61]">
                Trop de tentatives échouées. Réessayez dans{" "}
                <span className="font-mono font-bold text-[#1e3a28]">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[#6b7a61]">
                  Courriel
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-[#1a2518]/20 bg-white px-3 py-2.5 text-sm text-[#1a2518] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
                  placeholder="admin@verger.ca"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[#6b7a61]">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
                {loading ? "Connexion en cours…" : "Se connecter"}
              </button>

              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={loading}
                className="w-full text-center text-xs text-[#6b7a61] underline hover:text-[#1e3a28]"
              >
                Mot de passe oublié ?
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#6b7a61]">
          Site créé par{" "}
          <span className="font-semibold">Votre Agence</span>
        </p>
      </div>
    </div>
  );
}
