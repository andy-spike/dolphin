# Course content remains markdown in cloud storage

A Course is a Course Folder of markdown files. It has one file per Lesson plus the files for any Code Exercises. Dolphin stores the Course Folder in cloud storage, not on the Student's machine. Dolphin copies the folder into a temporary Sandbox when the Generator, Tutor, or Tailor mode needs file access.

Markdown keeps Course content readable and portable, and it is natural for a Harness to edit. Dolphin stores relational Course data and Progress separately. A Student can export a Course as a markdown ZIP and permanently delete their stored data.

**Consequences**: Code Exercise submissions and hidden tests are also files in a temporary Course Folder. The Student does not need a local editor, local Docker, or local files.
