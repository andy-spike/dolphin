# Dolphin

A local web application that generates personalized courses. The student describes what they want to learn in a Brief, iterates on a Syllabus with the Generator, then studies the generated Course with help from the Tutor.

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
A document the generator must use when writing the course. It is a URL or a local file (for example a PDF or a markdown file).
_Avoid_: Reference, resource, link

**Topic**:
The subject the student wants to learn, given in the Brief (for example "system design").
_Avoid_: Subject, theme

**Goal**:
What the student wants to achieve at the end of the course, given in the Brief.
_Avoid_: Objective, aim

**Syllabus**:
The agreed outline of the course. The student and the Generator iterate on it in a free chat until they agree. It is written to a file in the Course Folder, and both agents read it.
_Avoid_: Outline, plan, table of contents

**Course Folder**:
The folder of markdown files on disk that holds a course: one file per lesson, plus the files of any Code Exercises.
_Avoid_: Project folder, directory, workspace

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
An exercise the student completes by writing code. The code lives in a file inside the Course Folder and the student edits it in their own editor. The app runs the tests in a sandbox, using a Docker image for the exercise's language. Tests are hidden: the student sees pass/fail and a hint on failure, not the test source.
_Avoid_: Coding task, kata, programming exercise

**Student**:
The person who studies a course. In this application, the student is the only kind of user.
_Avoid_: User, learner, pupil

**Course Library**:
The stored set of the student's courses and their progress.
_Avoid_: Dashboard, home, catalog

**Progress**:
The student's record of which lessons are complete. A lesson is complete when the student marks it done. When Tailor Mode edits a completed lesson, that lesson's mark returns to not complete.
_Avoid_: Completion, advancement, tracking

### Agents

**Generator**:
The agent that builds the Syllabus and the Course from the Brief.
_Avoid_: Builder, author, course-maker

**Tutor**:
The agent that explains course topics, checks Written Exercises, and answers the student's questions.
_Avoid_: Assistant, teacher, coach

**Tailor Mode**:
A mode of the Tutor in which it modifies an existing course at the student's request. It may change any lesson, including one the student already finished.
_Avoid_: Edit mode, customize
