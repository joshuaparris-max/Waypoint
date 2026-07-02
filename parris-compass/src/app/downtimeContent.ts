export const sourceLinks = [
  {
    id: "frontiers",
    label: "Frontiers",
    title: "The vigilance decrement: its first 75 years",
    url: "https://www.frontiersin.org/journals/cognition/articles/10.3389/fcogn.2025.1632885/full",
  },
  {
    id: "aoa",
    label: "American Optometric Association",
    title: "Computer vision syndrome",
    url: "https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome",
  },
  {
    id: "osha",
    label: "OSHA",
    title: "Computer workstations: monitors",
    url: "https://www.osha.gov/etools/computer-workstations/components/monitors",
  },
  {
    id: "worksafe-qld",
    label: "WorkSafe Queensland",
    title: "Setting up your workstation",
    url: "https://www.worksafe.qld.gov.au/safety-and-prevention/hazards/hazardous-manual-tasks/working-with-computers/setting-up-your-workstation",
  },
  {
    id: "standing-review",
    label: "PMC",
    title: "Evidence of health risks associated with prolonged standing",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4591921/",
  },
  {
    id: "safe-work-australia",
    label: "Safe Work Australia",
    title: "Sitting and standing",
    url: "https://www.safeworkaustralia.gov.au/safety-topic/hazards/sitting-and-standing",
  },
  {
    id: "boredom-review",
    label: "PMC",
    title: "Boredom and engagement at work",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10995674/",
  },
  {
    id: "better-health",
    label: "Better Health Channel",
    title: "Attention deficit hyperactivity disorder (ADHD) - adults",
    url: "https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/attention-deficit-hyperactivity-disorder-adults",
  },
  {
    id: "healthdirect",
    label: "healthdirect",
    title: "Attention deficit hyperactivity disorder (ADHD)",
    url: "https://www.healthdirect.gov.au/attention-deficit-disorder-add-or-adhd",
  },
  {
    id: "hse",
    label: "HSE",
    title: "Working safely with display screen equipment",
    url: "https://www.hse.gov.uk/msd/dse/work-routine.htm",
  },
] as const;

export const briefingScope = [
  "Prolonged display-screen work",
  "Use of a sit-stand workstation",
  "Periods of static standing",
  "Low or absent ticket and call volume",
  "Interruptible availability for calls, tickets, messages, or walk-ups",
  "Low task demand combined with a requirement to remain ready",
];

export const evidenceClassifications = [
  {
    classification: "Guideline-supported",
    meaning:
      "Directly supported by occupational, ergonomic, or optometric guidance.",
  },
  {
    classification: "Evidence-aligned",
    meaning:
      "Consistent with research findings or mechanisms, but not directly validated in the exact work context.",
  },
  {
    classification: "Expert-derived protocol",
    meaning:
      "Applied synthesis designed for this work pattern; not an independently validated standard.",
  },
];

export const operationalFeatures = [
  {
    parameter: "Signal source",
    definition:
      "Incoming work is externally triggered by phone call, ticket, message, or walk-up.",
  },
  {
    parameter: "Signal frequency",
    definition:
      "Low or irregular; extended periods may occur with no actionable input.",
  },
  {
    parameter: "Response requirement",
    definition:
      "Availability is preserved so incoming events can be answered inside the normal operational window of the role.",
  },
  {
    parameter: "Attentional demand",
    definition:
      "Continuous perceptual scanning is not required, but periodic channel checking and readiness are required.",
  },
  {
    parameter: "Distinction from active work",
    definition:
      "The worker is not continuously solving tickets or producing assigned outputs.",
  },
  {
    parameter: "Distinction from recovery",
    definition:
      "The worker is not fully off-task or resting, because interruption remains possible and role availability is required.",
  },
];

