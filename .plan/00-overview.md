# Greenmove Mock Frontend - Project Overview

## Current Status

The project is based on a clean Vite React template located at `/home/moo-tu/hackatron/greenmove/app`. The following are already configured:
- **Vite**: 8.0.4 with React compiler enabled via @vitejs/plugin-react and @rolldown/plugin-babel
- **React**: 19.2.4
- **TypeScript**: 6.0.2 with strict mode
- **Basic CSS**: Custom CSS variables with dark mode support

The app currently displays the default Vite template and needs to be completely replaced with the Greenmove features.

## Tech Stack

### Core Framework (Already Installed)
+- **Vite**: 8.0.4 (configured)
+- **React**: 19.2.4 (configured)
+- **TypeScript**: 6.0.2 (configured)
+- **React Compiler**: enabled via plugin (configured)

### UI Framework (To Install)
+- **shadcn/ui**: component library for rapid development
+- **Tailwind CSS v4**: utility-first CSS (will replace current CSS)
+- **Radix UI**: accessible primitives
+- **Lucide React**: icon library

### Wallet Integration
- **@solana/web3.js**: Solana blockchain interaction
- **@solana/wallet-adapter-react**: React hooks for wallets
- **@solana/wallet-adapter-wallets**: Wallet adapters including Phantom
- **@solana/wallet-adapter-react-ui**: UI components for wallet connection

### State Management
- **Zustand**: lightweight state management
- **TanStack Query**: server state management and caching

### Utilities
- **date-fns**: date manipulation
- **recharts**: charting library for dashboard
- **clsx & tailwind-merge**: conditional class names

## Project Structure

```
# Current structure (to be replaced):
src/
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── App.css
├── App.tsx
├── index.css
└── main.tsx

# Target structure:
src/
├── assets/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── wallet/
│   │   ├── WalletConnect.tsx
│   │   └── WalletBalance.tsx
│   ├── dashboard/
│   │   ├── SupplyOverview.tsx
│   │   ├── ActivityChart.tsx
│   │   └── StatsCards.tsx
│   ├── tracking/
│   │   ├── ConsumptionForm.tsx
│   │   ├── MonthlyComparison.tsx
│   │   └── ConsumptionTable.tsx
│   ├── blockchain/
│   │   ├── BlockHistory.tsx
│   │   ├── WeekBlock.tsx
│   │   └── BlockLegend.tsx
│   ├── swap/
│   │   ├── SwapForm.tsx
│   │   ├── TokenSelector.tsx
│   │   └── SwapSummary.tsx
│   └── kyc/
│       ├── KYCForm.tsx
│       ├── KYCStatus.tsx
│       └── KYCSteps.tsx
├── hooks/
│   ├── useWallet.ts
│   ├── useKYC.ts
│   ├── useConsumption.ts
│   └── useSwap.ts
├── stores/
│   ├── walletStore.ts
│   ├── consumptionStore.ts
│   └── kycStore.ts
├── lib/
│   ├── constants.ts            # No hardcoded values
│   ├── utils.ts                # Helper functions
│   ├── colors.ts               # Color mapping utilities
│   ├── blockchain.ts           # Blockchain utilities
│   └── api.ts                  # API functions
├── types/
│   ├── wallet.ts
│   ├── consumption.ts
│   ├── kyc.ts
│   └── swap.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── Tracking.tsx
│   ├── History.tsx
│   ├── Swap.tsx
│   └── KYC.tsx
├── routes/
│   └── index.tsx               # Route configuration
└── App.tsx
```

## Core Features

### 1. Wallet Integration (Phantom)
- Connect/disconnect wallet
- Display wallet address and balance
- Sign transactions
- Handle connection errors

### 2. KYC Verification
- Multi-step KYC form
- Document upload (mock)
- KYC status tracking
- KYC completion rewards

### 3. Solar Generation Tracking
- Record solar generation (kWh/month)
- Calculate token conversion rate
- View monthly comparisons
- Calculate differences
- Generation trends

### 4. Blockchain History View
- GitHub-style contribution graph
- Each block represents 1 week
- Color coding:
  - Gray: inactive
  - Green: low solar generation
  - Yellow: medium solar generation
  - Red: high solar generation
  - Gradient: generation levels
