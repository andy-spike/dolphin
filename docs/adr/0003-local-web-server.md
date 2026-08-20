# The app is a local web server, not a packaged desktop app

Dolphin ships as a local web server the student starts and then opens in their browser at localhost. We rejected packaging it as a desktop app (Tauri or Electron).

A packaged desktop shell would feel more like an installed app and could launch the agent SDKs and sandbox more tightly, but it adds a build and distribution step and platform-specific concerns. For a single student running the app on their own machine, a local server is simpler to build and run. The web UI stays identical, so we can wrap it in a desktop shell later if that ever becomes necessary.
