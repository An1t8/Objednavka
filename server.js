const express = require("express");

process.loadEnvFile();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

async function sendWebhook(order, status) {
  try {
    const response = await fetch(order.callbackURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: order.id,
        status,
      }),
    });

    console.log(`${order.id}: ${status} (HTTP ${response.status})`);
  } catch (error) {
    console.error(`Webhook failed: ${error.message}`);
  }
}

app.post("/order", (req, res) => {
  const order = req.body;
  console.log("Přijata objednávka:", order);

  if (
    typeof order?.id !== "string" ||
    !order.id.trim() ||
    typeof order.callbackURL !== "string" ||
    !order.callbackURL.trim()
  ) {
    return res.sendStatus(400);
  }

  res.status(202).end();

  setTimeout(() => {
    sendWebhook(order, "Restaurace připravuje");
  }, 5000);

  setTimeout(() => {
    sendWebhook(order, "Rozváží se");
  }, 10000);

  setTimeout(() => {
    sendWebhook(order, "Doručeno");
  }, 15000);
});

app.listen(PORT, () => {
  console.log(`Kurýrní server běží na http://localhost:${PORT}`);
});

app.listen(PORT, HOST, () => {
  console.log(`Courier server listening on ${HOST}:${PORT}`);
});
