import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { courses as initialCourses } from '@/mock/data'
import type { Course } from '@/mock/types'
import type { FaultKind } from '@/components/Fault'

type BriefEdit = Pick<Course, 'topic' | 'goal' | 'difficulty' | 'timeBudget' | 'sources' | 'webSearch'>

type DemoStore = {
  courses: Course[]
  toggleComplete: (course: Course, index: number) => void
  saveBrief: (id: string, brief: BriefEdit) => void
  deleteCourse: (id: string) => void
  /** A Course Lock: Tailor Mode holds the Course while it rewrites files. */
  locked: boolean
  setLocked: (v: boolean) => void
  empty: boolean
  setEmpty: (v: boolean) => void
  fault: FaultKind
  setFault: (f: FaultKind) => void
  busy: boolean
  setBusy: (b: boolean) => void
}

const DemoContext = createContext<DemoStore | null>(null)

/** Holds the mock Course Library and reviewer-only demo switches across route navigation. */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState(initialCourses)
  const [empty, setEmpty] = useState(false)
  const [fault, setFault] = useState<FaultKind>('none')
  const [busy, setBusy] = useState(false)
  const [locked, setLocked] = useState(false)

  const saveBrief = useCallback((id: string, brief: BriefEdit) => {
    setCourses((cs) => cs.map((c) => (c.id === id ? { ...c, ...brief } : c)))
  }, [])

  const deleteCourse = useCallback((id: string) => {
    setCourses((cs) => cs.filter((c) => c.id !== id))
  }, [])

  const toggleComplete = useCallback((course: Course, index: number) => {
    setCourses((cs) =>
      cs.map((c) =>
        c.id !== course.id
          ? c
          : { ...c, lessons: c.lessons.map((l, i) => (i === index ? { ...l, complete: !l.complete } : l)) },
      ),
    )
  }, [])

  return (
    <DemoContext.Provider value={{ courses, toggleComplete, saveBrief, deleteCourse, locked, setLocked, empty, setEmpty, fault, setFault, busy, setBusy }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemoStore() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemoStore must be used within DemoProvider')
  return ctx
}
