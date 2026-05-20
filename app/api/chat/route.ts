// POST /api/chat — 챗봇 대화 API
// RAG → LLM 파이프라인. 서버 미연결 시 mock 응답 반환.

import { NextRequest, NextResponse } from "next/server";
import { queryRag, queryLlm } from "@/lib/api-client";
import { getMockChatResponse } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "메시지를 입력해 주세요." },
        { status: 400 }
      );
    }

    // 1. RAG 서버에 질문 전달
    const ragResult = await queryRag(message);

    if (ragResult && ragResult.documents.length > 0) {
      // 2. RAG 결과를 컨텍스트로 LLM에 전달
      const context = ragResult.documents
        .map((doc) => `[${doc.title}]\n${doc.content}`)
        .join("\n\n");

      const llmResult = await queryLlm(message, context);

      if (llmResult) {
        return NextResponse.json({
          answer: llmResult.answer,
          sources: ragResult.documents,
        });
      }

      // LLM 실패 → RAG 문서만 반환
      return NextResponse.json({
        answer: ragResult.documents[0].content,
        sources: ragResult.documents,
      });
    }

    // RAG 서버 미연결 → Mock 응답
    const mockResponse = getMockChatResponse(message);

    // 자연스러운 응답 지연 (300~800ms)
    await new Promise((resolve) =>
      setTimeout(resolve, 300 + Math.random() * 500)
    );

    return NextResponse.json(mockResponse);
  } catch {
    return NextResponse.json(
      {
        answer:
          "죄송합니다, 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요. 🙏",
        sources: [],
      },
      { status: 500 }
    );
  }
}
