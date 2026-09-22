// Accepts youtu.be, watch?v=, embed/, and shorts/ links and returns the bare
// video id, or null if the string isn't a recognizable YouTube URL — callers
// use null to skip rendering rather than embedding a broken player.
export function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null
    if (!u.hostname.endsWith("youtube.com")) return null
    if (u.pathname === "/watch") return u.searchParams.get("v")
    const match = u.pathname.match(/^\/(embed|shorts)\/([^/]+)/)
    return match ? match[2] : null
  } catch {
    return null
  }
}
