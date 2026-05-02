"use client";
import { useState } from "react";

export default function Home() {
  const [script, setScript] = useState("");
  const [genre, setGenre] = useState("Drama");
  const [tone, setTone] = useState("Dramatic");
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script, genre, tone }), // ✅ tone added
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setOutput(null);
      } else {
        setOutput(data);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
      setOutput(null);
    }

    setLoading(false);
  };

  return (
    <main className="h-screen flex text-black bg-white">
      
      {/* LEFT PANEL */}
      <div className="w-1/2 p-6 border-r flex flex-col">
        <h1 className="text-2xl font-bold mb-2">Folio</h1>
        <p className="text-sm text-gray-600 mb-4">
          AI metadata generator for audio storytelling
        </p>

        <select
          className="mb-4 p-2 border rounded"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option>Drama</option>
          <option>Romance</option>
          <option>Fantasy</option>
          <option>Crime/Thriller</option>
          <option>Romantasy</option>
        </select>

        <select
          className="mb-4 p-2 border rounded"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Dramatic</option>
          <option>Dark</option>
          <option>Emotional</option>
          <option>Youthful</option>
        </select>

        <textarea
          className="flex-1 p-3 border rounded"
          placeholder="Paste your episode script here..."
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={!script || loading}
          className="mt-4 bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 p-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Output</h2>

          {output && (
            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                className="px-3 py-1 border border-black rounded text-sm hover:bg-black hover:text-white transition"
              >
                Regenerate
              </button>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(output, null, 2))
                }
                className="px-3 py-1 border border-black rounded text-sm hover:bg-black hover:text-white transition"
              >
                Copy All
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {loading && (
          <p className="text-sm text-gray-500 mb-4">
            Generating insights...
          </p>
        )}

        {output ? (
          <div className="space-y-6">

            {/* Titles */}
            <div>
              <h3 className="font-semibold mb-2">Title Options</h3>
              <div className="flex flex-wrap gap-2">
                {output.title_options?.map((t: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2 flex justify-between">
                Description
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(output.description)
                  }
                  className="text-xs border px-2 py-1 rounded hover:bg-black hover:text-white transition"
                >
                  Copy
                </button>
              </h3>
              <p className="text-sm">{output.description}</p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {output.tags?.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-black text-white text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <h3 className="font-semibold mb-2">Mood</h3>
              <div className="flex flex-wrap gap-2">
                {output.mood_markers?.map((m: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-purple-200 text-xs rounded"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Hook */}
            <div>
              <h3 className="font-semibold mb-2 flex justify-between">
                Hook
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(output.hook_line)
                  }
                  className="text-xs border px-2 py-1 rounded hover:bg-black hover:text-white transition"
                >
                  Copy
                </button>
              </h3>
              <p className="italic text-sm">"{output.hook_line}"</p>
            </div>

            {/* Cliffhanger */}
            <div>
              <h3 className="font-semibold mb-2 flex justify-between">
                Cliffhanger
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(output.cliffhanger_summary)
                  }
                  className="text-xs border px-2 py-1 rounded hover:bg-black hover:text-white transition"
                >
                  Copy
                </button>
              </h3>
              <p className="text-sm">{output.cliffhanger_summary}</p>
            </div>

          </div>
        ) : (
          !loading && (
            <p className="text-gray-400 text-sm">
              Paste a script and click Generate to see AI-powered metadata.
            </p>
          )
        )}
      </div>
    </main>
  );
}