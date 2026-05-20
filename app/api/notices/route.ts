// GET /api/notices — 공지사항 조회 API

import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { mockNotices, type Notice } from "@/lib/mock-data";

export async function GET() {
  try {
    const result = await query<Notice>(
      "SELECT id, title, content, category, created_at::text, expires_at::text FROM notices ORDER BY created_at DESC"
    );

    if (result && result.rows.length > 0) {
      return NextResponse.json({ notices: result.rows, source: "database" });
    }

    return NextResponse.json({ notices: mockNotices, source: "mock" });
  } catch {
    return NextResponse.json({ notices: mockNotices, source: "mock" });
  }
}
