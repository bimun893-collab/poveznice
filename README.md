# Poveznice

Hrvatska dnevna igra riječi: 16 riječi, 4 skupine, jedna nova zagonetka svaki dan.

## Što je u projektu

| Datoteka | Čemu služi |
|---|---|
| `index.html` | Igra (cijela, u jednoj datoteci) |
| `privatnost.html` | Pravila privatnosti (popuni polja u [ZAGRADAMA]) |
| `zagonetke/popis.json` | Popis mjeseci koje igra učitava |
| `zagonetke/GGGG-MM.json` | Zagonetke za jedan mjesec |
| `testovi/provjeri.mjs` | Automatski testovi zagonetki |
| `testovi/izvjestaj-GGGG-MM.md` | Popis zagonetki za ručni pregled (stvara ga test) |
| `PRAVILA_ZAGONETKI.md` | Pravila za izradu novih zagonetki |
| `.github/workflows/provjera.yml` | GitHub sam pokreće testove kod svake promjene zagonetki |

## Objava na internetu (jednom)

1. Napravi besplatan račun na **github.com**.
2. Klikni **New repository**, nazovi ga `poveznice`, označi **Public**, klikni **Create repository**.
3. Klikni **uploading an existing file** i povuci sve datoteke i mape iz ovog paketa (i skrivenu mapu `.github`). Klikni **Commit changes**.
4. U repozitoriju otvori **Settings → Pages**. Pod *Source* odaberi **Deploy from a branch**, grana **main**, mapa **/(root)**, pa **Save**.
5. Za minutu-dvije igra je na adresi `https://TVOJE-KORISNIČKO-IME.github.io/poveznice/`.

### Vlastita domena (kad je kupiš)
1. Kupi domenu kod registrara (npr. `poveznice.com.hr`).
2. U **Settings → Pages → Custom domain** upiši domenu i spremi.
3. Kod registrara u DNS postavkama dodaj zapise koje GitHub navodi u svojim uputama ("Managing a custom domain for your GitHub Pages site"): četiri A zapisa za glavnu domenu ili CNAME zapis za `www`.
4. Kad GitHub potvrdi domenu, uključi **Enforce HTTPS**.

## Svaki mjesec

1. Nove zagonetke dolaze kao datoteka `zagonetke/GGGG-MM.json` (Claude ih priprema zakazanim zadatkom).
2. Testovi se pokreću automatski. Zelena kvačica na GitHubu znači da su prošli.
3. Pregledaj `testovi/izvjestaj-GGGG-MM.md`.
4. Igru možeš isprobati s budućim zagonetkama tako da adresi dodaš `#pregled`, npr. `.../poveznice/#pregled`. Igrači ne vide buduće zagonetke.
5. Kad je sve u redu, odobri promjenu (Merge). Zagonetke se onda same pojavljuju svaki dan u ponoć.

## Isprobavanje na vlastitom računalu

Igra učitava zagonetke iz datoteka, pa se ne može otvoriti dvoklikom na `index.html`. U mapi projekta pokreni:

```
python -m http.server 8000
```

i otvori `http://localhost:8000` (dodaj `#pregled` za buduće zagonetke). Testovi:

```
node testovi/provjeri.mjs 2026-12
```
