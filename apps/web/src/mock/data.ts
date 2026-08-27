
import type {
  AgentJobRecord,
  Course,
  CourseState,
  Harness,
  Lesson,
  UsageLine,
  Student,
} from './types'

const lesson = (
  n: number,
  module: number,
  title: string,
  minutes: number,
  complete: boolean,
  concept: Lesson['concept'],
  examples: Lesson['examples'],
  exercises: Lesson['exercises'],
): Lesson => ({ id: `l${n}`, n, module, title, minutes, complete, concept, examples, exercises })

function autoModules(course: Course, size = 3) {
  course.modules = []
  course.lessons.forEach((l, i) => {
    const n = Math.floor(i / size) + 1
    if (!course.modules.some((m) => m.n === n)) course.modules.push({ n, title: `Part ${n}` })
    l.module = n
  })
}

const systemDesign: Course = {
  id: 'system-design',
  topic: 'Distributed systems for backend interviews',
  goal: 'Reason out loud about replication and consistency without hand-waving',
  difficulty: 'intermediate',
  timeBudget: '8 hours',
  sources: [
    { label: 'Designing Data-Intensive Applications, ch. 5–9', kind: 'file' },
    { label: 'jepsen.io/consistency', kind: 'url' },
  ],
  webSearch: true,
  state: 'In Progress',
  folder: '~/dolphin/distributed-systems-for-backend-interviews',
  generated: 6,
  modules: [
    { n: 1, title: 'Why distribution happens' },
    { n: 2, title: 'Correctness at scale' },
    { n: 3, title: 'Consensus and practice' },
  ],
  syllabus: [
    { n: 1, module: 1, title: 'Why one machine is not enough', minutes: 45, note: 'Failure, not scale, is the reason.' },
    { n: 2, module: 1, title: 'Replication: leaders and followers', minutes: 70, note: 'Sync vs async, and what each costs you.' },
    { n: 3, module: 2, title: 'Quorums and the consistency you actually get', minutes: 90, note: 'Where R + W > N comes from.' },
    { n: 4, module: 2, title: 'Partitioning and rebalancing', minutes: 75, note: 'Hash vs range, and the hot-shard trap.' },
    { n: 5, module: 3, title: 'Consensus without the folklore', minutes: 90, note: 'Raft as a state machine you can draw.' },
    { n: 6, module: 3, title: 'Designing under a real interview clock', minutes: 60, note: 'One end-to-end rehearsal.' },
  ],
  chat: [
    {
      from: 'generator',
      text: 'I read both Sources. Your Goal is arguing out loud, so I have weighted the Syllabus toward reasoning rather than coverage — six Lessons, 7h 10m against your 8 hour Time Budget, leaving room to slow down on Lesson 3.',
    },
    {
      from: 'student',
      text: 'Lesson 5 worries me. Every Raft explanation I have read starts with the paper and I stall on leader election.',
    },
    {
      from: 'generator',
      text: 'Then I will invert it. Lesson 5 opens with a broken system — two nodes both believing they lead — and derives election from the failure you can see. The paper appears at the end as confirmation, not as the entry point. I have also moved 15 minutes from Lesson 4 into it.',
    },
    { from: 'student', text: 'Good. And keep the interview rehearsal at the end, I want it last.' },
    {
      from: 'generator',
      text: 'Kept as Lesson 6. Nothing else moved. The Syllabus on the left is what I will write to disk — say the word and I will generate the Course.',
    },
  ],
  lessons: [
    lesson(1, 1, 'Why one machine is not enough', 45, true, [], [], []),
    lesson(2, 1, 'Replication: leaders and followers', 70, true, [], [], []),
    lesson(
      3,
      2,
      'Quorums and the consistency you actually get',
      90,
      false,
      [
        {
          kind: 'p',
          text: 'A quorum is the smallest number of nodes that must answer before you are willing to call an operation done. It is not a performance setting. It is the claim you are making about what a reader is allowed to miss.',
        },
        {
          kind: 'p',
          text: 'Every quorum system has three numbers. N is how many replicas hold a copy. W is how many must acknowledge a write. R is how many must answer a read. You choose R and W; N is usually fixed by whoever pays for the machines.',
        },
        { kind: 'h', text: 'Where R + W > N comes from' },
        {
          kind: 'p',
          text: 'The rule is not a convention, and it is not a heuristic tuned by benchmarking. It falls out of counting. If a write landed on W nodes and a read consults R nodes, then the two sets must share at least one node whenever R + W is larger than N — because N nodes cannot hold two disjoint sets that big. That shared node is the one holding the newest value.',
        },
        {
          kind: 'note',
          text: 'The overlap guarantees the new value is present in what you read. It does not tell you how to recognise it. That is what version numbers are for, and it is the part interviews probe.',
        },
        {
          kind: 'p',
          text: 'Notice what the rule does not promise. It says nothing about writes that are still in flight, nothing about a node that acknowledged and then lost its disk, and nothing about two writes issued concurrently by different clients. Each of those is a separate problem with a separate fix, and collapsing them into "we use quorums" is the single most common way a candidate loses the thread.',
        },
        { kind: 'h', text: 'Reading the dials' },
        {
          kind: 'p',
          text: 'Because you pick R and W independently, the same N supports very different systems. Raising W buys durability and costs write latency, because you wait on more machines. Raising R buys freshness and costs read latency. Most read-heavy systems therefore run W high and R low, and accept that a read now depends on the write path having done its job.',
        },
        {
          kind: 'list',
          items: [
            'N = 3, W = 3, R = 1 — fast reads, but a single unavailable replica stops all writes.',
            'N = 3, W = 2, R = 2 — the balanced default; survives one node down for both reads and writes.',
            'N = 3, W = 1, R = 1 — fastest, and no overlap at all: reads may legally return stale data.',
          ],
        },
      ],
      [
        {
          kind: 'p',
          text: 'Here is the overlap argument as code. It is worth running once, because the failure it prints is the intuition.',
        },
        {
          kind: 'code',
          lang: 'ts',
          text: `type Node = { id: number; value: string; version: number }

function write(nodes: Node[], w: number, value: string, version: number) {
  // Acknowledge from the first w replicas that answer.
  for (const node of nodes.slice(0, w)) {
    node.value = value
    node.version = version
  }
}

function read(nodes: Node[], r: number): Node {
  // Consult r replicas and keep the highest version seen.
  return nodes
    .slice(-r)
    .reduce((newest, node) => (node.version > newest.version ? node : newest))
}`,
        },
        {
          kind: 'p',
          text: 'With N = 3, W = 2 and R = 2 the two slices always share a node, so the read observes version 2. Drop W to 1 and the slices can miss each other entirely — the read returns the stale value and no error is raised anywhere.',
        },
        {
          kind: 'code',
          lang: 'ts',
          text: `const nodes = [a, b, c]        // N = 3, all at version 1

write(nodes, 2, 'blue', 2)     // W = 2 → a, b
read(nodes, 2).value           // R = 2 → b, c  ⇒ 'blue'   (2 + 2 > 3)

write(nodes, 1, 'green', 3)    // W = 1 → a
read(nodes, 1).value           // R = 1 → c     ⇒ 'blue'   (1 + 1 ≤ 3)`,
        },
        {
          kind: 'p',
          text: 'The second read is not a bug in the code. It is the configuration doing exactly what it promised. That distinction — a wrong answer that is nonetheless correct behaviour — is the thing to be able to say out loud.',
        },
      ],
      [
        {
          kind: 'written',
          id: 'e1',
          prompt:
            'A service runs N = 5 with W = 3 and R = 3. An engineer proposes dropping R to 1 to cut read latency, arguing that W = 3 already means "most of the cluster has it". Say what they are getting right, and what they are giving up.',
          answer:
            'They are right that W = 3 makes the write durable — it survives two nodes dying. But R = 1 makes 3 + 1 = 4, which is not greater than 5, so the read set and write set can be disjoint. A read can legally hit two replicas that never received the write. Durability and freshness are separate properties and W only buys the first.',
          feedback: {
            verdict: 'good',
            text: 'You separated durability from recency, which is the whole point of the question — and 3 + 1 ≤ 5 is the right way to show it rather than assert it. One thing to add in an interview: name the size of the stale window. Under read repair or anti-entropy the divergence is bounded and temporary, and saying so shows you know the mitigation exists without claiming it makes the read consistent.',
          },
        },
        {
          kind: 'code',
          id: 'e2',
          prompt:
            'Implement `isOverlapping(n, r, w)` and `staleRisk(n, r, w)`. The first reports whether the read and write sets are guaranteed to share a node. The second returns how many replicas a read could consult while still missing the newest write — 0 when the quorum overlaps. Handle the degenerate cases: r or w of 0, and values larger than n.',
          file: 'exercises/03-quorum/quorum.ts',
          language: 'TypeScript',
          run: 'fail',
          passed: 5,
          total: 7,
          hint: 'Five of seven pass. Both failures pass r or w outside the range 1…n. Decide what an out-of-range quorum means before you decide what to return — a read of 0 replicas has not read anything, so it cannot be said to overlap.',
        },
      ],
    ),
    lesson(4, 2, 'Partitioning and rebalancing', 75, false, [], [], []),
    lesson(5, 3, 'Consensus without the folklore', 90, false, [], [], []),
    lesson(6, 3, 'Designing under a real interview clock', 60, false, [], [], []),
  ],
}

