import type { AgentStack } from "@/lib/types";
import { debianOperatingSystems, rhelOperatingSystems } from "@/lib/os";

export const razerAIKITStack: AgentStack = {
  id: "razeraikit",
  name: "Razer AIKIT",
  shortName: "Razer AIKIT",
  icon: "fa-solid fa-gamepad",
  tagline: "Razer's toolkit for local inference and device control.",
  description:
    "Install Razer AIKIT on a compatible VPS or edge device to run optimized local inference pipelines and manage connected devices from a single toolkit.",
  audience: "Razer ecosystem users and edge-device builders",
  estimatedSetupTime: "20–30 minutes",
  version: "1.0",
  requirements: {
    os: [...rhelOperatingSystems, ...debianOperatingSystems],
    minRamGb: 8,
    recommendedRamGb: 16,
    minDiskGb: 40,
    recommendedDiskGb: 80,
    minCpu: 4,
    recommendedCpu: 8,
  },

  options: [
    {
      id: "device-bridge",
      label: "Install device bridge",
      description: "Installs the optional Razer device bridge service for peripheral control.",
      default: false,
    },
    {
      id: "monitoring",
      label: "Install monitoring tools",
      description: "Adds htop for watching resource usage.",
      default: false,
    },
  ],
  installSteps: [
    {
      title: "Connect to your VPS",
      description: "Log in to your server as root or a user with sudo privileges.",
      commands: ["ssh root@{{server_ip}}"],
    },
    {
      title: "Update your server",
      description: "Install the latest security and package updates.",
      commands: ["sudo apt update", "sudo apt upgrade -y"],
    },
    {
      title: "Install dependencies",
      description: "Razer AIKIT needs Python 3, pip, and a few system packages.",
      commands: ["sudo apt install python3 python3-pip python3-venv build-essential -y"],
    },
    {
      title: "Install Ollama",
      description: "Download and install Ollama for local model inference.",
      commands: ["curl -fsSL https://ollama.com/install.sh | sh"],
    },
    {
      title: "Start Ollama",
      description: "Enable and start the Ollama service.",
      commands: ["sudo systemctl enable ollama", "sudo systemctl start ollama"],
    },
    {
      title: "Pull a lightweight model",
      description: "Download a small model for AIKIT pipelines.",
      commands: ["ollama pull phi4-mini"],
    },
    {
      title: "Install Razer AIKIT",
      description: "Download and install the AIKIT package.",
      commands: ["curl -fsSL https://ai.razer.com/install.sh | bash"],
    },
    {
      title: "Configure AIKIT",
      description: "Run the setup wizard.",
      commands: ["razer-aikit setup"],
    },
    {
      title: "Launch AIKIT",
      description: "Start the AIKIT daemon.",
      commands: ["razer-aikit launch"],
    },
  ],
  verificationChecks: [
    { id: "ssh", label: "SSH login successful", command: "ssh {{server_username}}@{{server_ip}}" },
    { id: "python", label: "Python 3 is installed", command: "python3 --version" },
    { id: "ollama-running", label: "Ollama service is running", command: "sudo systemctl status ollama", expectedOutput: "active (running)" },
    { id: "ollama-api", label: "Ollama API is responding", command: "curl http://127.0.0.1:11434/api/tags" },
    { id: "aikit-version", label: "Razer AIKIT installed", command: "razer-aikit --version" },
    { id: "aikit-status", label: "AIKIT daemon is running", command: "razer-aikit status" },
  ],
  troubleshooting: [
    {
      id: "python-missing",
      problem: "Python 3 is not installed",
      solution: "Install Python 3 and pip, then retry.",
      commands: ["sudo apt install python3 python3-pip -y"],
    },
    {
      id: "aikit-not-found",
      problem: "Command not found: razer-aikit",
      solution: "Verify the binary is on PATH or reinstall.",
      commands: ["which razer-aikit"],
    },
    {
      id: "ollama-not-reachable",
      problem: "AIKIT cannot reach Ollama",
      solution: "Restart Ollama and confirm the local endpoint.",
      commands: ["curl http://127.0.0.1:11434/api/tags", "sudo systemctl restart ollama"],
    },
    {
      id: "out-of-memory",
      problem: "Out of memory errors",
      solution: "Stop other apps or upgrade RAM.",
      commands: ["free -h"],
    },
  ],
  recoveryCommands: [
    "sudo systemctl restart ollama",
    "razer-aikit restart",
    "curl http://127.0.0.1:11434/api/tags",
    "razer-aikit status",
    "free -h",
    "df -h",
  ],
  supportInfoCommands: ["python3 --version", "ollama --version", "razer-aikit --version", "razer-aikit status", "free -h", "df -h"],
  launchCommand: "razer-aikit launch",
  dashboardCommand: "razer-aikit dashboard",
};
