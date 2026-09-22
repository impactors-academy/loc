import { extractYouTubeId } from "@/lib/youtube"

interface Props {
  url: string
  title: string
}

export function YouTubeEmbed({ url, title }: Props) {
  const id = extractYouTubeId(url)
  if (!id) return null

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
