const express = require('express');

const app = express();
const PORT = 3000;

// Automatické zpracování JSON těla požadavku.
app.use(express.json());

// Přijetí nové objednávky k doručení.
app.post('/order', (req, res) => {
  const order = req.body;
  console.log('Přijata objednávka:', order);

  // Objednávka je přijata; odpověď neobsahuje žádné tělo.
  res.status(202).end();
});

app.listen(PORT, () => {
  console.log(`Kurýrní server běží na http://localhost:${PORT}`);
});