const library: Course[] = [
  systemDesign,
  {
    id: 'rust',
    topic: 'Rust ownership and lifetimes',
    goal: 'Stop fighting the borrow checker on a real codebase',
    difficulty: 'beginner',
    timeBudget: '12 hours',
    sources: [],
    webSearch: false,
    state: 'Complete',
    folder: '~/dolphin/rust-ownership-and-lifetimes',
    generated: 9,
    modules: [],
    syllabus: [],
    chat: [],
    lessons: Array.from({ length: 9 }, (_, i) =>
      lesson(i + 1, 1, `Lesson ${i + 1}`, 60, true, [], [], []),
    ),
  },
  {
    id: 'postgres',
    topic: 'Reading the Postgres query planner',
    goal: 'Diagnose a slow query from EXPLAIN alone',
    difficulty: 'advanced',
    timeBudget: '6 hours',
    sources: [{ label: 'use-the-index-luke.com', kind: 'url' }],
    webSearch: true,
    state: 'Generating',
    folder: '~/dolphin/reading-the-postgres-query-planner',
    generated: 3,
    modules: [
      { n: 1, title: 'Reading the plan' },
      { n: 2, title: 'Scan and join strategy' },
      { n: 3, title: 'Diagnosis' },
    ],
    syllabus: [
      { n: 1, module: 1, title: 'What EXPLAIN is actually printing', minutes: 40, note: '' },
      { n: 2, module: 1, title: 'Costs, rows, and where estimates come from', minutes: 55, note: '' },
      { n: 3, module: 2, title: 'Scan nodes: seq, index, bitmap', minutes: 65, note: '' },
      { n: 4, module: 2, title: 'Join strategies and why one was chosen', minutes: 70, note: '' },
      { n: 5, module: 3, title: 'Reading a plan that lied to you', minutes: 60, note: '' },
    ],
    chat: [],
    lessons: [],
  },
  {
    id: 'wasm',
    topic: 'WebAssembly from the instruction level up',
    goal: 'Hand-write and debug a .wat module',
    difficulty: 'advanced',
    timeBudget: '10 hours',
    sources: [],
    webSearch: false,
    state: 'Drafting',
    folder: '~/dolphin/webassembly-from-the-instruction-level-up',
    generated: 0,
    modules: [{ n: 1, title: 'Instruction-level WebAssembly' }],
    syllabus: [
      { n: 1, module: 1, title: 'The stack machine underneath', minutes: 50, note: 'No registers, no heap you did not build.' },
      { n: 2, module: 1, title: 'Reading .wat until it stops looking foreign', minutes: 65, note: '' },
      { n: 3, module: 1, title: 'Linear memory, and who is allowed to touch it', minutes: 70, note: '' },
    ],
    chat: [
      {
        from: 'generator',
        text: 'Three Lessons so far, 3h 5m of your 10 hour Time Budget. I have stopped there because the rest depends on one thing I do not know yet.',
      },
      {
        from: 'student',
        text: 'Which is?',
      },
      {
        from: 'generator',
        text: 'Whether you want to hand-write .wat throughout, or compile from Rust and read what comes out. They are different courses. The first is slower and teaches the instruction set properly; the second gets you debugging real modules by Lesson 4 but leaves gaps you will hit later.',
      },
      {
        from: 'student',
        text: 'Hand-written. The whole point is that compiled output is opaque to me right now.',
      },
      {
        from: 'generator',
        text: 'Then I will keep every module hand-written and add four more Lessons on control flow, tables and the JS boundary. Give me a moment and I will extend the outline on the left.',
      },
    ],
    lessons: [],
  },
  {
    id: 'ml',
    topic: 'Transformers without the maths anxiety',
    goal: 'Implement attention from scratch in NumPy',
    difficulty: 'intermediate',
    timeBudget: '15 hours',
    sources: [{ label: 'The Illustrated Transformer', kind: 'url' }],
    webSearch: true,
    state: 'Ready',
    folder: '~/dolphin/transformers-without-the-maths-anxiety',
    generated: 11,
    modules: [],
    syllabus: [],
    chat: [],
    lessons: Array.from({ length: 11 }, (_, i) =>
      lesson(i + 1, 1, `Lesson ${i + 1}`, 70, false, [], [], []),
    ),
  },
  {
    id: 'typography',
    topic: 'Typography for interface designers',
    goal: 'Set a type scale I can defend in a review',
    difficulty: 'beginner',
    timeBudget: '4 hours',
    sources: [],
    webSearch: false,
    state: 'In Progress',
    folder: '~/dolphin/typography-for-interface-designers',
    generated: 5,
    modules: [],
    syllabus: [],
    chat: [],
    lessons: Array.from({ length: 5 }, (_, i) =>
      lesson(i + 1, 1, `Lesson ${i + 1}`, 45, i < 2, [], [], []),
    ),
  },
]

