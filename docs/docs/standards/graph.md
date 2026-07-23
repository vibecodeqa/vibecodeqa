# Standards Graph

This graph shows how VibeCode QA turns upstream framework and platform guidance into
judgeable stack standards. Stack items are leaves. Stack standards are composed nodes.
Reference templates are runnable fixtures that prove the standard in CI.

The machine-readable source for this map is
[`/standards/compositions.json`](/standards/compositions.json).

<style>
.vcqa-graph {
  --line: #d4d4d8;
  --edge: #d4d4d8;
  --ink: #18181b;
  --muted: #71717a;
  --panel: #fafafa;
  --canvas: #ffffff;
  --chip-bg: #ffffff;
  --authored: #dcfce7;
  --authored-border: #22c55e;
  --planned: #f4f4f5;
  --planned-border: #a1a1aa;
  --item: #eef2ff;
  --item-border: #818cf8;
  --template: #fef3c7;
  --template-border: #f59e0b;
}
body[data-md-color-scheme="slate"] .vcqa-graph {
  --line: #3f3f46;
  --edge: #52525b;
  --ink: #f4f4f5;
  --muted: #a1a1aa;
  --panel: #18181b;
  --canvas: #0f1117;
  --chip-bg: #27272a;
  --authored: #052e16;
  --authored-border: #16a34a;
  --planned: #27272a;
  --planned-border: #71717a;
  --item: #1e1b4b;
  --item-border: #6366f1;
  --template: #451a03;
  --template-border: #d97706;
}
html[data-darkreader-mode] .vcqa-graph,
html[data-darkreader-scheme="dark"] .vcqa-graph {
  --line: #3f3f46;
  --edge: #71717a;
  --ink: #f4f4f5;
  --muted: #c4c4cc;
  --panel: #181a20;
  --canvas: #0b0d12;
  --chip-bg: #20232b;
  --authored: #13251a;
  --authored-border: #4ade80;
  --planned: #20232b;
  --planned-border: #a1a1aa;
  --item: #171f33;
  --item-border: #93c5fd;
  --template: #2a2114;
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
body[data-md-color-scheme="slate"] .vcqa-graph a,
html[data-darkreader-mode] .vcqa-graph a,
html[data-darkreader-scheme="dark"] .vcqa-graph a {
  color: #93c5fd;
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
.vcqa-graph .graph-scroll {
  margin: 1rem 0 1.5rem;
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--canvas);
  color-scheme: light dark;
}
.vcqa-graph .network-map {
  display: block;
  min-width: 960px;
  width: 100%;
  height: auto;
}
.vcqa-graph .graph-node rect {
  stroke-width: 1.5;
}
.vcqa-graph .edges {
  stroke: var(--edge);
}
.vcqa-graph marker path {
  fill: var(--edge);
}
.vcqa-graph .graph-node text {
  fill: var(--ink);
  font-size: 13px;
  font-weight: 650;
  text-anchor: middle;
  pointer-events: none;
}
.vcqa-graph .graph-node .sub {
  fill: var(--muted);
  font-size: 11px;
  font-weight: 500;
}
.vcqa-graph .graph-node.item rect {
  fill: var(--item);
  stroke: var(--item-border);
}
.vcqa-graph .graph-node.authored rect {
  fill: var(--authored);
  stroke: var(--authored-border);
}
.vcqa-graph .graph-node.planned rect {
  fill: var(--planned);
  stroke: var(--planned-border);
}
.vcqa-graph .graph-node.template rect {
  fill: var(--template);
  stroke: var(--template-border);
}
.vcqa-graph .graph-node:hover rect {
  stroke-width: 2.4;
}
</style>

<div class="vcqa-graph" data-darkreader-ignore>

<div class="legend">
  <div class="node authored"><strong>Authored standard</strong><br><span class="kind">Versioned rubric with stable rule IDs.</span></div>
  <div class="node planned"><strong>Planned standard</strong><br><span class="kind">Charter exists; full rubric is not published yet.</span></div>
  <div class="node item"><strong>Stack item leaf</strong><br><span class="kind">Framework, runtime, tool, protocol, or quality layer.</span></div>
  <div class="node template"><strong>Reference template</strong><br><span class="kind">Runnable repo with CI and a tracked VCQA report.</span></div>
</div>

<h2 id="network-map">Network Map</h2>

<div class="graph-scroll" role="img" aria-label="Network graph connecting stack item leaves, authored standards, planned standards, and reference templates.">
<svg class="network-map" viewBox="0 0 1380 900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#a1a1aa" />
    </marker>
  </defs>

  <g class="edges" stroke="#d4d4d8" stroke-width="1.4" fill="none" marker-end="url(#arrow)">
    <!-- stack items to authored standards -->
    <path d="M175 70 C420 70 460 130 610 170"/><path d="M175 110 C410 100 465 135 610 170"/><path d="M175 150 C405 130 470 150 610 170"/><path d="M175 190 C410 175 470 170 610 170"/><path d="M175 230 C410 210 470 185 610 170"/><path d="M175 270 C410 235 470 200 610 170"/><path d="M175 310 C410 260 470 215 610 170"/><path d="M175 350 C410 285 470 230 610 170"/>
    <path d="M175 190 C420 220 500 255 610 285"/><path d="M175 270 C420 260 500 275 610 285"/><path d="M175 430 C420 380 500 320 610 285"/><path d="M610 170 C620 210 620 245 610 285"/>
    <path d="M175 470 C420 415 500 395 610 400"/><path d="M175 430 C420 410 500 400 610 400"/><path d="M175 510 C420 455 500 420 610 400"/><path d="M175 190 C420 320 500 380 610 400"/><path d="M175 270 C420 360 500 390 610 400"/>
    <path d="M175 510 C420 500 500 520 610 520"/><path d="M175 550 C420 515 500 520 610 520"/><path d="M175 590 C420 530 500 525 610 520"/><path d="M175 630 C420 540 500 530 610 520"/><path d="M175 190 C420 440 500 500 610 520"/><path d="M175 270 C420 470 500 510 610 520"/>
    <path d="M175 430 C420 550 500 615 610 640"/><path d="M175 470 C420 575 500 620 610 640"/><path d="M175 510 C420 600 500 630 610 640"/><path d="M175 270 C420 590 500 630 610 640"/><path d="M175 670 C420 655 500 650 610 640"/>
    <path d="M175 270 C430 670 520 740 610 760"/><path d="M175 430 C430 700 520 745 610 760"/><path d="M175 510 C430 720 520 755 610 760"/><path d="M175 590 C430 735 520 760 610 760"/><path d="M175 670 C430 760 520 770 610 760"/>

    <!-- stack items to planned standards -->
    <path d="M175 190 C420 180 825 90 1015 110"/><path d="M175 710 C430 690 825 140 1015 110"/><path d="M175 750 C430 720 825 160 1015 110"/><path d="M175 270 C430 300 825 120 1015 110"/>
    <path d="M175 190 C430 270 825 220 1015 230"/><path d="M175 750 C430 520 825 260 1015 230"/><path d="M175 630 C430 470 825 250 1015 230"/><path d="M175 310 C430 340 825 230 1015 230"/>
    <path d="M175 790 C430 650 825 360 1015 350"/><path d="M175 430 C430 470 825 360 1015 350"/><path d="M175 710 C430 610 825 370 1015 350"/><path d="M175 190 C430 430 825 360 1015 350"/>
    <path d="M175 830 C430 760 825 475 1015 470"/><path d="M175 190 C430 500 825 470 1015 470"/><path d="M175 710 C430 650 825 490 1015 470"/><path d="M175 270 C430 550 825 480 1015 470"/>
    <path d="M175 870 C430 820 825 600 1015 590"/><path d="M175 70 C430 300 825 570 1015 590"/><path d="M175 190 C430 430 825 590 1015 590"/><path d="M175 270 C430 520 825 600 1015 590"/><path d="M175 670 C430 680 825 610 1015 590"/>
    <path d="M175 670 C430 710 825 710 1015 710"/><path d="M175 430 C430 600 825 700 1015 710"/>

    <!-- standards to templates -->
    <path d="M755 170 C830 150 895 125 955 100"/><path d="M755 760 C835 610 900 300 955 100"/>
    <path d="M755 520 C820 465 895 395 955 340"/><path d="M755 760 C830 620 900 440 955 340"/>
    <path d="M755 170 C835 240 890 455 955 580"/><path d="M755 285 C835 330 890 490 955 580"/><path d="M755 400 C835 430 890 535 955 580"/><path d="M755 520 C835 530 890 565 955 580"/><path d="M755 640 C835 625 890 600 955 580"/><path d="M755 760 C835 710 900 635 955 580"/>
  </g>

  <g class="nodes">
    <!-- item leaves -->
    <a href="/docs/standards/items/react/"><g class="graph-node item" transform="translate(30 52)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">react</text></g></a>
    <a href="/docs/standards/items/react-router/"><g class="graph-node item" transform="translate(30 92)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">react-router</text></g></a>
    <a href="/docs/standards/items/vite/"><g class="graph-node item" transform="translate(30 132)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">vite</text></g></a>
    <a href="/docs/standards/items/typescript/"><g class="graph-node item" transform="translate(30 172)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">typescript</text></g></a>
    <a href="/docs/standards/items/web-accessibility/"><g class="graph-node item" transform="translate(30 212)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">web-accessibility</text></g></a>
    <a href="/docs/standards/items/web-security/"><g class="graph-node item" transform="translate(30 252)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">web-security</text></g></a>
    <a href="/docs/standards/items/vitest/"><g class="graph-node item" transform="translate(30 292)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">vitest</text></g></a>
    <a href="/docs/standards/items/playwright/"><g class="graph-node item" transform="translate(30 332)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">playwright</text></g></a>
    <a href="/docs/standards/items/github-actions/"><g class="graph-node item" transform="translate(30 412)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">github-actions</text></g></a>
    <a href="/docs/standards/items/cloudflare-pages-functions/"><g class="graph-node item" transform="translate(30 452)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">pages-functions</text></g></a>
    <a href="/docs/standards/items/cloudflare-workers/"><g class="graph-node item" transform="translate(30 492)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">workers</text></g></a>
    <a href="/docs/standards/items/durable-objects/"><g class="graph-node item" transform="translate(30 532)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">durable-objects</text></g></a>
    <a href="/docs/standards/items/mcp/"><g class="graph-node item" transform="translate(30 572)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">mcp</text></g></a>
    <a href="/docs/standards/items/zod/"><g class="graph-node item" transform="translate(30 612)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">zod</text></g></a>
    <a href="/docs/standards/items/docs-kb/"><g class="graph-node item" transform="translate(30 652)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">docs-kb</text></g></a>
    <a href="/docs/standards/items/node/"><g class="graph-node item" transform="translate(30 692)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">node</text></g></a>
    <a href="/docs/standards/items/openapi/"><g class="graph-node item" transform="translate(30 732)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">openapi</text></g></a>
    <a href="/docs/standards/items/github-action/"><g class="graph-node item" transform="translate(30 772)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">github-action</text></g></a>
    <a href="/docs/standards/items/vscode-extension/"><g class="graph-node item" transform="translate(30 812)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">vscode-extension</text></g></a>
    <a href="/docs/standards/items/tauri/"><g class="graph-node item" transform="translate(30 852)"><rect width="145" height="28" rx="14"/><text x="72.5" y="18">tauri</text></g></a>

    <!-- authored standards -->
    <a href="/docs/standards/stacks/react-spa/"><g class="graph-node authored" transform="translate(610 140)"><rect width="145" height="60" rx="8"/><text x="72.5" y="25">react-spa</text><text class="sub" x="72.5" y="43">authored v1</text></g></a>
    <a href="/docs/standards/stacks/cloudflare-pages-fullstack/"><g class="graph-node authored" transform="translate(610 255)"><rect width="145" height="60" rx="8"/><text x="72.5" y="23">pages</text><text x="72.5" y="39">fullstack</text><text class="sub" x="72.5" y="54">authored v1</text></g></a>
    <a href="/docs/standards/stacks/cloudflare-d1-app/"><g class="graph-node authored" transform="translate(610 370)"><rect width="145" height="60" rx="8"/><text x="72.5" y="25">d1-app</text><text class="sub" x="72.5" y="43">authored v1</text></g></a>
    <a href="/docs/standards/stacks/cloudflare-worker-mcp-server/"><g class="graph-node authored" transform="translate(610 490)"><rect width="145" height="60" rx="8"/><text x="72.5" y="23">worker-mcp</text><text x="72.5" y="39">server</text><text class="sub" x="72.5" y="54">authored v1</text></g></a>
    <a href="/docs/standards/stacks/tenant-deployed-cloudflare-saas/"><g class="graph-node authored" transform="translate(610 610)"><rect width="145" height="60" rx="8"/><text x="72.5" y="23">tenant</text><text x="72.5" y="39">cloudflare-saas</text><text class="sub" x="72.5" y="54">authored v1</text></g></a>
    <a href="/standards/security/v1/"><g class="graph-node authored" transform="translate(610 730)"><rect width="145" height="60" rx="8"/><text x="72.5" y="25">security</text><text class="sub" x="72.5" y="43">authored v1</text></g></a>

    <!-- planned standards -->
    <a href="/docs/standards/stacks/node-cli-internal-tool/"><g class="graph-node planned" transform="translate(1015 80)"><rect width="170" height="60" rx="8"/><text x="85" y="24">node-cli</text><text x="85" y="40">internal-tool</text><text class="sub" x="85" y="55">planned</text></g></a>
    <a href="/docs/standards/stacks/typescript-sdk/"><g class="graph-node planned" transform="translate(1015 200)"><rect width="170" height="60" rx="8"/><text x="85" y="25">typescript-sdk</text><text class="sub" x="85" y="43">planned</text></g></a>
    <a href="/docs/standards/stacks/github-action-package/"><g class="graph-node planned" transform="translate(1015 320)"><rect width="170" height="60" rx="8"/><text x="85" y="24">github-action</text><text x="85" y="40">package</text><text class="sub" x="85" y="55">planned</text></g></a>
    <a href="/docs/standards/stacks/vscode-extension-package/"><g class="graph-node planned" transform="translate(1015 440)"><rect width="170" height="60" rx="8"/><text x="85" y="24">vscode-extension</text><text x="85" y="40">package</text><text class="sub" x="85" y="55">planned</text></g></a>
    <a href="/docs/standards/stacks/tauri-react-desktop/"><g class="graph-node planned" transform="translate(1015 560)"><rect width="170" height="60" rx="8"/><text x="85" y="24">tauri-react</text><text x="85" y="40">desktop</text><text class="sub" x="85" y="55">planned</text></g></a>
    <a href="/docs/standards/stacks/zensical-kb-site/"><g class="graph-node planned" transform="translate(1015 680)"><rect width="170" height="60" rx="8"/><text x="85" y="25">zensical-kb-site</text><text class="sub" x="85" y="43">planned</text></g></a>

    <!-- templates -->
    <a href="https://github.com/vibecodeqa/ref-react-spa"><g class="graph-node template" transform="translate(1220 70)"><rect width="130" height="60" rx="8"/><text x="65" y="24">ref-react-spa</text><text class="sub" x="65" y="43">A 94</text></g></a>
    <a href="https://github.com/vibecodeqa/ref-cloudflare-worker-mcp"><g class="graph-node template" transform="translate(1220 310)"><rect width="130" height="60" rx="8"/><text x="65" y="24">ref-worker-mcp</text><text class="sub" x="65" y="43">A 91</text></g></a>
    <a href="https://github.com/vibecodeqa/ref-cloudflare-saas"><g class="graph-node template" transform="translate(1220 550)"><rect width="130" height="60" rx="8"/><text x="65" y="24">ref-saas</text><text class="sub" x="65" y="43">A 91</text></g></a>
  </g>
</svg>
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
