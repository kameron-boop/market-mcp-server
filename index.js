import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const MARKETDATA_API_KEY = process.env.MARKETDATA_API_KEY;

// Home route
app.get("/", (req, res) => {
  res.send("Market MCP Server Running");
});

// Get stock quote (Finnhub)
app.post("/tools/get_quote", async (req, res) => {
  const { symbol } = req.body;

  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
  );

  const data = await response.json();

  res.json({
    symbol,
    price: data.c,
    high: data.h,
    low: data.l
  });
});

// Get options chain (MarketData.app)
app.post("/tools/get_options_chain", async (req, res) => {
  const { symbol } = req.body;

  const response = await fetch(
    `https://api.marketdata.app/v1/options/chain/${symbol}/`,
    {
      headers: {
        Authorization: `Bearer ${MARKETDATA_API_KEY}`
      }
    }
  );

  const data = await response.json();

  res.json(data);
});

app.listen(3000, () => console.log("Server running"));
