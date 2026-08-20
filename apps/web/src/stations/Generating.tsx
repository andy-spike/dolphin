import { useEffect, useState } from 'react'
import { Check, Play, Square } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/Button'
import { StationHead } from '@/components/StationHead'
import type { Course } from '@/mock/types'

const writing = [
  'Outlining the Concept section…',
  'Working an example that fails first…',
  'Setting the hidden tests for the Code Exercise…',
  'Checking this against Lesson 2 so nothing repeats…',
]

export function GeneratingStation({
  course,
  onOpen,
  onBusy,
  onLibrary,
}: {
  course: Course
  onOpen: () => void
  onBusy: (busy: boolean) => void
  onLibrary: () => void
}) {
  const total = course.syllabus.length
  const [done, setDone] = useState(course.generated)
  const [stopped, setStopped] = useState(false)
  const [line, setLine] = useState(0)

  useEffect(() => {
    onBusy(!stopped && done < total)
    return () => onBusy(false)
  }, [stopped, done, total, onBusy])

  useEffect(() => {
    if (stopped || done >= total) return
    const step = setTimeout(() => setDone((d) => d + 1), 5200)
    const rotate = setInterval(() => setLine((l) => (l + 1) % writing.length), 1700)
    return () => {
      clearTimeout(step)
      clearInterval(rotate)
    }
  }, [done, stopped, total])

  const finished = done >= total

  return (
    <>
      <StationHead course={course} station="Generating" onLibrary={onLibrary} />

      <div className="min-h-0 flex-1 overflow-y-auto bg-paper">
        <div className="mx-auto w-full max-w-[48rem] px-6 pt-12 pb-20 md:px-10 md:pt-16">
          <header className="station-in flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <div>
              <h1 className="display max-w-[14ch] text-[clamp(1.875rem,4vw,2.5rem)]">
                {finished ? 'The Course is written.' : stopped ? 'Generation stopped.' : 'Writing your Course.'}
              </h1>
              <p className="supporting mt-5 max-w-[52ch] text-ink-soft">
                {finished
                  ? 'Every Lesson is on disk. You can start reading now, and Tailor Mode can change any of it later.'
                  : stopped
                    ? `Lessons 1 to ${done} are on disk and stay there. Resuming picks up at Lesson ${done + 1} — nothing already written is redone.`
                    : 'Each Lesson is written to its own markdown file as it finishes. You can stop at any point and resume later.'}
              </p>
            </div>
            <p className="numeral shrink-0 text-[3rem] leading-none text-ink tabular-nums">
              {done}
              <span className="text-[1.375rem] text-ink-faint">/{total}</span>
            </p>
          </header>

          <ol className="mt-12 border-t border-ink/85">
            {course.syllabus.map((s, i) => {
              const state = i < done ? 'done' : i === done && !stopped ? 'writing' : 'waiting'
              return (
                <li
                  key={s.n}
                  style={state === 'done' ? { animation: 'land 320ms var(--ease-workspace) both' } : undefined}
                  className={cn(
                    'flex items-center gap-4 border-b border-rule py-4',
                    state === 'waiting' && 'opacity-45',
                  )}
                >
                  <span className="grid w-7 shrink-0 place-items-center">
                    {state === 'done' ? (
                      <span className="grid size-5 place-items-center bg-pass text-white">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    ) : state === 'writing' ? (
                      <span className="size-2.5 animate-[lamp_1.4s_var(--ease-workspace)_infinite] bg-accent" />
                    ) : (
                      <span className="numeral text-[0.75rem] text-ink-faint">{String(s.n).padStart(2, '0')}</span>
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h2 className={cn('title text-[1.0625rem]/snug', state !== 'done' && 'font-normal text-ink-soft')}>
                      {s.title}
                    </h2>
                    {state === 'writing' && <p className="supporting mt-1 text-[0.8125rem] text-accent">{writing[line]}</p>}
                    {state === 'done' && (
                      <p className="numeral mt-1 text-[0.75rem] text-ink-faint">
                        lesson-{String(s.n).padStart(2, '0')}.md
                      </p>
                    )}
                  </div>

                  <span className="label shrink-0 text-ink-faint">
                    {state === 'done' ? `${900 + s.n * 137} words` : `${s.minutes}m`}
                  </span>
                </li>
              )
            })}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            {finished ? (
              <Button onClick={onOpen}>Start Lesson 1</Button>
            ) : stopped ? (
              <Button variant="ink" onClick={() => setStopped(false)}>
                <Play size={12} strokeWidth={2.4} className="fill-current" />
                Resume from Lesson {done + 1}
              </Button>
            ) : (
              <Button variant="danger" onClick={() => setStopped(true)}>
                <Square size={11} strokeWidth={2.6} className="fill-current" />
                Stop generating
              </Button>
            )}
            <p className="label text-ink-faint">One generation at a time</p>
          </div>
        </div>
      </div>
    </>
  )
}
