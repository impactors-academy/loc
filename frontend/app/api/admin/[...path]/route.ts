import { NextRequest, NextResponse } from "next/server"

/**
 * Server-side proxy for dashboard writes.
 *
 * The backend gates every write endpoint and all /leads routes behind
 * EDITOR_API_KEY. That key must never reach the browser — if it were exposed
 * as NEXT_PUBLIC_*, any visitor could read it from the bundle and gain full
 * write access, defeating the gate entirely. So the dashboard calls these
 * same-origin routes, and the key is attached here, on the server.
 *
 * IMPORTANT: this proxy attaches the editor key to whatever it forwards, so
 * anything reachable through it is fully writable by anyone who can reach
 * /api/admin/*. It carries no authentication of its own. Both this path and
 * /admin must sit behind Cloudflare Access (checklist 0C-2) in every
 * deployed environment.
 */

const BACKEND_URL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Explicit allowlist rather than blind pass-through — keep it minimal.
const ALLOWED_COLLECTIONS = new Set(["experiences", "properties", "blog", "products", "leads"])

async function forward(req: NextRequest, path: string[]) {
  const editorKey = process.env.EDITOR_API_KEY
  if (!editorKey) {
    return NextResponse.json(
      { detail: "EDITOR_API_KEY is not set on the web server — dashboard writes are disabled." },
      { status: 503 },
    )
  }

  if (path.length === 0 || !ALLOWED_COLLECTIONS.has(path[0])) {
    return NextResponse.json({ detail: "Not Found" }, { status: 404 })
  }

  // Collection roots need the trailing slash the API expects; without it the
  // backend answers 307 and we pay an extra hop on every request.
  const suffix = path.length === 1 ? "/" : ""
  const target = `${BACKEND_URL}/api/v1/${path.join("/")}${suffix}${req.nextUrl.search}`

  const init: RequestInit = {
    method: req.method,
    headers: { "Content-Type": "application/json", "X-API-Key": editorKey },
    cache: "no-store",
  }
  if (req.method !== "GET" && req.method !== "DELETE") {
    init.body = await req.text()
  }

  const res = await fetch(target, init)

  if (res.status === 204) return new NextResponse(null, { status: 204 })

  const body = await res.text()
  try {
    return NextResponse.json(JSON.parse(body), { status: res.status })
  } catch {
    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") ?? "text/plain" },
    })
  }
}

type Ctx = { params: Promise<{ path: string[] }> }

export async function GET(req: NextRequest, { params }: Ctx) {
  return forward(req, (await params).path)
}

export async function POST(req: NextRequest, { params }: Ctx) {
  return forward(req, (await params).path)
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  return forward(req, (await params).path)
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  return forward(req, (await params).path)
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  return forward(req, (await params).path)
}
