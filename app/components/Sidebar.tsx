"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageCircle,
  Users,
  ClipboardCheck,
  Mountain,
} from "lucide-react";

const navItems = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/chat", label: "AI 챗봇", icon: MessageCircle },
  { href: "/admin", label: "관리자", icon: Users },
  { href: "/demo", label: "현장 운영 도구", icon: ClipboardCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-surface border-r border-surface-border/30 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg group-hover:shadow-brand-500/20 transition-shadow">
            <Mountain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary leading-tight">
              ClimbMate
            </h1>
            <p className="text-[11px] text-brand-400 font-medium tracking-wider uppercase">
              AI Assistant
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-surface-border/30">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-xs font-medium text-brand-400">
              시스템 상태
            </span>
          </div>
          <p className="text-[11px] text-text-muted">
            RAG · LLM · DB — 데모 모드
          </p>
        </div>
      </div>
    </aside>
  );
}
