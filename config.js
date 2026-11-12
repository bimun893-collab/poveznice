// Postavke igre Poveznice.
// Dok je supabaseUrl prazan, igra radi bez prijave (kao dosad).
// Upute za postavljanje: POSTAVLJANJE_PRIJAVE.md
window.POVEZNICE_CONFIG = {
  // Supabase → Project Settings → API (ili "Connect"): Project URL i "anon public" ključ.
  // Oba su javna i smiju biti ovdje. NIKAD ovdje ne stavljaj "service_role" ključ.
  supabaseUrl: "",
  supabaseAnonKey: "",

  // Prijava Google računom (uključi tek kad je Google postavljen u Supabaseu).
  googleLogin: false,

  // Plaćena arhiva. Uključi (true) tek kad imaš obrt i Lemon Squeezy pretplatu.
  paywall: false,
  checkoutUrl: "",          // Lemon Squeezy → Products → Share → poveznica za kupnju
  price: "1,99 € mjesečno",

  // Adresa igre (za poveznice pri dijeljenju)
  siteUrl: "https://4x4.com.hr/"
};
