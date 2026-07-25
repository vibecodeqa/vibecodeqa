# Standards Graph

This graph shows how VibeCode QA turns upstream framework and platform guidance into
judgeable standards. Stack items are leaves. Authored stack rubrics are deployable
composition nodes. Authored cross-cutting rubrics are first-class standards that apply
across many stack shapes. Reference templates are runnable fixtures that prove the
standard in CI. Some stack items are optional composition leaves: they are judged when
present, but they do not define the minimum shape of the standard.

The machine-readable source for this map is
[`/standards/compositions.json`](/standards/compositions.json).

<style>
.vcqa-graph {
  --line: color-mix(in srgb, var(--md-default-fg-color, #18181b) 24%, transparent);
  --edge: color-mix(in srgb, var(--md-default-fg-color, #18181b) 30%, transparent);
  --ink: var(--md-default-fg-color, #18181b);
  --muted: var(--md-default-fg-color--light, #71717a);
  --panel: color-mix(
    in srgb,
    var(--md-default-bg-color, #ffffff) 88%,
    var(--md-default-fg-color, #18181b) 12%
  );
  --canvas: var(--md-default-bg-color, #ffffff);
  --chip-bg: var(--panel);
  --authored: var(--panel);
  --authored-border: #15803d;
  --crosscut: var(--panel);
  --crosscut-border: #7c3aed;
  --planned: var(--panel);
  --planned-border: #71717a;
  --item: var(--panel);
  --item-border: #2563eb;
  --template: var(--panel);
  --template-border: #b45309;
}
body[data-md-color-scheme="slate"] .vcqa-graph {
  --authored-border: #4ade80;
  --crosscut-border: #c084fc;
  --planned-border: #a1a1aa;
  --item-border: #93c5fd;
  --template-border: #fbbf24;
}
.vcqa-graph .legend,
.vcqa-graph .template-row,
.vcqa-graph .standard-grid,
.vcqa-graph .item-grid {
  display: grid;
  gap: 0.75rem;
}
.vcqa-graph .legend {
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  margin: 1rem 0;
}
.vcqa-graph .template-row {
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  margin: 1rem 0 1.4rem;
}
.vcqa-graph .standard-grid {
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
}
.vcqa-graph .item-grid {
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
}
.vcqa-graph .node,
.vcqa-graph .standard-card,
.vcqa-graph .item-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0.75rem;
  color: var(--ink);
  background: var(--panel);
}
.vcqa-graph a {
  color: #2563eb;
}
body[data-md-color-scheme="slate"] .vcqa-graph a {
  color: #93c5fd;
}
.vcqa-graph .standard-card.authored {
  border-left: 4px solid var(--authored-border);
}
.vcqa-graph .standard-card.crosscut {
  border-left: 4px solid var(--crosscut-border);
}
.vcqa-graph .standard-card.planned {
  border-left: 4px solid var(--planned-border);
}
.vcqa-graph .node.template {
  border-color: var(--template-border);
  background: var(--template);
}
.vcqa-graph .node.authored {
  border-color: var(--authored-border);
  background: var(--authored);
}
.vcqa-graph .node.crosscut {
  border-color: var(--crosscut-border);
  background: var(--crosscut);
}
.vcqa-graph .node.planned {
  border-color: var(--planned-border);
  background: var(--planned);
}
.vcqa-graph .node.item {
  border-color: var(--item-border);
  background: var(--item);
}
.vcqa-graph .title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.45rem;
}
.vcqa-graph .title strong {
  color: var(--ink);
}
.vcqa-graph .node strong {
  color: var(--ink);
}
.vcqa-graph .status {
  color: var(--muted);
  font-size: 0.78rem;
  white-space: nowrap;
}
.vcqa-graph .chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.5rem;
}
.vcqa-graph .chip {
  display: inline-block;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.15rem 0.5rem;
  font-size: 0.78rem;
  color: var(--ink);
  background: var(--chip-bg);
}
.vcqa-graph .chip.item {
  border-color: var(--item-border);
  background: var(--item);
}
.vcqa-graph .chip.standard {
  border-color: var(--authored-border);
  background: var(--authored);
}
.vcqa-graph .chip.crosscut {
  border-color: var(--crosscut-border);
  background: var(--crosscut);
}
.vcqa-graph .chip.template {
  border-color: var(--template-border);
  background: var(--template);
}
.vcqa-graph .chip.optional {
  border-style: dashed;
}
.vcqa-graph .chip-group-label {
  color: var(--muted);
  font-size: 0.75rem;
  margin-top: 0.55rem;
}
.vcqa-graph .links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.82rem;
}
.vcqa-graph .kind {
  color: var(--muted);
  font-size: 0.82rem;
}
.vcqa-graph .graph-scroll {
  margin: 1rem 0 1.5rem;
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--canvas);
}
.vcqa-graph .network-map {
  display: block;
  min-width: 1200px;
  width: 100%;
  height: auto;
}
.vcqa-graph .graph-node rect {
  fill: transparent !important;
  fill-opacity: 0 !important;
  stroke-width: 2;
}
.vcqa-graph .edges {
  stroke: var(--edge);
}
.vcqa-graph marker path {
  fill: var(--edge);
}
.vcqa-graph .graph-node text {
  fill: var(--ink) !important;
  font-size: 14px;
  font-weight: 500;
  stroke: none !important;
  text-anchor: middle;
  pointer-events: none;
}
.vcqa-graph .graph-node .sub {
  fill: var(--muted);
  font-size: 12px;
  font-weight: 400;
}
.vcqa-graph .graph-node.item rect {
  stroke: var(--item-border);
}
.vcqa-graph .graph-node.authored rect {
  stroke: var(--authored-border);
}
.vcqa-graph .graph-node.crosscut rect {
  stroke: var(--crosscut-border);
}
.vcqa-graph .graph-node.planned rect {
  stroke: var(--planned-border);
}
.vcqa-graph .graph-node.template rect {
  stroke: var(--template-border);
}
.vcqa-graph .graph-node:hover rect {
  stroke-width: 2.4;
}
</style>

<div class="vcqa-graph">

<!-- BEGIN GENERATED:standards-graph -->
<!-- Generated by standards/generate-catalog.mjs; edit standards/*.json instead. -->
<div class="legend">
  <div class="node authored"><strong>Authored stack rubric</strong><br><span class="kind">Deployable stack standard with stable rule IDs.</span></div>
  <div class="node crosscut"><strong>Authored cross-cutting rubric</strong><br><span class="kind">First-class rubric applied across stack shapes.</span></div>
  <div class="node planned"><strong>Planned standard</strong><br><span class="kind">Cataloged rule surface; full rubric is not published yet.</span></div>
  <div class="node item"><strong>Stack item leaf</strong><br><span class="kind">Framework, runtime, tool, protocol, quality, or supply-chain layer.</span></div>
  <div class="node template"><strong>Reference template</strong><br><span class="kind">Runnable repo with CI and a tracked VCQA report.</span></div>
</div>

<p class="kind">Generated graph data: <a href="/standards/graph.json"><code>graph.json</code></a>.</p>

<h2 id="reference-templates">Reference Templates</h2>

<div class="template-row">
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-react-spa">ref-react-spa</a></strong><span class="status">published</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/react-spa/">react-spa</a><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip standard" href="/docs/standards/items/vitest/">testing</a><a class="chip standard" href="/docs/standards/items/web-security/">security</a></div>
    <div class="links"><a href="https://github.com/vibecodeqa/ref-react-spa/blob/main/docs/vcqa-report.md">94/100 report</a> · CI green</div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-cloudflare-worker-mcp">ref-cloudflare-worker-mcp</a></strong><span class="status">published</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/cloudflare-worker-mcp-server/">cloudflare-worker-mcp-server</a><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip standard" href="/docs/standards/items/vitest/">testing</a><a class="chip standard" href="/docs/standards/items/web-security/">security</a></div>
    <div class="links"><a href="https://github.com/vibecodeqa/ref-cloudflare-worker-mcp/blob/main/docs/vcqa-report.md">91/100 report</a> · CI green</div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-cloudflare-saas">ref-cloudflare-saas</a></strong><span class="status">published</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/react-spa/">react-spa</a><a class="chip standard" href="/docs/standards/stacks/cloudflare-pages-fullstack/">cloudflare-pages-fullstack</a><a class="chip standard" href="/docs/standards/stacks/cloudflare-d1-app/">cloudflare-d1-app</a><a class="chip standard" href="/docs/standards/stacks/cloudflare-worker-mcp-server/">cloudflare-worker-mcp-server</a><a class="chip standard" href="/docs/standards/stacks/tenant-deployed-cloudflare-saas/">tenant-deployed-cloudflare-saas</a><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip standard" href="/docs/standards/items/vitest/">testing</a><a class="chip standard" href="/docs/standards/items/web-security/">security</a></div>
    <div class="links"><a href="https://github.com/vibecodeqa/ref-cloudflare-saas/blob/main/docs/vcqa-report.md">91/100 report</a> · CI green</div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-node-cli-internal-tool">ref-node-cli-internal-tool</a></strong><span class="status">published</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/node-cli-internal-tool/">node-cli-internal-tool</a><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip standard" href="/docs/standards/items/vitest/">testing</a><a class="chip standard" href="/docs/standards/items/web-security/">security</a></div>
    <div class="links"><a href="https://github.com/vibecodeqa/ref-node-cli-internal-tool/blob/main/docs/vcqa-report.md">92/100 report</a> · CI green</div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-cloudflare-pages-fullstack">ref-cloudflare-pages-fullstack</a></strong><span class="status">published</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/cloudflare-pages-fullstack/">cloudflare-pages-fullstack</a><a class="chip standard" href="/docs/standards/stacks/react-spa/">react-spa</a><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip standard" href="/docs/standards/items/vitest/">testing</a><a class="chip standard" href="/docs/standards/items/web-security/">security</a></div>
    <div class="links"><a href="https://github.com/vibecodeqa/ref-cloudflare-pages-fullstack/blob/main/docs/vcqa-report.md">92/100 report</a> · CI green</div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-cloudflare-d1-app">ref-cloudflare-d1-app</a></strong><span class="status">candidate</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/cloudflare-d1-app/">cloudflare-d1-app</a><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip standard" href="/docs/standards/items/vitest/">testing</a><a class="chip standard" href="/docs/standards/items/web-security/">security</a></div>
    <div class="links"></div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-typescript-sdk">ref-typescript-sdk</a></strong><span class="status">candidate</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/typescript-sdk/">typescript-sdk</a><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip standard" href="/docs/standards/items/vitest/">testing</a><a class="chip item" href="/docs/standards/items/dependencies/">dependencies</a></div>
    <div class="links"></div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-github-action-package">ref-github-action-package</a></strong><span class="status">candidate</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/github-action-package/">github-action-package</a><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip standard" href="/docs/standards/items/vitest/">testing</a><a class="chip standard" href="/docs/standards/items/web-security/">security</a><a class="chip item" href="/docs/standards/items/dependencies/">dependencies</a></div>
    <div class="links"></div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-zensical-kb-site">ref-zensical-kb-site</a></strong><span class="status">candidate</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/zensical-kb-site/">zensical-kb-site</a></div>
    <div class="links"></div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-vscode-extension-package">ref-vscode-extension-package</a></strong><span class="status">candidate</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/vscode-extension-package/">vscode-extension-package</a><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip standard" href="/docs/standards/items/vitest/">testing</a><a class="chip standard" href="/docs/standards/items/web-security/">security</a></div>
    <div class="links"></div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-tauri-react-desktop">ref-tauri-react-desktop</a></strong><span class="status">candidate</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/tauri-react-desktop/">tauri-react-desktop</a><a class="chip standard" href="/docs/standards/stacks/react-spa/">react-spa</a><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip standard" href="/docs/standards/items/vitest/">testing</a><a class="chip standard" href="/docs/standards/items/web-security/">security</a></div>
    <div class="links"></div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-flutter-firebase-app">ref-flutter-firebase-app</a></strong><span class="status">candidate</span></div>
    <div class="chips"><a class="chip standard" href="/docs/standards/stacks/flutter-firebase-app/">flutter-firebase-app</a><a class="chip standard" href="/docs/standards/items/vitest/">testing</a><a class="chip standard" href="/docs/standards/items/web-security/">security</a><a class="chip item" href="/docs/standards/items/dependencies/">dependencies</a></div>
    <div class="links"></div>
  </div>
</div>


<h2 id="authored-stack-rubrics">Authored Stack Rubrics</h2>

<div class="standard-grid">
  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/stacks/react-spa/">react-spa</a></strong><span class="status">authored v1</span></div>
    <div class="kind">React, client-rendered, hosted as static files. No SSR, no server of its own.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/react/">react</a>
      <a class="chip item" href="/docs/standards/items/react-router/">react-router</a>
      <a class="chip item" href="/docs/standards/items/vite/">vite</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/web-accessibility/">web-accessibility</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/vitest/">vitest</a>
      <a class="chip item" href="/docs/standards/items/playwright/">playwright</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/react-spa/">catalog</a><a href="/standards/react-spa/v1/">rubric</a></div>
  </div>
  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/stacks/cloudflare-pages-fullstack/">cloudflare-pages-fullstack</a></strong><span class="status">authored v1</span></div>
    <div class="kind">Server-side API co-deployed with a static frontend as Cloudflare Pages Functions. Edge runtime, bindings, no long-lived server.</div>
    <div class="chips">
      <a class="chip standard" href="/docs/standards/stacks/react-spa/">react-spa</a>
      <a class="chip item" href="/docs/standards/items/cloudflare-pages-functions/">cloudflare-pages-functions</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/cloudflare-pages-fullstack/">catalog</a><a href="/standards/cloudflare-pages-fullstack/v1/">rubric</a></div>
  </div>
  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/stacks/cloudflare-d1-app/">cloudflare-d1-app</a></strong><span class="status">authored v1</span></div>
    <div class="kind">SQLite-at-the-edge: schema, migrations discipline, parameterized queries, local/remote parity.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/cloudflare-d1/">cloudflare-d1</a>
      <a class="chip item" href="/docs/standards/items/cloudflare-pages-functions/">cloudflare-pages-functions</a>
      <a class="chip item" href="/docs/standards/items/cloudflare-workers/">cloudflare-workers</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/cloudflare-d1-app/">catalog</a><a href="/standards/cloudflare-d1-app/v1/">rubric</a></div>
  </div>
  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/stacks/cloudflare-worker-mcp-server/">cloudflare-worker-mcp-server</a></strong><span class="status">authored v1</span></div>
    <div class="kind">A remote MCP server hosted on Cloudflare Workers, with Worker-bound authorization, tool schemas, validation, storage boundaries, and auditability.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/cloudflare-workers/">cloudflare-workers</a>
      <a class="chip item" href="/docs/standards/items/durable-objects/">durable-objects</a>
      <a class="chip item" href="/docs/standards/items/mcp/">mcp</a>
      <a class="chip item" href="/docs/standards/items/zod/">zod</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/cloudflare-worker-mcp-server/">catalog</a><a href="/standards/cloudflare-worker-mcp-server/v1/">rubric</a></div>
  </div>
  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/stacks/tenant-deployed-cloudflare-saas/">tenant-deployed-cloudflare-saas</a></strong><span class="status">authored v1</span></div>
    <div class="kind">A tenant-scoped Cloudflare SaaS deployment model composing Pages Functions, D1, Worker MCP, bindings, secrets, aliases, promotion gates, provisioning, and auditability.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/cloudflare-workers/">cloudflare-workers</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/docs-kb/">docs-kb</a>
      <a class="chip item optional" href="/docs/standards/items/cloudflare-pages-functions/">cloudflare-pages-functions</a>
      <a class="chip item optional" href="/docs/standards/items/cloudflare-d1/">cloudflare-d1</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/tenant-deployed-cloudflare-saas/">catalog</a><a href="/standards/tenant-deployed-cloudflare-saas/v1/">rubric</a></div>
  </div>
</div>


<h2 id="authored-cross-cutting-rubrics">Authored Cross-Cutting Rubrics</h2>

<div class="standard-grid">
  <div class="standard-card crosscut">
    <div class="title"><strong><a href="/docs/standards/items/web-security/">security</a></strong><span class="status">authored v1</span></div>
    <div class="kind">Secrets handling, input validation, XSS/injection, dependency supply chain.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
      <a class="chip item" href="/docs/standards/items/cloudflare-workers/">cloudflare-workers</a>
      <a class="chip item" href="/docs/standards/items/mcp/">mcp</a>
      <a class="chip item" href="/docs/standards/items/docs-kb/">docs-kb</a>
    </div>
    <div class="links"><a href="/docs/standards/items/web-security/">catalog</a><a href="/standards/security/v1/">rubric</a></div>
  </div>
  <div class="standard-card crosscut">
    <div class="title"><strong><a href="/docs/standards/items/vitest/">testing</a></strong><span class="status">authored v1</span></div>
    <div class="kind">Behavior-focused test strategy, required test layers, coverage risk, CI evidence, and fake/flaky test controls.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/vitest/">vitest</a>
      <a class="chip item" href="/docs/standards/items/playwright/">playwright</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
    </div>
    <div class="links"><a href="/docs/standards/items/vitest/">catalog</a><a href="/standards/testing/v1/">rubric</a></div>
  </div>
  <div class="standard-card crosscut">
    <div class="title"><strong><a href="/docs/standards/items/typescript/">typescript</a></strong><span class="status">authored v1</span></div>
    <div class="kind">Strict flags, project references, no-any, typed-and-validated boundaries.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/node/">node</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
    </div>
    <div class="links"><a href="/docs/standards/items/typescript/">catalog</a><a href="/standards/typescript/v1/">rubric</a></div>
  </div>
</div>


<h2 id="published-aliases">Published Aliases</h2>

<div class="standard-grid">
  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/stacks/cloudflare-pages-fullstack/">react-spa-on-cloudflare-pages</a></strong><span class="status">authored v1</span></div>
    <div class="kind">Alias for the authored Cloudflare Pages Fullstack rubric when a React SPA and Pages Functions API are co-deployed in one Pages project.</div>
    <div class="chips">
      <a class="chip standard" href="/docs/standards/stacks/react-spa/">react-spa</a>
      <a class="chip item" href="/docs/standards/items/cloudflare-pages-functions/">cloudflare-pages-functions</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/cloudflare-pages-fullstack/">catalog</a><a href="/standards/cloudflare-pages-fullstack/v1/">rubric</a></div>
  </div>
</div>


<h2 id="planned-standards">Planned Standards</h2>

<div class="standard-grid">
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/node-cli-internal-tool/">node-cli-internal-tool</a></strong><span class="status">planned</span></div>
    <div class="kind">A Node command-line tool used by developers or CI, with stable exit codes, credential resolution, structured output, and noninteractive safety.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/node/">node</a>
      <a class="chip item" href="/docs/standards/items/openapi/">openapi</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/node-cli-internal-tool/">catalog</a></div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/typescript-sdk/">typescript-sdk</a></strong><span class="status">planned</span></div>
    <div class="kind">A TypeScript package or SDK consumed by other code, with export maps, declarations, runtime validation, typed errors, and consumer compatibility checks.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/openapi/">openapi</a>
      <a class="chip item" href="/docs/standards/items/zod/">zod</a>
      <a class="chip item" href="/docs/standards/items/vitest/">vitest</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/typescript-sdk/">catalog</a></div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/github-action-package/">github-action-package</a></strong><span class="status">planned</span></div>
    <div class="kind">A packaged GitHub Action with action metadata, minimum permissions, validated inputs, pinned runtime/dependencies, and release tag policy.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/github-action/">github-action</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
      <a class="chip item" href="/docs/standards/items/node/">node</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/github-action-package/">catalog</a></div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/vscode-extension-package/">vscode-extension-package</a></strong><span class="status">planned</span></div>
    <div class="kind">A VS Code extension package with activation scope, workspace trust behavior, command/webview boundaries, marketplace metadata, and extension tests.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/vscode-extension/">vscode-extension</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/node/">node</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/vscode-extension-package/">catalog</a></div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/tauri-react-desktop/">tauri-react-desktop</a></strong><span class="status">planned</span></div>
    <div class="kind">A Tauri desktop application with a React frontend, command/capability boundaries, secure storage posture, packaging, and typed frontend/backend contracts.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/tauri/">tauri</a>
      <a class="chip item" href="/docs/standards/items/react/">react</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/docs-kb/">docs-kb</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/tauri-react-desktop/">catalog</a></div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/zensical-kb-site/">zensical-kb-site</a></strong><span class="status">planned</span></div>
    <div class="kind">A docs-only knowledge base site published from Markdown with generated site output separated from source, stable URLs, references, and docs smoke checks.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/docs-kb/">docs-kb</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/zensical-kb-site/">catalog</a></div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/items/web-accessibility/">accessibility</a></strong><span class="status">planned</span></div>
    <div class="kind">Semantics, keyboard, focus, ARIA, contrast. Applies to any UI-rendering slice.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/web-accessibility/">web-accessibility</a>
    </div>
    <div class="links"><a href="/docs/standards/items/web-accessibility/">catalog</a></div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/items/dependencies/">dependencies</a></strong><span class="status">planned</span></div>
    <div class="kind">Lockfile pinning, audit, vetting, no unexpected install scripts.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/dependencies/">dependencies</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
      <a class="chip item" href="/docs/standards/items/node/">node</a>
    </div>
    <div class="links"><a href="/docs/standards/items/dependencies/">catalog</a></div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/flutter-firebase-app/">flutter-firebase-app</a></strong><span class="status">planned</span></div>
    <div class="kind">Flutter app/admin/shared workspace backed by Firebase Auth, Firestore, Storage, Messaging, Hosting, and Cloud Functions, with Melos orchestration and deploy/test gates.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/dart/">dart</a>
      <a class="chip item" href="/docs/standards/items/flutter/">flutter</a>
      <a class="chip item" href="/docs/standards/items/firebase/">firebase</a>
      <a class="chip item" href="/docs/standards/items/melos/">melos</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
      <a class="chip item" href="/docs/standards/items/dependencies/">dependencies</a>
      <a class="chip item optional" href="/docs/standards/items/web-accessibility/">web-accessibility</a>
      <a class="chip item optional" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item optional" href="/docs/standards/items/node/">node</a>
    </div>
    <div class="links"><a href="/docs/standards/stacks/flutter-firebase-app/">catalog</a></div>
  </div>
</div>

<h2 id="stack-item-leaves">Stack Item Leaves</h2>

<div class="item-grid">
  <div class="item-card"><strong>Runtime</strong><div class="chips"><a class="chip item" href="/docs/standards/items/node/">node</a><a class="chip item" href="/docs/standards/items/cloudflare-pages-functions/">cloudflare-pages-functions</a><a class="chip item" href="/docs/standards/items/cloudflare-workers/">cloudflare-workers</a></div></div>
  <div class="item-card"><strong>Framework</strong><div class="chips"><a class="chip item" href="/docs/standards/items/react/">react</a><a class="chip item" href="/docs/standards/items/flutter/">flutter</a></div></div>
  <div class="item-card"><strong>Routing</strong><div class="chips"><a class="chip item" href="/docs/standards/items/react-router/">react-router</a></div></div>
  <div class="item-card"><strong>Build Tool</strong><div class="chips"><a class="chip item" href="/docs/standards/items/vite/">vite</a></div></div>
  <div class="item-card"><strong>Language</strong><div class="chips"><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip item" href="/docs/standards/items/dart/">dart</a></div></div>
  <div class="item-card"><strong>Quality</strong><div class="chips"><a class="chip item" href="/docs/standards/items/web-accessibility/">web-accessibility</a></div></div>
  <div class="item-card"><strong>Security</strong><div class="chips"><a class="chip item" href="/docs/standards/items/web-security/">web-security</a></div></div>
  <div class="item-card"><strong>Testing</strong><div class="chips"><a class="chip item" href="/docs/standards/items/vitest/">vitest</a><a class="chip item" href="/docs/standards/items/playwright/">playwright</a></div></div>
  <div class="item-card"><strong>Database</strong><div class="chips"><a class="chip item" href="/docs/standards/items/cloudflare-d1/">cloudflare-d1</a></div></div>
  <div class="item-card"><strong>State</strong><div class="chips"><a class="chip item" href="/docs/standards/items/durable-objects/">durable-objects</a></div></div>
  <div class="item-card"><strong>Protocol</strong><div class="chips"><a class="chip item" href="/docs/standards/items/mcp/">mcp</a></div></div>
  <div class="item-card"><strong>Validation</strong><div class="chips"><a class="chip item" href="/docs/standards/items/zod/">zod</a></div></div>
  <div class="item-card"><strong>API Contract</strong><div class="chips"><a class="chip item" href="/docs/standards/items/openapi/">openapi</a></div></div>
  <div class="item-card"><strong>CI</strong><div class="chips"><a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a></div></div>
  <div class="item-card"><strong>Extension</strong><div class="chips"><a class="chip item" href="/docs/standards/items/vscode-extension/">vscode-extension</a></div></div>
  <div class="item-card"><strong>Automation</strong><div class="chips"><a class="chip item" href="/docs/standards/items/github-action/">github-action</a></div></div>
  <div class="item-card"><strong>Desktop</strong><div class="chips"><a class="chip item" href="/docs/standards/items/tauri/">tauri</a></div></div>
  <div class="item-card"><strong>Documentation</strong><div class="chips"><a class="chip item" href="/docs/standards/items/docs-kb/">docs-kb</a></div></div>
  <div class="item-card"><strong>Supply Chain</strong><div class="chips"><a class="chip item" href="/docs/standards/items/dependencies/">dependencies</a></div></div>
  <div class="item-card"><strong>Backend Platform</strong><div class="chips"><a class="chip item" href="/docs/standards/items/firebase/">firebase</a></div></div>
  <div class="item-card"><strong>Workspace Tool</strong><div class="chips"><a class="chip item" href="/docs/standards/items/melos/">melos</a></div></div>
</div>
<!-- END GENERATED:standards-graph -->

</div>

<h2 id="reading-the-map">Reading The Map</h2>

<ul>
  <li>A stack item can feed several standards. <code>typescript</code>, <code>web-security</code>, and <code>github-actions</code> are intentionally shared across many stack shapes.</li>
  <li><code>react-spa</code> is both an authored stack rubric and an input to <code>cloudflare-pages-fullstack</code>.</li>
  <li><code>security</code>, <code>testing</code>, and <code>typescript</code> are authored cross-cutting rubrics, so they are shown separately from deployable stack standards.</li>
  <li>Dashed chips are optional/example leaves: they appear in reference templates but only apply to repositories that use that component.</li>
  <li>Reference templates are examples, not vendor-starter replacements. They point to the relevant standard and to a committed VCQA report.</li>
  <li>Planned stack charters are included so the graph shows the pathway, not only what is already published.</li>
</ul>
