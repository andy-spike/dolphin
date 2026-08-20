# Dolphin

A hosted web application that generates personalized Courses. The Student describes what they want to learn in a Brief, iterates on a Syllabus with the Generator, then studies the generated Course with help from the Tutor.

## Language

### Course authoring

**Course**:
A structured set of lessons and exercises, generated for one student from a Brief and a Syllabus.
_Avoid_: Program, class, curriculum

**Brief**:
The student's starting input: the Topic, the Goal, a Difficulty, a Time Budget, any Sources, and whether live web search is enabled. The web-search toggle governs both the Generator and the Tutor.
_Avoid_: Request, prompt, form

**Difficulty**:
How advanced the course should be, chosen in the Brief (for example beginner, intermediate, advanced).
_Avoid_: Level, complexity

**Time Budget**:
How much total study time the student has, chosen in the Brief. It shapes how many lessons the course has.
_Avoid_: Duration, hours, pace

**Source**:
A document the Generator must use when writing a Course. It is a public HTTPS URL or an uploaded PDF, markdown, or text file.
_Avoid_: Reference, resource, link

**Topic**:
The subject the student wants to learn, given in the Brief (for example "system design").
_Avoid_: Subject, theme

**Goal**:
What the student wants to achieve at the end of the course, given in the Brief.
_Avoid_: Objective, aim

**Syllabus**:
The agreed outline of the Course. The Student and the Generator iterate on it in a free chat until they agree. It is kept with the Course and both agents read it.
_Avoid_: Outline, plan, table of contents

**Course Folder**:
The stored set of markdown files that holds a Course: one file per Lesson, plus the files of any Code Exercises.
_Avoid_: Project folder, directory, workspace, local folder

**Course States**:
The lifecycle of a course: Drafting (the Syllabus chat), Generating, Ready, In Progress, and Complete. Generation is resumable: an interrupted generation continues from the first missing lesson.
_Avoid_: Status, phase, stage

### Studying

**Lesson**:
A single unit of learning content inside a course. A lesson has fixed sections: Concept, Examples, then Exercises.
_Avoid_: Chapter, module, page

**Exercise**:
A practice task inside a course. There are two kinds: a Written Exercise and a Code Exercise.
_Avoid_: Task, activity, quiz

**Written Exercise**:
An exercise the student answers in free-form text. The Tutor checks the answer and gives feedback.
_Avoid_: Question, quiz, short answer

**Code Exercise**:
An Exercise the Student completes by writing code. Dolphin runs its hidden tests in a Sandbox. The Student sees pass/fail and a hint on failure, not the test source.
_Avoid_: Coding task, kata, programming exercise

**Student**:
The signed-in person who studies a Course. In Dolphin, the Student is the only kind of user.
_Avoid_: User, learner, pupil

**Course Library**:
The stored set of a Student's Courses and their Progress.
_Avoid_: Dashboard, home, catalog

**Progress**:
The student's record of which lessons are complete. A lesson is complete when the student marks it done. When Tailor Mode edits a completed lesson, that lesson's mark returns to not complete.
_Avoid_: Completion, advancement, tracking

### Agents

**Harness**:
The AI coding system that runs an Agent Job.
_Avoid_: Provider, model, SDK

**Harness Connection**:
A Student's revocable permission for Dolphin to use one Harness with that Student's subscription.
_Avoid_: Login, token, credential

**Agent Job**:
One running Generator, Tutor, or Tailor Mode request.
_Avoid_: Background job, run, task

**Sandbox**:
An isolated computer in which a Harness or a Code Exercise runs.
_Avoid_: Container, VM, environment

**Course Lock**:
The temporary rule that prevents every other Agent Job from changing a Course while Tailor Mode works on it.
_Avoid_: Mutex, lease, edit lock

**Quota**:
A Student's fixed beta allowance for agent work and Code Exercise runs.
_Avoid_: Limit, allowance, budget

**Generator**:
The agent that builds the Syllabus and the Course from the Brief.
_Avoid_: Builder, author, course-maker

**Tutor**:
The agent that explains course topics, checks Written Exercises, and answers the student's questions.
_Avoid_: Assistant, teacher, coach

**Tailor Mode**:
A mode of the Tutor in which it modifies an existing course at the student's request. It may change any lesson, including one the student already finished.
_Avoid_: Edit mode, customize
