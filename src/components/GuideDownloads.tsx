import { downloadTextFile } from "@/lib/download";
import { ShareActions } from "./ShareActions";

interface GuideDownloadsProps {
  stackId: string;
  stackName: string;
  script: string;
  checklistText: string;
}

export function GuideDownloads({
  stackId,
  stackName,
  script,
  checklistText,
}: GuideDownloadsProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4 print:hidden">
      <p className="text-sm font-medium text-text">Take it with you</p>
      <ShareActions
        stackId={stackId}
        stackName={stackName}
        script={script}
        onDownload={() =>
          downloadTextFile(`${stackId}-install.sh`, script, "text/x-shellscript")
        }
      />
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            downloadTextFile(
              `${stackId}-checklist.txt`,
              checklistText,
              "text/plain",
            )
          }
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-muted"
        >
          <i className="fa-solid fa-list-check" aria-hidden="true" />
          Download checklist
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-muted"
        >
          <i className="fa-solid fa-print" aria-hidden="true" />
          Print guide
        </button>
      </div>
    </div>
  );
}
