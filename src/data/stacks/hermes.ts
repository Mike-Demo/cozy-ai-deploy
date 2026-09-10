import type { AgentStack, Model } from "@/lib/types";

const models: Model[] = [
  {
    id: "hermes-3-llama3.1-8b",
    name: "Hermes 3 Llama 3.1 8B",
    ollamaName: "hermes3:8b-llama3.1-q4_0",
    description: "Hermes 3 on Llama 3.1, a helpful general-purpose assistant model.",
    sizeGb: 4.5,
    minRamGb: 10,
    recommendedRamGb: 16,
    useCases: ["General chat", "Instruction following", "Assistant workflows"],
  },
  {
    id: "hermes-2-pro-7b",
    name: "Hermes 2 Pro 7B",
    ollamaName: "hermes2pro:7b",
    description: "Hermes 2 Pro with improved tool calling and reasoning.",
    sizeGb: 4.0,
    minRamGb: 10,
    recommendedRamGb: 16,
    useCases: ["Tool use", "Reasoning", "Agent workflows"],
  },
];

export const hermesStack: AgentStack = {
  id: "hermes",
  name: "Hermes",
  shortName: "Hermes",
  icon: "🏛️",
  tagline: "Local Hermes assistant models for chat and agent tasks.",
  description:
    "Install Hermes models through Ollama and run them locally on your VPS. Hermes models are known for strong instruction following and tool-use behavior.",
  audience: "Users who want a local assistant model",
  estimatedSetupTime: "15–25 minutes",
  version: "1.0",
  requirements: {
    os: ["ubuntu-22.04", "ubuntu-24.04", "debian-12"],
    minRamGb: 10,
    recommendedRamGb: 16,
    minDiskGb: 30,
    recommendedDiskGb: 50,
    minCpu: 4,
    recommendedCpu: 8,
  },

  models,
  options: [
    {
      id: "monitoring",
      label: "Install monitoring tools",
      description: "Adds htop for watching resource usage.",
      default: false,
    },
    {
      id: "api-key",
      label: "API key protection note",
      description: "Adds a reminder about securing the Ollama API if you expose it.",
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
      title: "Pull the Hermes model",
      description: "Download the Hermes model you selected.",
      commands: ["ollama pull {{model_ollama_name}}"],
    },
    {
      title: "Test the model",
      description: "Run a quick chat to confirm the model works.",
      commands: ["ollama run {{model_ollama_name}}"],
      note: "Type a message and press Enter. Type /bye to exit.",
    },
  ],
  verificationChecks: [
    { id: "ssh", label: "SSH login successful", command: "ssh {{server_username}}@{{server_ip}}" },
    { id: "ollama-version", label: "Ollama installed", command: "ollama --version" },
    { id: "ollama-running", label: "Ollama service is running", command: "sudo systemctl status ollama", expectedOutput: "active (running)" },
    { id: "models", label: "Selected Hermes model is installed", command: "ollama list", expectedOutput: "{{model_ollama_names}}" },
    { id: "ollama-api", label: "Ollama API is responding", command: "curl http://127.0.0.1:11434/api/tags" },
  ],
  troubleshooting: [
    {
      id: "command-not-found",
      problem: "Command not found: ollama",
      solution: "Verify the binary is on PATH or reinstall.",
      commands: ["which ollama"],
    },
    {
      id: "model-download-fails",
      problem: "Model download fails",
      solution: "Check free disk space and retry.",
      commands: ["df -h", "ollama pull {{model_ollama_name}}"],
    },
    {
      id: "out-of-memory",
      problem: "Out of memory errors",
      solution: "Use a smaller Hermes variant, stop other apps, or upgrade RAM.",
      commands: ["free -h"],
    },
    {
      id: "slow-responses",
      problem: "Responses are slow",
      solution: "CPU-only servers are slower. Use a smaller model or upgrade CPU.",
    },
  ],
  recoveryCommands: [
    "sudo systemctl restart ollama",
    "ollama list",
    "curl http://127.0.0.1:11434/api/tags",
    "free -h",
    "df -h",
  ],
  supportInfoCommands: ["ollama --version", "ollama list", "free -h", "df -h"],
  launchCommand: "ollama serve",
};
