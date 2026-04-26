import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import { Sun, Zap, Activity, Clock, Hash, CheckCircle, XCircle } from "lucide-react";
import type { OnchainSolarDevice } from "../../../lib/program";

const WH_TO_KWH = 0.001;
const MW_TO_W = 0.001;

interface DeviceCardProps {
  device: OnchainSolarDevice;
}

function formatTimestamp(unixSeconds: number): string {
  if (unixSeconds === 0) return "N/A";
  return new Date(unixSeconds * 1000).toLocaleString();
}

function DeviceCard({ device }: DeviceCardProps) {
  const energyKwh = (device.totalEnergyWh * WH_TO_KWH).toFixed(2);
  const wattageW = (device.currentWattageMw * MW_TO_W).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sun className="h-5 w-5 text-green-500" />
            {device.name || device.uniqueId}
          </CardTitle>
          {device.active ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle className="h-3 w-3" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
              <XCircle className="h-3 w-3" />
              Inactive
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Hash className="h-3.5 w-3.5" />
              Unique ID
            </div>
            <p className="font-mono text-xs text-gray-900 dark:text-white truncate" title={device.uniqueId}>
              {device.uniqueId}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Zap className="h-3.5 w-3.5" />
              Current Wattage
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {wattageW} W
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Sun className="h-3.5 w-3.5" />
              Total Energy
            </div>
            <p className="font-semibold text-green-600 dark:text-green-400">
              {energyKwh} kWh
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Activity className="h-3.5 w-3.5" />
              Records
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {device.recordCount}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>Registered: {formatTimestamp(device.registeredAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>Last record: {formatTimestamp(device.lastRecordAt)}</span>
          </div>
          <p className="font-mono truncate" title={device.pubkey}>
            PDA: {device.pubkey}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default DeviceCard;
