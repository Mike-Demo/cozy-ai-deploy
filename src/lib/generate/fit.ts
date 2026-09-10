import type { AgentStack, FitCheck, Model, ServerDetails, StackOption } from "@/lib/types";

export function computeFitCheck(
  stack: AgentStack,
  selectedModels: Model[],
  selectedOptions: StackOption[],
  server?: ServerDetails,
): FitCheck {
  const modelRam = selectedModels.reduce(
    (max, model) => Math.max(max, model.minRamGb),
    0,
  );
  const modelDisk = selectedModels.reduce(
    (sum, model) => sum + model.sizeGb,
    0,
  );
  const optionRam = selectedOptions.reduce(
    (sum, option) => sum + (option.extraRamGb ?? 0),
    0,
  );
  const optionDisk = selectedOptions.reduce(
    (sum, option) => sum + (option.extraDiskGb ?? 0),
    0,
  );

  const estimatedRamGb = Math.max(stack.requirements.minRamGb, modelRam + optionRam);
  const estimatedDiskGb = stack.requirements.minDiskGb + modelDisk + optionDisk;

  const ramGb = server?.ramGb;
  const diskGb = server?.diskGb;

  return {
    ramOk: ramGb === undefined || ramGb >= estimatedRamGb,
    diskOk: diskGb === undefined || diskGb >= estimatedDiskGb,
    cpuOk: server?.ramGb === undefined || (stack.requirements.minCpu ?? 0) <= 0,
    estimatedRamGb,
    estimatedDiskGb,
    minCpu: stack.requirements.minCpu,
  };
}
