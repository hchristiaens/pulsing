# AI Build Instructions

## Purpose
This file tells AI Studio how to rebuild the application from the Markdown spec files in this repository.

## Required Inputs
AI Studio must read these files before generating or updating code:
- `architecture.md`
- `domain-model.md`
- `functionality.md`
- this file: `ai-build-instructions.md`

## Source of Truth Rules
- `architecture.md` defines the technical structure and non-functional constraints.
- `domain-model.md` defines entities, hierarchy, relations, and calculation rules.
- `functionality.md` defines user-facing behavior and product scope.
- If there is any conflict, `architecture.md` takes precedence over implementation details, and `functionality.md` takes precedence over inferred behavior.

## Rebuild Policy
When rebuilding the app from scratch:
1. Parse all Markdown files first.
2. Generate the app to match the documented architecture exactly.
3. Generate the domain model exactly as documented.
4. Implement only the functionality described in `functionality.md`.
5. Do not invent features, entities, or layers not explicitly described in the spec.
6. Do not remove existing behaviors unless the spec explicitly says to replace them.

## Stability Rules
- Preserve all existing functionality unless a newer version of `functionality.md` explicitly changes it.
- Add new functionality as incremental changes.
- Do not rename core entities unless the spec changes the naming.
- Keep the 3-layer pyramid intact at all times.
- Keep the six fixed Layer 1 metrics intact at all times.

## Build Sequence
AI Studio should follow this order:
1. Build the data model.
2. Build the metric calculation engine.
3. Build gateway management and permissions.
4. Build manual and external input flows for Layer 3.
5. Build recalculation and audit history.
6. Build dashboards and drill-down views.
7. Validate against the Markdown spec.

## Implementation Constraints
- Layer 1 must contain exactly 6 fixed metrics.
- Each Layer 1 metric must have exactly 6 Layer 2 metrics.
- Each Layer 2 metric must have at least 1 Layer 3 metric.
- Layer 3 metrics must be leaf nodes.
- Parent metric values must be derived from child values unless a rule explicitly allows manual override.
- Every computed value must be traceable to its inputs.

## File Management Rules
- Treat the Markdown files as living specifications.
- When the product changes, update `functionality.md` first.
- Update `domain-model.md` only when the data model changes.
- Update `architecture.md` only when the technical architecture changes.
- Do not overwrite older decisions without recording the reason in the changelog.

## Change Handling
When a change request is received:
1. Read the existing Markdown files.
2. Detect whether the change is functional, architectural, or domain-related.
3. Update only the relevant Markdown file.
4. Preserve unrelated behavior.
5. Regenerate the code from the updated Markdown set.

## Output Expectations
AI Studio should produce:
- a working application,
- matching data structures,
- matching UI flows,
- matching metric computation logic,
- matching permissions and audit behavior,
- and tests where appropriate.

## Verification Checklist
Before finishing a build, verify that:
- all fixed metrics exist,
- the metric tree is complete,
- Layer 3 values roll up correctly,
- recalculation works,
- gateways are isolated correctly,
- audit history is preserved,
- no undocumented feature was added.

## Changelog
- v1: initial AI build instructions.