import type { InterviewQA } from "./types";

export const interviewQA: InterviewQA[] = [
  {
    topic: "Foundations",
    q: "What's the difference between supervised, unsupervised, and reinforcement learning?",
    a: "Supervised learning maps inputs to known labels (X→y) — classification (discrete target) or regression (continuous target); e.g. spam detection, price prediction. Unsupervised learning finds structure in unlabeled data — clustering (k-means) or dimensionality reduction (PCA). Reinforcement learning has an agent take actions in an environment to maximize a cumulative reward, with no fixed labeled dataset; it powers game-play, robotics, and the RLHF step that aligns LLMs. The first move on any problem is placing it in the right bucket — it dictates the data, algorithms, and evaluation.",
  },
  {
    topic: "Foundations",
    q: "Explain the bias–variance tradeoff.",
    a: "Bias is error from overly simple assumptions — the model underfits and does poorly on both training and test data. Variance is error from over-sensitivity to the training data's noise — the model overfits, doing great on training but poorly on new data. Total expected error is roughly bias² + variance + irreducible noise, and lowering one tends to raise the other, so you aim for the sweet spot that minimizes their sum. You diagnose which you have by comparing training vs validation error, then fix accordingly: add capacity for high bias, add data/regularization for high variance.",
  },
  {
    topic: "Foundations",
    q: "How do you detect and fix overfitting?",
    a: "Detect it by a large gap between training and validation performance — low training error but high validation error. Fixes, roughly in order of reliability: get more or more varied training data; add regularization (L1/L2 penalties, dropout for nets); reduce model complexity; use early stopping; and apply cross-validation so your estimate is honest. I'd also double-check for data leakage, which can masquerade as great training results that collapse in production.",
  },
  {
    topic: "Foundations",
    q: "Why is accuracy often the wrong metric, and what would you use instead?",
    a: "On imbalanced data, accuracy is dominated by the majority class — if 99% of transactions are legitimate, a model that always predicts 'legitimate' is 99% accurate but catches zero fraud. Instead I'd look at precision (of flagged positives, how many are right), recall (of real positives, how many caught), their harmonic mean F1, and AUC or PR-AUC across thresholds. Which to optimize depends on the cost of each error: recall for cancer screening (a miss is deadly), precision for spam filtering (flagging a real email is worse than letting spam through).",
  },
  {
    topic: "Foundations",
    q: "What is regularization and how do L1 and L2 differ?",
    a: "Regularization discourages a model from becoming too complex, trading a little training fit for better generalization. L2 (Ridge) adds a penalty on the sum of squared weights, shrinking them smoothly toward zero and spreading influence across correlated features. L1 (Lasso) penalizes the sum of absolute weights, which drives some weights to exactly zero — so it also performs feature selection, producing sparse models. Elastic Net blends both. In deep learning, dropout and early stopping play a similar role.",
  },
  {
    topic: "Foundations",
    q: "Walk me through how gradient descent works.",
    a: "You define a loss function scoring how wrong the model is, then compute its gradient — the vector of partial derivatives with respect to each weight — which points in the direction of steepest increase. You step the weights in the opposite direction to reduce loss: θ := θ − η·∇J(θ), where η is the learning rate. Repeat until convergence. In practice we use mini-batch gradient descent (a few dozen to a few hundred examples per step) for a balance of speed and stability, often with an adaptive optimizer like Adam.",
  },
  {
    topic: "Foundations",
    q: "What is the learning rate and what happens if it's set wrong?",
    a: "The learning rate η is the step size in gradient descent — the single most impactful hyperparameter. Too small and training crawls or stalls in a poor region; too large and you overshoot the minimum, causing the loss to oscillate or diverge. In practice people use a schedule that starts higher and decays, or an adaptive optimizer (Adam) that scales the step per parameter. If loss isn't going down, the learning rate is my first suspect.",
  },
  {
    topic: "Foundations",
    q: "What is data leakage and how do you prevent it?",
    a: "Data leakage is when information from outside the training set — the test set, or the future — sneaks into training, giving optimistic scores that collapse in production. Common culprits: fitting a scaler or imputer on the whole dataset before splitting, using a feature that encodes the label or is only known after the fact, or letting near-duplicate rows straddle the train/test boundary. Prevent it by splitting first, fitting all preprocessing inside a pipeline on training folds only, and thinking hard about whether each feature would actually be available at prediction time.",
  },
  {
    topic: "Foundations",
    q: "Explain precision vs recall and the tradeoff between them.",
    a: "Precision = TP/(TP+FP): of everything you flagged positive, the fraction that truly is. Recall = TP/(TP+FN): of all actual positives, the fraction you caught. They trade off via the decision threshold — raise it and you flag fewer things, so precision rises but recall falls; lower it and the reverse. F1 balances them in one number. You choose based on which error is costlier: high recall when misses are dangerous (disease, fraud), high precision when false alarms are expensive (spam, content moderation strikes).",
  },
  {
    topic: "Foundations",
    q: "What's the difference between MSE and MAE, and when would you pick each?",
    a: "Both are regression metrics. MSE (mean squared error) squares the errors, so it punishes large errors far more heavily and is sensitive to outliers; it's differentiable everywhere, which is convenient for optimization. MAE (mean absolute error) averages absolute errors, treating all errors linearly, so it's more robust to outliers and directly interpretable in the target's units. Pick MSE/RMSE when big errors are especially bad and the data is clean; pick MAE when outliers are present and you don't want them to dominate.",
  },
  {
    topic: "Foundations",
    q: "Why do we split data into train, validation, and test sets?",
    a: "Each has a distinct job. The training set fits the model's parameters. The validation set is used to tune hyperparameters and pick models — you look at it many times, so it can't be your final judge. The test set is touched exactly once, at the very end, to give an honest estimate of real-world performance. If data is limited, k-fold cross-validation rotates the validation fold to make the estimate more stable while still using all the data. The cardinal rule: never tune on the test set, or it stops being an honest estimate.",
  },
  {
    topic: "Foundations",
    q: "What does AUC measure and when is it not enough?",
    a: "AUC is the area under the ROC curve, which plots true-positive rate against false-positive rate as you sweep the threshold. It's a single, threshold-independent number for how well the model ranks positives above negatives: 1.0 is perfect, 0.5 is random. It's great for comparing classifiers, but on heavily imbalanced data ROC-AUC can look deceptively good because the false-positive rate has a huge negative denominator — there the precision–recall curve (PR-AUC) is more informative, since it focuses on the rare positive class.",
  },
  {
    topic: "Statistics",
    q: "What is a p-value, really?",
    a: "A p-value is the probability of observing a result at least as extreme as the one you got, assuming the null hypothesis is true. Small p-value means your data would be very surprising if there were no real effect, so you reject the null. The critical thing is what it's NOT: it is not the probability that the null hypothesis is true, and not the probability the result was 'due to chance.' It's a statement about the data given the null — P(data this extreme | H₀) — not about the hypothesis given the data. If p is below your significance level α (say 0.05), the result is statistically significant.",
  },
  {
    topic: "Statistics",
    q: "Explain the Central Limit Theorem and why it matters.",
    a: "The Central Limit Theorem says that if you take many independent samples and compute their means, the distribution of those sample means is approximately normal as the sample size grows — usually n≥30 is enough — regardless of the shape of the original population distribution. It matters because it lets us use the well-understood normal distribution to reason about averages even when the underlying data is non-normal or unknown. Nearly all of classical inference — confidence intervals, t-tests, A/B testing — depends on it. It's the answer to 'why can we assume normality here?'",
  },
  {
    topic: "Statistics",
    q: "A disease affects 1% of people and a test is 90% accurate. You test positive — what's the chance you have it?",
    a: "Far lower than 90% — this is the base-rate trap. Take 1,000 people: 10 have the disease and about 9 test positive; 990 don't, but a 10% false-positive rate means about 99 of them also test positive. So of roughly 108 positives, only 9 are real — around 8–16% depending on exact rates. The intuition to state: when the condition is rare, the huge number of healthy people generates so many false positives that they swamp the true positives. It's Bayes' theorem in action, and the same reason precision suffers on imbalanced data.",
  },
  {
    topic: "Statistics",
    q: "What's the difference between correlation and causation, and how do you establish causation?",
    a: "Correlation measures how two variables move together, from −1 to +1, but says nothing about one causing the other. Two variables can correlate because of a confounder — a hidden factor driving both, like hot weather driving both ice-cream sales and drownings — or because of reverse causation, where the direction is opposite to what you assume. To establish causation you generally need a randomized controlled experiment, such as an A/B test: randomization breaks confounding by making the groups comparable, isolating the treatment's effect. When experiments aren't feasible, careful causal-inference methods can help, but they require strong assumptions.",
  },
  {
    topic: "Statistics",
    q: "What are Type I and Type II errors, and what is statistical power?",
    a: "A Type I error is a false positive — rejecting the null hypothesis when it's actually true — and its rate is α, the significance level you set (often 0.05). A Type II error is a false negative — failing to detect a real effect — with rate β. Statistical power is 1−β: the probability of correctly detecting a true effect. Power rises with larger sample sizes and larger true effect sizes, which is why you run a power analysis before an A/B test to decide how much data you need. There's a tradeoff: making α stricter to avoid false positives lowers power, raising the false-negative rate.",
  },
  {
    topic: "Statistics",
    q: "How does minimizing a loss function relate to probability?",
    a: "Most model training is maximum likelihood estimation in disguise. MLE picks the parameters that make the observed data most probable. For classification, minimizing cross-entropy loss is exactly maximizing the likelihood of the correct labels. For regression, minimizing mean squared error is MLE under the assumption of Gaussian noise. And adding an L2 regularization penalty corresponds to putting a Gaussian prior on the weights, which turns it into MAP (maximum a posteriori) estimation. So 'minimize this loss' and 'find the most probable parameters given the data' are usually the same thing — a nice bridge between the optimization and probability views of ML.",
  },
  {
    topic: "Classic ML",
    q: "Why is logistic regression called regression if it's used for classification?",
    a: "Because it's a linear regression model of the log-odds of the positive class. It computes a linear score w·x, then passes it through the sigmoid to produce a probability in (0,1), which you threshold into a class. So the 'regression' is happening in log-odds space; the classification comes from thresholding the resulting probability. It's trained with cross-entropy loss, and its coefficients are interpretable as changes in log-odds — which is why it's still favored in regulated domains.",
  },
  {
    topic: "Classic ML",
    q: "Explain the difference between bagging and boosting.",
    a: "Both are ensemble methods, but they combine models oppositely. Bagging trains many models independently on bootstrap resamples and averages them, which reduces variance — random forests are bagging over decision trees, with random feature subsets added to decorrelate the trees. Boosting trains models sequentially, each one correcting the errors of the ensemble so far, which reduces bias — gradient boosting and XGBoost work this way. Bagging parallelizes and is very robust; boosting usually reaches higher accuracy but is more sensitive to hyperparameters and overfitting.",
  },
  {
    topic: "Classic ML",
    q: "What is the kernel trick in SVMs?",
    a: "An SVM finds the maximum-margin boundary between classes. The kernel trick lets it draw non-linear boundaries by implicitly mapping the data into a higher-dimensional space where a linear separator exists — without ever computing those high-dimensional coordinates. A kernel function (e.g. RBF/Gaussian) computes the inner products in that space directly, so you get the expressive power of high dimensions at the cost of the original ones. It's why SVMs can separate data that isn't linearly separable in its raw form.",
  },
  {
    topic: "Classic ML",
    q: "How do you choose the number of clusters k in k-means?",
    a: "There's no single correct k, so I'd triangulate. Quantitatively: the elbow method (plot within-cluster variance against k and look for the bend where extra clusters stop helping) and the silhouette score (how well-separated the clusters are). I'd also check stability across random initializations (using k-means++). But most importantly I'd anchor k to the business need — if the goal is five marketing segments, k around five is the useful answer even if the metrics are ambiguous.",
  },
  {
    topic: "Deep Learning",
    q: "Explain backpropagation as you would to a smart non-expert.",
    a: "A network makes a prediction (the forward pass) and we measure how wrong it is with a loss. Backpropagation figures out how much each individual weight contributed to that error by applying the chain rule of calculus backward through the layers — from the loss toward the inputs. That gives us a gradient for every weight, and gradient descent nudges each one a little in the direction that reduces the error. The clever part is efficiency: it reuses the gradients from later layers to compute earlier ones, so the whole backward pass costs about the same as one forward pass — which is what makes training deep networks feasible.",
  },
  {
    topic: "Deep Learning",
    q: "Why is ReLU the default activation instead of sigmoid or tanh?",
    a: "Sigmoid and tanh saturate: for large positive or negative inputs they flatten out, so their gradient is nearly zero, and in a deep network those tiny gradients multiply together and vanish — early layers barely learn. ReLU (max(0,x)) has a constant gradient of 1 for positive inputs, so gradients flow through many layers, and it's trivially cheap to compute and produces sparse activations. The tradeoff is 'dying ReLU' — neurons stuck outputting zero — which Leaky ReLU and GELU address; GELU is the common choice in Transformers.",
  },
  {
    topic: "Deep Learning",
    q: "What causes vanishing gradients and how do you fix them?",
    a: "Backprop multiplies gradients across layers; if those terms are consistently less than one — as they are with saturating activations like sigmoid — the product shrinks exponentially toward zero, so early layers stop learning. Fixes: use non-saturating activations (ReLU family), principled initialization (He for ReLU), normalization (batch/layer norm) to keep activations well-scaled, residual/skip connections that give gradients a shortcut path, and for RNNs, gated cells (LSTM/GRU). Exploding gradients — the opposite — are handled with gradient clipping.",
  },
  {
    topic: "Deep Learning",
    q: "How does dropout prevent overfitting?",
    a: "During training, dropout randomly sets a fraction of neurons to zero on each forward pass, so the network can't rely on any single neuron or path and must learn redundant, robust representations. It's effectively training a huge ensemble of sub-networks that share weights, then averaging them at test time (when all neurons are active, scaled appropriately). It's the signature regularizer for deep nets, alongside weight decay, early stopping, and data augmentation.",
  },
  {
    topic: "Transformers",
    q: "Explain self-attention as you'd whiteboard it.",
    a: "Each token is projected into three vectors: a query (what it's looking for), a key (what it offers), and a value (the content it carries). To update a token, I take the dot product of its query with every token's key to get relevance scores, scale by √d for stable gradients, softmax them into weights that sum to one, and take the weighted sum of the values. So each token becomes a blend of the tokens it found relevant. It's 'self'-attention because Q, K, and V all come from the same sequence, so every token can attend to every other — which is how Transformers capture long-range context. The cost is quadratic in sequence length.",
  },
  {
    topic: "Transformers",
    q: "Why did Transformers replace RNNs?",
    a: "Three reasons. First, parallelism: RNNs process a sequence one step at a time because each step depends on the previous hidden state, so you can't parallelize across the sequence; Transformers process all positions at once, which maps perfectly onto GPUs and made internet-scale training feasible. Second, long-range dependencies: attention connects any two tokens directly, whereas RNN information degrades over many steps. Third, that scalability is exactly what unlocked billion-parameter models. The trade is quadratic compute in sequence length, which motivates efficient long-context research.",
  },
  {
    topic: "Transformers",
    q: "What's the difference between BERT and GPT?",
    a: "They're two Transformer families. BERT is an encoder pretrained with masked language modeling — it hides ~15% of tokens and predicts them using context from both sides, so it builds bidirectional representations that excel at understanding tasks like classification, NER, and embeddings. GPT is a decoder pretrained on next-token prediction (causal, left-to-right), which is exactly the skill needed to generate text, so it powers chatbots and code generation. Shorthand: BERT reads (bidirectional, understanding), GPT writes (causal, generation). A third design, encoder-decoder (T5, BART), suits input→output tasks like translation.",
  },
  {
    topic: "Transformers",
    q: "Why do Transformers need positional encodings?",
    a: "Self-attention is order-agnostic — it treats the input as a set of tokens, computing all-pairs relevances with no inherent notion of sequence. Without position information, 'dog bites man' and 'man bites dog' would be indistinguishable. Positional encodings inject each token's position into its representation — via fixed sinusoids in the original paper, or learned or rotary (RoPE) embeddings in modern models — so the model can use word order.",
  },
  {
    topic: "LLMs",
    q: "Walk me through how a modern LLM is trained.",
    a: "Three stages. Pretraining: self-supervised next-token prediction on a massive corpus, which instills grammar, facts, and reasoning and produces a knowledgeable but not instruction-following base model — this is most of the compute. Supervised fine-tuning: train on curated instruction→response pairs so it behaves like a helpful assistant. RLHF: collect human rankings of responses, train a reward model to predict those preferences, then use RL (PPO) to optimize the LLM toward high-reward responses without drifting too far from the SFT model — this aligns it to be helpful, honest, and harmless. DPO is a newer, simpler alternative to the reward-model-plus-RL step.",
  },
  {
    topic: "LLMs",
    q: "When would you use RAG versus fine-tuning?",
    a: "They solve different problems. RAG is for knowledge — when the model needs current, private, or citable facts. You retrieve relevant documents and put them in the prompt, so the model answers from real data; it's cheap, updatable (change the docs, not the model), and can cite sources. Fine-tuning is for behavior — a consistent style, output format, or a specialized task the model struggles to follow via prompting. RAG changes what the model knows; fine-tuning changes how it behaves. They're complementary, and production systems often do both, with prompting as the first thing to try before either.",
  },
  {
    topic: "LLMs",
    q: "Why do LLMs hallucinate, and how do you reduce it?",
    a: "An LLM is trained to produce the most plausible next token, not to state truth — it has no built-in notion of whether something is factually correct, and when it lacks knowledge it will still generate fluent, confident text. To reduce it: ground the model with RAG so it answers from retrieved evidence and cites sources; give it tools (search, calculators, code execution) for verifiable facts; instruct it to say 'I don't know' when the context lacks the answer; lower temperature for factual tasks; and evaluate rigorously with an eval set that probes for fabrication. You reduce hallucination, you don't fully eliminate it — so high-stakes uses need verification.",
  },
  {
    topic: "LLMs",
    q: "How would you evaluate an LLM-powered feature?",
    a: "Because output is open-ended, evaluation is a system, not a single metric. Offline, I'd build a golden eval set of representative and adversarial prompts with expected behavior, run it on every change to catch regressions, and score with a mix of exact metrics where a ground truth exists, LLM-as-judge for scale (validated against human ratings, watching for position/verbosity bias), and periodic human review as the gold standard. Online, I'd track task success, user feedback (thumbs), escalation/deflection rate, and latency/cost, and roll out behind a canary with safety guardrails. The key message: no one number captures quality — you triangulate.",
  },
  {
    topic: "MLOps",
    q: "What's the difference between MLOps and DevOps?",
    a: "MLOps applies DevOps discipline to ML, but an ML system is defined by code + data + model, not just code — and that extra dependency reshapes everything. The same code on different data yields a different model, so you version datasets, not only code. Models decay as the world drifts, so the lifecycle includes continuous monitoring and retraining (a third pillar, continuous training, alongside CI/CD). Reproducibility needs the exact code, data, config, and environment together. So MLOps adds data/model versioning, experiment tracking, feature stores, and model monitoring on top of standard DevOps.",
  },
  {
    topic: "MLOps",
    q: "How do you monitor a model in production, and what is drift?",
    a: "The trap is monitoring only latency and errors — a model can be perfectly 'up' while its accuracy quietly collapses. So beyond operational metrics, I monitor input feature distributions against a training baseline (using PSI or KL divergence) to catch data drift — a shift in P(X) detectable without labels — and, wherever ground-truth labels arrive, live model quality to catch concept drift, where the input→output relationship P(y|X) changes so the same features mean something new. When drift crosses a threshold I retrain on fresh data and redeploy, validating the new model against the current one before promoting — ideally automated as continuous training.",
  },
  {
    topic: "MLOps",
    q: "How would you safely roll out a new model to production?",
    a: "In stages, optimizing for safety and evidence over speed. First a shadow deployment: run the new model on real traffic but don't act on its outputs, just log and compare — zero user risk, validates behavior and latency at scale. Then a canary: route a small slice of traffic, say 5%, watching guardrail metrics like latency and error rate. Then a properly-powered A/B test splitting traffic between the old (control) and new (treatment) models, measuring the actual business metric with a pre-registered sample size and stopping rule so I'm not fooled by peeking. Finally full rollout once it wins, with instant rollback ready. The point is that offline metrics only prove predictive quality; the live business metric is the truth.",
  },
  {
    topic: "System Design",
    q: "How do you approach an ML system design question like 'design a video recommender'?",
    a: "I'd follow a framework and think out loud. First clarify and scope — goal, scale (users, items, QPS), latency budget, constraints — and reframe it as a concrete ML problem; this step is the most under-done and most rewarded. Then define success: offline metrics like NDCG/precision@k and, crucially, online metrics like watch-time or retention validated by A/B test. Then data and labels (implicit feedback like clicks/watch-time, plus a cold-start plan), features (user/item/context/interaction, watching for leakage), and the model — starting from a simple baseline before adding complexity. For serving at scale I'd use the two-stage pattern: cheap candidate generation via approximate nearest-neighbor retrieval over embeddings to shortlist a few hundred items, then a rich ranking model to order them, plus re-ranking for diversity. Finally monitoring, feedback loops, and retraining. The interviewer is grading structure and tradeoffs, not a memorized architecture.",
  },
  {
    topic: "System Design",
    q: "Why are production recommendation systems built in two stages?",
    a: "You can't afford to score millions of candidate items with a heavy model on every request within a tight latency budget. So you split the work: candidate generation (retrieval) cheaply narrows millions of items to a few hundred plausible ones — typically approximate nearest-neighbor search over learned embeddings, optimized for recall and speed — and then a ranking model applies many features to precisely order just those few hundred, optimizing precision at the top. A final re-ranking step adds diversity, freshness, and business rules. This retrieval-then-ranking split is how recommenders scale while staying fast.",
  },
  {
    topic: "Coding",
    q: "Why is vectorization important, and how would you speed up a slow Python ML loop?",
    a: "Explicit Python loops are slow because each iteration goes through the interpreter. Vectorization replaces them with NumPy array operations that execute in optimized, compiled C over the whole array at once — often 10 to 100 times faster — and the code is shorter and clearer. So to speed up a slow loop I'd express the computation as array operations: replace a per-element sum-of-squares with np.sum(arr**2), a distance loop with np.linalg.norm, and use broadcasting to apply per-column operations across all rows without looping. If it still needs to scale, I'd look at chunking, better algorithms/data structures, or tools like Numba, but vectorization is the first and biggest win.",
  },
  {
    topic: "Coding",
    q: "How would you implement k-means from scratch?",
    a: "k-means alternates two steps until convergence. First initialize k centroids (randomly, or better, k-means++). Then repeat: the assignment step labels each point by its nearest centroid — I'd compute the distance from every point to every centroid and take the argmin, vectorized with broadcasting; and the update step moves each centroid to the mean of the points assigned to it. I stop when the centroids stop moving (or hit a max iteration count). Edge cases to mention: an empty cluster (keep the old centroid or reinitialize), feature scaling beforehand since it's distance-based, and sensitivity to initialization, which is why you run it several times or use k-means++.",
  },
  {
    topic: "Coding",
    q: "What's the time complexity of brute-force k-NN, and why does it matter?",
    a: "For a single query it's O(n·d) — you compute the distance to all n training points, each of dimension d — and O(k) or O(n log n) to pick the k smallest depending on method. Over m queries it's O(m·n·d), which becomes prohibitive at scale. That's exactly why production systems don't do brute-force nearest-neighbor: they use approximate nearest-neighbor indexes like HNSW or IVF (the same structures behind vector databases in RAG) to trade a little accuracy for massive speedups. Connecting the complexity to why ANN indexes exist is the point I'd make.",
  },
  {
    topic: "Coding",
    q: "How do you approach a live coding problem you're unsure how to solve?",
    a: "I keep communicating and work structurally rather than freezing. First I clarify the problem, input sizes, and edge cases so I'm solving the right thing. Then I state a brute-force baseline out loud, even a slow one, and its complexity — a working slow solution beats a stuck perfect one — and I look for the bottleneck to optimize, often with a hash map for O(1) lookups or a heap for top-k. I code cleanly while narrating my reasoning so the interviewer can nudge me, then test with a normal case and edge cases like empty input or duplicates. The round grades problem-solving and communication as much as the final code, so thinking aloud is essential even when I'm unsure.",
  },
  {
    topic: "Responsible AI",
    q: "How can an ML model be biased, and how would you detect and mitigate it?",
    a: "Models learn bias from data and design choices: historical/label bias (training on past discriminatory decisions), sampling bias (some groups under-represented so accuracy is worse for them), proxy bias (features like ZIP code standing in for race), and feedback loops (the model's decisions shaping future data). Detecting it means measuring outcomes across groups — not just overall accuracy — using fairness metrics like differences in true-positive/false-positive rates. Crucially, just dropping the protected attribute doesn't work because other features proxy for it. To mitigate: pre-processing (reweight/rebalance data), in-processing (fairness constraints in the objective), or post-processing (per-group thresholds), plus governance — audits, model cards, and human oversight for high-stakes decisions. I'd also note that fairness definitions can conflict, so it's a contextual choice.",
  },
  {
    topic: "Responsible AI",
    q: "What's the difference between SHAP and LIME?",
    a: "Both are model-agnostic, post-hoc explainability methods that attribute a prediction to input features without changing the model. LIME explains a single prediction by perturbing the input, observing how the output changes, and fitting a simple interpretable model — like a local linear one — around that point; it's fast and intuitive but can be unstable. SHAP is grounded in cooperative game theory: it computes Shapley values that fairly divide the prediction among features, with consistency guarantees (the contributions sum to the prediction), and it can aggregate into global feature importance. SHAP is more principled and stable but more computationally expensive. In short: LIME is a fast local surrogate; SHAP is a principled game-theoretic attribution.",
  },
  {
    topic: "Responsible AI",
    q: "What is prompt injection and how do you defend against it?",
    a: "Prompt injection is when malicious instructions are smuggled into an LLM's context — either directly by a user or indirectly through content the system retrieves, like a web page or document in a RAG pipeline — and hijack the model's behavior. It's fundamentally hard to eliminate because the model sees everything as text and can't reliably distinguish trusted instructions from untrusted data. Indirect injection is especially dangerous because the attack hides in retrieved content. Defense is layered: give the model's tools least privilege so a hijack can do limited damage, isolate and clearly delimit untrusted input, validate and sandbox any output before acting on it (never pass raw LLM output to a shell or database), filter inputs and outputs, and red-team the system. There's no single fix — it's defense in depth.",
  },
  {
    topic: "Behavioral",
    q: "Tell me about a time a model or project failed.",
    a: "The structure I'd use: own the failure plainly without deflecting, give the real root cause both technically and in process, describe the fix, and — most importantly — the systemic change that prevents recurrence, then the lesson. For example: a model's accuracy degraded in production for weeks before we noticed because we'd shipped without a drift monitor — we were only watching latency and errors. The root cause was a data-drift problem plus a monitoring gap. I retrained on fresh data to recover, but the durable fix was adding input-distribution and prediction-quality monitoring with alerts, so degradation can't go unnoticed again. The lesson: a model isn't 'done' at deploy — production ML is a loop, and you monitor prediction quality, not just uptime. Ending on a systemic fix is what makes a failure story land.",
  },
  {
    topic: "Behavioral",
    q: "How do you prioritize what to work on when everything is uncertain?",
    a: "I anchor decisions to the business metric rather than personal preference, and I make tradeoffs explicit — naming what I gain and give up. I favor the cheapest, most reversible experiment that reduces the biggest uncertainty first, which usually means shipping a simple baseline before investing in a complex model, since the baseline often reveals whether the hard work is even worth it. And I communicate the tradeoffs to stakeholders rather than deciding in a vacuum, so priorities are aligned. Concretely: quantify expected impact and effort, de-risk with quick experiments, and revisit as data comes in.",
  },
];
