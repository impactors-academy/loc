import { PROFILE_BASE, type Locale, type TeamMember } from "@/lib/team"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { getLocale, getTranslations } from "next-intl/server"

interface Props {
  author?: TeamMember
  reviewer?: TeamMember
}

// The standard author box that closes an article: who wrote it and who
// reviewed it, each with a round photo, role and a link to their profile.
// When no named author is set, the team itself is credited with the logo.
export async function AuthorBox({ author, reviewer }: Props) {
  const t = await getTranslations("blogDetailPage")
  const locale = (await getLocale()) as Locale

  const row = (label: string, member: TeamMember | undefined) => (
    <div className="flex items-center gap-4">
      <Image
        src={member?.photo ?? "/icons/loc-mark.png"}
        alt=""
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
      />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-loc-terracotta">{label}</p>
        <p className="mt-0.5 font-heading text-lg font-semibold text-loc-night leading-tight">
          {member ? member.name : t("teamAuthor")}
        </p>
        <p className="text-sm text-loc-stone">{member ? member.role[locale] ?? member.role.en : t("teamAuthorRole")}</p>
      </div>
      {member && (
        <a
          href={`${PROFILE_BASE}/${member.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-light ml-auto hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium"
          aria-label={`${t("viewProfile")}: ${member.name}`}
        >
          {t("viewProfile")}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}
    </div>
  )

  return (
    <aside aria-label={t("aboutTheAuthors")} className="rounded-[24px] bg-loc-cream border border-loc-night/[0.06] p-6 md:p-8 space-y-6">
      {row(t("writtenBy"), author)}
      {reviewer && reviewer.slug !== author?.slug && (
        <>
          <div className="h-px bg-loc-night/10" />
          {row(t("reviewedBy"), reviewer)}
        </>
      )}
    </aside>
  )
}
