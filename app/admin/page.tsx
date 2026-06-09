"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";

const QUICK_LINKS = [
  { href: "/admin/textes", label: "Modifier les textes", icon: "✎", desc: "Titres, descriptions, boutons" },
  { href: "/admin/couleurs", label: "Modifier les couleurs", icon: "◉", desc: "Palette visuelle du site" },
  { href: "/admin/images", label: "Gérer les images", icon: "⊡", desc: "Galerie et photo principale" },
  { href: "/admin/informations", label: "Mes informations", icon: "ℹ", desc: "Heures, adresse, réseaux sociaux" },
  { href: "/admin/messages", label: "Messages reçus", icon: "✉", desc: "Formulaire de contact" },
];

export default function AdminDashboardPage() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Modal première connexion
    const seen = localStorage.getItem("admin_welcome_seen");
    if (!seen) setShowWelcome(true);

    // Stats
    Promise.all([
      supabase.from("contact_messages").select("id", { count: "exact" }).eq("read", false),
      supabase.from("contact_messages").select("id", { count: "exact" }),
      supabase.from("site_content").select("updated_at").order("updated_at", { ascending: false }).limit(1),
    ]).then(([unread, total, content]) => {
      setUnreadCount(unread.count ?? 0);
      setTotalMessages(total.count ?? 0);
      if (content.data?.[0]?.updated_at) {
        setLastUpdate(content.data[0].updated_at);
      }
    });
  }, []);

  function closeWelcome(dontShow: boolean) {
    if (dontShow) localStorage.setItem("admin_welcome_seen", "1");
    setShowWelcome(false);
  }

  return (
    <>
      {/* Modal bienvenue */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-xl bg-[#fdfaf2] p-6 shadow-xl">
            <h2 className="font-heading text-2xl text-[#1e3a28]">
              Bienvenue sur votre espace administration
            </h2>
            <p className="mt-2 text-sm text-[#6b7a61]">
              Depuis ce tableau de bord, vous pouvez modifier les textes, les couleurs, les images, vos informations et consulter les messages de vos visiteurs.
            </p>

            {/* Placeholder vidéo Loom */}
            <div className="mt-4 flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-[#2d6a4f]/30 bg-[#f4edd8]">
              <p className="text-center text-xs text-[#6b7a61]">
                {/* LOOM VIDEO URL INSERT HERE */}
                Vidéo de démarrage disponible bientôt
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#6b7a61]">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) localStorage.setItem("admin_welcome_seen", "1");
                    else localStorage.removeItem("admin_welcome_seen");
                  }}
                  className="rounded"
                />
                Ne plus afficher
              </label>
              <button
                onClick={() => closeWelcome(false)}
                className="rounded-lg bg-[#1e3a28] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Commencer →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu dashboard */}
      <div className="max-w-4xl">
        <h1 className="font-heading text-3xl text-[#1e3a28]">Tableau de bord</h1>
        <p className="mt-1 text-sm text-[#6b7a61]">Gérez votre site en quelques clics.</p>

        {/* Cartes stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2] p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-[#6b7a61]">Messages non lus</p>
            <p className="mt-1 font-heading text-4xl text-[#c0392b]">{unreadCount}</p>
            <Link href="/admin/messages" className="mt-2 block text-xs text-[#2d6a4f] underline">
              Voir les messages →
            </Link>
          </div>
          <div className="rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2] p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-[#6b7a61]">Messages reçus (total)</p>
            <p className="mt-1 font-heading text-4xl text-[#1e3a28]">{totalMessages}</p>
          </div>
          <div className="rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2] p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-[#6b7a61]">Dernière modification</p>
            <p className="mt-1 text-sm font-semibold text-[#1e3a28]">
              {lastUpdate
                ? new Date(lastUpdate).toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" })
                : "—"}
            </p>
          </div>
        </div>

        {/* Liens rapides */}
        <h2 className="mt-8 font-heading text-xl text-[#1e3a28]">Accès rapides</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2] p-4 transition-all hover:border-[#2d6a4f]/40 hover:shadow-sm"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#1e3a28] text-xl text-white">
                {item.icon}
              </span>
              <div>
                <p className="font-semibold text-[#1e3a28]">{item.label}</p>
                <p className="text-xs text-[#6b7a61]">{item.desc}</p>
              </div>
              <span className="ml-auto text-[#6b7a61]">→</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
