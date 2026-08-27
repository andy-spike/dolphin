import { useEffect, useRef, useState } from 'react'
import { ArrowUp, AlertTriangle, History, MessagesSquare, PanelRightClose, PanelRightOpen, Plus, SignalHigh, SignalLow, SignalMedium, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStream } from '@/lib/useStream'
import { tutorThread, tailorThread } from '@/mock/data'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, useSidebar } from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClaudeMark, OpenAIMark } from '@/components/Marks'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Turn = { from: 'student' | 'tutor'; text: string }
type Thread = { createdAt: Date; turns: Turn[] }
type Mode = 'tutor' | 'tailor'

const MODELS = ['sonnet 4.5', 'opus 4.5', 'haiku 4.5', 'gpt 4.5'] as const
const REASONING = ['low', 'medium', 'high'] as const

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000)

const tutorThreadYesterday: Turn[] = [
  { from: 'student', text: 'Can you explain quorum consistency one more time?' },
  { from: 'tutor', text: 'A quorum is the minimum number of replicas that must agree. The read returns the newest version among the replicas it contacts.' },
]
const tutorThreadEarlier: Turn[] = [
  { from: 'student', text: 'What is the difference between linearizability and sequential consistency?' },
  { from: 'tutor', text: 'Linearizability orders every operation against a single point in real time. Sequential consistency only preserves program order per process.' },
]

const MIN_TUTOR_WIDTH = 300
const MAX_TUTOR_WIDTH = 560

const DEFAULT_TUTOR_WIDTH = 400

export function TutorMargin({ lessonTitle, lessonComplete }: { lessonTitle: string; lessonComplete: boolean }) {
  const [mode, setMode] = useState<Mode>('tutor')
  const [threads, setThreads] = useState<Record<Mode, Thread[]>>({
    tutor: [
      { createdAt: new Date(), turns: tutorThread },
      { createdAt: daysAgo(1), turns: tutorThreadYesterday },
      { createdAt: daysAgo(4), turns: tutorThreadEarlier },
    ],
    tailor: [{ createdAt: new Date(), turns: tailorThread }],
  })
  const [activeId, setActiveId] = useState<Record<Mode, number>>({ tutor: 0, tailor: 0 })
  const [draft, setDraft] = useState('')
  const [streamIndex, setStreamIndex] = useState(-1)
  const [width, setWidth] = useState(DEFAULT_TUTOR_WIDTH)

  const turns = threads[mode][activeId[mode]].turns

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
    setThreads({ ...threads, [mode]: threads[mode].map((t, i) => (i === activeId[mode] ? { ...t, turns: next } : t)) })
    setStreamIndex(next.length - 1)
    setDraft('')
  }

  const newThread = () => {
    const next = [...threads[mode], { createdAt: new Date(), turns: [] }]
    setThreads({ ...threads, [mode]: next })
    setActiveId({ ...activeId, [mode]: next.length - 1 })
    setStreamIndex(-1)
  }

  const selectThread = (i: number) => {
    setActiveId({ ...activeId, [mode]: i })
    setStreamIndex(-1)
  }

  return (
    <SidebarProvider
      style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}
      className="relative flex min-h-0 xl:h-full xl:w-fit xl:shrink-0"
    >
      <DesktopTrigger />

      <Sidebar side="right" className="absolute inset-y-0 h-full border-l border-rule bg-paper-sunk">
        <div className="relative flex h-full flex-col">
          <ResizeHandle onResize={setWidth} />
          <Panel
            mode={mode}
            setMode={setMode}
            turns={turns}
            threads={threads[mode]}
            activeId={activeId[mode]}
            streamIndex={streamIndex}
            draft={draft}
            setDraft={setDraft}
            send={send}
            newThread={newThread}
            selectThread={selectThread}
            lessonTitle={lessonTitle}
            lessonComplete={lessonComplete}
          />
        </div>
      </Sidebar>

      <MobileTrigger />
    </SidebarProvider>
  )
}

