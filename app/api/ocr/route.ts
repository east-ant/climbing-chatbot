// POST /api/ocr — OCR API
// NCP CLOVA OCR 연결. 환경변수/호출 실패 시 mock 회원등록 결과 반환

import { NextRequest, NextResponse } from "next/server";

type OcrField = {
  inferText?: string;
  name?: string;
};

type OcrResponse = {
  images?: {
    fields?: OcrField[];
  }[];
};

function buildMockResult(file: File) {
  return {
    success: true,
    source: "mock",
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
}

function getFileFormat(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "jpeg") return "jpg";
  if (ext && ["jpg", "png", "pdf", "tif", "tiff"].includes(ext)) return ext;
  return file.type.includes("png") ? "png" : "jpg";
}

function parseOcrText(ocr: OcrResponse) {
  const fields = ocr.images?.flatMap((image) => image.fields || []) || [];
  const textLines = fields
    .map((field) => field.inferText?.trim())
    .filter((value): value is string => Boolean(value));
  const fullText = textLines.join("\n");
  const phone = fullText.match(/01[016789][-\s.]?\d{3,4}[-\s.]?\d{4}/)?.[0];
  const birthDate =
    fullText.match(/\d{4}[-./]\d{1,2}[-./]\d{1,2}/)?.[0] ||
    fullText.match(/\d{6}[-\s]?\d{7}/)?.[0];

  return {
    name: textLines[0] || "OCR 추출 이름 확인 필요",
    phone: phone || "OCR 추출 연락처 확인 필요",
    birthDate: birthDate || "OCR 추출 생년월일 확인 필요",
    address: textLines.slice(1, 4).join(" ") || "OCR 추출 주소 확인 필요",
  };
}

async function runClovaOcr(file: File) {
  const apiUrl = process.env.NCP_CLOVA_OCR_API_URL;
  const secretKey = process.env.NCP_CLOVA_OCR_SECRET_KEY;

  if (!apiUrl || !secretKey) return null;

  const formData = new FormData();
  formData.append(
    "message",
    JSON.stringify({
      version: "V2",
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
      images: [
        {
          format: getFileFormat(file),
          name: file.name,
        },
      ],
    })
  );
  formData.append("file", file, file.name);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "X-OCR-SECRET": secretKey,
      },
      body: formData,
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) return null;

    return (await res.json()) as OcrResponse;
  } catch {
    return null;
  }
}

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

    const ocrResult = await runClovaOcr(file);

    if (ocrResult) {
      const parsed = parseOcrText(ocrResult);

      return NextResponse.json({
        ...buildMockResult(file),
        source: "clova-ocr",
        extractedData: {
          name: parsed.name,
          phone: parsed.phone,
          birthDate: parsed.birthDate,
          address: parsed.address,
        },
        message: `${file.name} 파일을 CLOVA OCR로 분석했습니다. 추출값은 데모 등록 전 확인이 필요합니다.`,
      });
    }

    return NextResponse.json(buildMockResult(file));
  } catch {
    return NextResponse.json(
      { error: "OCR 처리 중 오류가 발생했습니다.", success: false },
      { status: 500 }
    );
  }
}
