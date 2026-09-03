"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import {
  leadership,
  subteamLeads,
  displayName,
  initials,
  type Lead,
  type LeadGroup,
} from "@/lib/leads";

const sectionEase = [0.25, 0.46, 0.45, 0.94] as const;

/** One person: a large portrait, with the name and email beneath it. */
function PersonCard({ lead, role, index }: { lead: Lead; role?: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.06, ease: sectionEase }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-[0_0_28px_-2px_rgba(227,181,61,0.38)] transition-[background,box-shadow] duration-300 hover:from-white/[0.075] hover:to-white/[0.025] hover:shadow-[0_0_54px_4px_rgba(227,181,61,0.8)]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#0d0d0d]">
        {lead.photo ? (
          /* Decorative: the name and email sit directly beneath as text. */
          <Image
            src={lead.photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-[#e3b53d]/10 text-4xl font-bold text-[#e3b53d]/70"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            {initials(lead)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 px-4 pb-4 pt-3.5">
        {role && (
          <span
            className="text-[10px] font-bold uppercase text-[#e3b53d]"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif", letterSpacing: "0.2em" }}
          >
            {role}
          </span>
        )}
        <span className="text-[15px] font-semibold leading-tight text-white">
          {displayName(lead)}
          {lead.term && (
            <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/40">
              {lead.term}
            </span>
          )}
        </span>
        <a
          href={`mailto:${lead.email}`}
          className="group/mail inline-flex items-center gap-1.5 text-[13px] text-gray-400 transition-colors hover:text-[#e3b53d]"
        >
          <Mail className="h-3.5 w-3.5 shrink-0 opacity-60 transition-opacity group-hover/mail:opacity-100" />
          <span className="truncate underline-offset-4 group-hover/mail:underline">{lead.email}</span>
        </a>
      </div>
    </motion.div>
  );
}

/**
 * A role heading that establishes the row. The rule still runs off to the
 * right; the subteam link now sits beneath the title as a subtitle, indented
 * to line up with it (dash w-6 + gap-4 = 2.5rem).
 */
function RowHeader({ title, note, slug }: { title: string; note?: string; slug?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: sectionEase }}
      className="mb-6"
    >
      <div className="flex items-center gap-4">
        <span className="h-px w-6 shrink-0 bg-[#e3b53d]" />
        {/* globals.css already maps h2 to Ethnocentric  -  the site's display face. */}
        <h2
          className="min-w-0 uppercase leading-none text-[#e3b53d]"
          style={{ fontSize: "clamp(0.95rem, 2vw, 1.6rem)" }}
        >
          {title}
        </h2>
        <span className="h-px min-w-6 flex-1 bg-white/10" />
      </div>

      {(note || slug) && (
        <div className="ml-10 mt-2 flex flex-col gap-0.5">
          {note && <span className="text-xs italic text-white/35">{note}</span>}
          {slug && (
            <Link
              href={`/teams/${slug}`}
              className="group inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#e3b53d]/80 transition-colors hover:text-[#ffe566]"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              View subteam
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}

function LeadRow({ group }: { group: LeadGroup }) {
  return (
    <section className="mb-14">
      <RowHeader title={group.role} note={group.note} slug={group.slug} />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {group.people.map((p, i) => (
          <PersonCard key={p.email} lead={p} index={i} />
        ))}
      </div>
    </section>
  );
}

export default function LeadsPage() {
  // Chief Engineer and Project Manager are one-person roles. Giving each its own
  // row would leave two nearly empty bands, so they share a Leadership row and
  // carry their role on the card instead.
  const leadershipPeople = leadership.flatMap((g) =>
    g.people.map((p) => ({ person: p, role: g.role }))
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="relative overflow-hidden pt-32 pb-14">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-[#8b0000]/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#e3b53d]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-4 font-bold text-white" style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)" }}>
              Team <span className="text-[#e3b53d]">Leads</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-400 sm:text-base">
              The people running each subteam. Reach out directly with questions about their area, or
              jump to a subteam to see what they build.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* Leadership  -  team-wide roles, so no subteam link */}
        <section className="mb-14">
          <RowHeader title="Leadership" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {leadershipPeople.map(({ person, role }, i) => (
              <PersonCard key={person.email} lead={person} role={role} index={i} />
            ))}
          </div>
        </section>

        {subteamLeads.map((group) => (
          <LeadRow key={group.role} group={group} />
        ))}
      </div>
    </div>
  );
}
