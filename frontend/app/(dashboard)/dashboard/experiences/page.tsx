"use client"

import { api } from "@/lib/api"
import type { Experience } from "@/lib/types"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ExperiencesPage() {
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.admin.experiences.list().then(setItems).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await api.admin.experiences.delete(slug)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-loc-night">Experiences</h1>
          <p className="text-loc-stone text-sm mt-0.5">{items.length} total</p>
        </div>
        <Link href="/dashboard/experiences/new"
          className="px-4 py-2 bg-loc-terracotta text-white text-sm font-semibold rounded-lg hover:bg-loc-terracotta/90 transition-colors">
          + New experience
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({length: 5}).map((_, i) => <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                {["Title", "Category", "Country", "Featured", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-loc-stone uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-loc-night">{item.title}</td>
                  <td className="px-4 py-3 text-loc-stone capitalize">{item.category}</td>
                  <td className="px-4 py-3 text-loc-stone">{item.country ?? "—"}</td>
                  <td className="px-4 py-3">{item.isFeatured ? <span className="text-xs bg-loc-amber/20 text-loc-amber font-medium px-2 py-0.5 rounded-full">Yes</span> : <span className="text-loc-stone">No</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/dashboard/experiences/${item.slug}/edit`} className="text-loc-terracotta hover:underline text-xs font-medium">Edit</Link>
                      <button onClick={() => handleDelete(item.slug, item.title)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
