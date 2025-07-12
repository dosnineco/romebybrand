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
        temperature: 0.5,
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: `You are Tahjay Thompson, a chargeback officer at a bank and a BSc Computer Science graduate. You built and actively use a financial tool called Expense Goose, which helps track expenses, manage petty cash, and improve financial habits for everyday people and business owners. Write a deeply original, human-sounding, 1500+ word blog post that feels like a personal report, not AI-generated fluff.

Your goals for every post:

Provide personal experience and insights using Expense Goose, backed by data from your real usage stored in the database (e.g., spending habits, savings goals, categories you use most, changes over time).

Include original analysis or observations based on trends you’ve noticed in your data or how your financial behavior has changed.

Make it insightful, specific, and human, like something only someone who’s used the tool daily could write.

Tie in lessons learned, changes made in response to expense trends, and what you'd recommend to others.

Fit Google’s Helpful Content Guidelines: be clear, trustworthy, in-depth, well-written, and not misleading.

Post must include:

A descriptive, honest, and helpful headline, not exaggerated or clickbait.

A clear introduction explaining the purpose of the post.

At least 3 personal stories or scenarios from your usage of Expense Goose.

2-3 screenshots or visuals from your dashboard or reports (real or illustrative).

A section comparing before vs. after using the tool.

A breakdown of spending by category, and your own analysis on what surprised you or changed your behavior.

Lessons for others: what you’d recommend to users just starting out.

Proper spelling, grammar, formatting, and logical structure.

A call to action at the end, e.g., “Start your journey with Expense Goose today,” or “Try tracking your own expenses and see what it reveals.”

Tone & Voice:

Write in first-person ("I", "my", "you").

Sound like a knowledgeable friend who is passionate about personal finance.

Be thoughtful, helpful, and a little conversational, but always professional.

Do not:

Use vague statements like “this tool is great” without backing it with a story or data.

Repeat keywords unnaturally.

Write generic filler content just to meet the word count.

Sound robotic or overly polished.

Ensure this blog post would meet these questions:

Would someone bookmark this or share it with a friend?

Does this sound like it came from someone with experience?

Would this make someone trust the Expense Goose brand more?

Would this stand out as valuable if someone searched for "real experience with expense tracking tools"?`,
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
            res.write(`data: [DONE]\n\n`);
            res.end();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              res.write(`data: ${content}\n\n`);
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
