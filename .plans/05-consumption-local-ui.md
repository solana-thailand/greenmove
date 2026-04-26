# 05 - Consumption Local UI Components

## Status: DONE

## Goal
Decompose the `Consumption.tsx` page into local components under `app/src/components/features/consumption/` that work with both mock and on-chain data, following the pattern established by `devices/` and `blockchain/` features.

## Current State
- `Consumption.tsx` is a monolithic page with inline mock data only
- `app/src/components/features/consumption/` has only a `.gitkeep`
- On-chain hooks already exist: `useOnchainDevices`, `useOnchainRecords`, `useBlockchainData`
- Account parsing and program constants are ready in `lib/`

## Architecture

```
useConsumptionData (new hook)
  ├── isMock → mock solar data (existing mock/solar.ts)
  └── !isMock → useOnchainDevices + useOnchainRecords → aggregate
      ├── devices → total energy, active count, record count
      └── records → monthly/weekly aggregation, tokens calculation
  │
  ▼
LocalConsumption (wrapper component)
  ├── loading/error/empty states
  ├── SolarGenerationCard  → total kWh + trend
  ├── TokensMintedCard     → total tokens + trend
  └── MonthlyComparisonTable → heatmap grid (weeks × months)
```

## Tasks

### Part A: Hook — `useConsumptionData.ts`

- [x] Create `app/src/hooks/useConsumptionData.ts`
- [ ] Interface: `ConsumptionData` with solar generation, tokens, monthly blocks, trends
- [x] Mock path: derive from `mockSolarHistory` and `mockMonthlyComparisonData`
- [ ] On-chain path: use `useOnchainDevices` + `useBlockchainData` internals
  - Aggregate `totalEnergyWh` from all devices → convert to kWh
  - Calculate tokens via `energyWh * TOKENS_PER_WH` constant
  - Build `MonthlyBlock[]` from on-chain records (reuse `aggregateMonthly` logic)
  - Compute current/previous month comparison for trend arrows
- [x] Return: `{ solarGeneration, tokensMinted, solarChange, tokensChange, monthlyBlocks, monthlyComparison, isLoading, error }`

### Part B: Components — `consumption/`

- [x] Create `app/src/components/features/consumption/SolarGenerationCard.tsx`
  - Props: `generationKwh: number`, `change: number`, `isLoading: boolean`
  - Show kWh value, trend arrow up/down with percentage
  - Skeleton/loading state when isLoading
- [x] Create `app/src/components/features/consumption/TokensMintedCard.tsx`
  - Props: `tokens: number`, `change: number`, `isLoading: boolean`
  - Show token count, trend arrow up/down with percentage
  - Skeleton/loading state when isLoading
- [x] Create `app/src/components/features/consumption/MonthlyComparisonTable.tsx`
  - Props: `data: MonthlyComparisonData`, `isLoading: boolean`
  - Render weeks × months heatmap grid
  - Color scale: gray → green → yellow → red based on generation ratio
  - Legend below the table
  - Loading skeleton with pulse animation
- [x] Create `app/src/components/features/consumption/LocalConsumption.tsx`
  - Orchestrator: calls `useConsumptionData`
  - Renders `SolarGenerationCard`, `TokensMintedCard`, `MonthlyComparisonTable`
  - Error state with retry button
  - Empty state for on-chain with no records
  - Month selector dropdown

### Part C: Page Integration

- [x] Update `app/src/pages/Consumption.tsx`
  - Remove all inline mock logic
  - Import and render `LocalConsumption`
  - Keep page-level header with title

### Part D: Verify

- [x] `tsc --noEmit` passes
- [x] `vite build` passes
- [x] `cargo test` passes (7/7)
- [ ] Mock mode: existing visual output preserved
- [ ] Localnet mode: shows real on-chain data from surfpool
- [ ] No regressions on other pages

## Constants

```
TOKENS_PER_WH = 1.5       (matches useBlockchainData.ts TOKENS_MULTIPLIER)
WH_TO_KWH = 0.001
MAX_SOLAR_GENERATION = 1000 (for ratio calculation)
```

## Data Flow

### Mock Path
```
mockSolarHistory.currentMonth.generation → SolarGenerationCard
mockSolarHistory.currentMonth.tokensMinted → TokensMintedCard
mockMonthlyComparisonData → MonthlyComparisonTable
```

### On-chain Path
```
useOnchainDevices() → devices[]
  → reduce totalEnergyWh → SolarGenerationCard (kWh)
  → reduce totalEnergyWh * 1.5 → TokensMintedCard

useBlockchainData() → monthlySolarBlocks, onchainRecords
  → currentMonthRecords → sum energyWh → current generation
  → previousMonthRecords → sum energyWh → previous generation
  → (current - previous) / previous → trend percentage
  → monthlySolarBlocks → MonthlyComparisonTable (reuse ContributionGraph logic)
```

## Files

### New
- `app/src/hooks/useConsumptionData.ts`
- `app/src/components/features/consumption/SolarGenerationCard.tsx`
- `app/src/components/features/consumption/TokensMintedCard.tsx`
- `app/src/components/features/consumption/MonthlyComparisonTable.tsx`
- `app/src/components/features/consumption/LocalConsumption.tsx`

### Modified
- `app/src/pages/Consumption.tsx` — replaced inline mock logic with `LocalConsumption` component
