export type ToolPrimer = {
  id: string;
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
  content: {
    heading?: string;
    bullets?: string[];
    steps?: string[];
    warning?: string;
    screenshotPlaceholder?: string;
    meta?: Record<string, string>;
  };
};

export const toolPrimers: ToolPrimer[] = [
  {
    id: "rdp-troubleshoot",
    title: "Windows Remote Desktop & RemoteApps",
    description:
      "Actionable troubleshooting primer for common RDP and RemoteApp connection failures, with emphasis on certificate/TLS issues.",
    priority: "high",
    content: {
      heading: "What it is",
      bullets: [
        "Primary method for clients to securely connect to on-prem servers or VDI.",
        "Often managed via Remote Desktop Gateway (RDG) or VPN/Work Resource tools such as Pritunl.",
      ],
      steps: [
        "Reproduce the error on an internal VM to determine whether the problem is client or server side.",
        "If error reads 'An internal error has occurred' or event log shows 0x8009030D, treat as a certificate/TLS server credential private key issue.",
        "Client-first checks: ensure the user opens Control Panel → RemoteApp and Desktop Connections and refreshes or updates the connection (RemoteApp connection update).",
        "If certificate is required: distribute and install the current .cer to the client's Current User and Local Machine Trusted Root/Personal stores (example name: hinesrdpnew.cer).",
        "Verify RDP security permissions and certificate/private key ACLs on the server. Do not change encryption settings without senior tech approval.",
        "Connectivity checks: confirm VPN (Pritunl) or RDG client is connected, validate user is using the correct RDP icon/file, and, if remote, check server status via Datto RMM.",
      ],
      screenshotPlaceholder: "RemoteApp and Desktop Connections (Control Panel) - screenshot placeholder",
      warning:
        "Technician guardrail: Do not perform server-side encryption or registry changes unless directed by a senior technician.",
      meta: {
        errorCodes: "0x8009030D",
        commonFixClient: "Refresh RemoteApp connection; install .cer into Current User and Local Machine stores",
      },
    },
  },
  {
    id: "llm-creative",
    title: "LLM Creative Research: Castle Crydee (Fictional Architecture)",
    description:
      "Example creative AI research note that demonstrates generative LLM use for detailed world-building and architectural description.",
    priority: "low",
    content: {
      heading: "What it is",
      bullets: [
        "An example of using generative AI for highly specific world-building and descriptive content.",
        "Designated low priority so it doesn't distract from higher-impact business primers.",
      ],
      steps: [
        "Structure description: late Norman / early medieval northern European keep, curtain walls, outbuildings.",
        "Layout: sits on a large hill separated from town by meadows and woodlands.",
        "Internal features: garrison quarters, courtyard, large dining hall with mentorship scenes.",
      ],
      meta: {
        tool: "Gemini/LLM",
        author: "Josh Parris",
      },
    },
  },
];

export default toolPrimers;
