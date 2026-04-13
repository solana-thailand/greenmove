# Routing Documentation

## Overview

The Greenmove application uses React Router v7 for client-side routing. The routing system provides seamless navigation between different pages without full page reloads, maintaining state and improving the user experience.

## Technology Stack

- **React Router v7**: Latest version with modern hooks and components
- **TypeScript**: Full type safety for route parameters and props
- **createBrowserRouter**: Browser history-based routing for proper URL handling

## Route Structure

### Main Router Configuration

Located in `src/main.tsx`, the router is configured as follows:

```typescript
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout><Outlet /></MainLayout>,
    errorElement: <ErrorFallback error={error} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "consumption", element: <Consumption /> },
      { path: "blockchain", element: <Blockchain /> },
      { path: "kyc", element: <KYC /> },
      { path: "swap", element: <Swap /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
```

### Available Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Dashboard | Main dashboard with statistics and quick actions |
| `/consumption` | Consumption | Water and electric consumption tracking |
| `/blockchain` | Blockchain | Blockchain transaction history |
| `/kyc` | KYC | Know Your Customer verification |
| `/swap` | Swap | Token swap interface |
| `*` | NotFound | 404 page for undefined routes |

## Navigation Components

### NavLink (Sidebar Navigation)

The `NavLink` component from React Router is used for sidebar navigation:

```typescript
<NavLink
  to="/consumption"
  className={({ isActive }) => 
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-white"
        : "text-gray-700 hover:bg-gray-100"
    )
  }
>
  <Droplets className="h-4 w-4" />
  Consumption
</NavLink>
```

**Key Features:**
- Automatic active state detection
- Conditional styling based on `isActive` prop
- Client-side navigation without page reloads

### Link (Page Links)

The `Link` component is used for in-page navigation:

```typescript
<Link
  to="/consumption"
  className="flex items-center gap-2 w-full rounded-lg border px-4 py-2"
>
  <Droplets className="h-4 w-4" />
  View Consumption
</Link>
```

## Layout System

### MainLayout Component

The `MainLayout` component wraps all pages and provides:
- Header with wallet connection
- Sidebar navigation
- Main content area with `Outlet` for child routes
- Footer

```typescript
<MainLayout>
  <Outlet />
</MainLayout>
```

The `Outlet` component renders the matched child route.

## Error Handling

### Error Boundary

The router includes an `errorElement` that displays when a route fails to load:

```typescript
// src/components/ErrorFallback.tsx
export const ErrorFallback = ({ error }: ErrorFallbackProps) => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-red-600">Oops!</h1>
      <p className="text-gray-600">{error.message}</p>
      <button onClick={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  </div>
);
```

### 404 Not Found

A catch-all route handles undefined URLs:

```typescript
// src/components/NotFound.tsx
export const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center">
    <h1 className="text-9xl font-bold text-gray-300">404</h1>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/">Go Home</Link>
  </div>
);
```

## Best Practices

### 1. Use NavLink for Navigation

Always use `NavLink` for navigation menus where you need active state highlighting:

```typescript
// ✅ Good
<NavLink to="/route">Route Name</NavLink>

// ❌ Bad
<a href="/route">Route Name</a>
```

### 2. Use Link for Regular Links

Use `Link` for all other navigation links:

```typescript
// ✅ Good
<Link to="/page">Go to Page</Link>

// ❌ Bad
<a href="/page">Go to Page</a>
```

### 3. Automatic Active State

Don't manually manage active state. Let `NavLink` handle it:

```typescript
// ✅ Good - Automatic active state
<NavLink
  to="/route"
  className={({ isActive }) => 
    isActive ? "bg-primary" : "text-gray-700"
  }
>

// ❌ Bad - Manual state management
<a href="/route" className={activeRoute === "/route" ? "bg-primary" : ""}>
```

### 4. Separate Route Components

Keep route components in separate files to support React Fast Refresh:

```typescript
// ✅ Good - Separate component file
// src/components/NotFound.tsx
export const NotFound = () => { ... };

// ❌ Bad - Inline component definition
const router = createBrowserRouter([
  { path: "*", element: <NotFound /> } // NotFound defined inline
]);
```

### 5. Error Boundaries

Always include an `errorElement` at the route level:

```typescript
// ✅ Good
{
  path: "/",
  element: <Layout />,
  errorElement: <ErrorFallback />,
  children: [...]
}

// ❌ Bad - No error handling
{
  path: "/",
  element: <Layout />,
  children: [...]
}
```

## Adding New Routes

To add a new route:

1. **Create the page component** in `src/pages/`:
   ```typescript
   // src/pages/NewPage.tsx
   function NewPage() {
     return <div>New Page Content</div>;
   }
   export default NewPage;
   ```

2. **Add the route** in `src/main.tsx`:
   ```typescript
   import NewPage from "./pages/NewPage";
   
   // Add to children array:
   { path: "new-page", element: <NewPage /> }
   ```

3. **Add navigation link** in `src/components/layout/Sidebar.tsx`:
   ```typescript
   <NavLink
     to="/new-page"
     className={({ isActive }) => 
       cn("...", isActive ? "bg-primary" : "text-gray-700")
     }
   >
     <Icon className="h-4 w-4" />
     New Page
   </NavLink>
   ```

## Route Parameters

### Path Parameters

For routes with parameters (e.g., `/user/:id`):

```typescript
// Route definition
{ path: "user/:id", element: <UserPage /> }

// Access in component
import { useParams } from "react-router-dom";

function UserPage() {
  const { id } = useParams();
  return <div>User ID: {id}</div>;
}
```

### Query Parameters

For query parameters (e.g., `/search?q=term`):

```typescript
import { useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  return <div>Search: {query}</div>;
}
```

## Programmatic Navigation

### Using useNavigate Hook

```typescript
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/target-route");
  };
  
  return <button onClick={handleClick}>Go</button>;
}
```

### Navigation Options

```typescript
// Replace current entry (don't add to history)
navigate("/target", { replace: true });

// Go back in history
navigate(-1);

// Go forward in history
navigate(1);

// Add state
navigate("/route", { state: { from: "dashboard" } });

// Access state in target component
import { useLocation } from "react-router-dom";
const location = useLocation();
const from = location.state?.from;
```

## Testing Routes

### Manual Testing

1. Start the development server: `npm run dev`
2. Navigate to each route directly in the browser
3. Test navigation links
4. Test invalid routes (should show 404)
5. Test error scenarios (should show ErrorFallback)

### Future Testing Considerations

When adding automated tests, consider:

- Testing route rendering with React Router's testing utilities
- Testing navigation with `@testing-library/user-event`
- Mocking route parameters and query parameters
- Testing error boundaries