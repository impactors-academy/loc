import type { Metadata } from "next"

import { Sidebar } from "./_components/Sidebar"

// Internal tool — keep it out of search results. This is a hint to crawlers,
// not an access control; /admin must still sit behind Cloudflare Access.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
