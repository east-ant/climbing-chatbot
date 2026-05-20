"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  DollarSign,
  Building2,
  GraduationCap,
  Megaphone,
  CalendarDays,
} from "lucide-react";

interface Member {
  id: number;
  name: string;
  phone: string;
  membership_type: string;
  start_date: string;
  end_date: string;
  payment_status: string;
}

interface Gym {
  id: number;
  name: string;
  location: string;
  address: string;
  phone: string;
  open_time: string;
  close_time: string;
}

interface Price {
  id: number;
  title: string;
  price: number;
  description: string;
}

interface Lesson {
  id: number;
  name: string;
  instructor: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  level: string;
  price: number;
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
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

function getStatusBadge(endDate: string, paymentStatus: string) {
  const today = new Date().toISOString().split("T")[0];

  if (paymentStatus === "미결제") {
    return <span className="badge badge-danger">미결제</span>;
  }
  if (endDate < today) {
    return <span className="badge badge-danger">만료됨</span>;
  }
  if (endDate === today) {
    return <span className="badge badge-warning">오늘 만료</span>;
  }

  const endTime = new Date(endDate).getTime();
  const todayTime = new Date(today).getTime();
  const daysLeft = Math.ceil((endTime - todayTime) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 7) {
    return <span className="badge badge-warning">{daysLeft}일 남음</span>;
  }
  return <span className="badge badge-success">활성</span>;
}

const levelColors: Record<string, string> = {
  입문: "badge-success",
  초급: "badge-info",
  중급: "badge-warning",
  상급: "badge-danger",
  키즈: "badge-info",
};

const categoryColors: Record<string, string> = {
  이벤트: "badge-success",
  공지: "badge-info",
  시설: "badge-warning",
  안전: "badge-danger",
};

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [dataSource, setDataSource] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [membersRes, gymRes, lessonsRes, noticesRes] = await Promise.all([
          fetch("/api/members"),
          fetch("/api/gym-info"),
          fetch("/api/lessons"),
          fetch("/api/notices"),
        ]);
        const membersData = await membersRes.json();
        const gymData = await gymRes.json();
        const lessonsData = await lessonsRes.json();
        const noticesData = await noticesRes.json();

