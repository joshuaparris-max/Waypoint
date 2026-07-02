"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Compass,
  ListChecks,
  Play,
  RefreshCcw,
  Timer,
} from "lucide-react";
import { monitoringLoop } from "../../downtimeContent";

type BuilderStep = {
  id: string;
  label: string;
  description: string;
  duration: number;
  enabled: boolean;
};

function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch {
        // ignore malformed data
      }
    }
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}

const defaultSteps: BuilderStep[] = monitoringLoop.map((item, index) => {
  const duration = item.time.includes("20:30")
    ? 1
    : item.time.includes("25:00")
    ? 5
    : item.time.includes("20:00")
    ? 20
    : 1;

  return {
    id: `step-${index}`,
    label: item.action.replace(/\.$/, ""),
    description: item.action,
    duration,
    enabled: true,
  };
});

export default function DowntimeBuilderPage() {
  const [steps, setSteps] = useLocalStorageState<BuilderStep[]>(
    "waypoint:customDowntimeLoop",
    defaultSteps,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    steps[activeIndex]?.duration * 60 || 60,
  );

  useEffect(() => {
    setSecondsLeft(steps[activeIndex]?.duration * 60 || 60);
  }, [activeIndex, steps]);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          const nextIndex = steps
            .map((step, index) => ({ step, index }))
            .filter(({ step }) => step.enabled)
            .map(({ index }) => index)
            .filter((index) => index > activeIndex)[0];

          const nextActive = nextIndex ??
            steps
              .map((step, index) => ({ step, index }))
              .filter(({ step }) => step.enabled)
              .map(({ index }) => index)[0];

          setActiveIndex(nextActive ?? 0);
          return steps[nextActive ?? 0]?.duration * 60 || 60;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running, activeIndex, steps]);

  const enabledSteps = useMemo(
    () => steps.filter((step) => step.enabled),
    [steps],
  );

  const activeStep = enabledSteps[enabledSteps.indexOf(steps[activeIndex])] ||
    enabledSteps[0] ||
    null;

  function updateStep(id: string, patch: Partial<BuilderStep>) {
    setSteps((current) =>
      current.map((step) => (step.id === id ? { ...step, ...patch } : step)),
    );
  }

  function moveStep(index: number, direction: -1 | 1) {
    setSteps((current) => {
      const next = [...current];
      const swapIndex = index + direction;
      if (swapIndex < 0 || swapIndex >= next.length) {
        return current;
      }
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next;
    });
  }

  function formatTimer(seconds: number) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-[#1a2e4a]">
      <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2a7d8e]">
              Downtime Workflow Builder
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#1a2e4a] sm:text-4xl">
              Build and run a custom low-demand loop
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5d6f82]">
              Create a tailored readiness cycle from the Level 1 IT briefing and save it for the next session.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#243f63]"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Back to Waypoint
          </Link>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#2a7d8e]">
              <ListChecks className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Custom loop steps</h2>
            </div>
            <div className="mt-6 space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#1a2e4a]">{step.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[#607286]">
                        {step.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#eef4f3] px-2 py-1 text-xs font-semibold text-[#2a7d8e]">
                        {step.duration} min
                      </span>
                      <button
                        type="button"
                        onClick={() => moveStep(index, -1)}
                        className="rounded-md border border-[#dbe3e0] bg-white p-2 text-[#607286] transition hover:bg-[#eef4f3]"
                        aria-label="Move step up"
                      >
                        <ArrowUp className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(index, 1)}
                        className="rounded-md border border-[#dbe3e0] bg-white p-2 text-[#607286] transition hover:bg-[#eef4f3]"
                        aria-label="Move step down"
                      >
                        <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#607286]">
                      <input
                        type="checkbox"
                        checked={step.enabled}
                        onChange={(event) =>
                          updateStep(step.id, { enabled: event.target.checked })
                        }
                        className="h-4 w-4 rounded border-[#dbe3e0] text-[#2a7d8e]"
                      />
                      Include in loop
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#dbe3e0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#2a7d8e]">
              <Timer className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Run loop</h2>
            </div>
            {activeStep ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-[#e4ebe8] bg-[#fbfcfb] p-5 text-center">
                  <p className="text-sm font-semibold text-[#607286]">Active step</p>
                  <p className="mt-2 text-2xl font-semibold text-[#1a2e4a]">
                    {activeStep.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#607286]">
                    {activeStep.description}
                  </p>
                  <p className="mt-5 text-4xl font-semibold text-[#2a7d8e]">
                    {formatTimer(secondsLeft)}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setRunning((current) => !current)}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#243f63]"
                  >
                    {running ? (
                      <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Play className="h-4 w-4" aria-hidden="true" />
                    )}
                    {running ? "Pause" : "Start"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRunning(false);
                      setSecondsLeft(activeStep.duration * 60);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-[#dbe3e0] bg-white px-4 py-3 text-sm font-semibold text-[#607286] transition hover:bg-[#eef4f3]"
                  >
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    Reset current
                  </button>
                </div>
                <div className="rounded-3xl border border-[#e4ebe8] bg-[#fffaf5] p-4 text-sm leading-6 text-[#5d6f82]">
                  <p className="font-semibold">Builder note</p>
                  <p className="mt-2">
                    Your custom loop is saved locally and will return on your next session.
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm leading-6 text-[#607286]">
                Enable at least one step to start the timer.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
