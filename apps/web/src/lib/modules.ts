import type { Module } from '@/mock/types'

export function groupByModule<T extends { module: number }>(items: T[], modules: Module[]) {
  const groups: { module: Module; items: T[] }[] = []
  for (const item of items) {
    const last = groups[groups.length - 1]
    if (last && last.module.n === item.module) {
      last.items.push(item)
      continue
    }
    const mod = modules.find((m) => m.n === item.module)
    if (mod) groups.push({ module: mod, items: [item] })
  }
  return groups
}
