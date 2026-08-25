import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { StationHead } from '@/components/StationHead'
import { Masthead, opening } from '@/components/Ruled'

/**
 * A missing address is not a Fault — nothing broke, the Student simply asked
 * for a station that does not exist. So it is set as an ordinary station, and
 * it spends its rows saying where the Student can actually go.
 */
export function NotFoundStation({
  what,
  onLibrary,
  onNew,
}: {
  /** What was looked for, when the address named something specific. */
  what?: string
  onLibrary: () => void
  onNew: () => void
}) {
  return (
    <>
      <StationHead station="not found" onLibrary={onLibrary} />

      <div className="min-h-0 flex-1 overflow-y-auto bg-paper">
        <div className="mx-auto w-full max-w-[44rem] px-6 pt-20 pb-24 md:px-10 md:pt-28">
          <Masthead
            title={what ? 'no course by that id.' : 'nothing at that address.'}
            lead={
              what
                ? 'the course was deleted, or the link was written by hand. your other courses are untouched.'
                : 'every station in dolphin opens from the course library, and none of them lives at this address.'
            }
          />

          {what && (
            <p className="numeral mt-8 inline-block bg-paper-sunk px-3 py-2 text-[0.8125rem] text-ink-soft">{what}</p>
          )}

          <div className={cn('mt-12', opening)}>
            <Where term="course library" line="every course you have, and the state each one is in." />
            <Where term="new course" line="write a brief and argue with the generator about the syllabus." />
            <Where term="settings" line="harness connections, usage, and your account." />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button onClick={onLibrary}>
              back to the course library
              <ArrowRight size={14} strokeWidth={2.2} />
            </Button>
            <Button variant="quiet" onClick={onNew}>
              write a brief
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

function Where({ term, line }: { term: string; line: string }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1.5 border-b border-rule py-4">
      <p className="label w-36 shrink-0 pt-1 text-ink">{term}</p>
      <p className="supporting min-w-0 flex-1 text-[0.9375rem] text-ink-soft">{line}</p>
    </div>
  )
}
