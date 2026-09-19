// Copies the prerendered site into dist/client, which static hosts serve.
// Idempotent: safe to re-run, and a no-op when the output already lives there.
import { cp, rm, stat, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, ".output", "public");
const target = path.join(root, "dist", "client");

async function isDirectory(dir) {
  try {
    return (await stat(dir)).isDirectory();
  } catch {
    return false;
  }
}

if (!(await isDirectory(source))) {
  if (await isDirectory(target)) {
    console.log(`[static] ${path.relative(root, target)} already holds the build output; nothing to copy.`);
    process.exit(0);
  }
  console.error(
    `[static] Missing prerender output at ${path.relative(root, source)}. Run \`vite build\` first.`,
  );
  process.exit(1);
}

await rm(target, { recursive: true, force: true });
await mkdir(path.dirname(target), { recursive: true });
await cp(source, target, { recursive: true });
console.log(`[static] Copied ${path.relative(root, source)} -> ${path.relative(root, target)}`);
