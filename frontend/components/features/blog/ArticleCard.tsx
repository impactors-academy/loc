import type { BlogPost } from "@/lib/types"
import Link from "next/link"

export function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <div className="rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-neutral-100">
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{new Date(post.publishedAt).toLocaleDateString()}</p>
        <h3 className="font-semibold text-base mt-1">{post.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-block mt-4 text-sm font-medium text-black underline underline-offset-2 hover:opacity-70"
        >
          Read more
        </Link>
      </div>
    </div>
  )
}
