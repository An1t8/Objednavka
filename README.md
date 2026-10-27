# Objednavka

Kurýrní server pro první úlohu komunikace mezi restaurací a kurýrem.

## Spuštění

Je potřeba Node.js 18 nebo novější. Ve složce projektu spusťte:

```sh
npm install
npm start
```

Server běží na `http://localhost:3000`.

## Formát objednávky

```json
{
  "id": "objednavka1",
  "callbackUrl": "http://localhost:3001/update"
}
```

`id` je unikátní identifikátor objednávky. `callbackUrl` je adresa restaurace pro budoucí aktualizace stavu; v této úloze se ještě nepoužívá.

## Ověření

V druhém terminálu ve složce projektu spusťte:

```sh
curl -i -X POST http://localhost:3000/order \
  -H 'Content-Type: application/json' \
  --data @objednavka.json
```

Server vypíše přijatou objednávku a vrátí HTTP `202 Accepted` s prázdným tělem odpovědi.
