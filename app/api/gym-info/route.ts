// GET /api/gym-info — 센터 정보 조회 API
// PostgreSQL 조회. DB 미연결 시 mock data 반환.

import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { mockGyms, mockPrices, type Gym, type Price } from "@/lib/mock-data";

export async function GET() {
  try {
    const gymsResult = await query<Gym>(
      "SELECT id, name, location, address, phone, open_time, close_time FROM gyms ORDER BY id"
    );
    const pricesResult = await query<Price>(
      "SELECT id, title, price, description FROM prices ORDER BY price ASC"
    );

    const gyms =
      gymsResult && gymsResult.rows.length > 0 ? gymsResult.rows : mockGyms;
    const prices =
      pricesResult && pricesResult.rows.length > 0
        ? pricesResult.rows
        : mockPrices;

    return NextResponse.json({
      gyms,
      prices,
      source:
        gymsResult && gymsResult.rows.length > 0 ? "database" : "mock",
    });
  } catch {
    return NextResponse.json({
      gyms: mockGyms,
      prices: mockPrices,
      source: "mock",
    });
  }
}
