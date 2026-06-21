import Link from "next/link";
import { notFound } from "next/navigation";
import { allLessons, findLesson, lessonNeighbors } from "@/lib/curriculum";
import { LessonRenderer } from "@/components/LessonRenderer";
import { Flashcards } from "@/components/Flashcards";
import { Quiz } from "@/components/Quiz";
import { CompleteButton } from "@/components/CompleteButton";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Layers3,
  HelpCircle,
} from "lucide-react";

export function generateStaticParams() {
  return allLessons().map((r) => ({ slug: r.lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const ref = findLesson(params.slug);
  if (!ref) return {};
  return { title: `${ref.lesson.title} — Agent Academy` };
}

const accentText: Record<string, string> = {
  iris: "text-iris",
  teal: "text-teal-dark",
  amber: "text-amber-dark",
  rose: "text-rose-dark",
};

export default function LessonPage({ params }: { params: { slug: string } }) {
  const ref = findLesson(params.slug);
  if (!ref) notFound();
  const { lesson, module, moduleIndex, lessonIndex } = ref;
  const { prev, next } = lessonNeighbors(params.slug);

  return (
    <article className="max-w-3xl mx-auto px-6 lg:px-10 py-12 pb-24">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-ink-muted mb-5">
        <Link href="/learn" className="hover:text-iris">Curriculum</Link>
        <span>/</span>
        <span className={accentText[module.accent]}>{module.title}</span>
      </div>

      {/* header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 text-xs text-ink-muted mb-3">
          <span className="font-mono">
            Lesson {moduleIndex + 1}.{lessonIndex + 1}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {lesson.minutes} min read
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-[2.6rem] font-semibold text-ink leading-tight mb-4 tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-lg text-ink-soft leading-relaxed">{lesson.summary}</p>
      </header>

      {/* body */}
      <LessonRenderer blocks={lesson.blocks} />

      {/* takeaways */}
      <section className="mt-14 rounded-2xl border border-iris/25 bg-iris-50 p-7">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={18} className="text-iris-dark" />
          <h2 className="font-display text-xl font-semibold text-ink">Key takeaways</h2>
        </div>
        <ul className="space-y-3">
          {lesson.takeaways.map((t, i) => (
            <li key={i} className="flex gap-3 text-ink-soft leading-relaxed">
              <span className="shrink-0 font-display font-semibold text-iris-dark">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* flashcards */}
      <section className="mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Layers3 size={18} className="text-teal-dark" />
          <h2 className="font-display text-xl font-semibold text-ink">Flashcards</h2>
          <span className="text-sm text-ink-muted">— tap to flip</span>
        </div>
        <Flashcards cards={lesson.flashcards} />
      </section>

      {/* quiz */}
      <section className="mt-12">
        <div className="flex items-center gap-2 mb-5">
          <HelpCircle size={18} className="text-amber-dark" />
          <h2 className="font-display text-xl font-semibold text-ink">Check yourself</h2>
        </div>
        <Quiz questions={lesson.quiz} />
      </section>

      {/* complete + nav */}
      <div className="mt-14 flex justify-center">
        <CompleteButton slug={lesson.slug} />
      </div>

      <nav className="mt-12 grid sm:grid-cols-2 gap-4">
        {prev ? (
          <Link
            href={`/learn/${prev.lesson.slug}`}
            className="group rounded-xl border border-canvas-300 bg-canvas-50/40 p-4 hover:border-iris/40 transition-colors"
          >
            <span className="flex items-center gap-1 text-xs text-ink-muted mb-1">
              <ArrowLeft size={13} /> Previous
            </span>
            <span className="font-medium text-ink group-hover:text-iris-dark transition-colors">
              {prev.lesson.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/learn/${next.lesson.slug}`}
            className="group rounded-xl border border-canvas-300 bg-canvas-50/40 p-4 text-right hover:border-iris/40 transition-colors"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-ink-muted mb-1">
              Next <ArrowRight size={13} />
            </span>
            <span className="font-medium text-ink group-hover:text-iris-dark transition-colors">
              {next.lesson.title}
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
