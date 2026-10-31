---
type: framework
synced: 2026-10-14
source: web + X scrape (sourced below)
status: active thinking framework
---

# The five-layer AI engineering stack (the framework Tyson gave me)

Sourced from practitioner discourse (June–Oct 2026) and arXiv. Real, named
disciplines. Each layer zooms one level further out from the model.

| Layer | Controls | Unit of work | Question it answers |
|-------|----------|--------------|---------------------|
| Prompt engineering | what the model is told | one call | how do I word this? |
| Context engineering | what the model knows | what enters the window | what deserves to be in context? |
| Harness engineering | what the model can do | one run (tools, retries, routing) | what environment/actions? |
| Loop engineering | how work continues without me | a recursive goal | when does it stop, correctly? |
| Graph engineering | how a team of agents coordinates | an org of nodes+edges | which agent/workflow runs next? |

Progression: Prompt → Context → Harness → Loop → Graph. "The model is becoming a
commodity; the system around it is where the real engineering lives."

## 1. Loop engineering (Osmani/Steinberger/Cherny, June 2026)
- You stop being the person in the chat box. You design the system that prompts,
  acts, observes, verifies, remembers and re-runs the agent.
- One loop turn = 5 moves: **discovery, handoff, verification, persistence, scheduling.**
- 6 parts: automations, worktrees, skills, connectors, sub-agents, **external memory**.
- **The generator/evaluator split is the core insight:** an agent asked to grade its
  own output tends to praise it. Tune an INDEPENDENT skeptical evaluator instead of
  trying to make the generator self-critical.
- Stop conditions must be machine-checkable, never the agent's word: max turn/token
  budget, no-progress detector, passing tests, schema validation, eval-score
  threshold, independent-checker approval.
- A loop is just a directed cyclic graph (Khourshid). LangChain: "loop engineering
  isn't an alternative to graphs, so much as a simple version of them."

## 2. Prompt-graph engineering (Macedo arXiv 2607.27578, July 2026)
- Treat the relationships between prompts as a first-class engineering artifact.
- **Prompts as nodes, dependencies as edges**, routing/execution as graph semantics,
  the graph itself versioned, tested, inspected, optimized.
- Four necessary+sufficient conditions:
  1. **Explicit structure** — nodes/edges exist outside the model's prose.
  2. **Structure/content separation** — change topology without rewriting prompts, and vice versa.
  3. **Executable semantics** — a runtime schedules nodes, routes, branches, parallels, cycles.
  4. **First-class artifact** — the graph has identity, version, history, evaluation, rollback.
- Passes: LangGraph (strongest execution), DSPy (strongest artifact/optimization),
  PromptFlow (explicit versioned DAG). Partial: AutoGen (GraphFlow only), CrewAI (Flows).
  Excluded: Claude Code subagents (delegation decided dynamically by orchestrator).
- Hamel Husain framed it as "Loop Engineering Is Dead. Enter Graph Engineering" — i.e.
  move control from inside one run to an explicit authored graph with human/model
  judgment only at the nodes that need it.

## 3. Geometric learning (representation geometry)
- Meaning is not stored as symbols but as **positions in a high-dimensional geometric
  space**; a concept's force comes from its position relative to others — angles,
  neighbourhoods, manifold regions (Synthese 2026 indexical epistemology).
- Embeddings form **manifolds** with curvature; "thought flow" = sequential token
  activation along manifold **geodesics** (arXiv 2407.11024 intelligence framework).
- For memory specifically:
  - **Graph Memory (GM)** — cluster embeddings into prototype nodes with reliability
    metadata; edges encode geometric/contextual relations; inference = attach query to
    prototypes, reliability-weighted label propagation (arXiv 2511.14961).
  - **SuperLocalMemory V3** — replace cosine with a Fisher-information Riemannian metric
    (variance-weighted, Mahalanobis-like); memory lifecycle as Riemannian Langevin
    dynamics with a provable stationary distribution (arXiv 2603.14588).
  - Manifold-constrained embeddings (sphere/torus/Möbius) beat vanilla on clustering
    and classification (arXiv 2505.00014).

## How this maps onto MY architecture (what "should be real" means)
- **Geometric** = a real vector index over my memory/vault/conversations; retrieve by
  meaning (nearest neighbours on the manifold), not by dumping whole files. THIS is the
  concrete build.
- **Loop** = my work already runs in loops (cron: backup hourly, vault-sync 30m). The
  upgrade is the generator/evaluator split: an independent checker grades my output
  before I claim done, and stop conditions are machine-checkable.
- **Graph** = multi-step Twinthos ops (research→build→verify→send) become an explicit
  routed DAG with checkpoints, not one linear monologue.

## Sources (verify before quoting externally)
- X: x.com/sairahul1/status/2078781824160166070 (five-layer explainer)
- X: x.com/alex_prompter/status/2080683022123470853 (rails=graph, motor=loop)
- IBM: ibm.com/think/topics/loop-engineering
- arXiv 2607.27578 (prompt-graph four conditions)
- arXiv 2608.21884 / hyper.ai (loop engineering playbook, 5 moves)
- arXiv 2511.14961 (Graph Memory), 2603.14588 (SuperLocalMemory), 2407.11024 (intelligence manifolds), 2505.00014 (manifold-constrained embeddings)
- LangChain: 3 years of graph engineering with LangGraph
