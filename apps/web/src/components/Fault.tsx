import { AlertTriangle } from 'lucide-react'
import type { ReactNode } from 'react'

export type FaultKind = 'none' | 'agent' | 'docker' | 'source'

const Path = ({ children }: { children: ReactNode }) => (
  <code className="numeral bg-fail/8 px-1.5 py-0.5 text-[0.8125rem] text-fail">{children}</code>
)

/** Every Fault names the problem, then the recovery. Never a modal. */
const faults: Record<Exclude<FaultKind, 'none'>, { problem: string; recovery: ReactNode }> = {
  agent: {
    problem: 'no agent found on this machine.',
    recovery: (
      <>
        dolphin drives the coding agent you already have. install <Path>codex</Path> or <Path>claude</Path>, then reload
        this page — nothing in your course library is affected.
      </>
    ),
  },
  docker: {
    problem: 'docker is not running, so code exercises cannot be tested.',
    recovery: <>start docker and press run tests again. reading, written exercises and the tutor all work without it.</>,
  },
  source: {
    problem: 'one source could not be read.',
    recovery: (
      <>
        <Path>jepsen.io/consistency</Path> returned 404. the generator wrote this course from your remaining sources —
        edit the brief to replace it.
      </>
    ),
  },
}

export function Fault({ kind }: { kind: FaultKind }) {
  if (kind === 'none') return null
  const { problem, recovery } = faults[kind]
  return (
    <div role="alert" className="flex shrink-0 items-start gap-3 border-b border-fail/20 bg-fail-wash px-5 py-3.5 md:px-7">
      <AlertTriangle size={16} strokeWidth={1.9} className="mt-0.5 shrink-0 text-fail" />
      <p className="supporting text-[0.875rem] text-ink-soft">
        <span className="font-semibold text-fail">{problem}</span> {recovery}
      </p>
    </div>
  )
}
