// ============================================================
// ClimbMate AI - PostgreSQL 연결 유틸리티
// 환경변수 DATABASE_URL 기반. 연결 실패 시 null 반환.
// ============================================================

import { Pool, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;

function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", () => {
      pool = null;
    });
  }

  return pool;
}

/**
 * DB 쿼리 실행. 연결 실패 시 null 반환.
 */
export async function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T> | null> {
  const p = getPool();
  if (!p) return null;

  try {
    return await p.query<T>(text, params);
  } catch {
    return null;
  }
}
