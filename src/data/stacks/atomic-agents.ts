import type { AgentStack, Model } from "@/lib/types";
import { debianOperatingSystems, rhelOperatingSystems } from "@/lib/os";

const models: Model[] = [
  {
    id: "qwen3.5-4b",
    name: "Qwen3.5-4B",
    ollamaName: "qwen3.5:4b",
    description: "A capable 4B-parameter model good for coding and general tasks.",
    sizeGb: 2.5,
    minRamGb: 8,
    recommendedRamGb: 16,
    useCases: ["Agent pipelines", "Coding assistance", "Structured output"],
    maintainer: "Alibaba Cloud (Qwen team)",
    maintainerUrl: "https://github.com/QwenLM",
    bestFor: "Agent steps that need to return well-formed structured answers.",
  },
  {
    id: "phi4-mini",
    name: "Phi-4-mini",
    ollamaName: "phi4-mini",
    description: "A smaller, faster model that uses less memory.",
    sizeGb: 2.0,
    minRamGb: 6,
    recommendedRamGb: 12,
    useCases: ["Smaller VPS plans", "Fast agent loops", "Logic and reasoning"],
    maintainer: "Microsoft",
    maintainerUrl: "https://huggingface.co/microsoft/Phi-4-mini-instruct",
    bestFor: "Quick multi-step agent runs on a small server.",
  },
  {
    id: "llama3.2-3b",
    name: "Llama 3.2 3B",
    ollamaName: "llama3.2:3b",
    description: "Meta's lightweight instruction-tuned model.",
    sizeGb: 2.0,
    minRamGb: 6,
    recommendedRamGb: 12,
    useCases: ["Chat agents", "Lightweight tasks", "Prototyping"],
    maintainer: "Meta",
    maintainerUrl: "https://www.llama.com/",
    bestFor: "Trying out an agent pipeline when memory is tight.",
  },
];

