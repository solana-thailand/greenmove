import { forwardRef, type HTMLAttributes } from "react";
import { Wallet } from "lucide-react";
import Button from "../ui/Button";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  onWalletClick?: () => void;
  isWalletConnected?: boolean;
  walletAddress?: string;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
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
    <header
      ref={ref}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        "dark:border-gray-800 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60",
        className
      )}
      {...props}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-primary">Greenmove</h1>
          <nav className="hidden md:flex gap-6">
            <a
              href="/"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Dashboard
            </a>
            <a
              href="/consumption"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Consumption
            </a>
            <a
              href="/blockchain"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Blockchain
            </a>
            <a
              href="/kyc"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              KYC
            </a>
            <a
              href="/swap"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Swap
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onWalletClick}>
            <Wallet className="mr-2 h-4 w-4" />
            {isWalletConnected
              ? `${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}`
              : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </header>
  )
);

Header.displayName = "Header";

export default Header;
