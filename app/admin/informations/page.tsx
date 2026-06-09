"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteInfo } from "@/lib/types";

type Toast = { message: string; type: "success" | "error" };

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const JOURS_KEYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

export default function InformationsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    supabase.from("site_info").select("*").then(({ data }) => {
      if (!data) return;
      const init: Record<string, string> = {};
      data.forEach((row: SiteInfo) => (init[row.key] = row.value ?? ""));
      setValues(init);
    });
  }, []);

  function showToast(message: string, type: Toast["type"]) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function set(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function saveAll() {
    setSaving(true);
    const updates = Object.entries(values).map(([key, value]) =>
      supabase.from("site_info").upsert({ key, value })
    );
    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);
    setSaving(false);
    if (hasError) {
      showToast("Erreur lors de la sauvegarde. Réessayez.", "error");
    } else {
      showToast("Informations sauvegardées ✓", "success");
    }
  }

  const field = (key: string, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[#6b7a61]">
        {label}
      </label>
      <input
        type={type}
        value={values[key] ?? ""}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#1a2518]/15 bg-white px-3 py-2.5 text-sm text-[#1a2518] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
      />
    </div>
  );

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

      <h1 className="font-heading text-3xl text-[#1e3a28]">Mes informations</h1>
      <p className="mt-1 text-sm text-[#6b7a61]">
        Mettez à jour vos coordonnées, heures d'ouverture et réseaux sociaux.
      </p>

      {/* Coordonnées */}
      <section className="mt-8">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[#2d6a4f]">
          — Coordonnées
        </h2>
        <div className="rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2] p-5 space-y-4">
          {field("nom", "Nom du commerce", "text", "Verger François Legault")}
          {field("adresse", "Adresse complète", "text", "111 Rang des Étangs, Mont-Saint-Hilaire, QC J3G 4S6")}
          {field("telephone", "Téléphone", "tel", "(450) 555-0000")}
          {field("email", "Courriel", "email", "info@verger.ca")}
        </div>
      </section>

      {/* Heures d'ouverture */}
      <section className="mt-6">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[#2d6a4f]">
          — Heures d'ouverture
        </h2>
        <div className="rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2] p-5">
          <div className="space-y-3">
            {JOURS.map((jour, i) => {
              const key = `heures_${JOURS_KEYS[i]}`;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-24 flex-shrink-0 font-mono text-xs text-[#6b7a61]">{jour}</span>
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="text"
                      value={values[key] ?? ""}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder="8h00 – 17h00 ou Fermé"
                      className="flex-1 rounded-lg border border-[#1a2518]/15 bg-white px-3 py-2 text-sm text-[#1a2518] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
                    />
                    <button
                      onClick={() => set(key, "Fermé")}
                      className="rounded-lg border border-[#1a2518]/15 px-2.5 py-2 text-xs text-[#6b7a61] hover:bg-[#f4edd8]"
                    >
                      Fermé
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 rounded-lg bg-[#1e3a28]/5 px-3 py-2 text-xs text-[#6b7a61]">
            ℹ Exemple : <span className="font-mono">8h00 – 17h00</span> ou <span className="font-mono">Fermé</span>
          </div>
        </div>
      </section>

      {/* Réseaux sociaux */}
      <section className="mt-6">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[#2d6a4f]">
          — Réseaux sociaux
        </h2>
        <div className="rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2] p-5 space-y-4">
          {field("facebook", "Facebook (URL complète)", "url", "https://facebook.com/vergerfrancoislegault")}
          {field("instagram", "Instagram (URL complète)", "url", "https://instagram.com/vergerfrancoislegault")}
        </div>
      </section>

      {/* Saison */}
      <section className="mt-6">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[#2d6a4f]">
          — Saison
        </h2>
        <div className="rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2] p-5">
          {field("saison", "Période d'ouverture", "text", "Début septembre à fin octobre")}
        </div>
      </section>

      {/* Bouton sauvegarder */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={saveAll}
          disabled={saving}
          className="rounded-lg bg-[#1e3a28] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Sauvegarde en cours…" : "Tout sauvegarder"}
        </button>
      </div>
    </div>
  );
}
