# Functionality

## Purpose
This document describes what the application must do. It is expected to evolve over time while preserving existing behavior.

## Core Features
### Gateway Management
- Create, edit, archive, and restore organization cards
- Assign organization type: area, IT Area, Tribe, Chapter, Community.
- Restrict visibility by organization (active/inactive)
- Is Landing Page at startup of the application:
  - Layout: Grid of cards representing organizations.
  - Inputs: 
    - Search bar (`searchPlaceholder` in translation), "Active Only" toggle, Type filter.
    - search bar, toggle and filter are horizontally placed above the grid of organization cards 
  - Interactions: 
    - Clicking an active organization switches to the dashboard (`handleOrgSelect`).
  - Admin Actions: 
    - `+ Add Organization` button opens the Add Org Modal (Labels: Organization Title, Owner, Description, Type, Team Code).

### Organization Card: 
  - (Admin `Menu` icon (`MoreVertical`) -> `Edit` (opens Edit Modal), `Delete` (opens confirmation).
  - random selection from a color of the background of the image of the icon out of the next list of colors: 
    - '#4D0020', '#89D6FD', '#FF6200', '#FFE100', '#D40199', '#7724FF'
- when adding a new organization to the gateway, the metric dashboard is by default injected with the values from the default.md

### Metric Tree Management
- Display the full three-layer metric tree.
- Enforce 6 fixed Layer 1 metrics.
- Enforce 6 Layer 2 metrics under each Layer 1 metric.
- Allow unlimited Layer 3 metrics under each Layer 2 metric.
- Allow metric metadata editing where permitted.
- A metriccard on all layers can be set inactive/active
- An inactive metriccard is 
  - non-clickable for layer 1 and 2
  - the edit menu only shows the active option
- only on layer 3 new metriccards can be added

### Metric Dashboard
- Dashboard Layout: 
  - Overview of metric Cards
  - has a toggle to show only active or all metric cards (including inactive) on top of the Page
- Metric Cards (`MetricCard.tsx`):
  - Menu: `MoreVertical` (abs 4 top/right): toggles menu (`Details` - opens full drill-down/detail, `Edit` - opens config modal).
  - Status Indicator: Colored dot at bottom of card, hover-popup shows (Red: <threshold, Amber: <threshold, Green: >=threshold).
  - Labels: Title, Accountable Person, Deadline, Value, Trend (e.g., "+3.5% vs prev").
  - Clickable: Clicking the card triggers `handleDrillDown` (if drill-down allowed).
  - a trend indicator is displayed left from the status indicator.
    - the trend indicator is down, up or equil
    - it is red if the value is worse compared to the previous value of the metric retrieved from the database for that specific metric
    - it is amber if the value is equal compared to the previous value of the metric retrieved from the database for that specific metric
    - it is green if the value is better compared to the previous value of the metric retrieved from the database  for that specific metric
- Metric Detail Header (`MetricDetailHeader.tsx`): (Opened via `MoreVertical` -> `Details` or Info-icon):
  - Layout: Sidebar-like panel or header area (`grid-cols-1 md:grid-cols-3`).
  - Tabs:
    - `Notes` (`FileText`): Shows list of `MetricNote` objects. List management: `Add Note` -> textarea input. History navigation: Up/Down chevron icons.
    - `Histogram` (`BarChart2`): Line chart visualization of metric history of maximum 12 datapoints.
    - `Info` (`Info`): Editable `additionalContext` textarea.
  - Save Behavior: `Save` button appears upon edit, triggers `onUpdateMetric`. Success feedback (`Saved Successfully` + Check icon).


### Configuration
- Metric Editing: `Edit` icon opens config modal.
- Fields: 
  - `Title`, `Description`.
  - `Unit`, `Target` (numeric fields).
  - `DataSource` selector (Manual, Power BI, Excel, Database).
  - Threshold entries (Red, Amber).
  - `Enabled` toggle.
  - `Decimals` setter.

### Audit & Logging
- Audit Vault Drawer: Records and displays log events (Org Switch, Org Create/Update/Delete).
- Format: Timestamp, User, Action, Details.

## Localization & Theming
- Languages: (English, Dutch, French, Spanish, German)
  - translates all the labels into the selected language
- Themes: 
  - Switchable via Configuration panel -> Theme toggle (Light/Dark).
  - when light mode is selected, the background of the main screens become white and the text black
  - when dark mode is selected, the background of the main screens become black and the text white

### Input Capture
- Support manual entry for Layer 3 metrics.
- Support external source ingestion for Layer 3 metrics.
- Support file imports.
- Show validation errors before saving.

### Calculation
- Recalculate Layer 2 metrics when Layer 3 inputs change.
- Recalculate Layer 1 metrics when Layer 2 values change.
- Keep calculation history.
- Show calculation status and last updated time.

### Dashboards
- Show current values for all metrics.
- Show progress, trend, and status by gateway.
- Allow drill-down from Layer 1 to Layer 3.
- Highlight missing or stale inputs.

### Audit and History
- Record changes to metrics and values.
- Show who edited what and when.
- Track recalculation runs.
- Keep lineage for each computed value.

## Functional Rules
- Existing functionality must remain unless the updated spec explicitly replaces it.
- New functionality should be added as new sections, not by rewriting old ones.

## Standard User Flows
1. A user opens a gateway.
2. The user views the Layer 1 metric overview.
3. The user drills into a Layer 2 metric.
4. The user edits or imports Layer 3 values.
5. The system recalculates the parent metrics.
6. The dashboard updates with the new values.

## Ai advice
- per metric card is a AI icoon (sparkle) displayed on the bottom left. 
- When clicked on the sparkle icon, an ai agent generates an advice on how to improve the metric with possible management decisions 
based upon the historical datapoints and the notes and context added to the metric.





