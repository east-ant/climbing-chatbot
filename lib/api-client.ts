// ============================================================
// ClimbMate AI - RAG / LLM 서버 호출 유틸리티
// 환경변수 기반. 서버 미연결 시 null 반환.
// ============================================================

interface RagResponse {
  documents: { title: string; content: string }[];
}

interface LlmResponse {
  answer: string;
}

/**
 * RAG 서버에 질문을 보내 관련 문서 검색
 */
export async function queryRag(
  question: string
): Promise<RagResponse | null> {
  const ragUrl = process.env.RAG_API_URL;
  if (!ragUrl) return null;

  try {
    const res = await fetch(ragUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: question }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * LLM 서버에 컨텍스트와 질문을 보내 최종 답변 생성
 */
export async function queryLlm(
  question: string,
  context: string
): Promise<LlmResponse | null> {
  const llmUrl = process.env.LLM_API_URL;
  if (!llmUrl) return null;

  const model = process.env.LLM_MODEL || "llama3";

  try {
    const res = await fetch(llmUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: `당신은 클라이밍 센터 'ClimbMate'의 AI 고객 상담원입니다.
아래 참고 자료를 바탕으로 친절하고 정확하게 답변해 주세요.
참고 자료에 없는 내용은 "확인 후 안내드리겠습니다"라고 답변하세요.

[참고 자료]
${context}`,
          },
          {
            role: "user",
            content: question,
          },
        ],
        stream: false,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    // Ollama 형식
    if (data.message?.content) {
      return { answer: data.message.content };
    }
    // OpenAI 호환 형식
    if (data.choices?.[0]?.message?.content) {
      return { answer: data.choices[0].message.content };
    }

    return null;
  } catch {
    return null;
  }
}
