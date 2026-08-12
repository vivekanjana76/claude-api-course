import type { Module } from "./types";

export const finetuning: Module = {
  id: "finetuning",
  title: "Adaptation: fine-tuning & alignment",
  blurb:
    "When changing the weights is actually the answer — SFT and LoRA, preference optimisation from RLHF to DPO and GRPO, and distilling a frontier model into something you can afford to run.",
  accent: "rose",
  lessons: [
    {
      slug: "when-to-finetune",
      title: "The adaptation ladder",
      summary:
        "Prompt, retrieve, fine-tune, pretrain — the order to try them in, the signals that you've hit the ceiling of one rung, and the ongoing cost of descending.",
      minutes: 10,
      blocks: [
        { type: "p", text: "There are four ways to make a model do what you want, and they differ by roughly an order of magnitude each in effort, cost, and commitment. **Descend the ladder only when you can show the rung above genuinely can't get there** — this is the discipline that separates teams who ship from teams who spend a quarter on a fine-tune they didn't need." },
        { type: "diagram", name: "adaptation-ladder", caption: "Effort, cost, and lock-in all rise as you descend. So does the number of teams that stopped too late." },
        { type: "compare", caption: "The four rungs.", columns: ["Rung", "Changes", "Effort", "Fixes"], rows: [
          { label: "Prompting & context", cells: ["The input", "Minutes to days", "Instruction-following, format, reasoning approach"] },
          { label: "Retrieval (RAG)", cells: ["The input, from your data", "Days to weeks", "Missing, private, or changing knowledge"] },
          { label: "Fine-tuning", cells: ["The weights, a little", "Weeks", "Consistent behaviour, tone, format, narrow-task accuracy, latency/cost via smaller models"] },
          { label: "Continued pretraining", cells: ["The weights, a lot", "Months + serious compute", "A genuinely novel domain or language the base model barely represents"] },
        ]},
        { type: "h2", text: "What fine-tuning is genuinely good at" },
        { type: "list", items: [
          "**Format and structure adherence** — outputs that must match a strict shape thousands of times a day, where prompting gets you to 97% and you need 99.9%.",
          "**Tone and voice** — a brand register or a domain style that would take 2,000 tokens to describe on every call, encoded into the weights instead.",
          "**Narrow task accuracy** — classification or extraction in a specialised domain where the base model keeps making the same subtle mistake.",
          "**Cost and latency** — the big one in practice: fine-tune a small model on your task and it can match a frontier model at a fraction of the cost per call and a fraction of the latency.",
          "**Dropping the prompt** — a fine-tuned model may need a 50-token prompt where the base needed 2,000. At scale that's a substantial saving on its own.",
        ]},
        { type: "callout", kind: "key", text: "**Fine-tuning teaches behaviour, not facts.** Knowledge baked into weights is recalled unreliably, can't be cited, goes stale, and can't respect per-user permissions. If the failure is *the model doesn't know*, the answer is retrieval. If the failure is *the model knows but responds wrong*, fine-tuning is on the table." },
        { type: "h2", text: "Signals you've actually hit the prompting ceiling" },
        { type: "compare", caption: "Be honest about which side you're on.", columns: ["Real signal", "Not a signal"], rows: [
          { label: "Several prompt iterations, scored on an eval set, plateau below your bar", cells: ["The first prompt didn't work"] },
          { label: "The prompt is enormous and still inconsistent on the same slice", cells: ["The prompt feels inelegant"] },
          { label: "You have 1,000+ high-quality examples of correct behaviour", cells: ["You have a folder of documents"] },
          { label: "A cheaper model would pay for the project if it matched quality", cells: ["Fine-tuning sounds more advanced"] },
          { label: "The failure is stylistic or structural, and reproducible", cells: ["The failures are factual"] },
        ]},
        { type: "h2", text: "The cost nobody quotes" },
        { type: "p", text: "The training run is often the cheapest part. The ongoing bill is what surprises people:" },
        { type: "list", items: [
          "**Dataset creation and curation** — usually the dominant cost, and it's human time. 1,000 genuinely good examples is a real project.",
          "**Evaluation** — you need it *before* fine-tuning to prove there's a gap, and after to prove you closed it without breaking something else.",
          "**Re-doing it** — when the base model is deprecated or a better one ships, your fine-tune doesn't come along. Every base-model change is a repeat of the whole exercise.",
          "**Serving** — a self-hosted fine-tune means GPUs, autoscaling, and an on-call rotation you didn't have with an API.",
          "**Regression risk** — narrow fine-tuning degrades general capability. The model gets better at your task and worse at everything adjacent to it.",
        ]},
        { type: "callout", kind: "warn", text: "**Catastrophic forgetting** is real and routinely surprises teams: fine-tune hard on one narrow task and the model loses instruction-following, reasoning, or multilingual ability it had before. Always evaluate on general capability alongside your task, or you'll ship a model that aces your benchmark and fails the request next to it." },
        { type: "h2", text: "The decision, as a sequence" },
        { type: "steps", items: [
          { title: "Build the eval set first", text: "Without it you can't prove a gap exists or that fine-tuning closed it. This step is non-negotiable and is where most of the value is." },
          { title: "Exhaust prompting", text: "Better instructions, an output contract, well-chosen few-shot examples, task decomposition, a stronger model. Cheap, reversible, fast." },
          { title: "Add retrieval if failures are knowledge-shaped", text: "Most 'the model is wrong' complaints are missing-context complaints." },
          { title: "Quantify the remaining gap", text: "\"We're at 91% and need 97%, and the failures are all formatting on the German slice.\" That's a fine-tuning brief. \"It feels off\" isn't." },
          { title: "Fine-tune the smallest model that could work", text: "The cost win comes from moving *down* a tier, not from fine-tuning the model you already use." },
          { title: "Evaluate on your task and on general ability", text: "Then keep the base model behind a flag so you can revert in one config change." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Fine-tuning** = further training a pretrained model on your examples. **SFT** (Supervised Fine-Tuning) = training on input/output pairs. **Continued / domain-adaptive pretraining** = more unsupervised training on domain text. **Catastrophic forgetting** = losing general capability while specialising. **Base vs instruct model** = the raw next-token model vs one already tuned to follow instructions. **Checkpoint** = a saved set of weights. **Adapter** = a small set of extra weights layered on a frozen base (see LoRA, next lesson)." },
      ],
      takeaways: [
        "The ladder is prompt → retrieve → fine-tune → pretrain, each roughly 10× the effort and lock-in of the one above.",
        "Fine-tuning fixes behaviour, format, tone, narrow-task accuracy, and cost/latency — not missing knowledge.",
        "Real signals are a scored plateau, a huge inconsistent prompt, 1,000+ good examples, and a cost case for a smaller model.",
        "The training run is the cheap part; dataset curation, evaluation, re-doing it on every base-model change, and serving are the real bill.",
        "Catastrophic forgetting is common — always evaluate general capability alongside your task and keep a revert path.",
      ],
      flashcards: [
        { front: "What does fine-tuning fix, and what does it not?", back: "It fixes behaviour: format, tone, structure, narrow-task accuracy, and lets a smaller model match a bigger one. It does not reliably teach facts — those belong in retrieval." },
        { front: "What's the biggest practical reason to fine-tune?", back: "Cost and latency. A fine-tuned small model can match a frontier model on your specific task at a fraction of the price per call and much lower latency." },
        { front: "What is catastrophic forgetting?", back: "Losing general capability — instruction-following, reasoning, other languages — while specialising on a narrow task. Evaluate general ability alongside task metrics to catch it." },
        { front: "What must exist before you start fine-tuning?", back: "An eval set. Without it you can't demonstrate the gap exists, can't prove you closed it, and can't detect what you broke." },
        { front: "Why does every base-model upgrade re-open the fine-tuning bill?", back: "A fine-tune is tied to a specific base checkpoint. When that model is deprecated or superseded, the dataset, training, and evaluation all have to be repeated." },
      ],
      quiz: [
        { q: "Your model's answers are stylistically perfect but factually out of date. What's the fix?", options: ["Fine-tune on recent documents", "Add retrieval over current sources", "Continued pretraining", "More few-shot examples"], answer: 1, explain: "The failure is knowledge-shaped, which fine-tuning handles poorly — facts in weights go stale, can't be cited, and can't be permissioned. This is retrieval's job." },
        { q: "You want to cut inference cost 10× on a high-volume classification endpoint. Best approach?", options: ["Fine-tune the frontier model you already use", "Fine-tune a small model on your task and route to it", "Shorten the prompt", "Lower the temperature"], answer: 1, explain: "The saving comes from moving down a model tier. Fine-tuning the model you're already paying for doesn't change the per-token price." },
        { q: "After fine-tuning, your task metric rises but users report the assistant is worse at unrelated questions. What happened?", options: ["The eval set is wrong", "Catastrophic forgetting from narrow specialisation", "Temperature drift", "The base model changed"], answer: 1, explain: "Narrow fine-tuning erodes general capability. Mix in general instruction data, use a lower learning rate or fewer epochs, and always evaluate general ability as a guardrail metric." },
      ],
    },
    {
      slug: "sft-and-lora",
      title: "SFT, LoRA & QLoRA",
      summary:
        "How supervised fine-tuning actually works, why almost nobody updates all the weights any more, and how to build a dataset that produces a model worth serving.",
      minutes: 12,
      blocks: [
        { type: "p", text: "**Supervised fine-tuning (SFT)** is the workhorse: show the model input/output pairs demonstrating the behaviour you want, and adjust the weights so those outputs become more likely. Everything else in this module is a variation on that idea." },
        { type: "h2", text: "Full fine-tuning vs parameter-efficient" },
        { type: "p", text: "Updating every weight in a 70B model needs enough GPU memory for the weights, their gradients, and the optimiser state — comfortably hundreds of gigabytes. **Parameter-efficient fine-tuning (PEFT)** freezes the base model and trains a small number of new parameters instead, which is why fine-tuning went from a data-centre project to something you can run on one GPU." },
        { type: "diagram", name: "lora", caption: "LoRA: the base weights stay frozen; two small matrices learn the difference." },
        { type: "compare", caption: "The methods you'll actually meet.", columns: ["Method", "What it trains", "Memory", "Notes"], rows: [
          { label: "Full fine-tuning", cells: ["Every parameter", "Very high", "Best possible fit; rarely necessary; hardest to serve"] },
          { label: "LoRA", cells: ["Two low-rank matrices per target layer", "~1–3% of full", "The default. Adapters are tens of MB and swappable"] },
          { label: "QLoRA", cells: ["LoRA on a 4-bit quantized base", "Lowest", "Fine-tune a large model on a single GPU, minimal quality loss"] },
          { label: "Prefix / prompt tuning", cells: ["A learned soft prompt", "Tiny", "Weaker; largely superseded by LoRA"] },
        ]},
        { type: "h2", text: "How LoRA works, in one paragraph" },
        { type: "p", text: "The insight is that the *change* a fine-tune makes to a weight matrix is **low rank** — it can be approximated by multiplying two much smaller matrices. So instead of learning a full update to a 4096×4096 matrix (16.7M numbers), you learn matrices of shape 4096×8 and 8×4096 (65K numbers, at rank 8). At inference the product is added to the frozen base weight. You train ~0.5% of the parameters and get most of the benefit." },
        { type: "code", lang: "python", caption: "A LoRA fine-tune, end to end", code: `from peft import LoraConfig, get_peft_model
from trl import SFTTrainer, SFTConfig

peft_config = LoraConfig(
    r=16,                      # rank — 8-32 typical; higher = more capacity
    lora_alpha=32,             # scaling; a common convention is alpha = 2*r
    lora_dropout=0.05,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],  # attention
    task_type="CAUSAL_LM",
)

trainer = SFTTrainer(
    model=base_model,                    # load in 4-bit for QLoRA
    peft_config=peft_config,
    train_dataset=train,                 # 'messages' format
    eval_dataset=validation,             # held out — watch it every epoch
    args=SFTConfig(
        num_train_epochs=2,              # 1-3; more overfits fast on small sets
        learning_rate=1e-4,              # LoRA tolerates ~10x higher than full FT
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,   # effective batch 16
        warmup_ratio=0.03,
        lr_scheduler_type="cosine",
        bf16=True,
        eval_strategy="epoch",
        load_best_model_at_end=True,     # keep the checkpoint that generalised
    ),
)
trainer.train()
trainer.model.save_pretrained("./adapter")   # tens of MB, not tens of GB`},
        { type: "callout", kind: "tip", text: "**LoRA adapters are small and swappable.** One base model in GPU memory can serve many adapters — per-customer, per-task, per-tenant — with the adapter selected per request. This is how a fine-tuned-model product scales without a GPU fleet per variant." },
        { type: "h2", text: "The dataset is the project" },
        { type: "p", text: "Model quality tracks data quality far more than it tracks hyperparameters. A thousand carefully curated examples beat fifty thousand scraped ones, reliably and repeatedly." },
        { type: "compare", caption: "What good looks like.", columns: ["Property", "Why it matters"], rows: [
          { label: "Correct", cells: ["The model learns your errors faithfully, including the ones you didn't notice"] },
          { label: "Consistent", cells: ["Contradictory examples teach the model to be inconsistent — this is the most common dataset defect"] },
          { label: "Representative", cells: ["Match the real distribution of inputs, including the awkward ones"] },
          { label: "Diverse", cells: ["Near-duplicates waste capacity and inflate your apparent dataset size"] },
          { label: "In the serving format", cells: ["Train exactly as you'll call it — same system prompt, same structure"] },
          { label: "Held out honestly", cells: ["A validation set that shares no source documents with training, or your metrics lie"] },
        ]},
        { type: "list", items: [
          "**How many?** 50–100 to see if the idea has legs; 500–1,000 for a decent narrow task; 5,000+ for broad behaviour change. More matters less than better past a point.",
          "**Where from?** Production traces with corrected outputs are the gold standard — they're already in-distribution. Human-written examples are next. Purely synthetic data is a starting point, not a finish line.",
          "**Deduplicate aggressively** — near-duplicates cause memorisation and make your eval optimistic.",
          "**Decontaminate** — if evaluation examples leak into training, your numbers are fiction.",
        ]},
        { type: "h2", text: "Hyperparameters that matter, in order" },
        { type: "compare", caption: "Change these; ignore the rest until they're right.", columns: ["Parameter", "Typical", "Symptom if wrong"], rows: [
          { label: "Epochs", cells: ["1–3", "Too many → memorises training data, validation loss climbs"] },
          { label: "Learning rate", cells: ["1e-4 to 2e-4 for LoRA", "Too high → gibberish or forgetting; too low → nothing changes"] },
          { label: "LoRA rank r", cells: ["8–32", "Too low → underfits complex behaviour; too high → overfits, larger adapter"] },
          { label: "Target modules", cells: ["Attention projections; add MLP for bigger changes", "Too few → limited capacity to change behaviour"] },
          { label: "Batch size", cells: ["Effective 8–32 via accumulation", "Too small → noisy, unstable training"] },
        ]},
        { type: "callout", kind: "warn", text: "**Watch validation loss every epoch.** Training loss falling while validation loss rises is textbook overfitting, and with a small dataset it can happen within a single epoch. Enable best-checkpoint selection rather than assuming the last checkpoint is the one you want." },
        { type: "h2", text: "Evaluating a fine-tune" },
        { type: "list", ordered: true, items: [
          "**Your task metric** on a held-out set — the reason you did this.",
          "**General capability** on a standard instruction-following set — the guardrail against forgetting.",
          "**Format compliance rate** — often the whole point; measure it directly.",
          "**Head-to-head against the baseline** you were using, on the same inputs, blind if a human is judging.",
          "**Cost and latency in the serving configuration** you'll actually deploy, not in a notebook.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**SFT** = supervised fine-tuning on input/output pairs. **PEFT** = parameter-efficient fine-tuning. **LoRA** = Low-Rank Adaptation: training two small matrices per layer instead of the full weight. **Rank (r)** = the inner dimension of those matrices; capacity. **QLoRA** = LoRA over a 4-bit quantized base. **Adapter** = the trained LoRA weights, servable on top of a frozen base. **Epoch** = one pass over the dataset. **Overfitting** = fitting training data at the expense of generalisation. **Decontamination** = ensuring eval examples aren't in training data." },
      ],
      takeaways: [
        "SFT trains on input/output pairs; LoRA is the default because it trains ~1% of parameters and produces small, swappable adapters.",
        "QLoRA puts LoRA over a 4-bit base so large models fine-tune on a single GPU.",
        "Dataset quality dominates: 1,000 correct, consistent, diverse, in-format examples beat 50,000 scraped ones.",
        "Epochs, learning rate, and LoRA rank are the parameters worth tuning; watch validation loss and keep the best checkpoint.",
        "Evaluate task metric, general capability, format compliance, a blind head-to-head, and real serving cost and latency.",
      ],
      flashcards: [
        { front: "What does LoRA actually train?", back: "Two low-rank matrices per targeted layer whose product approximates the weight update. The base weights stay frozen, so you train roughly 0.5–1% of the parameters." },
        { front: "What's the difference between LoRA and QLoRA?", back: "QLoRA runs the same LoRA training over a base model quantized to 4-bit, cutting memory enough to fine-tune large models on a single GPU with minimal quality loss." },
        { front: "How many examples do you need for a narrow-task fine-tune?", back: "500–1,000 good ones is a solid target; 50–100 tells you whether the idea has legs. Quality, consistency, and diversity matter more than volume past that point." },
        { front: "What's the most common dataset defect?", back: "Inconsistency — examples that contradict each other. The model faithfully learns to be inconsistent, and no hyperparameter fixes it." },
        { front: "Why are LoRA adapters operationally attractive?", back: "They're tens of megabytes and swappable, so one base model in GPU memory can serve many adapters — per tenant, per task — selected per request." },
      ],
      quiz: [
        { q: "Training loss keeps falling but validation loss rises after epoch 1. What do you do?", options: ["Train longer", "Stop early and keep the best checkpoint; consider more data or a lower rank", "Increase the learning rate", "Increase LoRA rank"], answer: 1, explain: "That's overfitting. Early stopping with best-checkpoint selection is the immediate fix; more or more diverse data is the durable one." },
        { q: "You need per-customer behaviour for 40 customers. Cheapest serving design?", options: ["40 fully fine-tuned models", "One base model with 40 swappable LoRA adapters", "40 separate prompts only", "Continued pretraining per customer"], answer: 1, explain: "Adapters are small and load on top of a shared frozen base, so one GPU-resident model serves all 40 with the adapter chosen per request." },
        { q: "Which has the biggest effect on fine-tune quality?", options: ["Learning-rate schedule", "Dataset quality and consistency", "LoRA alpha", "Batch size"], answer: 1, explain: "Hyperparameters matter at the margins; data quality dominates. Contradictory or unrepresentative examples cannot be rescued by tuning." },
      ],
    },
    {
      slug: "preference-optimization",
      title: "Preference optimisation: RLHF, DPO & GRPO",
      summary:
        "How models learn from comparisons rather than demonstrations — the alignment pipeline, why DPO replaced most RLHF, and what GRPO changed for reasoning.",
      minutes: 11,
      blocks: [
        { type: "p", text: "SFT teaches a model to imitate examples. But for open-ended output — is this summary *good*? is this reply *helpful*? — there's no single correct answer to imitate, and it's far easier for a human to say **\"A is better than B\"** than to write the ideal answer themselves. That observation is the whole foundation of preference optimisation." },
        { type: "diagram", name: "alignment-pipeline", caption: "Pretrain → SFT → preference optimisation. Each stage answers a different question." },
        { type: "compare", caption: "The three training stages of a modern assistant.", columns: ["Stage", "Data", "Teaches"], rows: [
          { label: "Pretraining", cells: ["Trillions of tokens of text", "Language, world knowledge, reasoning substrate"] },
          { label: "SFT / instruction tuning", cells: ["Demonstrations of good answers", "How to follow instructions and use the chat format"] },
          { label: "Preference optimisation", cells: ["Comparisons between candidate answers", "Which of two plausible answers people actually prefer"] },
        ]},
        { type: "h2", text: "RLHF — the original recipe" },
        { type: "steps", items: [
          { title: "Collect comparisons", text: "Sample several responses per prompt; humans rank them." },
          { title: "Train a reward model", text: "A model that scores a response, trained to agree with those rankings." },
          { title: "Optimise the policy with RL", text: "Usually PPO: generate, score with the reward model, update the policy to increase reward, with a KL penalty keeping it near the SFT model." },
        ]},
        { type: "callout", kind: "warn", text: "RLHF works and is genuinely painful: three models in memory at once, notoriously finicky hyperparameters, and **reward hacking** — the policy discovers that longer, more confident, more sycophantic answers score well and optimises for the scorer rather than the goal. The KL penalty exists to limit exactly this drift." },
        { type: "h2", text: "DPO — the simplification that took over" },
        { type: "p", text: "**Direct Preference Optimization** removes the reward model and the RL loop entirely. The key insight is that the optimal RLHF policy has a closed-form relationship to the preference data, so you can optimise the policy *directly* on pairs of (chosen, rejected) responses with a simple classification-style loss." },
        { type: "compare", caption: "Why teams switched.", columns: ["", "RLHF (PPO)", "DPO"], rows: [
          { label: "Models in play", cells: ["Policy, reward model, reference, (value head)", "Policy and a frozen reference"] },
          { label: "Stability", cells: ["Sensitive; needs careful tuning", "Much more stable"] },
          { label: "Compute", cells: ["High", "Comparable to SFT"] },
          { label: "Implementation", cells: ["Substantial RL machinery", "A loss function over pairs"] },
          { label: "Ceiling", cells: ["Slightly higher with expert tuning and online sampling", "Very close, for far less effort"] },
        ]},
        { type: "code", lang: "python", caption: "DPO in practice — the data shape is the whole story", code: `# One row per comparison. This is what makes DPO approachable:
# no reward model, no rollouts, just pairs.
example = {
    "prompt":   "Summarise this incident report for an exec audience.",
    "chosen":   "Payments were degraded for 42 minutes...",   # preferred
    "rejected": "The incident was caused by a misconfigured...",  # dispreferred
}

from trl import DPOTrainer, DPOConfig
trainer = DPOTrainer(
    model=sft_model,               # start from your SFT checkpoint, not base
    ref_model=None,                # TRL uses the frozen initial model
    train_dataset=pairs,
    args=DPOConfig(
        beta=0.1,                  # how tightly to stay near the reference
        learning_rate=5e-7,        # much lower than SFT — this is a nudge
        num_train_epochs=1,
    ),
)
trainer.train()`},
        { type: "callout", kind: "tip", text: "DPO's learning rate is 100–1000× lower than SFT's for a reason: you are nudging an already-good model toward preferences, not teaching it a task. Too high and you get a model that is confidently, fluently degraded — and the damage doesn't show up in training loss." },
        { type: "h2", text: "GRPO and verifiable rewards" },
        { type: "p", text: "**Group Relative Policy Optimization (GRPO)** is the technique behind the recent leap in reasoning models. Instead of a learned reward model, it samples a *group* of answers to the same prompt and scores each **relative to the group average** — which removes the need for a separate value network. Crucially it pairs naturally with **verifiable rewards**: for maths, code, or anything with a checkable answer, the reward is simply *did it pass?*" },
        { type: "callout", kind: "key", text: "The significance: **when rewards are verifiable, you can scale reinforcement learning without humans in the loop.** Run the unit tests. Check the proof. Compare to the known answer. That's what made large-scale reasoning training practical — and it's why it works so much better for maths and code than for essay quality, where no verifier exists." },
        { type: "compare", caption: "Which method fits which signal.", columns: ["Method", "Reward signal", "Best for"], rows: [
          { label: "SFT", cells: ["Demonstrations", "Teaching a task or format from examples"] },
          { label: "DPO", cells: ["Human preference pairs", "Style, helpfulness, tone, subjective quality"] },
          { label: "RLHF/PPO", cells: ["Learned reward model", "Large-scale alignment with expert tuning"] },
          { label: "GRPO + verifiable rewards", cells: ["Automatic correctness checks", "Maths, code, structured reasoning"] },
          { label: "RLAIF / Constitutional AI", cells: ["Model-generated preferences against written principles", "Scaling preference data past human throughput"] },
        ]},
        { type: "h2", text: "What this means for an AI Engineer" },
        { type: "p", text: "You will rarely run RLHF yourself. You will constantly deal with its consequences, and being able to name them is what these questions are testing." },
        { type: "list", items: [
          "**Sycophancy** — preference training rewards agreement, so models tend to accept a user's incorrect premise. Design around it: ask for the reasoning before the verdict, and don't lead the witness.",
          "**Verbosity bias** — human raters and LLM judges both prefer longer answers, so models are trained toward them. This is why your judge needs an explicit conciseness criterion.",
          "**Refusal calibration** — alignment training produces both over-refusal on benign requests and inconsistent boundaries. Evaluate refusal behaviour explicitly on your own domain.",
          "**Behaviour changes between versions** — a new checkpoint's post-training can shift tone and format enough to break prompts tuned to the old one. Always re-run evals on a model upgrade.",
          "**DPO is within reach** — if you have preference data from thumbs-up/down or human review, a light DPO pass on top of SFT is a realistic team-scale project.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**RLHF** = Reinforcement Learning from Human Feedback. **Reward model** = a model trained to score responses as humans would. **PPO** = the RL algorithm classically used for the policy update. **KL penalty** = a term keeping the tuned model near its starting point. **DPO** = Direct Preference Optimization, optimising on preference pairs without a reward model. **GRPO** = Group Relative Policy Optimization, scoring samples against their group average. **Verifiable reward** = a reward computed by checking correctness automatically. **RLAIF** = using an AI model to generate the preference labels. **Constitutional AI** = alignment guided by an explicit written set of principles. **Reward hacking** = optimising the measured proxy rather than the intent. **Sycophancy** = agreeing with the user at the expense of accuracy." },
      ],
      takeaways: [
        "Preference optimisation learns from comparisons because open-ended quality has no single correct answer to imitate.",
        "RLHF works but is complex and prone to reward hacking; DPO removes the reward model and RL loop for nearly the same result.",
        "GRPO scores samples against their group average and pairs with verifiable rewards — the basis of modern reasoning training.",
        "Verifiable rewards (tests pass, answer matches) let RL scale without humans, which is why maths and code advanced fastest.",
        "The practical fallout for engineers: sycophancy, verbosity bias, refusal calibration, and behaviour shifts between model versions.",
      ],
      flashcards: [
        { front: "Why use preferences instead of demonstrations?", back: "For open-ended output there's no single correct answer to imitate, and humans can judge 'A is better than B' far more cheaply and consistently than they can write the ideal answer." },
        { front: "What does DPO remove from RLHF?", back: "The separately-trained reward model and the RL optimisation loop. It optimises the policy directly on (chosen, rejected) pairs with a simple loss — far more stable and much cheaper." },
        { front: "What is a verifiable reward, and why did it matter?", back: "A reward computed by automatic correctness checking — unit tests pass, the answer matches. It removed humans from the RL loop, which is what made large-scale reasoning training practical." },
        { front: "What is reward hacking?", back: "The policy optimising the measured proxy rather than the intent — e.g. learning that longer, more confident, more agreeable answers score higher with the reward model." },
        { front: "Why is a model sycophantic?", back: "Preference training rewards responses raters liked, and raters like agreement. The model learns to accept the user's premise — so don't lead the witness, and ask for reasoning before the verdict." },
      ],
      quiz: [
        { q: "You have 5,000 thumbs-up/thumbs-down pairs from production. Most practical way to use them?", options: ["Full RLHF with PPO", "DPO on top of your SFT checkpoint", "Continued pretraining", "Discard them — only expert labels count"], answer: 1, explain: "DPO consumes exactly this data shape without a reward model or RL machinery, at roughly SFT cost and with far better stability." },
        { q: "Why did verifiable rewards accelerate reasoning models specifically?", options: ["They're cheaper to compute", "Correctness can be checked automatically, so RL scales without human labelling", "They avoid overfitting", "They need less GPU memory"], answer: 1, explain: "Maths and code have automatic verifiers, so you can generate reward signal at massive scale. Domains without verifiers — essay quality, tone — didn't benefit the same way." },
        { q: "Your assistant agrees with a user's factually wrong premise. What's the root cause?", options: ["Temperature too high", "Sycophancy from preference training", "Missing retrieval", "Too few tokens"], answer: 1, explain: "Preference training rewards agreement because raters reward it. Mitigate in your prompt design — ask for evidence and reasoning before a verdict — and test for it explicitly." },
      ],
    },
    {
      slug: "distillation-and-synthetic-data",
      title: "Distillation & synthetic data",
      summary:
        "Teaching a small model to do a big model's job, generating training data at scale, and the failure modes that make synthetic data quietly poisonous.",
      minutes: 10,
      blocks: [
        { type: "p", text: "**Distillation** is the most commercially important fine-tuning pattern in production AI: use a large, expensive, accurate model to produce training data, then train a small, cheap, fast model to reproduce its behaviour on *your* task. The small model doesn't become generally as capable — it becomes as capable **where you measured it**, which is usually all you need." },
        { type: "diagram", name: "distillation", caption: "The teacher answers; the student learns to match it on your traffic distribution." },
        { type: "h2", text: "The distillation loop" },
        { type: "steps", items: [
          { title: "Collect real inputs", text: "From production traffic if you have it. The distribution matters more than the volume — a student trained on unrepresentative inputs fails exactly where it counts." },
          { title: "Generate teacher outputs", text: "Run the strong model with your best prompt, including reasoning if the task benefits. Batch APIs make this dramatically cheaper." },
          { title: "Filter hard", text: "Verify what you can verify, drop what you can't, and remove anything you wouldn't be happy to serve. Unfiltered teacher output is the single biggest cause of disappointing students." },
          { title: "Fine-tune the small model", text: "LoRA on an open-weight model, or a hosted fine-tuning API." },
          { title: "Evaluate head-to-head", text: "Student vs teacher on held-out real inputs. Expect to match on the common cases and lose on the tail." },
          { title: "Route with a fallback", text: "Student by default, escalate to the teacher on low confidence, failed validation, or a request class you know it handles badly." },
        ]},
        { type: "callout", kind: "key", text: "**Distillation buys you the frontier model's judgment at the small model's price, on a narrow slice.** A 10–50× cost reduction with near-equal quality on your specific task is a routine result — and it's why 'we use a small model in production' rarely means 'we use a weak model'." },
        { type: "callout", kind: "warn", text: "**Check the terms of service.** Many providers prohibit using their model's outputs to train a competing model. Distilling for your own internal task is typically fine; building a general-purpose model from another vendor's outputs usually is not. This is a legal question, not a technical one — ask before you spend the compute." },
        { type: "h2", text: "Synthetic data beyond distillation" },
        { type: "compare", caption: "Where generated data genuinely helps.", columns: ["Use", "Why it works"], rows: [
          { label: "Cold start", cells: ["No production traffic yet — generate plausible inputs to bootstrap the first version"] },
          { label: "Rare cases", cells: ["Deliberately manufacture the edge cases real traffic gives you three of"] },
          { label: "Augmentation", cells: ["Paraphrase real inputs to teach robustness to phrasing"] },
          { label: "Privacy", cells: ["Train on synthetic records when real ones can't leave a boundary"] },
          { label: "Eval sets", cells: ["Generate candidate cases cheaply, then have humans verify — generation is the cheap half"] },
        ]},
        { type: "h2", text: "How synthetic data goes wrong" },
        { type: "compare", caption: "The four failure modes.", columns: ["Failure", "What happens", "Mitigation"], rows: [
          { label: "Distribution mismatch", cells: ["Generated inputs are cleaner, shorter, and better-formed than real ones", "Seed from real inputs; compare length, vocabulary, and error-rate distributions"] },
          { label: "Mode collapse", cells: ["Thousands of examples that are the same three examples reworded", "Vary the seeds and personas; deduplicate by embedding similarity"] },
          { label: "Error amplification", cells: ["The teacher's mistakes become the student's confident rules", "Filter and verify; sample and review by hand"] },
          { label: "Model collapse", cells: ["Training repeatedly on model-generated data degrades diversity over generations", "Always anchor to real data; don't recycle synthetic output as input"] },
        ]},
        { type: "callout", kind: "tip", text: "The cheapest quality control in the whole pipeline: **read 50 randomly sampled examples yourself.** Not the first 50 — random. Teams routinely discover a systematic defect this way in twenty minutes, after weeks of training runs that were never going to work." },
        { type: "h2", text: "Verification beats generation" },
        { type: "p", text: "The strongest synthetic pipelines are built around a **verifier**, not a generator. Generate many candidates and keep only the ones that pass a check: code that compiles and passes tests, SQL that runs and returns the expected shape, extractions that reconcile against the source document, answers that match a known ground truth. Where a verifier exists, synthetic data quality stops being a hope and becomes a measurement." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Distillation** = training a small student model to reproduce a large teacher's behaviour. **Teacher / student** = the source and target models. **Synthetic data** = training data generated by a model rather than collected. **Rejection sampling** = generating many candidates and keeping only those passing a filter. **Model collapse** = degradation from training on model-generated data across generations. **Mode collapse** = generated data lacking diversity. **Distribution shift** = training data not matching real inputs. **Data augmentation** = expanding a dataset with transformed versions of real examples." },
      ],
      takeaways: [
        "Distillation gives a small model the teacher's judgment on your task — routinely 10–50× cheaper at near-equal quality.",
        "The loop is: real inputs → teacher outputs → hard filtering → fine-tune → head-to-head eval → route with fallback.",
        "Check provider terms before distilling; using outputs to train a competing general model is usually prohibited.",
        "Synthetic data helps with cold start, rare cases, augmentation, privacy, and eval-set drafting.",
        "Its failure modes are distribution mismatch, mode collapse, error amplification, and model collapse — and a verifier plus reading 50 random samples catches most of them.",
      ],
      flashcards: [
        { front: "What is model distillation?", back: "Using a large teacher model to generate outputs for real inputs, then fine-tuning a small student model to reproduce them on your task. The student matches the teacher where you measured, not in general." },
        { front: "What's the most important filtering step in distillation?", back: "Verifying and discarding teacher outputs you wouldn't be happy to serve. Unfiltered teacher output — including its mistakes — is the biggest cause of disappointing students." },
        { front: "What is model collapse?", back: "Progressive degradation of diversity and quality when models are trained on model-generated data across generations. Always anchor training data to real examples." },
        { front: "Why is a verifier the centre of a good synthetic pipeline?", back: "It turns quality from a hope into a measurement — generate many candidates, keep only those that compile, run, reconcile, or match ground truth (rejection sampling)." },
        { front: "What's the cheapest quality check on generated data?", back: "Read 50 randomly sampled examples by hand. It surfaces systematic defects in twenty minutes that weeks of training runs would never have revealed." },
      ],
      quiz: [
        { q: "Your distilled student matches the teacher on eval but fails on real traffic. Most likely cause?", options: ["Too few epochs", "Training inputs didn't match the real input distribution", "LoRA rank too low", "Learning rate too high"], answer: 1, explain: "Distillation transfers behaviour on the distribution you trained on. Synthetic or cherry-picked inputs that are cleaner than reality produce exactly this gap — seed from production traffic." },
        { q: "You generate 20,000 synthetic examples from 5 prompt templates. What's the risk?", options: ["Too much data", "Mode collapse — thousands of rewordings of a handful of examples", "Overfitting to the validation set", "Tokenizer mismatch"], answer: 1, explain: "Low seed diversity produces low data diversity regardless of volume. Vary seeds and personas, and deduplicate by embedding similarity to see how much unique signal you really have." },
        { q: "Which synthetic-data pipeline is most trustworthy?", options: ["Generate and use directly", "Generate many candidates and keep only those passing an automatic verifier", "Generate with a bigger model", "Generate with high temperature for diversity"], answer: 1, explain: "Rejection sampling against a verifier — tests pass, SQL runs, values reconcile — converts data quality from an assumption into a measurement." },
      ],
    },
  ],
};
