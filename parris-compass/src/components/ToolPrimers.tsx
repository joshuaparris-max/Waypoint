"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import toolPrimers from "../app/data/toolPrimers";

export default function ToolPrimers() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="rounded-lg border border-[#dbe3e0] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#2a7d8e]">Tool Primers & How-Tos</h3>
        <p className="text-xs text-[#607286]">Quick troubleshooting and reference</p>
      </div>

      <div className="mt-3 space-y-3">
        {toolPrimers.map((primer) => {
          const isOpen = openId === primer.id;
          return (
            <div key={primer.id} className="rounded-md border border-[#e4ebe8] p-3">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : primer.id)}
                className="flex w-full items-center justify-between"
              >
                <div className="text-left">
                  <p className="font-semibold text-sm text-[#1a2e4a]">{primer.title}</p>
                  <p className="mt-1 text-xs text-[#607286]">{primer.description}</p>
                </div>
                <div className="ml-3 text-[#2a7d8e]">
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </div>
              </button>

              {isOpen ? (
                <div className="mt-3 text-sm text-[#5d6f82]">
                  {primer.content.heading ? <p className="font-semibold">{primer.content.heading}</p> : null}
                  {primer.content.bullets ? (
                    <ul className="mt-2 list-disc pl-5 text-xs">
                      {primer.content.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                  {primer.content.steps ? (
                    <ol className="mt-2 list-decimal pl-5 text-xs">
                      {primer.content.steps.map((s, i) => (
                        <li key={i} className="mt-1">
                          {s}
                        </li>
                      ))}
                    </ol>
                  ) : null}
                  {primer.content.warning ? (
                    <p className="mt-3 rounded-md bg-[#fff4f4] p-2 text-xs text-[#9d3732]">{primer.content.warning}</p>
                  ) : null}
                  {primer.content.screenshotPlaceholder ? (
                    <div className="mt-3 rounded-md border border-dashed border-[#e4ebe8] p-3 text-xs text-[#607286]">
                      {primer.content.screenshotPlaceholder}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
