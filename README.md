# Kurýrní server
Kurýrní server přijímá objednávky od restaurace a posílá jí změny jejich stavu.

## Předání objednávky

Restaurace pošle kurýrnímu serveru požadavek `POST /order`. V těle pošle `id` objednávky a `callbackURL`, na kterou má kurýrní server hlásit změny stavu. Pokud kurýrní server odpoví `202 Accepted`, restaurace nastaví stav objednávky na `Accepted`.

## Změna stavu objednávky

Kurýrní server pošle na `callbackURL` požadavek `POST /update` s těmito údaji.

- `event_id` – unikátní ID události, podle kterého restaurace pozná opakované doručení.
- `id` – ID objednávky.
- `status` – nový stav objednávky.

Všechny tři hodnoty musí být neprázdné řetězce. Požadavek musí mít platný podpis v hlavičce `X-Signature`. Kurýrní server ho vypočítá z původního těla požadavku pomocí HMAC-SHA256 a klíče `SHARED_SECRET` a pošle ho v šestnáctkovém formátu.

Restaurace vrátí `200` po uložení změny i při opakovaném doručení stejné události. Při neplatném podpisu vrátí `401` a při neplatných údajích `400`.

## Nastavení a spuštění

Pro spuštění restauračního serveru potřebuješ Node.js a npm. Příklad počítá s tím, že oba servery běží na stejném počítači.

1. Ve složce `Restaurant-Server` vytvoř vedle `server.js` soubor `.env`.

   ```env
   RESTAURANT_HOST=127.0.0.1
   PORT=3001
   COURIER_HOST=127.0.0.1
   COURIER_PORT=3000
   SHARED_SECRET=nahraď-vlastním-klíčem
   ```

   `RESTAURANT_HOST` je adresa restaurace pro hlášení změn a `COURIER_HOST` je adresa kurýrního serveru. Pokud servery běží na různých počítačích, použij jejich síťové adresy. Oba servery musí mít stejnou hodnotu `SHARED_SECRET`.

2. Spusť kurýrní server podle návodu k jeho projektu. V tomto příkladu má běžet na portu `3000`. Repozitář `Restaurant-Server` obsahuje kód restauračního serveru.

3. Ve složce `Restaurant-Server` nainstaluj závislosti a spusť restaurační server.

   ```bash
   npm ci
   node server.js
   ```

4. Otevři v prohlížeči `http://127.0.0.1:3001`.