for (const course of [library[1], library[4], library[5]]) autoModules(course)

export const courses = library
export const openCourse = systemDesign

export const tutorThread = [
  {
    from: 'student' as const,
    text: 'Why is it R + W > N and not R + W ≥ N? The ≥ version feels like it should be enough.',
  },
  {
    from: 'tutor' as const,
    text: 'Count the nodes. With N = 3 and R = W = 1 you get R + W = 2, which is less than 3, and the sets clearly miss. Now take R = W = 1.5 — you cannot, but suppose R + W = 3 exactly, say R = 1 and W = 2. The write sits on nodes a and b. The read may consult node c alone. Three nodes, sets of size 2 and 1, and no shared member. Equality leaves exactly enough room for the two sets to sit side by side without touching. You need one more node than the cluster can spare, which is what "greater than" buys you.',
  },
  {
    from: 'student' as const,
    text: 'So the strictness is about the pigeonhole, not about safety margin.',
  },
  {
    from: 'tutor' as const,
    text: 'Exactly that. It is a counting argument, and it is worth saying so in an interview — it signals you derived the rule rather than memorised it.',
  },
]

export const tailorThread = [
  {
    from: 'student' as const,
    text: 'Lesson 3 spends too long on the derivation. Add a worked Dynamo-style example instead.',
  },
  {
    from: 'tutor' as const,
    text: 'I can do that. It touches two files: it trims the second half of Concept in lesson-03.md and adds a third block to Examples. Lesson 3 is not marked complete, so no Progress changes.',
  },
]