function DesktopTrigger() {
  const { open, setOpen } = useSidebar()
  return (
    <button
      onClick={() => setOpen(!open)}
      aria-label={open ? 'Collapse the Tutor' : 'Open the Tutor'}
      className="absolute top-3 -left-10 z-30 hidden text-ink-faint transition-[left,colors] duration-200 ease-linear hover:text-ink xl:block"
    >
      {open ? <PanelRightClose size={18} strokeWidth={1.8} /> : <PanelRightOpen size={18} strokeWidth={1.8} />}
    </button>
  )
}

function MobileTrigger() {
  const { setOpenMobile } = useSidebar()
  return (
    <button
      onClick={() => setOpenMobile(true)}
      className="label sticky bottom-0 z-20 flex shrink-0 items-center justify-center gap-2 bg-ink py-4 text-paper xl:hidden"
    >
      <MessagesSquare size={14} strokeWidth={1.8} />
      ask the tutor
    </button>
  )
}

function ResizeHandle({ onResize }: { onResize: (w: number) => void }) {
  const dragging = useRef(false)

  const move = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const w = Math.min(MAX_TUTOR_WIDTH, Math.max(MIN_TUTOR_WIDTH, window.innerWidth - e.clientX))
    onResize(w)
  }

  return (
    <div
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={move}
      onPointerUp={(e) => {
        dragging.current = false
        e.currentTarget.releasePointerCapture(e.pointerId)
      }}
      onDoubleClick={() => onResize(DEFAULT_TUTOR_WIDTH)}
      role="separator"
      aria-label="Resize the Tutor"
      aria-orientation="vertical"
      className="absolute inset-y-0 left-0 z-10 hidden w-1.5 -translate-x-1/2 cursor-col-resize touch-none hover:bg-accent-soft/60 active:bg-accent-soft xl:block"
    />
  )
}

