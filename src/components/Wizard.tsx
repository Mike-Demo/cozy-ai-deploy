import { useState } from "react";
import { getStackById } from "@/data/stacks";
import type { ServerDetails, WizardState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StepGuide } from "./StepGuide";
import { StepOptions } from "./StepOptions";
import { StepSelectStack } from "./StepSelectStack";
import { StepServer } from "./StepServer";

const initialServer: ServerDetails = {
  ip: "",
  username: "root",
  operatingSystem: "ubuntu-22.04",
};

const initialState: WizardState = {
  step: 0,
  stackId: null,
  selectedModelIds: [],
  selectedOptionIds: [],
  server: initialServer,
};

export function Wizard() {
  const [state, setState] = useState<WizardState>(initialState);

  const setStep = (step: number) => setState((s) => ({ ...s, step }));

  const selectStack = (stackId: string) => {
    const stack = getStackById(stackId);
    const defaultModelIds = stack?.models?.slice(0, 1).map((m) => m.id) ?? [];
    const defaultOptionIds =
      stack?.options?.filter((o) => o.default).map((o) => o.id) ?? [];

    setState({
      ...initialState,
      step: 1,
      stackId,
      selectedModelIds: defaultModelIds,
      selectedOptionIds: defaultOptionIds,
      server: initialServer,
    });
  };

  const toggleModel = (modelId: string) => {
    setState((s) => {
      const has = s.selectedModelIds.includes(modelId);
      return {
        ...s,
        selectedModelIds: has
          ? s.selectedModelIds.filter((id) => id !== modelId)
          : [...s.selectedModelIds, modelId],
      };
    });
  };

  const toggleOption = (optionId: string) => {
    setState((s) => {
      const has = s.selectedOptionIds.includes(optionId);
      return {
        ...s,
        selectedOptionIds: has
          ? s.selectedOptionIds.filter((id) => id !== optionId)
          : [...s.selectedOptionIds, optionId],
      };
    });
  };

  const updateServer = (server: ServerDetails) => {
    setState((s) => ({ ...s, server }));
  };

  const steps = [
    { id: 0, label: "Stack" },
    { id: 1, label: "Options" },
    { id: 2, label: "Server" },
    { id: 3, label: "Guide" },
  ];

  const canProceed = () => {
    if (state.step === 0) return !!state.stackId;
    if (state.step === 1) {
      const stack = getStackById(state.stackId ?? "");
      if (!stack) return false;
      if (stack.models && stack.models.length > 0) {
        return state.selectedModelIds.length > 0;
      }
      return true;
    }
    if (state.step === 2) return state.server.ip.trim().length > 0;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => {
                  if (step.id <= state.step) setStep(step.id);
                }}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  state.step >= step.id
                    ? "bg-accent text-text-inverse"
                    : "bg-surface-muted text-text-muted",
                  step.id < state.step && "cursor-pointer hover:bg-accent-hover",
                )}
              >
                {step.id + 1}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-1 flex-1 mx-2 rounded",
                    state.step > step.id ? "bg-accent" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs font-medium text-text-muted">
          {steps.map((step) => (
            <span key={step.id} className="w-9 text-center">
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-8 shadow-sm">
        {state.step === 0 && (
          <StepSelectStack
            selectedId={state.stackId}
            onSelect={selectStack}
          />
        )}
        {state.step === 1 && state.stackId && (
          <StepOptions
            stackId={state.stackId}
            selectedModelIds={state.selectedModelIds}
            selectedOptionIds={state.selectedOptionIds}
            onToggleModel={toggleModel}
            onToggleOption={toggleOption}
          />
        )}
        {state.step === 2 && (
          <StepServer server={state.server} onChange={updateServer} />
        )}
        {state.step === 3 && state.stackId && (
          <StepGuide
            stackId={state.stackId}
            selectedModelIds={state.selectedModelIds}
            selectedOptionIds={state.selectedOptionIds}
            server={state.server}
          />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, state.step - 1))}
          disabled={state.step === 0}
          className={cn(
            "rounded-xl px-5 py-2.5 text-sm font-medium transition-colors",
            state.step === 0
              ? "bg-surface-muted text-text-muted cursor-not-allowed"
              : "bg-surface text-text hover:bg-surface-muted border border-border",
          )}
        >
          Back
        </button>
        {state.step < 3 && (
          <button
            type="button"
            onClick={() => setStep(state.step + 1)}
            disabled={!canProceed()}
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-medium transition-colors",
              canProceed()
                ? "bg-accent text-text-inverse hover:bg-accent-hover"
                : "bg-surface-muted text-text-muted cursor-not-allowed",
            )}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
