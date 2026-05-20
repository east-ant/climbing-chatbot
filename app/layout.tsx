import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "ClimbMate AI — 클라이밍 센터 AI 고객 응대 챗봇",
  description:
    "AI + RAG + SaaS 활용 구조를 보여주는 클라이밍 센터 고객센터 챗봇 데모",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-surface text-text-primary font-sans">
        <Sidebar />
        <main className="ml-[260px] min-h-screen bg-grid-pattern">
          {children}
        </main>
      </body>
    </html>
  );
}
