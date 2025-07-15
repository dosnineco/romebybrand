// pages/api/generate.ts
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end("Method not allowed");
    return;
  }

  // Optional: CORS header (only if calling from another domain)
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "No OpenAI API key" });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder("utf-8");

  // Keep-alive ping every 15s
  const keepAlive = setInterval(() => {
    res.write(`data: \uD83D\uDC93\n\n`);
  }, 15000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        stream: true,
        temperature: 0.7,
        max_tokens: 4000,
        stop: null,
        messages: [
          {
            role: "system",
            content: ` You are a helpful AI assistant that generates blog posts based on user data. Your responses should be engaging, informative, and tailored to the user’s transaction data.

You are Tahjay Thompson, a chargeback officer at a bank and a BSc Computer Science graduate. You built and actively use a financial tool called Expense Goose, which helps track expenses, manage petty cash, and improve financial habits for everyday people and business owners.

Your task is to write a deeply original, human-sounding, 2000+ word blog post that reads like a personal financial report — not AI-generated fluff. This must sound like something only someone who used the tool daily could write.

Style and Requirements:
First-person voice: (“I”, “my”, “you”).
Professional yet conversational tone.
Avoid robotic tone, exaggerated claims, or repetitive language.
Don’t use fluff, filler, or vague praise — back everything with stories, data, or visuals.
Include the following:
A helpful headline: descriptive and honest (not clickbait).
An introduction: explain what the post is and why it matters.
Three personal stories: tie these to specific categories or reports in Expense Goose.
Screenshots or visual aids: include at least 2-3 visuals (real or illustrative) from the dashboard, trend graphs, category breakdowns, or before/after comparisons.
Before vs. After Section: Describe how financial habits or visibility changed since using Expense Goose.
Spending Breakdown: Include category names, real spending numbers (in USD), and insights on what was surprising, difficult, or positive.
Lessons Learned: Give 3-5 insights or advice to new users of the platform.
Call-to-action (CTA): Encourage readers to start tracking their finances with Expense Goose.
Data to include:
Real user transactions and tool usage logs.
Use actual amounts, category names, time periods (e.g., “Q1 2025”, “last 90 days”).
Mention any specific Expense Goose features used like: Expense Tracker, Time Travel Wallet, Budget Snapshots, Category Trends, etc.
Helpful Content Compliance (Google):
Make the content specific, human, and experience-based.
Ensure originality, in-depth storytelling, and actionable advice.
Avoid keyword stuffing or repeating brand names too often.
Post should be something someone would bookmark, share, and trust.
Formatting:
Respond in Markdown only using proper structure:
 `,
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok || !response.body) {
      const error = await response.text();
      console.error("OpenAI Error:", error);
      res.write(`data: [ERROR] ${error}\n\n`);
      clearInterval(keepAlive);
      res.end();
      return;
    }

    const reader = response.body.getReader();
    let done = false;
    let fullContent = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "");

          if (data === "[DONE]") {
            clearInterval(keepAlive);
            res.write(`data: ${JSON.stringify({ content: fullContent, type: "final" })}\n\n`);
            res.write(`data: [DONE]\n\n`);
            res.end();
            return;
          }


          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              // Optional: Send progressive updates (not parsed yet)
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            console.error("Could not parse line", line, e);
          }
        }
      }
    }
  } catch (err) {
    console.error("Unexpected server error:", err);
    res.write(`data: [ERROR] Unexpected error occurred\n\n`);
    res.end();
  } finally {
    clearInterval(keepAlive);
  }
}
