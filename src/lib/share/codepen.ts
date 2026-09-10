/**
 * Opens CodePen with the given script prefilled, using CodePen's prefill form POST.
 * Returns false when the browser blocked the new tab (common inside preview iframes).
 */
export function openInCodePen(options: {
  title: string;
  description: string;
  script: string;
}): boolean {
  const escaped = options.script
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const payload = {
    title: options.title,
    description: options.description,
    html: `<pre>${escaped}</pre>`,
    editors: "1000",
  };

  const target = `codepen_${Date.now()}`;
  const opened = window.open("", target);
  if (!opened) return false;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://codepen.io/pen/define";
  form.target = target;

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "data";
  input.value = JSON.stringify(payload);

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
  return true;
}
