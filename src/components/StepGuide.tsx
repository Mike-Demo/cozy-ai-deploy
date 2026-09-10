import { useState, useMemo } from "react";
import { getStackById } from "@/data/stacks";
import { generateGuide } from "@/lib/generate";
import type { ServerDetails } from "@/lib/types";
import { Checklist } from "./Checklist";
import { CommandBlock } from "./CommandBlock";
import { Troubleshooting } from "./Troubleshooting";
import { ShareActions } from "./ShareActions";
import { cn } from "@/lib/utils";

interface StepGuideProps {
  stackId: string;
  selectedModelIds: string[];
  selectedOptionIds: string[];
  server: ServerDetails;
}

type Tab = "one-command" | "steps" | "verify" | "troubleshoot";

export function StepGuide({
  stackId,
  selectedModelIds,
  selectedOptionIds,
  server,
}: StepGuideProps) {
  const [activeTab, setActiveTab] = useState<Tab>("one-command");

  const stack = getStackById(stackId);
  const guide = useMemo(() => {
    if (!stack) return null;
    const models = stack.models?.filter((m) => selectedModelIds.includes(m.id)) ?? [];
    const options = stack.options?.filter((o) => selectedOptionIds.includes(o.id)) ?? [];
    return generateGuide({ stack, selectedModels: models, selectedOptions: options, server });
  }, [stack, selectedModelIds, selectedOptionIds, server]);

  if (!stack || !guide) {
    return <p className="text-text-muted">Please complete the previous steps.</p>;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "one-command", label: "One command" },
    { id: "steps", label: "Step by step" },
    { id: "verify", label: "Verify" },
    { id: "troubleshoot", label: "Troubleshoot" },
  ];

  const downloadScript = () => {
    const blob = new Blob([guide.script], { type: "text/x-shellscript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stack.id}-install.sh`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-text">
          Your {stack.shortName} install guide
        </h2>
        <p className="mt-2 text-text-muted">
          Everything below is customized for {server.ip || "your server"} and the
          options you chose.
        </p>
      </div>

      {!guide.fitCheck.ramOk || !guide.fitCheck.diskOk ? (
        <div className="rounded-xl border border-warning/30 bg-warning-subtle/30 p-4 text-sm text-warning">
          <p className="font-medium">Server fit warning</p>
          <p className="mt-1 opacity-90">
            Your selected options need about {guide.fitCheck.estimatedRamGb} GB RAM and{" "}
            {guide.fitCheck.estimatedDiskGb} GB disk. The numbers you entered may be below
            that. You can still proceed, but performance may suffer.
          </p>
        </div>
      ) : null}

      <div className="border-b border-border">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-surface text-accent border-b-2 border-accent"
                  : "text-text-muted hover:text-text",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "one-command" && (
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Copy and paste this entire block into your terminal. It writes the
            install script to your server and runs it.
          </p>
          <CommandBlock command={guide.oneLineCommand} />
          <ShareActions
            stackId={stack.id}
            stackName={stack.name}
            script={guide.script}
            onDownload={downloadScript}
          />
        </div>
      )}

      {activeTab === "steps" && (
        <div className="space-y-6">
          {guide.steps.map((step, index) => (
            <div key={index} className="rounded-xl border border-border bg-surface p-5 print-break-inside-avoid">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent text-sm font-semibold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-medium text-text">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">
                    {step.description}
                  </p>
                  {step.note && (
                    <p className="mt-2 text-sm text-info bg-info-subtle/30 border border-info/20 rounded-lg px-3 py-2">
                      {step.note}
                    </p>
                  )}
                  <div className="mt-4 space-y-2">
                    {step.commands.map((command, cmdIndex) => (
                      <CommandBlock key={cmdIndex} command={command} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "verify" && (
        <div className="space-y-6">
          <Checklist checks={guide.verificationChecks} />
        </div>
      )}

      {activeTab === "troubleshoot" && (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-medium text-text">
              Common problems
            </h3>
            <Troubleshooting items={guide.troubleshooting} />
          </div>

          {guide.recoveryCommands.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-medium text-text">
                Five-minute recovery
              </h3>
              <p className="text-sm text-text-muted">
                Run these commands in order to resolve many common issues:
              </p>
              {guide.recoveryCommands.map((command, index) => (
                <CommandBlock key={index} command={command} />
              ))}
            </div>
          )}

          {guide.supportInfoCommands.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-medium text-text">
                Information to provide support
              </h3>
              <p className="text-sm text-text-muted">
                Include the output from these commands when contacting support:
              </p>
              {guide.supportInfoCommands.map((command, index) => (
                <CommandBlock key={index} command={command} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
