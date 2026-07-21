import type { Module } from "./types";

export const behavioral: Module = {
  id: "behavioral",
  title: "Behavioral & Strategy",
  blurb:
    "The part candidates under-prepare and lose offers on. How to structure your project stories, handle failure and tradeoff questions, understand what each AI role actually screens for, and ask questions that land.",
  accent: "rose",
  lessons: [
    {
      slug: "telling-your-story",
      title: "Structuring your stories with STAR",
      summary:
        "Technical brilliance won't save a rambling answer. The STAR structure and a project deep-dive template that make your experience land as clearly as your code.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Behavioral rounds decide more offers than candidates expect. Interviewers are probing for ownership, judgment, collaboration, and communication — and even a great story fails if it's told as a shapeless ramble. Structure is the fix." },
        { type: "h2", text: "The STAR method" },
        { type: "p", text: "Answer any 'tell me about a time…' question in four beats:" },
        { type: "steps", items: [
          { title: "Situation", text: "Set the context briefly — the project, your team, the stakes. One or two sentences." },
          { title: "Task", text: "What was your specific responsibility or the problem you owned? Make your role clear." },
          { title: "Action", text: "What YOU did — the decisions, tradeoffs, and technical choices. This is the bulk; use 'I' not 'we'." },
          { title: "Result", text: "The outcome, quantified where possible ('cut latency 40%', 'lifted conversion 3%'), plus what you learned." },
        ]},
        { type: "callout", kind: "key", text: "Two failure modes STAR fixes: burning all your time on Situation (context) and rushing the Action/Result, and saying 'we' so much the interviewer can't tell what YOU did. Spend most of your words on your specific actions and the measurable result." },
        { type: "h2", text: "The ML project deep-dive" },
        { type: "p", text: "Almost every AI interview includes 'walk me through an ML project you're proud of.' Prepare one or two in depth using this arc — interviewers will drill into any part:" },
        { type: "list", items: [
          "**Problem & business context** — what were you solving and why did it matter?",
          "**Your role** — what you personally owned versus the team.",
          "**Data & approach** — the data, features, baseline, and why you chose the model you did.",
          "**Key decisions & tradeoffs** — the interesting forks (metric choice, latency vs accuracy, build vs buy) and your reasoning.",
          "**Impact** — measurable results, tied to a business metric.",
          "**Reflection** — what you'd do differently, what you learned. This signals growth.",
        ]},
        { type: "callout", kind: "tip", text: "Rehearse out loud, not just in your head — the gap between 'I know this project' and 'I can narrate it crisply in three minutes' is huge. Prepare the quantified impact numbers in advance; groping for them mid-answer undercuts the whole story." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**STAR** = Situation, Task, Action, Result — a structure for behavioral answers. **Behavioral round** = an interview probing past behavior as a predictor of future performance. **Signal** = the trait an interviewer is trying to detect (ownership, judgment, collaboration). **Deep-dive** = an interviewer drilling into the details of one project." },
      ],
      takeaways: [
        "Behavioral rounds decide many offers; they probe ownership, judgment, collaboration, and communication.",
        "Structure every 'tell me about a time' answer with STAR: Situation, Task, Action, Result — spend most words on your Actions and quantified Result.",
        "Say 'I', not 'we', so your specific contribution is unmistakable.",
        "Prepare one or two project deep-dives with problem, role, approach, tradeoffs, quantified impact, and reflection — and rehearse them out loud.",
      ],
      flashcards: [
        { front: "What does STAR stand for?", back: "Situation (context), Task (your responsibility), Action (what you did — the bulk), Result (quantified outcome + lesson). A structure for behavioral answers." },
        { front: "Two common behavioral-answer mistakes", back: "Over-spending on Situation and rushing Action/Result, and saying 'we' so much your personal contribution is invisible. Fix: mostly Actions/Result, and use 'I'." },
        { front: "What should an ML project deep-dive cover?", back: "Problem & business context, your specific role, data/features/baseline/model choice, key tradeoffs and reasoning, quantified impact, and a reflection on what you'd change." },
      ],
      quiz: [
        { q: "In a STAR answer, the bulk of your time should go to…", options: ["Situation", "Task", "Action (what you did)", "Small talk"], answer: 2, explain: "Actions reveal your judgment and contribution — the Situation should be brief context." },
        { q: "Using 'we' throughout a behavioral answer risks…", options: ["Sounding too technical", "Obscuring your personal contribution", "Being too concise", "Over-quantifying"], answer: 1, explain: "Interviewers need to know what YOU did; default to 'I' for your own actions and decisions." },
        { q: "The strongest project deep-dives end with…", options: ["A list of tools used", "A reflection on tradeoffs and what you'd change", "An apology", "The team size"], answer: 1, explain: "Reflecting on tradeoffs and improvements signals growth and self-awareness — high-value signals." },
      ],
    },
    {
      slug: "failure-and-tradeoffs",
      title: "Handling failure & tradeoff questions",
      summary:
        "'Tell me about a model that failed' is a gift, not a trap. How to answer failure, conflict, and prioritization questions in a way that reads as senior.",
      minutes: 8,
      blocks: [
        { type: "p", text: "Some behavioral questions feel like traps — failures, conflicts, gaps in knowledge. They're actually the highest-signal questions, because how you handle difficulty predicts how you'll handle the job. Lean into them." },
        { type: "h2", text: "The failure question" },
        { type: "p", text: "'Tell me about a time your model (or project) failed.' Never dodge with a humblebrag ('I work too hard'). Interviewers want **ownership** and **learning**. The structure:" },
        { type: "steps", items: [
          { title: "Own it plainly", text: "State the real failure without deflecting onto others. Candor is the signal." },
          { title: "Root cause", text: "Explain what actually went wrong — technically and in process (e.g. 'we shipped without a drift monitor, so we missed the degradation for weeks')." },
          { title: "The fix", text: "What you did to resolve it and, importantly, the systemic change you made so it can't recur (a test, a monitor, a process)." },
          { title: "The lesson", text: "The durable principle you took away." },
        ]},
        { type: "callout", kind: "key", text: "The best failure stories end with a systemic fix, not just 'and then I fixed the bug.' Adding a monitor, a test, or a process change shows you turn incidents into permanent improvements — exactly the maturity senior interviewers screen for. Blameless ownership of a real failure reads as confidence, not weakness." },
        { type: "h2", text: "Tradeoff & prioritization questions" },
        { type: "p", text: "'How do you decide what to work on?' or 'accuracy vs latency — how do you choose?' test judgment under ambiguity. Strong answers share a shape:" },
        { type: "list", items: [
          "**Anchor to the business goal** — tie the decision to the user/business metric, not personal preference.",
          "**Make the tradeoff explicit** — name what you gain and give up ('a heavier model adds 2% accuracy but 50ms latency; for this checkout flow, latency wins').",
          "**Cheapest experiment first** — prefer the fast, reversible test that reduces uncertainty before big investments; baseline before complexity.",
          "**Communicate & align** — surface the tradeoff to stakeholders rather than deciding in a vacuum.",
        ]},
        { type: "h2", text: "'I don't know'" },
        { type: "callout", kind: "tip", text: "When you hit something you don't know, say so honestly, then reason about it out loud or explain how you'd find out. Interviewers respect 'I haven't used that, but based on X I'd expect Y, and I'd verify by Z' far more than a confident bluff — bluffing is a serious red flag in a field that punishes overconfidence." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Ownership** = taking responsibility for outcomes, including failures. **Blameless** = focusing on systems/process, not blaming people. **Root cause** = the underlying reason something failed, beyond the surface symptom. **Systemic fix** = a change (test/monitor/process) that prevents recurrence. **Reversible decision** = one that's cheap to undo, so you can move fast on it." },
      ],
      takeaways: [
        "Failure/conflict questions are high-signal — answer with candid ownership and a clear lesson, never a humblebrag.",
        "Structure failure stories as: own it → root cause → the fix → the lesson, and end with a systemic fix that prevents recurrence.",
        "For tradeoff/prioritization questions: anchor to the business goal, make the tradeoff explicit, run the cheapest experiment first, and align with stakeholders.",
        "When you don't know something, say so and reason out loud or explain how you'd find out — bluffing is a red flag.",
      ],
      flashcards: [
        { front: "How should you structure a 'model that failed' story?", back: "Own it plainly, give the technical + process root cause, describe the fix and the systemic change that prevents recurrence (a monitor/test/process), and state the durable lesson." },
        { front: "The shape of a good tradeoff answer", back: "Anchor to the business metric, make the gain/loss explicit, prefer the cheapest reversible experiment first (baseline before complexity), and communicate/align with stakeholders." },
        { front: "What to do when you don't know an answer", back: "Say so honestly, then reason about it out loud or explain how you'd find out. Bluffing confidently is a serious red flag; honest reasoning is respected." },
      ],
      quiz: [
        { q: "The best failure stories conclude with…", options: ["Blaming a teammate", "A systemic fix that prevents recurrence", "A humblebrag", "Changing the subject"], answer: 1, explain: "Turning an incident into a permanent improvement (monitor/test/process) signals maturity and ownership." },
        { q: "Asked to choose between a more accurate but slower model, a strong answer…", options: ["Always picks accuracy", "Makes the tradeoff explicit and anchors to the business goal", "Refuses to decide", "Picks randomly"], answer: 1, explain: "Name what you gain and give up, and tie the choice to the user/business impact." },
        { q: "When you don't know something in an interview, you should…", options: ["Confidently make something up", "Admit it and reason aloud or explain how you'd find out", "Stay silent", "Change the topic"], answer: 1, explain: "Honest reasoning is respected; bluffing is a red flag, especially in ML where overconfidence is dangerous." },
      ],
    },
    {
      slug: "roles-and-questions-to-ask",
      title: "AI roles & questions to ask them",
      summary:
        "The same core, weighted differently — how research, applied ML, ML engineering, and GenAI roles differ, what each screens for, and the questions that make you look sharp.",
      minutes: 8,
      blocks: [
        { type: "p", text: "'AI role' spans very different jobs. Knowing which one you're interviewing for lets you emphasize the right strengths — and asking about it signals you understand the landscape." },
        { type: "h2", text: "The main role types" },
        { type: "compare", caption: "The same fundamentals, different emphasis.", columns: ["Role", "Focus", "Interview weights"], rows: [
          { label: "ML / Research Scientist", cells: ["Novel methods, papers", "Math depth, algorithms, research; sometimes coding"] },
          { label: "Applied Scientist / ML", cells: ["Apply ML to product problems", "ML breadth, modeling judgment, some system design"] },
          { label: "ML Engineer", cells: ["Build & run ML systems in production", "Coding, system design, MLOps; less math derivation"] },
          { label: "Data Scientist", cells: ["Analysis, experimentation, insight", "Statistics, A/B testing, SQL, communication"] },
          { label: "GenAI / LLM Engineer", cells: ["Build LLM-powered products", "Prompting, RAG, agents, evaluation, system design"] },
        ]},
        { type: "callout", kind: "key", text: "The core knowledge in this course is shared across all of them — what shifts is the weighting. A research role leans on the DL and math; an ML-engineer role on system design and MLOps; a GenAI role on the LLM module. Read the job description and mirror its emphasis in your prep and your examples." },
        { type: "h2", text: "The typical loop" },
        { type: "p", text: "Most AI interview loops mix: a **coding** screen (often Python/data manipulation, sometimes LeetCode-style), an **ML fundamentals/theory** round, an **ML system design** round (senior/engineer), a **project deep-dive**, and a **behavioral** round. Some add a take-home or a research presentation. Ask the recruiter what to expect — it's normal and it lets you prepare precisely." },
        { type: "h2", text: "Questions to ask them" },
        { type: "p", text: "The 'do you have questions for us?' close is graded. Thoughtful questions show engagement and let you evaluate the team. Strong ones for AI roles:" },
        { type: "list", items: [
          "**Data & problem maturity** — 'How mature is the data/ML infrastructure? Are there feature stores, pipelines, monitoring?'",
          "**Model lifecycle** — 'How do models get to production today, and how do you monitor and retrain them?'",
          "**Impact & metrics** — 'How is success measured for this role and its models?'",
          "**Team & collaboration** — 'How do researchers/ML engineers and product work together?'",
          "**Direction** — 'What are the biggest ML challenges the team is facing this year?'",
        ]},
        { type: "callout", kind: "tip", text: "Avoid purely self-serving questions (comp, vacation) in the technical rounds — save those for the recruiter. And never say 'no, I'm good' — it reads as disengaged. Have three questions ready that you'd genuinely want answered." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Interview loop** = the full sequence of rounds. **Take-home** = an at-home assignment. **Coding screen** = a live programming round. **System design round** = designing an ML system end-to-end. **Job description (JD)** = the posting whose emphasis you should mirror. **Recruiter screen** = the initial call that sets logistics and expectations." },
      ],
      takeaways: [
        "AI roles (research, applied, ML engineer, data scientist, GenAI) share the same core but weight it differently — mirror the JD's emphasis.",
        "Typical loops mix coding, ML fundamentals, system design, a project deep-dive, and behavioral; ask the recruiter what to expect.",
        "The 'questions for us?' close is graded — ask about data/ML maturity, the model lifecycle, how success is measured, and team collaboration.",
        "Keep questions non-self-serving in technical rounds, and never answer 'no questions.'",
      ],
      flashcards: [
        { front: "How does an ML Engineer interview differ from a Research Scientist one?", back: "ML Engineer weights coding, system design, and MLOps (production systems) with less math derivation; Research Scientist weights math depth, algorithms, and research contributions. Same core, different emphasis." },
        { front: "What makes a strong 'questions for us?' close?", back: "Thoughtful, non-self-serving questions about data/ML maturity, how models reach and stay healthy in production, how success is measured, and team collaboration — showing engagement and judgment." },
        { front: "How should you tailor prep to a specific AI role?", back: "Read the job description and mirror its emphasis — DL/math for research, system design/MLOps for ML engineering, the LLM stack for GenAI — and pick project examples that match." },
      ],
      quiz: [
        { q: "Compared to a research role, an ML-engineer interview emphasizes…", options: ["Proving theorems", "Coding, system design, and MLOps", "Publishing papers", "Pure statistics"], answer: 1, explain: "ML engineering centers on building and operating production systems, so coding, design, and MLOps dominate." },
        { q: "In a technical round, which question is best to avoid?", options: ["How do you monitor models in production?", "What's the vacation policy?", "How is success measured for this role?", "How mature is the ML infrastructure?"], answer: 1, explain: "Save compensation/vacation for the recruiter; technical-round questions should show engagement with the work." },
        { q: "Answering 'no, I don't have any questions' tends to…", options: ["Signal confidence", "Read as disengaged", "Save time positively", "Impress the panel"], answer: 1, explain: "The close is graded; have a few genuine questions ready to show interest and judgment." },
      ],
    },
  ],
};
