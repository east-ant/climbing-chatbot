// POST /api/ocr — OCR 데모 API
// 실제 OCR 대신 업로드 파일명 기반 mock 회원등록 결과 반환

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "파일을 업로드해 주세요." },
        { status: 400 }
      );
    }

    // 자연스러운 처리 지연
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock OCR 결과
    const mockResult = {
      success: true,
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      extractedData: {
        name: "홍길동",
        phone: "010-9999-8888",
        birthDate: "1995-03-15",
        address: "경북 포항시 남구 효자동 123",
      },
      registrationResult: {
        memberId: Math.floor(Math.random() * 900 + 100),
        membershipType: "1개월",
        startDate: new Date().toISOString().split("T")[0],
        endDate: (() => {
          const d = new Date();
          d.setMonth(d.getMonth() + 1);
          return d.toISOString().split("T")[0];
        })(),
        status: "등록 완료",
      },
      message: `${file.name} 파일에서 회원 정보를 추출하여 등록을 완료했습니다.`,
    };

    return NextResponse.json(mockResult);
  } catch (error) {
    console.error("[API/ocr] Error:", error);
    return NextResponse.json(
      { error: "OCR 처리 중 오류가 발생했습니다.", success: false },
      { status: 500 }
    );
  }
}
