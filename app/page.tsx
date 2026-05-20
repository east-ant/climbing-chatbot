"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageCircle,
  Clock,
  MapPin,
  CreditCard,
  AlertTriangle,
  Mountain,
  HelpCircle,
  Megaphone,
  Footprints,
  ShieldCheck,
  GraduationCap,
  ChevronRight,
  Star,
} from "lucide-react";

interface Member {
  id: number;
  name: string;
  phone: string;
  membership_type: string;
  end_date: string;
  payment_status: string;
}

interface Gym {
  name: string;
  location: string;
  open_time: string;
  close_time: string;
  phone: string;
}

interface Notice {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const beginnerFaqs = [
  {
    icon: Footprints,
    question: "처음인데 뭘 준비해야 하나요?",
    answer: "편한 운동복과 양말만 준비하세요! 클라이밍화는 무료 대여입니다.",
    color: "text-brand-400",
  },
  {
    icon: ShieldCheck,
    question: "안전한가요?",
    answer: "첫 방문 시 30분 안전교육 + 매트 설치 + 전문 스태프 상주합니다.",
    color: "text-blue-400",
  },
  {
    icon: GraduationCap,
    question: "강습이 있나요?",
    answer: "초보자 기초 강습(월·수·금), 무료 클리닉(화·목)을 운영합니다.",
    color: "text-purple-400",
  },
  {
    icon: Star,
    question: "체력이 없어도 가능한가요?",
    answer: "V0 난이도는 사다리 오르기 수준! 기술과 균형이 더 중요합니다.",
    color: "text-amber-400",
  },
];

export default function DashboardPage() {
  const [expiringMembers, setExpiringMembers] = useState<Member[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [membersRes, gymRes, noticesRes] = await Promise.all([
          fetch("/api/members"),
          fetch("/api/gym-info"),
          fetch("/api/notices"),
        ]);
        const membersData = await membersRes.json();
        const gymData = await gymRes.json();
        const noticesData = await noticesRes.json();

        const today = new Date().toISOString().split("T")[0];
        const expiring = (membersData.members || []).filter(
          (m: Member) => m.end_date <= today
        );
        setExpiringMembers(expiring);
        setGyms(gymData.gyms || []);
        setNotices((noticesData.notices || []).slice(0, 3));
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const categoryColors: Record<string, string> = {
    이벤트: "badge-success",
    공지: "badge-info",
    시설: "badge-warning",
    안전: "badge-danger",
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="gradient-text">ClimbMate AI</span> 대시보드
            </h1>
            <p className="text-text-secondary text-sm">{dateStr}</p>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-sm text-text-secondary">데모 모드 활성</span>
          </div>
        </div>
      </motion.div>

      {/* Hero Card — 초보자/첫 방문 컨셉 강화 */}
      <motion.div
        custom={0}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="glass-card accent-border p-8 mb-8 glow"
      >
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/20">
            <Mountain className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-text-primary mb-2">
              처음 방문하는 고객을 위한 AI 클라이밍 안내 챗봇
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
              클라이밍이 처음이신가요? 걱정 마세요! ClimbMate AI가 운영시간, 준비물,
              초보자 추천 코스, 강습 일정까지 친절하게 안내해 드립니다.
              현재 데모 환경에서는 연결된 서버가 없을 때 샘플 FAQ 데이터로 안전하게 응답합니다.
            </p>
          </div>
          <Link
            href="/chat"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white text-sm font-medium shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            AI에게 질문하기
          </Link>
        </div>
      </motion.div>

      {/* Onboarding — "오늘 처음 방문하시나요?" */}
      <motion.div
        custom={1}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="glass-card p-6 mb-8 border border-brand-500/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">
              🧗 오늘 처음 방문하시나요?
            </h3>
            <p className="text-xs text-text-muted">
              초보자분들이 자주 궁금해하시는 질문들이에요
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {beginnerFaqs.map((faq, i) => (
            <Link key={i} href="/chat">
              <div className="p-4 rounded-xl bg-surface/50 border border-surface-border/20 hover:border-brand-500/20 transition-all group cursor-pointer">
                <div className="flex items-start gap-3">
                  <faq.icon
                    className={`w-5 h-5 ${faq.color} flex-shrink-0 mt-0.5`}
                  />
                  <div>
                    <p className="text-sm font-medium text-text-primary mb-1 group-hover:text-brand-400 transition-colors">
                      {faq.question}
                    </p>
                    <p className="text-xs text-text-muted">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: AlertTriangle,
            label: "만료 예정 회원",
            value: loading ? "—" : `${expiringMembers.length}명`,
            color:
              expiringMembers.length > 0 ? "text-warning" : "text-brand-400",
            bgColor:
              expiringMembers.length > 0
                ? "from-amber-500/10 to-amber-600/5"
                : "from-brand-500/10 to-brand-600/5",
          },
          {
            icon: MapPin,
            label: "운영 지점",
            value: loading ? "—" : `${gyms.length}개`,
            color: "text-blue-400",
            bgColor: "from-blue-500/10 to-blue-600/5",
          },
          {
            icon: Clock,
            label: "오늘 운영",
            value: gyms[0]
              ? `${gyms[0].open_time}~${gyms[0].close_time}`
              : "—",
            color: "text-brand-400",
            bgColor: "from-brand-500/10 to-brand-600/5",
          },
          {
            icon: CreditCard,
            label: "운영 도구",
            value: "OCR",
            color: "text-purple-400",
            bgColor: "from-purple-500/10 to-purple-600/5",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i + 2}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="glass-card p-5"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center mb-3`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-text-muted text-xs mb-1">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* 공지/이벤트 카드 */}
        <motion.div
          custom={6}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="col-span-2 glass-card accent-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-brand-400" />
              공지 & 이벤트
            </h3>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 shimmer rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-4 rounded-xl bg-surface/50 border border-surface-border/20 hover:border-brand-500/10 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`badge ${
                        categoryColors[notice.category] || "badge-info"
                      } text-[10px]`}
                    >
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {notice.created_at}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-text-primary mb-1">
                    {notice.title}
                  </h4>
                  <p className="text-xs text-text-muted line-clamp-2">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* 운영 정보 카드 */}
        <motion.div
          custom={7}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="glass-card accent-border p-6"
        >
          <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-brand-400" />
            운영 정보
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 shimmer rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {gyms.map((gym) => (
                <div
                  key={gym.name}
                  className="p-3 rounded-xl bg-surface/50 border border-surface-border/20"
                >
                  <p className="text-sm font-medium text-text-primary mb-1">
                    {gym.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
                    <Clock className="w-3 h-3" />
                    {gym.open_time} ~ {gym.close_time}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <MapPin className="w-3 h-3" />
                    {gym.location}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 초보자 추천 안내 */}
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-brand-500/10 to-brand-600/5 border border-brand-500/15">
            <div className="flex items-center gap-2 mb-1.5">
              <Footprints className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-medium text-brand-400">
                초보자 추천
              </span>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              첫 방문 체험 패키지 25,000원으로 강습 + 장비 대여 + 일일 이용을 한
              번에! V0 난이도부터 시작해 보세요.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-1 text-[11px] text-brand-400 mt-2 hover:text-brand-300 transition-colors"
            >
              자세히 알아보기 <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
