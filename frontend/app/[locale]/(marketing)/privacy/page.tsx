import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"

// English only, for now — matches the existing precedent set by /promote in
// this same route group, which is also plain hardcoded copy with no
// useTranslations. A legal document is also a place where a wrong
// translation is worse than none; localizing this can follow once someone
// reviews the translated text, not as a mechanical first pass.
export const metadata: Metadata = {
  title: "Privacy Policy | LOC",
  description: "How LOC collects, uses, and protects information across loctravels.com.",
  alternates: { canonical: "/privacy" },
}

const EMAIL = "pro@impactorsacademy.com"
const EFFECTIVE_DATE = "August 23, 2026"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-lg md:text-xl font-semibold text-loc-night mb-3">
        {title}
      </h2>
      <div className="text-sm md:text-base leading-relaxed text-loc-stone space-y-3">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-24 pb-20">
      <section className="container mx-auto px-4 max-w-2xl mb-10">
        <SectionHeader eyebrow="Legal" title="Privacy Policy" />
        <p className="text-loc-stone text-sm -mt-6">Effective {EFFECTIVE_DATE}</p>
      </section>

      <section className="container mx-auto px-4 max-w-2xl">
        <div className="rounded-2xl bg-white border border-border p-8 shadow-sm">
          <Section title="Who we are">
            <p>
              LOC (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a discovery and inquiry platform for
              travel experiences, stays, and local products, part of the Impactors Academy
              family of ventures. This policy covers loctravels.com and the pages under it,
              including the blog and store.
            </p>
            <p>
              Contact for anything in this policy:{" "}
              <a href={`mailto:${EMAIL}`} className="text-loc-terracotta">
                {EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="What we collect">
            <p>
              <strong className="text-loc-night">Inquiry form.</strong> If you submit an
              inquiry about an experience, stay, product, or business promotion, we store the
              name, email, phone number (if provided), and message you give us, along with
              which listing or page the inquiry came from &mdash; so a team member can read it,
              reply, and route it to the right partner. That&apos;s the only place on the public
              site that collects personal information.
            </p>
            <p>
              <strong className="text-loc-night">What we don&rsquo;t collect.</strong> LOC is
              discovery and inquiry only &mdash; we never process bookings or payments
              ourselves; any booking happens directly with the experience, stay, or store
              partner you connect with. We don&rsquo;t run analytics or ad-tracking on this
              site, don&rsquo;t sell data to third parties, and don&rsquo;t require an account
              to browse, read the blog, or submit an inquiry.
            </p>
          </Section>

          <Section title="Why we collect it">
            <ul className="list-disc pl-5 space-y-2">
              <li>To respond to inquiries and connect you with the right partner.</li>
              <li>To keep the site secure and diagnose technical problems.</li>
            </ul>
          </Section>

          <Section title="How long we keep it">
            <p>
              Inquiries are kept as long as needed to respond and for our own records, and can
              be deleted on request (see &ldquo;Your rights&rdquo; below).
            </p>
          </Section>

          <Section title="Who we share it with">
            <p>
              We don&rsquo;t sell or rent personal information. An inquiry about a specific
              experience, stay, or product is shared with that listing&rsquo;s partner so they
              can respond to you directly &mdash; that&apos;s the whole point of submitting it.
              Beyond that, it&apos;s shared only with the service provider that hosts the site,
              and only to the extent needed for them to provide that service, or if required by
              law.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              You can ask us what personal information we hold about you, ask us to correct it,
              or ask us to delete it, by emailing{" "}
              <a href={`mailto:${EMAIL}`} className="text-loc-terracotta">
                {EMAIL}
              </a>
              . If you&rsquo;re in the EU/EEA or UK, these are your rights under GDPR/UK GDPR;
              we honor the same requests regardless of where you&rsquo;re writing from.
            </p>
          </Section>

          <Section title="Children">
            <p>
              This site is not directed at children under 13, and we don&rsquo;t knowingly
              collect personal information from them. If you believe a child has submitted
              information to us, contact us and we&rsquo;ll remove it.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We&rsquo;ll update this page if what we collect or how we use it changes, and
              update the effective date above when we do. Material changes will be reflected
              here before they take effect.
            </p>
          </Section>
        </div>
      </section>
    </main>
  )
}
