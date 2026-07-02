export type TaskLibraryItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  minutes: number;
};

export const taskLibrary: TaskLibraryItem[] = [
  {
    id: "m365-tip",
    category: "Learn",
    title: "Read one Microsoft 365 tip",
    description: "Open one short support article or tip and capture one practical takeaway.",
    minutes: 10,
  },
  {
    id: "ticket-note",
    category: "Write",
    title: "Write one ticket note",
    description: "Draft a concise status line or ticket update for one recent issue.",
    minutes: 8,
  },
  {
    id: "react-hook",
    category: "Practice",
    title: "Practice one React hook",
    description: "Review a hook pattern and write one short example idea.",
    minutes: 15,
  },
  {
    id: "cyber-safety",
    category: "Read",
    title: "Read one cyber safety tip",
    description: "Review a security best practice and note one thing to share.",
    minutes: 12,
  },
  {
    id: "communication-script",
    category: "Write",
    title: "Draft one communication script",
    description: "Write a short response template for a common ticket or request.",
    minutes: 10,
  },
  {
    id: "support-drill",
    category: "Apply",
    title: "Complete one troubleshooting drill",
    description: "Pick one small diagnostic step and walk through it mentally.",
    minutes: 12,
  },
];
