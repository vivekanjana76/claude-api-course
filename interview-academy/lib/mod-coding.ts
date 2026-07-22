import type { Module } from "./types";

export const coding: Module = {
  id: "coding",
  title: "ML Coding & Python",
  blurb:
    "The coding round that gates most AI roles. Fluent NumPy and pandas, implementing core algorithms from scratch (gradient descent, k-means), and reasoning about complexity — with real code you can read and reproduce.",
  accent: "amber",
  lessons: [
    {
      slug: "python-numpy-pandas",
      title: "Python, NumPy & pandas for ML",
      summary:
        "The everyday toolkit — why vectorization matters, broadcasting, and the pandas operations that come up in take-homes and data-manipulation screens.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Most AI coding rounds are in **Python**, and they assume fluency with **NumPy** (numerical arrays) and **pandas** (tabular data). You don't need exotic tricks — you need to write clean, *vectorized* code and manipulate data without fumbling. This lesson covers what actually shows up." },
        { type: "h2", text: "Vectorization: the #1 expectation" },
        { type: "p", text: "Explicit Python loops over data are slow. **Vectorization** replaces them with array operations that run in optimized C under the hood — often 10–100× faster. Interviewers notice immediately whether you reach for a loop or an array operation." },
        { type: "code", lang: "python", caption: "Loop vs vectorized — always prefer the second", code: "# Slow: explicit Python loop\ntotal = 0\nfor x in data:\n    total += x * x\n\n# Fast: vectorized with NumPy\nimport numpy as np\narr = np.array(data)\ntotal = np.sum(arr ** 2)      # runs in optimized C\n\n# Euclidean distance, vectorized\ndist = np.sqrt(np.sum((a - b) ** 2))" },
        { type: "h2", text: "Broadcasting" },
        { type: "p", text: "**Broadcasting** lets NumPy combine arrays of different shapes without explicit loops by 'stretching' the smaller one. It's how you standardize features or add a bias in one line — and a favorite thing to test." },
        { type: "code", lang: "python", caption: "Broadcasting: standardize each column", code: "# X is (n_samples, n_features)\nmu = X.mean(axis=0)          # shape (n_features,)\nsigma = X.std(axis=0)        # shape (n_features,)\nX_scaled = (X - mu) / sigma  # broadcasts row-wise over n_samples" },
        { type: "h2", text: "pandas essentials" },
        { type: "p", text: "Data-manipulation screens lean on a handful of pandas operations. Know these cold:" },
        { type: "code", lang: "python", caption: "The pandas operations that recur", code: "import pandas as pd\n\ndf.groupby('user')['spend'].sum()          # aggregate per group\ndf.merge(other, on='user_id', how='left')  # SQL-style join\ndf['col'].fillna(df['col'].median())       # handle missing values\ndf.sort_values('score', ascending=False)   # rank\ndf.pivot_table(index='day', columns='type', values='n', aggfunc='sum')\ndf[df['age'] > 30]                          # boolean filtering" },
        { type: "callout", kind: "tip", text: "For data questions, think in three verbs: filter (boolean masks), group (groupby + aggregate), and join (merge). Most 'clean/summarize this dataset' tasks are a composition of those, plus handling missing values. Narrate which you're using and why." },
        { type: "callout", kind: "warn", text: "Two habits interviewers penalize: reaching for a for-loop where a vectorized op exists, and mutating data with chained indexing (df[a][b] = ...) instead of .loc. Use df.loc[mask, 'col'] = value for safe assignment." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**NumPy** = the array/linear-algebra library. **pandas** = the DataFrame library for tabular data. **Vectorization** = using array ops instead of Python loops for speed. **Broadcasting** = auto-aligning array shapes in an operation. **axis=0/1** = operate down columns / across rows. **groupby** = split-apply-combine aggregation." },
      ],
      takeaways: [
        "Coding rounds are Python + NumPy + pandas; the top expectation is vectorized code, not explicit loops.",
        "Broadcasting aligns different-shaped arrays without loops — the one-liner behind feature standardization and bias adds.",
        "pandas data tasks reduce to filter (boolean masks), group (groupby + aggregate), and join (merge), plus missing-value handling.",
        "Avoid chained-indexing assignment; use .loc for safe writes.",
      ],
      flashcards: [
        { front: "Why is vectorization important in ML coding?", back: "Array operations (NumPy) run in optimized C and are often 10–100× faster than Python loops. Interviewers expect vectorized code and notice when you loop unnecessarily." },
        { front: "What is broadcasting?", back: "NumPy automatically 'stretching' a smaller array to match a larger one's shape in an operation, so e.g. (X - X.mean(axis=0)) subtracts the column means from every row without a loop." },
        { front: "The three verbs for a pandas data task", back: "Filter (boolean masks), group (groupby + aggregate), and join (merge) — plus handling missing values. Most data-cleaning/summary tasks compose these." },
      ],
      quiz: [
        { q: "The single biggest thing interviewers look for in ML coding is…", options: ["Clever one-liners", "Vectorized code instead of Python loops", "Using recursion", "Custom C extensions"], answer: 1, explain: "Vectorized NumPy/pandas operations are fast and idiomatic; unnecessary loops are a red flag." },
        { q: "`(X - X.mean(axis=0)) / X.std(axis=0)` relies on…", options: ["Recursion", "Broadcasting", "A for-loop", "SQL"], answer: 1, explain: "The per-column mean/std (shape n_features) broadcast across all rows to standardize each column." },
        { q: "To aggregate total spend per user in pandas you'd use…", options: ["df.sort_values", "df.groupby('user')['spend'].sum()", "df.merge", "df.fillna"], answer: 1, explain: "groupby splits by user, then sum aggregates the spend within each group." },
      ],
    },
    {
      slug: "implementing-algorithms",
      title: "Implementing algorithms from scratch",
      summary:
        "A common coding-round ask: code a core ML algorithm without a library. Worked, runnable implementations of gradient-descent linear regression and k-means.",
      minutes: 12,
      blocks: [
        { type: "p", text: "'Implement linear regression / k-means / k-NN from scratch' is a staple coding question. It checks that you understand the algorithm mechanically, not just as a `.fit()` call. Here are the two most-asked, written cleanly." },
        { type: "h2", text: "Linear regression via gradient descent" },
        { type: "p", text: "This directly exercises the training loop from the foundations module: predict, compute the gradient of MSE, step the weights. Note the fully vectorized gradient." },
        { type: "code", lang: "python", caption: "Linear regression with gradient descent", code: "import numpy as np\n\ndef fit_linear(X, y, lr=0.01, epochs=1000):\n    n, d = X.shape\n    w = np.zeros(d)\n    b = 0.0\n    for _ in range(epochs):\n        y_pred = X @ w + b                 # forward pass\n        error = y_pred - y                 # residuals\n        # gradients of mean squared error\n        grad_w = (2 / n) * (X.T @ error)\n        grad_b = (2 / n) * error.sum()\n        w -= lr * grad_w                   # gradient step\n        b -= lr * grad_b\n    return w, b\n\ndef predict(X, w, b):\n    return X @ w + b" },
        { type: "callout", kind: "tip", text: "Talking points while you code this: the learning rate controls step size (too high diverges), features should be scaled first so gradients are balanced, and `X @ w` is the vectorized dot product replacing a per-sample loop. Mentioning these unprompted signals real understanding." },
        { type: "h2", text: "k-means clustering" },
        { type: "p", text: "The other classic. It's the assign-then-update loop from the classic-ML module, in code." },
        { type: "code", lang: "python", caption: "k-means clustering", code: "import numpy as np\n\ndef kmeans(X, k, iters=100, seed=0):\n    rng = np.random.default_rng(seed)\n    # k-means++ style would be better; random init for brevity\n    centroids = X[rng.choice(len(X), k, replace=False)]\n    for _ in range(iters):\n        # assign: distance from each point to each centroid\n        dists = np.linalg.norm(X[:, None] - centroids[None], axis=2)\n        labels = dists.argmin(axis=1)\n        # update: move each centroid to its cluster's mean\n        new_centroids = np.array([\n            X[labels == j].mean(axis=0) if np.any(labels == j)\n            else centroids[j]\n            for j in range(k)\n        ])\n        if np.allclose(new_centroids, centroids):\n            break                          # converged\n        centroids = new_centroids\n    return labels, centroids" },
        { type: "callout", kind: "key", text: "The pattern for any 'from scratch' question: (1) state the algorithm's steps in one sentence, (2) write the loop with a clear stopping condition, (3) vectorize the inner computation, (4) mention edge cases — empty clusters here, feature scaling and learning rate for gradient descent. Structure beats speed." },
        { type: "h2", text: "Also worth being able to write" },
        { type: "list", items: [
          "**k-NN** — compute distances to all training points, take the k smallest, majority-vote the labels.",
          "**Sigmoid + logistic regression** — same loop as above with `sigmoid(X @ w)` and a cross-entropy gradient.",
          "**Train/test split & a metric** — e.g. accuracy or MSE by hand, since some screens forbid sklearn.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**From scratch** = without ML libraries like scikit-learn (NumPy is usually allowed). **@ operator** = matrix multiplication in NumPy. **Convergence check** = stopping when updates become negligible. **Epoch** = one full pass over the data. **k-means++** = a smarter centroid initialization that speeds convergence." },
      ],
      takeaways: [
        "'Implement X from scratch' checks mechanical understanding — practice linear regression (gradient descent) and k-means until fluent.",
        "Linear regression: predict (X@w+b), compute the vectorized MSE gradient, step the weights; scale features and mind the learning rate.",
        "k-means: assign points to nearest centroid, update centroids to cluster means, repeat until convergence; handle empty clusters.",
        "The winning pattern: state the steps, write a clear loop with a stopping condition, vectorize the inner computation, and call out edge cases.",
      ],
      flashcards: [
        { front: "The gradient-descent loop for linear regression", back: "Repeat: y_pred = X@w+b; error = y_pred−y; grad_w = (2/n)·Xᵀ·error; grad_b = (2/n)·Σerror; then w −= lr·grad_w, b −= lr·grad_b. Scale features first." },
        { front: "The two repeating steps of k-means in code", back: "Assign: label each point by the nearest centroid (argmin of distances). Update: set each centroid to the mean of its assigned points. Stop when centroids stop moving." },
        { front: "How to structure any 'from scratch' answer", back: "State the algorithm's steps in a sentence, write the loop with a clear stopping condition, vectorize the inner computation, and mention edge cases (empty clusters, scaling, learning rate)." },
      ],
      quiz: [
        { q: "In the linear-regression gradient step, `w -= lr * grad_w` does what?", options: ["Increases the loss", "Moves weights opposite the gradient to reduce loss", "Randomizes weights", "Normalizes features"], answer: 1, explain: "Gradient descent steps parameters opposite the gradient, scaled by the learning rate, to lower the loss." },
        { q: "In k-means, the 'update' step sets each centroid to…", options: ["A random point", "The mean of the points assigned to it", "The farthest point", "The median feature"], answer: 1, explain: "Each centroid moves to the average of its currently assigned cluster members." },
        { q: "A robust 'from scratch' implementation should always include…", options: ["A GUI", "A clear stopping/convergence condition", "Multithreading", "A database"], answer: 1, explain: "Iterative algorithms need a stopping condition (max iters and/or convergence) to terminate correctly." },
      ],
    },
    {
      slug: "complexity-and-the-coding-round",
      title: "Complexity & acing the coding round",
      summary:
        "Reasoning about time and space with Big-O, the data structures that matter for ML, and a strategy for the live coding interview that holds up under pressure.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Beyond writing correct code, interviews test whether you can reason about **efficiency** and conduct yourself well live. Big-O and a calm process are what separate a pass from a fail even when the code works." },
        { type: "h2", text: "Big-O notation" },
        { type: "p", text: "**Big-O** describes how an algorithm's running time (or memory) grows as the input size `n` grows. You should be able to state the complexity of what you write and spot expensive operations." },
        { type: "diagram", name: "big-o", caption: "How common complexities scale — O(n²) explodes while O(log n) barely moves." },
        { type: "compare", caption: "The complexities you must recognize.", columns: ["Big-O", "Name", "Example"], rows: [
          { label: "O(1)", cells: ["Constant", "Dict/hash lookup"] },
          { label: "O(log n)", cells: ["Logarithmic", "Binary search"] },
          { label: "O(n)", cells: ["Linear", "One pass over the data"] },
          { label: "O(n log n)", cells: ["Log-linear", "Efficient sorting"] },
          { label: "O(n²)", cells: ["Quadratic", "Naive all-pairs (e.g. brute-force kNN, self-attention)"] },
        ]},
        { type: "callout", kind: "tip", text: "Tie it to ML you know: brute-force k-NN is O(n·d) per query and self-attention is O(n²) in sequence length — which is exactly why approximate nearest-neighbor indexes and efficient-attention research exist. Connecting complexity to real ML systems is a strong signal." },
        { type: "h2", text: "Data structures that matter" },
        { type: "list", items: [
          "**Hash map / set (dict, set)** — O(1) lookup; the workhorse for counting, deduping, and caching.",
          "**Arrays / NumPy arrays** — contiguous, cache-friendly, vectorizable; the default for numerical data.",
          "**Heap / priority queue** — for top-k problems (the k nearest, the k most frequent) in O(n log k).",
          "**Two pointers / sliding window** — for ordered-array and subarray questions common in screens.",
        ]},
        { type: "h2", text: "A strategy for the live round" },
        { type: "steps", items: [
          { title: "Clarify first", text: "Restate the problem, ask about input size, edge cases, and constraints. Never start coding on assumptions." },
          { title: "Talk through the approach", text: "State a plan and its complexity before coding; propose a brute-force baseline, then optimize. Get a nod." },
          { title: "Code cleanly, thinking aloud", text: "Write readable code and narrate your reasoning so the interviewer follows and can nudge you." },
          { title: "Test with examples", text: "Walk through a normal case and edge cases (empty input, one element, duplicates) by hand." },
          { title: "State complexity & improvements", text: "Give the time/space Big-O and mention what you'd optimize with more time." },
        ]},
        { type: "callout", kind: "key", text: "The meta-point: the coding round grades your problem-solving process and communication as much as the final code. A candidate who clarifies, plans out loud, and tests methodically beats one who silently writes correct-but-unexplained code. Think aloud — a stuck-but-communicating candidate still scores." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Big-O** = asymptotic growth of time/space with input size. **Constant/linear/quadratic** = O(1)/O(n)/O(n²). **Hash map** = O(1)-lookup key→value store (Python dict). **Heap** = a tree structure for fast min/max — used for top-k. **Sliding window** = a moving subarray technique. **Edge case** = an unusual input (empty, single, duplicates) that breaks naive code." },
      ],
      takeaways: [
        "Big-O describes how time/space scale with input size; be able to state the complexity of your code and spot expensive ops.",
        "Connect complexity to ML: brute-force kNN is O(n·d) and self-attention O(n²) — the reason ANN indexes and efficient attention exist.",
        "Know hash maps (O(1) lookup), arrays, heaps (top-k), and two-pointer/sliding-window patterns.",
        "In the live round: clarify → plan aloud with complexity → code cleanly thinking aloud → test edge cases → state Big-O. Communication is graded.",
      ],
      flashcards: [
        { front: "What is Big-O notation?", back: "A description of how an algorithm's running time or memory grows with input size n — O(1) constant, O(log n), O(n), O(n log n), O(n²) — used to compare efficiency." },
        { front: "Why is self-attention O(n²)?", back: "Every token attends to every other token, so the number of pairwise comparisons grows with the square of the sequence length — the motivation for efficient-attention research." },
        { front: "The five steps of a strong live coding round", back: "Clarify the problem, plan the approach aloud with its complexity, code cleanly while thinking aloud, test normal + edge cases by hand, then state the Big-O and possible improvements." },
      ],
      quiz: [
        { q: "Binary search over a sorted array is…", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 1, explain: "Each step halves the search space, giving logarithmic time." },
        { q: "For a 'find the k most frequent items' problem, the ideal data structure is a…", options: ["Linked list", "Heap (priority queue)", "Stack", "Queue"], answer: 1, explain: "A heap maintains the top-k efficiently in O(n log k)." },
        { q: "In a live coding round, before writing code you should first…", options: ["Optimize prematurely", "Clarify the problem and state your approach with its complexity", "Write tests only", "Ask for the answer"], answer: 1, explain: "Clarifying and planning aloud (with complexity) prevents solving the wrong problem and shows structured thinking." },
      ],
    },
  ],
};
