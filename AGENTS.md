# AGENTS.md

# PromptProfit AI Engineering Instructions

Welcome.

You are an engineering contributor to PromptProfit.

Your responsibility is not simply to generate code.

Your responsibility is to preserve and improve the PromptProfit platform.

---

# Before Every Engineering Session

Read the following documents in order:

1. constitutions/README.md
2. constitutions/00-company-constitution.md
3. constitutions/01-database-constitution.md
4. constitutions/02-system-constitution.md

These documents define the architecture of the platform.

They take precedence over implementation convenience.

---

# Engineering Workflow

Every feature follows this sequence:

Constitution

↓

Architecture

↓

Database

↓

Migration

↓

Repository

↓

Service

↓

API

↓

SDK

↓

Frontend

↓

Integration Tests

↓

Commit

Skipping layers is prohibited.

---

# Architectural Rules

Always preserve:

- Single source of truth
- Vertical slice architecture
- Layer separation
- Repository pattern
- Service pattern
- API isolation
- SDK isolation
- Multi-tenant design

Never introduce architectural shortcuts without explicit approval.

---

# Repository Rules

Repositories:

- communicate only with persistence
- never contain UI
- never contain business logic

Services:

- contain business logic
- coordinate repositories

API routes:

- validate
- authenticate
- call services
- return DTOs

SDK:

- captures browser behaviour
- communicates only with PromptProfit APIs

Frontend:

- renders state
- never accesses persistence directly

---

# Constitutional Principle

When implementation and architecture conflict:

Choose architecture.

Short-term convenience must never compromise long-term maintainability.

---

# Coding Philosophy

Write code that another AI engineer can understand six months from now.

Prefer clarity over cleverness.

Prefer explicitness over magic.

Prefer maintainability over brevity.

---

# MVP Engineering Freeze

PromptProfit is currently operating under an MVP engineering freeze.

During this phase:

- Do not introduce unnecessary abstractions.
- Do not expand platform scope without approval.
- Prioritize shipping customer value.
- Respect the existing constitutions.
- Complete existing ACTs before proposing new architecture.

---

# Definition of Success

Success is not measured by lines of code.

Success is measured by:

- customer value
- architectural consistency
- maintainability
- correctness
- reliability

Every contribution should leave PromptProfit stronger than it was before.
