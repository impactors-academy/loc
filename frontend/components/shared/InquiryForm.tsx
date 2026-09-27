"use client"

import { api } from "@/lib/api"
import { trackEvent } from "@/lib/analytics"
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
    onSuccess: () => trackEvent("Inquiry Submitted", { subject }),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate()
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl bg-loc-sand p-8 text-center" role="status">
        <p className="text-loc-night text-[15px] leading-relaxed">{t("success")}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inquiry-name" className="block text-[11px] font-semibold text-loc-night mb-1.5 uppercase tracking-[0.12em]">
            {t("name")}
          </label>
          <input
            id="inquiry-name"
            autoComplete="name"
            required
            placeholder={t("name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full h-12 border border-loc-night/15 rounded-xl px-4 text-[15px] bg-white placeholder:text-loc-stone/70 focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors"
          />
        </div>
        <div>
          <label htmlFor="inquiry-email" className="block text-[11px] font-semibold text-loc-night mb-1.5 uppercase tracking-[0.12em]">
            {t("email")}
          </label>
          <input
            id="inquiry-email"
            autoComplete="email"
            required
            type="email"
            placeholder={t("email")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full h-12 border border-loc-night/15 rounded-xl px-4 text-[15px] bg-white placeholder:text-loc-stone/70 focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="inquiry-phone" className="block text-[11px] font-semibold text-loc-night mb-1.5 uppercase tracking-[0.12em]">
          {t("phone")}
        </label>
        <input
          id="inquiry-phone"
          type="tel"
          autoComplete="tel"
          placeholder="+212 6xx xxx xxx"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full h-12 border border-loc-night/15 rounded-xl px-4 text-[15px] bg-white placeholder:text-loc-stone/70 focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors"
        />
      </div>
      <div>
        <label htmlFor="inquiry-message" className="block text-[11px] font-semibold text-loc-night mb-1.5 uppercase tracking-[0.12em]">
          {t("message")}
        </label>
        <textarea
          id="inquiry-message"
          required
          rows={4}
          placeholder={t("message")}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-loc-night/15 rounded-xl px-4 py-3 text-[15px] bg-white placeholder:text-loc-stone/70 focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors resize-none"
        />
      </div>
      {isError && (
        <p className="text-destructive text-sm" role="alert">{t("error")}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full h-14 px-6 rounded-full text-[15px] font-semibold disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-copper focus-visible:ring-offset-2"
      >
        {isPending ? t("sending") : t("send")}
      </button>
    </form>
  )
}
