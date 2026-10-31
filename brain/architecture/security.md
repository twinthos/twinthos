# Security rules for this knowledge tree

## Never put these anywhere near this tree or GitHub
- Passwords, API keys, tokens, SSH keys
- .env contents, auth.json, config.yaml values
- Private customer records, confidential documents
- Personal conversations, regulated data

The hourly backup already excludes .env, auth.json, secrets/ and config.yaml.
Keep it that way.

## Client isolation
Client brains must be isolated from each other and from founder memory.
The founder's session is not a production environment for paying clients.
Today no client brain exists, so this is a design constraint, not a live system.

## Secrets in practice
The GitHub token exists but is read from /root/.hermes/.env when needed and is
never printed into memory, this tree, or conversation.

## Before any external write
Ask. Every time. See identity/operating-principles.md.
