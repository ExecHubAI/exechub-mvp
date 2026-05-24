"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EXECS, STARTER_PROMPTS, ExecRole } from "@/lib/execs";

type Message = { role: "user" | "assistant"; content: string };

function Logo() {
  return (
    <svg viewBox="0 0 210 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height:36,width:'auto'}}>
      <path d="M22 5C9.8 5 1 13.5 1 24s8.8 19 21 19h8v-8h-8c-7 0-12-5-12-11s5-11 12-11h8V5z" fill="#4a90d9"/>
      <rect x="13" y="10" width="22" height="7" rx="3.5" fill="#4a90d9"/>
      <rect x="13" y="20.5" width="15" height="6" rx="3" fill="#6aaee8"/>
      <rect x="13" y="30" width="22" height="7" rx="3.5" fill="#4a90d9"/>
      <text x="44" y="33" fontFamily="DM Sans,sans-serif" fontWeight="400" fontSize="22" fill="#0d2060" letterSpacing="-0.4">Exec</text>
      <text x="104" y="33" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="22" fill="#0d2060" letterSpacing="-0.4">Hub</text>
    </svg>
  );
}

function ExecIcon({ id, colour }: { id: string; colour: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={colour} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
      {id === "CFO" && (<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>)}
      {id === "COO" && (<><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></>)}
      {id === "CMO" && <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>}
      {id === "CTO" && (<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>)}
      {id === "CLO" && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
      {id === "CHRO" && (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>)}
      {id === "CSO" && <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>}
    </svg>
  );
}

function StructuredResponse({ content, colour }: { content: string; colour: string }) {
  const parts = content.split(/(?=##\s)/);
  return (
    <div>
      {parts.map((part, i) => {
        const lines = part.trim().split("\n");
        const isHeader = lines[0].startsWith("##");
        if (!isHeader) {
          return <p key={i} style={{fontSize:13,color:'var(--mid)',lineHeight:1.65}}>{part.trim()}</p>;
        }
        const heading = lines[0].replace(/^##\s*/, "").trim();
        const body = lines.slice(1).join("\n").trim();
        return (
          <div key={i} className="response-section">
            <p className="response-label" style={{color: colour}}>{heading}</p>
            <p className="response-text">{body}</p>
          </div>
        );
      })}
    </div>
  );
}

function ChatInner() {
  const searchParams = useSearchParams();
  const execId = (searchParams.get("exec") || "CFO") as ExecRole;
  const exec = EXECS[execId] || EXECS.CFO;
  const starters = STARTER_PROMPTS[execId] || [];
  const bgMap: Record<string,string> = {CFO:'#eff6ff',COO:'#f0fdf4',CMO:'#fff1f2',CTO:'#f5f3ff',CLO:'#fff7ed',CHRO:'#fdf2f8',CSO:'#fffbeb'};

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setUploadPreview(file.name);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const sendMessage = async () => {
    const question = input.trim();
    if ((!question && !uploadedFile) || loading) return;
    setInput("");
    setError("");
    const userContent = uploadedFile ? `${question ? question + "\n\n" : ""}[Document: ${uploadedFile.name}]` : question;
    const newMessages: Message[] = [...messages, { role: "user", content: userContent }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("exec", execId);
      if (uploadedFile) formData.append("file", uploadedFile);
      const res = await fetch("/api/executive", { method: "POST", body: formData });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "API error"); }
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setUploadedFile(null);
      setUploadPreview("");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="chat-wrapper">

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo"><Logo /></div>
        <a href="/dashboard" className="nav-back">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Dashboard
        </a>
      </nav>

      {/* Exec identity bar */}
      <div className="chat-exec-bar">
        <div className="exec-identity" style={{borderColor: exec.iconColour + '33'}}>
          <div className="exec-identity-icon" style={{backgroundColor: bgMap[exec.id]}}>
            <ExecIcon id={exec.id} colour={exec.iconColour} />
          </div>
          <div>
            <p className="exec-identity-role" style={{color: exec.iconColour}}>{exec.id}</p>
            <p className="exec-identity-title">{exec.title}</p>
            <p className="exec-identity-focus">{exec.focus}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">

        {messages.length === 0 && !loading && (
          <div className="empty-state">
            <p className="empty-state-text">Ask your {exec.id} anything, or start with one of these:</p>
            <div className="starter-prompts">
              {starters.map((p) => (
                <button key={p} className="starter-btn" onClick={() => setInput(p)}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.role}`}>
            {msg.role === "user" ? (
              <div className="bubble-user">{msg.content}</div>
            ) : (
              <div className="bubble-ai">
                <div className="bubble-ai-header">
                  <span className="bubble-ai-role" style={{color: exec.iconColour}}>{exec.id}</span>
                </div>
                <StructuredResponse content={msg.content} colour={exec.iconColour} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="message-row assistant">
            <div className="bubble-ai">
              <div className="bubble-ai-header">
                <span className="bubble-ai-role" style={{color: exec.iconColour}}>{exec.id}</span>
              </div>
              <div className="loading-dots">
                <div className="loading-dot" />
                <div className="loading-dot" />
                <div className="loading-dot" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-msg">
            <span className="error-pill">⚠ {error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-wrap">
        {uploadPreview && (
          <div className="file-preview">
            <span className="file-tag">📎 {uploadPreview}</span>
            <button className="file-remove" onClick={removeFile}>✕</button>
          </div>
        )}
        <div className="input-box">
          <button className="attach-btn" onClick={() => fileRef.current?.click()} title="Attach document">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3.5"/>
              <path d="M14 6V2h-4"/><path d="M14 2L8 8"/>
            </svg>
          </button>
          <input ref={fileRef} type="file" style={{display:'none'}} accept=".pdf,.png,.jpg,.jpeg,.txt,.csv" onChange={handleFileSelect} />
          <textarea
            className="chat-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask your ${exec.id} anything…`}
            rows={1}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={(!input.trim() && !uploadedFile) || loading}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="input-hint">Enter to send · Shift+Enter for new line · Attach PDF or image</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><p style={{color:'#9aaabb',fontFamily:'monospace',fontSize:13}}>Loading…</p></div>}>
      <ChatInner />
    </Suspense>
  );
}