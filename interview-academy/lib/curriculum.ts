import type { Module, Lesson } from "./types";
import { foundations } from "./mod-foundations";
import { stats } from "./mod-stats";
import { classic } from "./mod-classic";
import { deeplearning } from "./mod-deeplearning";
import { nlp } from "./mod-nlp";
import { llms } from "./mod-llms";
import { mlops } from "./mod-mlops";
import { systemdesign } from "./mod-systemdesign";
import { coding } from "./mod-coding";
import { responsible } from "./mod-responsible";
import { behavioral } from "./mod-behavioral";

export const modules: Module[] = [
  foundations,
  stats,
  classic,
  deeplearning,
  nlp,
  llms,
  mlops,
  systemdesign,
  coding,
  responsible,
  behavioral,
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
