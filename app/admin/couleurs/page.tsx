"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteColor } from "@/lib/types";

type Toast = { message: string; type: "success" | "error" };

export default function CouleursPage() {
  const [colors, setColors] = useState<SiteColor[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    supabase.from("site_colors").select("*").then(({ data }) => {
      if (!data) return;
      setColors(data);
      const init: Record<string, string> = {};
      data.forEach((row) => (init[row.key] = row.value));
      setValues(init);
    });
  }, []);

  function showToast(message: string, type: Toast["type"]) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function save(key: string) {
    const value = values[key];
    // Validate hex color
    if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
      showToast("Format invalide. Utilisez un code hexadécimal (ex: #c0392b)", "error");
      return;
    }
    setSaving((s) => ({ ...s, [key]: true }));
    const { error } = await supabase
      .from("site_colors")
      .update({ value })
      .eq("key", key);
    setSaving((s) => ({ ...s, [key]: false }));
    if (error) {
      showToast("Erreur lors de la sauvegarde. Réessayez.", "error");
    } else {
      showToast("Couleur sauvegardée ✓", "success");
    }
  }

  function handleHexInput(key: string, raw: string) {
    const cleaned = raw.startsWith("#") ? raw : `#${raw}`;
    setValues((v) => ({ ...v, [key]: cleaned }));
  }

  return (
    <div className="max-w-2xl">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.type === "success" ? "bg-[#2d6a4f] text-white" : "bg-[#c0392b] text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="font-heading text-3xl text-[#1e3a28]">Mes couleurs</h1>
      <p className="mt-1 text-sm text-[#6b7a61]">
        Modifiez la palette visuelle de votre site. Cliquez sur le carré de couleur ou entrez un code hexadécimal.
      </p>

      <div className="mt-6 space-y-4">
        {colors.map((color) => {
          const current = values[color.key] ?? color.value;
          return (
            <div
              key={color.key}
              className="rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2] p-4"
            >
              <label className="mb-3 block text-sm font-semibold text-[#1e3a28]">
                {color.label}
              </label>

              <div className="flex items-center gap-3">
                {/* Color picker */}
                <label className="relative cursor-pointer">
                  <div
                    className="h-12 w-12 rounded-lg border-2 border-[#1a2518]/15 shadow-inner"
                    style={{ backgroundColor: current }}
                  />
                  <input
                    type="color"
                    value={current}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [color.key]: e.target.value }))
                    }
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>

                {/* Hex input */}
                <input
                  type="text"
                  value={current}
                  onChange={(e) => handleHexInput(color.key, e.target.value)}
                  maxLength={7}
                  className="w-32 rounded-lg border border-[#1a2518]/15 bg-white px-3 py-2 font-mono text-sm text-[#1a2518] uppercase outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
                />

                {/* Aperçu */}
                <div className="flex flex-1 items-center gap-2">
                  <span
                    className="rounded px-3 py-1.5 text-xs font-bold text-white"
                    style={{ backgroundColor: current }}
                  >
                    Aperçu
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: current }}
                  >
                    Texte coloré
                  </span>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => save(color.key)}
                  disabled={saving[color.key]}
                  className="rounded-lg bg-[#1e3a28] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {saving[color.key] ? "Sauvegarde…" : "Sauvegarder"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {colors.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-[#2d6a4f]/30 p-8 text-center">
          <p className="text-sm text-[#6b7a61]">Chargement des couleurs…</p>
        </div>
      )}

      <div className="mt-6 rounded-lg bg-[#1e3a28]/5 px-4 py-3 text-xs text-[#6b7a61]">
        ℹ Les modifications de couleurs sont sauvegardées en base de données. Pour qu'elles apparaissent sur le site, un redéploiement peut être nécessaire selon la configuration.
      </div>
    </div>
  );
}
