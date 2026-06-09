"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteContent } from "@/lib/types";

// Labels français par clé technique
const LABELS: Record<string, { label: string; group: string; multiline?: boolean }> = {
  hero_title:        { label: "Titre principal (page d'accueil)", group: "Accueil" },
  hero_subtitle:     { label: "Sous-titre (page d'accueil)", group: "Accueil", multiline: true },
  hero_cta_primary:  { label: "Bouton principal", group: "Accueil" },
  hero_cta_secondary:{ label: "Bouton secondaire", group: "Accueil" },
  about_title:       { label: "Titre — À propos", group: "À propos" },
  about_text:        { label: "Texte — À propos", group: "À propos", multiline: true },
  autocueillette_title:  { label: "Titre — Autocueillette", group: "Autocueillette" },
  autocueillette_text:   { label: "Texte — Autocueillette", group: "Autocueillette", multiline: true },
  contact_title:     { label: "Titre — Contact", group: "Contact" },
  contact_subtitle:  { label: "Sous-titre — Contact", group: "Contact", multiline: true },
  meta_description:  { label: "Description SEO (meta)", group: "SEO" },
};

type Toast = { message: string; type: "success" | "error" };

export default function TextesPage() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    supabase.from("site_content").select("*").then(({ data }) => {
      if (!data) return;
      setItems(data);
      const init: Record<string, string> = {};
      data.forEach((row) => (init[row.key] = row.value ?? ""));
      setValues(init);
    });
  }, []);

  function showToast(message: string, type: Toast["type"]) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function save(key: string) {
    setSaving((s) => ({ ...s, [key]: true }));
    const { error } = await supabase
      .from("site_content")
      .update({ value: values[key], updated_at: new Date().toISOString() })
      .eq("key", key);
    setSaving((s) => ({ ...s, [key]: false }));
    if (error) {
      showToast("Erreur lors de la sauvegarde. Réessayez.", "error");
    } else {
      showToast("Sauvegardé avec succès ✓", "success");
    }
  }

  // Grouper par section
  const groups: Record<string, SiteContent[]> = {};
  items.forEach((item) => {
    const meta = LABELS[item.key];
    const group = meta?.group ?? "Autre";
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
  });

  return (
    <div className="max-w-2xl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-[#2d6a4f] text-white"
              : "bg-[#c0392b] text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="font-heading text-3xl text-[#1e3a28]">Mes textes</h1>
      <p className="mt-1 text-sm text-[#6b7a61]">
        Modifiez les textes de votre site. Cliquez sur « Sauvegarder » après chaque modification.
      </p>

      {Object.entries(groups).map(([group, groupItems]) => (
        <section key={group} className="mt-8">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[#2d6a4f]">
            — {group}
          </h2>
          <div className="space-y-4">
            {groupItems.map((item) => {
              const meta = LABELS[item.key];
              const isMultiline = meta?.multiline ?? (item.value?.length ?? 0) > 80;
              return (
                <div
                  key={item.key}
                  className="rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2] p-4"
                >
                  <label className="mb-2 block text-sm font-semibold text-[#1e3a28]">
                    {meta?.label ?? item.key}
                  </label>
                  {isMultiline ? (
                    <textarea
                      rows={4}
                      value={values[item.key] ?? ""}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, [item.key]: e.target.value }))
                      }
                      className="w-full rounded-lg border border-[#1a2518]/15 bg-white px-3 py-2 text-sm text-[#1a2518] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[item.key] ?? ""}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, [item.key]: e.target.value }))
                      }
                      className="w-full rounded-lg border border-[#1a2518]/15 bg-white px-3 py-2.5 text-sm text-[#1a2518] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
                    />
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-mono text-xs text-[#6b7a61]">
                      {item.updated_at
                        ? `Modifié le ${new Date(item.updated_at).toLocaleDateString("fr-CA")}`
                        : ""}
                    </p>
                    <button
                      onClick={() => save(item.key)}
                      disabled={saving[item.key]}
                      className="rounded-lg bg-[#1e3a28] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {saving[item.key] ? "Sauvegarde…" : "Sauvegarder"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {items.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-[#2d6a4f]/30 p-8 text-center">
          <p className="text-sm text-[#6b7a61]">Chargement des textes…</p>
        </div>
      )}
    </div>
  );
}