- Hover details for each block
- Activity ratio mapping

### 5. Solar Meter Gradient
- Green (low generation) → Red (high generation)
- Static color mapping based on generation ratio
- Visual meter representation

### 6. History Table
- Sortable columns
- Filter by date range
- Export functionality
- Pagination

### 7. Dashboard
- Total solar generation (kWh)
- Total tokens minted
- Weekly/monthly charts
- Activity summary
- Token balance display

### 8. Token Swap
- Greenmove token to other tokens
- Real-time price quotes (mock)
- Transaction history
- Swap confirmation

## Color System

### Activity Color Mapping

```typescript
// Constants
const INACTIVE_COLOR = 'gray-300';
const SOLAR_COLOR = 'green-500';

// Ratio-based colors
const ACTIVITY_RATIO_COLORS = {
  low: 'green-600',
  medium: 'green-400',
  high: 'yellow-400',
  very_high: 'red-600'
};
```

### Solar Meter Gradient

```typescript
// 0% - 100% generation maps to green → red
const SOLAR_METER_COLORS = [
  'green-600',   // 0-20%
  'green-500',   // 20-40%
  'green-400',   // 40-60%
  'yellow-400',  // 60-80%
  'red-600'      // 80-100%
];
```

## Data Models

### Consumption Record

```typescript
interface SolarRecord {
  id: string;
  userId: string;
  timestamp: Date;
  solarGeneration: number;       // kWh
  tokensMinted: number;          // tokens
  month: string;                 // YYYY-MM
  week: number;                  // 1-4
  hash: string;                  // Blockchain hash
}
```

### KYC Data

```typescript
interface KYCData {
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  fullName: string;
  email: string;
  documentType: 'passport' | 'id' | 'license';
  documentNumber: string;
  submittedAt: Date;
  reviewedAt?: Date;
}
```

### Swap Transaction

```typescript
interface SwapTransaction {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  price: number;
  timestamp: Date;
  hash: string;
  status: 'pending' | 'completed' | 'failed';
}
```

## Task Breakdown

### Phase 1: Foundation Setup (00-04)

**00**: Remove default Vite template
+- Remove App.tsx template code
+- Remove App.css
+- Remove hero.png and unused assets
+- Clean up index.css (keep only reset)
+- Create placeholder App component

**01**: Install dependencies
+- Install Tailwind CSS v4 and dependencies
+- Install shadcn/ui CLI and components
+- Install React Router v7 for routing
+- Install Lucide React for icons
+- Install @solana/wallet-adapter packages
+- Install Zustand for state management
+- Install TanStack Query for server state
+- Install date-fns for date handling
+- Install recharts for charts
+- Install clsx and tailwind-merge

**02**: Configure Tailwind CSS v4
+- Replace custom CSS with Tailwind CSS v4
+- Set up @theme directive with custom colors
+- Configure dark mode with @custom-variant
+- Add Greenmove-specific theme variables
+- Configure responsive breakpoints

**03**: Set up project structure
+- Create components/ directory
+- Create components/ui/ for shadcn components
+- Create components/layout/ for layout components
+- Create components/feature/ directories for each feature
+- Create hooks/ directory
+- Create stores/ directory
+- Create lib/ directory
+- Create types/ directory
+- Create pages/ directory
+- Create routes/ directory

**04**: Configure routing
+- Set up React Router v7
+- Create route configuration in routes/index.tsx
+- Create route guards for KYC status
+- Create 404 page

### Phase 2: UI Components (05-09)

**05**: Initialize shadcn/ui components
+- Install shadcn/ui CLI
+- Add essential components: Button, Card, Input, Select, Dialog, Tabs
+- Configure component styles with Tailwind
+- Test components

**06**: Create base layout components
+- Create Header component with wallet connect
+- Create Sidebar for navigation
+- Create Footer component
+- Create MainLayout wrapper
+- Create MobileNavigation component

**07**: Set up constants and utilities
+- Create lib/constants.ts with all hardcoded values
+- Create lib/utils.ts with helper functions (cn helper)
+- Create lib/colors.ts with color mapping logic
+- Create lib/blockchain.ts with blockchain utilities
+- Create lib/mockData.ts with sample data

