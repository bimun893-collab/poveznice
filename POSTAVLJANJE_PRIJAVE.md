# Postavljanje prijave, ljestvice i pretplate

Dijeljenje radi odmah. Prijava, statistika na svim uređajima, ljestvica i plaćena arhiva rade tek kad se postavi **Supabase** (besplatna baza korisnika). Dok je `config.js` prazan, igra radi kao i dosad, bez prijave.

---

## 1. Supabase račun i projekt (10 minuta)

1. Otvori **supabase.com** → **Start your project** → prijavi se GitHub računom.
2. **New project**:
   - Name: `poveznice`
   - Database password: izmisli jaku lozinku i **spremi je** (ne treba je slati nikome)
   - Region: **Central EU (Frankfurt)**, da podaci ostanu u EU
   - Plan: **Free**
3. Pričekaj 1–2 minute da se projekt napravi.

## 2. Baza podataka

1. Lijevo: **SQL Editor** → **New query**.
2. Otvori datoteku `supabase/shema.sql` iz ovog repozitorija, kopiraj cijeli sadržaj i zalijepi ga.
3. Klikni **Run**. Treba pisati *Success. No rows returned*.

## 3. Postavke prijave

1. Lijevo: **Authentication** → **URL Configuration**:
   - **Site URL:** `https://4x4.com.hr`
   - **Redirect URLs** → Add URL, dodaj obje:
     - `https://4x4.com.hr/**`
     - `https://bimun893-collab.github.io/poveznice/**`
2. **Authentication** → **Emails** (ili *Email Templates*) → **Magic Link**. Prevedi poruku na hrvatski:
   - Subject: `Prijava u Poveznice`
   - Body:
     ```html
     <h2>Prijava u Poveznice</h2>
     <p>Klikni na poveznicu za prijavu:</p>
     <p><a href="{{ .ConfirmationURL }}">Prijavi me</a></p>
     <p>Ako nisi tražio/la prijavu, zanemari ovu poruku.</p>
     ```
   Isto napravi i za predložak **Confirm signup**.
3. **Project Settings** → **API** (ili gumb **Connect**). Kopiraj:
   - **Project URL** (npr. `https://abcdefgh.supabase.co`)
   - **anon public** ključ (dugačak niz koji počinje s `eyJ…`, ili `sb_publishable_…`)

   Ta dva podatka su javna i smiješ ih poslati Claudeu. Claude ih upiše u `config.js` i prijava proradi.
   **Nikad nemoj slati niti objavljivati ključ `service_role` / `secret`.**

> **Važno za kasnije:** Supabaseov ugrađeni služitelj za e-poštu šalje samo vrlo malo e-mailova na sat i služi samo za probu. Prije javnog lansiranja treba postaviti vlastiti SMTP (npr. besplatni **Resend** ili **Brevo**): Authentication → Emails → SMTP Settings. Besplatni projekt se uspava nakon tjedan dana bez korištenja, ali uz svakodnevne igrače to se neće dogoditi.

## 4. (Neobavezno) Prijava Google računom

1. **Google Cloud Console** → novi projekt → *APIs & Services* → *OAuth consent screen* (External, ime aplikacije Poveznice).
2. *Credentials* → *Create credentials* → *OAuth client ID* → *Web application*.
   - Authorized redirect URI: adresa koju Supabase prikazuje pod **Authentication → Providers → Google** ("Callback URL").
3. Client ID i Client Secret upiši u Supabase → **Authentication → Providers → Google** → Enable.
4. U `config.js` postavi `googleLogin: true`.

## 5. Pretplata na arhivu (tek kad otvoriš obrt)

Za redovitu naplatu u Hrvatskoj potreban je registriran obrt (npr. paušalni). Posavjetuj se s knjigovođom. Kad obrt postoji:

1. Otvori račun na **lemonsqueezy.com**. Lemon Squeezy je *merchant of record*, što znači da sam obračunava i plaća PDV u EU.
2. Napravi proizvod **Poveznice – arhiva**, tip *Subscription*, **1,99 €/mjesec**.
3. Kopiraj poveznicu za kupnju (*Share* → *Checkout link*) i pošalji je Claudeu, ili je upiši u `config.js` → `checkoutUrl`.
4. Postavi webhook (Claude ti može pomoći korak po korak):
   - Instaliraj Supabase CLI i pokreni:
     ```
     supabase functions deploy lemonsqueezy-webhook --no-verify-jwt --project-ref TVOJ_PROJECT_REF
     supabase secrets set LEMONSQUEEZY_SIGNING_SECRET=izmisli-dugi-tajni-niz --project-ref TVOJ_PROJECT_REF
     ```
   - U Lemon Squeezyju → Settings → Webhooks → **+**:
     - URL: `https://TVOJ_PROJECT_REF.supabase.co/functions/v1/lemonsqueezy-webhook`
     - Signing secret: isti tajni niz kao gore
     - Events: svi `subscription_*`
5. U `config.js` postavi `paywall: true`. Od tada je besplatna samo današnja zagonetka, a arhiva se otključava pretplatom.

> **Napomena:** zagonetke su javno u repozitoriju (GitHub Pages zahtijeva javni repozitorij), pa tehnički potkovan korisnik može zaobići zaključavanje arhive. Za ovakvu igru to je prihvatljivo: plaćaju oni koji žele jednostavno igrati stare zagonetke i podržati igru.
