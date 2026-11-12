// Poveznice – webhook za pretplatu preko Lemon Squeezyja.
// Lemon Squeezy pozove ovu funkciju kad se pretplata otvori, obnovi, otkaže ili istekne,
// a funkcija upiše do kada korisnik ima pristup arhivi (profiles.subscriber_until).
//
// Postavljanje (kad bude obrta i Lemon Squeezy računa) – vidi POSTAVLJANJE_PRIJAVE.md, korak 4.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SECRET = Deno.env.get("LEMONSQUEEZY_SIGNING_SECRET") ?? "";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

async function validSignature(body: string, signature: string): Promise<boolean> {
  if (!SECRET || !signature) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (hex.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const body = await req.text();
  if (!(await validSignature(body, req.headers.get("X-Signature") ?? ""))) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(body);
  const name: string = event?.meta?.event_name ?? "";
  const userId: string | undefined = event?.meta?.custom_data?.user_id;
  const attrs = event?.data?.attributes ?? {};
  if (!name.startsWith("subscription_") || !userId) return new Response("Ignored", { status: 200 });

  // Pristup traje do kraja plaćenog razdoblja (ends_at kod otkazane, renews_at kod aktivne pretplate).
  let until: string | null = attrs.ends_at ?? attrs.renews_at ?? null;
  if (attrs.status === "expired" || attrs.status === "unpaid") until = new Date().toISOString();

  const { error } = await db.from("profiles").update({ subscriber_until: until }).eq("id", userId);
  if (error) return new Response("DB error: " + error.message, { status: 500 });
  return new Response("OK", { status: 200 });
});
