import { useMemo } from "react";
import type { GeneratedGuide } from "@/lib/types";
import { useGuideProgress } from "@/hooks/useGuideProgress";
import { checkTaskId, guideTaskIds, stepTaskId } from "@/lib/guide-tasks";
import { generateChecklistText } from "@/lib/generate/checklist";
import { GuideProgressBar } from "./GuideProgressBar";
import { GuideContents } from "./GuideContents";
import { GuideDownloads } from "./GuideDownloads";
import { GuideStep } from "./GuideStep";
import { Checklist } from "./Checklist";
import { CommandBlock } from "./CommandBlock";

interface GuideWalkthroughProps {
  stackId: string;
  stackName: string;
  guide: GeneratedGuide;
  estimatedTime?: string;
}

const VERIFY_ANCHOR = "verification";

export function GuideWalkthrough({
  stackId,
  stackName,
  guide,
  estimatedTime,
}: GuideWalkthroughProps) {
  const taskIds = useMemo(() => guideTaskIds(guide), [guide]);
  const progress = useGuideProgress(stackId, taskIds);
  const checklistText = useMemo(
    () => generateChecklistText(stackName, guide),
    [stackName, guide],
  );

  const stepAnchors = guide.steps.map((step, index) => stepTaskId(index, step.title));

  const scrollTo = (anchorId: string) => {
    const element = document.getElementById(anchorId);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNext = (index: number) => {
    progress.toggle(stepAnchors[index] as string, true);
    const nextAnchor = stepAnchors[index + 1] ?? VERIFY_ANCHOR;
    window.setTimeout(() => scrollTo(nextAnchor), 120);
  };

  const verificationState: Record<string, boolean> = {};
  for (const check of guide.verificationChecks) {
    verificationState[check.id] = progress.isDone(checkTaskId(check.id));
  }

  return (
    <div className="space-y-8">
      <GuideProgressBar
        completedCount={progress.completedCount}
        total={progress.total}
        percent={progress.percent}
        currentIndex={progress.currentIndex}
        estimatedTime={estimatedTime}
        onReset={progress.reset}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <GuideContents
          items={guide.steps.map((step, index) => ({
            anchorId: stepAnchors[index] as string,
            label: step.title,
            done: progress.isDone(stepAnchors[index] as string),
          }))}
        />
        <GuideDownloads
          stackId={stackId}
          stackName={stackName}
          script={guide.script}
          checklistText={checklistText}
          scriptFilename={guide.scriptFilename}
        />
      </div>

      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold text-text">
          One-command installer
        </h2>
        <p className="mb-3 text-sm text-text-muted">
          In a hurry? Paste this whole block into your terminal to run every step
          at once. Otherwise work through the steps below.
        </p>
        <CommandBlock command={guide.oneLineCommand} />
      </section>

      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold text-text">
          Step by step
        </h2>
        <div className="space-y-4">
          {guide.steps.map((step, index) => {
            const anchorId = stepAnchors[index] as string;
            return (
              <GuideStep
                key={anchorId}
                step={step}
                index={index}
                anchorId={anchorId}
                done={progress.isDone(anchorId)}
                isCurrent={progress.currentId === anchorId}
                isLast={index === guide.steps.length - 1}
                onToggle={() => progress.toggle(anchorId)}
                onNext={() => handleNext(index)}
              />
            );
          })}
        </div>
      </section>

      <section id={VERIFY_ANCHOR} className="scroll-mt-40">
        <h2 className="mb-4 font-heading text-xl font-semibold text-text">
          Verification
        </h2>
        <p className="mb-4 text-sm text-text-muted">
          Run each command and tick it off when the output looks right.
        </p>
        <Checklist
          checks={guide.verificationChecks}
          completed={verificationState}
          onToggle={(id) => progress.toggle(checkTaskId(id))}
          showCounter={false}
        />
      </section>

      {progress.allDone && (
        <div className="rounded-xl border border-success/40 bg-success-subtle/30 p-5">
          <h2 className="font-heading text-lg font-semibold text-success">
            <i className="fa-solid fa-circle-check mr-2" aria-hidden="true" />
            Installation complete
          </h2>
          <p className="mt-2 text-sm text-text">
            {stackName} is installed and every check passed. Keep the downloaded
            script handy so you can rebuild the same setup on another server.
          </p>
        </div>
      )}
    </div>
  );
}
