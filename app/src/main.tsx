import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./index.css";

import { ErrorFallback } from "./components/ErrorFallback";
import { NotFound } from "./components/NotFound";
import { MainLayout } from "./components/layout";
import SolanaContext from "./lib/SolanaContext";

import Dashboard from "./pages/Dashboard";
import Consumption from "./pages/Consumption";
import Blockchain from "./pages/Blockchain";
import KYC from "./pages/KYC";
import Swap from "./pages/Swap";
import Devices from "./pages/Devices";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
    ),
    errorElement: <ErrorFallback error={new Error("Failed to load page")} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "consumption", element: <Consumption /> },
      { path: "blockchain", element: <Blockchain /> },
      { path: "devices", element: <Devices /> },
      { path: "kyc", element: <KYC /> },
      { path: "swap", element: <Swap /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SolanaContext>
      <RouterProvider router={router} />
    </SolanaContext>
  </StrictMode>
);