export const atomicAgentsStack: AgentStack = {
  id: "atomic-agents",
  name: "Atomic Agents",
  shortName: "Atomic Agents",
  icon: "fa-solid fa-atom",
  tagline: "Build small, composable AI agents in Python on your own server.",
  description:
    "Install the Atomic Agents Python framework alongside Ollama so you can build agent pipelines from small, testable pieces. Each agent has a clear input and output schema, and everything runs against a local model on your VPS.",
  audience: "Python developers building their own agent workflows",
  estimatedSetupTime: "20–30 minutes",
  version: "1.0",
  requirements: {
    os: [...rhelOperatingSystems, ...debianOperatingSystems],
    minRamGb: 8,
    recommendedRamGb: 16,
    minDiskGb: 25,
    recommendedDiskGb: 50,
    minCpu: 2,
    recommendedCpu: 4,
  },

  models,
  options: [
    {
      id: "example-pipeline",
      label: "Add a starter agent script",
      description: "Writes a small example agent you can run straight away.",
      default: true,
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
      title: "Install Python and build tools",
      description: "Atomic Agents needs Python 3, pip and a virtual environment.",
      commands: ["sudo apt install python3 python3-pip python3-venv build-essential -y"],
    },
    {
      title: "Install Ollama",
      description: "Download and install Ollama so your agents have a local model to call.",
      commands: ["curl -fsSL https://ollama.com/install.sh | sh"],
    },
    {
      title: "Start and enable Ollama",
      description: "Make sure Ollama starts automatically with the server.",
      commands: ["sudo systemctl enable ollama", "sudo systemctl start ollama"],
    },
    {
      title: "Pull the models",
      description: "Download the AI models you selected.",
      commands: ["ollama pull {{model_ollama_name}}"],
      note: "This command is repeated for each selected model.",
    },
    {
      title: "Create a project folder and virtual environment",
      description: "Keep the Python packages separate from the system ones.",
      commands: [
        "mkdir -p /opt/atomic-agents",
        "cd /opt/atomic-agents",
        "python3 -m venv .venv",
        "source .venv/bin/activate",
      ],
    },
    {
      title: "Install Atomic Agents",
      description: "Install the framework and an OpenAI-compatible client for Ollama.",
      commands: [
        "pip install --upgrade pip",
        "pip install atomic-agents instructor openai",
      ],
    },
    {
      title: "Write a starter agent",
      description: "Create a small script that sends one message to your local model.",
      commands: [
        "cat > /opt/atomic-agents/hello_agent.py <<'PY'\nimport instructor\nimport openai\nfrom atomic_agents.agents.base_agent import BaseAgent, BaseAgentConfig\n\nclient = instructor.from_openai(\n    openai.OpenAI(base_url=\"http://127.0.0.1:11434/v1\", api_key=\"ollama\"),\n    mode=instructor.Mode.JSON,\n)\n\nagent = BaseAgent(BaseAgentConfig(client=client, model=\"{{model_ollama_name}}\"))\nprint(agent.run(agent.input_schema(chat_message=\"Say hello in one sentence.\")).chat_message)\nPY",
      ],
      note: "Only needed if you chose the starter agent script.",
    },
    {
      title: "Run your first agent",
      description: "Check the whole chain works end to end.",
      commands: [
        "cd /opt/atomic-agents",
        "source .venv/bin/activate",
        "python hello_agent.py",
      ],
    },
  ],
  verificationChecks: [
    { id: "ssh", label: "SSH login successful", command: "ssh {{server_username}}@{{server_ip}}" },
    { id: "python", label: "Python 3 is installed", command: "python3 --version" },
    { id: "ollama-running", label: "Ollama service is running", command: "sudo systemctl status ollama", expectedOutput: "active (running)" },
    { id: "ollama-api", label: "Ollama API is responding", command: "curl http://127.0.0.1:11434/api/tags" },
    { id: "models", label: "Selected models are installed", command: "ollama list", expectedOutput: "{{model_ollama_names}}" },
    { id: "atomic-installed", label: "Atomic Agents is installed", command: "/opt/atomic-agents/.venv/bin/pip show atomic-agents" },
    { id: "agent-runs", label: "The starter agent replies", command: "/opt/atomic-agents/.venv/bin/python /opt/atomic-agents/hello_agent.py" },
  ],
  troubleshooting: [
    {
      id: "python-missing",
      problem: "Python 3 or pip is missing",
      solution: "Install Python 3, pip and the virtual environment package, then retry.",
      commands: ["sudo apt install python3 python3-pip python3-venv -y"],
    },
    {
      id: "externally-managed",
      problem: "pip refuses to install: externally-managed-environment",
      solution:
        "Install inside the virtual environment instead of system-wide. Activate it first, then install.",
      commands: ["cd /opt/atomic-agents", "source .venv/bin/activate", "pip install atomic-agents"],
    },
    {
      id: "module-not-found",
      problem: "ModuleNotFoundError: no module named atomic_agents",
      solution: "The virtual environment is not active. Activate it, then run the script again.",
      commands: ["source /opt/atomic-agents/.venv/bin/activate", "python hello_agent.py"],
    },
    {
      id: "connection-refused",
      problem: "Connection refused when the agent calls the model",
      solution: "Ollama is not running or not listening locally. Restart it and check the API.",
      commands: ["sudo systemctl restart ollama", "curl http://127.0.0.1:11434/api/tags"],
    },
    {
      id: "model-not-found",
      problem: "The model name is not found",
      solution: "Pull the model and make sure the name in your script matches the list exactly.",
      commands: ["ollama list", "ollama pull {{model_ollama_name}}"],
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
    "ollama list",
    "curl http://127.0.0.1:11434/api/tags",
    "source /opt/atomic-agents/.venv/bin/activate",
    "free -h",
    "df -h",
  ],
  supportInfoCommands: [
    "python3 --version",
    "ollama --version",
    "ollama list",
    "/opt/atomic-agents/.venv/bin/pip show atomic-agents",
    "free -h",
    "df -h",
  ],
  launchCommand: "/opt/atomic-agents/.venv/bin/python /opt/atomic-agents/hello_agent.py",
};
