import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/constants"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch(`${API_BASE_URL}/api/v1/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
