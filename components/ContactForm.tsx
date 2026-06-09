"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot anti-spam : si rempli, on ignore silencieusement.
    if (data.get("website")) {
      setStatus("success");
      form.reset();
      return;
    }

    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setErrorMsg("Veuillez remplir votre nom, votre courriel et votre message.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Échec de l'envoi");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg(
        "Une erreur est survenue. Réessayez ou appelez-nous au (450) 467-6492."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-3xl bg-tint-2 p-8 text-center shadow-sm"
      >
        <p className="font-heading text-2xl text-primary">Merci !</p>
        <p className="mt-2 text-text/80">
          Votre message a bien été envoyé. Nous vous répondrons rapidement.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-600 text-primary underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
      {/* Honeypot caché */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />

      <div className="grid gap-2">
        <label htmlFor="name" className="label text-text">
          Nom <span className="text-primary">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="rounded-xl border border-text/15 bg-surface px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="email" className="label text-text">
            Courriel <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-xl border border-text/15 bg-surface px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="phone" className="label text-text">
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="rounded-xl border border-text/15 bg-surface px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="message" className="label text-text">
          Message <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="resize-y rounded-xl border border-text/15 bg-surface px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-600 text-primary">
          {errorMsg}
        </p>
      )}

      <p className="text-xs text-muted">
        Les renseignements que vous nous transmettez servent uniquement à
        répondre à votre demande. Voir notre{" "}
        <a href="/politique-de-confidentialite" className="underline">
          politique de confidentialité
        </a>
        .
      </p>

      <button
        type="submit"
        disabled={status === "loading"}
        className="label justify-self-start rounded-full bg-primary px-7 py-4 text-white shadow-md shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
      >
        {status === "loading" ? "Envoi en cours…" : "Envoyer mon message"}
      </button>
    </form>
  );
}
