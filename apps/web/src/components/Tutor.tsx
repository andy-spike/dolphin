import { useEffect, useRef, useState } from 'react'
import { ArrowUp, AlertTriangle, X, MessagesSquare } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useStream } from '@/lib/useStream'
import { tutorThread, tailorThread } from '@/mock/data'

type Turn = { from: 'student' | 'tutor'; text: string }
type Mode = 'tutor' | 'tailor'

const asks = ['Explain this differently', 'Where does this break?', 'One more example']

export function TutorMargin({ lessonTitle, lessonComplete }: { lessonTitle: string; lessonComplete: boolean }) {
  const [mode, setMode] = useState<Mode>('tutor')
  const [threads, setThreads] = useState<Record<Mode, Turn[]>>({ tutor: tutorThread, tailor: tailorThread })
  const [draft, setDraft] = useState('')
  const [streamIndex, setStreamIndex] = useState(-1)
  const [sheet, setSheet] = useState(false)

  const turns = threads[mode]

  const send = () => {
    if (!draft.trim()) return
    const reply: Turn = {
      from: 'tutor',
      text:
        mode === 'tutor'
          ? 'Take the smallest case first. With N = 3 there is no arrangement of a two-node write set and a two-node read set that avoids sharing a member — try to draw one and you will run out of nodes. That is the whole proof, and it is worth rehearsing out loud in exactly those words.'
          : 'That is two edits. I will rewrite the Concept section of lesson-03.md and leave Examples alone. Nothing else in the Course Folder changes.',
    }
    const next = [...turns, { from: 'student' as const, text: draft.trim() }, reply]
    setThreads({ ...threads, [mode]: next })
    setStreamIndex(next.length - 1)
    setDraft('')
  }

  const panel = (
    <Panel
      mode={mode}
      setMode={setMode}
      turns={turns}
      streamIndex={streamIndex}
      draft={draft}
      setDraft={setDraft}
      send={send}
      lessonTitle={lessonTitle}
      lessonComplete={lessonComplete}
      onClose={sheet ? () => setSheet(false) : undefined}
    />
  )

  return (
    <>
      <aside
        aria-label="Tutor"
        className="hidden shrink-0 flex-col border-l border-rule bg-paper-sunk xl:flex xl:w-[23rem] 2xl:w-[27rem]"
      >
        {panel}
      </aside>

      <button
        onClick={() => setSheet(true)}
        className="label sticky bottom-0 z-20 flex shrink-0 items-center justify-center gap-2 bg-ink py-4 text-paper xl:hidden"
      >
        <MessagesSquare size={14} strokeWidth={1.8} />
        Ask the Tutor
      </button>

      {sheet && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end bg-ink/25 backdrop-blur-[2px] xl:hidden">
          <button aria-label="Close the Tutor" onClick={() => setSheet(false)} className="flex-1" />
          <aside
            aria-label="Tutor"
            className="flex h-[85dvh] flex-col overflow-hidden border-t border-rule bg-paper-sunk shadow-[0_-12px_32px_rgba(16,15,15,0.16)]"
            style={{ animation: 'sheet 280ms var(--ease-workspace) both' }}
          >
            {panel}
          </aside>
        </div>
      )}
    </>
  )
}

