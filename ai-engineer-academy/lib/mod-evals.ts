import type { Module } from "./types";

export const evals: Module = {
  id: "evals",
  title: "Evaluation",
  blurb:
    "The skill that most separates people who ship from people who demo: building datasets, judging open-ended output, running evals as CI, and measuring what happens in production.",
  accent: "iris",
  lessons: [
    {
      slug: "eval-driven-development",
      title: "Eval-driven development",
      summary:
        "Why the eval comes before the prompt, what an eval suite actually consists of, and the levels of rigour to apply at each stage.",
      minutes: 11,
      blocks: [
        { type: "p", text: "The defining difference between AI systems that improve over months and ones that plateau in week two is whether the team can **answer \"is this better?\" with a number**. Everything else — prompts, retrieval, models, agents — is guesswork without it." },
        { type: "callout", kind: "key", text: "**Write the eval before you tune the thing.** Not because it's virtuous, but because prompt intuition is measurably unreliable: changes that feel like improvements routinely trade one failure mode for another, and without a scored comparison you will ship the trade without noticing." },
        { type: "diagram", name: "eval-pyramid", caption: "Cheap and deterministic at the base, expensive and human at the top — and you need all four layers." },
        { type: "h2", text: "The four layers" },
        { type: "compare", caption: "Different costs, different jobs, different cadences.", columns: ["Layer", "What it checks", "Cost", "Runs"], rows: [
          { label: "Assertions", cells: ["Parses, matches schema, contains required fields, under length, no PII", "Free", "Every request in CI"] },
          { label: "Reference metrics", cells: ["Exact match, F1, recall@k, numeric accuracy against labels", "Cheap", "Every PR"] },
          { label: "LLM judges", cells: ["Groundedness, helpfulness, tone, rubric compliance", "Moderate", "Pre-release and sampled in production"] },
          { label: "Human review", cells: ["The ground truth everything else is calibrated against", "Expensive", "Weekly samples, plus all judge calibration"] },
        ]},
        { type: "callout", kind: "tip", text: "Most teams jump straight to LLM judges and skip the base. **Deterministic assertions catch an embarrassing share of real failures** — malformed JSON, missing citations, empty responses, leaked system prompts, PII in output — for zero cost and with zero ambiguity. Build that layer first." },
        { type: "h2", text: "What goes in the suite" },
        { type: "steps", items: [
          { title: "A golden dataset", text: "Real inputs with expected outputs or expected properties. 50 to start, 200–500 when mature. Version it in git alongside the code it tests." },
          { title: "Slices", text: "Tag every case: request type, language, document source, customer segment, difficulty. Reporting only the mean hides a segment that's entirely broken." },
          { title: "Metrics per stage", text: "Retrieval metrics, generation metrics, and end-to-end metrics separately — otherwise you can't tell which component regressed." },
          { title: "Cost and latency", text: "A change that raises quality 2% and cost 300% is usually a regression. Track them in the same report." },
          { title: "A pass/fail bar", text: "Explicit thresholds per metric so 'ship it?' isn't a debate every time." },
          { title: "A one-command runner", text: "If running the evals takes more than a minute of effort, they stop being run — and an eval suite nobody runs is worse than none, because it creates false confidence." },
        ]},
        { type: "code", lang: "python", caption: "The cheapest layer, which most teams skip", code: `def assertions(case, output) -> dict[str, bool]:
    """Deterministic checks. No judge, no labels, no ambiguity."""
    return {
        "parses":          is_valid_json(output.text),
        "schema_ok":       matches_schema(output.text, case.schema),
        "has_citations":   bool(output.citations) or not case.requires_citations,
        "citations_exist": all(c in output.provided_ids for c in output.citations),
        "within_length":   len(output.text) <= case.max_chars,
        "no_pii":          not detect_pii(output.text),
        "no_prompt_leak":  SYSTEM_MARKER not in output.text,
        "declined_ok":     output.declined == (not case.answerable),
        "under_budget":    output.cost_usd <= case.cost_budget,
    }

# Any False here is a bug, not a judgement call — and it costs nothing to run
# on every case, on every commit.`},
        { type: "h2", text: "Where the dataset comes from" },
        { type: "list", ordered: true, items: [
          "**Real production traffic** — the gold standard, because it's in-distribution by construction. Sample across time and slices, not just the last hour.",
          "**Every incident and complaint** — a thumbs-down, an escalation, a bug report becomes a permanent test case. This is how the suite compounds in value.",
          "**Domain experts writing hard cases** — the ones they know are tricky, which is exactly what public benchmarks lack.",
          "**Synthetic generation, then human verification** — cheap to draft candidates; the verification is the part that matters.",
          "**Adversarial cases** — injection attempts, out-of-scope requests, ambiguous phrasing, and unanswerable questions." ,
        ]},
        { type: "callout", kind: "warn", text: "**Guard the eval set from contamination.** If eval examples end up in few-shot prompts, fine-tuning data, or the retrieval index, your numbers become fiction — and the fiction is flattering, so nobody questions it. Keep the golden set separate and check for leakage whenever training data is assembled." },
        { type: "h2", text: "Rigour by stage" },
        { type: "compare", caption: "Don't over-engineer week one; don't under-engineer month six.", columns: ["Stage", "Eval practice"], rows: [
          { label: "Prototype", cells: ["20 examples in a spreadsheet, eyeballed. Enough to notice you're wrong."] },
          { label: "First release", cells: ["50–100 cases, assertions plus a simple judge, run before every deploy."] },
          { label: "Scaling", cells: ["200–500 cases, sliced, in CI, with cost/latency tracking and calibrated judges."] },
          { label: "Mature", cells: ["Continuous online evaluation, per-slice dashboards, automatic regression alerts, and an eval set that grows from production failures."] },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Golden dataset / golden set** = curated inputs with known-good outputs or properties. **Slice** = a labelled subset reported separately. **Assertion** = a deterministic pass/fail check. **Regression suite** = evals run automatically on every change. **Contamination / leakage** = eval data appearing in training or prompts, inflating scores. **Offline vs online eval** = pre-deployment on a fixed set vs measured on live traffic. **Pass bar** = the threshold a change must clear to ship." },
        { type: "quote", text: "You can't improve what you can't measure — and in AI, you can't even tell whether you made it worse.", cite: "The reason this module sits at the centre of the course" },
      ],
      takeaways: [
        "Build the eval before tuning the prompt: intuition about prompt changes is unreliable and trades failure modes silently.",
        "Four layers — assertions, reference metrics, LLM judges, human review — with the cheap deterministic base built first.",
        "A suite is a versioned golden set, slices, per-stage metrics, cost/latency, explicit pass bars, and a one-command runner.",
        "Grow the dataset from production traffic, incidents, expert-written hard cases, verified synthetic cases, and adversarial inputs.",
        "Protect against contamination — leaked eval data produces flattering numbers nobody questions.",
      ],
      flashcards: [
        { front: "Why write evals before tuning prompts?", back: "Prompt changes routinely trade one failure mode for another, and human intuition can't detect that. Without a scored comparison you ship regressions believing they're improvements." },
        { front: "What belongs in the assertion layer?", back: "Deterministic checks: valid JSON, schema match, citations that exist, length limits, no PII, no prompt leak, correct declines, within cost budget. Free to run and unambiguous." },
        { front: "Why report slices instead of the mean?", back: "Averages hide segments. A model can score 88% overall while being completely broken on German-language or long-document cases — and the mean will never tell you." },
        { front: "What is eval contamination?", back: "Eval examples leaking into few-shot prompts, fine-tuning data, or the retrieval index. Scores become inflated fiction — and because they look good, nobody investigates." },
        { front: "How should the eval set grow?", back: "From production: every thumbs-down, escalation, and incident becomes a permanent test case. That's what makes the suite compound in value rather than go stale." },
      ],
      quiz: [
        { q: "Your team debates whether a new prompt is better by reading outputs. What's missing?", options: ["A bigger model", "A scored golden set with pass bars", "More prompt iterations", "Lower temperature"], answer: 1, explain: "Reading outputs measures how the outputs feel to whoever is reading. A versioned set with metrics and explicit thresholds turns the debate into a comparison." },
        { q: "Which eval layer should you build first?", options: ["LLM-as-judge", "Deterministic assertions", "Human review panels", "A public benchmark"], answer: 1, explain: "Assertions cost nothing, are unambiguous, and catch a surprising share of real failures — malformed output, missing citations, PII leaks. Judges come after that base exists." },
        { q: "Your eval scores jumped after you added few-shot examples drawn from the eval set. What happened?", options: ["A genuine improvement", "Contamination — you're testing on your training examples", "A judge bug", "Slice imbalance"], answer: 1, explain: "Eval examples in the prompt make the numbers meaningless. Keep the golden set strictly separate from anything the system sees at runtime or during training." },
      ],
    },
    {
      slug: "building-eval-datasets",
      title: "Building the dataset & doing error analysis",
      summary:
        "How to get from zero examples to a suite that finds real bugs — plus the error-analysis loop that turns messy failures into a prioritised backlog.",
      minutes: 11,
      blocks: [
        { type: "p", text: "The eval dataset is where the actual work is. Metrics are a few lines of code; a set of examples that genuinely represents your problem takes deliberate effort — and it's the artefact that keeps paying out long after any particular prompt is gone." },
        { type: "h2", text: "Starting from zero" },
        { type: "steps", items: [
          { title: "Write 20 cases yourself, today", text: "From the product spec and your own understanding. Imperfect and immediate beats perfect and never — you'll find real bugs in the first ten." },
          { title: "Get a domain expert to add the hard ones", text: "Ask specifically: what would a new hire get wrong here? Those cases are worth ten generic ones." },
          { title: "Ship behind a flag and capture traffic", text: "Real inputs beat imagined ones. Log everything, with consent and retention limits in place from day one." },
          { title: "Label a stratified sample", text: "Not the most recent 100 — sample across request types, lengths, and outcomes so the set matches reality." },
          { title: "Add every failure permanently", text: "Each incident, thumbs-down, and escalation becomes a regression case with the expected behaviour recorded." },
        ]},
        { type: "callout", kind: "tip", text: "**Expected *properties* often beat expected *outputs*.** For open-ended tasks, don't write the ideal answer — write what must be true: mentions the refund window, cites the policy document, doesn't promise an exception, under 150 words. Properties are checkable, robust to rewording, and far faster to author." },
        { type: "h2", text: "Error analysis: the loop that actually finds bugs" },
        { type: "p", text: "The highest-value hour in AI engineering is sitting down with 50 real failures and **categorising them by hand**. It's unglamorous and it consistently reveals that what everyone assumed was one problem is actually four, with the biggest one being something nobody had mentioned." },
        { type: "steps", items: [
          { title: "Collect 50–100 real failures", text: "From production traces, thumbs-down, and eval misses. Not cherry-picked — sampled." },
          { title: "Read them and write a one-line cause for each", text: "In your own words, without a taxonomy. The taxonomy comes from the data, not before it." },
          { title: "Cluster into categories", text: "Group the one-liners. You'll typically end with 5–8 categories from 50 failures." },
          { title: "Count and rank", text: "Frequency × severity. This is your prioritised backlog, and it's usually a surprise." },
          { title: "Fix the top category and re-measure", text: "One change, one measurement. Then repeat — the ranking shifts after each fix." },
        ]},
        { type: "code", lang: "python", caption: "An eval case rich enough to be useful two quarters from now", code: `{
  "id": "refund-eu-partial-2026-03",
  "input": "I bought this 45 days ago in Germany, can I still get money back?",

  # what must be true — properties, not a single golden string
  "expects": {
    "must_mention":   ["14-day EU withdrawal period", "warranty claim"],
    "must_not_claim": ["full refund guaranteed"],
    "must_cite":      ["policy-eu-returns#3.2"],
    "max_words":      150,
    "should_decline":  False,
  },

  # slices — this is what makes the report actionable
  "slices": {"region": "EU", "topic": "refunds", "difficulty": "hard",
             "language": "en", "type": "policy-edge-case"},

  # provenance — why this case exists at all
  "source": "production-thumbs-down",
  "added":  "2026-03-14",
  "note":   "Model previously offered a full refund outside the window.",
}`},
        { type: "h2", text: "Common dataset mistakes" },
        { type: "compare", caption: "What goes wrong, and the symptom.", columns: ["Mistake", "Symptom"], rows: [
          { label: "All easy cases", cells: ["Everything scores 95%+ and the eval never catches a regression"] },
          { label: "All hard cases", cells: ["Everything scores 40% and improvements are invisible in the noise"] },
          { label: "Invented inputs only", cells: ["Great scores offline, poor behaviour on real, messier traffic"] },
          { label: "No unanswerable cases", cells: ["You never measure whether the system declines when it should"] },
          { label: "No slices", cells: ["A whole segment is broken and the mean looks fine"] },
          { label: "Too small", cells: ["A 2-point change is indistinguishable from noise"] },
          { label: "Never updated", cells: ["It measures last quarter's product"] },
        ]},
        { type: "callout", kind: "warn", text: "**Mind your sample size.** With 50 cases, a change from 84% to 88% is well within noise — you cannot conclude anything from it. Either grow the set, run multiple samples per case and compare distributions, or restrict your conclusions to changes big enough to be real. Reporting a 2-point win on 50 examples as a victory is how teams talk themselves into regressions." },
        { type: "h2", text: "Labelling without losing your mind" },
        { type: "list", items: [
          "**Write the rubric before labelling**, and have two people label the same 20 cases to check agreement. Low agreement means the rubric is ambiguous, not that the labellers are careless.",
          "**Binary or three-point scales.** Nobody can reliably distinguish a 6 from a 7 out of 10, and the noise pollutes everything downstream.",
          "**Label the property, not the vibe** — 'cites a real source' rather than 'seems trustworthy'.",
          "**Pre-label with a model, verify by hand.** Reviewing is several times faster than authoring, and the verification is what makes the labels trustworthy.",
          "**Record who labelled what and when.** You will need to re-examine old labels when the rubric evolves.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Stratified sampling** = sampling proportionally across categories so the set mirrors reality. **Error analysis** = manually categorising failures to build a prioritised backlog. **Inter-annotator agreement** = how often independent labellers agree; low agreement means an ambiguous rubric. **Expected properties** = checkable conditions on an output rather than one correct answer. **Regression case** = a test added from a real failure so it can never silently return. **Statistical significance** = whether a measured difference is distinguishable from noise." },
      ],
      takeaways: [
        "Start with 20 self-written cases today; grow via expert-written hard cases and captured production traffic.",
        "Prefer expected properties over expected outputs for open-ended tasks — checkable and robust to rewording.",
        "Error analysis (read 50 real failures, cluster, count, rank) is the highest-value hour in AI engineering.",
        "Avoid all-easy, all-hard, invented-only, unsliced, tiny, and stale datasets — each has a distinct failure symptom.",
        "Respect sample size: small movements on small sets are noise, not results.",
      ],
      flashcards: [
        { front: "What is error analysis and why does it work?", back: "Reading 50–100 real failures, writing a one-line cause for each, clustering, and ranking by frequency × severity. It reliably reveals that one assumed problem is actually several — with a surprising top item." },
        { front: "Why use expected properties instead of a golden answer?", back: "Open-ended tasks have many correct phrasings. Properties — must mention X, must cite Y, must not claim Z, under N words — are checkable and don't break when wording changes." },
        { front: "Why binary or three-point labelling scales?", back: "Humans can't reliably distinguish a 6 from a 7 out of 10. The extra granularity is noise that propagates into every downstream metric and judge calibration." },
        { front: "You have 50 eval cases and a score moved from 84% to 88%. What can you conclude?", back: "Essentially nothing — that's within noise for that sample size. Grow the set, sample repeatedly, or restrict conclusions to larger effects." },
        { front: "What does low inter-annotator agreement tell you?", back: "That the rubric is ambiguous, not that the labellers are bad. Fix the rubric definition before labelling more data." },
      ],
      quiz: [
        { q: "Your eval scores 96% but users complain constantly. Most likely cause?", options: ["The metric is wrong", "The dataset is all easy cases and doesn't reflect real traffic", "The model is too small", "Temperature is too high"], answer: 1, explain: "An eval that everything passes has no discriminating power. Sample real production inputs — including the messy, ambiguous, and adversarial ones users actually send." },
        { q: "What's the highest-value first step when quality is 'bad' but nobody can say how?", options: ["Try a bigger model", "Manually categorise 50 real failures", "Rewrite the system prompt", "Add more retrieval"], answer: 1, explain: "Error analysis turns a vague complaint into a ranked backlog with counts. Every other action is guessing until you know which failure dominates." },
        { q: "You need to label 500 outputs for helpfulness. Best approach?", options: ["One person, 1–10 scale", "Write the rubric first, pre-label with a model, verify by hand on a binary scale", "Three people, 1–10 scale, average", "Skip labelling and use a judge only"], answer: 1, explain: "A rubric first prevents drift, a coarse scale prevents noise, and model pre-labelling with human verification is several times faster than authoring while keeping labels trustworthy." },
      ],
    },
    {
      slug: "llm-as-judge",
      title: "LLM-as-judge",
      summary:
        "Using a model to score open-ended output — rubric design, the known biases, calibration against humans, and where judges must not be trusted.",
      minutes: 11,
      blocks: [
        { type: "p", text: "For most interesting outputs there's no reference answer to match against. **LLM-as-judge** — having a model score outputs against a rubric — is how teams evaluate summaries, explanations, tone, and helpfulness at a scale humans can't reach. Used carefully it correlates well with human judgment. Used carelessly it manufactures confident numbers that mean nothing." },
        { type: "diagram", name: "llm-judge", caption: "The judge is a measuring instrument, and instruments need calibration." },
        { type: "h2", text: "Three judge shapes" },
        { type: "compare", caption: "Pick by what you actually need to decide.", columns: ["Shape", "Prompt", "Best for"], rows: [
          { label: "Pairwise", cells: ["\"Which of A or B better satisfies the criteria?\"", "Comparing two versions — most reliable, because relative judgments are easier"] },
          { label: "Direct scoring", cells: ["\"Score this 1–5 against the rubric\"", "Tracking absolute quality over time — needs anchored definitions"] },
          { label: "Binary criteria", cells: ["\"Is every claim supported by a cited source? yes/no\"", "The most reliable of all — use wherever the question can be made binary"] },
        ]},
        { type: "callout", kind: "key", text: "**Decompose quality into binary checks wherever possible.** \"Is this a good answer, 1–5?\" is noisy and drifts. \"Does it answer the question asked? Is every claim cited? Is it under 150 words? Does it avoid promising exceptions?\" — four yes/no questions — is stable, debuggable, and tells you *which* thing broke." },
        { type: "code", lang: "python", caption: "A judge prompt that actually holds up", code: `JUDGE = """You are evaluating a customer-support answer against source documents.

<question>{question}</question>
<sources>{sources}</sources>
<answer>{answer}</answer>

Assess each criterion independently. Quote the evidence for your verdict.

1. grounded — is EVERY factual claim supported by the sources?
2. answers_question — does it address what was actually asked?
3. cites_correctly — does every citation point to a source that exists and
   contains the claim it is attached to?
4. appropriate_refusal — if the sources are insufficient, does it say so
   rather than guessing?
5. within_policy — does it avoid promising exceptions or commitments?

Return only:
{{"grounded": bool, "grounded_evidence": "<quote>",
  "answers_question": bool, "cites_correctly": bool,
  "appropriate_refusal": bool, "within_policy": bool,
  "worst_problem": "<one sentence, or empty>"}}"""

# Notes on why this works:
#  - independent binary criteria, not one blended score
#  - evidence required, which suppresses confident guessing
#  - a different model family from the one being judged
#  - the answer comes last, so the criteria are read first`},
        { type: "h2", text: "The biases, by name" },
        { type: "compare", caption: "Every one of these is documented and reproducible.", columns: ["Bias", "Effect", "Mitigation"], rows: [
          { label: "Verbosity", cells: ["Longer answers score higher regardless of quality", "An explicit conciseness criterion; cap length in the task"] },
          { label: "Position", cells: ["In pairwise, the first (or last) option is favoured", "Run both orders and average; discard inconsistent pairs"] },
          { label: "Self-preference", cells: ["A judge prefers text from its own model family", "Judge with a different family than the generator"] },
          { label: "Confidence / style", cells: ["Assertive, well-formatted text scores higher than hedged correct text", "Require evidence quotes; check facts separately"] },
          { label: "Leniency drift", cells: ["Direct scores creep upward over time and across versions", "Anchor examples in the rubric; re-calibrate periodically"] },
          { label: "Sycophancy to the rubric", cells: ["The judge agrees with whatever framing you supply", "Neutral wording; don't hint at the expected verdict"] },
        ]},
        { type: "callout", kind: "warn", text: "**Never let the same model, with the same prompt, both generate and judge.** It will systematically approve its own characteristic mistakes — the errors it makes are precisely the ones it doesn't recognise as errors. Use a different model family, or at minimum a genuinely different prompt with independent criteria." },
        { type: "h2", text: "Calibration is the whole ballgame" },
        { type: "steps", items: [
          { title: "Human-label 100–200 outputs", text: "Using the same rubric the judge will use. This is your ground truth." },
          { title: "Run the judge on the same set", text: "Compare verdict by verdict, not just in aggregate." },
          { title: "Measure agreement", text: "Percentage agreement plus a chance-corrected statistic. Above ~80% on binary criteria is usable; below that, fix the rubric." },
          { title: "Inspect the disagreements", text: "This is the valuable part — disagreements almost always reveal an ambiguous criterion rather than a stupid judge." },
          { title: "Re-calibrate on every change", text: "New judge model, new rubric, new prompt version → repeat. An uncalibrated judge is an unlabelled instrument." },
        ]},
        { type: "callout", kind: "tip", text: "Report the judge's **agreement with humans** alongside its scores, permanently. \"Groundedness 0.91 (judge, 87% human agreement on 200 cases)\" is a defensible claim. A bare \"0.91\" invites a trust it hasn't earned." },
        { type: "h2", text: "Where judges must not be trusted" },
        { type: "list", items: [
          "**Factual correctness against the world** — a judge shares the generator's knowledge gaps. Verify facts against sources, not against another model's opinion.",
          "**Domain expertise you don't have** — a judge scoring clinical or legal accuracy without expert calibration is confidence theatre.",
          "**Safety-critical decisions** — a judge is one signal in a review process, never the approver.",
          "**Tiny differences** — judges have their own noise floor; a 1–2 point gap is not a result.",
          "**As the optimisation target** — optimise a prompt against a judge for long enough and you'll learn to game the judge rather than help the user. Keep a human-labelled holdout the optimiser never sees.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**LLM-as-judge** = using a model to score outputs against a rubric. **Pairwise comparison** = judging which of two outputs is better. **Rubric** = the explicit criteria and their definitions. **Position bias** = order affecting a pairwise verdict. **Self-preference bias** = favouring one's own model family's output. **Calibration** = measuring judge agreement against human labels. **Holdout set** = labelled data kept out of any optimisation loop. **Goodhart's law** = when a measure becomes a target, it stops being a good measure." },
      ],
      takeaways: [
        "Judges scale open-ended evaluation, but only produce meaningful numbers when calibrated against human labels.",
        "Prefer binary criteria, then pairwise; direct 1–5 scoring is the noisiest and drifts over time.",
        "Known biases — verbosity, position, self-preference, confident style, leniency drift — each have a specific mitigation.",
        "Never let the same model and prompt both generate and judge; it approves its own characteristic mistakes.",
        "Don't trust judges for world-facts, unfamiliar expertise, safety approval, tiny differences, or as an optimisation target.",
      ],
      flashcards: [
        { front: "Which judge format is most reliable?", back: "Binary criteria ('is every claim cited? yes/no'), then pairwise comparison. Direct 1–5 scoring is noisiest and drifts upward over time." },
        { front: "How do you handle position bias in pairwise judging?", back: "Run each comparison in both orders and average, discarding pairs where the verdict flips — those are cases the judge can't actually distinguish." },
        { front: "What agreement level makes a judge usable?", back: "Roughly 80%+ agreement with human labels on binary criteria, measured on 100–200 cases. Below that, the rubric is ambiguous and needs fixing before the judge is." },
        { front: "Why can't a judge verify factual correctness about the world?", back: "It shares the generator's knowledge gaps and biases. Facts must be checked against sources or ground truth, not against another model's opinion." },
        { front: "What happens if you optimise prompts against a judge?", back: "Goodhart's law — you learn to game the judge rather than help users. Keep a human-labelled holdout that the optimisation loop never sees." },
      ],
      quiz: [
        { q: "Your judge rates outputs from the same model family it comes from. What's the risk?", options: ["Higher cost", "Self-preference bias — it approves its own characteristic mistakes", "Slower evaluation", "Position bias"], answer: 1, explain: "A model's errors are exactly the ones it doesn't recognise as errors. Use a different model family, and calibrate either way." },
        { q: "You want to measure groundedness at scale. Best judge design?", options: ["'Rate quality 1–10'", "Independent binary criteria with required evidence quotes", "A single overall pass/fail", "Ask the generator to self-assess"], answer: 1, explain: "Decomposed binary criteria are stable and debuggable, and requiring quoted evidence suppresses confident guessing. Self-assessment is the least reliable option available." },
        { q: "Judge scores climbed steadily over three months while user complaints held steady. Most likely?", options: ["Genuine improvement", "Leniency drift or prompt overfitting to the judge", "Users are wrong", "Sample size grew"], answer: 1, explain: "Scores diverging from user experience is the signature of optimising against the measure. Re-calibrate against human labels and check a holdout the optimisation never touched." },
      ],
    },
    {
      slug: "online-evaluation",
      title: "Online evaluation & experimentation",
      summary:
        "Offline evals tell you what to ship; online evals tell you what happened — sampling, guardrail metrics, A/B testing, and catching drift.",
      minutes: 10,
      blocks: [
        { type: "p", text: "An offline eval measures a fixed dataset. Production measures reality — inputs you never imagined, distributions that shift, and users who behave differently than you expected. **Both are necessary**, and teams that only do offline evaluation are consistently surprised." },
        { type: "diagram", name: "eval-loop", caption: "Offline gates the release; online measures the truth and feeds the next offline set." },
        { type: "compare", caption: "Two different questions.", columns: ["", "Offline eval", "Online eval"], rows: [
          { label: "Question", cells: ["Would this change be better on known cases?", "Is it actually better for real users?"] },
          { label: "Data", cells: ["Fixed golden set", "Live traffic"] },
          { label: "Speed", cells: ["Minutes", "Days to weeks"] },
          { label: "Catches", cells: ["Regressions on known behaviour", "Unknown-unknowns, drift, real user impact"] },
          { label: "Role", cells: ["The gate before shipping", "The truth after shipping"] },
        ]},
        { type: "h2", text: "What to measure in production" },
        { type: "compare", caption: "Four tiers of signal, from noisiest to most reliable.", columns: ["Signal", "Strength", "Weakness"], rows: [
          { label: "Explicit feedback (👍/👎)", cells: ["Direct quality signal", "Tiny response rate, skewed to extremes"] },
          { label: "Implicit behaviour", cells: ["Every session provides it: copy, retry, rephrase, abandon, escalate", "Indirect — needs interpretation"] },
          { label: "Task outcomes", cells: ["The real business metric: ticket resolved, code merged, purchase completed", "Delayed and confounded by other factors"] },
          { label: "Sampled judging", cells: ["Groundedness and rubric compliance on live traffic", "Costs money; needs judge calibration"] },
        ]},
        { type: "callout", kind: "key", text: "**Regeneration and escalation rates are the most under-used quality signals you already have.** Nobody clicks thumbs-down, but everybody retries a bad answer or asks for a human. Instrument those, segment them by request type, and you have a continuous quality metric for free." },
        { type: "h2", text: "Guardrail metrics" },
        { type: "p", text: "When you ship a change, watch the metrics that must *not* get worse, alongside the one you're trying to improve. Quality improvements that quietly triple cost or double p95 latency are regressions dressed as wins." },
        { type: "list", items: [
          "**Cost per request** — and per successful outcome, which is the one that matters.",
          "**p95 latency and TTFT** — averages hide the users who left.",
          "**Refusal / decline rate** — a spike means over-refusal; a collapse means the model stopped declining when it should.",
          "**Escalation and regeneration rate** — the honest quality proxy.",
          "**Error and timeout rate** — including tool failures and guardrail blocks.",
          "**Safety flags** — injection detections, PII blocks, policy violations." ,
        ]},
        { type: "h2", text: "Experimenting properly" },
        { type: "steps", items: [
          { title: "Ship behind a flag", text: "Model, prompt version, and retrieval config as runtime configuration, not code — so a rollback is one change and not a deploy." },
          { title: "Canary first", text: "1–5% of traffic, watching guardrail metrics. Most bad changes are visible within an hour." },
          { title: "Randomise by user, not by request", text: "Otherwise a single user sees both variants across a conversation, which corrupts both their experience and your data." },
          { title: "Run long enough for the outcome metric", text: "If success is 'ticket resolved', you need the resolution window, not the first hour." },
          { title: "Pre-register what you're measuring", text: "One primary metric, explicit guardrails, and a decision rule agreed before the data arrives." },
          { title: "Keep a holdout", text: "A small always-baseline slice makes long-term drift visible — otherwise you only ever compare to last week." },
        ]},
        { type: "callout", kind: "warn", text: "**Watch for drift.** Input distributions change (a marketing campaign brings new phrasings), your index changes (documents added, others stale), and providers change models beneath you. All three degrade quality with no code change and no failing test. Monitor input distribution, retrieval score distribution, and output length distribution as leading indicators." },
        { type: "h2", text: "Closing the loop" },
        { type: "p", text: "The system that improves is the one where production failures reliably become offline test cases. Make that path a routine, not an act of heroism:" },
        { type: "list", ordered: true, items: [
          "A user gives a thumbs-down, escalates, or an alert fires.",
          "The full trace is available — inputs, retrieved context, prompt version, model, output.",
          "Someone triages it and, if it's a real defect, adds a case with the expected behaviour.",
          "The case enters the CI suite, so the bug can never silently return.",
          "The fix is measured against the same suite before it ships.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Online evaluation** = measuring quality on live traffic. **Guardrail metric** = a metric that must not regress even if the target improves. **Canary** = a small traffic percentage receiving a change first. **Holdout** = a slice permanently kept on the baseline to reveal long-term drift. **Implicit feedback** = behavioural signals like retries, copies, and abandonment. **Drift** = gradual change in inputs, data, or model behaviour that degrades quality without a code change. **Pre-registration** = agreeing the metric and decision rule before seeing results." },
      ],
      takeaways: [
        "Offline evals gate the release; online evals measure reality — you need both.",
        "Regeneration and escalation rates are strong, cheap quality signals that most teams already have and don't use.",
        "Ship behind flags, canary, randomise by user, run long enough for the outcome metric, and pre-register the decision rule.",
        "Track guardrail metrics — cost, p95 latency, refusal rate, error rate, safety flags — not just the target metric.",
        "Watch for input, index, and model drift, and make production failures become CI cases as a routine.",
      ],
      flashcards: [
        { front: "Why isn't an offline eval enough?", back: "It only measures cases you thought of. Production brings unimagined inputs, shifting distributions, and real user behaviour — the unknown-unknowns offline evaluation structurally can't cover." },
        { front: "What's the most under-used production quality signal?", back: "Regeneration and escalation rates. Almost nobody clicks thumbs-down, but everybody retries a bad answer or asks for a human — and both are already instrumentable." },
        { front: "Why randomise experiments by user rather than by request?", back: "Per-request randomisation makes one user experience both variants within a conversation, corrupting their experience and contaminating the measurement." },
        { front: "What is a guardrail metric?", back: "A metric that must not regress even if your target improves — cost per request, p95 latency, refusal rate, error rate, safety flags. Quality gains that triple cost are regressions." },
        { front: "Name three sources of drift", back: "Input distribution shifts (new user phrasings), index changes (new or stale documents), and provider model updates. All degrade quality with no code change and no failing test." },
      ],
      quiz: [
        { q: "Quality complaints rise but no code changed and offline evals still pass. Most likely?", options: ["Users are wrong", "Drift — inputs, index contents, or the provider's model changed", "The eval framework broke", "A caching bug"], answer: 1, explain: "This is the classic drift signature. Monitor input distribution, retrieval score distribution, and output length as leading indicators, and re-sample your eval set from current traffic." },
        { q: "Your A/B test shows +4% helpfulness and +180% cost. What should you do?", options: ["Ship it — quality wins", "Treat cost as a guardrail breach and evaluate whether the gain justifies it", "Ignore cost until scale", "Re-run the test"], answer: 1, explain: "Guardrail metrics exist precisely for this. The decision may still be to ship, but it must be an explicit trade-off, not an unnoticed one." },
        { q: "How should a production failure end up improving the system?", options: ["Someone tweaks the prompt", "It becomes a permanent CI eval case with expected behaviour, and the fix is measured against it", "It's logged and closed", "The model is upgraded"], answer: 1, explain: "Converting failures into regression cases is what makes an eval suite compound in value — and what guarantees the same bug can't silently return." },
      ],
    },
  ],
};
