import type { Module } from "./types";

export const evals: Module = {
  id: "evals",
  title: "Evaluation",
  blurb:
    "How to measure whether a prompt actually works — so you can improve it with evidence instead of vibes.",
  accent: "ochre",
  lessons: [
    {
      slug: "why-evals",
      title: "Why evaluations matter",
      summary:
        "An eval is a test suite for prompts. Without one, every change is a guess. With one, you can improve, compare models, and ship with confidence.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Vibes don't scale" },
        {
          type: "p",
          text: "When you start, you judge a prompt by eyeballing a few outputs. That breaks down fast: you can't eyeball 10,000 cases, you can't tell if a tweak helped or hurt, and you can't safely switch models. An **evaluation (eval)** turns 'seems good' into a number you can track.",
        },
        {
          type: "p",
          text: "An eval is, conceptually, a **test suite for an AI feature**: a set of inputs, a way to run them through your prompt, and a way to score the results.",
        },
        { type: "diagram", name: "eval-loop", caption: "The improvement loop: dataset → run prompt → grade → measure → refine → repeat." },
        { type: "h3", text: "What an eval lets you do" },
        {
          type: "list",
          items: [
            "**Improve with evidence** — see if a prompt change raised or lowered the score.",
            "**Compare models** — is Haiku good enough, or do you need Sonnet? Measure it.",
            "**Catch regressions** — a change that fixes one case may break three others.",
            "**Ship safely** — set a quality bar and only deploy when it's met.",
          ],
        },
        { type: "h3", text: "The three ingredients" },
        {
          type: "steps",
          items: [
            { title: "A dataset", text: "Representative inputs — ideally including the tricky edge cases that trip your prompt up." },
            { title: "A task runner", text: "Code that feeds each input through your prompt and collects the output." },
            { title: "A grader", text: "A way to score each output: exact-match code, a rule check, or another model acting as judge." },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Eval the feature, not the model",
          text: "You're not testing whether Claude is smart — you're testing whether YOUR prompt + model + format reliably solves YOUR task on YOUR data. Build the dataset from real (or realistic) inputs.",
        },
      ],
      takeaways: [
        "An eval is a test suite for an AI feature: dataset + task runner + grader.",
        "It replaces eyeballing with a tracked score, enabling evidence-based improvement.",
        "Evals let you compare models, catch regressions, and ship against a quality bar.",
        "Build the dataset from realistic inputs, including hard edge cases.",
      ],
      flashcards: [
        { front: "What is an eval, in one line?", back: "A test suite for an AI feature: a dataset of inputs, a runner, and a grader that produces a score." },
        { front: "Three ingredients of an eval?", back: "A dataset, a task runner (prompt over each input), and a grader that scores outputs." },
        { front: "Why can't you just eyeball outputs?", back: "It doesn't scale, can't reliably detect whether a change helped or hurt, and can't safely compare models." },
      ],
      quiz: [
        {
          q: "You tweak a prompt and one example improves. Why isn't that enough to ship?",
          options: [
            "Tweaks are never allowed",
            "The change might have silently broken other cases — only a full eval reveals net effect",
            "You must always use a bigger model",
            "One example proves it works",
          ],
          answer: 1,
          explain: "Single examples hide regressions. An eval over the whole dataset shows the true net effect.",
        },
      ],
    },

    {
      slug: "building-evals",
      title: "Grading: code vs. model-graded",
      summary:
        "Some outputs you can check with code (exact match, valid JSON, contains keyword). For open-ended quality, use another Claude as the judge with a rubric.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "How do you score an answer?" },
        {
          type: "p",
          text: "The grader is the heart of an eval. There are two families, and good test suites use both.",
        },
        {
          type: "compare",
          caption: "Two ways to grade",
          columns: ["Type", "How it scores", "Best for"],
          rows: [
            { label: "Code-graded", cells: ["Deterministic checks in code.", "Classification, extraction, valid JSON, exact/format matches."] },
            { label: "Model-graded", cells: ["Another Claude judges against a rubric.", "Open-ended quality: tone, helpfulness, correctness of prose."] },
          ],
        },
        { type: "h3", text: "Code-graded evals" },
        {
          type: "p",
          text: "When there's a 'right answer' or a checkable property, grade with code. It's fast, free, and perfectly consistent.",
        },
        {
          type: "code",
          lang: "python",
          caption: "Grading a classification output",
          code: `def grade(output: str, expected: str) -> bool:
    return output.strip().upper() == expected.strip().upper()

# Or check structure:
def grade_json(output: str) -> bool:
    try:
        data = json.loads(output)
        return "summary" in data and "sentiment" in data
    except json.JSONDecodeError:
        return False`,
        },
        { type: "h3", text: "Model-graded evals (LLM-as-judge)" },
        {
          type: "p",
          text: "For subjective outputs — a summary's quality, a support reply's tone — there's no string to match. Instead, ask a second Claude to **score the output against a rubric**. Give the judge clear criteria and a scale, and have it return structured scores with a reason.",
        },
        {
          type: "code",
          lang: "text",
          caption: "A judge prompt",
          code: `You are grading a customer-support reply.

<reply>{{model_output}}</reply>

Score 1-5 on each, with a one-line reason. Return JSON:
{ "accuracy": n, "empathy": n, "followed_format": n, "reason": "..." }

A 5 in accuracy means every claim is supported by the docs.`,
        },
        {
          type: "callout",
          kind: "tip",
          title: "Make rubrics concrete",
          text: "Vague criteria ('is it good?') produce noisy scores. Define exactly what each score means ('5 = every claim cited; 1 = invents facts'). A strong model as judge with a precise rubric correlates well with human judgment.",
        },
        {
          type: "callout",
          kind: "key",
          title: "Mix both, then track over time",
          text: "Use code graders for anything checkable and model graders for the rest. Store the aggregate score, run it on every prompt change, and treat a drop as a regression — exactly like a failing unit test.",
        },
      ],
      takeaways: [
        "Code-graded evals deterministically check exact matches, format, or properties — fast and consistent.",
        "Model-graded evals (LLM-as-judge) score open-ended quality against a rubric.",
        "Make judge rubrics concrete with defined score meanings to reduce noise.",
        "Combine both, track the aggregate score, and treat drops as regressions.",
      ],
      flashcards: [
        { front: "When to use a code grader?", back: "When the output is checkable in code: classification labels, valid JSON, exact/format matches, keyword presence." },
        { front: "What is 'LLM-as-judge'?", back: "Using a second model to score open-ended outputs against a rubric, returning structured scores with reasons." },
        { front: "How to reduce noisy model-graded scores?", back: "Make the rubric concrete — define exactly what each score level means, with examples." },
      ],
      quiz: [
        {
          q: "Best grader for 'did the model output valid JSON with required keys'?",
          options: ["Model-graded judge", "Code-graded check (json.loads + key presence)", "Manual review", "Higher temperature"],
          answer: 1,
          explain: "A deterministic, checkable property is ideal for a fast, free code grader.",
        },
        {
          q: "Best grader for 'is this support reply empathetic and on-brand'?",
          options: ["Exact string match", "Regex", "Model-graded judge with a rubric", "Token count"],
          answer: 2,
          explain: "Subjective quality needs an LLM-as-judge scoring against a concrete rubric.",
        },
      ],
    },
  ],
};
