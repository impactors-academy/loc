"use client"

import { api } from "@/lib/api"
import { useEffect, useState } from "react"

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  source_type: string
  source_id: string | null
  created_at: string
}

export default function InquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.admin.leads.list().then((data) => setItems(data as unknown as Inquiry[])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-loc-night">Inquiries</h1>
        <p className="text-loc-stone text-sm mt-0.5">{items.length} total — read-only</p>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({length:8}).map((_,i)=><div key={i} className="h-12 bg-muted rounded-lg animate-pulse"/>)}</div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                {["Date","Name","Email","Phone","Subject","Source"].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-loc-stone uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 group">
                  <td className="px-4 py-3 text-loc-stone whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 font-medium text-loc-night">{item.name}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${item.email}`} className="text-loc-teal hover:underline">{item.email}</a>
                  </td>
                  <td className="px-4 py-3 text-loc-stone">{item.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-loc-stone max-w-[200px] truncate" title={item.subject}>{item.subject}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-loc-sand text-loc-stone capitalize">
                      {item.source_type}
                    </span>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-loc-stone text-sm">No inquiries yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
