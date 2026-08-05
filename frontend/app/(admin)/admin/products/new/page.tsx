import { ProductForm } from "../_form"

export default function NewProductPage() {
  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold text-loc-night mb-1">New Product</h1>
      <p className="text-loc-stone text-sm mb-8">Add a guide, map, or digital product</p>
      <ProductForm />
    </div>
  )
}
