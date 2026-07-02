"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Anchor,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Check,
  CircleCheck,
  ClipboardList,
  Clock,
  CloudFog,
  Compass,
  Copy,
  ExternalLink,
  Eye,
  Flag,
  Footprints,
  HeartPulse,
  House,
  LayoutDashboard,
  Leaf,
  ListChecks,
  Map as MapIcon,
  Monitor,
  Mountain,
  NotebookPen,
  Pause,
  Pencil,
  PersonStanding,
  PhoneCall,
  Play,
  Plus,
  RefreshCcw,
  Route,
  Save,
  Shield,
  Sprout,
  Sun,
  Timer,
  Trash2,
} from "lucide-react";
import ToolPrimers from "../components/ToolPrimers";
import PendingActionTracker from "../components/PendingActionTracker";
import {
  appliedProtocols,
  briefingScope,
  consolidatedPlan,
  evidenceClassifications,
  evidenceStrengthSummary,
  guidelineControls,
  limitations,
  mechanismSections,
  moderators,
  monitoringLoop,
  operationalFeatures,
  physicalControls,
  practitionerConclusion,
  revisionBasis,
  sourceLinks,
  suitableTaskCategories,
} from "./downtimeContent";
import { taskLibrary } from "./data/task-library";

type AppSection = "hub" | "waypoint" | "downtime";
type WaypointView = "home" | "anchor" | "trail";
type AnchorStep = "checkin" | "oneThing" | "protect";
type TimerMode = "work" | "break";
type DidOneThing = "Yes" | "Partly" | "No";
type PaceChoice = "yes" | "pushing" | "drifting";
type TerrainKey = "open" | "rocky" | "exposed" | "foggy";

type NervousOption = {
  label: string;
  tint: string;
  border: string;
  color: string;
};

type TaskEntry = {
  id: number;
  time: string;
  text: string;
};

type DowntimeStatusEntry = {
  id: number;
  time: string;
  text: string;
};

type DowntimeEventType =
  | "postureChange"
  | "taskLogEntry"
  | "breakTaken"
  | "movementCycle"
  | "statusLine"
  | "loopComplete"
  | "learningTask"
  | "ergonomics"
  | "reminder";

type DowntimeEvent = {
  id: number;
  type: DowntimeEventType;
  time: string;
  dateKey: string;
  label: string;
};

type WorkflowStep = {
  id: string;
  label: string;
  description: string;
  duration: number;
  enabled: boolean;
};

type SavedWorkflow = {
  id: number;
  name: string;
  steps: WorkflowStep[];
};

type ReminderKey = "posture" | "visual" | "status" | "movement";

type ReminderSetting = {
  label: string;
  minutes: number;
  enabled: boolean;
  message: string;
};

type MicroTask = {
  id: string;
  category: string;
  title: string;
  description: string;
  minutes: number;
};

type ErgonomicChecklistItem = {
  id: string;
  label: string;
  detail: string;
};

type WellbeingRisk = {
  sleep: number;
  hydration: number;
  eyes: number;
  legs: number;
  stress: number;
  clarity: number;
};

type ExternalAppLink = {
  label: string;
  url: string;
};

const relatedApps: ExternalAppLink[] = [
  { label: "DCSPD App", url: "https://dcspd.vercel.app/" },
  {
    label: "DCS Professional Development",
    url: "https://dcs-professional-development.vercel.app/",
  },
  {
    label: "DCS Companion",
    url: "https://joshuaparris-max.github.io/DCSCompanion",
  },
  { label: "DCS Prep App", url: "https://dcs-prep.vercel.app/" },
  { label: "Josh Hub", url: "https://josh-hub-two.vercel.app/dashboard" },
  {
    label: "JoshDashboard v1",
    url: "https://joshdashboard2-3d63fzekflg2wlakjmrakz.streamlit.app/",
  },
  {
    label: "JoshDashboard v2",
    url: "https://josh-dashboard-black.vercel.app/app/dashboard.html",
  },
  {
    label: "Avance PD",
    url: "https://avance-professional-development.vercel.app/",
  },
  { label: "Avance PD (alt)", url: "https://avance-pd.vercel.app/" },
];

type DaySnapshot = {
  id: number;
  dateLabel: string;
  anchor: AnchorData;
  hub: HubState;
  trail: TrailToday;
  trailHistory: TrailEntry[];
  statusLog: DowntimeStatusEntry[];
  events: DowntimeEvent[];
  workflowSteps?: WorkflowStep[];
  savedWorkflows?: SavedWorkflow[];
  reminders?: Record<ReminderKey, ReminderSetting>;
  completedErgonomics?: string[];
  wellbeingRisk?: WellbeingRisk;
};

type EndOfDay = {
  didOneThing: DidOneThing;
  wentWell: string;
  leaveBehind: string;
};

type AnchorData = {
  locked: boolean;
  nervous?: string;
  oneThing: string;
  protect: string;
  taskLog: TaskEntry[];
  end?: EndOfDay;
};

type TimerState = {
  mode: TimerMode;
  running: boolean;
  secondsLeft: number;
  workMinutes: number;
  breakMinutes: number;
};

type TerrainOption = {
  key: TerrainKey;
  label: string;
  description: string;
  suggestion: string;
  accent: string;
  Icon: LucideIcon;
};

type Examen = {
  alive: string;
  drained: string;
  carry: string;
};

type TrailToday = {
  terrain?: TerrainKey;
  pace?: PaceChoice;
  examen?: Examen;
};

type TrailEntry = {
  id: string;
  dateLabel: string;
  terrain: TerrainKey;
  word: string;
  examen: Examen;
};

type HubState = {
  capacity: "Light" | "Steady" | "Full";
  growthFocus: string;
  wellbeingGuardrail: string;
  learningMove: string;
  connectionMove: string;
};

type HubNextMove = {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  Icon: LucideIcon;
  onSelect: () => void;
};

const nervousOptions: NervousOption[] = [
  {
    label: "Flooded",
    tint: "#fff1f0",
    border: "#e7b5b0",
    color: "#9d3732",
  },
  {
    label: "Tense",
    tint: "#fff5ed",
    border: "#edc1a7",
    color: "#b45f2f",
  },
  {
    label: "Okay",
    tint: "#fff9e8",
    border: "#ead79e",
    color: "#8a6b24",
  },
  {
    label: "Settled",
    tint: "#edf8fa",
    border: "#a9d7de",
    color: "#2a7d8e",
  },
  {
    label: "Grounded",
    tint: "#eff8f2",
    border: "#a8d5b8",
    color: "#2f7a50",
  },
];

const terrainMap: Record<TerrainKey, TerrainOption> = {
  open: {
    key: "open",
    label: "Open ground",
    description: "Clear, energy good, ready to move.",
    suggestion: "Use the open space for one meaningful move.",
    accent: "#2a7d8e",
    Icon: Sun,
  },
  rocky: {
    key: "rocky",
    label: "Rocky",
    description: "Manageable, but needs care and attention.",
    suggestion: "Move deliberately. Leave room for uneven footing.",
    accent: "#e07b39",
    Icon: Mountain,
  },
  exposed: {
    key: "exposed",
    label: "Exposed",
    description: "Difficult conditions, just keep walking.",
    suggestion: "Reduce the load. Keep only what protects the next step.",
    accent: "#9d5338",
    Icon: Shield,
  },
  foggy: {
    key: "foggy",
    label: "Foggy",
    description: "Low visibility, uncertain, one step at a time.",
    suggestion: "You don't need to see far. Just the next step.",
    accent: "#5f748d",
    Icon: CloudFog,
  },
};

const terrainOptions = Object.values(terrainMap);

const didOneThingCopy: Record<DidOneThing, string> = {
  Yes: "Let that be enough for today.",
  Partly: "Partial progress still belongs to the day.",
  No: "Some days ask more than they give. Note it without a verdict.",
};

const paceCopy: Record<PaceChoice, string> = {
  yes: "",
  pushing: "Put one thing down before you take on the next.",
  drifting: "Choose the next small visible step.",
};

const sampleTrailHistory: TrailEntry[] = [
  {
    id: "sample-1",
    dateLabel: "Earlier this week",
    terrain: "rocky",
    word: "patience",
    examen: {
      alive: "A clear conversation that made the next decision simpler.",
      drained: "Too many open loops competing for attention.",
      carry: "Patience with the work that needs more than one pass.",
    },
  },
  {
    id: "sample-2",
    dateLabel: "Last waypoint",
    terrain: "foggy",
    word: "clarity",
    examen: {
      alive: "Solving one stubborn thing instead of scattering energy.",
      drained: "Starting before the shape of the day was visible.",
      carry: "Clarity comes after movement, not always before it.",
    },
  },
  {
    id: "sample-3",
    dateLabel: "A few days back",
    terrain: "open",
    word: "steady",
    examen: {
      alive: "An hour of work with no switching.",
      drained: "Trying to hold every detail in mind at once.",
      carry: "A steadier morning rhythm.",
    },
  },
];

const initialAnchor: AnchorData = {
  locked: false,
  oneThing: "",
  protect: "",
  taskLog: [],
};

const initialTimer: TimerState = {
  mode: "work",
  running: false,
  secondsLeft: 25 * 60,
  workMinutes: 25,
  breakMinutes: 5,
};

const downtimeLoopSteps = [
  {
    id: "channels",
    label: "Check channels",
    detail: "Phone, ticket queue, messages, and walk-ups.",
    Icon: PhoneCall,
  },
  {
    id: "status",
    label: "Record status",
    detail: "Leave a brief availability or progress line.",
    Icon: ClipboardList,
  },
  {
    id: "task",
    label: "Short task",
    detail: "Use a low-switching-cost learning or admin task.",
    Icon: BookOpen,
  },
  {
    id: "visual",
    label: "Visual break",
    detail: "Look about 20 feet away for 20 seconds.",
    Icon: Eye,
  },
  {
    id: "move",
    label: "Move",
    detail: "Change posture, walk, ankle pump, or calf raise.",
    Icon: Footprints,
  },
] as const;

const defaultWorkflowSteps: WorkflowStep[] = [
  {
    id: "channels",
    label: "Check channels",
    description: "Phone, tickets, messages, and walk-ups.",
    duration: 1,
    enabled: true,
  },
  {
    id: "status",
    label: "Record status",
    description: "Write one clear availability line.",
    duration: 1,
    enabled: true,
  },
  {
    id: "task",
    label: "Low-switching task",
    description: "Professional development or light admin.",
    duration: 18,
    enabled: true,
  },
  {
    id: "visual",
    label: "Visual break",
    description: "Look away from the display.",
    duration: 1,
    enabled: true,
  },
  {
    id: "movement",
    label: "Movement block",
    description: "Walk, ankle pump, calf raise, or posture change.",
    duration: 5,
    enabled: true,
  },
];

const defaultReminderSettings: Record<ReminderKey, ReminderSetting> = {
  posture: {
    label: "Posture change",
    minutes: 30,
    enabled: true,
    message: "Change position: sit, stand, shift weight, or walk briefly.",
  },
  visual: {
    label: "Visual break",
    minutes: 20,
    enabled: true,
    message: "Look about 20 feet away for 20 seconds.",
  },
  status: {
    label: "Status note",
    minutes: 30,
    enabled: false,
    message: "Check channels and record an availability line.",
  },
  movement: {
    label: "Walking interval",
    minutes: 60,
    enabled: true,
    message: "Do a lower-limb movement interval or short walk.",
  },
};

const statusTemplates = [
  "Queue checked; no assigned tickets; available for incoming support.",
  "Queue checked; no urgent items; continuing approved learning task.",
  "Ticket completed; notes updated; available for next support request.",
  "Messages checked; waiting on user response; remaining available.",
  "Downtime loop completed; posture changed and visual break taken.",
];

const microTasks: MicroTask[] = taskLibrary;

const ergonomicChecklist: ErgonomicChecklistItem[] = [
  {
    id: "monitor-height",
    label: "Monitor height",
    detail: "Top of monitor at or slightly below eye level.",
  },
  {
    id: "screen-distance",
    label: "Screen distance",
    detail: "Screen about arm's length away and directly in front.",
  },
  {
    id: "lighting",
    label: "Lighting and glare",
    detail: "Brightness, contrast, and ambient light are comfortable.",
  },
  {
    id: "posture-variation",
    label: "Posture variation",
    detail: "Change posture about every 30 minutes where feasible.",
  },
  {
    id: "footwear",
    label: "Footwear and floor",
    detail: "Supportive shoes and anti-fatigue mat where appropriate.",
  },
  {
    id: "laptop-setup",
    label: "Laptop setup",
    detail: "Use separate monitor, keyboard, and mouse for extended work.",
  },
];

const defaultWellbeingRisk: WellbeingRisk = {
  sleep: 3,
  hydration: 3,
  eyes: 2,
  legs: 2,
  stress: 3,
  clarity: 3,
};