export const mechanismSections = [
  {
    title: "Display-screen exposure and visual fatigue",
    body: [
      "Prolonged computer use increases sustained accommodation, convergence demand, blink-rate reduction, tear-film instability, and glare sensitivity.",
      "These mechanisms are associated with digital eye strain symptoms such as ocular dryness, blurred vision, eye discomfort, and headache.",
      "The American Optometric Association recommends the 20-20-20 rule: every 20 minutes, view something about 20 feet away for 20 seconds.",
    ],
    evidence: [
      "Screen exposure and digital eye strain: moderate to strong association.",
      "20-20-20 rule: guideline-supported; limited direct intervention certainty.",
    ],
    sourceIds: ["aoa"],
  },
  {
    title: "Monitor geometry and cervical load",
    body: [
      "Monitor position changes visual and neck loading.",
      "OSHA advises placing the top of the monitor at or slightly below eye level, with the center normally 15-20 degrees below horizontal eye level.",
      "WorkSafe Queensland also advises monitor height at eye level or just below, about arm's distance, with brightness, contrast, and font size adjusted to reduce visual fatigue.",
    ],
    evidence: [
      "Monitor-positioning guidance: guideline-supported.",
      "Individual symptom reduction: variable and workstation-specific.",
    ],
    sourceIds: ["osha", "worksafe-qld"],
  },
  {
    title: "Static standing, static loading, and movement variability",
    body: [
      "Static standing is upright posture maintained with limited walking or positional change.",
      "Static loading is sustained muscular activation without enough alternation between contraction and relaxation for the task duration and tissue capacity involved.",
      "Low movement variability means reduced variation in posture, weight shift, joint angle, or muscle recruitment over time.",
      "The risk is not standing alone. The risk is prolonged standing with low movement variability and sustained muscular activation.",
    ],
    evidence: [
      "Avoiding prolonged static posture: moderate to strong principle-level evidence.",
      "Transfer from industrial, retail, and healthcare standing literature to sit-stand IT workstations: directionally sound but magnitude uncertain.",
    ],
    sourceIds: ["standing-review", "safe-work-australia", "worksafe-qld"],
  },
  {
    title: "Lower-limb vascular function",
    body: [
      "Static standing reduces the dynamic contribution of the calf-muscle pump.",
      "Walking, ankle motion, and calf contraction assist venous return.",
      "When standing is prolonged and movement is minimal, venous pooling may increase in the lower limbs, contributing to heaviness, swelling, fatigue, or discomfort.",
    ],
    evidence: [
      "Calf-pump mechanism: strong mechanistic plausibility.",
      "Clinical benefit of exact workplace movement doses: limited to moderate outcome evidence.",
      "Individual prediction requires moderators such as vascular history, footwear, floor surface, baseline symptoms, sleep, and recovery state.",
    ],
    sourceIds: ["standing-review"],
  },
  {
    title: "Cognitive underload and occupational boredom",
    body: [
      "Low ticket or call volume can create cognitive underload.",
      "Occupational boredom is distinct from rest; workplace boredom and engagement have different antecedents and relate differently to wellbeing and organisational outcomes.",
      "A Level 1 support role may plausibly alternate between underload periods and brief demand spikes, but that is an authorial workplace assumption rather than a directly cited role-specific finding.",
    ],
    evidence: [
      "Workplace boredom as a wellbeing risk factor: moderate.",
      "Application to Level 1 IT downtime: evidence-aligned and indirect.",
    ],
    sourceIds: ["boredom-review"],
  },
  {
    title: "Sustained readiness without recovery",
    body: [
      "Interrupt-driven low-demand monitoring sits between active task engagement and genuine recovery.",
      "It does not require continuous signal detection, but it does require availability, periodic channel checking, and response readiness.",
      "It should not be over-equated with classic vigilance decrement; it is better treated as a work-design and self-regulation issue involving underload, ambiguity, and interruptibility.",
    ],
    evidence: [
      "Sustained-attention analogy: indirect.",
      "Work-design relevance: evidence-aligned.",
      "Direct IT support evidence: limited.",
    ],
    sourceIds: ["frontiers"],
  },
  {
    title: "External structure and executive control",
    body: [
      "External structure includes timers, short task blocks, visible progress logs, constrained task menus, and scheduled check-ins.",
      "These controls are general cognitive-underload controls, not ADHD-specific controls.",
      "Where ADHD traits or diagnosed ADHD are present, the utility may be higher because ADHD can involve difficulty sustaining attention, organising tasks, and focusing on boring or tedious work.",
    ],
    evidence: [
      "External structure for general underload: expert-derived and evidence-aligned.",
      "ADHD as possible moderator: emerging to moderate support.",
      "Individual clinical inference requires clinical context.",
    ],
    sourceIds: ["better-health", "healthdirect"],
  },
];

