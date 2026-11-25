"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import { getArticle } from "@/data/articles";
import { getQuiz } from "@/data/quizzes";
import { useContent } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { celebrate } from "@/lib/celebrate";
import { canCelebrate } from "@/lib/progress";
import { cn, vibrate } from "@/lib/utils";

/**
 * The question that runs after a story.
 *
 * Shown once per article: `answerQuiz` refuses to pay twice, and the reader
 * component only offers the check to articles it hasn't been passed on. Being
 * wrong still earns a little and still shows the explanation, because the
 * version that punishes you for guessing is the version nobody opens twice.
 */
export function ComprehensionCheck({ articleId }: { articleId: string }) {
  const quiz = getQuiz(articleId);
  const article = getArticle(articleId);
  const close = useUI((s) => s.openQuiz);
  const showToast = useUI((s) => s.showToast);
  const answerQuiz = useContent((s) => s.answerQuiz);
  const [picked, setPicked] = useState<number | null>(null);

  if (!quiz || !article) return null;

  const answered = picked !== null;
  const correct = picked === quiz.answer;

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    const right = i === quiz.answer;
    answerQuiz(articleId, right);
    vibrate(right ? [10, 30, 10] : 6);
    if (right && canCelebrate(article)) {
      celebrate({ y: window.innerHeight * 0.5, count: 48 });
    }
  };

  const finish = () => {
    close(null);
    if (correct) showToast("+30 XP", "brain");
  };

  return (
    <motion.div
      className="fixed inset-0 z-[75] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        aria-label="Skip the check"
        onClick={() => close(null)}
        className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Comprehension check"
        className="glass-strong lg-refract relative w-full max-w-md rounded-t-[2rem] px-5 pb-8 pt-5 text-ink"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 36 }}
      >
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
          <Sparkles size={12} /> Did you get it?
        </p>
        <h3 className="mt-2.5 text-[17px] font-extrabold leading-[1.3] tracking-[-0.01em] [text-wrap:pretty]">
          {quiz.question}
        </h3>

        <div className="mt-4 flex flex-col gap-2">
          {quiz.options.map((opt, i) => {
            const isAnswer = i === quiz.answer;
            const isPicked = i === picked;
            // After answering, always show where the truth was — not just
            // whether this particular guess happened to land.
            const state = !answered
              ? "idle"
              : isAnswer
                ? "right"
                : isPicked
                  ? "wrong"
                  : "muted";
            return (
              <button
                key={opt}
                onClick={() => choose(i)}
                disabled={answered}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left text-[13.5px] leading-[1.45] transition-colors duration-200",
                  state === "idle" &&
                    "border-[var(--glass-border)] bg-[var(--glass-bg)] text-ink active:bg-ink/10",
                  state === "right" && "border-[#6EE087] bg-[#6EE087]/14 text-ink",
                  state === "wrong" && "border-[#FF6B5E] bg-[#FF6B5E]/12 text-ink",
                  state === "muted" && "border-transparent bg-[var(--glass-bg)] text-ink-faint"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold",
                    state === "right" && "bg-[#6EE087] text-[#06301a]",
                    state === "wrong" && "bg-[#FF6B5E] text-white",
                    (state === "idle" || state === "muted") &&
                      "border border-[var(--glass-border)] text-ink-faint"
                  )}
                >
                  {state === "right" ? (
                    <Check size={12} strokeWidth={3} />
                  ) : state === "wrong" ? (
                    <X size={12} strokeWidth={3} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <p
              className="text-[12px] font-bold uppercase tracking-[0.14em]"
              style={{ color: correct ? "#6EE087" : "#FFD166" }}
            >
              {correct ? "Got it · +30 XP" : "Not quite"}
            </p>
            <p className="mt-2 text-[13px] leading-[1.6] text-ink-dim">{quiz.because}</p>
            <button
              onClick={finish}
              className="mt-4 w-full rounded-2xl bg-[var(--accent)] py-3.5 text-[14px] font-bold text-white shadow-glow"
            >
              Keep reading
            </button>
          </motion.div>
        )}

        {!answered && (
          <button
            onClick={() => close(null)}
            className="mt-3.5 w-full py-2 text-center text-[12.5px] font-semibold text-ink-dim"
          >
            Skip
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
