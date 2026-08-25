export type CourseState =
  | 'Drafting'
  | 'Generating'
  | 'Ready'
  | 'In Progress'
  | 'Complete'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'code'; lang: string; text: string }
  | { kind: 'note'; text: string }

export type WrittenExercise = {
  kind: 'written'
  id: string
  prompt: string
  answer: string
  feedback: { verdict: 'good' | 'partial'; text: string } | null
}

export type CodeExercise = {
  kind: 'code'
  id: string
  prompt: string
  file: string
  language: string
  run: 'untried' | 'running' | 'pass' | 'fail'
  passed: number
  total: number
  hint: string
}

export type Exercise = WrittenExercise | CodeExercise

export type Lesson = {
  id: string
  n: number
  module: number
  title: string
  minutes: number
  complete: boolean
  concept: Block[]
  examples: Block[]
  exercises: Exercise[]
}

export type SyllabusEntry = { n: number; module: number; title: string; minutes: number; note: string }

export type Module = { n: number; title: string }

export type ChatTurn = { from: 'student' | 'generator'; text: string }

export type Source = { label: string; kind: 'url' | 'file' }

export type Course = {
  id: string
  topic: string
  goal: string
  difficulty: Difficulty
  timeBudget: string
  sources: Source[]
  webSearch: boolean
  state: CourseState
  folder: string
  modules: Module[]
  syllabus: SyllabusEntry[]
  chat: ChatTurn[]
  lessons: Lesson[]
  /** Lessons already written to disk while the Course State is Generating. */
  generated: number
}

/** The signed-in Student. In Dolphin the Student is the only kind of user. */
export type Student = {
  name: string
  email: string
  initials: string
  joined: string
}

/**
 * One Harness the Student can connect. A Harness Connection is the Student's
 * revocable permission for Dolphin to run Agent Jobs on that subscription.
 */
export type Harness = {
  id: string
  name: string
  vendor: string
  /** What Dolphin runs on this Harness once it is connected. */
  runs: string
  connection: null | {
    account: string
    plan: string
    connectedOn: string
    lastJob: string
    jobs: number
  }
}

/**
 * One line of Usage. Dolphin sets no ceiling of its own, so a line is a count
 * and a period — never a fraction of an allowance.
 */
export type UsageLine = {
  id: string
  label: string
  hint: string
  month: number
  total: number
}

export type AgentJobRecord = {
  id: string
  kind: 'Generator' | 'Tutor' | 'Tailor Mode'
  course: string
  detail: string
  at: string
  harness: string
}
