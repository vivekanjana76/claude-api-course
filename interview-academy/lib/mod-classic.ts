import type { Module } from "./types";

export const classic: Module = {
  id: "classic",
  title: "Classic ML Algorithms",
  blurb:
    "The models that still win most tabular problems — and the 'explain algorithm X' questions that dominate applied-ML screens. Regression, trees and ensembles, margin and distance methods, and unsupervised learning.",
  accent: "teal",
  lessons: [
    {
      slug: "linear-and-logistic-regression",
      title: "Linear & logistic regression",
      summary:
        "The two workhorses every interview assumes you know cold — how they work, why logistic regression is a classifier despite its name, and how to read their coefficients.",
      minutes: 10,
      blocks: [
        { type: "p", text: "**Linear regression** and **logistic regression** are the foundation of applied ML: simple, fast, interpretable, and a mandatory baseline before anything fancier. Interviewers use them to check that you understand what a model actually *is* before layering on complexity." },
        { type: "h2", text: "Linear regression" },
        { type: "p", text: "Predicts a continuous target as a weighted sum of features: `ŷ = w₀ + w₁x₁ + … + wₙxₙ`. Training finds the weights that minimize **mean squared error**, either via a closed-form solution (the normal equation) or gradient descent for large data. Each coefficient `wᵢ` has a clean interpretation: the expected change in `y` per one-unit change in `xᵢ`, holding others fixed." },
        { type: "list", items: [
          "**Assumptions** interviewers probe: a roughly linear relationship, independent errors, constant error variance (homoscedasticity), and low multicollinearity among features.",
          "**Multicollinearity** — when features are highly correlated, coefficients become unstable and hard to interpret. Detect with VIF; fix by dropping/combining features or using regularization.",
          "**Regularized variants** — Ridge (L2) and Lasso (L1) add a penalty on weight size to curb overfitting; Lasso also zeros weights for feature selection.",
        ]},
        { type: "h2", text: "Logistic regression" },
        { type: "p", text: "Despite the name, it's a **classification** algorithm. It computes the same linear score, then squashes it through the **sigmoid** function into a probability between 0 and 1: `p = σ(w·x)`. You threshold that probability (usually at 0.5) to get a class. It's trained by minimizing **cross-entropy (log) loss**, not MSE." },
        { type: "diagram", name: "activations", caption: "The sigmoid (center) turns any real score into a 0–1 probability — the heart of logistic regression." },
        { type: "callout", kind: "key", text: "Why sigmoid + cross-entropy and not a straight line + MSE? A linear output isn't a valid probability (it can exceed [0,1]), and MSE on a sigmoid gives a non-convex, hard-to-optimize surface. Cross-entropy is convex for logistic regression and penalizes confident wrong predictions correctly." },
        { type: "h2", text: "Reading the coefficients" },
        { type: "p", text: "In logistic regression, a coefficient is the change in the **log-odds** of the positive class per unit of the feature; exponentiate it to get an **odds ratio**. This interpretability is why logistic regression remains popular in regulated fields (finance, medicine) where you must explain *why* a decision was made." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Sigmoid / logistic function** = σ(z)=1/(1+e⁻ᶻ), an S-curve mapping any number to (0,1). **Odds** = p/(1−p); **log-odds (logit)** = its log, which logistic regression models linearly. **Homoscedasticity** = errors have constant variance. **Multicollinearity** = features that are strongly correlated with each other. **Closed-form solution** = a direct formula for the answer, no iterative training." },
        { type: "callout", kind: "tip", text: "Great interview line: 'Logistic regression is a linear model for the log-odds.' It shows you understand the linearity is in the logit space, and explains both its interpretability and its limitation — it can only draw linear decision boundaries." },
      ],
      takeaways: [
        "Linear regression predicts a continuous target as a weighted sum, minimizing MSE; coefficients read as effect-per-unit.",
        "Logistic regression is a classifier: a linear score passed through a sigmoid to a probability, trained with cross-entropy.",
        "Both are interpretable, fast, and the mandatory baseline; regularization (Ridge/Lasso) controls overfitting.",
        "Their boundaries are linear — a strength for interpretability, a limitation for complex patterns.",
      ],
      flashcards: [
        { front: "Why is logistic regression a classifier, not regression?", back: "It passes a linear score through a sigmoid to output a probability (0–1), then thresholds it into a class. It's a linear model for the log-odds." },
        { front: "Which loss trains logistic regression, and why not MSE?", back: "Cross-entropy (log loss). MSE on a sigmoid is non-convex and hard to optimize; cross-entropy is convex and penalizes confident wrong probabilities correctly." },
        { front: "What is multicollinearity and why does it matter?", back: "Highly correlated features make regression coefficients unstable and hard to interpret. Detect with VIF; fix by removing/combining features or regularizing." },
      ],
      quiz: [
        { q: "Logistic regression outputs…", options: ["A continuous unbounded value", "A probability via the sigmoid function", "A cluster assignment", "A distance"], answer: 1, explain: "It squashes the linear score through a sigmoid into a probability between 0 and 1." },
        { q: "The decision boundary of plain logistic regression is…", options: ["Always non-linear", "Linear in the feature space", "A circle", "Undefined"], answer: 1, explain: "It's linear in the features (linear in log-odds), which is both its interpretability strength and its expressiveness limitation." },
        { q: "Lasso (L1) regression is often preferred when you want to…", options: ["Keep all features", "Perform automatic feature selection", "Increase multicollinearity", "Avoid any regularization"], answer: 1, explain: "L1 drives some coefficients exactly to zero, effectively selecting a subset of features." },
      ],
    },
    {
      slug: "trees-and-ensembles",
      title: "Decision trees & ensembles",
      summary:
        "Why a single tree overfits, and how bagging (random forests) and boosting (XGBoost) turn weak trees into the models that win most tabular competitions.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Tree-based models are the reliable champions of **tabular data** — the most common data type in industry. Expect to compare random forests and gradient boosting, and to explain the bagging-vs-boosting distinction precisely." },
        { type: "h2", text: "Decision trees" },
        { type: "p", text: "A **decision tree** repeatedly splits the data on the feature and threshold that best separate the target, forming a tree of if-then questions. Splits are chosen to maximize purity — using **Gini impurity** or **entropy/information gain** for classification, variance reduction for regression." },
        { type: "list", items: [
          "**Pros** — interpretable, handle non-linear relationships and feature interactions, need no feature scaling, and mix numeric and categorical data.",
          "**Con** — a single deep tree **overfits** badly: it can memorize the training set. Pruning and depth limits help, but the real fix is ensembles.",
        ]},
        { type: "diagram", name: "overfitting", caption: "A single unpruned tree is the classic high-variance overfitter (right panel) — ensembles tame that variance." },
        { type: "h2", text: "Bagging → Random Forests" },
        { type: "p", text: "**Bagging** (bootstrap aggregating) trains many models on random resamples of the data and averages them, which **reduces variance**. A **random forest** is bagging applied to trees, with an extra twist: each split considers only a random subset of features, which **decorrelates** the trees so averaging helps more. Trees train independently, so it parallelizes well." },
        { type: "h2", text: "Boosting → Gradient Boosting / XGBoost" },
        { type: "p", text: "**Boosting** builds trees **sequentially**, each new tree correcting the errors (residuals) of the ensemble so far. This primarily **reduces bias** and typically achieves higher accuracy than random forests — at the cost of being sequential and more sensitive to hyperparameters. **XGBoost**, **LightGBM**, and **CatBoost** are the dominant implementations." },
        { type: "compare", caption: "The bagging vs boosting distinction interviewers want to hear.", columns: ["", "Bagging (Random Forest)", "Boosting (XGBoost)"], rows: [
          { label: "Trees are built", cells: ["Independently, in parallel", "Sequentially, each fixing the last"] },
          { label: "Mainly reduces", cells: ["Variance", "Bias"] },
          { label: "Overfitting risk", cells: ["Lower, very robust", "Higher — needs careful tuning"] },
          { label: "Typical use", cells: ["Strong, low-effort baseline", "Squeezing out top accuracy"] },
        ]},
        { type: "callout", kind: "key", text: "One-liner: bagging trains independent trees in parallel to cut variance; boosting trains dependent trees in sequence to cut bias. Random forest is bagging; XGBoost is boosting. Boosting usually wins on accuracy but overfits more easily." },
        { type: "callout", kind: "tip", text: "Asked 'what model would you try first on a tabular problem?', a strong answer is: 'A gradient-boosted tree like XGBoost or LightGBM — it's the reliable top performer on tabular data — with a random forest or logistic regression as a sanity-check baseline.'" },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Impurity (Gini/entropy)** = how mixed the class labels are in a node; splits reduce it. **Bootstrap** = sampling the data with replacement to make varied training sets. **Residual** = the error left over that the next boosting tree tries to predict. **Weak learner** = a simple model (a shallow tree) that's only slightly better than chance — boosting combines many into a strong one." },
      ],
      takeaways: [
        "A single decision tree is interpretable but overfits; ensembles fix that.",
        "Bagging (random forests) trains independent trees in parallel to reduce variance — robust with little tuning.",
        "Boosting (XGBoost/LightGBM) trains trees sequentially to reduce bias — usually higher accuracy but needs careful tuning.",
        "Gradient-boosted trees are the go-to first model for most tabular problems.",
      ],
      flashcards: [
        { front: "Bagging vs boosting in one line", back: "Bagging: independent trees in parallel, averaged to reduce variance (random forest). Boosting: sequential trees each correcting the last, to reduce bias (XGBoost)." },
        { front: "Why does a random forest add feature randomness on top of bagging?", back: "To decorrelate the trees. If all trees keep splitting on the same dominant feature, averaging helps little; random feature subsets make trees diverse so averaging cuts variance." },
        { front: "What does each boosting tree try to predict?", back: "The residual errors of the current ensemble — each new tree focuses on what the previous ones got wrong." },
      ],
      quiz: [
        { q: "Random forests primarily reduce which source of error?", options: ["Bias", "Variance", "Irreducible noise", "Label error"], answer: 1, explain: "Averaging many decorrelated trees reduces variance — the overfitting of a single deep tree." },
        { q: "In gradient boosting, trees are trained…", options: ["Independently in parallel", "Sequentially, each correcting prior errors", "On separate features only", "Without any target"], answer: 1, explain: "Boosting is sequential: each tree fits the residual errors of the ensemble so far, reducing bias." },
        { q: "For a typical tabular dataset, a strong first model to try is…", options: ["A deep neural network", "A gradient-boosted tree (XGBoost/LightGBM)", "k-means", "PCA"], answer: 1, explain: "Gradient-boosted trees are the reliable top performers on tabular data." },
      ],
    },
    {
      slug: "svm-knn-naive-bayes",
      title: "SVM, kNN & Naive Bayes",
      summary:
        "Three more staples with very different philosophies — maximum-margin boundaries, lazy distance-based prediction, and fast probabilistic classification.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Beyond regression and trees, three algorithms round out the classic toolkit and show up in 'compare these' questions. Each embodies a different idea about how to classify." },
        { type: "h2", text: "Support Vector Machines (SVM)" },
        { type: "p", text: "An SVM finds the decision boundary (hyperplane) that **maximizes the margin** — the distance to the nearest points of each class, called **support vectors**. A wide margin tends to generalize well. The famous **kernel trick** implicitly maps data into a higher-dimensional space so a linear boundary there becomes a curved boundary in the original space — letting SVMs handle non-linear problems without explicitly computing those dimensions." },
        { type: "list", items: [
          "**Strengths** — effective in high-dimensional spaces, memory-efficient (only support vectors matter), strong with clear margins.",
          "**Weaknesses** — slow to train on very large datasets, sensitive to feature scaling and kernel/C choices, and it doesn't natively output probabilities.",
        ]},
        { type: "h2", text: "k-Nearest Neighbors (kNN)" },
        { type: "p", text: "kNN is **lazy** — it does no training. To classify a point, it finds the `k` closest training points (by a distance metric like Euclidean) and takes a majority vote. It's the canonical **low-bias, high-variance**, non-parametric method." },
        { type: "callout", kind: "warn", text: "kNN gotchas interviewers love: it needs feature **scaling** (distance is dominated by large-range features otherwise), it suffers from the **curse of dimensionality** (distances become meaningless in high dimensions), and **inference is expensive** because it searches the whole training set for every prediction. Small k → overfit; large k → underfit." },
        { type: "h2", text: "Naive Bayes" },
        { type: "p", text: "A probabilistic classifier applying **Bayes' theorem** with a 'naive' assumption: that features are **conditionally independent** given the class. That assumption is usually false, yet the model works surprisingly well — especially for **text classification** (spam, sentiment) — because it's extremely fast, needs little data, and handles many features gracefully." },
        { type: "compare", caption: "Three philosophies of classification.", columns: ["Algorithm", "Core idea", "Best for"], rows: [
          { label: "SVM", cells: ["Maximum-margin boundary (+ kernels)", "High-dim, clear-margin, medium data"] },
          { label: "kNN", cells: ["Vote of nearest neighbors (lazy)", "Small data, low dimensions, simple baseline"] },
          { label: "Naive Bayes", cells: ["Bayes' rule + feature independence", "Text/spam, fast, high-dimensional sparse data"] },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Hyperplane** = the flat boundary an SVM draws (a line in 2-D, a plane in 3-D). **Margin** = the gap between the boundary and the closest points. **Kernel trick** = computing similarities as if in a higher-dimensional space without going there explicitly. **Non-parametric** = the model's complexity grows with the data rather than being a fixed set of parameters. **Curse of dimensionality** = in high dimensions, points become nearly equidistant, so distance-based methods break down." },
      ],
      takeaways: [
        "SVMs maximize the margin to the nearest points (support vectors); the kernel trick gives them non-linear boundaries.",
        "kNN is lazy and non-parametric — low bias, high variance; needs feature scaling and struggles in high dimensions.",
        "Naive Bayes assumes feature independence given the class; wrong but fast and excellent for text classification.",
        "Each reflects a distinct philosophy: margins, neighbors, or probabilities.",
      ],
      flashcards: [
        { front: "What is the kernel trick?", back: "Implicitly mapping data into a higher-dimensional space (via a kernel function) so a linear SVM boundary there corresponds to a non-linear boundary in the original space — without computing the high-dim coordinates." },
        { front: "Two things kNN needs you to watch for", back: "Feature scaling (distances are dominated by large-range features) and dimensionality (the curse of dimensionality makes distances meaningless). Also: slow inference." },
        { front: "Why does Naive Bayes work despite a false assumption?", back: "Conditional independence rarely holds, but the model still ranks classes well, is very fast, needs little data, and shines on high-dimensional text problems." },
      ],
      quiz: [
        { q: "The points that define an SVM's boundary are called…", options: ["Centroids", "Support vectors", "Neighbors", "Residuals"], answer: 1, explain: "Support vectors are the closest points to the boundary; only they determine the maximum-margin hyperplane." },
        { q: "kNN is described as a 'lazy' learner because…", options: ["It has low accuracy", "It does no training — all work happens at prediction time", "It ignores labels", "It only uses one feature"], answer: 1, explain: "kNN stores the data and defers all computation to inference, searching for nearest neighbors when a query arrives." },
        { q: "Naive Bayes' 'naive' assumption is that…", options: ["All classes are equally likely", "Features are conditionally independent given the class", "The data is linearly separable", "There are only two classes"], answer: 1, explain: "It assumes features are independent given the class label — simplifying the probability computation dramatically." },
      ],
    },
    {
      slug: "unsupervised-clustering-pca",
      title: "Unsupervised learning: clustering & PCA",
      summary:
        "Finding structure with no labels — how k-means groups data and how PCA compresses it, plus the questions interviewers ask about choosing k and interpreting components.",
      minutes: 10,
      blocks: [
        { type: "p", text: "When there are no labels, you turn to **unsupervised learning** to discover structure. The two most-asked techniques are **k-means** (grouping) and **PCA** (compression)." },
        { type: "diagram", name: "learning-types", caption: "Unsupervised learning is the middle pillar — structure from unlabeled data." },
        { type: "h2", text: "k-means clustering" },
        { type: "p", text: "k-means partitions data into `k` clusters by an iterative two-step loop: **assign** each point to its nearest cluster center (centroid), then **update** each centroid to the mean of its assigned points. Repeat until assignments stop changing. It minimizes within-cluster variance." },
        { type: "list", items: [
          "**Choosing k** — the elbow method (plot within-cluster error vs k, look for the bend) or the silhouette score. There's no single 'correct' k; it's a judgment call.",
          "**Sensitivities** — results depend on the random initial centroids (use **k-means++** initialization) and on feature scaling. It assumes roughly spherical, similar-sized clusters, so it struggles with elongated or nested shapes (where DBSCAN or hierarchical clustering do better).",
        ]},
        { type: "callout", kind: "tip", text: "If asked 'how do you pick k?', don't just say 'the elbow method.' Add that k should often be driven by the *business* need (e.g. 'we want 5 customer segments for 5 marketing campaigns'), validated with silhouette score and stability across random seeds." },
        { type: "h2", text: "Principal Component Analysis (PCA)" },
        { type: "p", text: "PCA is the workhorse of **dimensionality reduction**. It finds new axes — **principal components** — that are the orthogonal directions of **greatest variance** in the data, then projects the data onto the top few. You keep most of the information in far fewer dimensions." },
        { type: "diagram", name: "embeddings", caption: "Dimensionality reduction projects high-dimensional data down while preserving the structure that matters." },
        { type: "list", items: [
          "**Why use it** — speed up training, reduce noise, fight the curse of dimensionality, and visualize high-dimensional data in 2-D/3-D.",
          "**Cost** — the new components are linear combinations of original features, so you **lose interpretability**. Always **scale features first**, since PCA is variance-based.",
          "**How many components** — keep enough to retain a target share of variance (e.g. 95%), read from the explained-variance plot.",
        ]},
        { type: "callout", kind: "warn", text: "PCA is unsupervised — it maximizes variance, which is not the same as maximizing usefulness for your label. A direction of high variance can be irrelevant to the target (and vice versa). If you have labels and want discriminative directions, LDA is the supervised counterpart." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Centroid** = the center (mean) of a cluster. **Within-cluster variance / inertia** = how tightly points hug their centroid — k-means minimizes it. **Principal component** = a new axis capturing a direction of variance; components are ordered by how much variance they explain. **Explained variance** = the fraction of total spread a component accounts for. **Curse of dimensionality** = problems that arise as feature count grows." },
      ],
      takeaways: [
        "k-means alternates assign-to-nearest-centroid and update-centroid steps to minimize within-cluster variance.",
        "Choose k with the elbow/silhouette method plus business judgment; watch initialization (k-means++) and scaling.",
        "PCA projects data onto the top directions of variance to reduce dimensions while keeping most information.",
        "PCA trades interpretability for compression and is variance-based (unsupervised), so scale features and remember variance ≠ label-usefulness.",
      ],
      flashcards: [
        { front: "The two repeating steps of k-means", back: "Assign each point to its nearest centroid, then move each centroid to the mean of its assigned points. Repeat until stable. Minimizes within-cluster variance." },
        { front: "What does PCA actually compute?", back: "Orthogonal directions (principal components) of greatest variance in the data; you project onto the top few to reduce dimensionality while preserving most information." },
        { front: "Why must you scale features before PCA and k-means?", back: "Both are distance/variance-based, so a feature with a large numeric range would dominate. Standardizing puts features on comparable footing." },
      ],
      quiz: [
        { q: "The elbow method helps you choose…", options: ["The learning rate", "The number of clusters k", "The regularization strength", "The kernel"], answer: 1, explain: "You plot within-cluster error against k and pick the 'elbow' where adding clusters stops helping much." },
        { q: "PCA selects new axes that maximize…", options: ["Correlation with the label", "Variance in the data", "The number of features", "Cluster count"], answer: 1, explain: "Principal components are the orthogonal directions of greatest variance — chosen without using any labels." },
        { q: "A key limitation of PCA is that…", options: ["It requires labels", "The components lose interpretability", "It only works in 2-D", "It increases dimensionality"], answer: 1, explain: "Components are linear combinations of original features, so individual meaning is lost — and high variance isn't guaranteed to be label-relevant." },
      ],
    },
  ],
};
