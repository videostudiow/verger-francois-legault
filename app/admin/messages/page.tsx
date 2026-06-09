"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ContactMessage } from "@/lib/types";

type Filter = "tous" | "non-lus";
type Toast = { message: string; type: "success" | "error" };

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("tous");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  }

  function showToast(message: string, type: Toast["type"]) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function markRead(id: string) {
    await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    setMessages((msgs) =>
      msgs.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  }

  async function openMessage(msg: ContactMessage) {
    setSelected(msg);
    if (!msg.read) {
      await markRead(msg.id);
    }
  }

  async function deleteMessage(id: string) {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);
    setDeleteConfirm(null);
    if (selected?.id === id) setSelected(null);
    if (error) {
      showToast("Erreur lors de la suppression.", "error");
    } else {
      await loadMessages();
      showToast("Message supprimé.", "success");
    }
  }

  const filtered = filter === "non-lus"
    ? messages.filter((m) => !m.read)
    : messages;

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="flex h-[calc(100vh-8rem)] max-w-5xl gap-4">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.type === "success" ? "bg-[#2d6a4f] text-white" : "bg-[#c0392b] text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Modal suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-[#fdfaf2] p-6 shadow-xl">
            <h3 className="font-semibold text-[#1e3a28]">Supprimer ce message ?</h3>
            <p className="mt-1 text-sm text-[#6b7a61]">Cette action est irréversible.</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-[#1a2518]/15 py-2 text-sm text-[#1e3a28] hover:bg-[#f4edd8]"
              >
                Annuler
              </button>
              <button
                onClick={() => deleteMessage(deleteConfirm)}
                className="flex-1 rounded-lg bg-[#c0392b] py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="flex w-80 flex-shrink-0 flex-col">
        <div className="mb-3 flex items-center gap-2">
          <h1 className="font-heading text-2xl text-[#1e3a28]">Messages</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-[#c0392b] px-2 py-0.5 text-xs font-bold text-white">
              {unreadCount} nouveau{unreadCount > 1 ? "x" : ""}
            </span>
          )}
        </div>

        {/* Filtre */}
        <div className="mb-3 flex rounded-lg border border-[#1a2518]/10 bg-[#fdfaf2] p-1">
          {(["tous", "non-lus"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-[#1e3a28] text-white"
                  : "text-[#6b7a61] hover:text-[#1e3a28]"
              }`}
            >
              {f === "tous" ? "Tous" : "Non lus"}
            </button>
          ))}
        </div>

        {/* Liste messages */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <p className="text-center text-sm text-[#6b7a61] py-8">Chargement…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-[#6b7a61] py-8">
              {filter === "non-lus" ? "Aucun message non lu." : "Aucun message reçu."}
            </p>
          ) : (
            filtered.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full rounded-xl border p-3 text-left transition-all hover:shadow-sm ${
                  selected?.id === msg.id
                    ? "border-[#2d6a4f] bg-[#2d6a4f]/5"
                    : "border-[#1a2518]/10 bg-[#fdfaf2]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-sm text-[#1e3a28] truncate">
                    {msg.name}
                  </span>
                  {!msg.read && (
                    <span className="flex-shrink-0 h-2 w-2 rounded-full bg-[#c0392b] mt-1" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-[#6b7a61] truncate">{msg.email}</p>
                <p className="mt-1 text-xs text-[#6b7a61] line-clamp-2">{msg.message}</p>
                <p className="mt-1 font-mono text-xs text-[#6b7a61]/60">
                  {new Date(msg.created_at).toLocaleDateString("fr-CA", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Détail message */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2] p-6">
        {selected ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl text-[#1e3a28]">{selected.name}</h2>
                <p className="text-sm text-[#6b7a61]">{selected.email}</p>
                {selected.phone && (
                  <p className="text-sm text-[#6b7a61]">{selected.phone}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="font-mono text-xs text-[#6b7a61]">
                  {new Date(selected.created_at).toLocaleDateString("fr-CA", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
                <p className="font-mono text-xs text-[#6b7a61]">
                  {new Date(selected.created_at).toLocaleTimeString("fr-CA", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <hr className="my-4 border-[#1a2518]/10" />

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#1a2518]">
              {selected.message}
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href={`mailto:${selected.email}?subject=Réponse à votre message — Verger François Legault`}
                className="rounded-lg bg-[#2d6a4f] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Répondre par courriel
              </a>
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="rounded-lg border border-[#1a2518]/15 px-4 py-2 text-sm font-semibold text-[#1e3a28] hover:bg-[#f4edd8]"
                >
                  Appeler
                </a>
              )}
              <button
                onClick={() => setDeleteConfirm(selected.id)}
                className="ml-auto rounded-lg border border-[#c0392b]/30 px-4 py-2 text-sm font-semibold text-[#c0392b] hover:bg-[#c0392b]/5"
              >
                Supprimer
              </button>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-4xl">✉️</p>
              <p className="mt-3 text-sm text-[#6b7a61]">Sélectionnez un message pour le lire</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
