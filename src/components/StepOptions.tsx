import { getStackById } from "@/data/stacks";
import { cn } from "@/lib/utils";

interface StepOptionsProps {
  stackId: string;
  selectedModelIds: string[];
  selectedOptionIds: string[];
  onToggleModel: (id: string) => void;
  onToggleOption: (id: string) => void;
}

export function StepOptions({
  stackId,
  selectedModelIds,
  selectedOptionIds,
  onToggleModel,
  onToggleOption,
}: StepOptionsProps) {
  const stack = getStackById(stackId);

  if (!stack) {
    return <p className="text-text-muted">Please select a stack first.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-text">
          Choose options for {stack.shortName}
        </h2>
        <p className="mt-2 text-text-muted">
          Select the models and extras you want included in your guide.
        </p>
      </div>

      {stack.models && stack.models.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-heading text-lg font-medium text-text">Models</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {stack.models.map((model) => {
              const selected = selectedModelIds.includes(model.id);
              return (
                <div key={model.id} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => onToggleModel(model.id)}
                    className={cn(
                      "flex flex-col text-left rounded-xl border-2 p-4 transition-all",
                      selected
                        ? "border-accent bg-accent-subtle/30"
                        : "border-border bg-surface hover:border-accent/50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium text-text">{model.name}</span>
                      {selected && (
                        <i className="fa-solid fa-circle-check text-accent" aria-hidden="true" />
                      )}
                    </div>
                    <span className="mt-1 text-xs text-text-muted">
                      <i className="fa-solid fa-building mr-1.5" aria-hidden="true" />
                      Maintained by {model.maintainer}
                    </span>
                    <p className="mt-2 text-sm text-text-muted">
                      {model.description}
                    </p>
                    <p className="mt-2 text-sm text-text">
                      <span className="font-medium">Best for: </span>
                      {model.bestFor}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-muted">
                      <span className="rounded-full bg-surface-muted px-2 py-1">
                        ~{model.sizeGb} GB
                      </span>
                      <span className="rounded-full bg-surface-muted px-2 py-1">
                        {model.minRamGb} GB RAM min
                      </span>
                    </div>
                  </button>
                  {model.maintainerUrl && (
                    <a
                      href={model.maintainerUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-2 inline-flex items-center gap-1.5 self-start text-xs font-medium text-accent hover:underline"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                      Official project page
                    </a>
                  )}
                </div>
              );
            })}
          </div>
          {stack.models.length > 1 && (
            <p className="text-sm text-text-muted">
              <i className="fa-solid fa-circle-info mr-1.5 text-accent" aria-hidden="true" />
              Not sure? Pick the smallest model if your server has less memory —
              bigger models answer better but need more RAM and disk space.
            </p>
          )}
        </section>
      )}

      {stack.options && stack.options.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-heading text-lg font-medium text-text">Extras</h3>
          <div className="space-y-3">
            {stack.options.map((option) => {
              const selected = selectedOptionIds.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors",
                    selected
                      ? "border-accent bg-accent-subtle/30"
                      : "border-border bg-surface hover:border-accent/50",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleOption(option.id)}
                    className="mt-0.5 h-5 w-5 rounded border-border text-accent focus:ring-accent"
                  />
                  <div>
                    <span className="font-medium text-sm text-text">
                      {option.label}
                    </span>
                    <p className="text-sm text-text-muted">
                      {option.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
