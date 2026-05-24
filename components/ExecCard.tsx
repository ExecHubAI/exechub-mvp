import Link from "next/link";
import { Exec } from "@/lib/execs";

// SVG icons for each exec role
const ICONS: Record<string, React.ReactNode> = {
  CFO: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  COO: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
  ),
  CMO: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  CTO: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  CLO: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  CHRO: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  CSO: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

interface ExecCardProps {
  exec: Exec;
}

export default function ExecCard({ exec }: ExecCardProps) {
  return (
    <Link href={`/chat?exec=${exec.id}`}>
      <div className={`exec-card-hover bg-white border ${exec.borderColour} rounded-xl p-5 cursor-pointer group`}>

        {/* Icon + badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg ${exec.bgColour} flex items-center justify-center`}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={exec.iconColour}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              {/* Render path based on role */}
              {exec.id === "CFO" && (
                <>
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </>
              )}
              {exec.id === "COO" && (
                <>
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </>
              )}
              {exec.id === "CMO" && <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>}
              {exec.id === "CTO" && (
                <>
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </>
              )}
              {exec.id === "CLO" && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
              {exec.id === "CHRO" && (
                <>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </>
              )}
              {exec.id === "CSO" && (
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              )}
            </svg>
          </div>
          <span className={`font-mono text-xs tracking-widest uppercase ${exec.colour} font-medium`}>
            {exec.id}
          </span>
        </div>

        {/* Title + focus */}
        <h3 className="font-display text-base font-semibold text-navy mb-1">
          {exec.title}
        </h3>
        <p className="text-xs text-exec-muted leading-relaxed mb-4">
          {exec.focus}
        </p>

        {/* CTA */}
        <span className={`text-xs font-mono ${exec.colour} group-hover:underline`}>
          Ask {exec.id} →
        </span>

      </div>
    </Link>
  );
}