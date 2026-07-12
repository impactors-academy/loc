import { BlogPostForm } from "../_form"

export default function NewBlogPostPage() {
  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold text-loc-night mb-1">New Blog Post</h1>
      <p className="text-loc-stone text-sm mb-8">Write and publish a new article</p>
      <BlogPostForm />
    </div>
  )
}
