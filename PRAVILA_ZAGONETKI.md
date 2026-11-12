# Pravila za izradu zagonetki – Poveznice

Ova pravila vrijede za svaku novu zagonetku, bez obzira radi li je čovjek ili Claude.

## Oblik
- Jedna zagonetka po danu, 4 skupine × 4 riječi = 16 različitih riječi.
- Skupine su poredane po težini: 1. 🟨 lagano, 2. 🟩 srednje, 3. 🟦 teže, 4. 🟪 najteže.
- Riječi pisati VELIKIM SLOVIMA, hrvatskim pravopisom, bez razmaka, najviše 13 slova.
- Datoteka: `zagonetke/GGGG-MM.json`, ključ je datum (`"2026-12-01"`), a mjesec se upisuje u `zagonetke/popis.json`.

## Težina po danu u tjednu (obavezno)
Igra uz datum prikazuje zvjezdice prema danu u tjednu, pa zagonetka mora odgovarati toj težini:

| Dan | Oznaka | Sastav |
|---|---|---|
| ponedjeljak, utorak | ⭐ | 3 obične skupine (sa zamkama) + 1 igra riječima |
| srijeda, četvrtak | ⭐⭐ | 2 obične + 2 igre riječima |
| petak, subota, nedjelja | ⭐⭐⭐ | 2 obične + 2 igre riječima; svaka obična skupina ima 5–7 kandidata, zamke povezane u lanac |

Skupine igre riječima uvijek su na 3. i 4. mjestu (plava i ljubičasta). Iste vrste igre riječima (npr. "unatrag", "kriju ___", "___ kava") ne ponavljati više od dvaput u mjesecu.

## Zamke (najvažnije) – zagonetke trebaju biti TEŠKE
- Struktura ostaje 3 obične skupine + 1 ljubičasta (igra riječima), ali **i obične skupine moraju biti lukave**.
- Svaka zagonetka mora imati **najmanje 3 zamke** (riječi koje izgledaju kao da pripadaju drugoj skupini).
- Barem jedna skupina treba imati **5–6 kandidata**, od kojih su samo 4 pravi (npr. 6 riječi izgleda kao otoci, a dva "otoka" zapravo pripadaju skupini "unatrag daju novu riječ").
- Često koristi **lažnu skupinu**: 4 riječi koje izgledaju kao očita skupina (npr. LAMA, PAS, LEOPARD, ZEBRA = "životinje"), a zapravo su raspoređene u druge skupine.
- Zamke se trebaju "lančano" razrješavati: igrač mora riješiti jednu skupinu da bi znao kamo ide sporna riječ.
- Primjer (1. 12. 2026.): ZVIJEZDA (ukras ili svemir?), MIR (svemirska postaja ili RIM unatrag?), RAB i VIS (otoci ili BAR i SIV unatrag?).
- Svaka zagonetka mora imati **barem jednu zamku**: riječ koja izgleda kao da pripada drugoj skupini.
  - Primjer: otoci KRK, HVAR, BRAČ, PAG + skupina "unatrag daju novu riječ" RAB, VIS, TOP, MIR. RAB i VIS izgledaju kao otoci.
- Zamka smije zbuniti, ali **rješenje mora biti jedinstveno**. Ako zamka stvarno pripada u dvije skupine, druga skupina mora već imati 4 jasnija člana, tako da postoji samo jedna ispravna podjela.
- Najteža (ljubičasta) skupina neka bude igra riječima: skrivena riječ, "___ X", unatrag, dodaj ili makni slovo, dvostruko značenje.

## Zabranjeno
- Riječ koja se već pojavila u istom mjesecu ili u zadnjih 6 mjeseci.
- Ista tema (naziv skupine) kao u zadnjih 6 mjeseci, osim ako je stvarno drugačija.
- Opskurne riječi koje prosječan odrasli igrač ne zna; dijalektizmi samo ako su široko poznati.
- Uvredljive teme, politika, stvarne osobe koje su žive, robne marke.

## Provjera prije objave
1. `node testovi/provjeri.mjs GGGG-MM`: mora proći bez grešaka.
2. Test slijepog rješavača: drugi AI agent rješava zagonetke bez rješenja i prijavljuje dvosmislenosti. Svaku prijavu riješiti.
3. Ručni pregled: autorica prođe `testovi/izvjestaj-GGGG-MM.md` i označi svaku zagonetku.
