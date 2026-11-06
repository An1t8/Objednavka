const express = require("express");
const crypto = require("crypto");

process.loadEnvFile();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const SHARED_SECRET = process.env.SHARED_SECRET;

if (!SHARED_SECRET) {
  throw new Error("SHARED_SECRET is not configured");
}

app.use(express.json());

async function sendWebhook(order, status) {
  const payload = {
    event_id: `${order.eventPrefix}-${status}`,
    id: order.id,
    status,
  };

  const body = JSON.stringify(payload);

  const signature = crypto
    .createHmac("sha256", SHARED_SECRET)
    .update(body, "utf8")
    .digest("hex");

  try {
    const response = await fetch(order.callbackURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Signature": signature,
      },
      body,
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

  order.eventPrefix = crypto.randomUUID();

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

app.listen(PORT, HOST, () => {
  console.log(`Courier server listening on ${HOST}:${PORT}`);
});
