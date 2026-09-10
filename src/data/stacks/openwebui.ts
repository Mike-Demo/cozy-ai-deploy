import type { AgentStack, Model } from "@/lib/types";
import {
  debianOperatingSystems,
  rhelOperatingSystems,
  windowsOperatingSystems,
} from "@/lib/os";

const models: Model[] = [
  {
    id: "qwen3.5-4b",
    name: "Qwen3.5-4B",
    ollamaName: "qwen3.5:4b",
    description: "A capable 4B-parameter model for coding and general tasks.",
    sizeGb: 2.5,
    minRamGb: 8,
    recommendedRamGb: 16,
    useCases: ["Coding assistance", "General chat", "Automation"],
    maintainer: "Alibaba Cloud (Qwen team)",
    maintainerUrl: "https://github.com/QwenLM",
    bestFor: "Coding help and general chat on a mid-sized server.",
  },
  {
    id: "phi4-mini",
    name: "Phi-4-mini",
    ollamaName: "phi4-mini",
    description: "A smaller, faster model that uses less memory.",
    sizeGb: 2.0,
    minRamGb: 6,
    recommendedRamGb: 12,
    useCases: ["Faster responses", "Lower memory usage"],
    maintainer: "Microsoft",
    maintainerUrl: "https://huggingface.co/microsoft/Phi-4-mini-instruct",
    bestFor: "Fast replies on a small server.",
  },
];

export const openWebUIStack: AgentStack = {
  id: "openwebui",
  name: "Open WebUI + Ollama",
  shortName: "Open WebUI",
  icon: "fa-solid fa-window-maximize",
  tagline: "A friendly browser chat interface for your local models.",
  description:
    "Install Ollama plus Open WebUI to chat with your models through a clean web interface running on your own server.",
  audience: "Users who prefer a browser-based chat experience",
  estimatedSetupTime: "20–25 minutes",
  version: "1.0",
  requirements: {
    os: [...rhelOperatingSystems, ...debianOperatingSystems, ...windowsOperatingSystems],
    minRamGb: 8,
    recommendedRamGb: 16,
    minDiskGb: 40,
    recommendedDiskGb: 60,
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
      id: "persistent-data",
      label: "Persistent chat data",
      description: "Mounts a Docker volume so conversations survive container restarts.",
      default: true,
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
      title: "Install Docker",
      description: "Open WebUI runs in a container.",
      commands: [
        "sudo apt install ca-certificates curl gnupg -y",
        "sudo install -m 0755 -d /etc/apt/keyrings",
        "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg",
        "echo \"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null",
        "sudo apt update",
        "sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y",
      ],
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
      title: "Pull the models",
      description: "Download the AI models you selected.",
      commands: ["ollama pull {{model_ollama_name}}"],
      note: "This command is repeated for each selected model.",
    },
    {
      title: "Run Open WebUI",
      description: "Start the Open WebUI container connected to Ollama.",
      commands: [
        "docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main",
      ],
    },
    {
      title: "Open the dashboard",
      description: "Visit the web interface and create your admin account.",
      commands: ["http://{{server_ip}}:3000"],
      note: "Open this URL in your browser. The first account created becomes admin.",
    },
  ],
  verificationChecks: [
    { id: "ssh", label: "SSH login successful", command: "ssh {{server_username}}@{{server_ip}}" },
    { id: "docker", label: "Docker is installed", command: "docker --version" },
    { id: "ollama-running", label: "Ollama service is running", command: "sudo systemctl status ollama", expectedOutput: "active (running)" },
    { id: "models", label: "Selected models are installed", command: "ollama list", expectedOutput: "{{model_ollama_names}}" },
    { id: "webui-container", label: "Open WebUI container is running", command: "docker ps --filter name=open-webui", expectedOutput: "open-webui" },
    { id: "webui-port", label: "Port 3000 is reachable", command: "curl -s -o /dev/null -w \"%{http_code}\" http://127.0.0.1:3000", expectedOutput: "200" },
  ],
  troubleshooting: [
    {
      id: "docker-not-found",
      problem: "Docker command not found",
      solution: "Re-run the Docker install steps and verify the service.",
      commands: ["docker --version", "sudo systemctl status docker"],
    },
    {
      id: "container-exits",
      problem: "Open WebUI container exits immediately",
      solution: "Check the container logs for the error.",
      commands: ["docker logs open-webui"],
    },
    {
      id: "port-blocked",
      problem: "Cannot reach port 3000",
      solution: "Check that the container is running and that your firewall allows port 3000.",
      commands: ["docker ps --filter name=open-webui", "sudo ufw status"],
    },
    {
      id: "out-of-memory",
      problem: "Out of memory errors",
      solution: "Use a smaller model, stop other apps, or upgrade RAM.",
      commands: ["free -h"],
    },
  ],
  recoveryCommands: [
    "sudo systemctl restart ollama",
    "docker restart open-webui",
    "ollama list",
    "docker logs open-webui",
    "free -h",
    "df -h",
  ],
  supportInfoCommands: ["docker --version", "ollama --version", "ollama list", "docker logs open-webui", "free -h", "df -h"],
  launchCommand: "docker start open-webui",
  dashboardCommand: "http://{{server_ip}}:3000",
};
