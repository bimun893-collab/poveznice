// Automatski testovi za zagonetke igre Poveznice.
// Pokretanje:  node testovi/provjeri.mjs [MJESEC]     npr.  node testovi/provjeri.mjs 2026-12
// Bez argumenta provjerava sve mjesece iz zagonetke/popis.json.
// Izlazni kod 0 = sve u redu, 1 = ima grešaka. Izvještaj za ručni pregled zapisuje u testovi/izvjestaj-MJESEC.md

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "zagonetke");
const MAX_LEN = 13;              // najdulja riječ koja još stane na pločicu na mobitelu
const HISTORY_MONTHS = 6;        // koliko se mjeseci unatrag ne smiju ponavljati riječi
const LETTERS = /^[A-ZČĆĐŠŽ]+$/; // samo velika slova, bez razmaka

const months = JSON.parse(readFileSync(join(DIR, "popis.json"), "utf8"));
const target = process.argv[2] ? [process.argv[2]] : months;

let errors = 0, warnings = 0;
const err = (m) => { errors++; console.log("  ✗ GREŠKA: " + m); };
const warn = (m) => { warnings++; console.log("  ! Upozorenje: " + m); };

function loadMonth(m) {
  const f = join(DIR, m + ".json");
  if (!existsSync(f)) return null;
  try { return JSON.parse(readFileSync(f, "utf8")); }
  catch (e) { err(`${m}.json nije ispravan JSON: ${e.message}`); return null; }
}
const daysIn = (m) => { const [y, mo] = m.split("-").map(Number); return new Date(y, mo, 0).getDate(); };

for (const m of target) {
  console.log(`\n=== Mjesec ${m} ===`);
  if (!months.includes(m)) err(`${m} nije upisan u zagonetke/popis.json`);
  const data = loadMonth(m);
  if (!data) { err(`nema datoteke zagonetke/${m}.json`); continue; }
  const dates = Object.keys(data).sort();

  // 1. Broj dana i kontinuitet
  const isFirst = months.indexOf(m) === 0;
  const expected = daysIn(m);
  if (dates.some(d => !d.startsWith(m + "-"))) err("neki datumi ne pripadaju ovom mjesecu");
  if (!isFirst && dates.length !== expected) err(`ima ${dates.length} zagonetki, a mjesec ima ${expected} dana`);
  for (let i = 1; i < dates.length; i++) {
    const a = new Date(dates[i - 1]), b = new Date(dates[i]);
    if ((b - a) / 86400000 !== 1) err(`rupa u datumima između ${dates[i - 1]} i ${dates[i]}`);
  }
  if (!isFirst && dates[0] !== m + "-01") err(`mjesec ne počinje prvim danom (${dates[0]})`);

  // 2. Povijest: riječi i teme iz prethodnih mjeseci
  const idx = months.indexOf(m);
  const prevWords = new Map(), prevThemes = new Map();
  months.slice(Math.max(0, idx - HISTORY_MONTHS), Math.max(0, idx)).forEach(pm => {
    const pd = loadMonth(pm) || {};
    for (const [d, p] of Object.entries(pd)) for (const [name, words] of p) {
      words.forEach(w => prevWords.set(w, d));
      prevThemes.set(name.toLowerCase(), d);
    }
  });

  // 3. Svaka zagonetka
  const seen = new Map();
  for (const d of dates) {
    const p = data[d];
    if (!Array.isArray(p) || p.length !== 4) { err(`${d}: zagonetka mora imati točno 4 skupine`); continue; }
    const all = [];
    p.forEach(([name, words], gi) => {
      if (typeof name !== "string" || !name.trim()) err(`${d}: skupina ${gi + 1} nema naziv`);
      if (!Array.isArray(words) || words.length !== 4) { err(`${d}: skupina "${name}" nema točno 4 riječi`); return; }
      words.forEach(w => {
        all.push(w);
        if (!LETTERS.test(w)) err(`${d}: "${w}" sadrži nedopuštene znakove (dopuštena su samo velika slova, bez razmaka)`);
        if (w.length > MAX_LEN) err(`${d}: "${w}" je predugačka (${w.length} > ${MAX_LEN})`);
        if (seen.has(w)) err(`${d}: "${w}" se već pojavila ${seen.get(w)}`);
        else seen.set(w, d);
        if (prevWords.has(w)) err(`${d}: "${w}" je već korištena ${prevWords.get(w)}`);
      });
      if (prevThemes.has(name.toLowerCase())) warn(`${d}: tema "${name}" već je bila ${prevThemes.get(name.toLowerCase())}`);
    });
    if (new Set(all).size !== all.length) err(`${d}: ista riječ se pojavljuje dvaput u zagonetki`);
    // Riječ koja sadrži drugu riječ iz iste zagonetke može zbuniti – samo upozorenje
    for (const a of all) for (const b of all)
      if (a !== b && b.length >= 3 && a.includes(b)) warn(`${d}: "${a}" sadrži "${b}" – provjeri je li to namjerno`);
  }

  // 4. Izvještaj za ručni pregled
  const lines = [`# Poveznice – pregled zagonetki za ${m}`, "",
    "Za svaku zagonetku provjeri: (1) postoji li samo jedno rješenje, (2) je li zamka poštena, (3) pravopis.", "",
    "Boje: 🟨 lagano · 🟩 srednje · 🟦 teže · 🟪 najteže", ""];
  const em = ["🟨", "🟩", "🟦", "🟪"];
  for (const d of dates) {
    lines.push(`## ${d}`, "");
    data[d].forEach(([n, w], i) => lines.push(`- ${em[i]} **${n}**: ${w.join(", ")}`));
    lines.push("", "- [ ] pregledano", "");
  }
  writeFileSync(join(ROOT, "testovi", `izvjestaj-${m}.md`), lines.join("\n"));
  console.log(`  ${dates.length} zagonetki provjereno · izvještaj: testovi/izvjestaj-${m}.md`);
}

console.log(`\nUkupno: ${errors} grešaka, ${warnings} upozorenja.`);
process.exit(errors ? 1 : 0);
