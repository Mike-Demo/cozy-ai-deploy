import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/github";

const createGistInput = z.object({
  filename: z
    .string()
    .max(100)
    .regex(/^[\w.-]+\.sh$/, "Filename must be a simple .sh name"),
  content: z.string().min(1).max(100_000),
  description: z.string().max(200),
});

export type CreateGistInput = z.infer<typeof createGistInput>;

export interface CreateGistResult {
  url: string;
}

export const createGist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createGistInput.parse(data))
  .handler(async ({ data }): Promise<CreateGistResult> => {
    const lovableApiKey = process.env["LOVABLE_API_KEY"];
    const githubApiKey = process.env["GITHUB_API_KEY"];
    if (!lovableApiKey || !githubApiKey) {
      throw new Error("GitHub is not connected for this app.");
    }

    const response = await fetch(`${GATEWAY_URL}/gists`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": githubApiKey,
      },
      body: JSON.stringify({
        description: data.description,
        public: false,
        files: { [data.filename]: { content: data.content } },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gist creation failed [${response.status}]: ${errorBody}`);
      throw new Error(`Could not save the Gist [${response.status}]: ${errorBody}`);
    }

    const body = (await response.json()) as { html_url?: string };
    if (!body.html_url) {
      throw new Error("GitHub did not return a Gist link.");
    }

    return { url: body.html_url };
  });
