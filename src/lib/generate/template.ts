import type { Model, ServerDetails } from "@/lib/types";

export interface TemplateContext {
  server: ServerDetails;
  models: Model[];
}

export function renderTemplate(
  template: string,
  context: TemplateContext,
): string {
  const model = context.models[0];
  const modelNames = context.models.map((m) => m.ollamaName);

  return template
    .replace(/\{\{server_ip\}\}/g, context.server.ip || "YOUR_SERVER_IP")
    .replace(
      /\{\{server_username\}\}/g,
      context.server.username || "root",
    )
    .replace(
      /\{\{model_ollama_name\}\}/g,
      model?.ollamaName || "MODEL_NAME",
    )
    .replace(
      /\{\{model_ollama_names\}\}/g,
      modelNames.join(", ") || "MODEL_NAME",
    );
}

export function renderArray(
  templates: string[],
  context: TemplateContext,
): string[] {
  return templates.map((t) => renderTemplate(t, context));
}
