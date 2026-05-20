// GET /api/members — 회원 정보 조회 API
// PostgreSQL 조회. DB 미연결 시 mock data 반환.

import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { mockMembers, type Member } from "@/lib/mock-data";

export async function GET() {
  try {
    const result = await query<Member>(
      "SELECT id, name, phone, membership_type, start_date::text, end_date::text, payment_status FROM members ORDER BY end_date ASC"
    );

    if (result && result.rows.length > 0) {
      return NextResponse.json({ members: result.rows, source: "database" });
    }

    // DB 미연결 → mock data
    return NextResponse.json({ members: mockMembers, source: "mock" });
  } catch {
    return NextResponse.json({ members: mockMembers, source: "mock" });
  }
}
