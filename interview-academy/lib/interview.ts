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
];
