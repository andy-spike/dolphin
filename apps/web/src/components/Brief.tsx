import { useState } from 'react'
import { ArrowRight, FileText, Link2, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StationHead } from '@/components/StationHead'
import { Field, Masthead, underline, opening } from '@/components/Ruled'
import type { Course, Difficulty, Source } from '@/mock/types'

const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced']

export type BriefValues = Pick<Course, 'topic' | 'goal' | 'difficulty' | 'timeBudget' | 'sources' | 'webSearch'>

export function Brief({
  course,
  onSubmit,
  onLibrary,
  onCancel,
}: {

  course?: Course
  onSubmit: (values: BriefValues) => void
  onLibrary: () => void
  onCancel?: () => void
}) {
  const editing = Boolean(course)
  const [topic, setTopic] = useState(course?.topic ?? '')
  const [goal, setGoal] = useState(course?.goal ?? '')
  const [difficulty, setDifficulty] = useState<Difficulty>(course?.difficulty ?? 'intermediate')
  const [budget, setBudget] = useState(String(parseInt(course?.timeBudget ?? '8', 10) || 8))
  const [webSearch, setWebSearch] = useState(course?.webSearch ?? true)
  const [sources, setSources] = useState<Source[]>(course?.sources ?? [])

  const ready = topic.trim().length > 2 && goal.trim().length > 2

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ready) return
    const hours = parseInt(budget, 10) || 8
    onSubmit({
      topic: topic.trim(),
      goal: goal.trim(),
      difficulty,
      timeBudget: `${hours} hour${hours === 1 ? '' : 's'}`,
      sources,
      webSearch,
    })
  }

  return (
    <>
      <StationHead course={course} station={editing ? 'edit the brief' : 'new course'} onLibrary={onLibrary} />

      <div className="min-h-0 flex-1 overflow-y-auto bg-paper">
        <div className="mx-auto w-full max-w-[48rem] px-6 pt-14 pb-24 md:px-10 md:pt-20">
          <Masthead
            title={editing ? 'the brief behind this course.' : 'what are we building you?'}
            lead={
              editing
                ? 'the generator read this once, and the tutor still reads it on every reply. changing it does not rewrite lessons that already exist — tailor mode does that.'
                : 'the generator reads this once, then drafts a syllabus you can argue with. nothing is written to disk until you agree to it.'
            }
          />

          <form onSubmit={submit} className={cn('mt-12', opening)}>
            <Field label="topic" hint="the subject you want to learn.">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="distributed systems"
                autoFocus
                className={underline}
              />
            </Field>

            <Field label="goal" hint="what you want to be able to do at the end.">
              <Input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="reason about replication out loud"
                className={underline}
              />
            </Field>

            <Field label="difficulty" hint="how advanced the course should be.">
              <div className="inline-flex border border-rule bg-paper-raised p-1">
                {difficulties.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    aria-pressed={difficulty === d}
                    className={cn(
                      'label px-4 py-2 transition-colors',
                      difficulty === d ? 'bg-ink text-paper' : 'text-ink-faint hover:text-ink',
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="time budget" hint="shapes how many lessons the course has.">
              <div className="flex items-baseline gap-3">
                <Input
                  type="number"
                  min={1}
                  max={80}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  aria-label="Hours in total"
                  className="h-auto w-20 rounded-none border-0 bg-transparent px-0 py-0 numeral text-[1.625rem] md:text-[1.625rem] outline-none [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="label text-ink-faint">hours in total</span>
              </div>
            </Field>

            <Field label="sources" hint="documents the generator must use. a public https url, or a pdf, markdown or text file.">
              <ul className="mb-3 space-y-2 empty:hidden">
                {sources.map((s, i) => (
                  <li key={i} className="flex items-center gap-3 border border-rule bg-paper-raised px-3.5 py-2.5">
                    {s.kind === 'url' ? (
                      <Link2 size={14} strokeWidth={1.8} className="shrink-0 text-ink-faint" />
                    ) : (
                      <FileText size={14} strokeWidth={1.8} className="shrink-0 text-ink-faint" />
                    )}
                    <span className="numeral min-w-0 flex-1 truncate text-[0.8125rem]">{s.label}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${s.label}`}
                      onClick={() => setSources(sources.filter((_, j) => j !== i))}
                      className="text-ink-faint transition-colors hover:text-fail"
                    >
                      <X size={15} strokeWidth={2} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <AddSource
                  icon={Link2}
                  label="add a url"
                  onClick={() => setSources([...sources, { kind: 'url', label: 'jepsen.io/consistency' }])}
                />
                <AddSource
                  icon={FileText}
                  label="add a file"
                  onClick={() =>
                    setSources([...sources, { kind: 'file', label: '~/books/designing-data-intensive-apps.pdf' }])
                  }
                />
              </div>
            </Field>

            <Field label="web search" hint="live search, governing both the generator and the tutor.">
              <button
                type="button"
                role="switch"
                aria-checked={webSearch}
                aria-label="Web search"
                onClick={() => setWebSearch(!webSearch)}
                className="flex items-center gap-3"
              >
                <span
                  className={cn(
                    'relative h-6 w-11 border transition-colors duration-200',
                    webSearch ? 'border-accent/30 bg-accent' : 'border-rule bg-paper-sunk',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 size-4 bg-white shadow-[0_1px_3px_rgba(16,15,15,0.25)] transition-[left] duration-200 ease-[var(--ease-workspace)]',
                      webSearch ? 'left-[1.4rem]' : 'left-0.5',
                    )}
                  />
                </span>
                <span className="label text-ink-soft">{webSearch ? 'on' : 'off'}</span>
              </button>
            </Field>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
              <Button type="submit" disabled={!ready}>
                {editing ? 'save the brief' : 'draft the syllabus'}
                {!editing && <ArrowRight size={14} strokeWidth={2.2} />}
              </Button>
              {editing && onCancel && (
                <Button type="button" variant="quiet" onClick={onCancel}>
                  discard changes
                </Button>
              )}
              <p className="label text-ink-faint">
                {!ready
                  ? 'topic and goal are required'
                  : editing
                    ? 'lessons already written stay as they are'
                    : 'runs on your own harness · no model api key'}
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

function AddSource({ icon: Icon, label, onClick }: { icon: typeof Link2; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="label inline-flex items-center gap-2 border border-dashed border-rule-strong px-3.5 py-2.5 text-ink-faint transition-colors hover:border-accent-soft hover:bg-accent-wash hover:text-accent"
    >
      <Plus size={13} strokeWidth={2.2} />
      <Icon size={13} strokeWidth={1.8} />
      {label}
    </button>
  )
}
