import type { Module } from "./types";

export const nlp: Module = {
  id: "nlp",
  title: "NLP & Transformers",
  blurb:
    "The architecture behind modern AI. How text becomes vectors, how self-attention lets every token see every other, the Transformer that assembled it all, and the BERT-vs-GPT split — the single most-asked topic in 2020s AI interviews.",
  accent: "iris",
  lessons: [
    {
      slug: "tokenization-and-embeddings",
      title: "From text to vectors: tokens & embeddings",
      summary:
        "Models don't read words — they read numbers. How tokenization splits text and how embeddings turn tokens into vectors where meaning becomes geometry.",
      minutes: 9,
      blocks: [
        { type: "p", text: "A neural network operates on numbers, so the first job in NLP is turning text into vectors. Two steps do it: **tokenization** (split text into units) and **embedding** (map each unit to a vector). Get this foundation right and attention, Transformers, and LLMs all follow." },
        { type: "h2", text: "Tokenization" },
        { type: "p", text: "**Tokenization** breaks text into tokens the model processes. Modern LLMs use **subword** tokenization (e.g. Byte-Pair Encoding), a middle ground between two extremes:" },
        { type: "list", items: [
          "**Word-level** — one token per word. Simple, but huge vocabulary and no way to handle unseen words ('out-of-vocabulary').",
          "**Character-level** — one token per character. Tiny vocabulary, handles anything, but sequences get very long and meaning is diffuse.",
          "**Subword (BPE, WordPiece)** — frequent words stay whole; rare words split into pieces ('tokenization' → 'token' + 'ization'). Balances vocabulary size and coverage — the modern default.",
        ]},
        { type: "callout", kind: "tip", text: "Practical interview hook: token count — not word count — drives an LLM's context limit and API cost. A rough rule of thumb for English is ~1 token ≈ 4 characters ≈ ¾ of a word. Knowing this signals you've actually built with LLMs." },
        { type: "h2", text: "Embeddings" },
        { type: "p", text: "An **embedding** maps each token to a dense vector of real numbers (say 768 dimensions). Crucially, these vectors are *learned* so that **semantically similar tokens land near each other**, and relationships become directions in the space. The famous example: `king − man + woman ≈ queen`." },
        { type: "diagram", name: "embeddings", caption: "Embeddings place meaning in geometry — similar words cluster, and relationships become consistent directions." },
        { type: "callout", kind: "key", text: "The big idea: embeddings turn discrete symbols into continuous vectors where distance means similarity. This is what lets models generalize ('happy' and 'joyful' are close, so what's learned for one transfers), and it's the backbone of semantic search and RAG." },
        { type: "p", text: "Early embeddings (Word2Vec, GloVe) were **static** — one fixed vector per word, so 'bank' had the same vector in 'river bank' and 'bank account.' Transformers produce **contextual** embeddings — the vector for a token depends on the surrounding sentence — which is a big part of why they're so much better at language." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Token** = the unit a model reads (often a subword piece). **Vocabulary** = the fixed set of possible tokens. **BPE (Byte-Pair Encoding)** = a subword algorithm that merges frequent character pairs. **Embedding** = the learned vector for a token. **Dimensionality** = the length of that vector. **Contextual embedding** = a token vector that changes with its surrounding context." },
      ],
      takeaways: [
        "Text must be converted to numbers: tokenization splits it, embeddings vectorize it.",
        "Subword tokenization (BPE/WordPiece) balances vocabulary size and coverage — the modern default; token count drives context limits and cost.",
        "Embeddings are learned vectors where semantic similarity becomes geometric closeness, enabling generalization and semantic search.",
        "Transformers produce contextual embeddings (vector depends on surrounding text), unlike static Word2Vec/GloVe.",
      ],
      flashcards: [
        { front: "Why subword tokenization over word- or character-level?", back: "Word-level can't handle unseen words and needs a huge vocab; character-level makes sequences too long. Subword (BPE) keeps common words whole and splits rare ones, balancing both." },
        { front: "What property makes embeddings powerful?", back: "Semantically similar tokens get nearby vectors and relationships become consistent directions (king−man+woman≈queen), so models generalize and you can do semantic search." },
        { front: "Static vs contextual embeddings", back: "Static (Word2Vec/GloVe): one fixed vector per word regardless of context. Contextual (Transformers): the vector depends on the surrounding sentence, so 'bank' differs by usage." },
      ],
      quiz: [
        { q: "Modern LLMs most commonly tokenize using…", options: ["Whole words only", "Single characters only", "Subword units (e.g. BPE)", "Sentences"], answer: 2, explain: "Subword tokenization balances vocabulary size against the ability to represent rare/unseen words." },
        { q: "What does an embedding represent?", options: ["A token's position only", "A dense vector capturing a token's meaning", "The model's loss", "The learning rate"], answer: 1, explain: "Embeddings are learned dense vectors where geometric closeness reflects semantic similarity." },
        { q: "A key advantage of Transformer embeddings over Word2Vec is that they are…", options: ["Static", "Contextual — they depend on surrounding words", "Shorter", "Rule-based"], answer: 1, explain: "Transformers produce context-dependent vectors, so the same word gets different embeddings in different sentences." },
      ],
    },
    {
      slug: "attention-mechanism",
      title: "Attention & self-attention",
      summary:
        "The one idea that unlocked modern AI. How each token decides which other tokens to focus on, via queries, keys, and values — explained so you can whiteboard it.",
      minutes: 11,
      blocks: [
        { type: "p", text: "**Attention** is the mechanism at the heart of the Transformer, and the single most likely deep-dive in a modern AI interview. The intuition: to understand a word, a model should be able to look at the *other* words that give it meaning — and attention learns *which* ones and *how much*." },
        { type: "h2", text: "The problem it solves" },
        { type: "p", text: "In 'The animal didn't cross the street because *it* was too tired,' what does 'it' refer to? Resolving that needs looking back at 'animal.' RNNs had to carry this information step-by-step through a bottleneck hidden state, losing long-range links. Attention lets 'it' directly attend to 'animal' regardless of distance." },
        { type: "h2", text: "Queries, keys, and values" },
        { type: "p", text: "Each token produces three vectors by multiplying its embedding by learned matrices:" },
        { type: "list", items: [
          "**Query (Q)** — what this token is looking for.",
          "**Key (K)** — what each token offers, used to match against queries.",
          "**Value (V)** — the actual content a token contributes if attended to.",
        ]},
        { type: "diagram", name: "attention", caption: "Each token's query is matched against every key; the softmax weights combine the values into a context vector." },
        { type: "p", text: "The computation: take the **dot product** of a token's query with every token's key to get relevance scores, scale by `√d` for stability, apply **softmax** to turn scores into weights that sum to 1, then take the weighted sum of the values. The result is a new representation of the token that blends in information from the tokens it found relevant." },
        { type: "code", lang: "text", caption: "Scaled dot-product attention — worth memorizing", code: "Attention(Q, K, V) = softmax( Q·Kᵀ / √d ) · V\n\nQ·Kᵀ    relevance of every token to every other\n√d      scaling for stable gradients\nsoftmax turns scores into weights that sum to 1\n· V     weighted blend of the value vectors" },
        { type: "callout", kind: "key", text: "Self-attention = the queries, keys, and values all come from the same sequence, so every token attends to every other token in the same input. This all-pairs comparison is why Transformers capture long-range context — and why compute grows with the square of sequence length (the motivation for long-context efficiency research)." },
        { type: "h2", text: "Multi-head attention" },
        { type: "p", text: "Instead of one attention computation, Transformers run several in parallel — **multiple heads** — each with its own Q/K/V projections. Different heads learn to focus on different relationships (one on syntax, another on coreference, etc.), and their outputs are concatenated. It's like consulting several specialists and combining their views." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Query/Key/Value** = three learned projections of each token (what I want / what I offer / what I carry). **Dot product** = a similarity score between two vectors. **Softmax** = converts scores into probabilities summing to 1. **Self-attention** = attention within one sequence. **Multi-head** = several parallel attention computations capturing different relationships. **Quadratic complexity** = cost scales with sequence length squared." },
      ],
      takeaways: [
        "Attention lets each token directly draw information from the other tokens most relevant to it, regardless of distance.",
        "Each token forms a Query, Key, and Value; scores = softmax(Q·Kᵀ/√d), and the output is the weighted sum of Values.",
        "Self-attention means Q, K, V come from the same sequence — every token attends to every other, capturing long-range context.",
        "Multi-head attention runs several attentions in parallel to capture different kinds of relationships; cost is quadratic in sequence length.",
      ],
      flashcards: [
        { front: "What are Q, K, and V in attention?", back: "Learned projections of each token: Query = what I'm looking for, Key = what I offer for matching, Value = the content I contribute. Output = softmax(Q·Kᵀ/√d)·V." },
        { front: "What makes attention 'self'-attention?", back: "The queries, keys, and values all come from the same sequence, so every token attends to every other token in that same input." },
        { front: "Why multi-head attention?", back: "Running several attention computations in parallel lets different heads specialize (syntax, coreference, etc.); their concatenated outputs give a richer representation than a single head." },
      ],
      quiz: [
        { q: "In scaled dot-product attention, the softmax is applied to…", options: ["The value vectors", "The query·key relevance scores", "The final output", "The embeddings directly"], answer: 1, explain: "Softmax turns the Q·Kᵀ relevance scores into weights that sum to 1, which then combine the values." },
        { q: "Self-attention has compute cost that grows…", options: ["Linearly with sequence length", "With the square of sequence length", "Independent of length", "Logarithmically"], answer: 1, explain: "Every token attends to every other, so cost is O(n²) in sequence length — the motivation for efficient long-context methods." },
        { q: "The purpose of multiple attention heads is to…", options: ["Reduce parameters", "Capture different types of relationships in parallel", "Avoid softmax", "Shorten the sequence"], answer: 1, explain: "Each head learns to attend to different patterns; combining them yields a richer representation." },
      ],
    },
    {
      slug: "transformer-architecture",
      title: "The Transformer architecture",
      summary:
        "How attention, feed-forward layers, residuals, normalization, and positional encoding assemble into the architecture that replaced RNNs and powers everything today.",
      minutes: 10,
      blocks: [
        { type: "p", text: "The 2017 paper 'Attention Is All You Need' introduced the **Transformer** — a sequence model built entirely on attention, with no recurrence. It's the foundation of BERT, GPT, and virtually every modern large model, so expect to explain its pieces." },
        { type: "diagram", name: "rnn-vs-transformer", caption: "The Transformer's superpower: process the whole sequence in parallel instead of step-by-step like an RNN." },
        { type: "h2", text: "Why it beat RNNs" },
        { type: "list", items: [
          "**Parallelism** — RNNs process tokens sequentially; Transformers process the whole sequence at once, so training parallelizes on GPUs and scales to enormous datasets.",
          "**Long-range dependencies** — attention connects any two tokens directly, without information degrading over many recurrent steps.",
          "**Scalability** — this parallelism is precisely what made training billion-parameter models on internet-scale text feasible.",
        ]},
        { type: "h2", text: "The building blocks" },
        { type: "p", text: "A Transformer stacks identical blocks, each containing:" },
        { type: "steps", items: [
          { title: "Multi-head self-attention", text: "Each token gathers information from relevant tokens across the sequence (the previous lesson)." },
          { title: "Feed-forward network", text: "A small per-token MLP that transforms each position independently, adding representational capacity." },
          { title: "Residual connections", text: "Each sub-layer's input is added to its output, giving gradients a shortcut path and enabling very deep stacks." },
          { title: "Layer normalization", text: "Normalizes activations to keep training stable across many layers." },
        ]},
        { type: "h2", text: "Positional encoding" },
        { type: "p", text: "Attention is **order-agnostic** — it sees a set of tokens, not a sequence, so 'dog bites man' and 'man bites dog' would look identical. **Positional encodings** inject information about each token's position (via fixed sinusoids in the original paper, or learned/rotary embeddings today) so the model knows word order. This is a favorite 'what's missing?' interview question." },
        { type: "callout", kind: "key", text: "The whole recipe in one breath: embed tokens, add positional information, then pass through N blocks of [multi-head self-attention → feed-forward], each wrapped in residual connections and layer norm. Stack enough blocks, train on enough text, and you get a large language model." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Transformer block** = one [attention + feed-forward] unit with residuals and norm; models stack many. **Feed-forward network (FFN)** = a per-token MLP inside each block. **Residual (skip) connection** = adding a sub-layer's input to its output to ease gradient flow. **Positional encoding** = added signal telling the model token order. **Encoder/decoder** = the two Transformer variants (next lesson)." },
      ],
      takeaways: [
        "The Transformer is built entirely on attention with no recurrence, so it processes sequences in parallel and scales massively.",
        "Each block stacks multi-head self-attention and a feed-forward network, wrapped in residual connections and layer normalization.",
        "Because attention is order-agnostic, positional encodings are added to give the model word order.",
        "This architecture — embed + positions + N attention/FFN blocks — underlies BERT, GPT, and modern LLMs.",
      ],
      flashcards: [
        { front: "What are the two main sub-layers in a Transformer block?", back: "Multi-head self-attention (mix information across tokens) and a position-wise feed-forward network (transform each token), each wrapped in a residual connection + layer norm." },
        { front: "Why does a Transformer need positional encoding?", back: "Self-attention is order-agnostic — it treats input as a set. Positional encodings inject token-order information so 'dog bites man' ≠ 'man bites dog'." },
        { front: "Why did Transformers beat RNNs at scale?", back: "They process the whole sequence in parallel (RNNs are sequential), connect any two tokens directly for long-range dependencies, and this parallelism made training huge models on massive data feasible." },
      ],
      quiz: [
        { q: "The Transformer replaced recurrence with…", options: ["Convolution", "Attention", "Pooling", "Decision trees"], answer: 1, explain: "'Attention Is All You Need' — the architecture relies entirely on (self-)attention, enabling parallel processing." },
        { q: "Positional encodings are needed because attention…", options: ["Is too slow", "Ignores token order by itself", "Can't use embeddings", "Requires labels"], answer: 1, explain: "Attention sees a set of tokens; positional encodings add the word-order information it otherwise lacks." },
        { q: "Residual connections in a Transformer mainly help by…", options: ["Reducing vocabulary", "Easing gradient flow through deep stacks", "Removing attention", "Adding positional info"], answer: 1, explain: "Adding a sub-layer's input to its output gives gradients a shortcut, enabling very deep, trainable networks." },
      ],
    },
    {
      slug: "bert-vs-gpt",
      title: "BERT vs GPT: encoders, decoders & pretraining",
      summary:
        "The two families of Transformer and the self-supervised objectives that pretrain them — bidirectional understanding vs left-to-right generation, and when to use each.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Transformers come in two flavors defined by which part they use and how they're pretrained. Knowing the **BERT vs GPT** distinction — encoder vs decoder — is a staple interview question." },
        { type: "diagram", name: "llm-lifecycle", caption: "Both start with self-supervised pretraining on massive text; the objective and direction differ." },
        { type: "h2", text: "BERT — bidirectional encoder" },
        { type: "p", text: "**BERT** is an **encoder**: it reads the entire input at once and builds rich representations using **bidirectional** context (each token sees words on both sides). It's pretrained with **Masked Language Modeling** — hide ~15% of tokens and predict them from both directions. This makes BERT excellent at *understanding* tasks: classification, named-entity recognition, sentence similarity, extractive QA." },
        { type: "h2", text: "GPT — autoregressive decoder" },
        { type: "p", text: "**GPT** is a **decoder**: it's pretrained to predict the **next token** given all previous ones (**causal / autoregressive** language modeling), so it only looks leftward. This next-token objective is exactly what you need to *generate* text, which is why GPT-style models power chatbots, code generation, and every generative LLM." },
        { type: "compare", caption: "The two Transformer families.", columns: ["", "BERT (encoder)", "GPT (decoder)"], rows: [
          { label: "Context direction", cells: ["Bidirectional (both sides)", "Left-to-right (causal)"] },
          { label: "Pretraining objective", cells: ["Masked language modeling", "Next-token prediction"] },
          { label: "Best at", cells: ["Understanding: classify, extract, embed", "Generation: chat, write, code"] },
          { label: "Typical use today", cells: ["Embeddings, classifiers, retrieval", "Generative assistants (LLMs)"] },
        ]},
        { type: "callout", kind: "key", text: "The clean mental model: BERT reads (bidirectional encoder, masked-word objective → understanding); GPT writes (causal decoder, next-token objective → generation). Both are 'self-supervised' — the labels come free from the text itself, which is why they can train on the entire internet." },
        { type: "p", text: "There's also a third design, the **encoder-decoder** (T5, the original Transformer, BART), which reads an input with an encoder and generates an output with a decoder — natural for translation and summarization where input and output are distinct sequences." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Encoder** = reads a whole input into representations (bidirectional). **Decoder** = generates tokens one at a time (causal/left-to-right). **Autoregressive** = predicting the next item from previous ones. **Masked language modeling** = predicting hidden tokens from surrounding context. **Causal masking** = preventing a token from seeing future tokens during training." },
      ],
      takeaways: [
        "BERT is a bidirectional encoder pretrained with masked language modeling — strong at understanding tasks (classify, extract, embed).",
        "GPT is a causal decoder pretrained on next-token prediction — the objective that enables text generation and powers LLMs.",
        "Both are self-supervised: labels come free from the text, enabling internet-scale pretraining.",
        "Encoder-decoder models (T5, BART) suit input→output tasks like translation and summarization.",
      ],
      flashcards: [
        { front: "BERT vs GPT in one line", back: "BERT = bidirectional encoder, masked-language-modeling pretraining, best at understanding. GPT = causal (left-to-right) decoder, next-token pretraining, best at generation." },
        { front: "What is masked language modeling?", back: "BERT's pretraining objective: randomly hide ~15% of tokens and predict them using context from both sides — teaching rich bidirectional representations." },
        { front: "Why is next-token prediction the right objective for a chatbot?", back: "Generating text means producing the next token given what came before; training GPT to predict the next token is exactly that skill, at scale and self-supervised." },
      ],
      quiz: [
        { q: "BERT is pretrained primarily with…", options: ["Next-token prediction", "Masked language modeling", "Reinforcement learning", "Clustering"], answer: 1, explain: "BERT masks ~15% of tokens and predicts them using bidirectional context — great for understanding tasks." },
        { q: "GPT-style models are decoders that predict…", options: ["Masked tokens", "The next token given previous ones", "Cluster labels", "Image pixels"], answer: 1, explain: "Causal/autoregressive next-token prediction is the objective that enables generation." },
        { q: "For sentence classification and embeddings, the more natural fit is…", options: ["A GPT decoder", "A BERT-style encoder", "k-means", "A CNN"], answer: 1, explain: "Bidirectional encoders like BERT build rich whole-input representations ideal for understanding/embedding tasks." },
      ],
    },
  ],
};
