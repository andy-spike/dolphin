# Course content lives as markdown files on disk

A Course is a folder of markdown files on the student's machine: one file per lesson, plus a small metadata record (SQLite) for progress and settings. We rejected a database as the home for lesson content.

The reason is the agent core: the Generator and the Tutor are coding-agent SDKs whose native tools read and edit files. Storing lessons as markdown files lets those agents author and revise the course directly, with no translation layer. A database would add a schema and a read/write API the agents cannot use as naturally. Metadata that is not agent-authored — progress and settings — stays in a small local database where it is easy to query.

**Consequences**: Code Exercises are also files in the course folder, so the student writes code in their own editor and the app only runs the tests.

