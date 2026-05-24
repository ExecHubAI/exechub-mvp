import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExecHub — Your AI Executive Team",
  description: "CFO, COO, CMO, CTO, CLO, CHRO, CSO and EA — on demand, from your phone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-exec-off">
        {children}
      </body>
    </html>
  );
}