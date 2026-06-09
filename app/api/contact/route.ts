import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Destinataire des notifications de formulaire (verger).
const CONTACT_TO = "vergerfrancoislegault@hotmail.com";
// Expéditeur : domaine vérifié dans Resend si configuré, sinon domaine d'essai.
const CONTACT_FROM =
  process.env.RESEND_FROM || "Verger François Legault <onboarding@resend.dev>";

async function sendNotification(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY absente — courriel non envoyé.");
    return;
  }
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: data.email,
    subject: `Nouveau message du site — ${data.name}`,
    text: [
      `Nom : ${data.name}`,
      `Courriel : ${data.email}`,
      `Téléphone : ${data.phone || "—"}`,
      "",
      "Message :",
      data.message,
    ].join("\n"),
  });
}

// Rate limiting simple en mémoire : max 3 soumissions / IP / heure.
const submissions = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  submissions.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez plus tard." },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; phone?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Champs requis manquants." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Adresse courriel invalide." },
      { status: 400 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Notification courriel au verger (n'empêche jamais la réponse au visiteur).
  async function notify() {
    try {
      await sendNotification({ name, email, phone, message });
    } catch (err) {
      console.error("[contact] Échec envoi courriel:", err);
    }
  }

  // Si Supabase n'est pas encore configuré (preview), on accepte sans planter.
  if (!url || !key) {
    console.warn("[contact] Supabase non configuré — message non persisté:", {
      name,
      email,
    });
    await notify();
    return NextResponse.json({ ok: true, persisted: false });
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: phone || null,
    message,
  });

  if (error) {
    console.error("[contact] Erreur Supabase:", error.message);
    return NextResponse.json(
      { error: "Échec de l'enregistrement." },
      { status: 500 }
    );
  }

  await notify();
  return NextResponse.json({ ok: true, persisted: true });
}