export const moderators = [
  {
    domain: "Visual ergonomics",
    amplifying:
      "Glare, small text, high contrast mismatch, uncorrected vision, laptop-only posture.",
    reducing:
      "External monitor, glare control, corrected vision, brightness adjustment, 20-20-20 breaks.",
  },
  {
    domain: "Monitor setup",
    amplifying:
      "Screen too high or low, twisting to view the screen, screen too close or far.",
    reducing:
      "Top at or slightly below eye level, center 15-20 degrees below eye level, arm's-length distance.",
  },
  {
    domain: "Static loading",
    amplifying:
      "Locked knees, fixed stance, prolonged standing, low movement variation.",
    reducing:
      "Posture change, sit-stand alternation, footrest, walking intervals.",
  },
  {
    domain: "Lower-limb vascular load",
    amplifying:
      "Hard floor, unsupportive shoes, vascular history, high BMI, long standing duration.",
    reducing:
      "Supportive footwear, anti-fatigue mat where appropriate, ankle pumps, calf raises, walking.",
  },
  {
    domain: "Cognitive underload",
    amplifying:
      "No defined secondary task, ambiguous expectations, no visible progress.",
    reducing:
      "Approved learning menu, scheduled channel checks, status log, short task blocks.",
  },
  {
    domain: "Interruptibility",
    amplifying:
      "Deep tasks that are hard to pause, unclear response expectations.",
    reducing:
      "Low-switching-cost tasks, queue-check rhythm, interruption-friendly work design.",
  },
  {
    domain: "Executive-function vulnerability",
    amplifying: "Low novelty, unstructured downtime, time blindness.",
    reducing:
      "Timers, visible progress, constrained task list, pre-written next actions.",
  },
  {
    domain: "Recovery state",
    amplifying: "Sleep restriction, dehydration, skipped meals, high stress.",
    reducing:
      "Hydration, meal break, brief movement, screen-free intervals.",
  },
  {
    domain: "Environmental context",
    amplifying:
      "Poor lighting, thermal discomfort, social evaluative pressure.",
    reducing:
      "Stable lighting, clear manager expectations, acceptable movement norms.",
  },
];

export const guidelineControls = [
  {
    title: "Visual break protocol",
    control:
      "Every 20 minutes of screen exposure, view a distant object about 20 feet away for 20 seconds.",
    classification: "Guideline-supported",
    limitation:
      "Trial evidence for the rule as an isolated intervention is weaker than the general digital eye strain evidence base.",
    sourceIds: ["aoa"],
  },
  {
    title: "DSE break pattern",
    control:
      "Use short, frequent breaks or task changes rather than infrequent long breaks. HSE gives the example that 5-10 minutes every hour is preferable to 20 minutes every two hours.",
    classification: "Guideline-supported",
    limitation:
      "Exact timing depends on work type, operational requirements, and local policy.",
    sourceIds: ["hse"],
  },
  {
    title: "Monitor setup",
    control:
      "Top of monitor at or slightly below eye level; center about 15-20 degrees below horizontal eye level; screen directly in front; brightness and contrast adjusted to ambient lighting; separate monitor, keyboard, and mouse when using a laptop for extended work.",
    classification: "Guideline-supported",
    limitation:
      "Individual symptom reduction is variable and workstation-specific.",
    sourceIds: ["osha", "worksafe-qld"],
  },
];

