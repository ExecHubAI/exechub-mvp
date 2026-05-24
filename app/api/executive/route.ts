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

    // Validate
    if (!question && !file) {
      return NextResponse.json({ error: "Please enter a question or attach a document." }, { status: 400 });
    }

    const exec = EXECS[execRole] || EXECS.CFO;

    // Build message content
    const messageContent: Anthropic.MessageParam["content"] = [];

    // If file attached, read it and add as context
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        // Add as base64 document/image
        const base64 = buffer.toString("base64");
        const mediaType = file.type as "application/pdf" | "image/jpeg" | "image/png" | "image/gif" | "image/webp";

        if (file.type === "application/pdf") {
          messageContent.push({
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: base64,
            },
          } as any);
        } else {
          messageContent.push({
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: base64,
            },
          });
        }
      } else {
        // Text file — read as string
        const text = buffer.toString("utf-8");
        messageContent.push({
          type: "text",
          text: `Here is the content of the attached file (${file.name}):\n\n${text}`,
        });
      }
    }

    // Add the user's question
    const questionText = question ||
      `Please analyse the attached document and provide your ${execRole} perspective.`;

    messageContent.push({
      type: "text",
      text: questionText,
    });

    // Call Claude
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: exec.systemPrompt,
      messages: [
        {
          role: "user",
          content: messageContent,
        },
      ],
    });

    // Extract text response
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