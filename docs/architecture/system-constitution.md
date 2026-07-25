# PromptProfit System Constitution v1.0

**Status:** Ratified

---

# Mission

The PromptProfit System Constitution defines how software is engineered across the entire platform.

Every component—from the browser SDK to AI workers—must conform to these architectural principles.

The objective is consistency, maintainability, scalability, and autonomous AI-assisted development.

---

# Article I — Layered Architecture

Every feature follows the same engineering pipeline.

```
Architecture

↓

Domain Model

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

Integration Test
```

Skipping layers is prohibited.

---

# Article II — Dependency Direction

Dependencies flow only downward.

```
Frontend

↓

Browser SDK

↓

API Routes

↓

Services

↓

Repositories

↓

Database
```

Lower layers never depend on higher layers.

---

# Article III — Single Responsibility

Each layer owns one responsibility.

**Repository**

* Reads and writes data.
* Contains no business rules.

**Service**

* Implements business logic.
* Coordinates repositories.

**API**

* Validates requests.
* Calls services.
* Returns DTOs.

**SDK**

* Captures browser behaviour.
* Talks only to APIs.

**UI**

* Displays state.
* Never accesses persistence directly.

---

# Article IV — Domain-Driven Features

Every capability is organized by feature.

Example:

```
installation/

    installation-types.ts

    installation-repository.ts

    installation-service.ts

    installation-events.ts

    installation-state.ts
```

Features own their logic.

Cross-feature coupling is minimized.

---

# Article V — API Rules

Every endpoint follows:

```
Validate

↓

Authenticate

↓

Call Service

↓

Return DTO
```

API routes never contain SQL.

API routes never contain business rules.

---

# Article VI — Repository Rules

Repositories are the only components allowed to communicate with persistence.

Repositories never:

* import UI
* import SDK
* call APIs

Repositories only communicate with storage.

---

# Article VII — Services

Services orchestrate behaviour.

Services may:

* call multiple repositories
* enforce workflows
* perform calculations
* emit domain events

Services never know about UI rendering.

---

# Article VIII — Browser SDK

The SDK owns browser behaviour.

Responsibilities include:

* session creation
* event buffering
* event publishing
* verification
* conversation triggering

The SDK never contains business logic.

---

# Article IX — AI Workers

Every AI worker follows the same lifecycle.

```
Observe

↓

Think

↓

Decide

↓

Act

↓

Learn
```

Examples:

* Decision Engine
* Conversation Engine
* Revenue Engine
* Audit Engine
* Optimisation Engine

---

# Article X — Testing

Every feature requires:

* Repository tests
* Service tests
* API tests
* Integration tests

Critical workflows must be reproducible.

---

# Article XI — Engineering Workflow

Every ACT follows:

```
Design

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

UI

↓

Integration

↓

Commit
```

---

# Definition of Done

A feature is complete only when:

✓ Architecture approved

✓ Database implemented

✓ Repository complete

✓ Service complete

✓ API complete

✓ SDK integrated

✓ UI connected

✓ Tests passing

✓ Documentation updated

---

# Closing Principle

PromptProfit is engineered as a system, not a collection of files.

Consistency compounds.

Every future engineer—human or AI—must extend the platform without violating this Constitution.
