"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Inline SVG logo matching the real ExecHub logo colours
function Logo() {
  return (
    <svg viewBox="0 0 210 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
      <path d="M22 5C9.8 5 1 13.5 1 24s8.8 19 21 19h8v-8h-8c-7 0-12-5-12-11s5-11 12-11h8V5z" fill="#4a90d9"/>
      <rect x="13" y="10" width="22" height="7" rx="3.5" fill="#4a90d9"/>
      <rect x="13" y="20.5" width="15" height="6" rx="3" fill="#6aaee8"/>
      <rect x="13" y="30" width="22" height="7" rx="3.5" fill="#4a90d9"/>
      <text x="44" y="33" fontFamily="'DM Sans',sans-serif" fontWeight="400" fontSize="22" fill="#0d2060" letterSpacing="-0.4">Exec</text>
      <text x="104" y="33" fontFamily="'DM Sans',sans-serif" fontWeight="700" fontSize="22" fill="#0d2060" letterSpacing="-0.4">Hub</text>
    </svg>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const isChat = pathname.startsWith("/chat");
  const isDashboard = pathname === "/dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-exec-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/dashboard">
          <Logo />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              isDashboard
                ? "bg-exec-blue-pale text-navy font-medium"
                : "text-exec-mid hover:text-navy hover:bg-exec-off"
            }`}
          >
            Dashboard
          </Link>

          {/* Back to dashboard when in chat */}
          {isChat && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-exec-light hover:text-navy transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}