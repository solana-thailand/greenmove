import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface MainLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onWalletClick?: () => void;
  isWalletConnected?: boolean;
  walletAddress?: string;
}

const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(
  (
    {
      className,
      children,
      onWalletClick,
      isWalletConnected = false,
      walletAddress,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950",
        className
      )}
      {...props}
    >
      <div className="flex flex-1">
        <Sidebar
          onWalletClick={onWalletClick}
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
        />
        <main className="flex-1 overflow-auto max-h-screen">
          <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
);

MainLayout.displayName = "MainLayout";

export default MainLayout;