export const generatingLog = [
  { n: 1, title: 'What EXPLAIN is actually printing', words: 1180, done: true },
  { n: 2, title: 'Costs, rows, and where estimates come from', words: 1640, done: true },
  { n: 3, title: 'Scan nodes: seq, index, bitmap', words: 1370, done: true },
  { n: 4, title: 'Join strategies and why one was chosen', words: 0, done: false },
  { n: 5, title: 'Reading a plan that lied to you', words: 0, done: false },
]

const body = systemDesign.lessons[2]
for (const course of library) {
  for (const l of course.lessons) {
    if (l.concept.length === 0) {
      l.concept = body.concept
      l.examples = body.examples
      l.exercises = body.exercises
    }
  }
}

export const student: Student = {
  name: 'Andy Sanabria',
  email: 'ansanabria12@gmail.com',
  initials: 'AS',
  joined: 'March 2026',
}

export const harnesses: Harness[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    vendor: 'Anthropic',
    runs: 'the generator, the tutor and tailor mode',
    connection: {
      account: 'ansanabria12@gmail.com',
      plan: 'Claude Max',
      connectedOn: '4 March 2026',
      lastJob: '2 hours ago',
      jobs: 61,
    },
  },
  {
    id: 'codex',
    name: 'Codex',
    vendor: 'OpenAI',
    runs: 'the generator, the tutor and tailor mode',
    connection: null,
  },
]