export const physicalControls = [
  {
    title: "Posture variation",
    control:
      "Avoid prolonged static sitting or standing. Alternate between sitting, standing, and moving.",
    classification: "Evidence-aligned and guideline-supported at principle level",
    note:
      "WorkSafe Queensland specifically advises changing posture every 30 minutes for computer work with sit-stand desks. Safe Work Australia provides national guidance against prolonged seated, standing, or static postures.",
    sourceIds: ["worksafe-qld", "safe-work-australia"],
  },
  {
    title: "Lower-limb activation",
    control:
      "During standing work: 10-20 calf raises, 20 ankle pumps, 30-60 seconds walking where feasible, and avoid locked knees.",
    classification: "Evidence-aligned",
    note:
      "Mechanistic plausibility is stronger than direct clinical outcome evidence for this exact dose. Treat this as a low-risk movement strategy, not a validated treatment protocol.",
    sourceIds: ["standing-review"],
  },
];

export const monitoringLoop = [
  { time: "00:00-01:00", action: "Check phone, ticket queue, and messages." },
  { time: "01:00-02:00", action: "Record availability or status line." },
  {
    time: "02:00-20:00",
    action: "Do a low-switching-cost professional-development task.",
  },
  { time: "20:00-20:30", action: "Take a distant visual break." },
  { time: "20:30-25:00", action: "Continue task or remain ready." },
  { time: "25:00-30:00", action: "Complete a movement block." },
];

export const appliedProtocols = [
  {
    title: "20/8/2 sit-stand-move cycle",
    classification: "Expert-derived protocol",
    steps: [
      "20 minutes seated or supported computer work.",
      "8 minutes standing computer work.",
      "2 minutes movement.",
      "Repeat if operationally feasible.",
    ],
    rationale:
      "Operationalises posture variation and avoidance of prolonged static loading.",
    alternative:
      "Minimum standard: change posture at least every 30 minutes, include walking or lower-limb movement at least hourly, and avoid extended static standing.",
  },
  {
    title: "30-minute monitoring loop",
    classification: "Expert-derived protocol",
    steps: monitoringLoop.map((item) => `${item.time}: ${item.action}`),
    rationale:
      "Converts unstructured low-demand readiness into intermittent active monitoring while preserving interruptibility.",
    alternative:
      "Evidence note: this is a work-design heuristic informed by attention and self-regulation principles, not a validated vigilance-decrement intervention.",
  },
  {
    title: "10/10/5/5 cognitive-underload structure",
    classification: "Expert-derived protocol",
    steps: [
      "10 minutes: learn one concept.",
      "10 minutes: apply it in a small exercise.",
      "5 minutes: write a summary note.",
      "5 minutes: check queue and move.",
    ],
    rationale:
      "Creates task variety, visible progress, and interruptible cognitive engagement during low-demand periods.",
    alternative:
      "ADHD note: timers, short blocks, and progress logs are general underload controls. They may have additional utility where ADHD traits, time blindness, or executive-function vulnerability are present, but they should not be framed as ADHD-only interventions.",
  },
];

export const suitableTaskCategories = [
  "Microsoft 365 fundamentals",
  "React component practice",
  "Generic ticket-note writing",
  "Workplace communication scripts",
  "Cyber-safety reading",
  "Resume/interview evidence notes",
  "Generic troubleshooting drills",
];

export const consolidatedPlan = [
  {
    cadence: "Every 30 minutes",
    steps: [
      "Check incoming channels.",
      "Record availability/status.",
      "Complete one short, interruptible professional-development task.",
      "Complete one visual break.",
      "Change posture or move.",
    ],
  },
  {
    cadence: "Every hour",
    steps: [
      "Take 5-10 minutes total away from fixed screen/posture where feasible.",
      "Complete at least one walking or lower-limb activation interval.",
    ],
  },
  {
    cadence: "Every two hours",
    steps: [
      "Walk continuously for 2-5 minutes.",
      "Refill water.",
      "Take a screen-free interval.",
      "Check workstation posture.",
    ],
  },
  {
    cadence: "End of day",
    steps: [
      "Copy task log.",
      "Summarise one skill practised.",
      "Summarise one useful action completed.",
      "Identify unresolved items, if any.",
    ],
  },
];

