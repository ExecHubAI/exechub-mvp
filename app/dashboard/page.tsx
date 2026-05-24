import Link from "next/link";
import { EXECS, EXEC_ORDER } from "@/lib/execs";

const BRIEFINGS = [
  {
    priorities: [
      "Review your cash position and calculate your exact runway this week.",
      "Identify your top three customer acquisition channels and their cost per lead.",
      "Clarify team responsibilities to reduce cross-functional friction.",
    ],
    risk: "Burn rate creeping above plan — flag before it becomes a board conversation.",
    action: "Schedule a 30-minute finance review before Friday.",
  },
  {
    priorities: [
      "Audit your three largest cost lines for reduction opportunities.",
      "Follow up on any outstanding client proposals or contracts.",
      "Review your hiring pipeline — slow recruitment compounds quickly.",
    ],
    risk: "Over-reliance on a single customer — concentration risk worth addressing now.",
    action: "Map your top five customers by revenue and assess dependency.",
  },
  {
    priorities: [
      "Check your 90-day revenue forecast against actuals.",
      "Review your marketing spend efficiency — CPL trending vs target.",
      "Identify one process you could delegate or automate this week.",
    ],
    risk: "No documented processes means key-person risk in every role.",
    action: "Pick one core process and write a one-page SOP for it today.",
  },
];

function getDailyBriefing() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return BRIEFINGS[dayOfYear % BRIEFINGS.length];
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
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

function Logo() {
  return <img src="/logo.png" alt="ExecHub" style={{height:36,width:'auto',display:'block'}} />;
}

export default function DashboardPage() {
  const briefing = getDailyBriefing();
  const dateStr = getFormattedDate();

  return (
    <div className="page-wrapper">

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo"><Logo /></div>
        <div className="nav-links">
          <a href="/dashboard" className="nav-link active">Dashboard</a>
        </div>
      </nav>

      <main className="main-content animate-rise">

        {/* Header */}
        <p className="dashboard-date">{dateStr}</p>
        <h1 className="dashboard-title">Good morning.</h1>
        <p className="dashboard-subtitle">Your executive team is ready. Here&apos;s your briefing.</p>

        {/* Briefing card */}
        <div className="briefing-card">
          <div className="briefing-header">
            <div className="briefing-dot" />
            <span className="briefing-label">Daily Executive Briefing</span>
          </div>

          <p className="priorities-label">Top Priorities</p>
          {briefing.priorities.map((item, i) => (
            <div key={i} className="priority-item">
              <span className="priority-num">{i + 1}</span>
              <span className="priority-text">{item}</span>
            </div>
          ))}

          <div className="briefing-divider" />

          <div className="briefing-meta-item">
            <span className="briefing-meta-icon">⚠</span>
            <div>
              <p className="briefing-meta-label">Key Risk</p>
              <p className="briefing-meta-text">{briefing.risk}</p>
            </div>
          </div>

          <div className="briefing-meta-item">
            <span className="briefing-meta-icon" style={{color:'#4a90d9'}}>→</span>
            <div>
              <p className="briefing-meta-label">Suggested Action</p>
              <p className="briefing-meta-text">{briefing.action}</p>
            </div>
          </div>
        </div>

        {/* Exec grid */}
        <h2 className="exec-section-title">Your Executive Team</h2>
        <p className="exec-section-sub">Choose an exec and ask them anything about your business.</p>

        <div className="exec-grid">
          {EXEC_ORDER.map((role) => {
            const exec = EXECS[role];
            return (
              <Link key={role} href={`/chat?exec=${role}`} className="exec-card">
                <div className="exec-card-top">
                  <div className="exec-icon-wrap" style={{background: exec.bgColour.replace('bg-','').includes('-') ? '' : exec.bgColour, backgroundColor: exec.id === 'CFO' ? '#eff6ff' : exec.id === 'COO' ? '#f0fdf4' : exec.id === 'CMO' ? '#fff1f2' : exec.id === 'CTO' ? '#f5f3ff' : exec.id === 'CLO' ? '#fff7ed' : exec.id === 'CHRO' ? '#fdf2f8' : '#fffbeb'}}>
                    <ExecIcon id={exec.id} colour={exec.iconColour} />
                  </div>
                  <span className="exec-role-badge" style={{color: exec.iconColour}}>{exec.id}</span>
                </div>
                <h3 className="exec-card-title">{exec.title}</h3>
                <p className="exec-card-focus">{exec.focus}</p>
                <span className="exec-card-cta" style={{color: exec.iconColour}}>Ask {exec.id} →</span>
              </Link>
            );
          })}
        </div>

      </main>
    </div>
  );
}