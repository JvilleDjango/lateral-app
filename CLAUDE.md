# Claude Project Guide

Follow `AGENTS.md` for repository conventions and verification commands. Reusable audit procedures live in `.agents/skills/`.

Available slash-command workflows:

- `/senior-fe-review`
- `/accessibility-audit`
- `/architecture-report`
- `/release-readiness`

Do not make speculative findings. Inspect the diff and surrounding implementation, cite `path:line`, and distinguish confirmed defects from questions or residual risks.
