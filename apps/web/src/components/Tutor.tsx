import { useEffect, useRef, useState } from 'react'
import { ArrowUp, AlertTriangle, History, MessagesSquare, PanelRightClose, PanelRightOpen, Plus, SignalHigh, SignalLow, SignalMedium, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStream } from '@/lib/useStream'
import { tutorThread, tailorThread } from '@/mock/data'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, useSidebar } from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Turn = { from: 'student' | 'tutor'; text: string }
type Thread = { createdAt: Date; turns: Turn[] }
type Mode = 'tutor' | 'tailor'

const MODELS = ['sonnet 4.5', 'opus 4.5', 'haiku 4.5', 'gpt 4.5'] as const
const REASONING = ['low', 'medium', 'high'] as const

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000)

// Seed extra Tutor threads on older days so the grouped history reads like a real list.
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
// ponytail: fixed default, not the old xl:23rem/2xl:27rem responsive step. Add a resize-observer default if that's missed.
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

/** Sits just outside the sidebar's left edge, so it slides with it as the Tutor resizes or collapses. */
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

/** Drags the Tutor's left edge. Width is computed from the viewport's right edge, since the sidebar sits flush against it. */
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

  // The newest turn is what the Student came back for; open on it.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 9e6 })
  }, [mode, activeId])

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

/** The thread's title is its first Student message, or a placeholder for an empty one. */
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

/** Newest first, bucketed by day so the list reads as sections instead of one flat pile. */
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

function ClaudeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  )
}

function OpenAIMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 260" fill="currentColor" className={className} aria-hidden="true">
      <path d="M239.184 106.203a64.72 64.72 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.72 64.72 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.67 64.67 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.77 64.77 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483m-97.56 136.338a48.4 48.4 0 0 1-31.105-11.255l1.535-.87l51.67-29.825a8.6 8.6 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601M37.158 197.93a48.35 48.35 0 0 1-5.781-32.589l1.534.921l51.722 29.826a8.34 8.34 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803M23.549 85.38a48.5 48.5 0 0 1 25.58-21.333v61.39a8.29 8.29 0 0 0 4.195 7.316l62.874 36.272l-21.845 12.636a.82.82 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405zm179.466 41.695l-63.08-36.63L161.73 77.86a.82.82 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.54 8.54 0 0 0-4.4-7.213m21.742-32.69l-1.535-.922l-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.72.72 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391zM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87l-51.67 29.825a8.6 8.6 0 0 0-4.246 7.367zm11.868-25.58L128.067 97.3l28.188 16.218v32.434l-28.086 16.218l-28.188-16.218z" />
    </svg>
  )
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
  // Tutor speaks in the margin: a name and prose, no container competing with it.
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
