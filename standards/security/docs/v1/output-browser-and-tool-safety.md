# Output, browser, and tool safety

## R-XSS-1 - Untrusted content is encoded, sanitized, or constrained

**Rule.** Untrusted HTML, Markdown, rich text, generated content, and external data must
be encoded, sanitized, or rendered through a constrained component before reaching the
browser or an embedded webview.

**Why.** React escapes ordinary text, but escape hatches and rich-content renderers can
turn data into executable browser content.

**vcqa.** Flag `dangerouslySetInnerHTML`, raw HTML renderers, Markdown plugins,
third-party embeds, webviews, or string-built DOM writes without sanitization or a
documented trust boundary.

**References.**

- OWASP Cross Site Scripting Prevention Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html>

## R-OUT-1 - Error and API responses do not leak sensitive internals

**Rule.** User-visible errors, API responses, tool outputs, and CLI output must not expose
secrets, stack traces, raw SQL, auth tokens, tenant secrets, private resource IDs, or
privileged config.

**Why.** Error paths often bypass normal response shaping.

**vcqa.** Flag catch blocks, error serializers, tool responses, and CLI output that return
raw exception objects, environment values, request headers, SQL text, or internal config
to untrusted users.

**References.**

- OWASP Error Handling Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html>

## R-TOOL-1 - Tool output is untrusted

**Rule.** MCP tool output, generated content, fetched pages, and model-produced text must
be treated as untrusted data when later displayed, logged, parsed, or used to trigger
side effects.

**Why.** Tool and model output can contain prompt injection, malicious HTML, misleading
commands, or data intended to influence later tool calls.

**vcqa.** Flag code that feeds tool output into privileged prompts, command execution,
HTML rendering, SQL, or follow-up tool dispatch without validation, scoping, or user
confirmation.

**References.**

- MCP Security Best Practices:
  <https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices>
- OWASP Cross Site Scripting Prevention Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html>

## R-OUT-2 - Logs redact sensitive output fields

**Rule.** Logs and telemetry must redact or omit known sensitive fields before emission.

**Why.** Logging can accidentally create a second copy of secrets and tenant data.

**vcqa.** Flag logging of full request/response objects, headers, cookies, tokens, secret
bindings, raw tool output, or tenant data payloads without redaction.

**References.**

- OWASP Logging Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
- OWASP Secrets Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>
