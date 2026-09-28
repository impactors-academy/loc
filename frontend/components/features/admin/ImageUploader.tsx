"use client"

import { api } from "@/lib/api"
import { useRef, useState } from "react"

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

const input =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta"

async function sha256Hex(file: File): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer())
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("")
}

// Presigned PUT to R2 — the file goes straight from the browser to the
// bucket, this server only ever sees the resulting public URL.
export function ImageUploader({ images, onChange }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError("")
    setNotice("")
    setUploading(true)
    try {
      // Files are keyed by content hash, so the same photo always gets the
      // same URL. Re-selecting files already on the listing (or the same
      // file twice in one batch) is skipped instead of stored again — before
      // this, two Guéliz apartments ended up with 8 repeated photos each.
      const known = new Set(images)
      const uploaded: string[] = []
      let skipped = 0
      for (const file of Array.from(files)) {
        const { upload_url, public_url } = await api.admin.uploads.presign(file.type, await sha256Hex(file))
        if (known.has(public_url)) {
          skipped++
          continue
        }
        const put = await fetch(upload_url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        })
        if (!put.ok) throw new Error(`Upload failed for ${file.name}`)
        known.add(public_url)
        uploaded.push(public_url)
      }
      onChange([...images, ...uploaded])
      if (skipped) setNotice(`${skipped} photo${skipped > 1 ? "s" : ""} already on this listing, skipped.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ""
    }
  }

  return (
    <div>
      {images.map((url, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            className={input}
            value={url}
            onChange={(e) => {
              const imgs = [...images]
              imgs[i] = e.target.value
              onChange(imgs)
            }}
          />
          <button
            type="button"
            onClick={() => onChange(images.filter((_, j) => j !== i))}
            className="px-3 py-2 text-sm text-destructive border border-border rounded-lg hover:bg-destructive/5"
          >
            ✕
          </button>
        </div>
      ))}

      <div className="flex items-center gap-3 mt-1">
        <button
          type="button"
          onClick={() => onChange([...images, ""])}
          className="text-sm text-loc-terracotta hover:underline"
        >
          + Add image URL
        </button>
        <span className="text-border">|</span>
        <label className="text-sm text-loc-terracotta hover:underline cursor-pointer">
          {uploading ? "Uploading…" : "Upload photo(s)"}
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      {notice && <p className="text-sm text-loc-stone mt-1">{notice}</p>}
    </div>
  )
}
