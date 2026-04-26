import { useOnchainDevices } from "../../../hooks/useOnchainDevices";
import DeviceCard from "./DeviceCard";
import { Sun, Loader2, AlertCircle, ServerOff } from "lucide-react";

function DeviceList() {
  const { devices, isLoading, error, refetch } = useOnchainDevices();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin mb-3" />
        <p className="text-sm">Loading registered devices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <AlertCircle className="h-8 w-8 mb-3" />
        <p className="text-sm mb-3">{error}</p>
        <button
          onClick={refetch}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
        <ServerOff className="h-8 w-8 mb-3" />
        <p className="text-sm">No devices registered yet.</p>
        <p className="text-xs mt-1">Switch to Localnet or Testnet to see on-chain devices.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Sun className="h-4 w-4 text-green-500" />
          {devices.length} device{devices.length !== 1 ? "s" : ""} registered
        </div>
        <button
          onClick={refetch}
          className="text-xs text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
        >
          Refresh
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <DeviceCard key={device.pubkey} device={device} />
        ))}
      </div>
    </div>
  );
}

export default DeviceList;
