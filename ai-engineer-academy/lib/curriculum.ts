import type { Module, Lesson } from "./types";
import { foundations } from "./mod-foundations";
import { prompting } from "./mod-prompting";
import { retrieval } from "./mod-retrieval";
import { rag } from "./mod-rag";
import { agents } from "./mod-agents";
import { mcp } from "./mod-mcp";
import { finetuning } from "./mod-finetuning";
import { inference } from "./mod-inference";
import { evals } from "./mod-evals";
import { production } from "./mod-production";
import { safety } from "./mod-safety";
import { multimodal } from "./mod-multimodal";

export const modules: Module[] = [
  foundations,
  prompting,
  retrieval,
  rag,
  agents,
  mcp,
  finetuning,
  inference,
  evals,
  production,
  safety,
  multimodal,
];

export interface LessonRef {
  lesson: Lesson;
  module: Module;
  moduleIndex: number;
  lessonIndex: number;
  globalIndex: number;
}

export function allLessons(): LessonRef[] {
  const refs: LessonRef[] = [];
  let global = 0;
  modules.forEach((module, moduleIndex) => {
    module.lessons.forEach((lesson, lessonIndex) => {
      refs.push({ lesson, module, moduleIndex, lessonIndex, globalIndex: global });
      global += 1;
    });
  });
  return refs;
}

export function findLesson(slug: string): LessonRef | undefined {
  return allLessons().find((r) => r.lesson.slug === slug);
}

export function lessonNeighbors(slug: string): {
  prev?: LessonRef;
  next?: LessonRef;
} {
  const list = allLessons();
  const i = list.findIndex((r) => r.lesson.slug === slug);
  return {
    prev: i > 0 ? list[i - 1] : undefined,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined,
  };
}

export const totalLessons = allLessons().length;
export const totalMinutes = allLessons().reduce(
  (sum, r) => sum + r.lesson.minutes,
  0,
);
