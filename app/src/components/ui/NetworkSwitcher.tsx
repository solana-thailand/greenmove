import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Wifi, Server } from "lucide-react";
import { useNetworkStore } from "../../stores/networkStore";
import {
  NETWORK_MOCK,
  NETWORK_TESTNET,
  NETWORK_LABELS,
  NETWORK_COLORS,
  type NetworkType,
} from "../../constants/network";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const NETWORK_OPTIONS: NetworkType[] = [NETWORK_MOCK, NETWORK_TESTNET];

const NETWORK_ICONS: Record<NetworkType, typeof Wifi> = {
  [NETWORK_MOCK]: Server,
  [NETWORK_TESTNET]: Wifi,
};

function NetworkSwitcher() {
  const { network, setNetwork, isMock } = useNetworkStore();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
        {NETWORK_OPTIONS.map((option) => {
          const Icon = NETWORK_ICONS[option];
          const isActive = network === option;

          return (
            <button
              key={option}
              onClick={() => setNetwork(option)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? `${NETWORK_COLORS[option]} text-white shadow-sm`
                  : "text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
              )}
            >
              <Icon className="h-3 w-3" />
              {NETWORK_LABELS[option]}
            </button>
          );
        })}
      </div>
      {!isMock && (
        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          Live
        </span>
      )}
    </div>
  );
}

export default NetworkSwitcher;
