import { forwardRef, type HTMLAttributes } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface FooterProps extends HTMLAttributes<HTMLElement> {}

const Footer = forwardRef<HTMLElement, FooterProps>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        "border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        className
      )}
      {...props}
    >
      <div className="container flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:gap-0">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © 2025 Greenmove. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
          >
            Twitter
          </a>
          <a
            href="/docs"
            className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
          >
            Docs
          </a>
        </div>
      </div>
    </footer>
  )
);

Footer.displayName = "Footer";

export default Footer;
