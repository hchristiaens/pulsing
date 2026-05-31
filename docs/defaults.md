# Cockpit Configuration
# Hierarchical metrics structure
# Layer 1 -> Layer 2 -> Layer 3

- id: layer1_1
  title: "Operational Efficiency"
  description: "Core productivity and throughput across all divisions"
  target: 95
  weight: 0.4
  value: 88.5
  deadline: "2026-06-30"
  accountablePerson: "John Doe"
  thresholds: { red: 70, amber: 85 }
  subMetrics:
    - id: l2_1_1
      title: "Mfg Velocity"
      description: "Production speed"
      target: 100
      metrics: 30
      thresholds: { red: 70, amber: 90 }
      value: 92.4
      accountablePerson: "John Doe"
      deadline: "2026-05-30"
      subMetrics:
        - { id: l3_1_1_1, title: "Line A Throughput", value: 95.2, unit: "%", target: 100, deadline: "2026-06-15", thresholds: { red: 80, amber: 90 } }
        - { id: l3_1_1_2, title: "Line B Downtime", value: 2.1, unit: "h", target: 5, deadline: "2026-06-10", thresholds: { red: 4, amber: 2 } }

    - { id: l2_1_2, title: "Logistics Latency", description: "Supply chain lag", target: 5, metrics: 30, thresholds: { red: 3, amber: 4.5 }, value: 4.1, accountablePerson: "David Smith", deadline: "2026-05-15" }
    - { id: l2_1_3, title: "Resource Load", description: "Asset utilization", target: 85, metrics: 30, value: 82.1 }
    - { id: l2_1_4, title: "Quality Yield", description: "Defect-free rate", target: 99, metrics: 30, value: 98.2, accountablePerson: "Elena Petrov" }
    - { id: l2_1_5, title: "Energy Intensity", description: "Power per unit", target: 10, metrics: 30, value: 9.2 }
    - { id: l2_1_6, title: "Waste Reduction", description: "Recycling rate", target: 90, metrics: 30, value: 87.5 }

- id: layer1_2
  title: "Financial Health"
  description: "Revenue, margin and burn rate metrics"
  target: 1000000
  weight: 0.3
  value: 950000
  accountablePerson: "John Doe"
  subMetrics:
    - { id: l2_2_1, title: "Net Margin", description: "Profit percentage", target: 25, metrics: 30, value: 23.5, accountablePerson: "Liam O'Connor" }
    - { id: l2_2_2, title: "Working Capital", description: "Liquidity ratio", target: 1.5, metrics: 30, value: 1.4 }
    - { id: l2_2_3, title: "Burn Rate", description: "Monthly expenses", target: 500000, metrics: 30, value: 480000 }
    - { id: l2_2_4, title: "Rev Growth", description: "MoM growth rate", target: 15, metrics: 30, value: 12.8 }
    - { id: l2_2_5, title: "DSO Index", description: "Days sales outstanding", target: 45, metrics: 30, value: 42.0 }
    - { id: l2_2_6, title: "Tax Efficiency", description: "Effective rate", target: 20, metrics: 30, value: 19.5 }

- id: layer1_3
  title: "People"
  description: "From WellBeing over OHI to NPS score"
  target: 85
  weight: 0.15
  value: 78.2
  accountablePerson: "John Doe"
  subMetrics:
    - { id: l2_3_1, title: "NPS Score", description: "Promoter baseline", target: 75, metrics: 30, value: 72.0, accountablePerson: "Alex Wong" }
    - { id: l2_3_2, title: "Churn Velocity", description: "Attrition speed", target: 2, metrics: 30, value: 2.1 }
    - { id: l2_3_3, title: "Acquisition Cost", description: "CAC average", target: 150, metrics: 30, value: 165.5, accountablePerson: "Tariq Aziz" }

- id: layer1_4
  title: "System Resilience"
  description: "Technical debt and uptime"
  target: 99.99
  weight: 0.1
  value: 99.95
  accountablePerson: "John Doe"
  subMetrics:
    - { id: l2_4_1, title: "App Uptime", description: "Service availability", target: 99.9, metrics: 30, value: 99.92, accountablePerson: "Kenji Tanaka" }
    - { id: l2_4_2, title: "Database Load", description: "Query performance", target: 60, metrics: 30, value: 45.3 }
    - { id: l2_4_3, title: "Dev Velocity", description: "Merge frequency", target: 25, metrics: 30, value: 22.0 }

- id: layer1_5
  title: "Strategic"
  description: "R&D and market expansion"
  target: 100
  weight: 0.05
  value: 85.0
  accountablePerson: "John Doe"
  subMetrics:
    - { id: l2_5_1, title: "R&D Spend", description: "Investment ratio", target: 15, metrics: 30, value: 14.2 }
    - { id: l2_5_2, title: "New Markets", description: "Regions active", target: 12, metrics: 30, value: 10, accountablePerson: "Omar Khaled" }
    - { id: l2_5_3, title: "Patent Filing", description: "IP generation", target: 5, metrics: 30, value: 4 }

- id: layer1_6
  title: "Compliance Risk"
  description: "Risk score under control"
  target: 100
  weight: 0.05
  value: 98.0
  accountablePerson: "John Doe"
  subMetrics:
    - { id: l2_6_1, title: "GDPR Status", description: "Privacy health", target: 100, metrics: 30, value: 100, accountablePerson: "Sven Erikson" }
    - { id: l2_6_2, title: "Carbon Footprint", description: "CO2 per unit", target: 50, metrics: 30, value: 52.0 }
    - { id: l2_6_3, title: "Safety Record", description: "Incident-free days", target: 365, metrics: 30, value: 312, accountablePerson: "Linda Johnson" }
