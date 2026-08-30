import type { Accent } from "./types";

export interface CheatCommand {
  cmd: string;
  desc: string;
}

export interface CheatSection {
  title: string;
  commands: CheatCommand[];
}

export interface CheatSheet {
  id: string;
  tool: string;
  blurb: string;
  accent: Accent;
  sections: CheatSection[];
}

export const cheatsheets: CheatSheet[] = [
  {
    id: "messages",
    tool: "Messages API",
    blurb: "The one endpoint everything runs through, and the parameters worth knowing by heart.",
    accent: "clay",
    sections: [
      {
        title: "Getting a response",
        commands: [
          { cmd: "pip install anthropic", desc: "The official Python SDK." },
          { cmd: "client = Anthropic()", desc: "Resolves ANTHROPIC_API_KEY, then ANTHROPIC_AUTH_TOKEN, then an `ant auth login` profile." },
          { cmd: "client.messages.create(model=\"claude-opus-5\", max_tokens=16000, messages=msgs)", desc: "The whole API in one line. Stateless — you resend the history every turn." },
          { cmd: "system=\"You are …\"", desc: "A top-level parameter, not a message. There is no role=\"system\" entry in messages." },
          { cmd: "messages=[{\"role\": \"user\", \"content\": …}]", desc: "Must start with a user turn; roles alternate but consecutive same-role turns get merged." },
          { cmd: "for b in resp.content: if b.type == \"text\": …", desc: "content is a list of blocks. Narrow by type before reading .text." },
          { cmd: "client.models.list()", desc: "Live model list with context windows and capabilities — better than a hardcoded table." },
        ],
      },
      {
        title: "Stop reasons",
        commands: [
          { cmd: "end_turn", desc: "Claude finished naturally. The only one that needs no handling." },
          { cmd: "max_tokens", desc: "You capped it too low; the answer is truncated mid-thought." },
          { cmd: "tool_use", desc: "Claude wants a tool. Execute it and continue the loop." },
          { cmd: "pause_turn", desc: "A long server-tool turn paused and can be resumed." },
          { cmd: "refusal", desc: "Declined on safety grounds — check resp.stop_details.category before reading content." },
        ],
      },
      {
        title: "Images & documents",
        commands: [
          { cmd: "{\"type\": \"image\", \"source\": {\"type\": \"url\", \"url\": …}}", desc: "An image block in user content." },
          { cmd: "{\"type\": \"image\", \"source\": {\"type\": \"base64\", \"media_type\": …, \"data\": b64}}", desc: "Inline bytes; the base64 string must have no newlines." },
          { cmd: "{\"type\": \"document\", \"source\": {…\"media_type\": \"application/pdf\"…}}", desc: "A PDF. Put the document block before the text block." },
          { cmd: "citations={\"enabled\": True}", desc: "Set on every document block or none; responses then carry cited spans." },
          { cmd: "client.beta.files.upload(...)", desc: "Files API — upload once, reference by file_id across requests." },
        ],
      },
    ],
  },
  {
    id: "prompting",
    tool: "Prompting moves",
    blurb: "The handful of edits that reliably move quality, in rough order of leverage.",
    accent: "ochre",
    sections: [
      {
        title: "Structure",
        commands: [
          { cmd: "Long context first, instruction last", desc: "On long inputs this measurably beats the reverse — and it makes the prefix cacheable." },
          { cmd: "<document>…</document>", desc: "XML tags separate material from instructions far more reliably than blank lines." },
          { cmd: "Be specific about the output", desc: "\"Three bullets, under 15 words each\" beats \"be concise\" every time." },
          { cmd: "Give it a role in the system prompt", desc: "Role framing shifts vocabulary and depth; keep it in system, not the user turn." },
          { cmd: "Show 2–3 examples", desc: "Few-shot beats description for anything with a format or a judgement call." },
          { cmd: "Say what to do, not what to avoid", desc: "Negative instructions are followed less reliably than the positive equivalent." },
        ],
      },
      {
        title: "Reasoning & control",
        commands: [
          { cmd: "thinking={\"type\": \"adaptive\"}", desc: "Let the model reason before answering. The current form — budget_tokens is gone on new models." },
          { cmd: "output_config={\"effort\": \"low\"|…|\"max\"}", desc: "Depth and spend. Lower effort with thinking on usually beats thinking off." },
          { cmd: "output_config={\"format\": {…}}", desc: "Structured outputs — constrain the shape instead of asking nicely for JSON." },
          { cmd: "client.messages.parse(...)", desc: "Validates the response against your schema for you." },
          { cmd: "stop_sequences=[\"</answer>\"]", desc: "Cut generation at a marker you control." },
          { cmd: "# assistant prefill is gone", desc: "Prefilling the last assistant turn returns a 400 on current models; use structured outputs." },
        ],
      },
    ],
  },
  {
    id: "tools",
    tool: "Tool use",
    blurb: "Letting Claude act — the loop, the rules that keep it well-behaved, and the hosted tools.",
    accent: "sage",
    sections: [
      {
        title: "The loop",
        commands: [
          { cmd: "tools=[{\"name\": …, \"description\": …, \"input_schema\": {…}}]", desc: "The description is prompt text. Write it for the model that has to choose." },
          { cmd: "while resp.stop_reason == \"tool_use\": …", desc: "Execute, append results, call again until end_turn." },
          { cmd: "{\"type\": \"tool_result\", \"tool_use_id\": id, \"content\": out}", desc: "Sent back inside a user message." },
          { cmd: "# all results in ONE user message", desc: "Splitting parallel results trains Claude to stop asking in parallel." },
          { cmd: "is_error: true", desc: "Report a failure as a tool_result — dropping the block breaks the turn." },
          { cmd: "strict=True", desc: "Guarantees the input validates. Needs additionalProperties:false plus required." },
          { cmd: "tool_choice={\"type\": \"tool\", \"name\": …}", desc: "Force a specific tool when the route is already decided." },
          { cmd: "client.beta.messages.tool_runner(...)", desc: "The SDK's loop over @beta_tool functions, with per-turn hooks." },
        ],
      },
      {
        title: "Server-side tools",
        commands: [
          { cmd: "{\"type\": \"web_search_20260209\", \"name\": \"web_search\"}", desc: "Search runs on Anthropic's side; results land in the same response." },
          { cmd: "{\"type\": \"web_fetch_20260209\", \"name\": \"web_fetch\"}", desc: "Fetches a URL already present in the conversation." },
          { cmd: "{\"type\": \"code_execution_20260521\", \"name\": \"code_execution\"}", desc: "Sandboxed execution; results arrive as bash_code_execution_tool_result." },
          { cmd: "allowed_domains / blocked_domains", desc: "Constrain a web tool — one list or the other, never both." },
          { cmd: "# these errors return HTTP 200", desc: "A server-tool failure is an error object inside the result block, not an exception." },
        ],
      },
    ],
  },
  {
    id: "cost",
    tool: "Cost, speed & limits",
    blurb: "The levers that change the bill without changing the answer.",
    accent: "slateblue",
    sections: [
      {
        title: "Caching",
        commands: [
          { cmd: "cache_control={\"type\": \"ephemeral\"}", desc: "Auto-cache the last cacheable block. Reads cost roughly a tenth of fresh input." },
          { cmd: "{\"type\": \"ephemeral\", \"ttl\": \"1h\"}", desc: "Extend beyond the 5-minute default." },
          { cmd: "resp.usage.cache_read_input_tokens", desc: "Zero across identical prefixes means something is invalidating the cache." },
          { cmd: "# order is tools → system → messages", desc: "Cache is a prefix match. Keep stable content first, volatile content last." },
          { cmd: "# no timestamps in the prefix", desc: "One changed byte drops the hit rate to zero. This is the classic bug." },
          { cmd: "# ~1024-token minimum, 4 breakpoints", desc: "Shorter prefixes silently do not cache at all." },
        ],
      },
      {
        title: "Throughput & measurement",
        commands: [
          { cmd: "client.messages.batches.create(requests=[…])", desc: "Asynchronous batch at 50% cost, for work nobody is waiting on." },
          { cmd: "result.custom_id", desc: "Batch results return in any order. Key by custom_id, never by position." },
          { cmd: "with client.messages.stream(...) as s: s.get_final_message()", desc: "Stream long outputs; big max_tokens without streaming hits HTTP timeouts." },
          { cmd: "client.messages.count_tokens(model=…, messages=…)", desc: "Real token counts. Do not estimate with a third-party tokenizer." },
          { cmd: "resp.usage.input_tokens / .output_tokens", desc: "Per-request accounting — aggregate by route to find the expensive one." },
          { cmd: "context_management={\"edits\": [{\"type\": \"clear_tool_uses_20250919\"}]}", desc: "Clear old tool results; distinct from compaction, which summarises." },
        ],
      },
      {
        title: "Errors",
        commands: [
          { cmd: "except anthropic.RateLimitError", desc: "429. Back off and retry; the SDK already retries twice by default." },
          { cmd: "except anthropic.BadRequestError", desc: "400 — a malformed request. Retrying will not help." },
          { cmd: "except anthropic.APIConnectionError", desc: "Network failure before a response; safe to retry." },
          { cmd: "# catch specific → general", desc: "One broad `except APIError` loses the retryable/non-retryable distinction." },
        ],
      },
    ],
  },
];