**08**: Create type definitions
+- Create types/wallet.ts for wallet types
+- Create types/consumption.ts for consumption types
+- Create types/kyc.ts for KYC types
+- Create types/swap.ts for swap types

**09**: Set up state stores
+- Create stores/walletStore.ts with Zustand
+- Create stores/consumptionStore.ts with Zustand
+- Create stores/kycStore.ts with Zustand

### Phase 3: Wallet Integration (10-14)

**10**: Create WalletConnect component
- Connect button
- Disconnect button
- Display wallet address
- Handle connection errors

**11**: Create WalletBalance component
- Display SOL balance
- Display GMV (Greenmove) token balance
- Refresh balance button

**12**: Create useWallet hook
- Wallet connection state
- Balance fetching
- Transaction signing

**13**: Implement wallet context
- Provide wallet state to entire app
- Handle wallet events

**14**: Add wallet adapter providers
- Phantom adapter
- Other Solana wallets

**15**: Create wallet error handling
- Connection errors
- Transaction errors
- User rejection handling

**14**: Test wallet connection flow
- Manual testing with Phantom
- Error scenario testing

### Phase 4: KYC Feature (15-19)

**15**: Create KYCForm component
- Loading states
- Success/failure animations

**18**: Create KYC route guard
- README with setup instructions
- Code comments where complex

**19**: Test KYC flow
- Optimize re-renders
- Clean up unused code

### Phase 5: Consumption Tracking (20-24)

**20**: Create ConsumptionForm component
- Personal information inputs
- Document upload (mock)
- Form validation

**21**: Create MonthlyComparison component
- Step indicator
- Progress bar
- Navigation between steps

**22**: Create ConsumptionTable component
- Display current status
- Show pending/processing states
- Show approval/rejection message

**23**: Create useConsumption hook
- Submit KYC data
- Check KYC status
- Handle KYC updates

**24**: Create Tracking page
- Combine KYC components
- Handle form submission
- Display status

**25**: Implement mock consumption data
- Validate email format
- Validate document number
- Validate required fields

**26**: Add consumption validation
- Simulate server delay
- Auto-approve for testing
- Manual approve/reject for demo

**27**: Create consumption statistics
- Display reward amount
- Award GMV tokens on approval
- Show reward transaction

**28**: Add consumption charts
- Protect other routes
- Redirect to KYC if not approved
- Allow bypass for testing

**29**: Test tracking features
- Complete flow testing
- Error scenario testing
- Edge case testing

### Phase 6: Blockchain History (30-34)

**30**: Create BlockHistory component
- Solar generation input (kWh)
- Token conversion display
- Date picker
- Submit button

**31**: Create WeekBlock component
- Compare current month to previous
- Display difference
- Show percentage change

**32**: Create BlockLegend component
- Display history records
- Sortable columns
- Filter by date
- Pagination

**33**: Implement color mapping logic
- Submit consumption data
- Fetch consumption history
- Calculate monthly totals

**34**: Create week data aggregation
- Validate solar generation range
- Calculate token conversion
- Prevent duplicate submissions

**35**: Add block interaction
- Generate sample records
- Create realistic data patterns
- Add to local storage

**36**: Implement responsive grid
- Calculate averages
- Calculate totals
- Identify trends

**37**: Add animations
- Bar chart for monthly comparison
- Line chart for trends
- Pie chart for solar to token conversion

**38**: Create History page
- Combine tracking components
- Add page layout
- Handle user interactions

**39**: Test blockchain history
- Form submission testing
- Data display testing
- Chart rendering testing

### Phase 7: Dashboard (40-44)

**40**: Create SupplyOverview component
- GitHub-style grid layout
- 4 weeks per row (monthly)
- 12 months display

**41**: Create ActivityChart component
- Render single week block
- Apply color based on activity
- Handle hover state
- Show tooltip with details

**42**: Create StatsCards component
- Explain color coding
- Show activity levels
- Display gradient scale

**43**: Create useDashboard hook
- Map activity ratio to colors
- Handle inactive weeks
- Calculate electric meter gradient

