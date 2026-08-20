import { useCallback, useState } from 'react'
import { Rail } from '@/components/Rail'
import { Fault, type FaultKind } from '@/components/Fault'
import { LibraryStation } from '@/stations/Library'
import { BriefStation } from '@/stations/Brief'
import { SyllabusStation } from '@/stations/Syllabus'
import { GeneratingStation } from '@/stations/Generating'
import { LessonStation } from '@/stations/Lesson'
import { CourseCloseStation } from '@/stations/CourseClose'
import { courses as allCourses } from '@/mock/data'
import { DemoBar } from '@/DemoBar'
import type { Course } from '@/mock/types'

type Station =
  | { at: 'library' }
  | { at: 'brief' }
  | { at: 'syllabus'; course: Course }
  | { at: 'generating'; course: Course }
  | { at: 'lesson'; course: Course; index: number }
  | { at: 'close'; course: Course }

/** The Course State decides the station. The Student never navigates to one. */
const stationFor = (course: Course): Station => {
  switch (course.state) {
    case 'Drafting':
      return { at: 'syllabus', course }
    case 'Generating':
      return { at: 'generating', course }
    case 'Complete':
      return { at: 'close', course }
    default: {
      const next = course.lessons.findIndex((l) => !l.complete)
      return { at: 'lesson', course, index: next === -1 ? 0 : next }
    }
  }
}

export default function App() {
  const [courses, setCourses] = useState(allCourses)
  const [station, setStation] = useState<Station>({ at: 'library' })
  const [empty, setEmpty] = useState(false)
  const [fault, setFault] = useState<FaultKind>('none')
  const [busy, setBusy] = useState(false)
  const onBusy = useCallback((b: boolean) => setBusy(b), [])
  const health = fault === 'agent' ? 'down' : busy ? 'working' : 'ready'

  const open = 'course' in station ? station.course : null
  const progress = open?.lessons.length
    ? open.lessons.filter((l) => l.complete).length / open.lessons.length
    : 0

  const toggleComplete = (course: Course, index: number) => {
    setCourses((cs) =>
      cs.map((c) =>
        c.id !== course.id
          ? c
          : {
              ...c,
              lessons: c.lessons.map((l, i) =>
                i === index ? { ...l, complete: !l.complete } : l,
              ),
            },
      ),
    )
  }

  const live = open ? (courses.find((c) => c.id === open.id) ?? open) : null

  return (
    <div className="flex h-dvh overflow-hidden bg-paper">
      {/* THESIS: Inky Learning Workspace — a study surface built the way Flexoki itself is presented: warm paper, true ink, a soft sans at modest sizes, colour used sparingly but meaningfully. OWN-WORLD: two self-hosted faces — Figtree Variable for every word read (scale from weight 400/500/600 and tracking, no display cut, capped at 3.25rem) and JetBrains Mono for the machine voice; paper #FFFCF0, ink #100F0F, hairline rules #E6E4D9. Colour does two jobs and no others: blue #205EA6 is action, focus and control, and each of the five Course States owns a Flexoki hue running cool → warm → green across the lifecycle. STORY: the Student scans a set index where every row wears its Course State, writes a Brief as a ruled sheet, argues an outline into shape, then reads one 39rem column with section names hanging in the margin, walking Lessons on the arrow keys. FIRST VIEWPORT: a "Course / Library" masthead over numbered rows, each ending in a per-lesson spine in its State's hue. FINISH: unreviewed is unfinished — this build ends with a browser pass at desktop and mobile, a contrast check on every State tone, and a DESIGN.md that matches what shipped */}
      <Rail
        health={health}
        atLibrary={station.at === 'library'}
        open={live}
        progress={progress}
        onLibrary={() => setStation({ at: 'library' })}
        onOpen={() => live && setStation(stationFor(live))}
        mock={<DemoBar empty={empty} onEmpty={setEmpty} fault={fault} onFault={setFault} />}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <Fault kind={fault} />

        {station.at === 'library' && (
          <LibraryStation
            courses={empty ? [] : courses}
            onOpen={(c) => setStation(stationFor(c))}
            onNew={() => setStation({ at: 'brief' })}
          />
        )}

        {station.at === 'brief' && (
          <BriefStation
            onDraft={() => setStation({ at: 'syllabus', course: courses[0] })}
          />
        )}

        {station.at === 'syllabus' && (
          <SyllabusStation
            course={station.course}
            onGenerate={() => setStation({ at: 'generating', course: courses[2] })}
          />
        )}

        {station.at === 'generating' && (
          <GeneratingStation
            course={station.course}
            onBusy={onBusy}
            onOpen={() => setStation({ at: 'lesson', course: courses[0], index: 2 })}
          />
        )}

        {station.at === 'lesson' && live && (
          <LessonStation
            course={live}
            index={station.index}
            onStep={(i) => setStation({ ...station, index: i })}
            onToggleComplete={() => toggleComplete(station.course, station.index)}
            dockerDown={fault === 'docker'}
          />
        )}

        {station.at === 'close' && (
          <CourseCloseStation
            course={station.course}
            onReread={() => setStation({ at: 'lesson', course: station.course, index: 0 })}
            onLibrary={() => setStation({ at: 'library' })}
          />
        )}
      </main>
    </div>
  )
}
