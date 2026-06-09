"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { GalleryImage } from "@/lib/types";

const MAX_SIZE_MB = 10;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const BUCKET = "site-images";

type Toast = { message: string; type: "success" | "error" };

export default function ImagesPage() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    setLoadingGallery(true);
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });
    setGallery(data ?? []);
    setLoadingGallery(false);
  }

  function showToast(message: string, type: Toast["type"]) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function validateFile(file: File): string | null {
    if (!ACCEPTED.includes(file.type)) {
      return "Format non accepté. Utilisez JPG, PNG, WebP ou SVG.";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `Fichier trop volumineux. Maximum ${MAX_SIZE_MB} MB.`;
    }
    return null;
  }

  async function uploadGalleryImages(files: FileList) {
    setUploading(true);
    const errors: string[] = [];

    for (const file of Array.from(files)) {
      const validationError = validateFile(file);
      if (validationError) { errors.push(validationError); continue; }

      const ext = file.name.split(".").pop();
      const filename = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file, { upsert: false });

      if (uploadError) { errors.push(`Erreur upload ${file.name}`); continue; }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);

      await supabase.from("gallery_images").insert({
        image_url: urlData.publicUrl,
        caption: file.name.replace(/\.[^/.]+$/, ""),
        sort_order: gallery.length + 1,
        active: true,
      });
    }

    await loadGallery();
    setUploading(false);

    if (errors.length > 0) {
      showToast(errors[0], "error");
    } else {
      showToast("Image(s) ajoutée(s) avec succès ✓", "success");
    }
  }

  async function deleteImage(image: GalleryImage) {
    const path = image.image_url.split(`${BUCKET}/`)[1];
    if (path) {
      await supabase.storage.from(BUCKET).remove([path]);
    }
    await supabase.from("gallery_images").delete().eq("id", image.id);
    setDeleteConfirm(null);
    await loadGallery();
    showToast("Image supprimée.", "success");
  }

  async function updateCaption(id: string, caption: string) {
    await supabase.from("gallery_images").update({ caption }).eq("id", id);
  }

  return (
    <div className="max-w-3xl">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.type === "success" ? "bg-[#2d6a4f] text-white" : "bg-[#c0392b] text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Modal confirmation suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-[#fdfaf2] p-6 shadow-xl">
            <h3 className="font-semibold text-[#1e3a28]">Supprimer cette image ?</h3>
            <p className="mt-1 text-sm text-[#6b7a61]">Cette action est irréversible.</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-[#1a2518]/15 py-2 text-sm text-[#1e3a28] hover:bg-[#f4edd8]"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const img = gallery.find((g) => g.id === deleteConfirm);
                  if (img) deleteImage(img);
                }}
                className="flex-1 rounded-lg bg-[#c0392b] py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="font-heading text-3xl text-[#1e3a28]">Mes images</h1>
      <p className="mt-1 text-sm text-[#6b7a61]">
        Gérez les photos de votre galerie. Formats acceptés : JPG, PNG, WebP, SVG — max 10 MB.
      </p>

      {/* Galerie */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#2d6a4f]">
            — Galerie de photos
          </h2>
          <button
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg bg-[#1e3a28] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? "Ajout en cours…" : "+ Ajouter des photos"}
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) uploadGalleryImages(e.target.files);
            }}
          />
        </div>

        {loadingGallery ? (
          <p className="text-sm text-[#6b7a61]">Chargement…</p>
        ) : gallery.length === 0 ? (
          <div
            onClick={() => galleryInputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-[#2d6a4f]/30 p-12 text-center hover:border-[#2d6a4f]/60"
          >
            <p className="text-2xl">📷</p>
            <p className="mt-2 text-sm font-semibold text-[#1e3a28]">Aucune photo dans la galerie</p>
            <p className="mt-1 text-xs text-[#6b7a61]">Cliquez pour ajouter vos premières photos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-xl border border-[#1a2518]/10 bg-[#fdfaf2]"
              >
                <div className="relative aspect-square">
                  <Image
                    src={img.image_url}
                    alt={img.caption ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  <button
                    onClick={() => setDeleteConfirm(img.id)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#c0392b] text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                    title="Supprimer"
                  >
                    ×
                  </button>
                </div>
                <input
                  type="text"
                  defaultValue={img.caption ?? ""}
                  onBlur={(e) => updateCaption(img.id, e.target.value)}
                  placeholder="Légende…"
                  className="w-full border-t border-[#1a2518]/10 bg-transparent px-2 py-1.5 text-xs text-[#6b7a61] outline-none focus:bg-white"
                />
              </div>
            ))}

            {/* Bouton ajout dans la grille */}
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2d6a4f]/30 text-[#6b7a61] hover:border-[#2d6a4f]/60 hover:text-[#2d6a4f]"
            >
              <span className="text-2xl">+</span>
              <span className="mt-1 text-xs">Ajouter</span>
            </button>
          </div>
        )}
      </section>

      <div className="mt-6 rounded-lg bg-[#1e3a28]/5 px-4 py-3 text-xs text-[#6b7a61]">
        ℹ Les images sont stockées dans Supabase Storage. Assurez-vous que le bucket « site-images » est configuré en accès public dans votre projet Supabase.
      </div>
    </div>
  );
}
