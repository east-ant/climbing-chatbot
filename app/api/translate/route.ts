// POST /api/translate — 번역 데모 API
// 실제 번역 API 없이 mock 응답 반환

import { NextRequest, NextResponse } from "next/server";

const mockTranslations: Record<string, Record<string, string>> = {
  en: {
    "안녕하세요": "Hello",
    "운영시간을 알려주세요": "Please tell me the operating hours",
    "회원권 가격이 어떻게 되나요?": "What are the membership prices?",
    "초보자도 할 수 있나요?": "Can beginners do this too?",
    "주차장이 있나요?": "Is there a parking lot?",
  },
  ja: {
    "안녕하세요": "こんにちは",
    "운영시간을 알려주세요": "営業時間を教えてください",
    "회원권 가격이 어떻게 되나요?": "会員権の価格はいくらですか？",
    "초보자도 할 수 있나요?": "初心者でもできますか？",
    "주차장이 있나요?": "駐車場はありますか？",
  },
  zh: {
    "안녕하세요": "你好",
    "운영시간을 알려주세요": "请告诉我营业时间",
    "회원권 가격이 어떻게 되나요?": "会员价格是多少？",
    "초보자도 할 수 있나요?": "初学者也可以吗？",
    "주차장이 있나요?": "有停车场吗？",
  },
};

const langNames: Record<string, string> = {
  en: "English",
  ja: "日本語",
  zh: "中文",
};

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "텍스트와 대상 언어를 입력해 주세요." },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    const langDict = mockTranslations[targetLang] || {};
    const translated =
      langDict[text] ||
      `[${langNames[targetLang] || targetLang} translation] ${text}`;

    return NextResponse.json({
      success: true,
      original: text,
      translated,
      targetLang,
      targetLangName: langNames[targetLang] || targetLang,
    });
  } catch (error) {
    console.error("[API/translate] Error:", error);
    return NextResponse.json(
      { error: "번역 중 오류가 발생했습니다.", success: false },
      { status: 500 }
    );
  }
}
