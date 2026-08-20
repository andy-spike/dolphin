# Dolphin is a hosted web application

Dolphin runs as a private-beta web application on Cloudflare Workers. A Student signs in with email/password or Google OAuth, connects a Harness subscription, and studies Courses in a browser. We rejected a local web server because Students must be able to try Dolphin without installing Dolphin or a Harness.

**Consequences**: Dolphin owns the application data, account access, Sandbox coordination, Quotas, export, and permanent deletion. The Student still owns their Course content through export and deletion controls.
