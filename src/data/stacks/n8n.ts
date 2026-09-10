import type { AgentStack } from "@/lib/types";

export const n8nStack: AgentStack = {
  id: "n8n",
  name: "n8n + Ollama",
  shortName: "n8n",
  icon: "fa-solid fa-diagram-project",
  tagline: "Self-hosted automation workflows that call local AI models.",
  description:
    "Install n8n workflow automation alongside Ollama so your workflows can use local LLMs without sending data to third parties.",
  audience: "Automation builders who want AI-powered workflows",
  estimatedSetupTime: "20–25 minutes",
  version: "1.0",
  requirements: {
    os: ["ubuntu-22.04", "ubuntu-24.04", "debian-12"],
    minRamGb: 8,
    recommendedRamGb: 16,
    minDiskGb: 40,
    recommendedDiskGb: 60,
    minCpu: 4,
    recommendedCpu: 8,
  },

  options: [
    {
      id: "persistent-data",
      label: "Persistent workflow data",
      description: "Mounts a Docker volume so workflows and credentials survive container restarts.",
      default: true,
    },
    {
      id: "basic-auth",
      label: "Enable basic authentication",
      description: "Sets N8N_BASIC_AUTH_USER and N8N_BASIC_AUTH_PASSWORD in the run command.",
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
      title: "Install Docker",
      description: "n8n runs in a container.",
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
      description: "Download and install Ollama for local model inference.",
      commands: ["curl -fsSL https://ollama.com/install.sh | sh"],
    },
    {
      title: "Start Ollama",
      description: "Enable and start the Ollama service.",
      commands: ["sudo systemctl enable ollama", "sudo systemctl start ollama"],
    },
    {
      title: "Pull a model for n8n",
      description: "Download a small model suitable for workflow calls.",
      commands: ["ollama pull phi4-mini"],
    },
    {
      title: "Run n8n",
      description: "Start the n8n container.",
      commands: [
        "docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n --restart always docker.n8n.io/n8nio/n8n",
      ],
    },
    {
      title: "Open the dashboard",
      description: "Finish setup in the browser.",
      commands: ["http://{{server_ip}}:5678"],
      note: "Open this URL in your browser and create your n8n account.",
    },
    {
      title: "Add the Ollama credential",
      description: "In n8n, create an Ollama credential pointing to http://host.docker.internal:11434.",
      commands: [],
      note: "Use the Ollama node in workflows with the model phi4-mini.",
    },
  ],
  verificationChecks: [
    { id: "ssh", label: "SSH login successful", command: "ssh {{server_username}}@{{server_ip}}" },
    { id: "docker", label: "Docker is installed", command: "docker --version" },
    { id: "ollama-running", label: "Ollama service is running", command: "sudo systemctl status ollama", expectedOutput: "active (running)" },
    { id: "ollama-api", label: "Ollama API is responding", command: "curl http://127.0.0.1:11434/api/tags" },
    { id: "n8n-container", label: "n8n container is running", command: "docker ps --filter name=n8n", expectedOutput: "n8n" },
    { id: "n8n-port", label: "Port 5678 is reachable", command: "curl -s -o /dev/null -w \"%{http_code}\" http://127.0.0.1:5678/healthz", expectedOutput: "200" },
  ],
  troubleshooting: [
    {
      id: "docker-not-found",
      problem: "Docker command not found",
      solution: "Re-run the Docker install steps.",
      commands: ["docker --version", "sudo systemctl status docker"],
    },
    {
      id: "container-exits",
      problem: "n8n container exits immediately",
      solution: "Check the container logs.",
      commands: ["docker logs n8n"],
    },
    {
      id: "ollama-not-reachable",
      problem: "n8n cannot reach Ollama",
      solution: "Use host.docker.internal:11434 from inside the n8n container, or restart Ollama.",
      commands: ["curl http://127.0.0.1:11434/api/tags", "sudo systemctl restart ollama"],
    },
    {
      id: "port-blocked",
      problem: "Cannot reach port 5678",
      solution: "Check that the container is running and that your firewall allows port 5678.",
      commands: ["docker ps --filter name=n8n", "sudo ufw status"],
    },
  ],
  recoveryCommands: [
    "sudo systemctl restart ollama",
    "docker restart n8n",
    "curl http://127.0.0.1:11434/api/tags",
    "docker logs n8n",
    "free -h",
    "df -h",
  ],
  supportInfoCommands: ["docker --version", "ollama --version", "docker logs n8n", "free -h", "df -h"],
  launchCommand: "docker start n8n",
  dashboardCommand: "http://{{server_ip}}:5678",
};
