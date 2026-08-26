import { useLayoutEffect, useRef, useState } from 'react'
import { Check, Copy, Play, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStream } from '@/lib/useStream'
import { Spine } from '@/components/Spine'
import type { CodeExercise, Exercise, WrittenExercise } from '@/mock/types'

export function ExerciseList({ exercises, sandboxDown }: { exercises: Exercise[]; sandboxDown: boolean }) {
  return (
    <ol className="space-y-8">
      {exercises.map((ex, i) => (
        <li key={ex.id}>
          <p className="label mb-3 flex items-center gap-2.5 text-ink-faint">
            exercise {i + 1} of {exercises.length}
            <span className="size-[3px] bg-rule-strong" />
            <span className="text-ink">{ex.kind === 'written' ? 'written' : ex.language.toLowerCase()}</span>
          </p>
          {ex.kind === 'written' ? <Written ex={ex} /> : <CodeTask ex={ex} sandboxDown={sandboxDown} />}
        </li>
      ))}
    </ol>
  )
}

function Prompt({ text }: { text: string }) {
  return (
    <p className="reading border-b border-rule px-5 py-4 text-[0.9375rem]">
      {text.split('`').map((part, i) =>
        i % 2 ? (
          <code key={i} className="bg-paper-sunk px-1.5 py-0.5 font-mono text-[0.8rem]">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </p>
  )
}

const MAX_ANSWER_HEIGHT = 320

function Written({ ex }: { ex: WrittenExercise }) {
  const [answer, setAnswer] = useState(ex.answer)
  const [feedback, setFeedback] = useState(ex.feedback)
  const [checking, setChecking] = useState(false)
  const { shown, done } = useStream(feedback?.text ?? '', checking === false && !!feedback)
  const answerRef = useRef<HTMLTextAreaElement>(null)

  // Grows the box with the Student's answer, capped at MAX_ANSWER_HEIGHT — past that it scrolls instead.
  // scrollHeight excludes the border even under border-box sizing, so it has to be added back in,
  // or the box permanently overflows itself by exactly the border width.
  useLayoutEffect(() => {
    const el = answerRef.current
    if (!el) return
    const border = parseFloat(getComputedStyle(el).borderTopWidth) + parseFloat(getComputedStyle(el).borderBottomWidth)
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight + border, MAX_ANSWER_HEIGHT)}px`
  }, [answer])

  const check = () => {
    setChecking(true)
    setFeedback(null)
    setTimeout(() => {
      setChecking(false)
      setFeedback(ex.feedback)
    }, 700)
  }

  return (
    <div className="overflow-hidden border border-rule bg-paper-raised">
      <Prompt text={ex.prompt} />
      <div className="p-3">
        <textarea
          ref={answerRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={5}
          placeholder="write your answer…"
          className="reading w-full resize-none overflow-y-auto border border-rule bg-paper px-4 py-3 text-[0.9375rem] outline-none transition-shadow placeholder:text-ink-faint focus:border-accent focus:ring-4 focus:ring-accent-wash"
          style={{ maxHeight: MAX_ANSWER_HEIGHT }}
        />
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            onClick={check}
            disabled={!answer.trim() || checking}
            className={cn(
              'label inline-flex items-center gap-2 px-4 py-2.5 transition-colors',
              answer.trim() && !checking
                ? 'bg-ink text-paper hover:bg-accent'
                : 'cursor-not-allowed bg-rule text-ink-faint/70',
            )}
          >
            {checking && <Loader2 size={13} className="animate-spin" strokeWidth={2.2} />}
            {checking ? 'tutor is reading' : feedback ? 'ask again' : 'ask the tutor to check'}
          </button>
          <p className="label text-ink-faint">not graded, not stored</p>
        </div>
      </div>

      {feedback && (
        <div className="border-t border-rule bg-paper-sunk px-5 py-4">
          <p className="label mb-2.5 flex items-center gap-2.5 text-ink-faint">
            tutor
            <span
              className={cn(
                'px-2 py-1',
                feedback.verdict === 'good' ? 'bg-pass-wash text-pass' : 'bg-accent-wash text-accent',
              )}
            >
              {feedback.verdict === 'good' ? 'sound' : 'partly there'}
            </span>
          </p>
          <p className="reading text-[0.9375rem] text-ink-soft">
            {shown}
            {!done && <span className="ml-0.5 inline-block h-[1em] w-[3px] translate-y-0.5 bg-accent" />}
          </p>
        </div>
      )}
    </div>
  )
}

function CodeTask({ ex, sandboxDown }: { ex: CodeExercise; sandboxDown: boolean }) {
  const [run, setRun] = useState(ex.run)
  const [copied, setCopied] = useState(false)

  const start = () => {
    if (sandboxDown) return
    setRun('running')
    setTimeout(() => setRun(ex.run === 'untried' ? 'pass' : ex.run), 1100)
  }

  const copy = () => {
    navigator.clipboard?.writeText(ex.file)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="overflow-hidden border border-rule bg-paper-raised">
      <Prompt text={ex.prompt} />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-rule bg-paper-sunk px-5 py-3">
        <p className="label text-ink-faint">edit in your editor</p>
        <button
          onClick={copy}
          className="group inline-flex items-center gap-2 numeral text-[0.75rem] text-accent underline decoration-accent/30 hover:decoration-accent"
        >
          {ex.file}
          {copied ? (
            <Check size={13} strokeWidth={2.2} className="text-pass" />
          ) : (
            <Copy size={13} strokeWidth={1.8} className="opacity-60 group-hover:opacity-100" />
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
        <button
          onClick={start}
          disabled={run === 'running' || sandboxDown}
          className={cn(
            'label inline-flex items-center gap-2 px-4 py-2.5 transition-colors',
            sandboxDown || run === 'running'
              ? 'cursor-not-allowed bg-rule text-ink-faint'
              : 'bg-ink text-paper hover:bg-accent',
          )}
        >
          {run === 'running' ? (
            <Loader2 size={13} className="animate-spin" strokeWidth={2.2} />
          ) : (
            <Play size={12} strokeWidth={2.4} className="fill-current" />
          )}
          {run === 'running' ? 'running in sandbox' : 'run tests'}
        </button>
        <p className="label text-ink-faint">
          {sandboxDown ? 'sandbox unavailable' : run === 'untried' ? 'tests are hidden' : `${ex.total} hidden tests`}
        </p>
      </div>

      {sandboxDown ? (
        <p className="supporting border-t border-rule bg-paper-sunk px-5 py-4 text-[0.875rem] text-ink-faint">
          {run === 'pass' || run === 'fail'
            ? 'the last result is hidden while the sandbox is unavailable — it may no longer match your file.'
            : 'press run tests again to retry.'}
        </p>
      ) : (
        (run === 'pass' || run === 'fail') && <Result ex={ex} run={run} />
      )}
    </div>
  )
}

function Result({ ex, run }: { ex: CodeExercise; run: 'pass' | 'fail' }) {
  const passed = run === 'pass' ? ex.total : ex.passed
  const { shown, done } = useStream(ex.hint, run === 'fail')

  return (
    <div className="border-t border-rule bg-paper-sunk px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            'grid size-6 shrink-0 place-items-center text-white',
            run === 'pass' ? 'bg-pass' : 'bg-fail',
          )}
        >
          {run === 'pass' ? <Check size={13} strokeWidth={2.8} /> : <X size={13} strokeWidth={2.8} />}
        </span>
        <p className="label text-ink">
          {passed} of {ex.total} tests passing
        </p>
        <Spine
          total={ex.total}
          filled={passed}
          fill={run === 'pass' ? 'bg-pass' : 'bg-fail'}
          track={run === 'pass' ? 'bg-rule' : 'bg-fail/20'}
          notch="bg-paper-sunk"
          className="w-24"
        />
      </div>
      {run === 'fail' && (
        <p className="reading mt-3.5 text-[0.9375rem] text-ink-soft">
          {shown}
          {!done && <span className="ml-0.5 inline-block h-[1em] w-[3px] translate-y-0.5 bg-accent" />}
        </p>
      )}
    </div>
  )
}
