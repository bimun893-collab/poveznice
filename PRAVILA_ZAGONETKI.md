# Pravila za izradu zagonetki – Poveznice

Ova pravila vrijede za svaku novu zagonetku, bez obzira radi li je čovjek ili Claude.

## Oblik
- Jedna zagonetka po danu, 4 skupine × 4 riječi = 16 različitih riječi.
- Skupine su poredane po težini: 1. 🟨 lagano, 2. 🟩 srednje, 3. 🟦 teže, 4. 🟪 najteže.
- Riječi pisati VELIKIM SLOVIMA, hrvatskim pravopisom, bez razmaka, najviše 13 slova.
- Datoteka: `zagonetke/GGGG-MM.json`, ključ je datum (`"2026-12-01"`), a mjesec se upisuje u `zagonetke/popis.json`.

## Zamke (najvažnije)
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
