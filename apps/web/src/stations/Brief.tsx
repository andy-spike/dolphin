import { useState } from 'react'
import { ArrowRight, FileText, Link2, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StationHead } from '@/components/StationHead'
import type { Source } from '@/mock/types'

type Familiarity = 'new to it' | 'some exposure' | 'already comfortable'

const familiarities: Familiarity[] = ['new to it', 'some exposure', 'already comfortable']

export function BriefStation({ onDraft, onLibrary }: { onDraft: () => void; onLibrary: () => void }) {
  const [topic, setTopic] = useState('')
  const [goal, setGoal] = useState('')
  const [familiarity, setFamiliarity] = useState<Familiarity>('some exposure')
  const [budget, setBudget] = useState('8')
  const [webSearch, setWebSearch] = useState(true)
  const [sources, setSources] = useState<Source[]>([])

  const ready = topic.trim().length > 2 && goal.trim().length > 2

  return (
    <>
      <StationHead station="New course" onLibrary={onLibrary} />

      <div className="min-h-0 flex-1 overflow-y-auto bg-paper">
        <div className="mx-auto w-full max-w-[48rem] px-6 pt-14 pb-24 md:px-10 md:pt-20">
          <header className="station-in">
            <h1 className="display text-[clamp(2rem,4.5vw,2.75rem)]">What are we building you?</h1>
            <p className="supporting mt-6 max-w-[54ch] text-ink-soft">
              The Generator reads this once, then drafts a Syllabus you can argue with. Nothing is written to disk until
              you agree to it.
            </p>
          </header>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (ready) onDraft()
            }}
            className="mt-12 border-t border-ink/85"
          >
            <Field label="Topic" hint="The subject you want to learn.">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="distributed systems"
                autoFocus
                className="h-auto w-full rounded-none border-0 border-b border-rule bg-transparent px-0 py-0 pb-2 title text-[1.3125rem] md:text-[1.3125rem] outline-none transition-colors placeholder:font-normal placeholder:text-ink-faint focus-visible:border-accent focus-visible:ring-0"
              />
            </Field>

            <Field label="Goal" hint="What you want to be able to do at the end.">
              <Input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="reason about replication out loud"
                className="h-auto w-full rounded-none border-0 border-b border-rule bg-transparent px-0 py-0 pb-2 title text-[1.3125rem] md:text-[1.3125rem] outline-none transition-colors placeholder:font-normal placeholder:text-ink-faint focus-visible:border-accent focus-visible:ring-0"
              />
            </Field>

            <Field label="Familiarity" hint="How much of this you already know.">
              <div className="inline-flex border border-rule bg-paper-raised p-1">
                {familiarities.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFamiliarity(f)}
                    aria-pressed={familiarity === f}
                    className={cn(
                      'label px-4 py-2 transition-colors',
                      familiarity === f ? 'bg-ink text-paper' : 'text-ink-faint hover:text-ink',
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Time Budget" hint="Shapes how many Lessons the Course has.">
              <div className="flex items-baseline gap-3">
                <Input
                  type="number"
                  min={1}
                  max={80}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  aria-label="Hours in total"
                  className="h-auto w-24 rounded-none border-0 border-b border-rule bg-transparent px-0 py-0 pb-1 numeral text-[1.625rem] md:text-[1.625rem] outline-none transition-colors [appearance:textfield] focus-visible:border-accent focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="label text-ink-faint">hours in total</span>
              </div>
            </Field>

            <Field label="Sources" hint="Documents the Generator must use. A URL, or a file on this machine.">
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
                  label="Add a URL"
                  onClick={() => setSources([...sources, { kind: 'url', label: 'jepsen.io/consistency' }])}
                />
                <AddSource
                  icon={FileText}
                  label="Add a file"
                  onClick={() =>
                    setSources([...sources, { kind: 'file', label: '~/books/designing-data-intensive-apps.pdf' }])
                  }
                />
              </div>
            </Field>

            <Field label="Web search" hint="Live search, governing both the Generator and the Tutor.">
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
                <span className="label text-ink-soft">{webSearch ? 'On' : 'Off'}</span>
              </button>
            </Field>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button type="submit" disabled={!ready}>
                Draft the Syllabus
                <ArrowRight size={14} strokeWidth={2.2} />
              </Button>
              <p className="label text-ink-faint">
                {ready ? 'Runs on your own agent · nothing uploaded' : 'Topic and Goal are required'}
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

/** Label and hint hang in the left margin; the control keeps the full column. */
function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-8 gap-y-3 border-b border-rule-soft py-7 md:grid-cols-[11rem_minmax(0,1fr)]">
      <div>
        <p className="label text-ink">{label}</p>
        <p className="supporting mt-2 text-[0.8125rem] text-ink-faint">{hint}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
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
