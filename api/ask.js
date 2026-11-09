export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { question } = req.body || {};
  if (!question) return res.status(400).json({ answer: "கேள்வி இல்லை" });
  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: "நீ UPSC/IAS தேர்வுக்கான படிப்பு உதவியாளர். தெளிவான, சுருக்கமான பதில்கள் கொடு. முக்கிய புள்ளிகளை பட்டியலிடு. தமிழில் கேட்டால் தமிழில் பதில் சொல்லு." }] },
          contents: [{ role: "user", parts: [{ text: question }] }]
        })
      }
    );
    const data = await r.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text
      || data.error?.message || "பதில் கிடைக்கவில்லை";
    res.json({ answer });
  } catch (e) {
    res.status(500).json({ answer: "சர்வர் பிழை, மீண்டும் முயற்சி செய்." });
  }
}
