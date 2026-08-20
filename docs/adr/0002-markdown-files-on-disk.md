# Course content remains markdown in cloud storage

A Course remains a Course Folder of markdown files: one file per Lesson plus the files of any Code Exercises. Dolphin stores the Course Folder in cloud storage, not on the Student's machine. It copies the Course Folder into a temporary Sandbox when the Generator, Tutor, or Tailor Mode needs file access.

Markdown keeps Course content readable, portable, and natural for a Harness to edit. Dolphin stores relational Course data and Progress separately. A Student can export a Course as a markdown ZIP and permanently delete their stored data.

**Consequences**: Code Exercise submissions and hidden tests are also files in a temporary Course Folder. The Student does not need a local editor, local Docker, or local files.
