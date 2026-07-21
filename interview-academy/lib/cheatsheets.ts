import type { Accent } from "./types";

export interface CheatCommand {
  cmd: string;
  desc: string;
}

export interface CheatSection {
  title: string;
  commands: CheatCommand[];
}

export interface CheatSheet {
  id: string;
  tool: string;
  blurb: string;
  accent: Accent;
  sections: CheatSection[];
}

export const cheatsheets: CheatSheet[] = [
  {
    id: "classification-metrics",
    tool: "Classification metrics",
    blurb: "The formulas built from the confusion matrix — know these cold and know when each is the right one.",
    accent: "iris",
    sections: [
      {
        title: "From the confusion matrix",
        commands: [
          { cmd: "Accuracy = (TP+TN)/(TP+TN+FP+FN)", desc: "Fraction correct — misleading on imbalanced data." },
          { cmd: "Precision = TP/(TP+FP)", desc: "Of predicted positives, how many are right. Favor when false positives cost." },
          { cmd: "Recall = TP/(TP+FN)", desc: "Of actual positives, how many caught. Favor when misses cost." },
          { cmd: "F1 = 2·P·R/(P+R)", desc: "Harmonic mean of precision & recall — one balanced number." },
          { cmd: "Specificity = TN/(TN+FP)", desc: "True-negative rate — recall for the negative class." },
        ],
      },
      {
        title: "Threshold-independent",
        commands: [
          { cmd: "ROC-AUC", desc: "Ranks positives above negatives across all thresholds. 1.0 perfect, 0.5 random." },
          { cmd: "PR-AUC", desc: "Area under precision–recall curve — better than ROC-AUC on heavy imbalance." },
          { cmd: "Log loss", desc: "Penalizes confident wrong probabilities — rewards calibrated outputs." },
        ],
      },
    ],
  },
  {
    id: "regression-metrics",
    tool: "Regression metrics",
    blurb: "How to score continuous predictions, and what each metric is (and isn't) sensitive to.",
    accent: "teal",
    sections: [
      {
        title: "Error measures",
        commands: [
          { cmd: "MSE = mean((y − ŷ)²)", desc: "Punishes large errors hard; sensitive to outliers." },
          { cmd: "RMSE = √MSE", desc: "Same as MSE but in the target's units — more interpretable." },
          { cmd: "MAE = mean(|y − ŷ|)", desc: "Linear in error, robust to outliers." },
          { cmd: "MAPE = mean(|y−ŷ|/|y|)", desc: "Percentage error — beware when y is near zero." },
        ],
      },
      {
        title: "Goodness of fit",
        commands: [
          { cmd: "R² = 1 − SS_res/SS_tot", desc: "Variance explained. 1 perfect, 0 = predicting the mean, can go negative." },
          { cmd: "Adjusted R²", desc: "R² penalized for extra features — use when comparing models of different size." },
        ],
      },
    ],
  },
  {
    id: "training-core",
    tool: "Training essentials",
    blurb: "The core equations and choices behind fitting any model with gradient descent.",
    accent: "rose",
    sections: [
      {
        title: "Optimization",
        commands: [
          { cmd: "θ := θ − η·∇J(θ)", desc: "Gradient descent update — step opposite the gradient." },
          { cmd: "Cross-entropy", desc: "Default loss for classification." },
          { cmd: "MSE", desc: "Default loss for regression." },
          { cmd: "Adam", desc: "Adaptive optimizer — robust default for deep nets." },
          { cmd: "Mini-batch (32–512)", desc: "The practical GD variant — speed + stability." },
        ],
      },
      {
        title: "Regularization",
        commands: [
          { cmd: "L2 (Ridge): +λΣwᵢ²", desc: "Shrinks weights smoothly." },
          { cmd: "L1 (Lasso): +λΣ|wᵢ|", desc: "Zeros weights → feature selection." },
          { cmd: "Dropout", desc: "Randomly drop neurons while training." },
          { cmd: "Early stopping", desc: "Stop when validation loss rises." },
        ],
      },
    ],
  },
  {
    id: "llm-toolkit",
    tool: "LLM toolkit",
    blurb: "The ladder of techniques to get more from a large language model, cheapest first.",
    accent: "amber",
    sections: [
      {
        title: "Steer without training",
        commands: [
          { cmd: "Prompt engineering", desc: "Clear instructions, format, and constraints." },
          { cmd: "Few-shot examples", desc: "Show 2–5 demonstrations of the task in the prompt." },
          { cmd: "Chain-of-thought", desc: "Ask it to reason step by step for multi-step problems." },
          { cmd: "RAG", desc: "Retrieve context into the prompt to ground answers." },
          { cmd: "Tool / function calling", desc: "Let the model call APIs, calculators, search." },
        ],
      },
      {
        title: "Change the weights",
        commands: [
          { cmd: "Fine-tuning (SFT)", desc: "Train on task demonstrations to specialize behavior." },
          { cmd: "LoRA / PEFT", desc: "Fine-tune small added matrices — cheap, fast." },
          { cmd: "RLHF / DPO", desc: "Align outputs to human preferences." },
        ],
      },
    ],
  },
];
