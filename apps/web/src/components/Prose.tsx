import type { Block } from '@/mock/types'

/** Lesson prose. One measure, one face, and more air above a heading than below it. */
export function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'h':
            return (
              <h4 key={i} className="title mt-12 mb-4 text-[1.1875rem]/[1.35] first:mt-0">
                {b.text}
              </h4>
            )
          case 'p':
            return (
              <p key={i} className="reading mt-5 first:mt-0">
                {b.text}
              </p>
            )
          case 'list':
            return (
              <ul key={i} className="mt-6 space-y-3">
                {b.items.map((item, j) => (
                  <li key={j} className="reading relative pl-7 text-[0.9375rem] text-ink-soft">
                    <span className="absolute top-[0.82em] left-0 h-px w-4 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            )
          case 'note':
            return (
              <p key={i} className="reading mt-7 rounded-[10px] bg-paper-sunk px-5 py-4 text-[0.9375rem] text-ink-soft">
                {b.text}
              </p>
            )
          case 'code':
            return <Code key={i} lang={b.lang} text={b.text} />
        }
      })}
    </>
  )
}

export function Code({ lang, text }: { lang: string; text: string }) {
  return (
    <figure className="mt-7 overflow-hidden rounded-[12px] border border-rule bg-paper-sunk">
      <figcaption className="label flex items-center justify-between border-b border-rule bg-paper-raised px-4 py-2.5 text-ink-faint">
        {lang}
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4">
        <code className="font-mono text-[0.8125rem]/[1.75] text-ink">{text}</code>
      </pre>
    </figure>
  )
}
