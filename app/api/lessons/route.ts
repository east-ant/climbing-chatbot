// GET /api/lessons — 강습 프로그램 조회 API

import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { mockLessons, type Lesson } from "@/lib/mock-data";

export async function GET() {
  try {
    const result = await query<Lesson>(
      "SELECT id, name, instructor, day_of_week, start_time, end_time, level, price FROM lessons ORDER BY id"
    );

    if (result && result.rows.length > 0) {
      return NextResponse.json({ lessons: result.rows, source: "database" });
    }

    return NextResponse.json({ lessons: mockLessons, source: "mock" });
  } catch {
    return NextResponse.json({ lessons: mockLessons, source: "mock" });
  }
}
