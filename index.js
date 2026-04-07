import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MCP server is running");
});

// Minimal MCP-style endpoint placeholder
app.post("/mcp", async (req, res) => {
  const body = req.body;

  if (body.method === "tools/list") {
    return res.json({
      jsonrpc: "2.0",
      id: body.id,
      result: {
        tools: [
          {
            name: "get_quote",
            description: "Get a stock quote from Finnhub",
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

  return res.json({
    jsonrpc: "2.0",
    id: body.id,
    error: {
      code: -32601,
      message: "Method not found"
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
