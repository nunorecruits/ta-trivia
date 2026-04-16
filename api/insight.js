export default async function handler(req, res) {
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 400,
      messages: req.body.messages
    })
  });

  const data = await response.json();
  res.json(data);
}