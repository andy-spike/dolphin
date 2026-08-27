import { useEffect, useState } from 'react'

export function useStream(text: string, enabled: boolean, cps = 260) {
  const [n, setN] = useState(enabled ? 0 : text.length)

  useEffect(() => {
    if (!enabled) return setN(text.length)
    setN(0)
    const started = performance.now()
    let frame = 0
    const tick = () => {
      const shown = Math.floor(((performance.now() - started) / 1000) * cps)
      setN(Math.min(shown, text.length))
      if (shown < text.length) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, enabled, cps])

  return { shown: text.slice(0, n), done: n >= text.length }
}
