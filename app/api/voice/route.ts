// POST /api/voice — 음성 데모 API
// 실제 STT/TTS 없이 mock 응답 반환

import { NextRequest, NextResponse } from "next/server";

const mockSttResults = [
  "오늘 운영시간 알려줘",
  "한 달 회원권 가격이 얼마야?",
  "초보자 추천 코스 알려줘",
  "포항점 주소가 어디야?",
  "내 회원권 언제 만료돼?",
];

export async function POST(request: NextRequest) {
  try {
    const { type, text } = await request.json();

    if (type === "stt") {
      // 음성 → 텍스트 (mock)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const randomText =
        mockSttResults[Math.floor(Math.random() * mockSttResults.length)];

      return NextResponse.json({
        success: true,
        type: "stt",
        text: randomText,
        confidence: (0.85 + Math.random() * 0.14).toFixed(2),
        message: "음성이 성공적으로 텍스트로 변환되었습니다.",
      });
    }

    if (type === "tts") {
      // 텍스트 → 음성 (mock)
      if (!text) {
        return NextResponse.json(
          { error: "변환할 텍스트를 입력해 주세요." },
          { status: 400 }
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      return NextResponse.json({
        success: true,
        type: "tts",
        text,
        audioUrl: null, // 실제 구현 시 생성된 오디오 파일 URL
        duration: `${(text.length * 0.08).toFixed(1)}초`,
        message: "텍스트가 음성으로 변환되었습니다. (데모 모드)",
      });
    }

    return NextResponse.json(
      { error: "type은 'stt' 또는 'tts'여야 합니다." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[API/voice] Error:", error);
    return NextResponse.json(
      { error: "음성 처리 중 오류가 발생했습니다.", success: false },
      { status: 500 }
    );
  }
}
