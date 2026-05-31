# Architecture

## Purpose
A high-performance 3-layer metric monitoring system with AI-driven predictive insights and deep drill-down capabilities.
This application manages organizations, communities, teams, and groups through a fixed metric hierarchy that can be rebuilt from documentation.

## Core Principles
- Markdown files are the source of truth.
- The metric model is deterministic and rebuildable.
- Existing functionality must be preserved unless explicitly changed in `functionality.md`.
- Technical decisions live in this file; product behavior lives in `functionality.md`.

## System Overview
The app has two main layers:
- Gateway layer: represents groups, teams, and communities.
- Metric engine layer: computes a three-layer pyramid of metrics.

The gateway layer scopes access, ownership, and visibility. The metric engine stores metric definitions, captures inputs, computes aggregates, and exposes values to the UI and APIs.

## Recommended Stack
- Frontend: React.
- Backend: Firebase.
- Database: relational database with support for hierarchical relations.
- Background jobs: for metric recalculation and imports.
- Authentication: role-based access control.
- Storage: database for structured data, object storage for files if needed.

## Main Domains
### Gateway
A gateway is a container for a community. It defines:
- name,
- team code in the format T000000
- type,
- attached metric set
- icon
- color.

### Metric
A metric is a measurable unit with:
- id,
- name,
- layer,
- parent metric,
- child metrics,
- value,
- unit,
- formula,
- source type,
- update cadence,
- status.

### Data Source
A data source can be:
- manual input,
- external API,
- file import,
- derived calculation.
- sql DataSource
- excel file with reference to tab and cell

## Layering Rules
- Layer 1 contains exactly 6 fixed top metrics.
- Each Layer 1 metric has exactly 6 Layer 2 metrics.
- Each Layer 2 metric has one or more Layer 3 metrics.
- Layer 3 metrics are leaf inputs from external or manual sources.
- Layer 3 values roll up into Layer 2 values.
- Layer 2 values roll up into Layer 1 values.

## Computation Rules
- Every metric should have a clearly defined aggregation strategy.
- Parent metric values are derived from children unless manually overridden by an explicit rule.
- Calculations must be deterministic and traceable.
- Keep calculation history so recomputation can be audited.
- Support recalculation after any upstream change.

## Data Model Guidance
Use these tables or equivalents:
- `gateways`
- `metric_definitions`
- `metric_values`
- `metric_relations`
- `data_sources`
- `manual_entries`
- `imports`
- `calculation_runs`
- `audit_events`

## API Guidance
Expose endpoints for:
- creating and managing gateways,
- listing metric trees,
- submitting Layer 3 values,
- triggering recalculation,
- reading aggregate values,
- auditing metric lineage.

## UI Guidance
The UI should show:
- gateway selector,
- metric pyramid tree,
- drill-down from Layer 1 to Layer 3,
- source details for each metric,
- manual edit forms for leaf metrics,
- history and calculation status.

## Non-Functional Requirements
- Rebuildability: the app must be generated again from the Markdown spec.
- Traceability: every computed value must be explainable.
- Extensibility: new features should be added without breaking existing ones.
- Maintainability: keep documentation modular.
- Security: enforce access control by gateway and role.

## Build Instructions For AI
When generating the app from this documentation:
1. Read all Markdown files first.
2. Implement the architecture exactly as specified here.
3. Treat `functionality.md` as the evolving feature source.
4. Preserve existing behavior unless the docs explicitly change it.
5. Do not invent extra layers or remove fixed metrics.

## Changelog
- v1: initial architecture draft.