export const usage: UsageLine[] = [
  {
    id: 'agent-jobs',
    label: 'agent jobs',
    hint: 'one generator, tutor or tailor mode request, run on your own harness subscription.',
    month: 74,
    total: 318,
  },
  {
    id: 'sandbox-runs',
    label: 'sandbox runs',
    hint: 'one code exercise checked against its hidden tests. dolphin pays for these.',
    month: 23,
    total: 96,
  },
]

export const agentJobs: AgentJobRecord[] = [
  {
    id: 'j1',
    kind: 'Tutor',
    course: 'Distributed systems for backend interviews',
    detail: 'checked a written exercise in lesson 3',
    at: '2 hours ago',
    harness: 'Claude Code',
  },
  {
    id: 'j2',
    kind: 'Generator',
    course: 'Reading the Postgres query planner',
    detail: 'wrote lessons 1 to 3',
    at: 'yesterday',
    harness: 'Claude Code',
  },
  {
    id: 'j3',
    kind: 'Tailor Mode',
    course: 'Distributed systems for backend interviews',
    detail: 'rewrote the concept section of lesson 5',
    at: 'yesterday',
    harness: 'Claude Code',
  },
  {
    id: 'j4',
    kind: 'Generator',
    course: 'WebAssembly from the instruction level up',
    detail: 'drafted the syllabus',
    at: '3 days ago',
    harness: 'Claude Code',
  },
  {
    id: 'j5',
    kind: 'Tutor',
    course: 'Typography for interface designers',
    detail: 'answered 4 questions in lesson 2',
    at: '5 days ago',
    harness: 'Claude Code',
  },
]

export const lifecycle: { state: CourseState; line: string }[] = [
  { state: 'Drafting', line: 'you and the generator argue about the syllabus.' },
  { state: 'Generating', line: 'the course is written, one lesson at a time.' },
  { state: 'Ready', line: 'every lesson is on disk, nothing read yet.' },
  { state: 'In Progress', line: 'you are partway through, the tutor is beside you.' },
  { state: 'Complete', line: 'every lesson marked done. the folder stays yours.' },
]