**44**: Implement dashboard data aggregation
- Group records by week
- Calculate activity ratio
- Determine color

**45**: Add dashboard animations
- Click to view week details
- Navigate to detail view
- Show week summary

**46**: Create dashboard filters
- Mobile layout
- Tablet layout
- Desktop layout

**47**: Implement dashboard refresh
- Block hover effects
- Grid load animation
- Transition effects

**48**: Create Dashboard page
- Combine blockchain components
- Add page layout
- Handle navigation

**49**: Test dashboard features
- Color mapping testing
- Tooltip testing
- Responsiveness testing

### Phase 8: Token Swap (50-54)

**50**: Create SwapForm component
- Total solar generation display
- Total tokens minted display
- Visual indicators

**51**: Create TokenSelector component
- Weekly activity line chart
- Monthly activity bar chart
- Combined consumption chart

**52**: Create SwapSummary component
- Current month consumption
- Last month comparison
- Trend indicators
- Achievement badges

**53**: Create useSwap hook
- Fetch dashboard data
- Calculate statistics
- Cache data with TanStack Query

**54**: Implement swap logic
- Sum all consumption records
- Group by time periods
- Calculate percentages

**55**: Add mock token prices
- Number counting animation
- Chart load animation
- Card hover effects

**56**: Create swap history
- Date range selector
- Filter by status (pending/completed/failed)
- Reset filters

**57**: Add swap confirmation
- Auto-refresh interval
- Manual refresh button
- Loading states

**58**: Create Swap page
- Combine dashboard components
- Optimize layout
- Add page transitions

**59**: Test swap features
- Data accuracy testing
- Chart rendering testing
- Performance testing

### Phase 9: Integration & Polish (60-69)

**60**: Integrate all pages with routing
- From token input
- To token input
- Swap amount input
- Swap button

**61**: Implement navigation between pages
- Token list display
- Token selection
- Token info display

**62**: Add page transitions
- Exchange rate display
- Fees display
- Final amount calculation
- Transaction details

**63**: Optimize component re-renders
- Get swap quote
- Execute swap
- Track transaction status

**64**: Improve loading states
- Calculate exchange rates
- Calculate fees
- Validate amounts
- Check balances

**65**: Add error boundaries
- Define token pairs
- Create price feeds
- Simulate price changes

**66**: Implement accessibility
- Display past swaps
- Show transaction status
- Link to blockchain explorer

**67**: Add dark mode support
- Confirm swap modal
- Display transaction details
- Show fee breakdown

**68**: Optimize images and assets
- Combine swap components
- Add page layout
- Handle swap flow

**69**: Implement caching strategies
- Swap flow testing
- Error handling testing
- Balance updating testing

### Phase 10: Testing (70-79)

**70**: Set up testing framework
- Use React.memo
- Use useCallback and useMemo
- Implement virtual scrolling

**71**: Write unit tests for utilities
- Skeleton screens
- Loading spinners
- Progress indicators

**72**: Write unit tests for hooks
- Catch component errors
- Display error messages
- Provide recovery options

**73**: Write unit tests for stores
- ARIA labels
- Keyboard navigation
- Screen reader support

**74**: Write component tests
- Theme toggle
- Dark color scheme
- Persist theme preference

**75**: Write integration tests for pages
- Compress images
- Use WebP format
- Lazy loading

**76**: Write integration tests for wallet
- Cache API responses
- Cache component state
- Cache computed values

**77**: Test user flows end-to-end
- Track page views
- Track user actions
- Track conversion metrics

**78**: Test responsive layouts
- Touch-friendly buttons
- Responsive layouts
- Mobile-specific features

**79**: Test error scenarios
- Remove dead code
- Refactor complex functions
- Improve type safety

### Phase 11: Deployment (80-89)

**80**: Configure production build
- Vitest for unit tests
- Testing Library for component tests
- Configure test environment

**81**: Optimize bundle size
- Test utility functions
- Test hooks
- Test stores

**82**: Set up code splitting
- Test component rendering
- Test user interactions
- Test props

**83**: Configure environment variables
- Test page flows
- Test API integration
- Test wallet integration

