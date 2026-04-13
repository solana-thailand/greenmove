import { forwardRef, type HTMLAttributes } from "react";
import {
  LayoutDashboard,
  Droplets,
  Blocks,
  UserCheck,
  ArrowLeftRight,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  activeRoute?: string;
}

const Sidebar = forwardRef<HTMLElement, HeaderProps>(
  ({ className, activeRoute = "/", ...props }, ref) => (
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
        <a
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            activeRoute === "/"
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </a>
        <a
          href="/consumption"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            activeRoute === "/consumption"
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          )}
        >
          <Droplets className="h-4 w-4" />
          Consumption
        </a>
        <a
          href="/blockchain"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            activeRoute === "/blockchain"
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          )}
        >
          <Blocks className="h-4 w-4" />
          Blockchain
        </a>
        <a
          href="/kyc"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            activeRoute === "/kyc"
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          )}
        >
          <UserCheck className="h-4 w-4" />
          KYC
        </a>
        <a
          href="/swap"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            activeRoute === "/swap"
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          )}
        >
          <ArrowLeftRight className="h-4 w-4" />
          Swap
        </a>
      </nav>
    </aside>
  )
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
