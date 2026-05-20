"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mountain,
  User,
  Mic,
  Volume2,
  Languages,
  BookOpen,
  Loader2,
  X,
  MapPin,
  Clock,
  Footprints,
  ShieldCheck,
  CreditCard,
  GraduationCap,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  sources?: { title: string; content: string }[];
  timestamp: Date;
}

const questionCategories = [
  {
    label: "방문 전",
    icon: MapPin,
    color: "text-brand-400 border-brand-500/30 hover:bg-brand-500/5",
    questions: [
      "오늘 운영시간 알려줘",
      "포항점 위치 알려줘",
      "주차 가능한가요?",
      "뭘 준비해서 가야 해요?",
    ],
  },
  {
    label: "초보자",
    icon: Footprints,
    color: "text-blue-400 border-blue-500/30 hover:bg-blue-500/5",
    questions: [
      "초보자도 할 수 있어요?",
      "초보자 추천 코스 알려줘",
      "클라이밍화 대여 되나요?",
      "혼자 가도 되나요?",
    ],
  },
  {
    label: "요금",
    icon: CreditCard,
    color: "text-amber-400 border-amber-500/30 hover:bg-amber-500/5",
    questions: [
      "한 달 회원권 얼마예요?",
      "월정액이랑 일일권 뭐가 좋아?",
      "할인 이벤트 있나요?",
    ],
  },
  {
    label: "강습",
    icon: GraduationCap,
    color: "text-purple-400 border-purple-500/30 hover:bg-purple-500/5",
    questions: [
      "초보자 강습 있나요?",
      "강사 소개해 주세요",
      "어린이도 이용 가능해요?",
    ],
  },
  {
    label: "안전",
    icon: ShieldCheck,
    color: "text-rose-400 border-rose-500/30 hover:bg-rose-500/5",
    questions: ["안전 수칙 알려줘", "난이도별 구역이 있나요?"],
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content:
        "안녕하세요! 🧗 ClimbMate AI입니다.\n\n클라이밍이 처음이신가요? 걱정 마세요!\n운영시간, 준비물, 초보자 코스, 강습 일정, 요금 등 무엇이든 편하게 질문해 주세요.\n\n아래 카테고리에서 궁금한 질문을 선택하셔도 됩니다 😊",
      sources: [],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSources, setSelectedSources] = useState<
    { title: string; content: string }[] | null
  >(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: data.answer || "죄송합니다, 응답을 생성하지 못했습니다.",
        sources: data.sources || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "bot",
          content:
            "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요. 🙏",
          sources: [],
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  async function handleVoiceInput() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "stt" }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        setInput(data.text);
      }
    } catch {
      // 무시
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTts(text: string) {
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "tts", text }),
      });
      const data = await res.json();
      if (data.success) {
        alert(
          `🔊 음성 출력 (데모)\n\n"${text}"\n\n예상 길이: ${data.duration}`
        );
      }
    } catch {
      // 무시
    }
  }

  async function handleTranslate(text: string) {
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang: "en" }),
      });
      const data = await res.json();
      if (data.success) {
        alert(
          `🌐 번역 결과 (${data.targetLangName})\n\n원문: ${data.original}\n번역: ${data.translated}`
        );
      }
    } catch {
      // 무시
    }
  }

  return (
    <div className="h-screen flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">AI 챗봇</span>
        </h1>
        <p className="text-text-secondary text-sm">
          처음 방문하는 고객을 위한 AI 클라이밍 안내 — 무엇이든 편하게
          물어보세요
        </p>
      </motion.div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col glass-card overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 mt-1">
                      <Mountain className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] ${
                      msg.role === "user"
                        ? "chat-bubble-user"
                        : "chat-bubble-bot"
                    } px-5 py-3`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>

                    {/* Bot message actions */}
                    {msg.role === "bot" && msg.id !== "welcome" && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-surface-border/20">
                        {msg.sources && msg.sources.length > 0 && (
                          <button
                            onClick={() => setSelectedSources(msg.sources!)}
                            className="flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 transition-colors"
                          >
                            <BookOpen className="w-3 h-3" />
                            참고 자료 {msg.sources.length}건
                          </button>
                        )}
                        <button
                          onClick={() => handleTts(msg.content)}
                          className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-secondary transition-colors"
                        >
                          <Volume2 className="w-3 h-3" />
                          읽기
                        </button>
                        <button
                          onClick={() => handleTranslate(msg.content)}
                          className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-secondary transition-colors"
                        >
                          <Languages className="w-3 h-3" />
                          번역
                        </button>
                      </div>
                    )}

                    <p className="text-[10px] text-text-muted/50 mt-1">
                      {msg.timestamp.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
                  <Mountain className="w-4 h-4 text-white" />
                </div>
                <div className="chat-bubble-bot px-5 py-4 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand-400 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-brand-400 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-brand-400 typing-dot" />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Example Questions — 카테고리별 */}
          {messages.length <= 1 && (
            <div className="px-6 pb-3 border-t border-surface-border/10 pt-3">
              <p className="text-xs text-text-muted mb-3">
                💡 카테고리별 예시 질문
              </p>
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {questionCategories.map((cat) => (
                  <div key={cat.label}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <cat.icon className={`w-3.5 h-3.5 ${cat.color.split(" ")[0]}`} />
                      <span className="text-[11px] font-medium text-text-muted">
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.questions.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className={`px-3 py-1 rounded-full text-xs border ${cat.color} transition-all`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-surface-border/20">
            <div className="flex items-center gap-2">
              <button
                onClick={handleVoiceInput}
                disabled={isLoading}
                className="w-10 h-10 rounded-xl bg-surface-light border border-surface-border/30 flex items-center justify-center text-text-muted hover:text-brand-400 hover:border-brand-500/30 transition-all disabled:opacity-50"
                title="음성 입력 (데모)"
              >
                <Mic className="w-4 h-4" />
              </button>

              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                      sendMessage(input);
                    }
                  }}
                  placeholder="클라이밍 센터에 대해 질문해 보세요..."
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-light border border-surface-border/30 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all disabled:opacity-50"
                />
              </div>

              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Source Panel */}
        <AnimatePresence>
          {selectedSources && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 360 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="glass-card overflow-hidden flex-shrink-0"
            >
              <div className="p-4 border-b border-surface-border/20 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-400" />
                  참고 자료
                </h3>
                <button
                  onClick={() => setSelectedSources(null)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
                {selectedSources.map((source, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-surface/50 border border-surface-border/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-info text-[10px]">
                        출처 {i + 1}
                      </span>
                      <span className="text-xs font-medium text-text-primary">
                        {source.title}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {source.content}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
