import type { Module } from "./types";

export const multimodal: Module = {
  id: "multimodal",
  title: "Multimodal & voice",
  blurb:
    "Beyond text: vision and document understanding, realtime voice agents and their latency budget, and generating images and video responsibly.",
  accent: "amber",
  lessons: [
    {
      slug: "vision-and-document-ai",
      title: "Vision & document understanding",
      summary:
        "How models see images, why OCR-free document extraction changed the game, and the engineering realities of resolution, tokens, and verification.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Multimodal models accept images alongside text. For AI engineering the most commercially significant consequence isn't image captioning — it's that **document understanding stopped being a pipeline**. Where you used to chain OCR, layout detection, table extraction, and post-processing, you can now hand over a page and a schema." },
        { type: "diagram", name: "multimodal-io", caption: "Images become tokens too — which is why resolution is a cost decision." },
        { type: "h2", text: "How images are consumed" },
        { type: "list", items: [
          "**Images are tokenised.** A picture is split into patches and encoded as tokens, so it consumes context and costs money like text. A high-resolution page can run into thousands of tokens.",
          "**Resolution is a trade-off.** Too low and small text is unreadable; too high and you burn tokens and hit size limits. Most providers downscale beyond a maximum dimension anyway — pre-resize deliberately rather than letting it happen to you.",
          "**Multiple images work**, and order matters: label them (\"Figure 1\", \"page 3 of 7\") so the model can refer to them unambiguously.",
          "**Detail is uneven.** Models read headings and body text well, and struggle with dense tables, handwriting, rotated text, low contrast, and small font sizes — exactly the cases document pipelines care about.",
        ]},
        { type: "h2", text: "Document extraction, done properly" },
        { type: "code", lang: "python", caption: "Schema-constrained extraction with verifiable evidence", code: `class LineItem(BaseModel):
    description: str
    quantity: int
    unit_price_cents: int
    total_cents: int

class Invoice(BaseModel):
    vendor: str
    invoice_number: str
    issue_date: date
    currency: Literal["USD", "EUR", "GBP"]
    line_items: list[LineItem]
    total_cents: int
    # the two fields that make the output trustworthy
    evidence: dict[str, str]        # field name -> the text seen on the page
    low_confidence_fields: list[str]

def extract(page_images: list[bytes]) -> Invoice:
    inv = call_model_with_schema(page_images, Invoice)

    # semantic validation — the schema can't catch a misread digit
    computed = sum(li.total_cents for li in inv.line_items)
    if computed != inv.total_cents:
        inv.low_confidence_fields.append("total_cents")

    if inv.low_confidence_fields:
        queue_for_human_review(inv, page_images)     # don't silently proceed
    return inv`},
        { type: "callout", kind: "key", text: "**Ask for evidence, not just values.** A `evidence` field quoting the text the model read for each value turns verification from a judgement call into a string comparison — and it catches invented values immediately. Combined with arithmetic reconciliation, it's the difference between a demo and a system finance will accept." },
        { type: "compare", caption: "Classic pipeline vs multimodal extraction.", columns: ["", "OCR pipeline", "Multimodal model"], rows: [
          { label: "Setup", cells: ["OCR + layout + table models + rules", "A schema and a prompt"] },
          { label: "New document type", cells: ["New rules or a new trained model", "Often just a new schema"] },
          { label: "Cost per page", cells: ["Low", "Higher — image tokens"] },
          { label: "Messy scans, odd layouts", cells: ["Brittle", "Substantially better"] },
          { label: "Dense tables", cells: ["Specialised models still strong", "Variable; verify totals"] },
          { label: "Determinism", cells: ["Repeatable", "Probabilistic — needs validation"] },
        ]},
        { type: "callout", kind: "warn", text: "**A wrong number that looks right is the whole risk.** OCR failures produce obvious garbage; a model misreading 8 as 3 produces a plausible invoice total nobody questions. Every extraction pipeline needs reconciliation (totals sum, dates in range, IDs exist in your systems) and a human path for low-confidence cases." },
        { type: "h2", text: "Other vision uses that pay" },
        { type: "list", items: [
          "**Screenshot understanding** — debugging support tickets, UI test verification, and driving computer-use agents.",
          "**Chart and diagram reading** — extracting figures from reports, though numeric precision needs checking.",
          "**Visual QA over products** — condition assessment, compliance checks, damage triage.",
          "**Accessibility** — generating alt text at scale, which is a genuinely high-value, low-risk application.",
          "**Multimodal retrieval** — embedding images and text in a shared space so a text query can retrieve a diagram.",
        ]},
        { type: "callout", kind: "tip", text: "For a scanned PDF, **send the page image rather than extracted text**. Text extraction discards layout — the very information that tells the model this number is in the \"Total\" column. Layout is signal, and rendering to an image preserves it." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Multimodal** = handling more than one input type — text, images, audio, video. **Vision-language model (VLM)** = a model taking images and text together. **OCR** = optical character recognition, converting an image of text to characters. **Layout-aware parsing** = extraction preserving spatial structure. **Image tokens** = the token cost of an image after patching. **Bounding box** = coordinates locating something in an image. **Grounding (vision)** = tying an answer to a specific region of the image." },
      ],
      takeaways: [
        "Images are tokenised, so resolution is a cost decision — pre-resize deliberately rather than letting the provider downscale.",
        "Multimodal extraction replaces OCR pipelines for messy documents: a schema instead of rules, at a higher per-page cost.",
        "Ask for an evidence field quoting what was read, and reconcile arithmetic — that's what makes extraction trustworthy.",
        "The risk is a plausible wrong value, not obvious garbage: validate semantically and route low-confidence cases to humans.",
        "Send page images rather than extracted text for scanned documents — layout is signal that text extraction throws away.",
      ],
      flashcards: [
        { front: "Why does image resolution matter for cost?", back: "Images are split into patches and encoded as tokens, so a high-resolution page can cost thousands of tokens. Resize deliberately to the minimum resolution that keeps the text legible." },
        { front: "What makes document extraction verifiable?", back: "An evidence field quoting the text read for each value, plus semantic reconciliation (line items summing to the total, dates in range, IDs that exist). Schema validation alone can't catch a misread digit." },
        { front: "Why send page images instead of extracted text for scanned PDFs?", back: "Text extraction discards layout, which is exactly the signal that identifies which number is the total. Rendering the page preserves the spatial structure." },
        { front: "How does multimodal extraction fail differently from OCR?", back: "OCR produces obvious garbage; a model produces a plausible wrong value that passes a glance. That's why reconciliation and a human path for low-confidence output are mandatory." },
      ],
      quiz: [
        { q: "Your invoice extractor returns a valid schema but occasionally wrong totals. What's missing?", options: ["A stricter schema", "Arithmetic reconciliation and an evidence field, with human review on mismatch", "Higher resolution only", "A larger model"], answer: 1, explain: "A schema is a type check. Summing line items against the stated total catches misreads, and evidence quotes make verification mechanical." },
        { q: "You're processing scanned contracts with complex layouts. Best input?", options: ["Text extracted with a PDF library", "Page images to a multimodal model", "OCR text with layout stripped", "Only the first page"], answer: 1, explain: "Layout carries meaning — column position, table structure, headings. Sending the rendered page keeps it; text extraction throws it away." },
        { q: "Costs spike after adding document upload. Most likely cause?", options: ["Longer prompts", "Full-resolution images consuming thousands of tokens each", "More users", "Slower model"], answer: 1, explain: "Image tokens scale with resolution. Downscale to the smallest size at which text stays legible, and consider cropping to the region of interest." },
      ],
    },
    {
      slug: "speech-and-voice-agents",
      title: "Speech & realtime voice agents",
      summary:
        "The STT→LLM→TTS pipeline versus native speech models, the latency budget that decides whether a voice agent feels human, and handling interruptions.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Voice is the interface where latency stops being a nice-to-have. In conversation, humans expect a response within roughly **200–300 milliseconds**; past about a second the interaction feels broken, no matter how good the answer is. Every architectural decision in a voice agent serves that budget." },
        { type: "diagram", name: "voice-pipeline", caption: "Two architectures. The cascade is debuggable; the native model is fast and expressive." },
        { type: "compare", caption: "The two ways to build voice.", columns: ["", "Cascaded (STT → LLM → TTS)", "Native speech model"], rows: [
          { label: "Latency", cells: ["Each stage adds up; ~800ms–2s typical", "Much lower — often sub-500ms"] },
          { label: "Debuggability", cells: ["Excellent — you can see the transcript at each stage", "Harder — no intermediate text by default"] },
          { label: "Control", cells: ["Swap any component; full text-side guardrails", "Less granular control"] },
          { label: "Expressiveness", cells: ["Tone and emotion are lost in transcription", "Preserves prosody, emotion, and interruption cues"] },
          { label: "Cost", cells: ["Three services to pay for", "Usually higher per minute"] },
          { label: "Best for", cells: ["Complex logic, tool use, regulated flows needing transcripts", "Natural conversation, low latency, consumer experiences"] },
        ]},
        { type: "h2", text: "The latency budget" },
        { type: "list", items: [
          "**Endpointing (detecting the user stopped)** — 100–300ms, and often the biggest single lever. Aggressive endpointing interrupts people mid-thought; conservative endpointing feels sluggish.",
          "**Transcription** — 100–300ms with streaming STT; don't wait for a final transcript to start thinking.",
          "**The model** — TTFT is what matters, not total generation. A short system prompt and a cached prefix pay off enormously here.",
          "**Speech synthesis** — 100–200ms to first audio with streaming TTS; synthesise sentence by sentence rather than waiting for the full response.",
          "**Network** — real, and often 100ms+ round trip; use a region close to your users.",
        ]},
        { type: "callout", kind: "key", text: "**Overlap everything.** Start transcribing while the user speaks, start generating on a partial transcript when confident, start synthesising the first sentence while the rest generates, and start playing while the rest synthesises. A pipeline that overlaps well feels twice as fast as one that doesn't, with identical components." },
        { type: "h2", text: "Conversational mechanics" },
        { type: "compare", caption: "The behaviours that separate a voice agent from a phone tree.", columns: ["Behaviour", "What it requires"], rows: [
          { label: "Barge-in", cells: ["The user can interrupt: stop playback immediately, cancel generation, and keep what they said"] },
          { label: "Turn-taking", cells: ["Distinguishing a pause from a finished turn — semantic endpointing beats silence timers"] },
          { label: "Backchannels", cells: ["Brief acknowledgements while thinking, so silence doesn't read as a dropped call"] },
          { label: "Graceful repair", cells: ["\"Sorry, I didn't catch that\" instead of confidently answering a mis-transcription"] },
          { label: "Filler for slow tools", cells: ["\"Let me check that for you\" covers a 2-second lookup that would otherwise be dead air"] },
        ]},
        { type: "callout", kind: "warn", text: "**Barge-in is not optional.** An agent that keeps talking over a user who is trying to correct it is the single most infuriating failure in voice, and it's an architecture requirement: you need cancellable generation, cancellable playback, and audio input processed continuously rather than only between turns." },
        { type: "h2", text: "What breaks in production" },
        { type: "list", items: [
          "**Names, IDs, and addresses** are transcribed badly. Always confirm them back, and use phonetic confirmation for critical values.",
          "**Accents and noise** degrade accuracy unevenly — evaluate STT per accent and per environment, not on clean studio audio.",
          "**Numbers are ambiguous** in speech (\"fifteen\" vs \"fifty\"). Confirm anything consequential.",
          "**Tool latency destroys the illusion.** Anything over ~1.5 seconds needs an audible acknowledgement first.",
          "**Guardrails are harder** — you can't stream audio out and retract it. Check the text before synthesis.",
          "**Recording is regulated.** Consent requirements vary by jurisdiction and are strict in several; handle disclosure at the start of the call.",
        ]},
        { type: "callout", kind: "tip", text: "**Keep the transcript even with a native speech model** where the API allows. It's your eval set, your audit trail, your debugging tool, and your compliance record. A voice system without transcripts is nearly impossible to improve systematically." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**STT / ASR** = speech to text. **TTS** = text to speech. **Cascaded pipeline** = STT → LLM → TTS as separate stages. **Native / speech-to-speech model** = one model handling audio in and out. **Endpointing** = detecting that the speaker has finished. **Barge-in** = the user interrupting the agent mid-response. **Backchannel** = a short acknowledgement (\"mm-hm\") while listening or thinking. **Prosody** = intonation, rhythm, and stress — the information transcription discards. **WER** = word error rate, the standard STT accuracy metric." },
      ],
      takeaways: [
        "Conversational latency expectation is 200–300ms; past a second the interaction feels broken regardless of answer quality.",
        "Cascaded pipelines are debuggable and controllable; native speech models are faster and preserve prosody.",
        "Overlap every stage — transcribe, generate, synthesise, and play concurrently — for the largest perceived speedup.",
        "Barge-in, semantic endpointing, backchannels, repair, and filler for slow tools are architecture requirements, not polish.",
        "Confirm names, IDs, and numbers; evaluate STT per accent and environment; check text before synthesis; keep transcripts.",
      ],
      flashcards: [
        { front: "What's the conversational latency target for voice agents?", back: "Roughly 200–300ms to first audio. Beyond about a second the interaction feels broken, which is why every stage must overlap rather than run in sequence." },
        { front: "Cascaded vs native speech models", back: "Cascaded (STT→LLM→TTS) is debuggable, controllable, and gives text-side guardrails. Native speech models are much faster and preserve prosody and emotion, at the cost of visibility." },
        { front: "What does barge-in require architecturally?", back: "Continuously processed audio input, cancellable generation, and cancellable playback — so the agent stops immediately when the user starts speaking, keeping what they said." },
        { front: "Why is endpointing the biggest latency lever?", back: "It decides when you start responding. Too aggressive and you cut people off mid-thought; too conservative and every turn feels sluggish. Semantic endpointing beats a silence timer." },
        { front: "Why keep transcripts even with a native speech model?", back: "They're your eval set, audit trail, debugging tool, and compliance record. Without them, systematically improving a voice system is close to impossible." },
      ],
      quiz: [
        { q: "Your voice agent takes 2.5s to respond and users talk over it. What are the two fixes?", options: ["A bigger model and more GPUs", "Overlap the pipeline stages, and implement barge-in with cancellable generation and playback", "Longer system prompt", "Higher audio quality"], answer: 1, explain: "Perceived latency comes from sequential stages — overlap them. And users talking over the agent must interrupt it, which requires cancellation throughout the stack." },
        { q: "A user gives a booking reference by voice and the agent gets it wrong. Best practice?", options: ["Increase STT model size only", "Confirm critical values back, phonetically where needed", "Ask them to type it", "Lower the temperature"], answer: 1, explain: "Alphanumeric references and names are the weakest point of speech recognition. Confirmation is a design requirement for any consequential value." },
        { q: "Which flow argues for a cascaded pipeline over a native speech model?", options: ["Casual consumer chat", "A regulated support flow needing transcripts, tool use, and text-side guardrails", "A voice game character", "An accessibility reader"], answer: 1, explain: "Cascaded gives you the transcript at each stage — auditable, guardrail-able, and debuggable — which regulated flows with tool use generally require." },
      ],
    },
    {
      slug: "image-and-video-generation",
      title: "Image & video generation",
      summary:
        "Diffusion in one lesson, where generated media belongs in a product, and the provenance, rights, and safety questions that come with it.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Generative image and video sit slightly outside the core AI-engineer remit, but they show up in product work constantly — marketing assets, product visualisation, synthetic training data, avatars — and the engineering questions around them are distinctly different from text." },
        { type: "h2", text: "How diffusion works, briefly" },
        { type: "p", text: "A **diffusion model** is trained to reverse noise: take an image, progressively add noise until it's static, and learn to undo each step. To generate, start from pure noise and denoise repeatedly, steered by a text embedding. More denoising steps means more detail and more time — which is why image generation latency is measured in seconds, not milliseconds." },
        { type: "compare", caption: "The controls you'll actually use.", columns: ["Control", "Effect"], rows: [
          { label: "Prompt + negative prompt", cells: ["What to include, and what to steer away from"] },
          { label: "Steps", cells: ["More steps → more detail, more time; diminishing returns quickly"] },
          { label: "Guidance scale", cells: ["How strictly to follow the prompt; too high looks over-saturated and rigid"] },
          { label: "Seed", cells: ["Reproducibility — the same seed and settings give the same image"] },
          { label: "Image-to-image / inpainting", cells: ["Editing an existing image, or regenerating a masked region"] },
          { label: "Structural conditioning", cells: ["Constraining composition with a pose, depth map, or edge map"] },
        ]},
        { type: "callout", kind: "tip", text: "**Seeds make generation testable.** Fixing the seed turns \"did my prompt change help?\" into a controlled comparison instead of a lottery, and it lets you reproduce a reported problem. Log the seed with every generation for the same reason you log the prompt version." },
        { type: "h2", text: "Where it fits in a product" },
        { type: "list", items: [
          "**Asset variation at scale** — dozens of localised or resized creative variants from one concept.",
          "**Placeholder and prototype imagery** — mockups that don't need a photoshoot.",
          "**Product visualisation** — a piece of furniture in a room, a garment in a colourway.",
          "**Synthetic training data** — rare visual cases for a downstream vision model, with the distribution caveats from Module 7.",
          "**Editing workflows** — background removal, object insertion, expansion — usually higher-value and lower-risk than generating from scratch.",
        ]},
        { type: "h2", text: "The questions text doesn't raise" },
        { type: "compare", caption: "Get answers before, not after.", columns: ["Question", "Why it matters"], rows: [
          { label: "Who owns the output?", cells: ["Copyright status of generated media varies by jurisdiction; commercial use terms vary by provider"] },
          { label: "What was it trained on?", cells: ["Some providers offer indemnification and licensed-data models specifically for commercial customers"] },
          { label: "Is it labelled?", cells: ["C2PA content credentials and provenance metadata are increasingly expected, and required in some jurisdictions"] },
          { label: "Does it depict a real person?", cells: ["Likeness rights and deepfake law — a hard line, not a grey area"] },
          { label: "Is it biased?", cells: ["Generated people skew heavily by profession, geography, and prompt wording; audit if it's user-facing"] },
          { label: "Is it safe?", cells: ["Provider filters exist and are not sufficient alone; add your own review for public-facing output"] },
        ]},
        { type: "callout", kind: "warn", text: "**Never generate images depicting identifiable real people without consent**, and don't build features that make it easy. Beyond the ethics, likeness rights and emerging deepfake legislation make it a legal exposure — and \"a user asked for it\" is not a defence when your product made it a button." },
        { type: "h2", text: "Engineering realities" },
        { type: "list", items: [
          "**Generation is slow** — seconds per image, longer for video. Design asynchronously: queue, notify, and let users do something else.",
          "**Costs are per image or per second of video**, not per token, and video is dramatically more expensive.",
          "**Iteration is the workflow.** Users rarely accept the first output — build for variation, refinement, and comparison, not one-shot generation.",
          "**Store the recipe, not just the result** — prompt, seed, model version, and settings. It's your reproducibility and your provenance record.",
          "**Moderate both directions** — filter prompts and review outputs, especially anything published publicly.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Diffusion model** = a generator trained to reverse a noising process. **Denoising steps** = iterations from noise to image; more means more detail and time. **Guidance scale (CFG)** = how strictly to follow the prompt. **Seed** = the random initialisation, which makes output reproducible. **Inpainting / outpainting** = regenerating a masked region, or extending beyond the frame. **LoRA (image)** = a small adapter teaching a style or subject. **C2PA / content credentials** = a standard for cryptographically signed provenance metadata. **Deepfake** = synthetic media depicting a real person." },
      ],
      takeaways: [
        "Diffusion generates by iteratively denoising, steered by the prompt; steps and guidance trade detail against time and rigidity.",
        "Fix and log seeds — they make generation reproducible and prompt changes testable.",
        "Editing workflows (inpainting, background removal, expansion) are often higher-value and lower-risk than generating from scratch.",
        "Rights, training-data provenance, C2PA labelling, likeness, bias, and safety are all questions to settle before shipping.",
        "Build asynchronously, expect iteration, store the full recipe, and moderate both prompts and outputs.",
      ],
      flashcards: [
        { front: "How does a diffusion model generate an image?", back: "It starts from pure noise and iteratively denoises, steered by the text embedding. More denoising steps means more detail and more time — hence seconds, not milliseconds." },
        { front: "Why log the seed with every generation?", back: "It makes output reproducible, so prompt changes become controlled comparisons and reported problems can be recreated exactly." },
        { front: "What is C2PA?", back: "A content-provenance standard attaching cryptographically signed metadata about how media was created — increasingly expected, and required in some jurisdictions." },
        { front: "Which image workflows are lower-risk than generation from scratch?", back: "Editing: inpainting, background removal, object insertion, and outpainting. They start from owned assets, so rights and provenance are simpler." },
        { front: "What should you store alongside a generated image?", back: "The full recipe — prompt, negative prompt, seed, model version, steps, and guidance scale. It's your reproducibility and provenance record." },
      ],
      quiz: [
        { q: "Marketing wants generated imagery for public campaigns. What must you check first?", options: ["Resolution limits", "Commercial-use terms, training-data provenance/indemnification, and provenance labelling", "Generation speed", "The seed value"], answer: 1, explain: "Public commercial use raises rights and provenance questions text generation doesn't. Some providers offer licensed-data models and indemnification specifically for this." },
        { q: "Your image feature is unusable because requests take 8 seconds. Best design change?", options: ["A faster model only", "Make it asynchronous — queue, notify, and let users continue working", "Fewer steps only", "Cache everything"], answer: 1, explain: "Generation is inherently seconds-long. Async workflows with progress and notification fit the medium; blocking a UI on it never will." },
        { q: "A user asks your product to generate an image of a named celebrity. What should the product do?", options: ["Generate it — the user asked", "Refuse: likeness rights and deepfake exposure", "Generate with a watermark", "Generate at low resolution"], answer: 1, explain: "Depicting identifiable real people without consent carries likeness-rights and deepfake-law exposure, and 'a user asked' isn't a defence when your product provides the button." },
      ],
    },
  ],
};
