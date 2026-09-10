/** Opens CodePen with the given script prefilled, using CodePen's prefill form POST. */
export function openInCodePen(options: {
  title: string;
  description: string;
  script: string;
}): void {
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

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://codepen.io/pen/define";
  form.target = "_blank";
  form.rel = "noopener";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "data";
  input.value = JSON.stringify(payload);

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
