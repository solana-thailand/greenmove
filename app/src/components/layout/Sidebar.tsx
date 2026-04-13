import { forwardRef, type HTMLAttributes } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Droplets,
  Blocks,
  UserCheck,
  ArrowLeftRight,
  Wallet,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Button from "../ui/Button";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface SidebarProps extends HTMLAttributes<HTMLElement> {
  onWalletClick?: () => void;
  isWalletConnected?: boolean;
  walletAddress?: string;
}

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      className,
      onWalletClick,
      isWalletConnected = false,
      walletAddress,
      ...props
    },
    ref
  ) => (
    <aside
      ref={ref}
      className={cn(
        "hidden md:flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        className
      )}
      {...props}
    >
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
        <h2 className="text-lg font-bold text-primary">Greenmove</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            )
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </NavLink>
        <NavLink
          to="/consumption"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            )
          }
        >
          <Droplets className="h-4 w-4" />
          Consumption
        </NavLink>
        <NavLink
          to="/blockchain"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            )
          }
        >
          <Blocks className="h-4 w-4" />
          Blockchain
        </NavLink>
        <NavLink
          to="/kyc"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            )
          }
        >
          <UserCheck className="h-4 w-4" />
          KYC
        </NavLink>
        <NavLink
          to="/swap"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            )
          }
        >
          <ArrowLeftRight className="h-4 w-4" />
          Swap
        </NavLink>
      </nav>
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onWalletClick}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isWalletConnected
            ? `${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}`
            : "Connect Wallet"}
        </Button>
      </div>
    </aside>
  )
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
