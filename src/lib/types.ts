export type OperatingSystem =
  | "cloudlinux-9"
  | "cloudlinux-8"
  | "almalinux-10"
  | "almalinux-9"
  | "rocky-10"
  | "rocky-9"
  | "centos-stream-10"
  | "centos-stream-9"
  | "rhel-10"
  | "rhel-9"
  | "ubuntu-24.04"
  | "ubuntu-22.04"
  | "debian-13"
  | "debian-12"
  | "windows-server-2025"
  | "windows-server-2022";

/** Command dialect an operating system uses. */
export type OsFamily = "debian" | "rhel" | "windows";

export interface ResourceRequirements {
  os: OperatingSystem[];
  minRamGb: number;
  recommendedRamGb: number;
  minDiskGb: number;
  recommendedDiskGb: number;
  minCpu: number;
  recommendedCpu: number;
  gpuRecommended?: boolean;
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
  /** Organisation that publishes and maintains the model. */
  maintainer: string;
  /** Official project or model page. */
  maintainerUrl?: string;
  /** One plain-English line on what this model suits best. */
  bestFor: string;
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
  icon: string;
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
  /** Command dialect the guide was rendered for. */
  osFamily: OsFamily;
  /** Suggested download name: `.sh` on Linux, `.ps1` on Windows Server. */
  scriptFilename: string;
  /** True when the chosen operating system is not in the stack's tested list. */
  osSupported: boolean;
}
