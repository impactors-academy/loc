import { PropertyForm } from "../_form"

export default function NewPropertyPage() {
  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold text-loc-night mb-1">New Property</h1>
      <p className="text-loc-stone text-sm mb-8">Add a new handpicked stay to the platform</p>
      <PropertyForm />
    </div>
  )
}
