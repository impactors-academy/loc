"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { api } from "@/lib/api"

interface InquiryFormProps {
  subject: string
}

export function InquiryForm({ subject }: InquiryFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: () => api.contact.submit({ ...form, subject }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate()
  }

  if (isSuccess) {
    return <p className="text-green-600 font-medium">Thank you! We'll be in touch shortly.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mt-8">
      <input
        required
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border rounded-lg px-4 py-2 text-sm"
      />
      <input
        required
        type="email"
        placeholder="Email address"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border rounded-lg px-4 py-2 text-sm"
      />
      <input
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full border rounded-lg px-4 py-2 text-sm"
      />
      <textarea
        required
        rows={4}
        placeholder="Your message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full border rounded-lg px-4 py-2 text-sm resize-none"
      />
      {isError && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  )
}
