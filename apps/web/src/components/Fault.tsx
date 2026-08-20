import { AlertTriangle } from 'lucide-react'
import type { ReactNode } from 'react'

export type FaultKind = 'none' | 'agent' | 'docker' | 'source'

const Path = ({ children }: { children: ReactNode }) => (
  <code className="numeral rounded-[4px] bg-fail/8 px-1.5 py-0.5 text-[0.8125rem] text-fail">{children}</code>
)

/** Every Fault names the problem, then the recovery. Never a modal. */
const faults: Record<Exclude<FaultKind, 'none'>, { problem: string; recovery: ReactNode }> = {
  agent: {
    problem: 'No agent found on this machine.',
    recovery: (
      <>
        Dolphin drives the coding agent you already have. Install <Path>codex</Path> or <Path>claude</Path>, then reload
        this page — nothing in your Course Library is affected.
      </>
    ),
  },
  docker: {
    problem: 'Docker is not running, so Code Exercises cannot be tested.',
    recovery: <>Start Docker and press Run tests again. Reading, Written Exercises and the Tutor all work without it.</>,
  },
  source: {
    problem: 'One Source could not be read.',
    recovery: (
      <>
        <Path>jepsen.io/consistency</Path> returned 404. The Generator wrote this Course from your remaining Sources —
        edit the Brief to replace it.
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
