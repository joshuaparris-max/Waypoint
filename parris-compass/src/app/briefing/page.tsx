import Link from "next/link";
import { ArrowLeft, BookOpen, LayoutDashboard, Shield } from "lucide-react";

export const metadata = {
  title: "Occupational Health Briefing",
  description:
    "Level 1 IT downtime, display-screen exposure, static standing, and interrupt-driven monitoring guidance.",
};

export default function BriefingPage() {
  return (
    <main className="min-h-screen bg-[#f6f8f7] text-[#1a2e4a]">
      <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2a7d8e]">
              Occupational Health Psychology Briefing
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#1a2e4a] sm:text-4xl">
              Level 1 IT downtime, display-screen exposure, static standing,
              and interrupt-driven low-demand monitoring
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5d6f82]">
              A revised practitioner version that brings the full briefing
              content into the app, including scope, mechanisms, controls,
              protocols, evidence classification, and limitations.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#243f63]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Waypoint
          </Link>
        </header>

        <article className="grid gap-6">
          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#2a7d8e]">
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
              <p className="text-sm font-semibold uppercase tracking-[0.14em]">
                Revision basis
              </p>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[#5d6f82]">
              <p>
                Round 3 revised practitioner version with four targeted
                corrections: uniform AOA correction, separation of Safe Work
                Australia and WorkSafe Queensland citations, an operational
                definition of the IT downtime construct, and relocation of
                ADHD-related controls into general cognitive-underload
                controls.
              </p>
              <p>
                This briefing is an applied occupational-health and
                human-computer interaction analysis, not a clinical
denotation.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a2e4a]">1. Scope</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
              This briefing evaluates a Level 1 IT support work pattern involving:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5d6f82]">
              <li>Prolonged display-screen work</li>
              <li>Use of a sit-stand workstation</li>
              <li>Periods of static standing</li>
              <li>Low or absent ticket/call volume</li>
              <li>Interruptible availability for calls, tickets, messages, or walk-ups</li>
              <li>Low task demand combined with a requirement to remain ready</li>
            </ul>
            <p className="mt-4 text-sm leading-7 text-[#5d6f82]">
              The assessment is not a clinical diagnosis. It is an applied
              occupational-health and human-computer interaction analysis.
            </p>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a2e4a]">2. Evidence Classification</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-[#5d6f82]">
                <thead>
                  <tr>
                    <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">
                      Classification
                    </th>
                    <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">
                      Meaning
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">
                      Guideline-supported
                    </td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">
                      Directly supported by occupational, ergonomic, or
                      optometric guidance.
                    </td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">
                      Evidence-aligned
                    </td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">
                      Consistent with research findings or mechanisms, but not
                      directly validated in the exact work context.
                    </td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="px-3 py-3 font-semibold">
                      Expert-derived protocol
                    </td>
                    <td className="px-3 py-3">
                      Applied synthesis designed for this work pattern; not an
                      independently validated standard.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#2a7d8e]">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-2xl font-semibold">3. Operational Definition</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
              Interrupt-driven low-demand monitoring with sustained readiness
              refers to a work state with the following operational features:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-[#5d6f82]">
                <thead>
                  <tr>
                    <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">
                      Parameter
                    </th>
                    <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">
                      Definition
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">
                      Signal source
                    </td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">
                      Incoming work is externally triggered: phone call, ticket,
                      message, or walk-up.
                    </td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">
                      Signal frequency
                    </td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">
                      Low or irregular; extended periods may occur with no
                      actionable input.
                    </td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">
                      Response requirement
                    </td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">
                      Availability must be preserved so incoming events can be
                      answered within the normal operational window of the role.
                    </td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">
                      Attentional demand
                    </td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">
                      Continuous perceptual scanning is not required, but
                      periodic channel checking and readiness are required.
                    </td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">
                      Distinction from active work
                    </td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">
                      The worker is not continuously solving tickets or producing
                      assigned outputs.
                    </td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="px-3 py-3 font-semibold">
                      Distinction from recovery
                    </td>
                    <td className="px-3 py-3">
                      The worker is not fully off-task or resting, because
                      interruption remains possible and role availability is
                      required.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#5d6f82]">
              This construct is adjacent to, but not equivalent to, classic
              vigilance-decrement paradigms. Classic vigilance research often
              concerns continuous signal-detection tasks. IT service-desk
              downtime is more accurately described as interrupt-driven
              readiness rather than continuous perceptual monitoring.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
              A 2025 review of vigilance decrement summarises the broader
              sustained-attention literature, but the transfer to IT support
              should be treated as partial and indirect.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
              Reference: <a href="https://www.frontiersin.org/journals/cognition/articles/10.3389/fcogn.2025.1632885/full?utm_source=chatgpt.com" target="_blank" rel="noreferrer" className="text-[#2a7d8e] underline">Frontiers</a>
            </p>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a2e4a]">4. Physiological Mechanisms</h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#1a2e4a]">4.1 Display-screen exposure and visual fatigue</h3>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  Prolonged computer use increases sustained accommodation,
                  convergence demand, blink-rate reduction, tear-film instability,
                  and glare sensitivity. These mechanisms are associated with
                  digital eye strain symptoms including ocular dryness, blurred
                  vision, eye discomfort, and headache.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  The American Optometric Association recommends the 20-20-20
                  rule: every 20 minutes, view something approximately 20 feet
                  away for 20 seconds.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82] font-semibold">
                  Evidence classification:
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5d6f82]">
                  <li>Screen exposure and digital eye strain: moderate to strong association</li>
                  <li>20-20-20 rule: guideline-supported; limited direct intervention certainty</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1a2e4a]">4.2 Monitor geometry and cervical load</h3>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  Monitor position modifies visual and neck loading. OSHA states
                  that the top of the monitor should be at or slightly below eye
                  level, and that the centre of the monitor should normally sit
                  15–20 degrees below horizontal eye level.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  WorkSafe Queensland also advises setting monitor height to eye
                  level or just below, at about arm&apos;s distance, and adjusting
                  brightness, contrast, and font size to reduce visual fatigue.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82] font-semibold">
                  Evidence classification:
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5d6f82]">
                  <li>Monitor-positioning guidance: guideline-supported</li>
                  <li>Individual symptom reduction: variable; workstation-specific</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1a2e4a]">4.3 Static standing, static loading, and movement variability</h3>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  Static standing and static loading require separation.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full border-collapse text-left text-sm text-[#5d6f82]">
                    <thead>
                      <tr>
                        <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">Construct</th>
                        <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">Definition</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="odd:bg-[#fbfcfb] even:bg-white">
                        <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">Static standing</td>
                        <td className="border-b border-[#e4ebe8] px-3 py-3">
                          Upright posture maintained with limited walking or positional change.
                        </td>
                      </tr>
                      <tr className="odd:bg-[#fbfcfb] even:bg-white">
                        <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">Static loading</td>
                        <td className="border-b border-[#e4ebe8] px-3 py-3">
                          Sustained muscular activation with insufficient alternation between contraction and relaxation for the task duration.
                        </td>
                      </tr>
                      <tr className="odd:bg-[#fbfcfb] even:bg-white">
                        <td className="px-3 py-3 font-semibold">Low movement variability</td>
                        <td className="px-3 py-3">
                          Reduced variation in posture, weight shift, joint angle, or muscle recruitment over time.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#5d6f82]">
                  The physiological risk is not standing alone. The risk is prolonged standing with low movement variability and sustained muscular activation.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  Relevant tissues include spinal stabilisers, hip musculature, calves, feet, neck, and shoulder girdle.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  CCOHS reports that regular standing work may be associated with sore feet, leg swelling, muscular fatigue, low back pain, and neck or shoulder stiffness. Safe Work Australia states that workers should not remain in seated, standing, or static postures for long periods.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82] font-semibold">
                  Evidence classification:
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5d6f82]">
                  <li>Avoiding prolonged static posture: moderate to strong principle-level evidence</li>
                  <li>Transfer from industrial/retail/healthcare standing literature to sit-stand IT workstations: directionally sound but magnitude uncertain</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1a2e4a]">4.4 Lower-limb vascular function</h3>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  Static standing reduces the dynamic contribution of the calf-muscle pump. Walking, ankle motion, and calf contraction assist venous return.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  When standing is prolonged and movement is minimal, venous pooling may increase in the lower limbs, contributing to heaviness, swelling, fatigue, or discomfort.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  A review of prolonged occupational standing associates this exposure with lower back and leg pain, cardiovascular concerns, fatigue, discomfort, and other outcomes. Many source populations involve industrial, manufacturing, retail, or healthcare standing rather than computer-based sit-stand workstation use.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82] font-semibold">
                  Evidence classification:
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5d6f82]">
                  <li>Calf-pump mechanism: strong mechanistic plausibility</li>
                  <li>Clinical benefit of exact workplace movement doses: limited to moderate outcome evidence</li>
                  <li>Individual prediction: requires consideration of moderators</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a2e4a]">5. Psychological and Cognitive Mechanisms</h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#1a2e4a]">5.1 Cognitive underload and occupational boredom</h3>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  Low ticket or call volume can create cognitive underload. Occupational boredom is distinct from rest. Research on boredom and engagement at work indicates that boredom and engagement have different antecedents and are inversely related to employee wellbeing and organisational outcomes.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  This is an authorial workplace assumption, not a directly cited empirical finding for this exact workplace: a Level 1 support role may alternate between underload periods and brief demand spikes when a call, ticket, or urgent support request appears.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82] font-semibold">
                  Evidence classification:
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5d6f82]">
                  <li>Workplace boredom as a wellbeing risk factor: moderate</li>
                  <li>Application to Level 1 IT downtime: evidence-aligned; indirect</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1a2e4a]">5.2 Sustained readiness without recovery</h3>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  Interrupt-driven low-demand monitoring occupies a state between active task engagement and genuine recovery. It does not require continuous perceptual scanning, but it does require maintaining availability, periodically checking channels, and preserving response readiness.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  This may reduce the restorative value of downtime when no defined secondary task or recovery boundary exists.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82] font-semibold">
                  Evidence classification:
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5d6f82]">
                  <li>Sustained-attention analogy: indirect</li>
                  <li>Work-design relevance: evidence-aligned</li>
                  <li>Direct IT support evidence: limited</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1a2e4a]">5.3 External structure and executive control</h3>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  External structure includes timers, short task blocks, visible progress logs, constrained task menus, and scheduled check-ins. These controls are not ADHD-specific. They are general cognitive-underload controls useful across workers in low-demand, ambiguous, or interruptible environments.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  Where ADHD traits or diagnosed ADHD are present, the utility of such external structure may be increased because ADHD is associated with difficulty sustaining attention, organising tasks, and maintaining focus on boring or tedious work.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">
                  Better Health Victoria describes adult ADHD as involving difficulty paying attention, controlling impulsive behaviours, and keeping thoughts on track. Healthdirect notes that adults with ADHD may struggle to focus on tasks that are boring or tedious.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82] font-semibold">
                  Evidence classification:
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5d6f82]">
                  <li>External structure for general underload: expert-derived; evidence-aligned</li>
                  <li>ADHD as possible moderator: emerging to moderate support</li>
                  <li>Individual clinical inference: requires clinical context</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a2e4a]">6. Confounding and Moderating Variables</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-[#5d6f82]">
                <thead>
                  <tr>
                    <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">Domain</th>
                    <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">Risk-amplifying variables</th>
                    <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">Risk-reducing variables</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">Visual ergonomics</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Glare, small text, high contrast mismatch, uncorrected vision, laptop-only posture</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">External monitor, glare control, corrected vision, brightness adjustment, 20-20-20 breaks</td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">Monitor setup</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Screen too high/low, twisting to view screen, screen too close/far</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Top at/slightly below eye level, centre 15–20° below eye level, arm’s-length distance</td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">Static loading</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Locked knees, fixed stance, prolonged standing, low movement variation</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Posture change, sit-stand alternation, footrest, walking intervals</td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">Lower-limb vascular load</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Hard floor, unsupportive shoes, vascular history, high BMI, long standing duration</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Supportive footwear, anti-fatigue mat where appropriate, ankle pumps, calf raises, walking</td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">Cognitive underload</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">No defined secondary task, ambiguous expectations, no visible progress</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Approved learning menu, scheduled channel checks, status log, short task blocks</td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">Interruptibility</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Deep tasks that are hard to pause, unclear response expectations</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Low-switching-cost tasks, queue-check rhythm, interruption-friendly work design</td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">Executive-function vulnerability</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Low novelty, unstructured downtime, time blindness</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Timers, visible progress, constrained task list, pre-written next actions</td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">Recovery state</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Sleep restriction, dehydration, skipped meals, high stress</td>
                    <td className="border-b border-[#e4ebe8] px-3 py-3">Hydration, meal break, brief movement, screen-free intervals</td>
                  </tr>
                  <tr className="odd:bg-[#fbfcfb] even:bg-white">
                    <td className="px-3 py-3 font-semibold">Environmental context</td>
                    <td className="px-3 py-3">Poor lighting, thermal discomfort, social evaluative pressure</td>
                    <td className="px-3 py-3">Stable lighting, clear manager expectations, acceptable movement norms</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#5d6f82]">
              WorkSafe Queensland specifically advises posture variation with sit-stand desks, notes that bodies are not made to spend long periods in one position, recommends supportive footwear, and advises changing posture every 30 minutes. This is separate from Safe Work Australia’s national guidance against prolonged seated, standing, or static posture.
            </p>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#2a7d8e]">
              <Shield className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-2xl font-semibold">7. Controls and Intervention Framework</h2>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#1a2e4a]">7.1 Guideline-supported controls</h3>

                <div className="mt-4 space-y-4 rounded-3xl border border-[#e4ebe8] bg-[#fbfcfb] p-4">
                  <div>
                    <p className="text-sm font-semibold text-[#1a2e4a]">A. Visual break protocol</p>
                    <p className="mt-2 text-sm leading-7 text-[#5d6f82]">
                      Every 20 minutes of screen exposure, view a distant object approximately 20 feet away for 20 seconds.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#5d6f82] font-semibold">Classification: Guideline-supported.</p>
                    <p className="mt-1 text-sm leading-7 text-[#5d6f82]">
                      Source: American Optometric Association. Limitation: Trial evidence for the rule as an isolated intervention is weaker than the general digital eye strain evidence base.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#1a2e4a]">B. DSE break pattern</p>
                    <p className="mt-2 text-sm leading-7 text-[#5d6f82]">
                      Use short, frequent breaks or task changes rather than infrequent long breaks. HSE gives the example that 5–10 minutes every hour is preferable to 20 minutes every two hours for display-screen equipment work.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#5d6f82] font-semibold">Classification: Guideline-supported.</p>
                    <p className="mt-1 text-sm leading-7 text-[#5d6f82]">
                      Limitation: Exact break timing depends on work type and operational requirements.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#1a2e4a]">C. Monitor setup</p>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5d6f82]">
                      <li>Top of monitor at or slightly below eye level</li>
                      <li>Centre of monitor approximately 15–20 degrees below horizontal eye level</li>
                      <li>Screen directly in front</li>
                      <li>Brightness and contrast adjusted to ambient lighting</li>
                      <li>Separate monitor, keyboard, and mouse when using a laptop for extended work</li>
                    </ul>
                    <p className="mt-2 text-sm leading-7 text-[#5d6f82] font-semibold">Classification: Guideline-supported.</p>
                    <p className="mt-1 text-sm leading-7 text-[#5d6f82]">Sources: OSHA and WorkSafe Queensland.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1a2e4a]">7.2 Evidence-aligned physical controls</h3>
                <div className="mt-4 space-y-4 rounded-3xl border border-[#e4ebe8] bg-[#fbfcfb] p-4">
                  <div>
                    <p className="text-sm font-semibold text-[#1a2e4a]">A. Posture variation</p>
                    <p className="mt-2 text-sm leading-7 text-[#5d6f82]">
                      Avoid prolonged static sitting or standing. Alternate between sitting, standing, and moving.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#5d6f82] font-semibold">Classification: Evidence-aligned and guideline-supported at principle level.</p>
                    <p className="mt-1 text-sm leading-7 text-[#5d6f82]">Source basis: Safe Work Australia and WorkSafe Queensland.</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#1a2e4a]">B. Lower-limb activation</p>
                    <p className="mt-2 text-sm leading-7 text-[#5d6f82]">
                      During standing work, introduce periodic ankle and calf movement:
                    </p>
                    <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-[#dbe3e0] bg-white p-3 text-sm leading-6 text-[#5d6f82]">
10–20 calf raises
20 ankle pumps
30–60 seconds walking where feasible
avoid locked knees
                    </pre>
                    <p className="mt-2 text-sm leading-7 text-[#5d6f82] font-semibold">Classification: Evidence-aligned.</p>
                    <p className="mt-1 text-sm leading-7 text-[#5d6f82]">
                      Evidence note: Mechanistic plausibility is stronger than direct clinical outcome evidence for this exact dose. This should be interpreted as a low-risk movement strategy, not a validated treatment protocol.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a2e4a]">8. Expert-Derived Applied Protocols</h2>

            <div className="mt-6 space-y-6 rounded-3xl border border-[#e4ebe8] bg-[#fbfcfb] p-4">
              <div>
                <p className="text-sm font-semibold text-[#1a2e4a]">8.1 Sit-stand-move cycle</p>
                <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-[#dbe3e0] bg-white p-3 text-sm leading-6 text-[#5d6f82]">
20 minutes seated or supported computer work
8 minutes standing computer work
2 minutes movement
repeat if operationally feasible
                </pre>
                <p className="mt-2 text-sm leading-7 text-[#5d6f82] font-semibold">Classification: Expert-derived protocol.</p>
                <p className="mt-2 text-sm leading-7 text-[#5d6f82]">Rationale: Operationalises the evidence-aligned principle of posture variation and avoidance of prolonged static loading.</p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82] font-semibold">Alternative minimum standard:</p>
                <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-[#dbe3e0] bg-white p-3 text-sm leading-6 text-[#5d6f82]">
change posture at least every 30 minutes
include walking or lower-limb movement at least hourly
avoid extended static standing
                </pre>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#1a2e4a]">8.2 Interrupt-driven monitoring loop</p>
                <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-[#dbe3e0] bg-white p-3 text-sm leading-6 text-[#5d6f82]">
00:00–01:00    Check phone, ticket queue, messages
01:00–02:00    Record availability/status line
02:00–20:00    Low-switching-cost professional-development task
20:00–20:30    Distant visual break
20:30–25:00    Continue task or remain ready
25:00–30:00    Movement block
                </pre>
                <p className="mt-2 text-sm leading-7 text-[#5d6f82] font-semibold">Classification: Expert-derived protocol.</p>
                <p className="mt-2 text-sm leading-7 text-[#5d6f82]">Rationale: Converts unstructured low-demand readiness into intermittent active monitoring while preserving interruptibility.</p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">Example status line:</p>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-[#dbe3e0] bg-white p-3 text-sm leading-6 text-[#5d6f82]">
09:30 — Queue checked; no assigned tickets; available for incoming support.
10:00 — Queue checked; no assigned tickets; completed professional-development task.
                </pre>
                <p className="mt-2 text-sm leading-7 text-[#5d6f82]">Evidence note: This is a work-design heuristic informed by attention and self-regulation principles. It is not a validated vigilance-decrement intervention.</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#1a2e4a]">8.3 Cognitive-underload task structure</p>
                <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-[#dbe3e0] bg-white p-3 text-sm leading-6 text-[#5d6f82]">
10 minutes — learn one concept
10 minutes — apply it in a small exercise
5 minutes — write a summary note
5 minutes — check queue and move
                </pre>
                <p className="mt-2 text-sm leading-7 text-[#5d6f82] font-semibold">Classification: Expert-derived protocol.</p>
                <p className="mt-2 text-sm leading-7 text-[#5d6f82]">Rationale: Creates task variety, visible progress, and interruptible cognitive engagement during low-demand periods.</p>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">Suitable task categories:</p>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-[#dbe3e0] bg-white p-3 text-sm leading-6 text-[#5d6f82]">
Microsoft 365 fundamentals
React component practice
generic ticket-note writing
workplace communication scripts
cyber-safety reading
resume/interview evidence notes
generic troubleshooting drills
                </pre>
                <p className="mt-3 text-sm leading-7 text-[#5d6f82]">ADHD note: External timers, short task blocks, and visible progress logs are general underload controls. They may have additional utility where ADHD traits, time blindness, or executive-function vulnerability are present, but they should not be framed as ADHD-only interventions.</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a2e4a]">9. Consolidated Downtime Control Plan</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#5d6f82]">
              <div>
                <p className="font-semibold">Every 30 minutes</p>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-[#dbe3e0] bg-[#fbfcfb] p-3 text-sm leading-6 text-[#5d6f82]">
1. Check incoming channels.
2. Record availability/status.
3. Complete one short, interruptible professional-development task.
4. Complete one visual break.
5. Change posture or move.
                </pre>
              </div>
              <div>
                <p className="font-semibold">Every hour</p>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-[#dbe3e0] bg-[#fbfcfb] p-3 text-sm leading-6 text-[#5d6f82]">
5–10 minutes total away from fixed screen/posture where feasible
at least one walking or lower-limb activation interval
                </pre>
              </div>
              <div>
                <p className="font-semibold">Every two hours</p>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-[#dbe3e0] bg-[#fbfcfb] p-3 text-sm leading-6 text-[#5d6f82]">
2–5 minutes continuous walking
water refill
screen-free interval
workstation posture check
                </pre>
              </div>
              <div>
                <p className="font-semibold">End of day</p>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-[#dbe3e0] bg-[#fbfcfb] p-3 text-sm leading-6 text-[#5d6f82]">
copy task log
summarise one skill practised
summarise one useful action completed
identify unresolved items, if any
                </pre>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a2e4a]">10. Evidence-Strength Summary</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-[#5d6f82]">
                <thead>
                  <tr>
                    <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">Control</th>
                    <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">Classification</th>
                    <th className="border-b border-[#e4ebe8] px-3 py-3 font-semibold text-[#1a2e4a]">Evidence status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["20-20-20 visual break", "Guideline-supported", "Moderate exposure rationale; limited direct intervention certainty"],
                    ["Monitor positioning", "Guideline-supported", "Moderate"],
                    ["Short frequent display-screen breaks", "Guideline-supported", "Moderate"],
                    ["Avoid prolonged static posture", "Guideline-supported / evidence-aligned", "Moderate to strong; occupational specificity varies"],
                    ["Posture variation every ~30 min", "Guideline-supported by WorkSafe QLD", "Moderate; applied guidance"],
                    ["Lower-limb activation", "Evidence-aligned", "Strong mechanism; limited direct dose-outcome evidence"],
                    ["20/8/2 sit-stand-move cycle", "Expert-derived protocol", "Not independently validated"],
                    ["30-minute monitoring loop", "Expert-derived protocol", "Indirect support only"],
                    ["10/10/5/5 cognitive task structure", "Expert-derived protocol", "Indirect support only"],
                    ["External timers/progress logs", "General underload control", "Evidence-aligned; not ADHD-specific"],
                    ["ADHD-informed scaffolding", "Moderator note", "Emerging to moderate; individual response varies"],
                  ].map(([control, classification, status]) => (
                    <tr key={control} className="odd:bg-[#fbfcfb] even:bg-white">
                      <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">{control}</td>
                      <td className="border-b border-[#e4ebe8] px-3 py-3">{classification}</td>
                      <td className="border-b border-[#e4ebe8] px-3 py-3">{status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#5d6f82] font-semibold">Mechanistic versus outcome evidence note:</p>
            <p className="mt-2 text-sm leading-7 text-[#5d6f82]">
              A control can be mechanistically plausible without having strong direct evidence for clinical outcome improvement at a specified dose. Lower-limb activation during standing is a mechanism-aligned control; it should not be interpreted as proof of quantified symptom reduction in every worker.
            </p>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a2e4a]">11. Limitations</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 text-[#5d6f82]">
              <li>Evidence for display-screen ergonomics and prolonged standing is stronger than evidence for the exact low-volume Level 1 IT support configuration.</li>
              <li>Many prolonged-standing studies involve industrial, retail, manufacturing, or healthcare populations. Transfer to a sit-stand IT workstation is directionally relevant but not magnitude-equivalent.</li>
              <li>Interrupt-driven low-demand monitoring is an applied construct. It is operationally defined here but is not yet a standardised occupational-health diagnostic category.</li>
              <li>The proposed timing structures are applied protocols, not clinical prescriptions.</li>
              <li>External structure should be treated as a general underload-management control, not as an ADHD-exclusive intervention.</li>
              <li>Individual risk depends on baseline fitness, vascular history, body mass, age, sex-related vascular factors, sleep, footwear, flooring, lighting, prior musculoskeletal symptoms, visual correction, and neurodevelopmental profile.</li>
              <li>Persistent visual symptoms, headaches, lower-limb swelling, neurological symptoms, chest pain, marked distress, or functional deterioration warrant medical or occupational-health review.</li>
            </ol>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a2e4a]">12. Revised Practitioner Conclusion</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#5d6f82]">
              <p>
                The primary occupational-health exposure is a combined pattern of display-screen fixation, static postural loading, reduced lower-limb movement, interrupt-driven low-demand monitoring, and cognitive underload.
              </p>
              <p>
                The strongest controls are posture variation, visual breaks, appropriate monitor positioning, and short frequent display-screen breaks. Lower-limb activation is mechanistically justified during standing but should not be over-presented as a quantified clinical intervention.
              </p>
              <p>
                The 30-minute monitoring loop, 20/8/2 sit-stand-move cycle, and 10/10/5/5 cognitive-underload structure are expert-derived applied controls. Their purpose is to translate general ergonomic and occupational-psychology principles into an interruptible Level 1 IT support context while maintaining availability for incoming work.
              </p>
            </div>
            <div className="mt-6 rounded-3xl border border-[#e4ebe8] bg-[#fbfcfb] p-4 text-sm leading-7 text-[#5d6f82]">
              <p className="font-semibold">References</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li><a href="https://www.frontiersin.org/journals/cognition/articles/10.3389/fcogn.2025.1632885/full?utm_source=chatgpt.com" target="_blank" rel="noreferrer" className="text-[#2a7d8e] underline">Frontiers: The vigilance decrement</a></li>
                <li><a href="https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome?utm_source=chatgpt.com" target="_blank" rel="noreferrer" className="text-[#2a7d8e] underline">AOA: Computer vision syndrome</a></li>
                <li><a href="https://www.osha.gov/etools/computer-workstations/components/monitors?utm_source=chatgpt.com" target="_blank" rel="noreferrer" className="text-[#2a7d8e] underline">OSHA monitor guidance</a></li>
                <li><a href="https://www.worksafe.qld.gov.au/safety-and-prevention/hazards/hazardous-manual-tasks/working-with-computers/setting-up-your-workstation" target="_blank" rel="noreferrer" className="text-[#2a7d8e] underline">WorkSafe Queensland workstation setup</a></li>
                <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4591921/?utm_source=chatgpt.com" target="_blank" rel="noreferrer" className="text-[#2a7d8e] underline">PMC health risks of prolonged standing</a></li>
                <li><a href="https://www.safeworkaustralia.gov.au/safety-topic/hazards/sitting-and-standing?utm_source=chatgpt.com" target="_blank" rel="noreferrer" className="text-[#2a7d8e] underline">Safe Work Australia sitting and standing guidance</a></li>
                <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10995674/?utm_source=chatgpt.com" target="_blank" rel="noreferrer" className="text-[#2a7d8e] underline">PMC boredom and engagement at work</a></li>
                <li><a href="https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/attention-deficit-hyperactivity-disorder-adults?utm_source=chatgpt.com" target="_blank" rel="noreferrer" className="text-[#2a7d8e] underline">Better Health Victoria adult ADHD</a></li>
                <li><a href="https://www.hse.gov.uk/msd/dse/work-routine.htm?utm_source=chatgpt.com" target="_blank" rel="noreferrer" className="text-[#2a7d8e] underline">HSE work routine for DSE</a></li>
              </ul>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
