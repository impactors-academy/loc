"use client"

import { COUNTRIES, EXPERIENCE_CATEGORIES } from "@/lib/constants"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Experience } from "@/lib/types"

const input = "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta"
const label = "block text-xs font-semibold text-loc-stone uppercase tracking-wide mb-1"

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

interface Props {
  initial?: Experience
  editSlug?: string
}

export function ExperienceForm({ initial, editSlug }: Props) {
  const router = useRouter()
  const isEdit = !!editSlug

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "adventure",
    country: initial?.country ?? "",
    location: initial?.location ?? "",
    duration: initial?.duration ?? "",
    price_min: initial?.priceMin?.toString() ?? "",
    price_max: initial?.priceMax?.toString() ?? "",
    images: initial?.images ?? ([] as string[]),
    is_featured: initial?.isFeatured ?? false,
    provider_name: initial?.providerName ?? "",
    provider_contact: initial?.providerContact ?? "",
    referral_url: initial?.referralUrl ?? "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const handleTitle = (v: string) => {
    setForm((f) => ({ ...f, title: v, slug: isEdit ? f.slug : toSlug(v) }))
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    const body = {
      ...form,
      price_min: form.price_min ? parseFloat(form.price_min) : null,
      price_max: form.price_max ? parseFloat(form.price_max) : null,
    }
    try {
      if (isEdit) {
        await api.admin.experiences.update(editSlug, body)
      } else {
        await api.admin.experiences.create(body)
      }
      router.push("/dashboard/experiences")
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
        <div className="col-span-2">
          <label className={label}>Title *</label>
          <input className={input} value={form.title} onChange={(e) => handleTitle(e.target.value)} required />
        </div>
        <div className="col-span-2">
          <label className={label}>Slug *</label>
          <input className={input} value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
        </div>
        <div className="col-span-2">
          <label className={label}>Description</label>
          <textarea className={`${input} min-h-[100px] resize-y`} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div>
          <label className={label}>Category *</label>
          <select className={input} value={form.category} onChange={(e) => set("category", e.target.value)}>
            {EXPERIENCE_CATEGORIES.filter(c => c.value).map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Country</label>
          <select className={input} value={form.country} onChange={(e) => set("country", e.target.value)}>
            <option value="">— None —</option>
            {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Location</label>
          <input className={input} value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
        <div>
          <label className={label}>Duration</label>
          <input className={input} placeholder="e.g. 2 hours" value={form.duration} onChange={(e) => set("duration", e.target.value)} />
        </div>
        <div>
          <label className={label}>Price Min (€)</label>
          <input className={input} type="number" min="0" step="0.01" value={form.price_min} onChange={(e) => set("price_min", e.target.value)} />
        </div>
        <div>
          <label className={label}>Price Max (€)</label>
          <input className={input} type="number" min="0" step="0.01" value={form.price_max} onChange={(e) => set("price_max", e.target.value)} />
        </div>
        <div>
          <label className={label}>Provider Name</label>
          <input className={input} value={form.provider_name} onChange={(e) => set("provider_name", e.target.value)} />
        </div>
        <div>
          <label className={label}>Provider Contact</label>
          <input className={input} value={form.provider_contact} onChange={(e) => set("provider_contact", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={label}>Referral URL</label>
          <input className={input} type="url" value={form.referral_url} onChange={(e) => set("referral_url", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={label}>Images (one URL per row)</label>
          {form.images.map((url, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className={input} value={url} onChange={(e) => {
                const imgs = [...form.images]; imgs[i] = e.target.value; set("images", imgs)
              }} />
              <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                className="px-3 py-2 text-sm text-red-500 border border-border rounded-lg hover:bg-red-50">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => set("images", [...form.images, ""])}
            className="text-sm text-loc-terracotta hover:underline">+ Add image URL</button>
        </div>
        <div className="col-span-2 flex items-center gap-3">
          <input id="featured" type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} className="w-4 h-4 accent-loc-terracotta" />
          <label htmlFor="featured" className="text-sm font-medium text-loc-night">Featured</label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 bg-loc-terracotta text-white text-sm font-semibold rounded-lg hover:bg-loc-terracotta/90 disabled:opacity-50 transition-colors">
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create experience"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
