import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Consumption from "./pages/Consumption";
import Blockchain from "./pages/Blockchain";
import KYC from "./pages/KYC";
import Swap from "./pages/Swap";

const router = createMemoryRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "consumption", element: <Consumption /> },
      { path: "blockchain", element: <Blockchain /> },
      { path: "kyc", element: <KYC /> },
      { path: "swap", element: <Swap /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
