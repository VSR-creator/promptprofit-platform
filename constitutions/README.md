# PromptProfit Constitutions

## Purpose

The Constitutions define the permanent architectural laws governing PromptProfit.

They are the highest engineering authority in this repository.

Every engineer, AI worker, and contributor must understand and follow them before implementing any feature.

---

# Order of Authority

1. Company Constitution
2. Database Constitution
3. System Constitution
4. Approved Architecture Decision Records (ADRs)
5. Source Code

If implementation conflicts with a Constitution, the Constitution is considered correct unless formally amended.

---

# Engineering Principle

Every feature begins with architecture.

The required workflow is:

```text
Constitution

↓

Architecture

↓

Database

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

Integration Test

↓

Commit
```

---

# Constitutional Rules

Every contribution must:

- Preserve architectural consistency.
- Respect layer boundaries.
- Avoid duplicate sources of truth.
- Follow the Database Constitution.
- Follow the System Constitution.

---

# Constitutional Amendments

Constitutions are intentionally stable.

Changes require:

1. Updating the Constitution.
2. Recording the reasoning in an ADR.
3. Updating the implementation.
4. Committing both together.

---

# Long-Term Vision

PromptProfit is engineered as an AI-native software company.

The Constitutions ensure that every future engineer and autonomous AI worker builds on the same architectural foundation.
