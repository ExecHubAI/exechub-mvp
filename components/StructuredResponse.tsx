"use client";

// ── StructuredResponse ────────────────────────────────────────
// Parses the AI's ## Section / content format and renders
// each section with a gold label and styled body text.

interface Props {
  content: string;
  iconColour: string;
}

export default function StructuredResponse({ content, iconColour }: Props) {
  // Split on markdown ## headers
  const parts = content.split(/(?=##\s)/);

  return (
    <div className="space-y-4">
      {parts.map((part, i) => {
        const lines = part.trim().split("\n");
        const firstLine = lines[0];
        const isHeader = firstLine.startsWith("##");

        if (!isHeader) {
          // Plain text block
          return (
            <p key={i} className="text-sm text-exec-mid leading-relaxed">
              {part.trim()}
            </p>
          );
        }

        const heading = firstLine.replace(/^##\s*/, "").trim();
        const body = lines.slice(1).join("\n").trim();

        return (
          <div key={i} className="response-section">
            <p
              className="font-mono text-xs tracking-widest uppercase mb-2 font-medium"
              style={{ color: iconColour }}
            >
              {heading}
            </p>
            <div className="text-sm text-exec-mid leading-relaxed whitespace-pre-wrap">
              {body}
            </div>
          </div>
        );
      })}
    </div>
  );
}