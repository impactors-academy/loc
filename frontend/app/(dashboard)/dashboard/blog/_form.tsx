"use client"

import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { BlogPost } from "@/lib/types"

const input = "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta"
const label = "block text-xs font-semibold text-loc-stone uppercase tracking-wide mb-1"

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

interface Props { initial?: BlogPost; editSlug?: string }

export function BlogPostForm({ initial, editSlug }: Props) {
  const router = useRouter()
  const isEdit = !!editSlug

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    image_url: initial?.imageUrl ?? "",
    tags: Array.isArray(initial?.tags) ? (initial.tags as string[]).join(", ") : (initial?.tags ?? ""),
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleTitle = (v: string) =>
    setForm((f) => ({ ...f, title: v, slug: isEdit ? f.slug : toSlug(v) }))

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    const body = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      image_url: form.image_url || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    }
    try {
      if (isEdit) await api.admin.blog.update(editSlug, body)
      else await api.admin.blog.create(body)
      router.push("/dashboard/blog")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><label className={label}>Title *</label><input className={input} value={form.title} onChange={(e) => handleTitle(e.target.value)} required /></div>
        <div className="col-span-2"><label className={label}>Slug *</label><input className={input} value={form.slug} onChange={(e) => set("slug", e.target.value)} required /></div>
        <div className="col-span-2"><label className={label}>Excerpt</label><textarea className={`${input} min-h-[80px] resize-y`} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></div>
        <div className="col-span-2"><label className={label}>Content (HTML)</label><textarea className={`${input} min-h-[200px] resize-y font-mono text-xs`} value={form.content} onChange={(e) => set("content", e.target.value)} /></div>
        <div className="col-span-2"><label className={label}>Cover Image URL</label><input className={input} type="url" value={form.image_url} onChange={(e) => set("image_url", e.target.value)} /></div>
        <div className="col-span-2"><label className={label}>Tags (comma-separated)</label><input className={input} placeholder="japan, travel, food" value={form.tags} onChange={(e) => set("tags", e.target.value)} /></div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-loc-terracotta text-white text-sm font-semibold rounded-lg hover:bg-loc-terracotta/90 disabled:opacity-50 transition-colors">
          {saving ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </form>
  )
}