        setMembers(membersData.members || []);
        setGyms(gymData.gyms || []);
        setPrices(gymData.prices || []);
        setLessons(lessonsData.lessons || []);
        setNotices(noticesData.notices || []);
        setDataSource(membersData.source || "mock");
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const activeCount = members.filter(
    (m) => m.end_date >= today && m.payment_status === "완료"
  ).length;
  const expiringCount = members.filter((m) => m.end_date <= today).length;
  const unpaidCount = members.filter(
    (m) => m.payment_status === "미결제"
  ).length;

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">관리자</span> 데이터
          </h1>
          <p className="text-text-secondary text-sm">
            회원 정보 · 강습 프로그램 · 지점 정보 · 가격표 · 공지사항
          </p>
        </div>
        <div className="glass-card px-3 py-1.5 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              dataSource === "database" ? "bg-brand-400" : "bg-amber-400"
            } animate-pulse`}
          />
          <span className="text-xs text-text-muted">
            {dataSource === "database" ? "DB 연결" : "Mock 데이터"}
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: Users,
            label: "총 회원",
            value: `${members.length}명`,
            color: "text-brand-400",
          },
          {
            icon: CheckCircle2,
            label: "활성 회원",
            value: `${activeCount}명`,
            color: "text-brand-400",
          },
          {
            icon: AlertTriangle,
            label: "만료/예정",
            value: `${expiringCount}명`,
            color: "text-warning",
          },
          {
            icon: XCircle,
            label: "미결제",
            value: `${unpaidCount}명`,
            color: "text-danger",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="glass-card p-4"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-xs text-text-muted">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>
              {loading ? "—" : stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Member Table */}
      <motion.div
        custom={4}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="glass-card accent-border mb-6 overflow-hidden"
      >
        <div className="p-5 pb-3 flex items-center justify-between">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            회원 목록
          </h3>
          <span className="text-xs text-text-muted">
            총 {members.length}명
          </span>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 shimmer rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border/20">
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    연락처
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    회원권
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    시작일
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    만료일
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    결제
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/10">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-surface-light/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-brand-400">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-text-primary">
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary">
                      {member.phone}
                    </td>
                    <td className="px-5 py-3">
                      <span className="badge badge-info">
                        {member.membership_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary">
                      {member.start_date}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary">
                      {member.end_date}
                    </td>
                    <td className="px-5 py-3">
                      {member.payment_status === "완료" ? (
                        <span className="badge badge-success">완료</span>
                      ) : (
                        <span className="badge badge-danger">
                          {member.payment_status}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {getStatusBadge(member.end_date, member.payment_status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Lessons Table */}
      <motion.div
        custom={5}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="glass-card accent-border mb-6 overflow-hidden"
      >
        <div className="p-5 pb-3 flex items-center justify-between">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-brand-400" />
            강습 프로그램
          </h3>
          <span className="text-xs text-text-muted">
            {lessons.length}개 프로그램
          </span>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 shimmer rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border/20">
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    프로그램
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    강사
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    요일
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    시간
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    난이도
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    가격
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/10">
                {lessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="hover:bg-surface-light/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-text-primary">
                        {lesson.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary">
                      {lesson.instructor}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <CalendarDays className="w-3.5 h-3.5 text-text-muted" />
                        {lesson.day_of_week}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <Clock className="w-3.5 h-3.5 text-text-muted" />
                        {lesson.start_time}~{lesson.end_time}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`badge ${
                          levelColors[lesson.level] || "badge-info"
                        }`}
                      >
                        {lesson.level}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {lesson.price === 0 ? (
                        <span className="text-sm font-medium text-brand-400">
                          무료
                        </span>
                      ) : (
                        <span className="text-sm text-text-secondary">
                          {lesson.price.toLocaleString()}원
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Middle Row: Notices + Gym Info */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Notices */}
        <motion.div
          custom={6}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="glass-card accent-border p-6"
        >
          <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
            <Megaphone className="w-4 h-4 text-brand-400" />
            공지사항
          </h3>

          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-3 rounded-xl bg-surface/50 border border-surface-border/20"
              >
                <div className="flex items-center gap-2 mb-1">
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
                <p className="text-sm font-medium text-text-primary mb-1">
                  {notice.title}
                </p>
                <p className="text-xs text-text-muted line-clamp-2">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gym Info */}
        <motion.div
          custom={7}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="glass-card accent-border p-6"
        >
          <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-brand-400" />
            지점 정보
          </h3>

          <div className="space-y-4">
            {gyms.map((gym) => (
              <div
                key={gym.id}
                className="p-4 rounded-xl bg-surface/50 border border-surface-border/20"
              >
                <h4 className="font-semibold text-text-primary mb-3">
                  {gym.name}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin className="w-4 h-4 text-text-muted flex-shrink-0" />
                    {gym.address}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Clock className="w-4 h-4 text-text-muted flex-shrink-0" />
                    {gym.open_time} ~ {gym.close_time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Phone className="w-4 h-4 text-text-muted flex-shrink-0" />
                    {gym.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Price Table — full width */}
      <motion.div
        custom={8}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="glass-card accent-border p-6"
      >
        <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-brand-400" />
          가격표
        </h3>

        <div className="grid grid-cols-4 gap-4">
          {prices.map((price, i) => (
            <div
              key={price.id}
              className={`p-5 rounded-xl border transition-all ${
                i === prices.length - 1
                  ? "bg-white border-brand-500/60"
                  : "bg-surface/50 border-surface-border/20"
              }`}
            >
              <div className="text-center">
                <h4 className="font-semibold text-text-primary mb-2">
                  {price.title}
                </h4>
                <div className="flex items-baseline justify-center gap-0.5 mb-2">
                  <span className="text-2xl font-bold text-brand-400">
                    {price.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-text-muted">원</span>
                </div>
                <p className="text-xs text-text-muted">{price.description}</p>
                {i === prices.length - 1 && (
                  <span className="badge badge-success text-[10px] mt-3">
                    BEST VALUE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
