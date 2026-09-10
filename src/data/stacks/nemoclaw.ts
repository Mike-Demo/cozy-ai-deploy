import type { AgentStack, Model } from "@/lib/types";

const models: Model[] = [
  {
    id: "nemotron-4b",
    name: "Nemotron-4B",
    ollamaName: "nemotron-mini:4b",
    description: "NVIDIA's small reasoning model, useful for agentic workflows.",
    sizeGb: 2.5,
    minRamGb: 8,
    recommendedRamGb: 16,
    useCases: ["Reasoning", "Agent orchestration", "GPU-accelerated inference"],
    maintainer: "NVIDIA",
    maintainerUrl: "https://huggingface.co/nvidia",
    bestFor: "Reasoning and agent orchestration on a GPU server.",
  },
];

export const nemoClawStack: AgentStack = {
  id: "nemoclaw",
  name: "NVIDIA NemoClaw",
  shortName: "NemoClaw",
  icon: "fa-solid fa-microchip",
  tagline: "NVIDIA's agent stack for GPU-powered inference.",
  description:
    "Deploy NVIDIA NemoClaw on a GPU-equipped VPS to run agent workflows accelerated by NVIDIA inference tools. CPU-only servers will run much more slowly.",
  audience: "Users with an NVIDIA GPU VPS who want NVIDIA-optimized agents",
  estimatedSetupTime: "25–35 minutes",
  version: "1.0",
  requirements: {
    os: ["ubuntu-22.04", "ubuntu-24.04"],
    minRamGb: 16,
    recommendedRamGb: 32,
    minDiskGb: 60,
    recommendedDiskGb: 100,
    minCpu: 4,
    recommendedCpu: 8,
    gpuRecommended: true,
  },

  models,
  options: [
    {
      id: "gpu-drivers",
      label: "Install NVIDIA drivers",
      description: "Adds driver and CUDA toolkit installation steps. Only choose if your VPS has an NVIDIA GPU.",
      default: true,
    },
    {
      id: "monitoring",
      label: "Install monitoring tools",
      description: "Adds htop and nvidia-smi helpers.",
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
      title: "Verify GPU availability",
      description: "Confirm an NVIDIA GPU is present before continuing.",
      commands: ["lspci | grep -i nvidia"],
      note: "If nothing appears, this stack is not suitable for your server.",
    },
    {
      title: "Update your server",
      description: "Install the latest security and package updates.",
      commands: ["sudo apt update", "sudo apt upgrade -y"],
    },
    {
      title: "Install NVIDIA drivers",
      description: "Install the recommended driver for your GPU.",
      commands: [
        "sudo apt install linux-headers-$(uname -r) -y",
        "sudo apt install nvidia-driver-535 -y",
        "sudo reboot",
      ],
      note: "The server will reboot. Reconnect afterwards.",
    },
    {
      title: "Install Ollama",
      description: "Download and install Ollama.",
      commands: ["curl -fsSL https://ollama.com/install.sh | sh"],
    },
    {
      title: "Start Ollama",
      description: "Enable and start the Ollama service.",
      commands: ["sudo systemctl enable ollama", "sudo systemctl start ollama"],
    },
    {
      title: "Pull the model",
      description: "Download the model you selected.",
      commands: ["ollama pull {{model_ollama_name}}"],
    },
    {
      title: "Install NemoClaw",
      description: "Download the NemoClaw installer.",
      commands: ["curl -fsSL https://nemoclaw.ai/install.sh | bash"],
    },
    {
      title: "Configure NemoClaw",
      description: "Point NemoClaw at the local Ollama endpoint.",
      commands: ["nemoclaw configure --ollama http://127.0.0.1:11434"],
    },
    {
      title: "Launch NemoClaw",
      description: "Start the NemoClaw gateway.",
      commands: ["nemoclaw launch"],
    },
  ],
  verificationChecks: [
    { id: "ssh", label: "SSH login successful", command: "ssh {{server_username}}@{{server_ip}}" },
    { id: "gpu", label: "NVIDIA GPU detected", command: "nvidia-smi" },
    { id: "ollama-running", label: "Ollama service is running", command: "sudo systemctl status ollama", expectedOutput: "active (running)" },
    { id: "models", label: "Selected model is installed", command: "ollama list", expectedOutput: "{{model_ollama_names}}" },
    { id: "nemoclaw-version", label: "NemoClaw installed", command: "nemoclaw --version" },
    { id: "nemoclaw-doctor", label: "NemoClaw diagnostics pass", command: "nemoclaw doctor" },
  ],
  troubleshooting: [
    {
      id: "no-gpu",
      problem: "No GPU detected",
      solution: "This stack needs an NVIDIA GPU. Switch to a CPU-friendly stack like OpenClaw + Ollama.",
      commands: ["lspci | grep -i nvidia"],
    },
    {
      id: "driver-fails",
      problem: "NVIDIA driver installation fails",
      solution: "Install the headers for your kernel and try the recommended driver version.",
      commands: ["uname -r", "sudo apt install linux-headers-$(uname -r) -y"],
    },
    {
      id: "out-of-memory",
      problem: "Out of memory errors",
      solution: "Close other GPU processes or upgrade to a VPS with more GPU memory.",
      commands: ["nvidia-smi", "free -h"],
    },
    {
      id: "nemoclaw-cannot-connect",
      problem: "NemoClaw cannot connect to Ollama",
      solution: "Restart Ollama and re-run configuration.",
      commands: ["sudo systemctl restart ollama", "nemoclaw configure --ollama http://127.0.0.1:11434"],
    },
  ],
  recoveryCommands: [
    "sudo systemctl restart ollama",
    "ollama list",
    "nemoclaw doctor",
    "nvidia-smi",
    "free -h",
    "df -h",
    "nemoclaw launch",
  ],
  supportInfoCommands: ["nvidia-smi", "ollama --version", "nemoclaw --version", "nemoclaw doctor", "ollama list", "free -h", "df -h"],
  launchCommand: "nemoclaw launch",
  dashboardCommand: "nemoclaw dashboard",
};
