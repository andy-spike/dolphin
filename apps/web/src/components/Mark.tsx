/**
 * The Dolphin mark: a letter, not a logo — paper on ink, the same two
 * materials the rest of the workspace is made of.
 */
export function Mark({ size = 30 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.62 }}
      className="grid shrink-0 place-items-center rounded-[9px] bg-ink font-semibold tracking-[-0.03em] text-paper leading-none"
    >
      <span style={{ transform: 'translateY(-0.01em)' }}>D</span>
    </span>
  )
}