export default function Home() {
  const [section, setSection] = useState<AppSection>("hub");
  const [waypointView, setWaypointView] = useState<WaypointView>("home");
  const [hub, setHub] = useLocalStorageState<HubState>("waypoint:hub", {
    capacity: "Steady",
    growthFocus: "",
    wellbeingGuardrail: "",
    learningMove: "",
    connectionMove: "",
  });
  const [anchor, setAnchor] =
    useLocalStorageState<AnchorData>("waypoint:anchor", initialAnchor);
  const [trail, setTrail] = useLocalStorageState<TrailToday>(
    "waypoint:trail",
    {},
  );
  const [trailHistory, setTrailHistory] = useLocalStorageState<TrailEntry[]>(
    "waypoint:trail-history",
    sampleTrailHistory,
  );

  function openWaypoint(view: WaypointView) {
    setSection("waypoint");
    setWaypointView(view);
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-[#1a2e4a]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <AppHeader
          section={section}
          setSection={setSection}
          setWaypointView={setWaypointView}
        />

        <div className="flex-1">
          {section === "hub" ? (
            <HubSection
              hub={hub}
              setHub={setHub}
              anchor={anchor}
              trail={trail}
              openWaypoint={openWaypoint}
              openDowntime={() => setSection("downtime")}
            />
          ) : section === "waypoint" ? (
            <WaypointSection
              view={waypointView}
              setView={setWaypointView}
              anchor={anchor}
              setAnchor={setAnchor}
              trail={trail}
              setTrail={setTrail}
              trailHistory={trailHistory}
              setTrailHistory={setTrailHistory}
            />
          ) : (
            <DowntimeSection
              hub={hub}
              setHub={setHub}
              anchor={anchor}
              setAnchor={setAnchor}
              trail={trail}
              setTrail={setTrail}
              trailHistory={trailHistory}
              setTrailHistory={setTrailHistory}
            />
          )}
        </div>
      </div>

      {section === "waypoint" ? (
        <WaypointBottomNav view={waypointView} setView={setWaypointView} />
      ) : null}
    </main>
  );
}

function AppHeader({
  section,
  setSection,
  setWaypointView,
}: {
  section: AppSection;
  setSection: (section: AppSection) => void;
  setWaypointView: (view: WaypointView) => void;
}) {
  function chooseSection(next: AppSection) {
    setSection(next);
    if (next === "waypoint") {
      setWaypointView("home");
    }
  }

  return (
    <header className="mb-5 flex flex-col gap-4 border-b border-[#dbe3e0] pb-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2a7d8e]">
          Professional Growth & Wellbeing Hub
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#1a2e4a] md:text-4xl">
          Waypoint
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-1 rounded-lg border border-[#dbe3e0] bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => chooseSection("hub")}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
            section === "hub"
              ? "bg-[#1a2e4a] text-white"
              : "text-[#38506b] hover:bg-[#eef4f3]"
          }`}
        >
          <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
          Growth Hub
        </button>
        <button
          type="button"
          onClick={() => chooseSection("downtime")}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
            section === "downtime"
              ? "bg-[#1a2e4a] text-white"
              : "text-[#38506b] hover:bg-[#eef4f3]"
          }`}
        >
          <Activity className="h-4 w-4" aria-hidden="true" />
          Downtime
        </button>
        <button
          type="button"
          onClick={() => chooseSection("waypoint")}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
            section === "waypoint"
              ? "bg-[#1a2e4a] text-white"
              : "text-[#38506b] hover:bg-[#eef4f3]"
          }`}
        >
          <Compass className="h-4 w-4" aria-hidden="true" />
          Waypoint
        </button>
      </div>
    </header>
  );
}

function HubSection({
  hub,
  setHub,
  anchor,
  trail,
  openWaypoint,
  openDowntime,
}: {
  hub: HubState;
  setHub: (hub: HubState) => void;
  anchor: AnchorData;
  trail: TrailToday;
  openWaypoint: (view: WaypointView) => void;
  openDowntime: () => void;
}) {
  const terrain = trail.terrain ? terrainMap[trail.terrain] : null;
  const nervous = anchor.nervous
    ? nervousOptions.find((option) => option.label === anchor.nervous)
    : null;
  const focusHubField = (id: string) => {
    const field = document.getElementById(id);
    if (field instanceof HTMLTextAreaElement) {
      field.focus();
    }
  };
  const nextMove: HubNextMove = !anchor.locked
    ? {
        eyebrow: "Start here",
        title: "Set today's anchor",
        text: "Name the one meaningful thing and the boundary that protects the day before opening more loops.",
        cta: "Set anchor",
        Icon: Anchor,
        onSelect: () => openWaypoint("anchor"),
      }
    : !trail.terrain
      ? {
          eyebrow: "Next step",
          title: "Mark the terrain",
          text: "Choose how the day feels so the rest of Waypoint can frame pace, load, and reflection around it.",
          cta: "Open trail",
          Icon: MapIcon,
          onSelect: () => openWaypoint("trail"),
        }
      : !hub.growthFocus.trim()
        ? {
            eyebrow: "Make it useful",
            title: "Choose one growth focus",
            text: "Give the day a skill edge: one craft, support, communication, or troubleshooting move worth practising.",
            cta: "Add growth focus",
            Icon: Sprout,
            onSelect: () => focusHubField("hub-growth-focus"),
          }
        : !hub.wellbeingGuardrail.trim()
          ? {
              eyebrow: "Protect capacity",
              title: "Set a guardrail",
              text: "Define the constraint that keeps the work sustainable before the day starts collecting interruptions.",
              cta: "Add guardrail",
              Icon: Shield,
              onSelect: () => focusHubField("hub-wellbeing-guardrail"),
            }
          : !hub.learningMove.trim()
            ? {
                eyebrow: "Use quiet time",
                title: "Pick a learning move",
                text: "Choose one small, interruptible learning rep so downtime has a productive default.",
                cta: "Add learning move",
                Icon: BookOpen,
                onSelect: () => focusHubField("hub-learning-move"),
              }
            : {
                eyebrow: "Ready to run",
                title: "Start the downtime loop",
                text: "You have enough context for the day. Run the readiness loop to keep availability, movement, and evidence visible.",
                cta: "Open controls",
                Icon: Activity,
                onSelect: openDowntime,
              };

  function updateHub(field: keyof HubState, value: string) {
    setHub({ ...hub, [field]: value });
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-[#edf8fa] p-2 text-[#2a7d8e]">
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Professional Growth & Wellbeing Hub
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5d6f82]">
                Keep the work meaningful, sustainable, and specific enough to
                act on today.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {(["Light", "Steady", "Full"] as HubState["capacity"][]).map(
              (capacity) => (
                <button
                  key={capacity}
                  type="button"
                  onClick={() => setHub({ ...hub, capacity })}
                  className={`rounded-lg border p-4 text-left transition ${
                    hub.capacity === capacity
                      ? "border-[#2a7d8e] bg-[#edf8fa]"
                      : "border-[#dbe3e0] bg-[#fbfcfb] hover:border-[#9fcbd2]"
                  }`}
                >
                  <p className="text-sm font-semibold">{capacity}</p>
                  <p className="mt-1 text-xs leading-5 text-[#607286]">
                    {capacity === "Light"
                      ? "Protect margin."
                      : capacity === "Steady"
                        ? "Move with rhythm."
                        : "Choose the load carefully."}
                  </p>
                </button>
              ),
            )}
          </div>
        </div>

        <div className="rounded-lg border border-[#dbe3e0] bg-[#1a2e4a] p-5 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white/10 p-2">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold">Today at a glance</h2>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openWaypoint("anchor")}
              className="rounded-lg border border-white/15 bg-white/[0.08] p-3 text-left hover:bg-white/[0.12]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                Anchor
              </p>
              <p className="mt-2 text-sm font-semibold">
                {anchor.locked ? anchor.oneThing : "Not set"}
              </p>
              {nervous ? (
                <span
                  className="mt-3 inline-flex rounded-md px-2 py-1 text-xs font-semibold"
                  style={{ backgroundColor: nervous.tint, color: nervous.color }}
                >
                  {nervous.label}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => openWaypoint("trail")}
              className="rounded-lg border border-white/15 bg-white/[0.08] p-3 text-left hover:bg-white/[0.12]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                Trail
              </p>
              <p className="mt-2 text-sm font-semibold">
                {terrain ? terrain.label : "No terrain"}
              </p>
              {terrain ? (
                <p className="mt-3 text-xs leading-5 text-white/70">
                  {terrain.suggestion}
                </p>
              ) : null}
            </button>
          </div>
          <div className="mt-4 rounded-lg border border-white/15 bg-white/[0.08] p-4 text-sm text-white/90">
            <p className="font-semibold text-white">Occupational health briefing</p>
            <p className="mt-2 text-white/80">
              View the full Level 1 IT downtime and ergonomic briefing.
            </p>
            <Link
              href="/briefing"
              className="mt-4 inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#1a2e4a] transition hover:bg-[#f0f5f4]"
            >
              Open briefing
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-[#edf8fa] p-2 text-[#2a7d8e]">
            <ExternalLink className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2a7d8e]">
              Connected apps
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              Explore related professional development tools
            </h2>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedApps.map((app) => (
            <a
              key={app.url}
              href={app.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[#dbe3e0] bg-[#f8fbfa] p-4 text-sm text-[#1a2e4a] transition hover:border-[#9fcbd2] hover:bg-[#eef7f4]"
            >
              <p className="font-semibold">{app.label}</p>
              <p className="mt-2 text-xs text-[#607286] break-words">
                {app.url}
              </p>
            </a>
          ))}
        </div>
      </div>

      <NextMoveCard move={nextMove} />

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.6fr]">
        <ToolPrimers />
        <PendingActionTracker />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <HubPrompt
          id="hub-growth-focus"
          icon={Sprout}
          title="Growth focus"
          value={hub.growthFocus}
          placeholder="A skill, decision, or craft edge to work on"
          helper="Example: practise concise ticket notes, review one M365 admin concept, or rehearse a support handoff."
          onChange={(value) => updateHub("growthFocus", value)}
        />
        <HubPrompt
          id="hub-wellbeing-guardrail"
          icon={Shield}
          title="Wellbeing guardrail"
          value={hub.wellbeingGuardrail}
          placeholder="A boundary, recovery move, or constraint to honour"
          helper="Example: take lunch away from the screen, switch posture every 30 minutes, or keep one buffer block."
          onChange={(value) => updateHub("wellbeingGuardrail", value)}
        />
        <HubPrompt
          id="hub-learning-move"
          icon={BookOpen}
          title="Learning move"
          value={hub.learningMove}
          placeholder="One article, practice rep, course note, or question"
          helper="Example: read one vendor article and write one practical takeaway."
          onChange={(value) => updateHub("learningMove", value)}
        />
        <HubPrompt
          id="hub-connection-move"
          icon={Route}
          title="Connection move"
          value={hub.connectionMove}
          placeholder="One person, conversation, or repair worth making"
          helper="Example: ask one clarifying question, close a loop, or send a short update."
          onChange={(value) => updateHub("connectionMove", value)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#2a7d8e]">
                Downtime Controls
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                Level 1 IT readiness plan
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#607286]">
                A practical 30-minute loop for low-demand, interruptible support
                time: channel check, status line, learning task, visual break,
                and movement.
              </p>
            </div>
            <button
              type="button"
              onClick={openDowntime}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#243f63]"
            >
              <Activity className="h-4 w-4" aria-hidden="true" />
              Open controls
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-[#edf8fa] p-2 text-[#2a7d8e]">
              <Monitor className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2a7d8e]">
                Strongest controls
              </p>
              <p className="mt-1 text-sm leading-6 text-[#607286]">
                Posture variation, visual breaks, appropriate monitor position,
                and short frequent display-screen breaks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#2a7d8e]">Waypoint</p>
            <h2 className="mt-1 text-xl font-semibold">
              Daily grounding, focus, and reflection
            </h2>
          </div>
          <button
            type="button"
            onClick={() => openWaypoint("home")}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#e07b39] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#c9672e]"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Open Waypoint
          </button>
        </div>
      </div>
    </section>
  );
}

function NextMoveCard({ move }: { move: HubNextMove }) {
  const Icon = move.Icon;

  return (
    <div
      className="rounded-lg border border-[#a9d7de] bg-[#edf8fa] p-5 shadow-sm"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-white p-2 text-[#2a7d8e] shadow-sm">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a7d8e]">
              {move.eyebrow}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#1a2e4a]">
              {move.title}
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[#607286]">
              {move.text}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={move.onSelect}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2a7d8e] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#246b79]"
        >
          <Route className="h-4 w-4" aria-hidden="true" />
          {move.cta}
        </button>
      </div>
    </div>
  );
}

function HubPrompt({
  id,
  icon: Icon,
  title,
  value,
  placeholder,
  helper,
  onChange,
}: {
  id?: string;
  icon: LucideIcon;
  title: string;
  value: string;
  placeholder: string;
  helper: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-lg border border-[#dbe3e0] bg-white p-4 shadow-sm">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-[#2a7d8e]" aria-hidden="true" />
        {title}
      </span>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-3 w-full resize-none rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-[#8a9aaa] focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
      />
      <span className="mt-2 block text-xs leading-5 text-[#607286]">
        {helper}
      </span>
    </label>
  );
}

function DowntimeSection({
  hub,
  setHub,
  anchor,
  setAnchor,
  trail,
  setTrail,
  trailHistory,
  setTrailHistory,
}: {
  hub: HubState;
  setHub: Dispatch<SetStateAction<HubState>>;
  anchor: AnchorData;
  setAnchor: Dispatch<SetStateAction<AnchorData>>;
  trail: TrailToday;
  setTrail: Dispatch<SetStateAction<TrailToday>>;
  trailHistory: TrailEntry[];
  setTrailHistory: Dispatch<SetStateAction<TrailEntry[]>>;
}) {
  const [statusLog, setStatusLog] = useLocalStorageState<
    DowntimeStatusEntry[]
  >("waypoint:downtime-status-log", []);
  const [events, setEvents] = useLocalStorageState<DowntimeEvent[]>(
    "waypoint:downtime-events",
    [],
  );
  const [workflowSteps, setWorkflowSteps] = useLocalStorageState<
    WorkflowStep[]
  >("waypoint:downtime-workflow", defaultWorkflowSteps);
  const [savedWorkflows, setSavedWorkflows] = useLocalStorageState<
    SavedWorkflow[]
  >("waypoint:saved-workflows", []);
  const [reminders, setReminders] = useLocalStorageState<
    Record<ReminderKey, ReminderSetting>
  >("waypoint:reminders", defaultReminderSettings);
  const [completedErgonomics, setCompletedErgonomics] = useLocalStorageState<
    string[]
  >("waypoint:ergonomics-checklist", []);
  const [wellbeingRisk, setWellbeingRisk] =
    useLocalStorageState<WellbeingRisk>(
      "waypoint:wellbeing-risk",
      defaultWellbeingRisk,
    );
  const [dayHistory, setDayHistory] = useLocalStorageState<DaySnapshot[]>(
    "waypoint:day-history",
    [],
  );

  function logEvent(type: DowntimeEventType, label: string) {
    const now = new Date();
    setEvents((current) => [
      {
        id: now.getTime(),
        type,
        time: formatTimeOfDay(now),
        dateKey: formatDateKey(now),
        label,
      },
      ...current,
    ]);
  }

  return (
    <section className="space-y-5">
      <SectionHeading
        icon={Activity}
        label="Downtime Controls"
        title="Level 1 IT readiness plan"
        text="A practitioner briefing and usable work loop for display-screen exposure, sit-stand posture variation, static standing, and interrupt-driven low-demand monitoring."
      />

      <div className="rounded-lg border border-[#e7c7bc] bg-[#fff7f2] p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-white p-2 text-[#9d5338]">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#9d5338]">
              Applied occupational-health analysis, not a diagnosis
            </p>
            <p className="mt-1 text-sm leading-6 text-[#5d6f82]">
              Use this as a work-design and self-management aid. Persistent
              visual symptoms, headaches, lower-limb swelling, neurological
              symptoms, chest pain, marked distress, or functional deterioration
              warrant medical or occupational-health review.
            </p>
            <Link
              href="/downtime/builder"
              className="mt-4 inline-flex items-center rounded-md bg-[#1a2e4a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243f63]"
            >
              Open standalone workflow builder
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <DowntimeLoopPlanner
          workflowSteps={workflowSteps}
          setWorkflowSteps={setWorkflowSteps}
          savedWorkflows={savedWorkflows}
          setSavedWorkflows={setSavedWorkflows}
          statusLog={statusLog}
          setStatusLog={setStatusLog}
          logEvent={logEvent}
        />
        <DowntimePlanCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1fr]">
        <SmartReminderSystem
          reminders={reminders}
          setReminders={setReminders}
          logEvent={logEvent}
        />
        <DailyRhythmDashboard events={events} statusLog={statusLog} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <TaskMicrolearningLibrary setAnchor={setAnchor} logEvent={logEvent} />
        <InterruptFriendlyTaskBoard
          setAnchor={setAnchor}
          logEvent={logEvent}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1fr]">
        <ErgonomicsChecklist
          completed={completedErgonomics}
          setCompleted={setCompletedErgonomics}
          logEvent={logEvent}
        />
        <LearningQuestlines setAnchor={setAnchor} logEvent={logEvent} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1fr]">
        <WellbeingCoach
          anchor={anchor}
          trail={trail}
          hub={hub}
          statusLog={statusLog}
          events={events}
          wellbeingRisk={wellbeingRisk}
          setWellbeingRisk={setWellbeingRisk}
        />
        <ReportAndSharingPanel
          anchor={anchor}
          hub={hub}
          trail={trail}
          statusLog={statusLog}
          events={events}
          ergonomicsDone={completedErgonomics.length}
        />
      </div>

      <LocalSaveHistory
        hub={hub}
        setHub={setHub}
        anchor={anchor}
        setAnchor={setAnchor}
        trail={trail}
        setTrail={setTrail}
        trailHistory={trailHistory}
        setTrailHistory={setTrailHistory}
        statusLog={statusLog}
        setStatusLog={setStatusLog}
        events={events}
        setEvents={setEvents}
        workflowSteps={workflowSteps}
        setWorkflowSteps={setWorkflowSteps}
        savedWorkflows={savedWorkflows}
        setSavedWorkflows={setSavedWorkflows}
        reminders={reminders}
        setReminders={setReminders}
        completedErgonomics={completedErgonomics}
        setCompletedErgonomics={setCompletedErgonomics}
        wellbeingRisk={wellbeingRisk}
        setWellbeingRisk={setWellbeingRisk}
        dayHistory={dayHistory}
        setDayHistory={setDayHistory}
      />

      <details className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
        <summary className="cursor-pointer text-lg font-semibold text-[#1a2e4a]">
          Briefing details and evidence library
        </summary>
        <p className="mt-2 text-sm leading-6 text-[#607286]">
          The daily controls above stay visible first. Expand this section when
          you need the full practitioner rationale, evidence strength, and
          source library.
        </p>
        <div className="mt-5 space-y-5">
          <AppliedProtocolCards />

          <div className="grid gap-4 lg:grid-cols-2">
            <ControlsPanel
              icon={Monitor}
              title="Guideline-supported controls"
              controls={guidelineControls}
            />
            <ControlsPanel
              icon={PersonStanding}
              title="Evidence-aligned physical controls"
              controls={physicalControls}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.8fr_1fr]">
            <BriefingScopeCard />
            <OperationalDefinitionCard />
          </div>

          <EvidenceClassificationCard />
          <MechanismGrid />
          <ModeratorTable />
          <EvidenceSummaryTable />

          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <LimitationsCard />
            <PractitionerConclusionCard />
          </div>

          <EvidenceReferenceHub />
        </div>
      </details>
    </section>
  );
}

function DowntimeLoopPlanner({
  workflowSteps,
  setWorkflowSteps,
  savedWorkflows,
  setSavedWorkflows,
  statusLog,
  setStatusLog,
  logEvent,
}: {
  workflowSteps: WorkflowStep[];
  setWorkflowSteps: Dispatch<SetStateAction<WorkflowStep[]>>;
  savedWorkflows: SavedWorkflow[];
  setSavedWorkflows: Dispatch<SetStateAction<SavedWorkflow[]>>;
  statusLog: DowntimeStatusEntry[];
  setStatusLog: Dispatch<SetStateAction<DowntimeStatusEntry[]>>;
  logEvent: (type: DowntimeEventType, label: string) => void;
}) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [statusText, setStatusText] = useState(
    "Queue checked; no assigned tickets; available for incoming support.",
  );
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
  const [editingStatusText, setEditingStatusText] = useState("");
  const [copied, setCopied] = useState(false);
  const [workflowName, setWorkflowName] = useState("Level 1 readiness loop");
  const activeSteps = useMemo(
    () => workflowSteps.filter((step) => step.enabled),
    [workflowSteps],
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = activeSteps[currentStepIndex] || activeSteps[0] || null;
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    (currentStep?.duration || 1) * 60,
  );
  const completion = Math.round(
    (completedSteps.length / downtimeLoopSteps.length) * 100,
  );

  const finishCurrentStep = useCallback((fromTimer = false) => {
    if (!currentStep) {
      return;
    }

    setCompletedSteps((current) =>
      current.includes(currentStep.id) ? current : [...current, currentStep.id],
    );

    const eventType =
      currentStep.id === "visual"
        ? "breakTaken"
        : currentStep.id === "movement"
          ? "movementCycle"
          : currentStep.id === "status"
            ? "statusLine"
            : currentStep.id === "task"
              ? "learningTask"
              : "postureChange";

    logEvent(
      eventType,
      `${currentStep.label}${fromTimer ? " timer completed" : " completed"}`,
    );

    const isLast = currentStepIndex >= activeSteps.length - 1;
    if (isLast) {
      logEvent("loopComplete", "Downtime workflow loop completed");
      setTimerRunning(false);
      setCurrentStepIndex(0);
      setSecondsLeft((activeSteps[0]?.duration || 1) * 60);
      return;
    }

    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    setSecondsLeft((activeSteps[nextIndex]?.duration || 1) * 60);
    setTimerRunning(false);
  }, [activeSteps, currentStep, currentStepIndex, logEvent]);

  useEffect(() => {
    if (!currentStep) {
      setTimerRunning(false);
      setSecondsLeft(0);
      return;
    }

    if (currentStepIndex >= activeSteps.length) {
      setCurrentStepIndex(0);
      return;
    }

    if (!timerRunning) {
      setSecondsLeft(currentStep.duration * 60);
    }
  }, [activeSteps.length, currentStep, currentStepIndex, timerRunning]);

  useEffect(() => {
    if (!timerRunning || !currentStep) {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          finishCurrentStep(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerRunning, currentStep, finishCurrentStep]);

  function toggleStep(stepId: string) {
    setCompletedSteps((current) =>
      current.includes(stepId)
        ? current.filter((id) => id !== stepId)
        : [...current, stepId],
    );
  }

  function updateWorkflowStep(
    stepId: string,
    field: keyof WorkflowStep,
    value: string | number | boolean,
  ) {
    setWorkflowSteps((current) =>
      current.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step,
      ),
    );
  }

  function moveWorkflowStep(stepId: string, direction: -1 | 1) {
    setWorkflowSteps((current) => {
      const index = current.findIndex((step) => step.id === stepId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [step] = next.splice(index, 1);
      next.splice(nextIndex, 0, step);
      return next;
    });
  }

  function saveWorkflow() {
    const name = workflowName.trim() || "Saved readiness loop";
    const saved: SavedWorkflow = {
      id: Date.now(),
      name,
      steps: workflowSteps,
    };
    setSavedWorkflows((current) => [saved, ...current.slice(0, 4)]);
  }

  function loadWorkflow(workflow: SavedWorkflow) {
    setWorkflowSteps(workflow.steps);
    setWorkflowName(workflow.name);
    setCurrentStepIndex(0);
    setTimerRunning(false);
  }

  function resetWorkflowTimer() {
    setTimerRunning(false);
    setCurrentStepIndex(0);
    setSecondsLeft((activeSteps[0]?.duration || 1) * 60);
  }

  function addStatusLine() {
    const text = statusText.trim();
    if (!text) {
      return;
    }

    setStatusLog((current) => [
      { id: Date.now(), time: formatTimeOfDay(new Date()), text },
      ...current,
    ]);
    setCompletedSteps((current) =>
      current.includes("status") ? current : [...current, "status"],
    );
    logEvent("statusLine", text);
  }

  function startEditingStatus(item: DowntimeStatusEntry) {
    setEditingStatusId(item.id);
    setEditingStatusText(item.text);
  }

  function saveEditedStatus() {
    const text = editingStatusText.trim();
    if (!editingStatusId || !text) {
      return;
    }

    setStatusLog((current) =>
      current.map((item) =>
        item.id === editingStatusId ? { ...item, text } : item,
      ),
    );
    setEditingStatusId(null);
    setEditingStatusText("");
  }

  function deleteStatusLine(id: number) {
    setStatusLog((current) => current.filter((item) => item.id !== id));
    if (editingStatusId === id) {
      setEditingStatusId(null);
      setEditingStatusText("");
    }
  }

  async function copyStatusLog() {
    const text = statusLog
      .slice()
      .reverse()
      .map((item) => `${item.time} - ${item.text}`)
      .join("\n");

    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
            <h3 className="text-lg font-semibold">
              30-minute readiness loop
            </h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#607286]">
            Keep availability visible while turning low-demand time into short,
            interruptible work.
          </p>
        </div>
        <span className="rounded-md bg-[#eef4f3] px-3 py-2 text-sm font-semibold text-[#2a7d8e]">
          {completion}% complete
        </span>
      </div>

      <div className="mt-5 h-2 rounded-full bg-[#eef4f3]">
        <div
          className="h-2 rounded-full bg-[#2a7d8e] transition-all"
          style={{ width: `${completion}%` }}
        />
      </div>

      <div className="mt-5 rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#2a7d8e]">
              Workflow builder and timer
            </p>
            <p className="mt-1 text-sm leading-6 text-[#607286]">
              Customise the loop, then run it as an interrupt-friendly timer.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTimerRunning((current) => !current)}
              disabled={!currentStep}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#1a2e4a] text-white transition hover:bg-[#243f63] disabled:cursor-not-allowed disabled:bg-[#9aa8b6]"
              aria-label={timerRunning ? "Pause workflow timer" : "Start workflow timer"}
              title={timerRunning ? "Pause" : "Start"}
            >
              {timerRunning ? (
                <Pause className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={resetWorkflowTimer}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#dbe3e0] text-[#607286] transition hover:bg-white"
              aria-label="Reset workflow timer"
              title="Reset timer"
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-[#dbe3e0] bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
                Current step
              </p>
              <p className="mt-1 text-lg font-semibold">
                {currentStep ? currentStep.label : "No enabled steps"}
              </p>
            </div>
            <p className="font-mono text-3xl font-semibold text-[#2a7d8e]">
              {formatTimer(secondsLeft)}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => finishCurrentStep(false)}
              disabled={!currentStep}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2a7d8e] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#246b79] disabled:cursor-not-allowed disabled:bg-[#9aa8b6]"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Complete step
            </button>
            <button
              type="button"
              onClick={() => {
                const nextIndex =
                  activeSteps.length === 0
                    ? 0
                    : (currentStepIndex + 1) % activeSteps.length;
                setCurrentStepIndex(nextIndex);
                setTimerRunning(false);
                setSecondsLeft((activeSteps[nextIndex]?.duration || 1) * 60);
              }}
              disabled={activeSteps.length < 2}
              className="inline-flex items-center justify-center rounded-md border border-[#dbe3e0] px-3 py-2 text-sm font-semibold text-[#607286] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Skip
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {workflowSteps.map((step, index) => (
            <div
              key={step.id}
              className="grid gap-3 rounded-lg border border-[#e4ebe8] bg-white p-3 md:grid-cols-[auto_1fr_5rem_auto]"
            >
              <input
                type="checkbox"
                checked={step.enabled}
                onChange={(event) =>
                  updateWorkflowStep(step.id, "enabled", event.target.checked)
                }
                aria-label={`Enable ${step.label}`}
                className="mt-3 h-4 w-4 accent-[#2a7d8e]"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={step.label}
                  onChange={(event) =>
                    updateWorkflowStep(step.id, "label", event.target.value)
                  }
                  className="rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-2 text-sm font-semibold outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
                />
                <input
                  value={step.description}
                  onChange={(event) =>
                    updateWorkflowStep(
                      step.id,
                      "description",
                      event.target.value,
                    )
                  }
                  className="rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-2 text-sm outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
                />
              </div>
              <input
                type="number"
                min={1}
                max={60}
                value={step.duration}
                onChange={(event) =>
                  updateWorkflowStep(
                    step.id,
                    "duration",
                    clampNumber(event.target.value, 1, 60),
                  )
                }
                className="rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-2 text-sm outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
                aria-label={`${step.label} duration in minutes`}
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveWorkflowStep(step.id, -1)}
                  disabled={index === 0}
                  className="h-9 rounded-md border border-[#dbe3e0] px-2 text-xs font-semibold text-[#607286] transition hover:bg-[#eef4f3] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => moveWorkflowStep(step.id, 1)}
                  disabled={index === workflowSteps.length - 1}
                  className="h-9 rounded-md border border-[#dbe3e0] px-2 text-xs font-semibold text-[#607286] transition hover:bg-[#eef4f3] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Down
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
          <input
            value={workflowName}
            onChange={(event) => setWorkflowName(event.target.value)}
            className="rounded-md border border-[#dbe3e0] bg-white px-3 py-2 text-sm outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
            aria-label="Workflow name"
          />
          <button
            type="button"
            onClick={saveWorkflow}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#243f63]"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Save loop
          </button>
        </div>

        {savedWorkflows.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {savedWorkflows.map((workflow) => (
              <button
                key={workflow.id}
                type="button"
                onClick={() => loadWorkflow(workflow)}
                className="rounded-md border border-[#dbe3e0] bg-white px-3 py-2 text-xs font-semibold text-[#607286] transition hover:border-[#9fcbd2]"
              >
                {workflow.name}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-4 rounded-lg border border-[#e4ebe8] bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
            Briefing baseline
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {monitoringLoop.map((item) => (
              <p key={item.time} className="text-xs leading-5 text-[#607286]">
                <span className="font-mono font-semibold">{item.time}</span>{" "}
                {item.action}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {downtimeLoopSteps.map((step) => {
          const Icon = step.Icon;
          const isComplete = completedSteps.includes(step.id);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => toggleStep(step.id)}
              className={`rounded-lg border p-4 text-left transition ${
                isComplete
                  ? "border-[#2a7d8e] bg-[#edf8fa]"
                  : "border-[#dbe3e0] bg-[#fbfcfb] hover:border-[#9fcbd2]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                  <Icon className="h-4 w-4 flex-none text-[#2a7d8e]" />
                  {step.label}
                </span>
                {isComplete ? (
                  <Check className="h-4 w-4 flex-none text-[#2a7d8e]" />
                ) : null}
              </div>
              <p className="mt-2 text-xs leading-5 text-[#607286]">
                {step.detail}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[#e4ebe8] pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">Status line</p>
          <button
            type="button"
            onClick={() => setCompletedSteps([])}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#dbe3e0] text-[#607286] transition hover:bg-[#eef4f3]"
            aria-label="Reset readiness loop"
            title="Reset loop"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {statusTemplates.map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => setStatusText(template)}
              className="rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-2 py-1 text-xs font-semibold text-[#607286] transition hover:border-[#9fcbd2]"
            >
              {template}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={statusText}
            onChange={(event) => setStatusText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                addStatusLine();
              }
            }}
            className="min-w-0 flex-1 rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-3 text-sm outline-none placeholder:text-[#8a9aaa] focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
          />
          <button
            type="button"
            onClick={addStatusLine}
            aria-label="Add status line"
            className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#2a7d8e] text-white transition hover:bg-[#246b79]"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#607286]">
          Example: Queue checked; no assigned tickets; completed professional
          development task.
        </p>
      </div>

      <div className="mt-5 rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">Availability log</p>
          <button
            type="button"
            onClick={copyStatusLog}
            disabled={statusLog.length === 0}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#dbe3e0] text-[#607286] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Copy availability log"
            title={copied ? "Copied" : "Copy"}
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
          {statusLog.length === 0 ? (
            <p className="text-sm leading-6 text-[#607286]">
              Status lines will appear here for end-of-day evidence.
            </p>
          ) : (
            statusLog.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 border-t border-[#e4ebe8] pt-2 text-sm first:border-t-0 first:pt-0 sm:grid-cols-[4.75rem_1fr_auto]"
              >
                <span className="font-mono text-xs font-semibold text-[#8a9aaa]">
                  {item.time}
                </span>
                {editingStatusId === item.id ? (
                  <input
                    value={editingStatusText}
                    onChange={(event) => setEditingStatusText(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        saveEditedStatus();
                      }
                      if (event.key === "Escape") {
                        setEditingStatusId(null);
                        setEditingStatusText("");
                      }
                    }}
                    className="min-w-0 rounded-md border border-[#dbe3e0] bg-white px-3 py-2 text-sm outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
                  />
                ) : (
                  <span className="leading-5">{item.text}</span>
                )}
                <div className="flex gap-1">
                  {editingStatusId === item.id ? (
                    <button
                      type="button"
                      onClick={saveEditedStatus}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dbe3e0] bg-white text-[#2a7d8e] transition hover:bg-[#eef4f3]"
                      aria-label="Save status line"
                      title="Save"
                    >
                      <Save className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEditingStatus(item)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dbe3e0] bg-white text-[#607286] transition hover:bg-[#eef4f3]"
                      aria-label="Edit status line"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteStatusLine(item.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#f0d2cb] bg-white text-[#9d5338] transition hover:bg-[#fff7f2]"
                    aria-label="Delete status line"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SmartReminderSystem({
  reminders,
  setReminders,
  logEvent,
}: {
  reminders: Record<ReminderKey, ReminderSetting>;
  setReminders: Dispatch<SetStateAction<Record<ReminderKey, ReminderSetting>>>;
  logEvent: (type: DowntimeEventType, label: string) => void;
}) {
  const [latestReminder, setLatestReminder] = useState<string | null>(null);

  const triggerReminder = useCallback((key: ReminderKey) => {
    const reminder = reminders[key];
    const text = `${reminder.label}: ${reminder.message}`;
    setLatestReminder(text);
    logEvent("reminder", text);
  }, [logEvent, reminders]);

  useEffect(() => {
    const intervals = (Object.keys(reminders) as ReminderKey[])
      .filter((key) => reminders[key].enabled)
      .map((key) =>
        window.setInterval(
          () => triggerReminder(key),
          reminders[key].minutes * 60 * 1000,
        ),
      );

    return () => intervals.forEach((interval) => window.clearInterval(interval));
  }, [reminders, triggerReminder]);

  function updateReminder(
    key: ReminderKey,
    field: keyof ReminderSetting,
    value: boolean | number,
  ) {
    setReminders((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [field]: value,
      },
    }));
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Timer className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Smart reminders</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        Configure in-app nudges for visual breaks, posture changes, status
        notes, and walking intervals.
      </p>

      <div className="mt-5 grid gap-3">
        {(Object.keys(reminders) as ReminderKey[]).map((key) => {
          const reminder = reminders[key];
          return (
            <div
              key={key}
              className="grid gap-3 rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-3 sm:grid-cols-[1fr_6rem_auto]"
            >
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={reminder.enabled}
                  onChange={(event) =>
                    updateReminder(key, "enabled", event.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-[#2a7d8e]"
                />
                <span>
                  <span className="block text-sm font-semibold">
                    {reminder.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#607286]">
                    {reminder.message}
                  </span>
                </span>
              </label>
              <label className="text-xs font-semibold text-[#607286]">
                Minutes
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={reminder.minutes}
                  onChange={(event) =>
                    updateReminder(
                      key,
                      "minutes",
                      clampNumber(event.target.value, 1, 180),
                    )
                  }
                  className="mt-1 w-full rounded-md border border-[#dbe3e0] bg-white px-2 py-2 text-sm outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
                />
              </label>
              <button
                type="button"
                onClick={() => triggerReminder(key)}
                className="inline-flex items-center justify-center rounded-md border border-[#dbe3e0] px-3 py-2 text-xs font-semibold text-[#607286] transition hover:bg-white"
              >
                Trigger now
              </button>
            </div>
          );
        })}
      </div>

      {latestReminder ? (
        <div className="mt-5 rounded-lg border border-[#a9d7de] bg-[#edf8fa] p-4 text-sm font-semibold leading-6 text-[#2a7d8e]">
          {latestReminder}
        </div>
      ) : null}
    </div>
  );
}

function DailyRhythmDashboard({
  events,
  statusLog,
}: {
  events: DowntimeEvent[];
  statusLog: DowntimeStatusEntry[];
}) {
  const [range, setRange] = useState<"today" | "week">("today");
  const todayKey = formatDateKey(new Date());
  const visibleEvents =
    range === "today"
      ? events.filter((event) => event.dateKey === todayKey)
      : events.filter((event) => daysBetween(event.dateKey, todayKey) < 7);
  const metricRows = [
    {
      label: "Posture changes",
      value: visibleEvents.filter((event) => event.type === "postureChange")
        .length,
    },
    {
      label: "Status lines",
      value:
        range === "today"
          ? statusLog.length
          : visibleEvents.filter((event) => event.type === "statusLine").length,
    },
    {
      label: "Breaks used",
      value: visibleEvents.filter((event) => event.type === "breakTaken").length,
    },
    {
      label: "Movement blocks",
      value: visibleEvents.filter((event) => event.type === "movementCycle")
        .length,
    },
    {
      label: "Loops completed",
      value: visibleEvents.filter((event) => event.type === "loopComplete")
        .length,
    },
    {
      label: "Learning tasks",
      value: visibleEvents.filter((event) => event.type === "learningTask")
        .length,
    },
  ];
  const maxValue = Math.max(...metricRows.map((row) => row.value), 1);

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Daily rhythm dashboard</h3>
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#dbe3e0] bg-[#fbfcfb] p-1">
          {(["today", "week"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRange(option)}
              className={`rounded-md px-3 py-2 text-xs font-semibold ${
                range === option
                  ? "bg-[#1a2e4a] text-white"
                  : "text-[#607286] hover:bg-white"
              }`}
            >
              {option === "today" ? "Today" : "7 days"}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        A lightweight pattern view for posture, logging, breaks, movement, and
        focus cycles.
      </p>

      <div className="mt-5 space-y-3">
        {metricRows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold">{row.label}</span>
              <span className="font-mono text-xs font-semibold text-[#8a9aaa]">
                {row.value}
              </span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-[#eef4f3]">
              <div
                className="h-2 rounded-full bg-[#2a7d8e]"
                style={{ width: `${Math.max((row.value / maxValue) * 100, row.value ? 8 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskMicrolearningLibrary({
  setAnchor,
  logEvent,
}: {
  setAnchor: Dispatch<SetStateAction<AnchorData>>;
  logEvent: (type: DowntimeEventType, label: string) => void;
}) {
  function addMicroTask(task: MicroTask) {
    const text = `Microlearning: ${task.title} (${task.category})`;
    setAnchor((current) => ({
      ...current,
      taskLog: [
        { id: Date.now(), time: formatTimeOfDay(new Date()), text },
        ...current.taskLog,
      ],
    }));
    logEvent("learningTask", text);
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Task microlearning library</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        Short, low-switching-cost tasks for quiet support periods.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {microTasks.map((task) => (
          <div
            key={task.id}
            className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
              {task.category} · {task.minutes} min
            </p>
            <h4 className="mt-2 text-sm font-semibold">{task.title}</h4>
            <p className="mt-2 text-xs leading-5 text-[#607286]">
              {task.description}
            </p>
            <button
              type="button"
              onClick={() => addMicroTask(task)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-[#2a7d8e] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#246b79]"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add to task log
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function InterruptFriendlyTaskBoard({
  setAnchor,
  logEvent,
}: {
  setAnchor: Dispatch<SetStateAction<AnchorData>>;
  logEvent: (type: DowntimeEventType, label: string) => void;
}) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const boardTasks = microTasks.slice(0, 5);

  function logTask(task: MicroTask, status: "started" | "paused" | "done") {
    const text = `Interrupt-friendly task ${status}: ${task.title}`;
    if (status === "done") {
      setAnchor((current) => ({
        ...current,
        taskLog: [
          { id: Date.now(), time: formatTimeOfDay(new Date()), text },
          ...current.taskLog,
        ],
      }));
    }
    logEvent(status === "done" ? "learningTask" : "taskLogEntry", text);
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Interrupt-friendly task board</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        Tasks with obvious pause points, built for calls and tickets interrupting
        at any moment.
      </p>
      <div className="mt-5 grid gap-3">
        {boardTasks.map((task) => {
          const active = activeTaskId === task.id;
          return (
            <div
              key={task.id}
              className={`rounded-lg border p-3 ${
                active
                  ? "border-[#2a7d8e] bg-[#edf8fa]"
                  : "border-[#e4ebe8] bg-[#fbfcfb]"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">{task.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#607286]">
                    Pause point: finish the current sentence or checklist item.
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTaskId(task.id);
                      logTask(task, "started");
                    }}
                    className="rounded-md border border-[#dbe3e0] bg-white px-2 py-1 text-xs font-semibold text-[#607286] hover:border-[#9fcbd2]"
                  >
                    Start
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTaskId(null);
                      logTask(task, "paused");
                    }}
                    className="rounded-md border border-[#dbe3e0] bg-white px-2 py-1 text-xs font-semibold text-[#607286] hover:border-[#9fcbd2]"
                  >
                    Pause
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTaskId(null);
                      logTask(task, "done");
                    }}
                    className="rounded-md bg-[#1a2e4a] px-2 py-1 text-xs font-semibold text-white hover:bg-[#243f63]"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ErgonomicsChecklist({
  completed,
  setCompleted,
  logEvent,
}: {
  completed: string[];
  setCompleted: Dispatch<SetStateAction<string[]>>;
  logEvent: (type: DowntimeEventType, label: string) => void;
}) {
  const doneCount = completed.length;

  function toggleItem(item: ErgonomicChecklistItem) {
    setCompleted((current) => {
      const isDone = current.includes(item.id);
      if (!isDone) {
        logEvent("ergonomics", `Ergonomics checked: ${item.label}`);
      }
      return isDone
        ? current.filter((id) => id !== item.id)
        : [...current, item.id];
    });
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Ergonomics checklist</h3>
        </div>
        <span className="rounded-md bg-[#eef4f3] px-2 py-1 text-xs font-semibold text-[#607286]">
          {doneCount}/{ergonomicChecklist.length}
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {ergonomicChecklist.map((item) => {
          const isDone = completed.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item)}
              className={`w-full rounded-lg border p-3 text-left transition ${
                isDone
                  ? "border-[#2a7d8e] bg-[#edf8fa]"
                  : "border-[#e4ebe8] bg-[#fbfcfb] hover:border-[#9fcbd2]"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                {isDone ? (
                  <Check className="h-4 w-4 text-[#2a7d8e]" aria-hidden="true" />
                ) : null}
                {item.label}
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#607286]">
                {item.detail}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LearningQuestlines({
  setAnchor,
  logEvent,
}: {
  setAnchor: Dispatch<SetStateAction<AnchorData>>;
  logEvent: (type: DowntimeEventType, label: string) => void;
}) {
  const [completed, setCompleted] = useLocalStorageState<string[]>(
    "waypoint:questline-progress",
    [],
  );
  const questlines = [
    {
      id: "m365",
      title: "Microsoft 365 fundamentals",
      tasks: ["Read one admin tip", "Write one support note", "Log one setting"],
    },
    {
      id: "react",
      title: "React component practice",
      tasks: ["Build a tiny component", "Add one prop", "Summarise the pattern"],
    },
    {
      id: "cyber",
      title: "Cyber-safety reading",
      tasks: ["Read one scenario", "Identify one risk", "Write one safe response"],
    },
  ];

  function toggleQuestTask(questId: string, task: string) {
    const id = `${questId}:${task}`;
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setAnchor((current) => ({
      ...current,
      taskLog: [
        {
          id: Date.now(),
          time: formatTimeOfDay(new Date()),
          text: `Questline progress: ${task}`,
        },
        ...current.taskLog,
      ],
    }));
    logEvent("learningTask", `Questline progress: ${task}`);
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Route className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Learning questlines</h3>
      </div>
      <div className="mt-5 grid gap-3">
        {questlines.map((quest) => {
          const done = quest.tasks.filter((task) =>
            completed.includes(`${quest.id}:${task}`),
          ).length;
          return (
            <div
              key={quest.id}
              className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{quest.title}</p>
                <span className="font-mono text-xs font-semibold text-[#8a9aaa]">
                  {done}/{quest.tasks.length}
                </span>
              </div>
              <div className="mt-3 grid gap-2">
                {quest.tasks.map((task) => {
                  const id = `${quest.id}:${task}`;
                  return (
                    <button
                      key={task}
                      type="button"
                      onClick={() => toggleQuestTask(quest.id, task)}
                      className={`rounded-md border px-3 py-2 text-left text-xs font-semibold transition ${
                        completed.includes(id)
                          ? "border-[#2a7d8e] bg-[#edf8fa] text-[#2a7d8e]"
                          : "border-[#dbe3e0] bg-white text-[#607286] hover:border-[#9fcbd2]"
                      }`}
                    >
                      {task}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WellbeingCoach({
  anchor,
  trail,
  hub,
  statusLog,
  events,
  wellbeingRisk,
  setWellbeingRisk,
}: {
  anchor: AnchorData;
  trail: TrailToday;
  hub: HubState;
  statusLog: DowntimeStatusEntry[];
  events: DowntimeEvent[];
  wellbeingRisk: WellbeingRisk;
  setWellbeingRisk: Dispatch<SetStateAction<WellbeingRisk>>;
}) {
  const riskQuestions: { key: keyof WellbeingRisk; label: string }[] = [
    { key: "sleep", label: "Sleep debt" },
    { key: "hydration", label: "Hydration gap" },
    { key: "eyes", label: "Eye strain" },
    { key: "legs", label: "Leg fatigue" },
    { key: "stress", label: "Stress load" },
    { key: "clarity", label: "Expectation ambiguity" },
  ];
  const cues = getWellbeingCues(anchor, trail, hub, statusLog, events, wellbeingRisk);

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Personalised wellbeing coach</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        Private, rules-based cues for static standing risk, low cognitive load,
        visual fatigue, and recovery state.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {riskQuestions.map((question) => (
          <label key={question.key} className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-3">
            <span className="flex items-center justify-between gap-3 text-sm font-semibold">
              {question.label}
              <span className="font-mono text-xs text-[#8a9aaa]">
                {wellbeingRisk[question.key]}/5
              </span>
            </span>
            <input
              type="range"
              min={1}
              max={5}
              value={wellbeingRisk[question.key]}
              onChange={(event) =>
                setWellbeingRisk((current) => ({
                  ...current,
                  [question.key]: Number(event.target.value),
                }))
              }
              className="mt-3 w-full accent-[#2a7d8e]"
            />
          </label>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {cues.map((cue) => (
          <div
            key={cue.title}
            className="rounded-lg border border-[#a9d7de] bg-[#edf8fa] p-4"
          >
            <p className="text-sm font-semibold text-[#2a7d8e]">{cue.title}</p>
            <p className="mt-1 text-sm leading-6 text-[#607286]">{cue.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportAndSharingPanel({
  anchor,
  hub,
  trail,
  statusLog,
  events,
  ergonomicsDone,
}: {
  anchor: AnchorData;
  hub: HubState;
  trail: TrailToday;
  statusLog: DowntimeStatusEntry[];
  events: DowntimeEvent[];
  ergonomicsDone: number;
}) {
  const [managerReady, setManagerReady] = useState(true);
  const [copied, setCopied] = useState(false);
  const report = managerReady
    ? buildManagerReadyReport(anchor, hub, statusLog, events, ergonomicsDone)
    : buildFullDayReport(anchor, hub, trail, statusLog, events, ergonomicsDone);

  async function copyReport() {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadReport() {
    downloadTextFile(
      report,
      managerReady ? "waypoint-manager-summary.md" : "waypoint-day-summary.md",
    );
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Reports and sharing</h3>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-[#607286]">
          <input
            type="checkbox"
            checked={managerReady}
            onChange={(event) => setManagerReady(event.target.checked)}
            className="h-4 w-4 accent-[#2a7d8e]"
          />
          Manager-ready
        </label>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        Generate a copyable or downloadable summary. Manager-ready mode excludes
        personal reflection content.
      </p>

      <textarea
        value={report}
        readOnly
        rows={10}
        className="mt-5 w-full resize-none rounded-lg border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-3 font-mono text-xs leading-5 outline-none"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyReport}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#243f63]"
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
          {copied ? "Copied" : "Copy report"}
        </button>
        <button
          type="button"
          onClick={downloadReport}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-[#dbe3e0] px-3 py-2 text-sm font-semibold text-[#607286] transition hover:bg-[#eef4f3]"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Download text
        </button>
        <a
          href={`mailto:?subject=${encodeURIComponent("Waypoint daily summary")}&body=${encodeURIComponent(report)}`}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-[#dbe3e0] px-3 py-2 text-sm font-semibold text-[#607286] transition hover:bg-[#eef4f3]"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Email draft
        </a>
      </div>
    </div>
  );
}

function LocalSaveHistory({
  hub,
  setHub,
  anchor,
  setAnchor,
  trail,
  setTrail,
  trailHistory,
  setTrailHistory,
  statusLog,
  setStatusLog,
  events,
  setEvents,
  workflowSteps,
  setWorkflowSteps,
  savedWorkflows,
  setSavedWorkflows,
  reminders,
  setReminders,
  completedErgonomics,
  setCompletedErgonomics,
  wellbeingRisk,
  setWellbeingRisk,
  dayHistory,
  setDayHistory,
}: {
  hub: HubState;
  setHub: Dispatch<SetStateAction<HubState>>;
  anchor: AnchorData;
  setAnchor: Dispatch<SetStateAction<AnchorData>>;
  trail: TrailToday;
  setTrail: Dispatch<SetStateAction<TrailToday>>;
  trailHistory: TrailEntry[];
  setTrailHistory: Dispatch<SetStateAction<TrailEntry[]>>;
  statusLog: DowntimeStatusEntry[];
  setStatusLog: Dispatch<SetStateAction<DowntimeStatusEntry[]>>;
  events: DowntimeEvent[];
  setEvents: Dispatch<SetStateAction<DowntimeEvent[]>>;
  workflowSteps: WorkflowStep[];
  setWorkflowSteps: Dispatch<SetStateAction<WorkflowStep[]>>;
  savedWorkflows: SavedWorkflow[];
  setSavedWorkflows: Dispatch<SetStateAction<SavedWorkflow[]>>;
  reminders: Record<ReminderKey, ReminderSetting>;
  setReminders: Dispatch<SetStateAction<Record<ReminderKey, ReminderSetting>>>;
  completedErgonomics: string[];
  setCompletedErgonomics: Dispatch<SetStateAction<string[]>>;
  wellbeingRisk: WellbeingRisk;
  setWellbeingRisk: Dispatch<SetStateAction<WellbeingRisk>>;
  dayHistory: DaySnapshot[];
  setDayHistory: Dispatch<SetStateAction<DaySnapshot[]>>;
}) {
  function saveSnapshot() {
    const now = new Date();
    setDayHistory((current) => [
      {
        id: now.getTime(),
        dateLabel: now.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        anchor,
        hub,
        trail,
        trailHistory,
        statusLog,
        events,
        workflowSteps,
        savedWorkflows,
        reminders,
        completedErgonomics,
        wellbeingRisk,
      },
      ...current.slice(0, 13),
    ]);
  }

  function restoreSnapshot(snapshot: DaySnapshot) {
    setHub(snapshot.hub);
    setAnchor(snapshot.anchor);
    setTrail(snapshot.trail);
    setTrailHistory(snapshot.trailHistory || []);
    setStatusLog(snapshot.statusLog || []);
    setEvents(snapshot.events || []);
    setWorkflowSteps(snapshot.workflowSteps || defaultWorkflowSteps);
    setSavedWorkflows(snapshot.savedWorkflows || []);
    setReminders(snapshot.reminders || defaultReminderSettings);
    setCompletedErgonomics(snapshot.completedErgonomics || []);
    setWellbeingRisk(snapshot.wellbeingRisk || defaultWellbeingRisk);
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <Save className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Local save and history</h3>
        </div>
        <button
          type="button"
          onClick={saveSnapshot}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2a7d8e] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#246b79]"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save today
        </button>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        Core Waypoint state is stored locally in this browser. Save snapshots to
        build a day-by-day history.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {dayHistory.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#dbe3e0] bg-[#fbfcfb] p-4 text-sm leading-6 text-[#607286] md:col-span-2 lg:col-span-3">
            Saved days will appear here.
          </p>
        ) : (
          dayHistory.map((snapshot) => (
            <div
              key={snapshot.id}
              className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4"
            >
              <p className="text-sm font-semibold">{snapshot.dateLabel}</p>
              <p className="mt-1 text-xs leading-5 text-[#607286]">
                {snapshot.statusLog.length} status lines ·{" "}
                {snapshot.anchor.taskLog.length} task entries
              </p>
              <button
                type="button"
                onClick={() => restoreSnapshot(snapshot)}
                className="mt-3 rounded-md border border-[#dbe3e0] bg-white px-3 py-2 text-xs font-semibold text-[#607286] transition hover:border-[#9fcbd2]"
              >
                Restore
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EvidenceReferenceHub() {
  const groups = [
    { label: "Visual ergonomics", ids: ["aoa", "osha", "worksafe-qld"] },
    {
      label: "Standing and movement",
      ids: ["standing-review", "safe-work-australia", "worksafe-qld"],
    },
    {
      label: "Attention and underload",
      ids: ["frontiers", "boredom-review"],
    },
    {
      label: "Executive-function moderators",
      ids: ["better-health", "healthdirect"],
    },
    { label: "Display-screen breaks", ids: ["hse"] },
  ];

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <ExternalLink className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Evidence and reference hub</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        Source library grouped by how a practitioner or builder would use the
        evidence inside the app.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.label}
            className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4"
          >
            <p className="text-sm font-semibold text-[#2a7d8e]">
              {group.label}
            </p>
            <div className="mt-3 space-y-2">
              {group.ids.map((id) => {
                const source = sourceLinks.find((item) => item.id === id);
                if (!source) {
                  return null;
                }

                return (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-md border border-[#dbe3e0] bg-white px-3 py-2 transition hover:border-[#9fcbd2]"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-[#607286]">
                      {source.label}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#607286]">
                      {source.title}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DowntimePlanCard() {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-[#e07b39]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Consolidated control plan</h3>
      </div>
      <div className="mt-5 space-y-4">
        {consolidatedPlan.map((plan) => (
          <div key={plan.cadence} className="border-t border-[#e4ebe8] pt-4 first:border-t-0 first:pt-0">
            <p className="text-sm font-semibold text-[#2a7d8e]">
              {plan.cadence}
            </p>
            <ul className="mt-2 space-y-2">
              {plan.steps.map((step) => (
                <li key={step} className="flex gap-2 text-sm leading-6 text-[#607286]">
                  <Check className="mt-1 h-4 w-4 flex-none text-[#2a7d8e]" aria-hidden="true" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppliedProtocolCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {appliedProtocols.map((protocol) => (
        <div
          key={protocol.title}
          className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm"
        >
          <ClassificationPill label={protocol.classification} />
          <h3 className="mt-3 text-lg font-semibold">{protocol.title}</h3>
          <ul className="mt-4 space-y-2">
            {protocol.steps.map((step) => (
              <li key={step} className="text-sm leading-6 text-[#607286]">
                {step}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-[#e4ebe8] pt-4 text-sm leading-6 text-[#5d6f82]">
            {protocol.rationale}
          </p>
          <p className="mt-3 text-xs leading-5 text-[#607286]">
            {protocol.alternative}
          </p>
        </div>
      ))}
      <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm lg:col-span-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
          <h3 className="text-lg font-semibold">
            Suitable low-switching-cost tasks
          </h3>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {suitableTaskCategories.map((task) => (
            <span
              key={task}
              className="rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-2 text-sm font-semibold text-[#607286]"
            >
              {task}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlsPanel({
  icon: Icon,
  title,
  controls,
}: {
  icon: LucideIcon;
  title: string;
  controls: {
    title: string;
    control: string;
    classification: string;
    limitation?: string;
    note?: string;
    sourceIds: readonly string[];
  }[];
}) {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-5 space-y-5">
        {controls.map((control) => (
          <div key={control.title} className="border-t border-[#e4ebe8] pt-5 first:border-t-0 first:pt-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h4 className="text-base font-semibold">{control.title}</h4>
              <ClassificationPill label={control.classification} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[#607286]">
              {control.control}
            </p>
            <p className="mt-3 text-xs leading-5 text-[#607286]">
              {control.limitation || control.note}
            </p>
            <SourceBadges sourceIds={control.sourceIds} />
          </div>
        ))}
      </div>
    </div>
  );
}

function BriefingScopeCard() {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Scope and revision basis</h3>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#607286]">
        This briefing evaluates a Level 1 IT support work pattern involving:
      </p>
      <ul className="mt-3 space-y-2">
        {briefingScope.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-[#607286]">
            <Check className="mt-1 h-4 w-4 flex-none text-[#2a7d8e]" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-[#e4ebe8] pt-4">
        <p className="text-sm font-semibold">Round 3 corrections</p>
        <ul className="mt-2 space-y-2">
          {revisionBasis.map((item) => (
            <li key={item} className="text-sm leading-6 text-[#607286]">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function OperationalDefinitionCard() {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">
          Interrupt-driven low-demand monitoring
        </h3>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#607286]">
        A work state with externally triggered work, low or irregular signal
        frequency, preserved availability, periodic channel checking, and
        readiness without full recovery.
      </p>
      <div className="mt-5 divide-y divide-[#e4ebe8] rounded-lg border border-[#e4ebe8]">
        {operationalFeatures.map((feature) => (
          <div key={feature.parameter} className="grid gap-1 p-3 sm:grid-cols-[0.45fr_1fr]">
            <p className="text-sm font-semibold">{feature.parameter}</p>
            <p className="text-sm leading-6 text-[#607286]">
              {feature.definition}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-[#607286]">
        This construct is adjacent to, but not equivalent to, classic vigilance
        decrement. Transfer from sustained-attention research to IT support
        should be treated as partial and indirect.
      </p>
      <SourceBadges sourceIds={["frontiers"]} />
    </div>
  );
}

function EvidenceClassificationCard() {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Evidence classification</h3>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {evidenceClassifications.map((item) => (
          <div
            key={item.classification}
            className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4"
          >
            <ClassificationPill label={item.classification} />
            <p className="mt-3 text-sm leading-6 text-[#607286]">
              {item.meaning}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MechanismGrid() {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">
          Physiological, psychological, and cognitive mechanisms
        </h3>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {mechanismSections.map((section) => (
          <article
            key={section.title}
            className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4"
          >
            <h4 className="text-base font-semibold">{section.title}</h4>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-6 text-[#607286]">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-4 border-t border-[#e4ebe8] pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
                Evidence classification
              </p>
              <ul className="mt-2 space-y-1">
                {section.evidence.map((item) => (
                  <li key={item} className="text-xs leading-5 text-[#607286]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <SourceBadges sourceIds={section.sourceIds} />
          </article>
        ))}
      </div>
    </div>
  );
}

function ModeratorTable() {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Route className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">
          Confounding and moderating variables
        </h3>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="bg-[#eef4f3] text-[#38506b]">
              <th className="rounded-l-md px-3 py-3 font-semibold">Domain</th>
              <th className="px-3 py-3 font-semibold">Risk-amplifying variables</th>
              <th className="rounded-r-md px-3 py-3 font-semibold">Risk-reducing variables</th>
            </tr>
          </thead>
          <tbody>
            {moderators.map((row) => (
              <tr key={row.domain} className="border-b border-[#e4ebe8]">
                <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">
                  {row.domain}
                </td>
                <td className="border-b border-[#e4ebe8] px-3 py-3 leading-6 text-[#607286]">
                  {row.amplifying}
                </td>
                <td className="border-b border-[#e4ebe8] px-3 py-3 leading-6 text-[#607286]">
                  {row.reducing}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#607286]">
        WorkSafe Queensland&apos;s sit-stand workstation advice is kept separate from
        Safe Work Australia&apos;s national guidance against prolonged seated,
        standing, or static postures.
      </p>
      <SourceBadges sourceIds={["worksafe-qld", "safe-work-australia"]} />
    </div>
  );
}

function EvidenceSummaryTable() {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Evidence-strength summary</h3>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="bg-[#eef4f3] text-[#38506b]">
              <th className="rounded-l-md px-3 py-3 font-semibold">Control</th>
              <th className="px-3 py-3 font-semibold">Classification</th>
              <th className="rounded-r-md px-3 py-3 font-semibold">Evidence status</th>
            </tr>
          </thead>
          <tbody>
            {evidenceStrengthSummary.map((row) => (
              <tr key={row.control}>
                <td className="border-b border-[#e4ebe8] px-3 py-3 font-semibold">
                  {row.control}
                </td>
                <td className="border-b border-[#e4ebe8] px-3 py-3">
                  <ClassificationPill label={row.classification} />
                </td>
                <td className="border-b border-[#e4ebe8] px-3 py-3 leading-6 text-[#607286]">
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4 text-sm leading-6 text-[#607286]">
        Mechanistic versus outcome evidence note: a control can be
        mechanistically plausible without strong direct evidence for clinical
        outcome improvement at a specified dose. Lower-limb activation during
        standing is mechanism-aligned; it is not proof of quantified symptom
        reduction in every worker.
      </p>
    </div>
  );
}

function LimitationsCard() {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-[#e07b39]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Limitations</h3>
      </div>
      <ol className="mt-5 space-y-3">
        {limitations.map((limitation, index) => (
          <li key={limitation} className="grid grid-cols-[2rem_1fr] gap-2 text-sm leading-6 text-[#607286]">
            <span className="font-mono text-xs font-semibold text-[#8a9aaa]">
              {index + 1}.
            </span>
            <span>{limitation}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PractitionerConclusionCard() {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-[#1a2e4a] p-5 text-white shadow-sm">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-[#bfe6eb]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Practitioner conclusion</h3>
      </div>
      <div className="mt-5 space-y-4">
        {practitionerConclusion.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-6 text-white/75">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

function ClassificationPill({ label }: { label: string }) {
  const tone = label.includes("Guideline")
    ? "border-[#a9d7de] bg-[#edf8fa] text-[#2a7d8e]"
    : label.includes("Evidence")
      ? "border-[#edc1a7] bg-[#fff5ed] text-[#b45f2f]"
      : label.includes("Expert")
        ? "border-[#bec9d5] bg-[#eef4f3] text-[#38506b]"
        : "border-[#dbe3e0] bg-[#fbfcfb] text-[#607286]";

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${tone}`}
    >
      {label}
    </span>
  );
}

function SourceBadges({
  sourceIds,
}: {
  sourceIds?: readonly string[];
}) {
  if (!sourceIds?.length) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {sourceIds.map((sourceId) => {
        const source = sourceLinks.find((item) => item.id === sourceId);
        if (!source) {
          return null;
        }

        return (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-[#dbe3e0] bg-white px-2 py-1 text-xs font-semibold text-[#607286] transition hover:border-[#9fcbd2] hover:text-[#2a7d8e]"
          >
            {source.label}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}

function WaypointSection({
  view,
  setView,
  anchor,
  setAnchor,
  trail,
  setTrail,
  trailHistory,
  setTrailHistory,
}: {
  view: WaypointView;
  setView: (view: WaypointView) => void;
  anchor: AnchorData;
  setAnchor: (anchor: AnchorData) => void;
  trail: TrailToday;
  setTrail: (trail: TrailToday) => void;
  trailHistory: TrailEntry[];
  setTrailHistory: (history: TrailEntry[]) => void;
}) {
  if (view === "anchor") {
    return <AnchorModule anchor={anchor} setAnchor={setAnchor} />;
  }

  if (view === "trail") {
    return (
      <TrailModule
        trail={trail}
        setTrail={setTrail}
        trailHistory={trailHistory}
        setTrailHistory={setTrailHistory}
      />
    );
  }

  return (
    <WaypointHome
      anchor={anchor}
      trail={trail}
      setView={setView}
      trailHistory={trailHistory}
    />
  );
}

function WaypointHome({
  anchor,
  trail,
  setView,
  trailHistory,
}: {
  anchor: AnchorData;
  trail: TrailToday;
  setView: (view: WaypointView) => void;
  trailHistory: TrailEntry[];
}) {
  const terrain = trail.terrain ? terrainMap[trail.terrain] : null;
  const nervous = anchor.nervous
    ? nervousOptions.find((option) => option.label === anchor.nervous)
    : null;

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-[#edf8fa] p-2 text-[#2a7d8e]">
            <Compass className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2a7d8e]">Waypoint Home</p>
            <h2 className="mt-1 text-2xl font-semibold">
              Today&apos;s status across Anchor and Trail
            </h2>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setView("anchor")}
            className="rounded-lg border border-[#dbe3e0] bg-[#fbfcfb] p-4 text-left transition hover:border-[#9fcbd2]"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Anchor className="h-4 w-4 text-[#2a7d8e]" aria-hidden="true" />
              Anchor
            </div>
            {anchor.locked ? (
              <div className="mt-4 space-y-3">
                {nervous ? (
                  <span
                    className="inline-flex rounded-md border px-2 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: nervous.tint,
                      borderColor: nervous.border,
                      color: nervous.color,
                    }}
                  >
                    {nervous.label}
                  </span>
                ) : null}
                <p className="text-base font-semibold leading-6">
                  {anchor.oneThing}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[#607286]">
                Set the morning anchor.
              </p>
            )}
          </button>

          <button
            type="button"
            onClick={() => setView("trail")}
            className="rounded-lg border border-[#dbe3e0] bg-[#fbfcfb] p-4 text-left transition hover:border-[#9fcbd2]"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapIcon className="h-4 w-4 text-[#e07b39]" aria-hidden="true" />
              Trail
            </div>
            {terrain ? (
              <div className="mt-4 space-y-3">
                <span
                  className="inline-flex rounded-md border px-2 py-1 text-xs font-semibold"
                  style={{
                    borderColor: terrain.accent,
                    color: terrain.accent,
                    backgroundColor: "#fffaf5",
                  }}
                >
                  {terrain.label}
                </span>
                <p className="text-sm leading-6 text-[#607286]">
                  {terrain.suggestion}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[#607286]">
                Choose today&apos;s terrain.
              </p>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <HomeMetric
          icon={Timer}
          label="Focus block"
          value={anchor.locked ? "Ready" : "Anchor first"}
        />
        <HomeMetric
          icon={ClipboardList}
          label="Evidence logged"
          value={`${anchor.taskLog.length} ${anchor.taskLog.length === 1 ? "entry" : "entries"}`}
        />
        <HomeMetric
          icon={Flag}
          label="Trail markers"
          value={`${trailHistory.length + (trail.examen ? 1 : 0)} saved`}
        />
      </div>
    </section>
  );
}

function HomeMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#607286]">
        <Icon className="h-4 w-4 text-[#2a7d8e]" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-3 text-2xl font-semibold text-[#1a2e4a]">{value}</p>
    </div>
  );
}

function AnchorModule({
  anchor,
  setAnchor,
}: {
  anchor: AnchorData;
  setAnchor: (anchor: AnchorData) => void;
}) {
  const [step, setStep] = useState<AnchorStep>("checkin");
  const [editingAnchor, setEditingAnchor] = useState(false);
  const [draft, setDraft] = useState({
    nervous: "",
    oneThing: "",
    protect: "",
  });

  if (!anchor.locked) {
    return (
      <AnchorSequence
        step={step}
        setStep={setStep}
        draft={draft}
        setDraft={setDraft}
        onLock={() =>
          setAnchor({
            ...anchor,
            locked: true,
            nervous: draft.nervous,
            oneThing: draft.oneThing.trim(),
            protect: draft.protect.trim(),
          })
        }
      />
    );
  }

  if (editingAnchor) {
    return (
      <section className="space-y-5">
        <SectionHeading
          icon={Anchor}
          label="Anchor"
          title="Revise the anchor"
          text="Adjust the day without losing the task evidence already logged."
        />
        <AnchorEditCard
          anchor={anchor}
          onCancel={() => setEditingAnchor(false)}
          onSave={(next) => {
            setAnchor(next);
            setEditingAnchor(false);
          }}
        />
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <SectionHeading
        icon={Anchor}
        label="Anchor"
        title="The anchor is set"
        text="Structure for the work, room for the nervous system."
      />

      <AnchorSummaryCard
        anchor={anchor}
        onEdit={() => setEditingAnchor(true)}
        onReset={() =>
          setAnchor({
            ...anchor,
            locked: false,
            nervous: "",
            oneThing: "",
            protect: "",
            end: undefined,
          })
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <FocusTimer oneThing={anchor.oneThing} />
        <TaskLog anchor={anchor} setAnchor={setAnchor} />
      </div>

      <EndOfDay anchor={anchor} setAnchor={setAnchor} />
    </section>
  );
}

function AnchorEditCard({
  anchor,
  onCancel,
  onSave,
}: {
  anchor: AnchorData;
  onCancel: () => void;
  onSave: (anchor: AnchorData) => void;
}) {
  const [draft, setDraft] = useState({
    nervous: anchor.nervous || "",
    oneThing: anchor.oneThing,
    protect: anchor.protect,
  });

  const canSave = draft.oneThing.trim() && draft.protect.trim();

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="grid gap-5">
        <div>
          <p className="text-sm font-semibold">Nervous-system state</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {nervousOptions.map((option) => {
              const isSelected = draft.nervous === option.label;

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setDraft({ ...draft, nervous: option.label })}
                  aria-pressed={isSelected}
                  className="rounded-lg border px-3 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5"
                  style={{
                    backgroundColor: option.tint,
                    borderColor: isSelected ? "#2a7d8e" : option.border,
                    color: option.color,
                  }}
                >
                  {option.label}
                  {isSelected ? (
                    <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.14em]">
                      Selected
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-semibold">One thing</span>
          <input
            value={draft.oneThing}
            onChange={(event) =>
              setDraft({ ...draft, oneThing: event.target.value })
            }
            className="mt-2 w-full rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-3 text-sm outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
          />
        </label>

        <ReflectionTextarea
          label="Protected today"
          value={draft.protect}
          onChange={(value) => setDraft({ ...draft, protect: value })}
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!canSave}
            onClick={() =>
              onSave({
                ...anchor,
                locked: true,
                nervous: draft.nervous,
                oneThing: draft.oneThing.trim(),
                protect: draft.protect.trim(),
              })
            }
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#243f63] disabled:cursor-not-allowed disabled:bg-[#9aa8b6]"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Save anchor
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-[#dbe3e0] px-4 py-3 text-sm font-semibold text-[#607286] transition hover:bg-[#eef4f3]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AnchorSequence({
  step,
  setStep,
  draft,
  setDraft,
  onLock,
}: {
  step: AnchorStep;
  setStep: (step: AnchorStep) => void;
  draft: { nervous: string; oneThing: string; protect: string };
  setDraft: (draft: { nervous: string; oneThing: string; protect: string }) => void;
  onLock: () => void;
}) {
  if (step === "checkin") {
    return (
      <section className="mx-auto flex min-h-[58vh] max-w-2xl flex-col justify-center">
        <p className="text-sm font-semibold text-[#2a7d8e]">Anchor</p>
        <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
          How&apos;s your nervous system right now?
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {nervousOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                setDraft({ ...draft, nervous: option.label });
                setStep("oneThing");
              }}
              className="rounded-lg border px-4 py-4 text-center text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                backgroundColor: option.tint,
                borderColor: option.border,
                color: option.color,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (step === "oneThing") {
    return (
      <section className="mx-auto flex min-h-[58vh] max-w-2xl flex-col justify-center">
        <button
          type="button"
          onClick={() => setStep("checkin")}
          className="mb-6 self-start rounded-md border border-[#dbe3e0] px-3 py-2 text-sm font-semibold text-[#607286] hover:bg-white"
        >
          Back
        </button>
        <label>
          <span className="block text-2xl font-semibold md:text-3xl">
            What&apos;s the one thing that matters most today?
          </span>
          <input
            value={draft.oneThing}
            onChange={(event) =>
              setDraft({ ...draft, oneThing: event.target.value })
            }
            autoFocus
            className="mt-6 w-full rounded-lg border border-[#dbe3e0] bg-white px-4 py-5 text-2xl font-semibold leading-tight outline-none transition placeholder:text-[#a0adba] focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
            placeholder="One meaningful thing"
          />
        </label>
        <button
          type="button"
          disabled={!draft.oneThing.trim()}
          onClick={() => setStep("protect")}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-[#9aa8b6]"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Continue
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[58vh] max-w-2xl flex-col justify-center">
      <button
        type="button"
        onClick={() => setStep("oneThing")}
        className="mb-6 self-start rounded-md border border-[#dbe3e0] px-3 py-2 text-sm font-semibold text-[#607286] hover:bg-white"
      >
        Back
      </button>
      <label>
        <span className="block text-2xl font-semibold md:text-3xl">
          What do you need to protect today?
        </span>
        <textarea
          value={draft.protect}
          onChange={(event) =>
            setDraft({ ...draft, protect: event.target.value })
          }
          rows={4}
          className="mt-6 w-full resize-none rounded-lg border border-[#dbe3e0] bg-white px-4 py-4 text-lg leading-7 outline-none transition placeholder:text-[#a0adba] focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
          placeholder="A lunch break, one quiet hour, a walk"
        />
      </label>
      <button
        type="button"
        disabled={!draft.protect.trim()}
        onClick={onLock}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-[#e07b39] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c9672e] disabled:cursor-not-allowed disabled:bg-[#d1a48b]"
      >
        <Anchor className="h-4 w-4" aria-hidden="true" />
        Set anchor
      </button>
    </section>
  );
}

function AnchorSummaryCard({
  anchor,
  onEdit,
  onReset,
}: {
  anchor: AnchorData;
  onEdit: () => void;
  onReset: () => void;
}) {
  const nervous = anchor.nervous
    ? nervousOptions.find((option) => option.label === anchor.nervous)
    : null;

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#607286]">One thing</p>
          <h3 className="mt-1 text-2xl font-semibold leading-tight">
            {anchor.oneThing}
          </h3>
        </div>
        <div className="flex flex-wrap items-start gap-2">
          {nervous ? (
            <span
              className="inline-flex self-start rounded-md border px-3 py-2 text-sm font-semibold"
              style={{
                backgroundColor: nervous.tint,
                borderColor: nervous.border,
                color: nervous.color,
              }}
            >
              {nervous.label}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-md border border-[#dbe3e0] px-3 py-2 text-sm font-semibold text-[#607286] transition hover:bg-[#eef4f3]"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-md border border-[#f0d2cb] px-3 py-2 text-sm font-semibold text-[#9d5338] transition hover:bg-[#fff7f2]"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>
      <div className="mt-5 border-t border-[#e4ebe8] pt-4">
        <p className="text-sm font-semibold text-[#607286]">Protected today</p>
        <p className="mt-1 text-base leading-7">{anchor.protect}</p>
      </div>
    </div>
  );
}

function FocusTimer({ oneThing }: { oneThing: string }) {
  const [timer, setTimer] = useState<TimerState>(initialTimer);

  useEffect(() => {
    if (!timer.running) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current.secondsLeft <= 1) {
          const nextMode: TimerMode = current.mode === "work" ? "break" : "work";
          const nextSeconds =
            nextMode === "work"
              ? current.workMinutes * 60
              : current.breakMinutes * 60;

          return {
            ...current,
            mode: nextMode,
            running: false,
            secondsLeft: nextSeconds,
          };
        }

        return { ...current, secondsLeft: current.secondsLeft - 1 };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timer.running]);

  function setMinutes(kind: "workMinutes" | "breakMinutes", value: string) {
    const parsed = Number(value);
    const minutes = Number.isFinite(parsed)
      ? Math.min(Math.max(Math.round(parsed), 1), 90)
      : 1;

    setTimer((current) => {
      const isCurrentMode =
        (kind === "workMinutes" && current.mode === "work") ||
        (kind === "breakMinutes" && current.mode === "break");

      return {
        ...current,
        [kind]: minutes,
        secondsLeft:
          !current.running && isCurrentMode ? minutes * 60 : current.secondsLeft,
      };
    });
  }

  function resetTimer() {
    setTimer((current) => ({
      ...current,
      running: false,
      secondsLeft:
        current.mode === "work"
          ? current.workMinutes * 60
          : current.breakMinutes * 60,
    }));
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Focus Block Timer</h3>
        </div>
        <span className="rounded-md bg-[#eef4f3] px-2 py-1 text-xs font-semibold text-[#607286]">
          {timer.mode === "work" ? "25/5" : "Break"}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        Start the timer to run a focus block for the anchor. It pauses at each
        work/break boundary so you can choose the next move deliberately.
      </p>

      <div className="mt-5 flex min-h-[270px] items-center justify-center rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-5 text-center">
        {timer.mode === "work" ? (
          <div>
            <p className="mx-auto max-w-md text-2xl font-semibold leading-tight md:text-3xl">
              {oneThing}
            </p>
            <p className="mt-6 font-mono text-4xl font-semibold text-[#2a7d8e]">
              {formatTimer(timer.secondsLeft)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5" aria-label="Box breathing">
            <div className="breath-frame">
              <div className="breath-dot" />
              <span className="breath-count">4</span>
            </div>
            <div className="grid grid-cols-4 gap-2 font-mono text-sm font-semibold text-[#2a7d8e]">
              <span>4</span>
              <span>4</span>
              <span>4</span>
              <span>4</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() =>
            setTimer((current) => ({ ...current, running: !current.running }))
          }
          aria-label={timer.running ? "Pause timer" : "Start timer"}
          title={timer.running ? "Pause" : "Start"}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#243f63]"
        >
          {timer.running ? (
            <Pause className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Play className="h-5 w-5" aria-hidden="true" />
          )}
          {timer.running ? "Pause" : "Start focus"}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          aria-label="Reset timer"
          title="Reset"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-[#dbe3e0] bg-white px-4 py-3 text-sm font-semibold text-[#607286] transition hover:bg-[#eef4f3]"
        >
          <RefreshCcw className="h-5 w-5" aria-hidden="true" />
          Reset
        </button>
      </div>

      {!timer.running ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-[#607286]">
            Work
            <input
              type="number"
              min={1}
              max={90}
              value={timer.workMinutes}
              onChange={(event) => setMinutes("workMinutes", event.target.value)}
              className="mt-2 w-full rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-2 text-[#1a2e4a] outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
            />
          </label>
          <label className="text-sm font-semibold text-[#607286]">
            Break
            <input
              type="number"
              min={1}
              max={30}
              value={timer.breakMinutes}
              onChange={(event) => setMinutes("breakMinutes", event.target.value)}
              className="mt-2 w-full rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-2 text-[#1a2e4a] outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}

function TaskLog({
  anchor,
  setAnchor,
}: {
  anchor: AnchorData;
  setAnchor: (anchor: AnchorData) => void;
}) {
  const [entry, setEntry] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const [copied, setCopied] = useState(false);

  function addEntry() {
    const text = entry.trim();
    if (!text) {
      return;
    }

    setAnchor({
      ...anchor,
      taskLog: [
        { id: Date.now(), time: formatTimeOfDay(new Date()), text },
        ...anchor.taskLog,
      ],
    });
    setEntry("");
  }

  function startEditingTask(item: TaskEntry) {
    setEditingTaskId(item.id);
    setEditingTaskText(item.text);
  }

  function saveEditedTask() {
    const text = editingTaskText.trim();
    if (!editingTaskId || !text) {
      return;
    }

    setAnchor({
      ...anchor,
      taskLog: anchor.taskLog.map((item) =>
        item.id === editingTaskId ? { ...item, text } : item,
      ),
    });
    setEditingTaskId(null);
    setEditingTaskText("");
  }

  function deleteTask(id: number) {
    setAnchor({
      ...anchor,
      taskLog: anchor.taskLog.filter((item) => item.id !== id),
    });
    if (editingTaskId === id) {
      setEditingTaskId(null);
      setEditingTaskText("");
    }
  }

  async function copyLog() {
    const text = anchor.taskLog
      .slice()
      .reverse()
      .map((item) => `${item.time} - ${item.text}`)
      .join("\n");

    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Task Log</h3>
        </div>
        <button
          type="button"
          onClick={copyLog}
          disabled={anchor.taskLog.length === 0}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#dbe3e0] text-[#607286] transition hover:bg-[#eef4f3] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Copy task log"
          title={copied ? "Copied" : "Copy"}
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 flex gap-2">
        <input
          value={entry}
          onChange={(event) => setEntry(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addEntry();
            }
          }}
          placeholder="Log what you actually did"
          className="min-w-0 flex-1 rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-3 text-sm outline-none placeholder:text-[#8a9aaa] focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
        />
        <button
          type="button"
          onClick={addEntry}
          aria-label="Add task log entry"
          className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#2a7d8e] text-white transition hover:bg-[#246b79]"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 max-h-72 space-y-3 overflow-y-auto pr-1">
        {anchor.taskLog.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#dbe3e0] bg-[#fbfcfb] p-4 text-sm leading-6 text-[#607286]">
            Evidence of work will appear here as the day unfolds.
          </p>
        ) : (
          anchor.taskLog.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-3 text-sm sm:grid-cols-[4.75rem_1fr_auto]"
            >
              <span className="font-mono text-xs font-semibold text-[#8a9aaa]">
                {item.time}
              </span>
              {editingTaskId === item.id ? (
                <input
                  value={editingTaskText}
                  onChange={(event) => setEditingTaskText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      saveEditedTask();
                    }
                    if (event.key === "Escape") {
                      setEditingTaskId(null);
                      setEditingTaskText("");
                    }
                  }}
                  className="min-w-0 rounded-md border border-[#dbe3e0] bg-white px-3 py-2 text-sm outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
                />
              ) : (
                <span className="leading-5">{item.text}</span>
              )}
              <div className="flex gap-1">
                {editingTaskId === item.id ? (
                  <button
                    type="button"
                    onClick={saveEditedTask}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dbe3e0] bg-white text-[#2a7d8e] transition hover:bg-[#eef4f3]"
                    aria-label="Save task log entry"
                    title="Save"
                  >
                    <Save className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEditingTask(item)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dbe3e0] bg-white text-[#607286] transition hover:bg-[#eef4f3]"
                    aria-label="Edit task log entry"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteTask(item.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#f0d2cb] bg-white text-[#9d5338] transition hover:bg-[#fff7f2]"
                  aria-label="Delete task log entry"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EndOfDay({
  anchor,
  setAnchor,
}: {
  anchor: AnchorData;
  setAnchor: (anchor: AnchorData) => void;
}) {
  const [draft, setDraft] = useState<EndOfDay>({
    didOneThing: "Partly",
    wentWell: "",
    leaveBehind: "",
  });

  if (anchor.end) {
    return <FullDayCard anchor={anchor} setAnchor={setAnchor} />;
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">End of Day</h3>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <p className="text-sm font-semibold">Did you do the one thing?</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(["Yes", "Partly", "No"] as DidOneThing[]).map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setDraft({ ...draft, didOneThing: choice })}
                className={`rounded-lg border p-3 text-left transition ${
                  draft.didOneThing === choice
                    ? "border-[#2a7d8e] bg-[#edf8fa]"
                    : "border-[#dbe3e0] bg-[#fbfcfb] hover:border-[#9fcbd2]"
                }`}
              >
                <span className="text-sm font-semibold">{choice}</span>
                <span className="mt-1 block text-xs leading-5 text-[#607286]">
                  {didOneThingCopy[choice]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <ReflectionTextarea
          label={"What's one thing that went well?"}
          value={draft.wentWell}
          onChange={(value) => setDraft({ ...draft, wentWell: value })}
        />
        <ReflectionTextarea
          label="What do you want to leave here?"
          value={draft.leaveBehind}
          onChange={(value) => setDraft({ ...draft, leaveBehind: value })}
        />

        <button
          type="button"
          disabled={!draft.wentWell.trim() || !draft.leaveBehind.trim()}
          onClick={() => setAnchor({ ...anchor, end: draft })}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#243f63] disabled:cursor-not-allowed disabled:bg-[#9aa8b6]"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save day card
        </button>
      </div>
    </div>
  );
}

function FullDayCard({
  anchor,
  setAnchor,
}: {
  anchor: AnchorData;
  setAnchor: (anchor: AnchorData) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EndOfDay>(
    anchor.end || {
      didOneThing: "Partly",
      wentWell: "",
      leaveBehind: "",
    },
  );
  const nervous = anchor.nervous
    ? nervousOptions.find((option) => option.label === anchor.nervous)
    : null;

  if (editing) {
    return (
      <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Revise day card</h3>
        </div>
        <div className="mt-5 space-y-5">
          <div>
            <p className="text-sm font-semibold">Did you do the one thing?</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {(["Yes", "Partly", "No"] as DidOneThing[]).map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setDraft({ ...draft, didOneThing: choice })}
                  aria-pressed={draft.didOneThing === choice}
                  className={`rounded-lg border p-3 text-left transition ${
                    draft.didOneThing === choice
                      ? "border-[#2a7d8e] bg-[#edf8fa]"
                      : "border-[#dbe3e0] bg-[#fbfcfb] hover:border-[#9fcbd2]"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                    {choice}
                    {draft.didOneThing === choice ? (
                      <Check className="h-4 w-4 text-[#2a7d8e]" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#607286]">
                    {didOneThingCopy[choice]}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <ReflectionTextarea
            label={"What's one thing that went well?"}
            value={draft.wentWell}
            onChange={(value) => setDraft({ ...draft, wentWell: value })}
          />
          <ReflectionTextarea
            label="What do you want to leave here?"
            value={draft.leaveBehind}
            onChange={(value) => setDraft({ ...draft, leaveBehind: value })}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!draft.wentWell.trim() || !draft.leaveBehind.trim()}
              onClick={() => {
                setAnchor({ ...anchor, end: draft });
                setEditing(false);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#243f63] disabled:cursor-not-allowed disabled:bg-[#9aa8b6]"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Save day card
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-[#dbe3e0] px-4 py-3 text-sm font-semibold text-[#607286] transition hover:bg-[#eef4f3]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Full day card</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-md border border-[#dbe3e0] px-3 py-2 text-sm font-semibold text-[#607286] transition hover:bg-[#eef4f3]"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setAnchor({ ...anchor, end: undefined })}
            className="inline-flex items-center gap-2 rounded-md border border-[#f0d2cb] px-3 py-2 text-sm font-semibold text-[#9d5338] transition hover:bg-[#fff7f2]"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <DayCardItem label="Nervous system" value={anchor.nervous || "Not set"}>
          {nervous ? (
            <span
              className="mt-2 inline-flex rounded-md border px-2 py-1 text-xs font-semibold"
              style={{
                backgroundColor: nervous.tint,
                borderColor: nervous.border,
                color: nervous.color,
              }}
            >
              {nervous.label}
            </span>
          ) : null}
        </DayCardItem>
        <DayCardItem label="The one thing" value={anchor.oneThing} />
        <DayCardItem label="Protected" value={anchor.protect} />
        <DayCardItem
          label="Did the one thing"
          value={anchor.end?.didOneThing || "Not noted"}
        />
        <DayCardItem
          label="Went well"
          value={anchor.end?.wentWell || "Not noted"}
        />
        <DayCardItem
          label="Left behind"
          value={anchor.end?.leaveBehind || "Not noted"}
        />
      </div>
    </div>
  );
}

function DayCardItem({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
        {label}
      </p>
      {children || <p className="mt-2 text-sm leading-6">{value}</p>}
    </div>
  );
}

function TrailModule({
  trail,
  setTrail,
  trailHistory,
  setTrailHistory,
}: {
  trail: TrailToday;
  setTrail: (trail: TrailToday) => void;
  trailHistory: TrailEntry[];
  setTrailHistory: (history: TrailEntry[]) => void;
}) {
  const [examenDraft, setExamenDraft] = useState<Examen>({
    alive: trail.examen?.alive || "",
    drained: trail.examen?.drained || "",
    carry: trail.examen?.carry || "",
  });
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);

  useEffect(() => {
    setExamenDraft({
      alive: trail.examen?.alive || "",
      drained: trail.examen?.drained || "",
      carry: trail.examen?.carry || "",
    });
  }, [trail.examen]);

  const todayEntry = useMemo<TrailEntry | null>(() => {
    if (!trail.examen || !trail.terrain) {
      return null;
    }

    return {
      id: "today",
      dateLabel: "Today",
      terrain: trail.terrain,
      word: extractOneWord(trail.examen),
      examen: trail.examen,
    };
  }, [trail.examen, trail.terrain]);

  const trailEntries = useMemo(
    () => (todayEntry ? [todayEntry, ...trailHistory] : trailHistory),
    [todayEntry, trailHistory],
  );

  const selectedEntry =
    trailEntries.find((entry) => entry.id === selectedTrailId) || null;

  function saveExamen() {
    if (!trail.terrain) {
      return;
    }

    const saved = {
      alive: examenDraft.alive.trim(),
      drained: examenDraft.drained.trim(),
      carry: examenDraft.carry.trim(),
    };

    if (!saved.alive && !saved.drained && !saved.carry) {
      return;
    }

    setTrail({ ...trail, examen: saved });
    setTrailHistory(trailHistory.filter((entry) => entry.id !== "today"));
    setSelectedTrailId("today");
  }

  function clearTodayExamen() {
    setTrail({ ...trail, examen: undefined });
    setExamenDraft({ alive: "", drained: "", carry: "" });
    if (selectedTrailId === "today") {
      setSelectedTrailId(null);
    }
  }

  function deleteTrailEntry(entry: TrailEntry) {
    if (entry.id === "today") {
      clearTodayExamen();
      return;
    }

    setTrailHistory(trailHistory.filter((item) => item.id !== entry.id));
    if (selectedTrailId === entry.id) {
      setSelectedTrailId(null);
    }
  }

  return (
    <section className="space-y-5">
      <SectionHeading
        icon={MapIcon}
        label="Trail"
        title="Reflection, pace, and purpose"
        text="A map of terrain, rest, direction, and what the day taught you."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <MorningWaypoint trail={trail} setTrail={setTrail} />
        <PaceCheck trail={trail} setTrail={setTrail} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <ExamenCard
          trail={trail}
          draft={examenDraft}
          setDraft={setExamenDraft}
          saveExamen={saveExamen}
          clearExamen={clearTodayExamen}
        />
        <TrailLog
          entries={trailEntries}
          selectedEntry={selectedEntry}
          setSelectedTrailId={setSelectedTrailId}
          deleteTrailEntry={deleteTrailEntry}
        />
      </div>
    </section>
  );
}

function MorningWaypoint({
  trail,
  setTrail,
}: {
  trail: TrailToday;
  setTrail: (trail: TrailToday) => void;
}) {
  const selected = trail.terrain ? terrainMap[trail.terrain] : null;

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Compass className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Morning Waypoint</h3>
      </div>
      <p className="mt-4 text-xl font-semibold">
        What kind of terrain are you walking today?
      </p>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        Terrain is a quick shorthand for the day&apos;s working conditions. It
        helps Waypoint tune the pace and reflection prompts without turning the
        check-in into a long form.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {terrainOptions.map((option) => {
          const Icon = option.Icon;
          const isSelected = trail.terrain === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setTrail({ ...trail, terrain: option.key })}
              aria-pressed={isSelected}
              className={`rounded-lg border p-4 text-left transition ${
                isSelected
                  ? "border-[#2a7d8e] bg-[#edf8fa]"
                  : "border-[#dbe3e0] bg-[#fbfcfb] hover:border-[#9fcbd2]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                <Icon
                  className="h-5 w-5"
                  aria-hidden="true"
                  style={{ color: option.accent }}
                />
                <span className="font-semibold">{option.label}</span>
                </span>
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-semibold text-[#2a7d8e]">
                    <Check className="h-3 w-3" aria-hidden="true" />
                    Selected
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#607286]">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {selected ? (
        <p className="mt-5 rounded-lg border border-[#e4ebe8] bg-[#fffaf5] p-4 text-sm font-medium leading-6 text-[#5d6f82]">
          {selected.suggestion}
        </p>
      ) : null}
    </div>
  );
}

function PaceCheck({
  trail,
  setTrail,
}: {
  trail: TrailToday;
  setTrail: (trail: TrailToday) => void;
}) {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Leaf className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Pace Check</h3>
      </div>
      <p className="mt-4 text-xl font-semibold">
        Are you moving at a sustainable pace?
      </p>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        Pace records whether the day needs momentum, restraint, or a smaller
        next step.
      </p>
      <div className="mt-5 grid gap-2">
        {[
          { key: "yes", label: "Yes" },
          { key: "pushing", label: "Pushing too hard" },
          { key: "drifting", label: "Drifting" },
        ].map((choice) => (
          <button
            key={choice.key}
            type="button"
            onClick={() =>
              setTrail({ ...trail, pace: choice.key as PaceChoice })
            }
            aria-pressed={trail.pace === choice.key}
            className={`rounded-lg border p-3 text-left text-sm font-semibold transition ${
              trail.pace === choice.key
                ? "border-[#2a7d8e] bg-[#edf8fa]"
                : "border-[#dbe3e0] bg-[#fbfcfb] hover:border-[#9fcbd2]"
            }`}
          >
            <span className="flex items-center justify-between gap-2">
              {choice.label}
              {trail.pace === choice.key ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-semibold text-[#2a7d8e]">
                  <Check className="h-3 w-3" aria-hidden="true" />
                  Selected
                </span>
              ) : null}
            </span>
          </button>
        ))}
      </div>

      {trail.pace ? (
        <div className="mt-5 rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4 text-center">
          {trail.pace === "yes" ? (
            <CircleCheck
              className="mx-auto h-10 w-10 text-[#2a7d8e]"
              aria-label="Thumbs up"
            />
          ) : (
            <p className="text-sm font-medium leading-6 text-[#607286]">
              {paceCopy[trail.pace]}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ExamenCard({
  trail,
  draft,
  setDraft,
  saveExamen,
  clearExamen,
}: {
  trail: TrailToday;
  draft: Examen;
  setDraft: (draft: Examen) => void;
  saveExamen: () => void;
  clearExamen: () => void;
}) {
  const hasText = draft.alive.trim() || draft.drained.trim() || draft.carry.trim();

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <NotebookPen className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Examen</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#607286]">
        Save once to create today&apos;s trail marker. After that, edit these
        fields and save again to revise the marker.
      </p>
      <div className="mt-5 space-y-4">
        <ReflectionTextarea
          label="Where did you feel most alive today?"
          value={draft.alive}
          onChange={(value) => setDraft({ ...draft, alive: value })}
        />
        <ReflectionTextarea
          label="Where did you feel most drained?"
          value={draft.drained}
          onChange={(value) => setDraft({ ...draft, drained: value })}
        />
        <ReflectionTextarea
          label="What do you want to carry forward into tomorrow?"
          value={draft.carry}
          onChange={(value) => setDraft({ ...draft, carry: value })}
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveExamen}
            disabled={!trail.terrain || !hasText}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#243f63] disabled:cursor-not-allowed disabled:bg-[#9aa8b6]"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {trail.examen ? "Update reflection" : "Save reflection"}
          </button>
          {trail.examen ? (
            <button
              type="button"
              onClick={clearExamen}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#f0d2cb] px-4 py-3 text-sm font-semibold text-[#9d5338] transition hover:bg-[#fff7f2]"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear reflection
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TrailLog({
  entries,
  selectedEntry,
  setSelectedTrailId,
  deleteTrailEntry,
}: {
  entries: TrailEntry[];
  selectedEntry: TrailEntry | null;
  setSelectedTrailId: (id: string) => void;
  deleteTrailEntry: (entry: TrailEntry) => void;
}) {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Flag className="h-5 w-5 text-[#e07b39]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Trail Log</h3>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[0.85fr_1fr]">
        <div className="relative max-h-[440px] overflow-y-auto pl-5 pr-1">
          <div className="absolute bottom-3 left-[0.68rem] top-3 w-px bg-[#dbe3e0]" />
          <div className="space-y-3">
            {entries.map((entry) => {
              const terrain = terrainMap[entry.terrain];

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedTrailId(entry.id)}
                  aria-pressed={selectedEntry?.id === entry.id}
                  className={`relative w-full rounded-lg border bg-[#fbfcfb] p-3 text-left transition hover:border-[#9fcbd2] ${
                    selectedEntry?.id === entry.id
                      ? "border-[#2a7d8e]"
                      : "border-[#e4ebe8]"
                  }`}
                >
                  <span
                    className="absolute -left-[1.1rem] top-4 h-3 w-3 rounded-sm border-2 border-white"
                    style={{ backgroundColor: terrain.accent }}
                  />
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
                    {entry.dateLabel}
                  </span>
                  <span className="mt-1 block text-sm font-semibold">
                    {terrain.label}
                  </span>
                  <span className="mt-1 block text-sm text-[#607286]">
                    {entry.word}
                  </span>
                  {selectedEntry?.id === entry.id ? (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-semibold text-[#2a7d8e]">
                      <Check className="h-3 w-3" aria-hidden="true" />
                      Selected
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4">
          {selectedEntry ? (
            <TrailEntryDetail
              entry={selectedEntry}
              deleteTrailEntry={deleteTrailEntry}
            />
          ) : (
            <p className="text-sm leading-6 text-[#607286]">
              Select a marker to open the reflection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TrailEntryDetail({
  entry,
  deleteTrailEntry,
}: {
  entry: TrailEntry;
  deleteTrailEntry: (entry: TrailEntry) => void;
}) {
  const terrain = terrainMap[entry.terrain];
  const Icon = terrain.Icon;

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon
              className="h-5 w-5"
              aria-hidden="true"
              style={{ color: terrain.accent }}
            />
            <div>
              <p className="text-sm font-semibold">{terrain.label}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
                {entry.dateLabel}
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => deleteTrailEntry(entry)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#f0d2cb] bg-white text-[#9d5338] transition hover:bg-[#fff7f2]"
          aria-label="Delete trail entry"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4 space-y-4">
        <ReadOnlyReflection
          label="Most alive"
          value={entry.examen.alive || "Not noted"}
        />
        <ReadOnlyReflection
          label="Most drained"
          value={entry.examen.drained || "Not noted"}
        />
        <ReadOnlyReflection
          label="Carry forward"
          value={entry.examen.carry || "Not noted"}
        />
      </div>
    </div>
  );
}

function ReadOnlyReflection({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-[#1a2e4a]">{value}</p>
    </div>
  );
}

function ReflectionTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-2 w-full resize-none rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-[#8a9aaa] focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
      />
    </label>
  );
}

function SectionHeading({
  icon: Icon,
  label,
  title,
  text,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-[#edf8fa] p-2 text-[#2a7d8e]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#2a7d8e]">{label}</p>
          <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-[#607286]">{text}</p>
        </div>
      </div>
    </div>
  );
}

function WaypointBottomNav({
  view,
  setView,
}: {
  view: WaypointView;
  setView: (view: WaypointView) => void;
}) {
  const items: { view: WaypointView; label: string; Icon: LucideIcon }[] = [
    { view: "home", label: "Home", Icon: House },
    { view: "anchor", label: "Anchor", Icon: Anchor },
    { view: "trail", label: "Trail", Icon: MapIcon },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#dbe3e0] bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(26,46,74,0.08)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {items.map(({ view: itemView, label, Icon }) => (
          <button
            key={itemView}
            type="button"
            onClick={() => setView(itemView)}
            className={`flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-semibold transition ${
              view === itemView
                ? "bg-[#1a2e4a] text-white"
                : "text-[#607286] hover:bg-[#eef4f3]"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function formatTimeOfDay(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function extractOneWord(examen: Examen) {
  const stopWords = new Set([
    "about",
    "after",
    "again",
    "being",
    "from",
    "into",
    "more",
    "most",
    "that",
    "the",
    "this",
    "today",
    "with",
    "work",
    "your",
  ]);
  const words = `${examen.carry} ${examen.alive} ${examen.drained}`
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  return words[0] || "noted";
}

function useLocalStorageState<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Local persistence is a convenience, not a blocker for the app.
    }
  }, [key, value]);

  return [value, setValue];
}

function clampNumber(value: string, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return min;
  }

  return Math.min(Math.max(Math.round(parsed), min), max);
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

function daysBetween(dateKey: string, todayKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);
  const today = new Date(`${todayKey}T00:00:00`);
  if (Number.isNaN(date.getTime()) || Number.isNaN(today.getTime())) {
    return 999;
  }

  return Math.round((today.getTime() - date.getTime()) / 86_400_000);
}

function getWellbeingCues(
  anchor: AnchorData,
  trail: TrailToday,
  hub: HubState,
  statusLog: DowntimeStatusEntry[],
  events: DowntimeEvent[],
  risk: WellbeingRisk,
) {
  const cues: { title: string; text: string }[] = [];
  const todayKey = formatDateKey(new Date());
  const todaysEvents = events.filter((event) => event.dateKey === todayKey);

  if (!anchor.locked) {
    cues.push({
      title: "Anchor first",
      text: "Set one meaningful thing and one protected boundary before adding more controls.",
    });
  }

  if (statusLog.length === 0) {
    cues.push({
      title: "Low-demand structure",
      text: "Start with a queue check and a status line so readiness is visible.",
    });
  }

  if (!todaysEvents.some((event) => event.type === "breakTaken") || risk.eyes >= 4) {
    cues.push({
      title: "Visual fatigue control",
      text: "Use the 20-20-20 break and check monitor brightness, contrast, and glare.",
    });
  }

  if (!todaysEvents.some((event) => event.type === "movementCycle") || risk.legs >= 4) {
    cues.push({
      title: "Static standing control",
      text: "Add ankle pumps, calf raises, a short walk, or a posture change before the next loop.",
    });
  }

  if (hub.capacity === "Full" || trail.pace === "pushing" || risk.stress >= 4) {
    cues.push({
      title: "Load protection",
      text: "Choose the lowest-switching-cost task and keep the next action small enough to pause.",
    });
  }

  if (risk.clarity >= 4) {
    cues.push({
      title: "Expectation clarity",
      text: "Ask for or write down the response expectation: queue check rhythm, priority, and what counts as available.",
    });
  }

  return cues.slice(0, 3);
}

function buildManagerReadyReport(
  anchor: AnchorData,
  hub: HubState,
  statusLog: DowntimeStatusEntry[],
  events: DowntimeEvent[],
  ergonomicsDone: number,
) {
  const todayKey = formatDateKey(new Date());
  const todaysEvents = events.filter((event) => event.dateKey === todayKey);
  const taskLines = anchor.taskLog
    .slice()
    .reverse()
    .map((entry) => `- ${entry.time}: ${entry.text}`)
    .join("\n");
  const statusLines = statusLog
    .slice()
    .reverse()
    .map((entry) => `- ${entry.time}: ${entry.text}`)
    .join("\n");

  return [
    "# Waypoint Manager-Ready Summary",
    "",
    `Date: ${new Date().toLocaleDateString()}`,
    `Capacity: ${hub.capacity}`,
    `Primary work focus: ${anchor.oneThing || "Not set"}`,
    "",
    "## Availability / Status Lines",
    statusLines || "- No status lines logged.",
    "",
    "## Work Evidence",
    taskLines || "- No task entries logged.",
    "",
    "## Downtime Controls Used",
    `- Completed loops: ${todaysEvents.filter((event) => event.type === "loopComplete").length}`,
    `- Movement blocks: ${todaysEvents.filter((event) => event.type === "movementCycle").length}`,
    `- Visual breaks: ${todaysEvents.filter((event) => event.type === "breakTaken").length}`,
    `- Ergonomics checks completed: ${ergonomicsDone}`,
  ].join("\n");
}

function buildFullDayReport(
  anchor: AnchorData,
  hub: HubState,
  trail: TrailToday,
  statusLog: DowntimeStatusEntry[],
  events: DowntimeEvent[],
  ergonomicsDone: number,
) {
  const managerReport = buildManagerReadyReport(
    anchor,
    hub,
    statusLog,
    events,
    ergonomicsDone,
  );
  const terrain = trail.terrain ? terrainMap[trail.terrain].label : "Not set";

  return [
    managerReport,
    "",
    "## Personal Reflection",
    `- Nervous system: ${anchor.nervous || "Not set"}`,
    `- Protected today: ${anchor.protect || "Not set"}`,
    `- Trail terrain: ${terrain}`,
    `- Pace: ${trail.pace || "Not set"}`,
    `- End-of-day result: ${anchor.end?.didOneThing || "Not saved"}`,
    `- Went well: ${anchor.end?.wentWell || "Not saved"}`,
    `- Leave behind: ${anchor.end?.leaveBehind || "Not saved"}`,
  ].join("\n");
}

function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
