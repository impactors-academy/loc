"use client"

import { api } from "@/lib/api"
import Link from "next/link"
import { useEffect, useState } from "react"

const CARDS = [
  { label: "Experiences", href: "/dashboard/experiences", fetch: () => api.admin.experiences.list() },
  { label: "Properties",  href: "/dashboard/properties",  fetch: () => api.admin.properties.list() },
  { label: "Blog Posts",  href: "/dashboard/blog",        fetch: () => api.admin.blog.list() },
  { label: "Products",    href: "/dashboard/products",    fetch: () => api.admin.products.list() },
]

export default function DashboardPage() {
  const [counts, setCounts] = useState<(number | null)[]>([null, null, null, null])
  const [leads, setLeads] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    CARDS.forEach((card, i) => {
      card.fetch().then((data) =>
        setCounts((prev) => { const next = [...prev]; next[i] = data.length; return next })
      ).catch(() => {})
    })
    api.admin.leads.list().then(setLeads).catch(() => {})
  }, [])

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold text-loc-night mb-1">Overview</h1>
      <p className="text-loc-stone text-sm mb-8">Platform content at a glance</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {CARDS.map((card, i) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-border p-5 hover:border-loc-terracotta/40 hover:shadow-sm transition-all group"
          >
            <p className="text-3xl font-heading font-bold text-loc-terracotta mb-1">
              {counts[i] ?? "—"}
            </p>
            <p className="text-sm text-loc-stone group-hover:text-loc-night transition-colors">{card.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-heading text-lg font-semibold text-loc-night mb-4">Recent Inquiries</h2>
      {leads.length === 0 ? (
        <p className="text-loc-stone text-sm">No inquiries yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                {["Name", "Email", "Subject", "Source", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-loc-stone uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.slice(0, 10).map((lead, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-loc-night">{String(lead.name ?? "")}</td>
                  <td className="px-4 py-3 text-loc-stone">{String(lead.email ?? "")}</td>
                  <td className="px-4 py-3 text-loc-stone">{String(lead.subject ?? "")}</td>
                  <td className="px-4 py-3 text-loc-stone">{String(lead.source_type ?? "")}</td>
                  <td className="px-4 py-3 text-loc-stone">
                    {lead.created_at ? new Date(String(lead.created_at)).toLocaleDateString() : ""}
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
