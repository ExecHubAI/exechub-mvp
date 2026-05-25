import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { EXECS, ExecRole } from "@/lib/execs";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const question = formData.get("question") as string || "";
    const execRole = (formData.get("exec") as ExecRole) || "CFO";
    const file = formData.get("file") as File | null;

    if (!question && !file) {
      return NextResponse.json({ error: "Please enter a question or attach a document." }, { status: 400 });
    }

    const exec = EXECS[execRole] || EXECS.CFO;
    const messageContent: Anthropic.MessageParam["content"] = [];

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");

      if (file.type === "application/pdf") {
        messageContent.push({
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: base64,
          },
        } as any);
      } else if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/webp"
      ) {
        messageContent.push({
          type: "image",
          source: {
            type: "base64",
            media_type: file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            data: base64,
          },
        });
      } else {
        const text = buffer.toString("utf-8");
        messageContent.push({
          type: "text",
          text: `Here is the content of the attached file (${file.name}):\n\n${text}`,
        });
      }
    }

    const questionText = question ||
      `Please analyse the attached document and provide your ${execRole} perspective.`;

    messageContent.push({
      type: "text",
      text: questionText,
    });

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: exec.systemPrompt,
      messages: [{ role: "user", content: messageContent }],
    });

    const responseText = message.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("\n");

    return NextResponse.json({ response: responseText });

  } catch (err: unknown) {
    console.error("Executive API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Something went wrong: ${message}` },
      { status: 500 }
    );
  }
}
