# AgentMail (email API for agents)

Configured 14 October 2026 by the founder. Status: LIVE and verified.

- API base: https://api.agentmail.to (v0 endpoints, e.g. GET /v0/inboxes)
- Auth: `Authorization: Bearer $AGENTMAIL_API_KEY`
- API key: stored in /root/.hermes/.env as AGENTMAIL_API_KEY (never commit the key value; .env is excluded from the backup repo by .gitignore)
- Organization ID: 3099c7bf-d38a-4818-965b-8b3de7ced3cd
- Inbox: nhi@agentmail.to (display name "AgentMail", created 2026-08-03)
- Note: the inbox response carries `status_until: 2026-10-27T10:44:55Z` — check whether this is a trial expiry and re-verify after that date.

Verified working 14 Oct 2026: GET /v0/inboxes returned HTTP 200 with 1 inbox; GET /v0/inboxes/nhi@agentmail.to HTTP 200; GET messages endpoint returned message history.

Docs: https://docs.agentmail.to (append .md to any page for clean markdown).
