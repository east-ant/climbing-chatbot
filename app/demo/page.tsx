"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Loader2,
  ScanLine,
  Upload,
  UserPlus,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

function OcrMemberIntake() {
  const [result, setResult] = useState<{
    source?: string;
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
      setResult(null);
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
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <ScanLine className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">
              첫 방문 회원 등록 OCR
            </h3>
            <p className="text-xs text-text-muted">
              체험 신청서 이미지를 읽어 등록 후보 데이터를 만듭니다
            </p>
          </div>
        </div>
        <span className="badge badge-info">
          {result?.source === "clova-ocr" ? "CLOVA OCR" : "Fallback Ready"}
        </span>
      </div>

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
            ? "border-brand-500 bg-surface-lighter"
            : "border-surface-border hover:border-brand-600 hover:bg-surface-light"
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
            <Loader2 className="w-8 h-8 text-text-primary animate-spin" />
            <p className="text-sm text-text-secondary">OCR 처리 중...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-text-secondary" />
            <p className="text-sm font-medium text-text-primary">
              신청서 또는 회원카드 이미지를 업로드하세요
            </p>
            <p className="text-xs text-text-muted">드래그 앤 드롭 또는 클릭</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 grid grid-cols-2 gap-4"
          >
            <div className="p-4 rounded-xl bg-surface-light border border-surface-border/70">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-text-primary" />
                <span className="text-sm font-semibold text-text-primary">
                  업로드 파일
                </span>
              </div>
              <p className="text-sm text-text-primary">{result.fileName}</p>
              <p className="text-xs text-text-muted">{result.fileSize}</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-light border border-surface-border/70">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-text-primary" />
                <span className="text-sm font-semibold text-text-primary">
                  등록 상태
                </span>
              </div>
              <p className="text-sm text-text-primary">
                #{result.registrationResult.memberId} ·{" "}
                {result.registrationResult.status}
              </p>
              <p className="text-xs text-text-muted">
                {result.registrationResult.startDate} ~{" "}
                {result.registrationResult.endDate}
              </p>
            </div>

            <div className="col-span-2 p-4 rounded-xl bg-white border border-surface-border/80">
              <h4 className="text-sm font-semibold text-text-primary mb-3">
                추출된 회원 정보
              </h4>
              <div className="grid grid-cols-4 gap-3 text-sm">
                {[
                  ["이름", result.extractedData.name],
                  ["연락처", result.extractedData.phone],
                  ["생년월일", result.extractedData.birthDate],
                  ["주소", result.extractedData.address],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span className="text-xs text-text-muted">{label}</span>
                    <p className="mt-1 text-text-primary font-medium break-words">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OperationsPage() {
  const checklist = [
    "첫 방문 신청서 또는 회원카드 스캔",
    "OCR 추출값 확인 후 회원 등록 후보 생성",
    "관리자 화면의 회원권/결제/만료 데이터와 함께 확인",
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">현장 운영 도구</span>
        </h1>
        <p className="text-text-secondary text-sm">
          첫 방문 고객 접수와 회원 등록 업무를 보조하는 관리자용 도구입니다.
        </p>
      </motion.div>

      <div className="grid grid-cols-[1.4fr_0.8fr] gap-6">
        <motion.div
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <OcrMemberIntake />
        </motion.div>

        <motion.div
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="glass-card accent-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">
                  접수 흐름
                </h3>
                <p className="text-xs text-text-muted">
                  실제 예약/결제는 구현하지 않는 데모 범위입니다
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {checklist.map((item, i) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-3 rounded-xl bg-surface-light border border-surface-border/70"
                >
                  <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-text-secondary">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <UserPlus className="w-5 h-5 text-text-primary" />
              <h3 className="font-semibold text-text-primary">
                데모 운영 원칙
              </h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              개인정보는 실제 저장하지 않고, OCR 결과는 등록 후보 데이터로만
              표시합니다. DB가 연결되면 회원 목록과 만료 상태는 관리자 화면에서
              조회하는 구조로 이어집니다.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
