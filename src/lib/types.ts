export type OperatingSystem = "ubuntu-22.04" | "ubuntu-24.04" | "debian-12";

export interface ResourceRequirements {
  minRamGb: number;
  recommendedRamGb: number;
  minDiskGb: number;
  recommendedDiskGb: number;
  minCpu: number;
  recommendedCpu: number;
}

export interface Model {
  id: string;
  name: string;
  ollamaName: string;
  description: string;
  sizeGb: number;
  minRamGb: number;
  recommendedRamGb: number;
  useCases: string[];
}

export interface StackOption {
  id: string;
  label: string;
  description: string;
  default: boolean;
  extraDiskGb?: number;
  extraRamGb?: number;
}

export interface InstallStep {
  title: string;
  description: string;
  commands: string[];
  note?: string;
}

export interface VerificationCheck {
  id: string;
  label: string;
  command: string;
  expectedOutput?: string;
}

export interface TroubleshootingItem {
  id: string;
  problem: string;
  solution: string;
  commands?: string[];
}

export interface AgentStack {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  audience: string;
  estimatedSetupTime: string;
  requirements: ResourceRequirements;
  models?: Model[];
  options?: StackOption[];
  installSteps: InstallStep[];
  verificationChecks: VerificationCheck[];
  troubleshooting: TroubleshootingItem[];
  recoveryCommands?: string[];
  supportInfoCommands?: string[];
  launchCommand?: string;
  dashboardCommand?: string;
  version?: string;
}

export interface ServerDetails {
  ip: string;
  username: string;
  operatingSystem: OperatingSystem;
  ramGb?: number;
  diskGb?: number;
}

export interface WizardState {
  step: number;
  stackId: string | null;
  selectedModelIds: string[];
  selectedOptionIds: string[];
  server: ServerDetails;
}

export interface FitCheck {
  ramOk: boolean;
  diskOk: boolean;
  cpuOk: boolean;
  estimatedRamGb: number;
  estimatedDiskGb: number;
  minCpu: number;
}

export interface GeneratedGuide {
  script: string;
  oneLineCommand: string;
  steps: InstallStep[];
  verificationChecks: VerificationCheck[];
  troubleshooting: TroubleshootingItem[];
  recoveryCommands: string[];
  supportInfoCommands: string[];
  fitCheck: FitCheck;
}
