import WebSocket from "ws";

let globalBot = null;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { apiKey } = JSON.parse(req.body);
    if (globalBot) return res.status(400).json({ message: "Bot already running" });

    globalBot = runDerivBot(apiKey);
    return res.status(200).json({ message: "Bot started" });
  }

  if (req.method === "DELETE") {
    if (globalBot && globalBot.ws) {
      globalBot.ws.close();
      globalBot = null;
    }
    return res.status(200).json({ message: "Bot stopped" });
  }

  return res.status(405).end();
}

function runDerivBot(apiKey) {
  const ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=1089");

  let balance = 0;
  let pnl = 0;
  let running = true;
  let ticks = [];

  ws.on("open", () => {
    console.log("✅ Connected to Deriv Demo");
    ws.send(JSON.stringify({ authorize: apiKey }));
  });

  ws.on("message", async (msg) => {
    const data = JSON.parse(msg.toString());

    if (data.error) {
      console.log("❌", data.error.message);
      running = false;
      return;
    }

    if (data.msg_type === "authorize") {
      console.log("🔑 Authorized:", data.authorize.loginid);
      ws.send(JSON.stringify({ balance: 1, subscribe: 1 }));
      ws.send(JSON.stringify({ ticks: "R_100", subscribe: 1 }));
    }

    if (data.msg_type === "balance") {
      balance = data.balance.balance;
      pnl = balance - 1000; // Assume demo starts at 1000 USD
      console.log("💰 Balance:", balance.toFixed(2), "USD", "PnL:", pnl.toFixed(2));
    }

    if (data.msg_type === "tick") {
      ticks.push(data.tick.quote);
      if (ticks.length > 50) ticks.shift();

      // Simple trade logic demo — random CALL/PUT
      if (ticks.length >= 20 && running) {
        const dir = Math.random() > 0.5 ? "CALL" : "PUT";
        const stake = 2.0;

        ws.send(
          JSON.stringify({
            proposal: 1,
            amount: stake,
            basis: "stake",
            contract_type: dir,
            currency: "USD",
            duration: 1,
            duration_unit: "t",
            symbol: "R_100",
          })
        );

        running = false; // prevent multiple trades at once
        setTimeout(() => (running = true), 3000);
      }
    }

    if (data.msg_type === "proposal") {
      const id = data.proposal.id;
      const price = data.proposal.display_value;
      ws.send(JSON.stringify({ buy: id, price }));
    }

    if (data.msg_type === "buy") {
      console.log("🟢 Bought contract:", data.buy.contract_id);
    }
  });

  ws.on("close", () => console.log("⚠️ Bot disconnected"));

  return { ws };
}
