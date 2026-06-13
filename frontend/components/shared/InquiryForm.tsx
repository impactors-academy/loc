"use client"

import { api } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

interface InquiryFormProps {
  subject: string
}

export function InquiryForm({ subject }: InquiryFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: () => api.contact.submit({ ...form, subject }),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate()
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl bg-loc-sand/60 border border-loc-sand p-8 text-center">
        <p className="font-heading text-xl text-loc-night mb-2">Message sent!</p>
        <p className="text-loc-stone text-sm">We&apos;ll be in touch with you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-loc-stone mb-1.5 uppercase tracking-wide">
            Name
          </label>
          <input
            required
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-loc-stone mb-1.5 uppercase tracking-wide">
            Email
          </label>
          <input
            required
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-loc-stone mb-1.5 uppercase tracking-wide">
          Phone <span className="text-loc-stone/50 normal-case">(optional)</span>
        </label>
        <input
          placeholder="+212 6xx xxx xxx"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-loc-stone mb-1.5 uppercase tracking-wide">
          Message
        </label>
        <textarea
          required
          rows={4}
          placeholder="Tell us about your dates, group size, or any questions…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors resize-none"
        />
      </div>
      {isError && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-loc-terracotta text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-loc-terracotta/90 disabled:opacity-50 transition-all hover:scale-[1.01]"
      >
        {isPending ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  )
}
