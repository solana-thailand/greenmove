# Mock Data Reorganization

## Overview

This document describes the reorganization of mock data from a single file into a modular structure with separate files for each feature domain.

## Changes Made

### Before
```
src/lib/mockData.ts (single file with all mock data)
```

### After
```
src/mock/
  ├── index.ts              # Central export point
  ├── wallet.ts             # Wallet-related mock data
  ├── dashboard.ts          # Dashboard statistics and activity
  ├── consumption.ts        # Consumption records and history
  ├── kyc.ts               # KYC verification data
  ├── swap.ts              # Swap transactions
  └── blockchain.ts        # Blockchain blocks and activity
```

## File Structure

### `src/mock/wallet.ts`
- `mockWalletData` - Wallet connection state, address, and balance

### `src/mock/dashboard.ts`
- `mockDashboardData` - Dashboard statistics, trends, and recent activity

### `src/mock/consumption.ts`
- `generateConsumptionRecords(count)` - Generates consumption records
- `mockConsumptionRecords` - Pre-generated monthly consumption data
- `mockConsumptionHistory` - Current and monthly comparison data

### `src/mock/kyc.ts`
- `mockKYCData` - Complete KYC verification data including documents

### `src/mock/swap.ts`
- `generateSwapTransactions(count)` - Generates swap transactions
- `mockSwapTransactions` - Pre-generated swap history

### `src/mock/blockchain.ts`
- `mockBlockchainActivity` - Weekly activity data
- `generateBlockchainBlocks()` - Generates 52 weeks of block data
- `mockBlockchainBlocks` - Pre-generated block data
- `generateHistoryRecords(blocks, sortBy)` - Generates history from blocks
- `generateMonthlyBlocks(type)` - Generates monthly blocks for contribution graph
- `mockMonthlyWaterBlocks` - Monthly water consumption blocks
- `mockMonthlyElectricBlocks` - Monthly electric consumption blocks

### `src/mock/index.ts`
Central export point that re-exports all mock data:
```typescript
export * from "./wallet";
export * from "./dashboard";
export * from "./consumption";
export * from "./kyc";
export * from "./swap";
export * from "./blockchain";
```

## Usage

### Importing Mock Data

#### Option 1: Import from Specific File
```typescript
import { mockWalletData } from "../mock/wallet";
import { mockDashboardData } from "../mock/dashboard";
```

#### Option 2: Import from Index
```typescript
import { mockWalletData, mockDashboardData } from "../mock";
```

### Using Mock Data in Hooks

The existing hooks have been updated to import from the new `src/mock` directory:

```typescript
// Example: useDashboardData.ts
import { mockDashboardData } from "../mock/dashboard";

export function useDashboardData() {
  const data = useMemo(() => mockDashboardData, []);
  return {
    totalSupply: data.totalSupply,
    // ... other properties
  };
}
```

## Benefits

1. **Better Organization** - Each domain has its own file, making it easier to find and update
2. **Separation of Concerns** - Related mock data is grouped together
3. **Easier Maintenance** - Changes to one domain don't affect others
4. **Scalability** - Easy to add new mock data for new features
5. **Clear Dependencies** - It's obvious which mock data each component uses

## Migration Notes

### For Developers

- All hooks have been updated to import from the new `src/mock` directory
- The `src/lib/mockData.ts` file has been deleted
- No changes required in components that use hooks
- If components directly imported from mockData, update imports to point to `src/mock/...`

### Import Path Updates

| Old Import | New Import |
|------------|-------------|
| `../lib/mockData` | `../mock` or `../mock/{domain}` |
| `mockWalletData` | `mockWalletData` (same export) |
| `generateConsumptionRecords` | `generateConsumptionRecords` (same export) |

## Verification

Run the following commands to verify the changes:

```bash
# Type checking and build
yarn build

# Linting
yarn lint

# Both should pass without errors
```

## Files Modified

### Created
- `src/mock/index.ts`
- `src/mock/wallet.ts`
- `src/mock/dashboard.ts`
- `src/mock/consumption.ts`
- `src/mock/kyc.ts`
- `src/mock/swap.ts`
- `src/mock/blockchain.ts`

### Updated
- `src/hooks/useDashboardData.ts`
- `src/hooks/useConsumptionData.ts`
- `src/hooks/useBlockchainData.ts`
- `src/hooks/useKYCData.ts`
- `src/hooks/useSwapData.ts`
- `src/pages/Blockchain.tsx`

### Deleted
- `src/lib/mockData.ts`

## Future Enhancements

1. **Environment-Specific Data** - Add separate mock data for different environments (dev, test, staging)
2. **Data Generators** - More flexible generators with customizable parameters
3. **Realistic Data** - Add more realistic mock data with realistic distributions
4. **API Integration** - Easy swap to real API calls by replacing mock imports
5. **Data Versioning** - Version mock data to support different feature sets

## Best Practices

When adding new mock data:

1. Create a new file in `src/mock/` following the domain naming pattern
2. Export mock data and any generator functions
3. Add the export to `src/mock/index.ts`
4. Create or update the corresponding hook in `src/hooks/`
5. Update documentation to reflect the new mock data

## Related Documentation

- [Routing Documentation](./ROUTING.md)
- [Navigation Layout Cleanup](./NAVIGATION_CLEANUP.md)
- [Project Overview](../.plan/00-overview.md)