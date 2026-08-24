# Octofit Tracker Frontend

This frontend uses React 19 + Vite and talks to the Octofit API through Codespaces-aware URLs.

## Required environment variable

The app expects `VITE_CODESPACE_NAME` to be defined before it can build the Codespaces API URL.

Create a `.env.local` file in this directory with:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

When it is set, the frontend requests API routes like:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/
```

If `VITE_CODESPACE_NAME` is not set, the app falls back to `http://localhost:8000` instead of generating an invalid `https://undefined-8000...` URL.
