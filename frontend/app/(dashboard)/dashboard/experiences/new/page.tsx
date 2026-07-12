import { ExperienceForm } from "../_form"

export default function NewExperiencePage() {
  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold text-loc-night mb-1">New Experience</h1>
      <p className="text-loc-stone text-sm mb-8">Add a new curated experience to the platform</p>
      <ExperienceForm />
    </div>
  )
}