export const evidenceStrengthSummary = [
  {
    control: "20-20-20 visual break",
    classification: "Guideline-supported",
    status: "Moderate exposure rationale; limited direct intervention certainty.",
  },
  {
    control: "Monitor positioning",
    classification: "Guideline-supported",
    status: "Moderate.",
  },
  {
    control: "Short frequent display-screen breaks",
    classification: "Guideline-supported",
    status: "Moderate.",
  },
  {
    control: "Avoid prolonged static posture",
    classification: "Guideline-supported / evidence-aligned",
    status: "Moderate to strong; occupational specificity varies.",
  },
  {
    control: "Posture variation every ~30 min",
    classification: "Guideline-supported by WorkSafe Queensland",
    status: "Moderate; applied guidance.",
  },
  {
    control: "Lower-limb activation",
    classification: "Evidence-aligned",
    status: "Strong mechanism; limited direct dose-outcome evidence.",
  },
  {
    control: "20/8/2 sit-stand-move cycle",
    classification: "Expert-derived protocol",
    status: "Not independently validated.",
  },
  {
    control: "30-minute monitoring loop",
    classification: "Expert-derived protocol",
    status: "Indirect support only.",
  },
  {
    control: "10/10/5/5 cognitive task structure",
    classification: "Expert-derived protocol",
    status: "Indirect support only.",
  },
  {
    control: "External timers/progress logs",
    classification: "General underload control",
    status: "Evidence-aligned; not ADHD-specific.",
  },
  {
    control: "ADHD-informed scaffolding",
    classification: "Moderator note",
    status: "Emerging to moderate; individual response varies.",
  },
];

export const limitations = [
  "Evidence for display-screen ergonomics and prolonged standing is stronger than evidence for the exact low-volume Level 1 IT support configuration.",
  "Many prolonged-standing studies involve industrial, retail, manufacturing, or healthcare populations. Transfer to a sit-stand IT workstation is directionally relevant but not magnitude-equivalent.",
  "Interrupt-driven low-demand monitoring is an applied construct. It is operationally defined here but is not yet a standardised occupational-health diagnostic category.",
  "The proposed timing structures are applied protocols, not clinical prescriptions.",
  "External structure should be treated as a general underload-management control, not as an ADHD-exclusive intervention.",
  "Individual risk depends on baseline fitness, vascular history, body mass, age, sex-related vascular factors, sleep, footwear, flooring, lighting, prior musculoskeletal symptoms, visual correction, and neurodevelopmental profile.",
  "Persistent visual symptoms, headaches, lower-limb swelling, neurological symptoms, chest pain, marked distress, or functional deterioration warrant medical or occupational-health review.",
];

export const revisionBasis = [
  "Uniform AOA correction: American Optometric Association.",
  "Separate Safe Work Australia and WorkSafe Queensland citations.",
  "Operationally define interrupt-driven low-demand monitoring with sustained readiness.",
  "Place ADHD-related controls inside general cognitive-underload controls.",
];

export const practitionerConclusion = [
  "The primary occupational-health exposure is a combined pattern of display-screen fixation, static postural loading, reduced lower-limb movement, interrupt-driven low-demand monitoring, and cognitive underload.",
  "The strongest controls are posture variation, visual breaks, appropriate monitor positioning, and short frequent display-screen breaks.",
  "Lower-limb activation is mechanistically justified during standing but should not be over-presented as a quantified clinical intervention.",
  "The 30-minute monitoring loop, 20/8/2 sit-stand-move cycle, and 10/10/5/5 cognitive-underload structure are expert-derived applied controls designed to preserve availability while making downtime structured and restorative where feasible.",
];
