export async function askOpenAI(message) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("OpenAI API Error:", errorText);
      return "⚠ OpenAI API error:\n" + errorText;
    }

    const json = await res.json();

    if (!json.choices || !json.choices[0]) {
      console.error("Invalid response:", json);
      return "⚠ Invalid response from AI.";
    }

    return json.choices[0].message.content;

  } catch (err) {
    console.error("Network error:", err);
    return "⚠ Network error contacting AI.";
  }
}