**84**: Set up CI/CD pipeline
- Playwright setup
- Test critical user flows
- Test cross-browser

**85**: Deploy to staging
- Measure render times
- Identify bottlenecks
- Optimize slow components

**86**: Test on staging environment
- Automated accessibility tests
- Manual keyboard testing
- Screen reader testing

**87**: Configure monitoring and error tracking
- Network failures
- Invalid inputs
- Edge cases

**88**: Create documentation
- Bug fixes
- Performance improvements
- Accessibility improvements

**89**: Production deployment
- Test coverage report
- Test strategy document
- Known issues list

### Phase 12: Maintenance (90-99)

**90**: Set up post-deployment monitoring
- Optimize build size
- Set up code splitting
- Configure CSP headers

**91**: Collect user feedback
- GitHub Actions workflow
- Automated testing
- Automated deployment

**92**: Fix reported bugs
- Production API endpoints
- Wallet configuration
- Feature flags

**93**: Optimize based on analytics
- Error tracking (Sentry)
- Performance monitoring
- Analytics dashboard

**94**: Update dependencies
- README with setup instructions
- API documentation
- Component documentation
- Deployment guide

**95**: Plan feature enhancements
- Separate staging URL
- Staging database
- Test deployment

**96**: Security audit
- Audit dependencies
- Check for vulnerabilities
- Implement security headers

**97**: Performance optimization
- Deploy to Vercel/Netlify
- Configure domain
- Set up SSL

**98**: Accessibility improvements
- Monitor errors
- Monitor performance
- Collect user feedback

**99**: Create roadmap for v2
- Update schedule
- Support procedures
- Roadmap for future features

## Development Guidelines

### Code Style

- **Solid, lean code**: Minimal dependencies, clear purpose
- **Small functions**: Each function does one thing well
- **Zero copy first**: Avoid unnecessary allocations
- **No over engineering**: Keep it simple
- **No hardcoding**: Use constants for all magic values
- **No comments**: Only for complex logic
- **Use RwLock instead of Mutex**: For concurrent access

### Development Workflow

1. Create plan file before starting task
2. Implement feature
3. Run `cargo check && cargo clippy` (for Rust parts)
4. Run `dx check` (if using Dioxus)
5. Create benchmark if introducing new algorithms
6. Don't use `#[allow(dead_code)]`: use `todo!()` or `unimplemented!()`
7. Run tests before committing
8. Auto-add, commit, and push on success

### Git Workflow

- Create feature branch from `main`
- Commit messages: `[xx] description` (where xx is task number)
- Run tests before committing
- On push: auto-add, commit, push

### Performance

- Use `useMemo` for expensive computations
- Use `useCallback` for callbacks passed to children
- Implement virtual scrolling for long lists
- Lazy load components and images
- Use code splitting for large bundles

### Security

- Validate all user inputs
- Sanitize user-generated content
- Use CSP headers
- Keep dependencies up to date
- Never expose API keys in client code

## Next Steps

1. Start with task **00**: Remove default Vite template and create placeholder
2. Continue with task **01**: Install all dependencies (Tailwind, shadcn/ui, wallet adapters, etc.)
3. Set up Tailwind CSS v4 with custom Greenmove theme
4. Begin implementing base layout and wallet integration
5. Build out features systematically in order

## Important Notes

- Working directory: `/home/moo-tu/hackatron/greenmove/app`
- The `app/greenmove_frontend` directory appears to be a separate/unused installation
- React Compiler is already enabled via the Babel plugin
- Current CSS will be completely replaced with Tailwind CSS v4
- Default Vite template assets (hero.png, etc.) will be removed
- All mock data will be stored in `lib/mockData.ts`
- Follow the coding style guidelines: small functions, no hardcoding, zero-copy patterns
- Run `npm run build` (not cargo check) to verify builds
- No cargo commands needed for this React frontend project

## Notes

- All mock data should be stored in `lib/mockData.ts`
- Use environment variables for configuration
- Keep components under 300 lines
- Extract complex logic to hooks and utilities
- Always use TypeScript - no `any` types
- Use strict mode in TypeScript config