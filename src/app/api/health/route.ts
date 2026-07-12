import { NextResponse } from 'next/server'
import { APP_VERSION } from '@/constants/app'

/** Lightweight health check used by Docker/compose and uptime probes. */
export function GET() {
  return NextResponse.json({
    status: 'ok',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  })
}
