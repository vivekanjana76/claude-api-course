import type { Module } from "./types";

export const inference: Module = {
  id: "inference",
  title: "Inference & serving",
  blurb:
    "Where latency and money actually go: the prefill/decode split, KV caching and attention tricks, quantization, and choosing a serving stack and the GPUs under it.",
  accent: "amber",
  lessons: [
    {
      slug: "inference-economics",
      title: "Inference economics: TTFT, TPOT & throughput",
      summary:
        "The four numbers that describe every LLM system's performance, why latency and throughput pull against each other, and how to do the arithmetic in an interview.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Almost every performance conversation about an LLM system reduces to four numbers. Learn them precisely — interviewers ask for them by name, and half of production tuning is deciding which one you're optimising at the expense of which other." },
        { type: "diagram", name: "inference-latency", caption: "One request's latency budget. Prefill happens once; decode happens per token." },
        { type: "compare", caption: "The four numbers.", columns: ["Metric", "Means", "Driven by"], rows: [
          { label: "TTFT — time to first token", cells: ["How long before anything appears", "Prompt length, prefill compute, queueing, cache hits"] },
          { label: "TPOT — time per output token", cells: ["How fast text then streams", "Memory bandwidth, batch size, model size"] },
          { label: "Total latency", cells: ["TTFT + (output tokens × TPOT)", "Almost always dominated by output length"] },
          { label: "Throughput", cells: ["Tokens or requests per second across all users", "Batching, GPU utilisation, sequence lengths"] },
        ]},
        { type: "callout", kind: "key", text: "**Output length is the biggest latency lever you control.** A 1,000-token answer at 40ms/token is 40 seconds of decode no matter how fast your prefill is. Before you optimise infrastructure, ask whether the answer needs to be that long — capping `max_tokens` and asking for bullets instead of prose is frequently a 3× win for free." },
        { type: "h2", text: "Why the two phases behave so differently" },
        { type: "compare", caption: "Different bottlenecks, different fixes.", columns: ["", "Prefill", "Decode"], rows: [
          { label: "What it does", cells: ["Processes the whole prompt at once", "Generates one token at a time"] },
          { label: "Parallelism", cells: ["All prompt tokens together", "Strictly sequential"] },
          { label: "Bottleneck", cells: ["Compute (FLOPs)", "Memory bandwidth — the weights are re-read per token"] },
          { label: "Scales with", cells: ["Input length", "Output length"] },
          { label: "Speed up by", cells: ["Shorter prompts, prompt caching, more compute", "Smaller/quantized models, speculative decoding, better batching"] },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**TTFT** = time to first token. **TPOT / ITL** = time per output token, or inter-token latency. **Prefill** = processing the input prompt. **Decode** = generating output tokens one at a time. **Throughput** = total tokens/second served across all concurrent requests. **Goodput** = throughput that actually met your latency targets. **Memory-bandwidth bound** = limited by moving weights from GPU memory, not by arithmetic. **p50 / p95 / p99** = median and tail latency percentiles." },
        { type: "h2", text: "The latency/throughput trade" },
        { type: "p", text: "Serving engines batch concurrent requests so the GPU processes many sequences per weight-read. Bigger batches mean far better throughput and worse per-request latency — the fundamental tension in LLM serving." },
        { type: "list", items: [
          "**Small batches** → low latency, poor GPU utilisation, high cost per token. Right for interactive chat.",
          "**Large batches** → excellent throughput and cost, higher and more variable latency. Right for bulk/offline work.",
          "**Continuous batching** improves both: requests join and leave the running batch as they finish rather than waiting for a whole batch to complete. This is table stakes in any modern engine.",
          "**Separate your workloads.** Interactive traffic and batch jobs on the same endpoint means your batch job sets your users' p99. Route them to different pools.",
        ]},
        { type: "h2", text: "Back-of-envelope arithmetic" },
        { type: "p", text: "You will be asked to do this on a whiteboard. The method matters more than precise current prices — state your assumptions and work in orders of magnitude." },
        { type: "code", lang: "python", caption: "Cost and latency for a RAG assistant — the calculation to be able to do out loud", code: `# --- assumptions, stated up front ---
requests_per_day   = 50_000
input_tokens       = 4_000      # system + 8 retrieved chunks + history
output_tokens      = 350
price_in           = 3.00 / 1e6   # $/token, mid-tier model
price_out          = 15.00 / 1e6  # output is typically 3-5x input

# --- cost ---
per_request = input_tokens * price_in + output_tokens * price_out
#             = 0.012      +      0.00525            = $0.0173
monthly     = per_request * requests_per_day * 30      # ≈ $25,900

# --- where the money is: 70% is INPUT, and input is cacheable ---
# stable prefix (system + tools) ≈ 1,200 of the 4,000 input tokens
cached_price = price_in * 0.1                      # ~90% discount on cache hits
saving = 1_200 * (price_in - cached_price) * requests_per_day * 30   # ≈ $4,900

# --- latency ---
ttft  = 0.35                     # 4k prompt, warm cache
total = ttft + output_tokens * 0.025      # ≈ 9.1s to complete
# ... but the user sees the first token in 350ms, which is what they judge.`},
        { type: "callout", kind: "tip", text: "Two moves that reshape that budget before you touch anything else: **cache the stable prefix** (usually 30–50% of input tokens on a RAG call) and **route the easy majority to a cheaper model**. Together they routinely cut a bill by 60–80% without any quality loss you can measure." },
        { type: "h2", text: "Streaming and perceived latency" },
        { type: "p", text: "A 9-second response that starts appearing in 350ms feels dramatically faster than a 4-second response that appears all at once. Stream by default, show a thinking indicator during prefill, and render partial output as it arrives. When you *can't* stream — structured output consumed by another system — the whole latency is felt, so budget accordingly." },
        { type: "h2", text: "Measuring properly" },
        { type: "list", items: [
          "**Report percentiles, never averages.** The mean hides the tail your users actually complain about; p95 and p99 are the numbers.",
          "**Measure TTFT and total separately.** They have different causes and different fixes.",
          "**Attribute latency by stage** — retrieval, rerank, model, guardrails, tool calls. Otherwise \"it's slow\" is unactionable.",
          "**Track goodput**, not just throughput: tokens/second that met your latency SLO. A system with great throughput and blown p99 is failing.",
          "**Watch queue time under load.** At saturation, waiting to start dominates everything else, and no model optimisation touches it.",
        ]},
      ],
      takeaways: [
        "The four numbers are TTFT, TPOT, total latency, and throughput — and total is usually dominated by output length.",
        "Prefill is compute-bound and parallel; decode is memory-bandwidth-bound and sequential, so they need different fixes.",
        "Batching trades latency for throughput; continuous batching improves both, and interactive vs batch traffic must be separated.",
        "Cost arithmetic is a standard interview task: state assumptions, compute per-request cost, then find the cacheable and routable parts.",
        "Measure percentiles by stage, track goodput rather than raw throughput, and watch queue time under load.",
      ],
      flashcards: [
        { front: "What is TTFT and what drives it?", back: "Time to first token — driven by prompt length, prefill compute, queueing, and whether the prompt prefix hit the cache. It's the latency users actually feel." },
        { front: "Why is decode memory-bandwidth bound?", back: "Generating each token requires reading the model's weights from GPU memory, and that transfer — not the arithmetic — is the limit. It's why smaller and quantized models decode faster." },
        { front: "What does continuous batching do?", back: "Lets requests join and leave the running batch as they complete, instead of waiting for a whole batch to finish. It improves throughput and latency at the same time." },
        { front: "What is goodput?", back: "Throughput that actually met your latency SLO. A system with excellent tokens/second and a blown p99 has high throughput and poor goodput — and unhappy users." },
        { front: "Fastest way to cut latency on a slow assistant?", back: "Shorten the output (cap max_tokens, ask for bullets) and cache the stable prompt prefix. Both usually beat any infrastructure change, and both are free." },
      ],
      quiz: [
        { q: "Users say your assistant is slow, but total latency is 4s and TTFT is 3.5s. What's the problem?", options: ["Decode is too slow", "Prefill — a long prompt or a cache miss", "Too many output tokens", "The vector DB"], answer: 1, explain: "Almost all the time is before the first token, which is prefill. Shorten the prompt, cache the stable prefix, or cut retrieved context — decode optimisations won't help." },
        { q: "You batch aggressively to cut GPU cost and p99 latency triples. Why?", options: ["The model got bigger", "Larger batches raise per-request latency — the classic latency/throughput trade", "Prompt caching broke", "Tokenization overhead"], answer: 1, explain: "Batching amortises weight reads across requests, improving throughput while each request waits longer. Separate interactive from batch traffic instead of choosing one setting for both." },
        { q: "70% of your token spend is input on a RAG endpoint. Best first optimisation?", options: ["Switch to a smaller model", "Prompt-cache the stable prefix and rerank to fewer passages", "Reduce max_tokens", "Add more GPUs"], answer: 1, explain: "Caching the repeated prefix is a large discount for no quality change, and sending 5 well-reranked passages instead of 20 mediocre ones cuts input tokens and usually improves answers." },
      ],
    },
    {
      slug: "kv-cache-and-attention",
      title: "KV cache, attention & speculative decoding",
      summary:
        "The optimisations inside the serving engine — what the KV cache is, why it dominates GPU memory, and how PagedAttention and speculative decoding change your capacity planning.",
      minutes: 11,
      blocks: [
        { type: "p", text: "You don't implement these. You do need to understand them, because they determine how many concurrent users a GPU can hold, why long conversations get expensive, and which serving-engine settings actually matter." },
        { type: "h2", text: "The KV cache" },
        { type: "p", text: "Generating token N requires attending to all previous tokens. Recomputing their key and value vectors every step would be quadratic waste, so the engine **caches them** — that's the KV cache. It makes decode fast and it is why a long conversation consumes GPU memory that scales with its length." },
        { type: "diagram", name: "kv-cache", caption: "The KV cache grows with every token, per sequence — and it, not the weights, usually limits concurrency." },
        { type: "callout", kind: "key", text: "**The KV cache, not the model weights, is usually what caps your concurrency.** Weights are a fixed cost loaded once; KV cache is per-sequence and grows every token. \"How many concurrent users fit on this GPU?\" is nearly always a KV-cache question." },
        { type: "code", lang: "python", caption: "The capacity calculation worth memorising", code: `# KV cache bytes per token, per sequence:
#   2 (K and V) x layers x kv_heads x head_dim x bytes_per_element

layers, kv_heads, head_dim, dtype_bytes = 32, 8, 128, 2      # bf16, GQA
per_token = 2 * layers * kv_heads * head_dim * dtype_bytes   # = 131,072 B ≈ 128 KB

seq_len   = 8_000
per_seq   = per_token * seq_len / 1e9                        # ≈ 1.05 GB per user

gpu_gb, weights_gb = 80, 16                                  # H100, 8B model bf16
usable = (gpu_gb - weights_gb) * 0.9                         # leave headroom
print(int(usable / per_seq))                                 # ≈ 54 concurrent users

# Note what moves this number:
#   - Multi-Query / Grouped-Query Attention cuts kv_heads => big win
#   - FP8 KV cache halves dtype_bytes => ~2x concurrency
#   - Shorter contexts scale linearly => trim your prompts`},
        { type: "h2", text: "Attention variants that changed capacity" },
        { type: "compare", caption: "Why modern models serve so many more users per GPU.", columns: ["Technique", "What it changes", "Effect"], rows: [
          { label: "MHA (multi-head)", cells: ["Every head has its own K and V", "Largest KV cache — the original design"] },
          { label: "MQA (multi-query)", cells: ["All heads share one K/V pair", "Drastically smaller cache, some quality cost"] },
          { label: "GQA (grouped-query)", cells: ["Heads share K/V in groups", "The standard compromise in modern models"] },
          { label: "FlashAttention", cells: ["Tiled, IO-aware attention that avoids materialising the full matrix", "Faster and far less memory during compute; no quality change"] },
          { label: "Sliding-window / local attention", cells: ["Each token attends to a recent window", "Bounded cache for very long contexts, at some long-range cost"] },
        ]},
        { type: "h2", text: "PagedAttention" },
        { type: "p", text: "Classic serving pre-allocated a contiguous KV block per sequence sized for the *maximum* possible length — so a request that generated 100 tokens still reserved space for 8,000. Utilisation was frequently under 30%. **PagedAttention** (introduced by vLLM) applies virtual-memory paging to the KV cache: fixed-size blocks allocated on demand, non-contiguous, with copy-on-write sharing between sequences that have a common prefix." },
        { type: "list", items: [
          "**Near-zero fragmentation** — memory is allocated as tokens are actually generated.",
          "**Prefix sharing** — many requests with the same system prompt share those cache blocks instead of duplicating them.",
          "**Several-fold throughput gains** on realistic workloads, which is why it became the default architecture across serving engines.",
        ]},
        { type: "h2", text: "Speculative decoding" },
        { type: "p", text: "Decode is bandwidth-bound: verifying several tokens costs barely more than verifying one. **Speculative decoding** exploits that — a small \"draft\" model proposes the next few tokens, the large model verifies them all in one pass, and accepted tokens are kept. Rejected ones cost a little waste." },
        { type: "compare", caption: "The variants.", columns: ["Approach", "Draft source"], rows: [
          { label: "Draft model", cells: ["A much smaller model from the same family"] },
          { label: "Self-speculation / Medusa", cells: ["Extra heads on the same model predicting several tokens ahead"] },
          { label: "N-gram / prompt lookup", cells: ["Copy likely continuations from the prompt — excellent for editing and summarisation where output repeats input"] },
        ]},
        { type: "callout", kind: "key", text: "**Speculative decoding is mathematically lossless** — the accept/reject rule guarantees the output distribution matches the target model's. You get 2–3× faster decode with identical quality, which is rare enough to be worth remembering. The cost is extra memory for the draft model and wasted compute on rejections." },
        { type: "callout", kind: "warn", text: "Its benefit depends entirely on the **acceptance rate**. Predictable text (code, structured output, summaries quoting the source) accepts well; open-ended creative generation accepts poorly and can end up slower than plain decoding. Measure on your workload before enabling it globally." },
        { type: "h2", text: "Prefix caching, the practical one" },
        { type: "p", text: "The optimisation you'll actually configure: keep the KV cache for a shared prompt prefix and reuse it across requests. Your system prompt, tool definitions, and few-shot examples get processed once instead of every call. This is the same mechanism behind provider prompt caching — and it's why prompt *ordering* (stable content first) is a performance decision, not just a style one." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**KV cache** = stored key/value vectors for previous tokens so they aren't recomputed. **MHA / MQA / GQA** = multi-head, multi-query, and grouped-query attention — progressively smaller KV caches. **FlashAttention** = an IO-aware attention kernel that's faster and more memory-efficient. **PagedAttention** = paged, on-demand KV allocation with prefix sharing. **Speculative decoding** = a draft model proposing tokens that the target model verifies in one pass. **Acceptance rate** = the fraction of drafted tokens kept. **Prefix caching** = reusing KV cache for a shared prompt prefix across requests." },
      ],
      takeaways: [
        "The KV cache — not the weights — usually determines how many concurrent sequences fit on a GPU.",
        "GQA/MQA shrink the cache; FlashAttention speeds attention without changing output; sliding windows bound very long contexts.",
        "PagedAttention removes fragmentation and enables prefix sharing, which is why it became the default serving architecture.",
        "Speculative decoding is lossless and gives 2–3× faster decode when acceptance rates are high — measure per workload.",
        "Prefix caching is the setting you'll actually tune, and it's why stable-content-first prompt ordering is a performance decision.",
      ],
      flashcards: [
        { front: "What limits concurrent users on a GPU — weights or KV cache?", back: "Usually the KV cache. Weights are a one-time fixed cost; KV cache is per sequence and grows with every token, so long contexts and many users compete for the same remaining memory." },
        { front: "What does PagedAttention fix?", back: "KV-cache fragmentation from pre-allocating maximum-length contiguous blocks. It allocates fixed-size pages on demand and shares blocks across sequences with a common prefix." },
        { front: "Is speculative decoding lossless?", back: "Yes — the accept/reject rule guarantees the output distribution matches the target model's. It trades extra memory and some wasted compute for 2–3× faster decode." },
        { front: "When does speculative decoding not help?", back: "When the acceptance rate is low — open-ended creative generation. It shines on predictable text: code, structured output, and summaries that quote the input." },
        { front: "How do you halve KV cache memory without changing the model?", back: "Quantize the KV cache to FP8 (from bf16). Roughly doubles concurrency; measure quality on long contexts, where the effect shows up first." },
      ],
      quiz: [
        { q: "Your GPU serves 50 concurrent users at 4k context but only 12 at 16k. Why?", options: ["The model got bigger", "KV cache scales linearly with sequence length", "Tokenization overhead", "Batching is disabled"], answer: 1, explain: "KV cache per sequence is proportional to context length, so 4× the context leaves room for roughly a quarter as many sequences. Trimming context directly buys concurrency." },
        { q: "Which optimisation is guaranteed not to change output quality?", options: ["INT4 quantization", "Speculative decoding", "Sliding-window attention", "Distillation to a smaller model"], answer: 1, explain: "Speculative decoding's accept/reject rule preserves the target model's output distribution exactly. Quantization, windowed attention, and distillation are all lossy in different ways." },
        { q: "You serve one system prompt to thousands of requests. Which feature helps most?", options: ["Larger batch size", "Prefix caching / prefix sharing in the KV cache", "Higher temperature", "More draft tokens"], answer: 1, explain: "The shared prefix is processed once and reused, cutting prefill work and TTFT for every request — provided the prefix is byte-identical and comes first in the prompt." },
      ],
    },
    {
      slug: "quantization",
      title: "Quantization & compression",
      summary:
        "Making models smaller and faster by using fewer bits — the formats, what quality actually costs, and how to choose without believing the benchmark table.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Model weights ship as 16-bit floats by default. **Quantization** stores them with fewer bits — 8, 4, sometimes fewer — cutting memory and, because decode is bandwidth-bound, usually increasing speed at the same time. It is the difference between a model needing four GPUs and one." },
        { type: "diagram", name: "quantization-spectrum", caption: "Bits against memory and quality. The interesting region is 8-bit and 4-bit." },
        { type: "compare", caption: "The precisions you'll meet.", columns: ["Precision", "Relative size", "Quality", "Use"], rows: [
          { label: "FP32", cells: ["4×", "Reference", "Rare for inference"] },
          { label: "BF16 / FP16", cells: ["2×", "The baseline everyone compares to", "Standard serving default"] },
          { label: "FP8", cells: ["1×", "Near-lossless on supported hardware", "Increasingly the production default"] },
          { label: "INT8", cells: ["1×", "Small, usually acceptable loss", "Mature and widely supported"] },
          { label: "INT4", cells: ["0.5×", "Noticeable on hard tasks; fine on many", "Fitting big models on small GPUs"] },
          { label: "Below 4-bit", cells: ["<0.5×", "Significant degradation", "Research and extreme edge cases"] },
        ]},
        { type: "h2", text: "The methods, by name" },
        { type: "list", items: [
          "**GPTQ** — post-training, one layer at a time using calibration data, minimising output error. Established and widely supported.",
          "**AWQ** (Activation-aware Weight Quantization) — protects the small fraction of weights that matter most based on activation magnitudes. Often better quality than GPTQ at 4-bit.",
          "**GGUF** — the file format used by llama.cpp for CPU and consumer-GPU inference, with a family of quantization levels (Q4_K_M and similar). This is how models run on laptops.",
          "**bitsandbytes / NF4** — on-the-fly quantization used during QLoRA fine-tuning; convenient rather than fastest.",
          "**SmoothQuant** — shifts quantization difficulty from activations to weights so both can be INT8.",
          "**QAT (quantization-aware training)** — training with quantization simulated, giving the best low-bit quality at the cost of a training run.",
        ]},
        { type: "callout", kind: "key", text: "The distinction that matters: **weight-only** quantization shrinks memory and speeds up bandwidth-bound decode, and is nearly free in quality at 8-bit. **Weight-and-activation** quantization also speeds up compute-bound prefill, but is harder to do without quality loss. Most production 4-bit deployments are weight-only." },
        { type: "h2", text: "What quantization actually costs" },
        { type: "compare", caption: "Degradation is not uniform — this is why aggregate benchmarks mislead.", columns: ["Task", "Sensitivity to 4-bit"], rows: [
          { label: "Classification, extraction, routing", cells: ["Low — usually indistinguishable"] },
          { label: "Summarisation, general chat", cells: ["Low to moderate"] },
          { label: "Code generation", cells: ["Moderate — subtle bugs appear before obvious failures"] },
          { label: "Multi-step reasoning and maths", cells: ["High — small per-step errors compound"] },
          { label: "Long-context recall", cells: ["High — degrades faster than short-context scores suggest"] },
          { label: "Rare languages and niche domains", cells: ["High — the tail is what low-bit quantization erodes first"] },
        ]},
        { type: "callout", kind: "warn", text: "**Published quantization benchmarks systematically understate the damage.** They report averages over broad tasks, and the loss concentrates in the tail: hard reasoning, long context, rare languages, unusual formats. Evaluate on *your* eval set, sliced — especially your hardest slice — before deploying a quantized model." },
        { type: "h2", text: "Choosing" },
        { type: "steps", items: [
          { title: "Start at BF16 and establish the quality baseline", text: "You cannot measure loss without a reference number on your own eval set." },
          { title: "Try FP8 or INT8 first", text: "Half the memory, faster decode, and typically no measurable quality change. This is the easy win." },
          { title: "Go to 4-bit only if you need to", text: "Because the model otherwise doesn't fit, or the cost case demands it. Use AWQ or GPTQ with calibration data drawn from your domain." },
          { title: "Evaluate by slice, not on average", text: "Compare against the BF16 baseline on your hardest cases, longest contexts, and non-primary languages." },
          { title: "Consider a smaller model at higher precision", text: "An 8B model at FP8 often beats a 70B model at INT4 on both quality and speed. Bigger-but-crushed is not automatically better." },
          { title: "Quantize the KV cache separately", text: "FP8 KV cache roughly doubles concurrency and is a distinct decision from weight precision." },
        ]},
        { type: "callout", kind: "tip", text: "The comparison teams forget to run: **a smaller model at high precision versus a larger model quantized hard.** They're often similar in memory footprint and the smaller-at-high-precision option frequently wins on quality *and* latency. Run both against your evals before committing to a GPU order." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Quantization** = representing weights (and sometimes activations) with fewer bits. **PTQ** = post-training quantization, applied to an already-trained model. **QAT** = quantization-aware training. **Calibration data** = a small sample used to choose quantization parameters. **GPTQ / AWQ** = post-training methods, the latter activation-aware. **GGUF** = llama.cpp's model file format for CPU/consumer inference. **Weight-only vs weight-and-activation** = what gets quantized, and therefore which phase speeds up. **Perplexity** = a rough language-modelling quality metric often quoted for quantization, and a poor proxy for task performance." },
      ],
      takeaways: [
        "Quantization cuts memory and speeds bandwidth-bound decode; FP8/INT8 is usually near-free, INT4 is a real trade.",
        "GPTQ, AWQ, GGUF, bitsandbytes/NF4, SmoothQuant and QAT are the names to know, with AWQ often best at 4-bit.",
        "Weight-only quantization helps decode; weight-and-activation also helps prefill but is harder to do losslessly.",
        "Degradation concentrates in the tail — hard reasoning, long context, rare languages — so evaluate by slice, not on average.",
        "A smaller model at high precision often beats a larger model at INT4; always run that comparison.",
      ],
      flashcards: [
        { front: "Why does quantization speed up decoding?", back: "Decode is memory-bandwidth bound — every token requires reading the weights. Fewer bits per weight means less data moved per token, so generation gets faster as well as smaller." },
        { front: "GPTQ vs AWQ", back: "Both are post-training. GPTQ quantizes layer by layer minimising output error; AWQ identifies and protects the weights that matter most based on activation magnitudes, and often wins at 4-bit." },
        { front: "Where does 4-bit quantization hurt most?", back: "Multi-step reasoning, long-context recall, code correctness, and rare languages — the tail. Average benchmark scores systematically understate this." },
        { front: "What is GGUF?", back: "The llama.cpp model file format with a family of quantization levels, used for running models on CPUs and consumer GPUs — the format behind most local/laptop inference." },
        { front: "What comparison do teams skip before buying GPUs?", back: "A smaller model at high precision versus a bigger model quantized to 4-bit. Similar memory footprint, and the smaller-at-high-precision option often wins on quality and latency." },
      ],
      quiz: [
        { q: "Your INT4 model scores the same on average but users report worse code output. What happened?", options: ["A serving bug", "Quantization loss concentrates in harder tasks — averages hide it", "Temperature changed", "The tokenizer changed"], answer: 1, explain: "Aggregate benchmarks mask tail degradation. Code correctness, multi-step reasoning, and long-context recall degrade well before average scores move — evaluate by slice." },
        { q: "You need 2× concurrency on the same GPU with no weight change. What do you do?", options: ["Increase batch size only", "Quantize the KV cache to FP8", "Enable speculative decoding", "Raise ef_search"], answer: 1, explain: "KV cache is what limits concurrency; halving its precision roughly doubles how many sequences fit. It's a separate decision from weight quantization." },
        { q: "A 70B at INT4 and an 8B at FP8 use similar memory. What should you do?", options: ["Always take the bigger model", "Evaluate both on your eval set — the smaller high-precision model often wins", "Always take the smaller model", "Use FP32 for both"], answer: 1, explain: "Bigger-but-crushed is not automatically better. The comparison is empirical, and the smaller high-precision model frequently wins on quality and latency together." },
      ],
    },
    {
      slug: "serving-stacks-and-gpus",
      title: "Serving stacks & GPU sizing",
      summary:
        "vLLM, SGLang, TGI, Ollama and the managed options — what each is for, how to size hardware, and the operational realities of running models yourself.",
      minutes: 11,
      blocks: [
        { type: "p", text: "If you self-host, you pick a serving engine and a GPU. Both decisions are more consequential than the model choice, because they set your cost per token, your concurrency ceiling, and how much of your week goes to operations." },
        { type: "diagram", name: "serving-stack", caption: "The layers between an HTTP request and a GPU kernel." },
        { type: "compare", caption: "The engines, by purpose.", columns: ["Engine", "Built for", "Notable"], rows: [
          { label: "vLLM", cells: ["High-throughput GPU serving", "PagedAttention's origin; the common production default; OpenAI-compatible API"] },
          { label: "SGLang", cells: ["High throughput with complex prompt structure", "RadixAttention for aggressive prefix sharing; strong on structured output"] },
          { label: "TensorRT-LLM", cells: ["Maximum performance on NVIDIA", "Fastest when tuned; compilation step and more operational work"] },
          { label: "TGI", cells: ["Production serving in the Hugging Face ecosystem", "Well-integrated, straightforward to operate"] },
          { label: "Ollama / llama.cpp", cells: ["Local and edge inference", "CPU and consumer GPUs, GGUF quantization, excellent developer ergonomics"] },
          { label: "Managed endpoints", cells: ["Open weights without the ops", "Cloud vendors and inference providers; pay per token or per GPU-hour"] },
        ]},
        { type: "callout", kind: "key", text: "**Default to vLLM for GPU serving and Ollama for local development.** Reach past those only when you have measured a specific need — extreme throughput tuning (TensorRT-LLM), heavy prefix sharing across structured prompts (SGLang), or ecosystem alignment (TGI)." },
        { type: "h2", text: "Sizing the hardware" },
        { type: "steps", items: [
          { title: "Memory for weights", text: "Parameters × bytes per parameter. A 70B model is ~140 GB at BF16, ~70 GB at FP8, ~35 GB at INT4." },
          { title: "Memory for KV cache", text: "Per-token cost × context length × concurrent sequences. This is what actually determines your user capacity." },
          { title: "Overhead", text: "Activations, fragmentation, CUDA graphs — leave 10–20% headroom or you'll OOM under load rather than in testing." },
          { title: "Then choose the GPU", text: "Memory capacity first, memory *bandwidth* second (it sets decode speed), raw FLOPs third (it mostly affects prefill)." },
          { title: "Decide on parallelism", text: "Tensor parallelism splits a model across GPUs in one node for models that don't fit; pipeline parallelism spans nodes; data parallelism runs independent replicas for throughput. Replicas are simpler — prefer them when the model fits on one GPU." },
        ]},
        { type: "callout", kind: "tip", text: "**Memory bandwidth is the specification that predicts decode speed**, and it's the one people skip when comparing GPUs. Two cards with the same memory capacity can differ substantially in tokens/second because decode is bandwidth-bound. Read the bandwidth number before the FLOPs number." },
        { type: "h2", text: "The self-hosting break-even" },
        { type: "compare", caption: "The arithmetic, honestly.", columns: ["Factor", "Hosted API", "Self-hosted"], rows: [
          { label: "Cost shape", cells: ["Per token — scales with usage, zero at idle", "Per GPU-hour — fixed, wasted when idle"] },
          { label: "Break-even", cells: ["Cheaper below steady high volume", "Wins with sustained high utilisation"] },
          { label: "Utilisation", cells: ["Provider's problem", "Yours — bursty traffic means paying for idle GPUs"] },
          { label: "Ops burden", cells: ["Rate limits, provider incidents", "Capacity, OOMs, driver upgrades, on-call"] },
          { label: "Data control", cells: ["Contractual", "Absolute"] },
          { label: "Model freedom", cells: ["What the vendor offers", "Any open-weight model, any fine-tune, any quantization"] },
        ]},
        { type: "callout", kind: "warn", text: "The self-hosting cost model people get wrong: **you pay for the GPU 24/7, not for the tokens.** A GPU at 15% average utilisation is roughly 6× more expensive per token than the same GPU at 90%. Compute your break-even against *realistic* utilisation including nights and weekends, not against peak." },
        { type: "h2", text: "Operational realities" },
        { type: "list", items: [
          "**Cold starts are brutal.** Loading a large model into GPU memory takes minutes, so autoscaling on demand doesn't work the way it does for stateless services. Keep warm capacity, and pre-warm before known peaks.",
          "**OOM is your most common failure.** It arrives when a long-context request lands during a full batch. Cap max sequence length, cap batch size, and load-test at your real context distribution.",
          "**Queueing dominates at saturation.** Past the knee of the curve, time-in-queue swamps everything; admission control and shedding beat letting latency blow up for everyone.",
          "**GPUs are supply-constrained.** Capacity may need reserving in advance; treat it as a procurement item with lead time, not an API call.",
          "**Keep a hosted fallback.** When your cluster degrades, routing to a provider API is a far better incident response than an outage.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Serving engine** = the software running the model and handling batching, caching, and scheduling. **Tensor parallelism** = splitting a model's layers across GPUs. **Pipeline parallelism** = splitting layers across stages/nodes. **Data parallelism** = independent replicas serving different requests. **Cold start** = time to load a model into GPU memory. **Admission control** = rejecting or queueing requests to protect latency. **OOM** = out of memory. **Memory bandwidth** = how fast weights move from GPU memory, which sets decode speed." },
      ],
      takeaways: [
        "vLLM is the default GPU serving engine and Ollama the default local one; go past them only for a measured need.",
        "Size in order: weights, KV cache, overhead — then choose a GPU on memory capacity, then bandwidth, then FLOPs.",
        "Prefer independent replicas over tensor parallelism whenever the model fits on a single GPU.",
        "Self-hosting economics hinge on utilisation: you pay per GPU-hour, not per token, so bursty traffic is expensive.",
        "Plan for cold starts, OOM under long-context load, queueing at saturation, GPU lead times, and keep a hosted fallback.",
      ],
      flashcards: [
        { front: "What's the default self-hosted serving stack?", back: "vLLM for GPU serving (PagedAttention, continuous batching, OpenAI-compatible API) and Ollama/llama.cpp for local development and edge." },
        { front: "In what order do you size GPU memory?", back: "Weights (params × bytes), then KV cache (per-token × context × concurrency), then 10–20% overhead headroom. KV cache is what determines user capacity." },
        { front: "Which GPU spec predicts decode speed?", back: "Memory bandwidth — decode is bandwidth-bound. Two GPUs with equal memory capacity can differ substantially in tokens/second." },
        { front: "Why is a GPU at 15% utilisation so expensive?", back: "You pay per GPU-hour regardless of traffic, so cost per token is roughly 6× that of the same GPU at 90%. Break-even must be computed against realistic average utilisation, not peak." },
        { front: "Why doesn't autoscaling work well for self-hosted LLMs?", back: "Cold starts take minutes to load weights into GPU memory, so scale-up can't respond to a spike. Keep warm capacity and pre-warm ahead of known peaks." },
      ],
      quiz: [
        { q: "Your self-hosted deployment costs more per token than the API you left. Most likely cause?", options: ["The model is too small", "Low average GPU utilisation — you pay per hour, not per token", "Quantization overhead", "Too much prefix caching"], answer: 1, explain: "Self-hosting only wins at sustained high utilisation. Bursty traffic means paying for idle GPUs overnight and at weekends, which destroys the per-token comparison." },
        { q: "Your service OOMs intermittently under load. Most likely trigger?", options: ["Too many small requests", "A long-context request arriving while the batch is full", "Prefix caching", "Speculative decoding"], answer: 1, explain: "KV cache scales with context length, so one long sequence can exceed remaining memory. Cap max sequence length and batch size, and load-test at your real context distribution." },
        { q: "A 13B model fits comfortably on one GPU but you need 3× throughput. Best approach?", options: ["Tensor parallelism across 3 GPUs", "Three independent replicas behind a load balancer", "Pipeline parallelism", "Quantize to INT4"], answer: 1, explain: "Tensor parallelism adds communication overhead and is for models that don't fit. When the model fits, replicas scale throughput linearly and are far simpler to operate." },
      ],
    },
  ],
};
