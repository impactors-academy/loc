"use client"

import { api } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"

interface InquiryFormProps {
  subject: string
}

export function InquiryForm({ subject }: InquiryFormProps) {
  const t = useTranslations("inquiry")
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
      <div className="rounded-2xl bg-loc-sand/60 border border-loc-sand p-8 text-center" role="status">
        <p className="text-loc-stone text-sm">{t("success")}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inquiry-name" className="block text-xs font-medium text-loc-stone mb-1.5 uppercase tracking-wide">
            {t("name")}
          </label>
          <input
            id="inquiry-name"
            required
            placeholder={t("name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors"
          />
        </div>
        <div>
          <label htmlFor="inquiry-email" className="block text-xs font-medium text-loc-stone mb-1.5 uppercase tracking-wide">
            {t("email")}
          </label>
          <input
            id="inquiry-email"
            required
            type="email"
            placeholder={t("email")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="inquiry-phone" className="block text-xs font-medium text-loc-stone mb-1.5 uppercase tracking-wide">
          {t("phone")}
        </label>
        <input
          id="inquiry-phone"
          placeholder="+212 6xx xxx xxx"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors"
        />
      </div>
      <div>
        <label htmlFor="inquiry-message" className="block text-xs font-medium text-loc-stone mb-1.5 uppercase tracking-wide">
          {t("message")}
        </label>
        <textarea
          id="inquiry-message"
          required
          rows={4}
          placeholder={t("message")}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors resize-none"
        />
      </div>
      {isError && (
        <p className="text-destructive text-sm" role="alert">{t("error")}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-loc-terracotta text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-loc-terracotta/90 disabled:opacity-50 transition-all hover:scale-[1.01]"
      >
        {isPending ? t("sending") : t("send")}
      </button>
    </form>
  )
}
