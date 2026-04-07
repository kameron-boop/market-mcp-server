import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MCP server running");
});

// THIS is what Claude needs
app.post("/mcp", async (req, res) => {
  const { method, params, id } = req.body;

  // Step 1: Claude asks what tools exist
  if (method === "tools/list") {
    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          {
            name: "get_quote",
            description: "Get stock price",
            input_schema: {
              type: "object",
              properties: {
                symbol: { type: "string" }
              },
              required: ["symbol"]
            }
          }
        ]
      }
    });
  }

  // Step 2: Claude calls the tool
  if (method === "tools/call" && params.name === "get_quote") {
    const symbol = params.arguments.symbol;

    const r = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    const data = await r.json();

    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        content: [
          {
            type: "text",
            text: JSON.stringify(data)
          }
        ]
      }
    });
  }

  return res.json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Method not found" }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running");
});
