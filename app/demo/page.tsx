"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  Languages,
  ScanLine,
  Upload,
  CheckCircle2,
  Loader2,
  FileText,
  ArrowRight,
  Sparkles,
  Globe,
  AudioLines,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

// ===== STT Demo =====
function SttDemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    confidence: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRecord() {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "stt" }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ text: data.text, confidence: data.confidence });
      }
    } catch {
      // 무시
    } finally {
      setIsRecording(false);
      setLoading(false);
    }
  }

  return (
    <div className="glass-card accent-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">음성 인식 (STT)</h3>
          <p className="text-xs text-text-muted">
            Speech-to-Text — 음성을 텍스트로 변환
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center py-6">
        <button
          onClick={handleRecord}
          disabled={loading}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? "bg-red-500 shadow-lg shadow-red-500/30 animate-pulse"
              : "bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30"
          }`}
        >
          {loading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
        <p className="text-sm text-text-muted mt-3">
          {isRecording
            ? "녹음 중... 버튼을 눌러 중지"
            : loading
            ? "음성 변환 중..."
            : "버튼을 눌러 녹음 시작"}
        </p>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-surface/50 border border-brand-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="badge badge-success">변환 완료</span>
              <span className="text-xs text-text-muted">
                신뢰도: {(parseFloat(result.confidence) * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-sm text-text-primary font-medium">
              &ldquo;{result.text}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== TTS Demo =====
function TtsDemo() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    duration: string;
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSpeak() {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "tts", text: text.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ duration: data.duration, text: data.text });
      }
    } catch {
      // 무시
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card accent-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <Volume2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">음성 합성 (TTS)</h3>
          <p className="text-xs text-text-muted">
            Text-to-Speech — 텍스트를 음성으로 변환
          </p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="음성으로 변환할 텍스트를 입력하세요..."
        className="w-full p-3 rounded-xl bg-surface-light border border-surface-border/30 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500/50 resize-none h-24 mb-3"
      />

      <button
        onClick={handleSpeak}
        disabled={!text.trim() || loading}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        {loading ? "변환 중..." : "음성 출력"}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 p-4 rounded-xl bg-surface/50 border border-blue-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-info">출력 완료</span>
              <span className="text-xs text-text-muted">
                예상 길이: {result.duration}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <AudioLines className="w-5 h-5 text-blue-400" />
              <div className="flex-1 h-1 rounded-full bg-surface-lighter overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== Translate Demo =====
function TranslateDemo() {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("en");
  const [result, setResult] = useState<{
    original: string;
    translated: string;
    langName: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ];

  async function handleTranslate() {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), targetLang }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          original: data.original,
          translated: data.translated,
          langName: data.targetLangName,
        });
      }
    } catch {
      // 무시
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card accent-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
          <Languages className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">번역</h3>
          <p className="text-xs text-text-muted">
            다국어 번역 — 외국인 고객 응대
          </p>
        </div>
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="번역할 한국어 텍스트를 입력하세요..."
        className="w-full p-3 rounded-xl bg-surface-light border border-surface-border/30 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500/50 mb-3"
      />

      <div className="flex gap-2 mb-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setTargetLang(lang.code)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
              targetLang === lang.code
                ? "bg-purple-500/20 border border-purple-500/30 text-purple-400"
                : "bg-surface-light border border-surface-border/30 text-text-muted hover:border-purple-500/20"
            }`}
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleTranslate}
        disabled={!text.trim() || loading}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Globe className="w-4 h-4" />
        )}
        {loading ? "번역 중..." : "번역하기"}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 p-4 rounded-xl bg-surface/50 border border-purple-500/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-info">번역 완료</span>
              <span className="text-xs text-text-muted">→ {result.langName}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-text-muted mt-0.5">원문</span>
                <p className="text-sm text-text-secondary">{result.original}</p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-purple-400 mt-0.5">번역</span>
                <p className="text-sm text-text-primary font-medium">
                  {result.translated}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== OCR Demo =====
function OcrDemo() {
  const [result, setResult] = useState<{
    fileName: string;
    fileSize: string;
    extractedData: {
      name: string;
      phone: string;
      birthDate: string;
      address: string;
    };
    registrationResult: {
      memberId: number;
      membershipType: string;
      startDate: string;
      endDate: string;
      status: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      }
    } catch {
      // 무시
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  return (
    <div className="glass-card accent-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
          <ScanLine className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">OCR 회원등록</h3>
          <p className="text-xs text-text-muted">
            신분증/회원카드 스캔 → 자동 회원등록
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-amber-500/50 bg-amber-500/5"
            : "border-surface-border/30 hover:border-amber-500/30 hover:bg-amber-500/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFile(e.target.files[0]);
          }}
        />
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-sm text-text-muted">OCR 처리 중...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-text-muted" />
            <p className="text-sm text-text-muted">
              신분증 또는 회원카드 이미지를 업로드하세요
            </p>
            <p className="text-xs text-text-muted">
              드래그 앤 드롭 또는 클릭
            </p>
          </div>
        )}
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 space-y-3"
          >
            {/* File Info */}
            <div className="p-3 rounded-xl bg-surface/50 border border-surface-border/20 flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-text-primary">{result.fileName}</p>
                <p className="text-xs text-text-muted">{result.fileSize}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-brand-400 ml-auto" />
            </div>

            {/* Extracted Data */}
            <div className="p-4 rounded-xl bg-surface/50 border border-amber-500/20">
              <h4 className="text-xs font-medium text-amber-400 mb-2">
                📋 추출된 정보
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-text-muted text-xs">이름</span>
                  <p className="text-text-primary">
                    {result.extractedData.name}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted text-xs">연락처</span>
                  <p className="text-text-primary">
                    {result.extractedData.phone}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted text-xs">생년월일</span>
                  <p className="text-text-primary">
                    {result.extractedData.birthDate}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted text-xs">주소</span>
                  <p className="text-text-primary">
                    {result.extractedData.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Result */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-brand-500/10 to-brand-600/5 border border-brand-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-medium text-brand-400">
                  {result.registrationResult.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-text-muted text-xs">회원번호</span>
                  <p className="text-text-primary">
                    #{result.registrationResult.memberId}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted text-xs">회원권</span>
                  <p className="text-text-primary">
                    {result.registrationResult.membershipType}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted text-xs">시작일</span>
                  <p className="text-text-primary">
                    {result.registrationResult.startDate}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted text-xs">만료일</span>
                  <p className="text-text-primary">
                    {result.registrationResult.endDate}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== Main Page =====
export default function DemoPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">SaaS 기능</span> 데모
        </h1>
        <p className="text-text-secondary text-sm">
          음성 인식 · 음성 합성 · 번역 · OCR — 실제 API 교체 가능한 구조
        </p>
      </motion.div>

      {/* Demo Info Banner */}
      <motion.div
        custom={0}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="glass-card p-4 mb-6 flex items-center gap-3"
      >
        <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0" />
        <p className="text-sm text-text-secondary">
          현재 <span className="text-brand-400 font-medium">데모 모드</span>로
          동작합니다. 각 기능은 Mock API를 사용하며, 실제 SaaS API로 교체하면
          바로 동작하도록 설계되었습니다.
        </p>
      </motion.div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-6">
        <motion.div
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <SttDemo />
        </motion.div>

        <motion.div
          custom={2}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <TtsDemo />
        </motion.div>

        <motion.div
          custom={3}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <TranslateDemo />
        </motion.div>

        <motion.div
          custom={4}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <OcrDemo />
        </motion.div>
      </div>
    </div>
  );
}
