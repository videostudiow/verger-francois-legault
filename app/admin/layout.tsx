"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord", icon: "⊞" },
  { href: "/admin/textes", label: "Mes textes", icon: "✎" },
  { href: "/admin/couleurs", label: "Mes couleurs", icon: "◉" },
  { href: "/admin/images", label: "Mes images", icon: "⊡" },
  { href: "/admin/informations", label: "Mes informations", icon: "ℹ" },
  { href: "/admin/messages", label: "Messages reçus", icon: "✉" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // La page de login ne doit pas être protégée par le gardien d'auth,
  // sinon elle reste bloquée sur « Chargement… » (aucun utilisateur connecté).
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // getSession() lit la session depuis le stockage local (pas d'appel
    // réseau), donc elle est disponible immédiatement après la connexion —
    // ce qui évite la boucle de redirection vers /admin/login.
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
      } else {
        setLoading(false);
      }
    });

    // Réagir aux changements d'auth (connexion / déconnexion) sans recharger.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [router, isLoginPage]);

  useEffect(() => {
    if (isLoginPage) return;
    supabase
      .from("contact_messages")
      .select("id", { count: "exact" })
      .eq("read", false)
      .then(({ count }) => setUnreadCount(count ?? 0));
  }, [pathname, isLoginPage]);

  // Page de login : afficher sans la coquille admin (sidebar, header).
  if (isLoginPage) {
    return <>{children}</>;
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4edd8]">
        <p className="font-mono text-sm uppercase tracking-widest text-[#2d6a4f]">
          Chargement…
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4edd8]">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#1e3a28] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo sidebar */}
        <div className="border-b border-white/10 px-6 py-5">
          <p className="font-mono text-xs uppercase tracking-widest text-[#e8a87c]">
            Espace admin
          </p>
          <p className="mt-1 font-heading text-lg text-white leading-tight">
            Verger François<br />Legault
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#c0392b] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
                {item.href === "/admin/messages" && unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-[#c0392b] px-1.5 py-0.5 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="mb-2 flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white/80"
          >
            <span>↗</span> Voir mon site
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span>⏻</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header mobile */}
        <header className="flex items-center gap-4 border-b border-[#1a2518]/10 bg-[#fdfaf2] px-4 py-3 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-[#1e3a28] hover:bg-[#e8dfc4] lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-sm text-[#6b7a61]">
            Bonjour — <span className="font-semibold text-[#1e3a28]">Gestion du Verger François Legault</span>
          </p>
          <span className="ml-auto font-mono text-xs text-[#6b7a61]">
            {new Date().toLocaleDateString("fr-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
