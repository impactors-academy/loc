"use client"

import { cn } from "@/lib/utils"
import { Check, Link2, Share2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState, useSyncExternalStore } from "react"
import { FacebookIcon } from "@/components/shared/SocialIcons"

// Thin copper bar across the top of the viewport that fills as the article is read.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("article-body")
      if (!el) return
      const start = el.offsetTop - window.innerHeight * 0.3
      const end = el.offsetTop + el.offsetHeight - window.innerHeight * 0.7
      setProgress(Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start))))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-[55] h-[3px] pointer-events-none" aria-hidden="true">
      <div className="h-full bg-loc-copper origin-left" style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}

export function ShareButtons({ title, className }: { title: string; className?: string }) {
  const t = useTranslations("blogDetailPage")
  const [copied, setCopied] = useState(false)
  // Server render and first paint agree on "no native share"; the browser value
  // takes over after hydration without a setState-in-effect round trip.
  const canShare = useSyncExternalStore(
    () => () => {},
    () => "share" in navigator,
    () => false
  )

  const url = () => window.location.href

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); the button simply does nothing.
    }
  }

  const btn = "glass-light h-10 w-10 rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-terracotta"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {canShare && (
        <button type="button" className={btn} aria-label={t("share")} title={t("share")} onClick={() => navigator.share({ title, url: url() }).catch(() => undefined)}>
          <Share2 size={16} />
        </button>
      )}
      <button type="button" className={btn} aria-label={copied ? t("linkCopied") : t("copyLink")} title={copied ? t("linkCopied") : t("copyLink")} onClick={copy}>
        {copied ? <Check size={16} className="text-success" /> : <Link2 size={16} />}
      </button>
      <a
        className={btn}
        href="#"
        aria-label="Facebook"
        title="Facebook"
        onClick={(e) => {
          e.preventDefault()
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`, "_blank", "noopener,noreferrer")
        }}
      >
        <FacebookIcon size={15} />
      </a>
      <span className="sr-only" aria-live="polite">{copied ? t("linkCopied") : ""}</span>
    </div>
  )
}