function Panel({
  mode,
  setMode,
  turns,
  threads,
  activeId,
  streamIndex,
  draft,
  setDraft,
  send,
  newThread,
  selectThread,
  lessonTitle,
  lessonComplete,
}: {
  mode: Mode
  setMode: (m: Mode) => void
  turns: Turn[]
  threads: Thread[]
  activeId: number
  streamIndex: number
  draft: string
  setDraft: (v: string) => void
  send: () => void
  newThread: () => void
  selectThread: (i: number) => void
  lessonTitle: string
  lessonComplete: boolean
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const [atFoot, setAtFoot] = useState(true)
  const [model, setModel] = useState<(typeof MODELS)[number]>(MODELS[0])
  const [reasoning, setReasoning] = useState<(typeof REASONING)[number]>('medium')
  const [historyOpen, setHistoryOpen] = useState(false)
  const { isMobile, setOpenMobile } = useSidebar()

  const taRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight}px`
  }, [draft, historyOpen])

  const toFoot = () => requestAnimationFrame(() => scroller.current?.scrollTo({ top: 9e6, behavior: 'smooth' }))

  useEffect(() => {
    scroller.current?.scrollTo({ top: 9e6 })
  }, [mode, activeId])

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
      <SidebarHeader className="flex shrink-0 flex-row items-center gap-5 rounded-none border-b border-rule bg-transparent p-0 px-5">
        <Tabs value={mode} onValueChange={(v) => { setMode(v as Mode); setHistoryOpen(false) }}>
          <TabsList variant="line" className="group-data-horizontal/tabs:h-auto gap-5 p-0">
            <ModeTab value="tutor">tutor</ModeTab>
            <ModeTab value="tailor">tailor mode</ModeTab>
          </TabsList>
        </Tabs>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            onClick={() => setHistoryOpen((o) => !o)}
            aria-label="See previous threads"
            aria-pressed={historyOpen}
            className={cn(
              'grid size-8 place-items-center text-ink-faint transition-colors hover:bg-paper-sunk hover:text-ink',
              historyOpen && 'bg-paper-sunk text-ink',
            )}
          >
            <History size={16} strokeWidth={1.8} />
          </button>
          <button
            onClick={() => {
              setHistoryOpen(false)
              newThread()
            }}
            aria-label="Start a new thread"
            className="grid size-8 place-items-center text-ink-faint transition-colors hover:bg-paper-sunk hover:text-ink"
          >
            <Plus size={16} strokeWidth={1.8} />
          </button>
        </div>
        {isMobile && (
          <button
            onClick={() => setOpenMobile(false)}
            aria-label="Close the Tutor"
            className="grid size-8 place-items-center text-ink-faint hover:bg-paper-sunk hover:text-ink"
          >
            <X size={16} strokeWidth={2} />
          </button>
        )}
      </SidebarHeader>

      {mode === 'tailor' && !historyOpen && (
        <p className="flex shrink-0 items-start gap-2.5 border-b border-rule bg-accent-wash px-5 py-3.5 supporting text-[0.8125rem] text-ink-soft">
          <AlertTriangle size={14} strokeWidth={1.8} className="mt-0.5 shrink-0 text-accent" />
          <span>
            tailor mode rewrites files in the course folder.
            {lessonComplete
              ? ' this lesson is marked complete — editing it returns its progress to not complete.'
              : ' this lesson is not complete, so no progress changes.'}
          </span>
        </p>
      )}

      {historyOpen ? (
        <>
          <SidebarContent className="rounded-none px-3 pt-3 pb-2">
            {threadsByDate(threads).map((group) => (
              <div key={group.label}>
                <p className="label px-3 pt-3 pb-1 text-[0.625rem] font-extrabold text-ink-faint normal-case">{group.label}</p>
                {group.items.map(({ thread, i }) => (
                  <button
                    key={i}
                    onClick={() => {
                      selectThread(i)
                      setHistoryOpen(false)
                    }}
                    className="flex w-full items-center px-3 py-2 text-left text-[0.8125rem] font-normal leading-snug text-ink-soft transition-colors hover:bg-paper-raised"
                  >
                    <span className="truncate">{threadTitle(thread)}</span>
                  </button>
                ))}
              </div>
            ))}
          </SidebarContent>
          <button
            onClick={() => {
              setHistoryOpen(false)
              newThread()
            }}
            className="label flex shrink-0 items-center gap-2 border-t border-rule px-5 pt-3 pb-4 text-[0.75rem] font-[550] text-ink-soft transition-colors hover:bg-paper-raised hover:text-ink active:bg-accent-soft normal-case"
          >
            <Plus size={14} strokeWidth={1.8} />
            new thread
          </button>
        </>
      ) : (
        <>
          <SidebarContent ref={scroller} className={cn('rounded-none px-5 pt-5 pb-6', !atFoot && 'fade-foot')}>
            {turns.length === 0 ? (
              <p className="supporting text-[0.875rem] text-ink-faint">
                {mode === 'tutor'
                  ? `ask anything about “${lessonTitle}”. the tutor has read the whole course.`
                  : 'describe the change you want. the tutor names every file it will touch before it writes.'}
              </p>
            ) : (
              <div className="flex min-h-full shrink-0 flex-col justify-end gap-6">
                {turns.map((t, i) => (
                  <TurnView key={i} turn={t} streaming={i === streamIndex} />
                ))}
              </div>
            )}
          </SidebarContent>

      <SidebarFooter className="shrink-0 rounded-none p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
            toFoot()
          }}
        >
          <div className="@container border border-rule bg-paper-raised transition-shadow focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-wash">
            <textarea
              ref={taRef}
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
              placeholder={mode === 'tutor' ? 'ask the tutor…' : 'describe the change…'}
              className="max-h-32 min-h-0 w-full resize-none bg-transparent px-3 pt-2.5 supporting text-[0.9375rem] outline-none placeholder:text-ink-faint"
            />
            <div className="flex items-center justify-between gap-1 px-1.5 pb-1.5">
              <div className="flex min-w-0 items-center gap-1">
                <Picker label="Model" value={model} options={MODELS} onChange={setModel} valueIcon={(m) => <ModelIcon model={m} />} />
                <Picker
                  label="Reasoning"
                  value={reasoning}
                  options={REASONING}
                  onChange={setReasoning}
                  valueIcon={(r) => <ReasoningIcon reasoning={r} />}
                  compact
                />
              </div>
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
          </div>
        </form>
          </SidebarFooter>
        </>
      )}
    </>
  )
}

function threadTitle(t: Thread) {
  const first = t.turns.find((x) => x.from === 'student')
  return first?.text ?? 'new thread'
}

function dateGroupLabel(d: Date) {
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const days = Math.round((start(new Date()) - start(d)) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return 'this week'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase()
}

function threadsByDate(threads: Thread[]) {
  const groups: { label: string; items: { thread: Thread; i: number }[] }[] = []
  const sorted = threads
    .map((thread, i) => ({ thread, i }))
    .sort((a, b) => b.thread.createdAt.getTime() - a.thread.createdAt.getTime())
  for (const item of sorted) {
    const label = dateGroupLabel(item.thread.createdAt)
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }
  return groups
}

function ModeTab({ value, children }: { value: Mode; children: React.ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="label h-auto flex-none rounded-none border-none px-0 py-3.5 text-[0.6875rem] font-[550] text-ink-faint after:bg-accent group-data-horizontal/tabs:after:-bottom-px hover:text-ink data-active:bg-transparent data-active:text-ink normal-case"
    >
      {children}
    </TabsTrigger>
  )
}

function Picker<T extends string>({
  label,
  value,
  options,
  onChange,
  valueIcon,
  compact,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (v: T) => void
  valueIcon?: (v: T) => React.ReactNode
  compact?: boolean
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          'label h-auto min-w-0 gap-2 overflow-hidden border-none bg-transparent px-2 py-1 text-[0.625rem] font-[550] text-ink-soft shadow-none hover:bg-paper-sunk hover:text-ink data-popup-open:bg-paper-sunk data-popup-open:text-ink *:data-[slot=select-value]:truncate normal-case',
          compact && '*:data-[slot=select-value]:hidden @xs:*:data-[slot=select-value]:flex',
        )}
      >
        {valueIcon?.(value)}
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        side="top"
        sideOffset={6}
        alignItemWithTrigger={false}
        className="min-w-32 border-rule bg-paper-raised p-0 shadow-[0_12px_32px_-12px_rgba(16,15,15,0.22)]"
      >
        {options.map((o) => (
          <SelectItem
            key={o}
            value={o}
            className="label border-b border-rule-soft py-1.5 pr-9 pl-2.5 text-[0.625rem] font-[550] text-ink-soft last:border-b-0 normal-case"
          >
            <span className="flex items-center gap-2">
              {valueIcon?.(o)}
              {o}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ModelIcon({ model, className }: { model: string; className?: string }) {
  return model.toLowerCase().startsWith('gpt') ? (
    <OpenAIMark className={cn('size-3.5 text-ink', className)} />
  ) : (
    <ClaudeMark className={cn('size-3.5 text-[#D97757]', className)} />
  )
}

function ReasoningIcon({ reasoning, className }: { reasoning: (typeof REASONING)[number]; className?: string }) {
  const Icon = reasoning === 'low' ? SignalLow : reasoning === 'high' ? SignalHigh : SignalMedium
  return <Icon size={14} strokeWidth={2} className={className} />
}

function TurnView({ turn, streaming }: { turn: Turn; streaming: boolean }) {
  const { shown, done } = useStream(turn.text, streaming && turn.from === 'tutor')

  if (turn.from === 'student') {
    return (
      <div className="bg-accent px-4 py-3">
        <p className="label mb-1.5 text-white/70 normal-case">you</p>
        <p className="supporting text-[0.875rem] text-white">{turn.text}</p>
      </div>
    )
  }

  return (
    <div className="px-1">
      <p className="label mb-1.5 text-ink-faint normal-case">tutor</p>
      <p className="supporting text-[0.9375rem] text-ink-soft">
        {shown}
        {!done && <span className="ml-0.5 inline-block h-[1em] w-[3px] translate-y-0.5 bg-accent" />}
      </p>
    </div>
  )
}
