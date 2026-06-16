# Security Specification

## Data Invariants
- An organization cannot exist without a title.
- Metrics belong to an organization and must not be orphaned.
- Audit logs are immutable records.

## The "Dirty Dozen" Payloads
1. Attempt to create org with no title.
2. Attempt to create org with teamCode already in use.
3. Attempt to update org isActive without admin role.
4. Attempt to create metric without valid orgId.
5. Attempt to create metric as anonymous user.
6. Attempt to modify Audit Log Entry.
7. Attempt to set metric status to "GREEN" without meeting threshold.
8. Attempt to delete organization.
9. Attempt to inject SQL as description in metric.
10. Attempt to read other organization's metrics as unauthorized user.
11. Attempt to create audit log as user.
12. Attempt to update Metric Hierarchy with arbitrary structure.

## Test Runner (firestore.rules.test.ts)
(To be implemented in the testing phase)
