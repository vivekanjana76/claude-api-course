# Anthropic courses

Welcome to Anthropic's educational courses. This repository currently contains five courses.  We suggest completing the courses in the following order:

1. [Anthropic API fundamentals](./anthropic_api_fundamentals/README.md) - teaches the essentials of working with the Claude SDK: getting an API key, working with model parameters, writing multimodal prompts, streaming responses, etc.
2. [Prompt engineering interactive tutorial](./prompt_engineering_interactive_tutorial/README.md) - a comprehensive step-by-step guide to key prompting techniques. [[AWS Workshop version](https://catalog.us-east-1.prod.workshops.aws/workshops/0644c9e9-5b82-45f2-8835-3b5aa30b1848/en-US)]
3. [Real world prompting](./real_world_prompting/README.md) - learn how to incorporate prompting techniques into complex, real world prompts. [[Google Vertex version](https://github.com/anthropics/courses/tree/vertex/real_world_prompting)] 
4. [Prompt evaluations](./prompt_evaluations/README.md) - learn how to write production prompt evaluations to measure the quality of your prompts.
5. [Tool use](./tool_use/README.md) - teaches everything you need to know to implement tool use successfully in your workflows with Claude.

**Please note that these courses often favor our lowest-cost model, Claude 3 Haiku, to keep API costs down for students following along with the materials. Feel free to use other Claude models if you prefer.**

---

## Interactive Learning Academies

This repository also hosts a set of **self-teaching web apps** — beautiful, visual, beginner-friendly courses built with Next.js 14, TypeScript, and Tailwind. Each has typed lesson content, SVG diagrams, flashcards, quizzes with mastery tracking, a glossary, interview Q&A, and a ⌘K command palette. Run any of them with `npm install && npm run dev`.

| Academy | Folder | Covers |
| --- | --- | --- |
| 🟠 **Claude Academy** | [`claude-academy/`](./claude-academy/) | The Anthropic API, prompting, tool use, RAG, agents, evals — plus an interview `/prep` dossier |
| 🟣 **Agent Academy** | [`agent-academy/`](./agent-academy/) | Agentic AI: agents vs workflows, orchestration patterns, tools, CrewAI, production — plus an intuition-drill `/prep` page |
| 🔵 **Cloud Academy** | [`cloud-academy/`](./cloud-academy/) | Cloud computing on AWS & Azure: foundations, compute, storage, networking, databases, security, serverless, containers/Kubernetes |
| 🟢 **DevOps Academy** | [`devops-academy/`](./devops-academy/) | Docker, Kubernetes, CI/CD, Terraform/IaC, GitOps, observability, DevSecOps |
| 🔴 **Interview Academy** | [`interview-academy/`](./interview-academy/) | AI/ML job-interview prep: foundations, classic ML, deep learning, NLP/LLMs, MLOps, system design, coding, stats, behavioral, responsible AI |

Every academy follows a shared **"Jargon, decoded"** convention — inline callouts that translate jargon into plain language so beginners are never lost.