function Panel({
  mode,
  setMode,
  turns,
  streamIndex,
  draft,
  setDraft,
  send,
  lessonTitle,
  lessonComplete,
  onClose,
}: {
  mode: Mode
  setMode: (m: Mode) => void
  turns: Turn[]
  streamIndex: number
  draft: string
  setDraft: (v: string) => void
  send: () => void
  lessonTitle: string
  lessonComplete: boolean
  onClose?: () => void
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const [atFoot, setAtFoot] = useState(true)

  const toFoot = () => requestAnimationFrame(() => scroller.current?.scrollTo({ top: 9e6, behavior: 'smooth' }))

  // The newest turn is what the Student came back for; open on it.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 9e6 })
  }, [mode])

  // The thread fades into the composer, unless the Student has already read to the end.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const check = () => setAtFoot(el.scrollHeight - el.scrollTop - el.clientHeight < 12)
    check()
    el.addEventListener('scroll', check, { passive: true })
    return () => el.removeEventListener('scroll', check)
  }, [turns])

  return (
    <>
      <div className="flex shrink-0 items-center gap-5 border-b border-rule bg-paper-raised px-5">
        <ModeTab active={mode === 'tutor'} onClick={() => setMode('tutor')}>
          Tutor
        </ModeTab>
        <ModeTab active={mode === 'tailor'} onClick={() => setMode('tailor')}>
          Tailor Mode
        </ModeTab>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close the Tutor"
            className="ml-auto grid size-8 place-items-center text-ink-faint hover:bg-paper-sunk hover:text-ink"
          >
            <X size={16} strokeWidth={2} />
          </button>
        )}
      </div>

      {mode === 'tailor' && (
        <p className="flex shrink-0 items-start gap-2.5 border-b border-rule bg-accent-wash px-5 py-3.5 supporting text-[0.8125rem] text-ink-soft">
          <AlertTriangle size={14} strokeWidth={1.8} className="mt-0.5 shrink-0 text-accent" />
          <span>
            Tailor Mode rewrites files in the Course Folder.
            {lessonComplete
              ? ' This Lesson is marked complete — editing it returns its Progress to not complete.'
              : ' This Lesson is not complete, so no Progress changes.'}
          </span>
        </p>
      )}

      <div
        ref={scroller}
        className={cn('min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-6', !atFoot && 'fade-foot')}
      >
        {turns.length === 0 ? (
          <p className="supporting text-[0.875rem] text-ink-faint">
            {mode === 'tutor'
              ? `Ask anything about “${lessonTitle}”. The Tutor has read the whole Course.`
              : 'Describe the change you want. The Tutor names every file it will touch before it writes.'}
          </p>
        ) : (
          <div className="flex min-h-full flex-col justify-end gap-6">
            {turns.map((t, i) => (
              <TurnView key={i} turn={t} streaming={i === streamIndex} />
            ))}
          </div>
        )}
      </div>

      {mode === 'tutor' && (
        <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-rule-soft px-5 pt-3">
          {asks.map((a) => (
            <button
              key={a}
              onClick={() => setDraft(a)}
              className="label border border-rule px-2.5 py-1.5 text-ink-faint transition-colors hover:border-accent-soft hover:bg-accent-wash hover:text-accent"
            >
              {a}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
          toFoot()
        }}
        className="shrink-0 p-3"
      >
        <div className="flex items-end gap-2 border border-rule bg-paper-raised px-3 py-2.5 transition-shadow focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-wash">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
                toFoot()
              }
            }}
            rows={2}
            placeholder={mode === 'tutor' ? 'Ask the Tutor…' : 'Describe the change…'}
            className="max-h-32 min-h-0 flex-1 resize-none bg-transparent supporting text-[0.9375rem] outline-none placeholder:text-ink-faint"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send"
            className={cn(
              'grid size-8 shrink-0 place-items-center transition-colors',
              draft.trim() ? 'bg-accent text-white hover:bg-accent-strong' : 'bg-rule text-ink-faint/60',
            )}
          >
            <ArrowUp size={15} strokeWidth={2.2} />
          </button>
        </div>
      </form>
    </>
  )
}

function TurnView({ turn, streaming }: { turn: Turn; streaming: boolean }) {
  const { shown, done } = useStream(turn.text, streaming && turn.from === 'tutor')

  if (turn.from === 'student') {
    return (
      <div className="bg-accent px-4 py-3">
        <p className="label mb-1.5 text-white/70">You</p>
        <p className="supporting text-[0.875rem] text-white">{turn.text}</p>
      </div>
    )
  }
  // Tutor speaks in the margin: a name and prose, no container competing with it.
  return (
    <div className="px-1">
      <p className="label mb-1.5 text-ink-faint">Tutor</p>
      <p className="supporting text-[0.9375rem] text-ink-soft">
        {shown}
        {!done && <span className="ml-0.5 inline-block h-[1em] w-[3px] translate-y-0.5 bg-accent" />}
      </p>
    </div>
  )
}

function ModeTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'label relative py-3.5 transition-colors',
        active ? 'text-ink' : 'text-ink-faint hover:text-ink',
      )}
    >
      {children}
      {active && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-accent" />}
    </button>
  )
}
