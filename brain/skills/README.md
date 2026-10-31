# Skills index

Hermes already has 35 skills at /root/.hermes/skills. Four are Twinthos-specific:
- twinthos-self-doctor
- twinthos-visual-qa
- business/twinthos-brand
- business/twinthos-motion-reel

Rule from the brief: do NOT create dozens of overlapping skills. Only add one
when it has a clear, testable function.

## Candidates that are genuinely missing today
1. knowledge-retrieval — given a task, find the right files in this tree and
   cite them, instead of loading everything.
2. task-verification — prove a result (HTTP status, measured geometry, commit
   SHA) before reporting done; includes the CDN propagation wait.

Neither is built yet. Build only when there is a real repeat task to serve.
