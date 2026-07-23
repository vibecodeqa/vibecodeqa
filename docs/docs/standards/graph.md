# Standards Graph

This graph shows how VibeCode QA turns upstream framework and platform guidance into
judgeable stack standards. Stack items are leaves. Stack standards are composed nodes.
Reference templates are runnable fixtures that prove the standard in CI.

The machine-readable source for this map is
[`/standards/compositions.json`](/standards/compositions.json).

<style>
.vcqa-graph {
  --line: #d4d4d8;
  --ink: #18181b;
  --muted: #71717a;
  --panel: #fafafa;
  --authored: #dcfce7;
  --authored-border: #22c55e;
  --planned: #f4f4f5;
  --planned-border: #a1a1aa;
  --item: #eef2ff;
  --item-border: #818cf8;
  --template: #fef3c7;
  --template-border: #f59e0b;
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
  background: var(--panel);
}
.vcqa-graph .standard-card.authored {
  border-left: 4px solid var(--authored-border);
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
  background: white;
}
.vcqa-graph .chip.item {
  border-color: var(--item-border);
  background: var(--item);
}
.vcqa-graph .chip.standard {
  border-color: var(--authored-border);
  background: var(--authored);
}
.vcqa-graph .chip.template {
  border-color: var(--template-border);
  background: var(--template);
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
</style>

<div class="vcqa-graph">

<div class="legend">
  <div class="node authored"><strong>Authored standard</strong><br><span class="kind">Versioned rubric with stable rule IDs.</span></div>
  <div class="node planned"><strong>Planned standard</strong><br><span class="kind">Charter exists; full rubric is not published yet.</span></div>
  <div class="node item"><strong>Stack item leaf</strong><br><span class="kind">Framework, runtime, tool, protocol, or quality layer.</span></div>
  <div class="node template"><strong>Reference template</strong><br><span class="kind">Runnable repo with CI and a tracked VCQA report.</span></div>
</div>

<h2 id="reference-templates">Reference Templates</h2>

<div class="template-row">
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-react-spa">ref-react-spa</a></strong><span class="status">A 94</span></div>
    <div class="chips">
      <a class="chip standard" href="/docs/standards/stacks/react-spa/">react-spa</a>
      <a class="chip standard" href="/standards/security/v1/">security</a>
    </div>
    <div class="links"><a href="https://github.com/vibecodeqa/ref-react-spa/blob/main/docs/vcqa-report.md">VCQA report</a></div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-cloudflare-worker-mcp">ref-cloudflare-worker-mcp</a></strong><span class="status">A 91</span></div>
    <div class="chips">
      <a class="chip standard" href="/docs/standards/stacks/cloudflare-worker-mcp-server/">cloudflare-worker-mcp-server</a>
      <a class="chip standard" href="/standards/security/v1/">security</a>
    </div>
    <div class="links"><a href="https://github.com/vibecodeqa/ref-cloudflare-worker-mcp/blob/main/docs/vcqa-report.md">VCQA report</a></div>
  </div>
  <div class="node template">
    <div class="title"><strong><a href="https://github.com/vibecodeqa/ref-cloudflare-saas">ref-cloudflare-saas</a></strong><span class="status">A 91</span></div>
    <div class="chips">
      <a class="chip standard" href="/docs/standards/stacks/react-spa/">react-spa</a>
      <a class="chip standard" href="/docs/standards/stacks/cloudflare-pages-fullstack/">cloudflare-pages-fullstack</a>
      <a class="chip standard" href="/docs/standards/stacks/cloudflare-d1-app/">cloudflare-d1-app</a>
      <a class="chip standard" href="/docs/standards/stacks/cloudflare-worker-mcp-server/">cloudflare-worker-mcp-server</a>
      <a class="chip standard" href="/docs/standards/stacks/tenant-deployed-cloudflare-saas/">tenant-deployed-cloudflare-saas</a>
      <a class="chip standard" href="/standards/security/v1/">security</a>
    </div>
    <div class="links"><a href="https://github.com/vibecodeqa/ref-cloudflare-saas/blob/main/docs/vcqa-report.md">VCQA report</a></div>
  </div>
</div>

<h2 id="authored-standards">Authored Standards</h2>

<div class="standard-grid">
  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/stacks/react-spa/">react-spa</a></strong><span class="status">authored v1</span></div>
    <div class="kind">Client-rendered React hosted as static files.</div>
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
    <div class="links"><a href="/standards/react-spa/v1/">rubric</a><a href="https://github.com/vibecodeqa/ref-react-spa">template</a><a href="https://github.com/vibecodeqa/ref-react-spa/blob/main/docs/vcqa-report.md">report</a></div>
  </div>

  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/stacks/cloudflare-pages-fullstack/">cloudflare-pages-fullstack</a></strong><span class="status">authored v1</span></div>
    <div class="kind">Static frontend plus same-origin Pages Functions API.</div>
    <div class="chips">
      <a class="chip standard" href="/docs/standards/stacks/react-spa/">react-spa</a>
      <a class="chip item" href="/docs/standards/items/cloudflare-pages-functions/">cloudflare-pages-functions</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
    </div>
    <div class="links"><a href="/standards/cloudflare-pages-fullstack/v1/">rubric</a></div>
  </div>

  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/stacks/cloudflare-d1-app/">cloudflare-d1-app</a></strong><span class="status">authored v1</span></div>
    <div class="kind">D1 migrations, bindings, query safety, and environment isolation.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/cloudflare-d1/">cloudflare-d1</a>
      <a class="chip item" href="/docs/standards/items/cloudflare-pages-functions/">cloudflare-pages-functions</a>
      <a class="chip item" href="/docs/standards/items/cloudflare-workers/">cloudflare-workers</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
    </div>
    <div class="links"><a href="/standards/cloudflare-d1-app/v1/">rubric</a></div>
  </div>

  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/stacks/cloudflare-worker-mcp-server/">cloudflare-worker-mcp-server</a></strong><span class="status">authored v1</span></div>
    <div class="kind">Remote MCP on Workers with authorization, schemas, storage boundaries, and auditability.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/cloudflare-workers/">cloudflare-workers</a>
      <a class="chip item" href="/docs/standards/items/durable-objects/">durable-objects</a>
      <a class="chip item" href="/docs/standards/items/mcp/">mcp</a>
      <a class="chip item" href="/docs/standards/items/zod/">zod</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
    </div>
    <div class="links"><a href="/standards/cloudflare-worker-mcp-server/v1/">rubric</a><a href="https://github.com/vibecodeqa/ref-cloudflare-worker-mcp">template</a><a href="https://github.com/vibecodeqa/ref-cloudflare-worker-mcp/blob/main/docs/vcqa-report.md">report</a></div>
  </div>

  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/stacks/tenant-deployed-cloudflare-saas/">tenant-deployed-cloudflare-saas</a></strong><span class="status">authored v1</span></div>
    <div class="kind">Tenant-scoped Cloudflare deployment, promotion, rollback, and evidence.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/cloudflare-pages-functions/">cloudflare-pages-functions</a>
      <a class="chip item" href="/docs/standards/items/cloudflare-d1/">cloudflare-d1</a>
      <a class="chip item" href="/docs/standards/items/cloudflare-workers/">cloudflare-workers</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/docs-kb/">docs-kb</a>
    </div>
    <div class="links"><a href="/standards/tenant-deployed-cloudflare-saas/v1/">rubric</a><a href="https://github.com/vibecodeqa/ref-cloudflare-saas">template</a><a href="https://github.com/vibecodeqa/ref-cloudflare-saas/blob/main/docs/vcqa-report.md">report</a></div>
  </div>

  <div class="standard-card authored">
    <div class="title"><strong><a href="/docs/standards/items/web-security/">security</a></strong><span class="status">authored v1</span></div>
    <div class="kind">Cross-cutting security baseline across app, API, Worker, MCP, CLI, SDK, CI, and docs surfaces.</div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
      <a class="chip item" href="/docs/standards/items/cloudflare-workers/">cloudflare-workers</a>
      <a class="chip item" href="/docs/standards/items/mcp/">mcp</a>
      <a class="chip item" href="/docs/standards/items/docs-kb/">docs-kb</a>
    </div>
    <div class="links"><a href="/standards/security/v1/">rubric</a></div>
  </div>
</div>

<h2 id="planned-standards">Planned Standards</h2>

<div class="standard-grid">
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/node-cli-internal-tool/">node-cli-internal-tool</a></strong><span class="status">planned</span></div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/node/">node</a>
      <a class="chip item" href="/docs/standards/items/openapi/">openapi</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
    </div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/typescript-sdk/">typescript-sdk</a></strong><span class="status">planned</span></div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/openapi/">openapi</a>
      <a class="chip item" href="/docs/standards/items/zod/">zod</a>
      <a class="chip item" href="/docs/standards/items/vitest/">vitest</a>
    </div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/github-action-package/">github-action-package</a></strong><span class="status">planned</span></div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/github-action/">github-action</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
      <a class="chip item" href="/docs/standards/items/node/">node</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
    </div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/vscode-extension-package/">vscode-extension-package</a></strong><span class="status">planned</span></div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/vscode-extension/">vscode-extension</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/node/">node</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
    </div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/tauri-react-desktop/">tauri-react-desktop</a></strong><span class="status">planned</span></div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/tauri/">tauri</a>
      <a class="chip item" href="/docs/standards/items/react/">react</a>
      <a class="chip item" href="/docs/standards/items/typescript/">typescript</a>
      <a class="chip item" href="/docs/standards/items/web-security/">web-security</a>
      <a class="chip item" href="/docs/standards/items/docs-kb/">docs-kb</a>
    </div>
  </div>
  <div class="standard-card planned">
    <div class="title"><strong><a href="/docs/standards/stacks/zensical-kb-site/">zensical-kb-site</a></strong><span class="status">planned</span></div>
    <div class="chips">
      <a class="chip item" href="/docs/standards/items/docs-kb/">docs-kb</a>
      <a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a>
    </div>
  </div>
</div>

<h2 id="stack-item-leaves">Stack Item Leaves</h2>

<div class="item-grid">
  <div class="item-card"><strong>Frameworks and UI</strong><div class="chips"><a class="chip item" href="/docs/standards/items/react/">react</a><a class="chip item" href="/docs/standards/items/react-router/">react-router</a><a class="chip item" href="/docs/standards/items/web-accessibility/">web-accessibility</a><a class="chip item" href="/docs/standards/items/vscode-extension/">vscode-extension</a><a class="chip item" href="/docs/standards/items/tauri/">tauri</a></div></div>
  <div class="item-card"><strong>Runtimes and platforms</strong><div class="chips"><a class="chip item" href="/docs/standards/items/node/">node</a><a class="chip item" href="/docs/standards/items/cloudflare-pages-functions/">cloudflare-pages-functions</a><a class="chip item" href="/docs/standards/items/cloudflare-workers/">cloudflare-workers</a><a class="chip item" href="/docs/standards/items/cloudflare-d1/">cloudflare-d1</a><a class="chip item" href="/docs/standards/items/durable-objects/">durable-objects</a></div></div>
  <div class="item-card"><strong>Language, contracts, validation</strong><div class="chips"><a class="chip item" href="/docs/standards/items/typescript/">typescript</a><a class="chip item" href="/docs/standards/items/openapi/">openapi</a><a class="chip item" href="/docs/standards/items/zod/">zod</a><a class="chip item" href="/docs/standards/items/mcp/">mcp</a></div></div>
  <div class="item-card"><strong>Build, test, CI, docs</strong><div class="chips"><a class="chip item" href="/docs/standards/items/vite/">vite</a><a class="chip item" href="/docs/standards/items/vitest/">vitest</a><a class="chip item" href="/docs/standards/items/playwright/">playwright</a><a class="chip item" href="/docs/standards/items/github-action/">github-action</a><a class="chip item" href="/docs/standards/items/github-actions/">github-actions</a><a class="chip item" href="/docs/standards/items/docs-kb/">docs-kb</a></div></div>
  <div class="item-card"><strong>Security</strong><div class="chips"><a class="chip item" href="/docs/standards/items/web-security/">web-security</a></div></div>
</div>

</div>

<h2 id="reading-the-map">Reading The Map</h2>

<ul>
  <li>A stack item can feed several standards. <code>typescript</code>, <code>web-security</code>, and <code>github-actions</code> are intentionally shared across many stack shapes.</li>
  <li><code>react-spa</code> is both an authored standard and an input to <code>cloudflare-pages-fullstack</code>.</li>
  <li>Reference templates are examples, not vendor-starter replacements. They point to the relevant standard and to a committed VCQA report.</li>
  <li>Planned standards are included so the graph shows the pathway, not only what is already published.</li>
</ul>
