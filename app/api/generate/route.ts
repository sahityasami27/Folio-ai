// app/api/generate/route.ts

export async function POST(req: Request) {
    try {
      const { script, genre, tone } = await req.json();
  
      const prompt = `
  You are a metadata specialist for audio serial fiction.
  
  Return ONLY valid JSON in this exact format:
  {
    "title_options": ["", "", ""],
    "description": "",
    "tags": [],
    "mood_markers": [],
    "content_warnings": [],
    "cliffhanger_summary": "",
    "hook_line": ""
  }
  
  Rules:
  - No extra text outside JSON
  - No spoilers
  - Do not invent plot points
  - Titles under 6 words
  - Tone must strongly influence titles, hooks, and description
  
  Genre: ${genre}
  Tone: ${tone}
  
  Script:
  ${script}
  `;
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );
  
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error.message);
      }
  
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.content?.parts?.[0];
  
      if (!text) {
        console.error("FULL RESPONSE:", data);
        throw new Error("No usable text from Gemini");
      }
  
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
  
      let parsed;
  
      try {
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.error("PARSE ERROR:", cleaned);
        throw new Error("Invalid JSON from model");
      }
  
      return Response.json(parsed);
  
    } catch (error: any) {
      console.error("FULL ERROR:", error);
  
      return new Response(
        JSON.stringify({ error: error.message || "Failed to generate" }),
        { status: 500 }
      );
    }
  }