import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";

import Select from "../components/ui/Select";
import { Blocks, Calendar, Zap, Droplets } from "lucide-react";
import { INACTIVE_COLOR, WATER_COLOR, ELECTRIC_COLOR } from "../constants";

interface BlockchainBlock {
  week: number;
  water: number;
  electric: number;
}

interface HistoryRecord {
  id: string;
  week: number;
  waterConsumption: number;
  electricConsumption: number;
  timestamp: string;
  status: "confirmed" | "pending";
}

function Blockchain() {
  const [sortBy, setSortBy] = useState("week");
  const [filterType, setFilterType] = useState("all");

  const blocks: BlockchainBlock[] = Array.from({ length: 52 }, (_, i) => ({
    week: i + 1,
    water: Math.random() > 0.3 ? Number((Math.random() * 100).toFixed(2)) : 0,
    electric:
      Math.random() > 0.3 ? Number((Math.random() * 100).toFixed(2)) : 0,
  }));

  const historyRecords: HistoryRecord[] = blocks
    .filter((block) => block.water > 0 || block.electric > 0)
    .map((block) => ({
      id: `block-${block.week}`,
      week: block.week,
      waterConsumption: block.water,
      electricConsumption: block.electric,
      timestamp: new Date(
        Date.now() - (52 - block.week) * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "confirmed" as const,
    }))
    .sort((a, b) => {
      if (sortBy === "week") return b.week - a.week;
      if (sortBy === "water") return b.waterConsumption - a.waterConsumption;
      return b.electricConsumption - a.electricConsumption;
    });

  const getBlockColor = (block: BlockchainBlock) => {
    if (block.water === 0 && block.electric === 0) return INACTIVE_COLOR;
    if (block.water > 0 && block.electric > 0) return ELECTRIC_COLOR;
    if (block.water > 0) return WATER_COLOR;
    return ELECTRIC_COLOR;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Blockchain History
        </h2>
        <div className="flex items-center gap-4">
          <Select
            value={filterType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFilterType(e.target.value)
            }
            options={[
              { value: "all", label: "All Activity" },
              { value: "water", label: "Water Only" },
              { value: "electric", label: "Electric Only" },
              { value: "mixed", label: "Both" },
            ]}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            Weekly Activity (52 Weeks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(52, minmax(0, 1fr))" }}
            >
              {blocks.map((block) => {
                const isFiltered =
                  (filterType === "water" &&
                    (block.electric > 0 || block.water === 0)) ||
                  (filterType === "electric" &&
                    (block.water > 0 || block.electric === 0)) ||
                  (filterType === "mixed" &&
                    (block.water === 0 || block.electric === 0));

                return (
                  <div
                    key={block.week}
                    className={`aspect-square rounded-sm transition-transform hover:scale-110 ${
                      isFiltered ? "opacity-20" : "opacity-100"
                    }`}
                    style={{ backgroundColor: getBlockColor(block) }}
                    title={`Week ${block.week}: Water ${block.water}m³, Electric ${block.electric}kWh`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: INACTIVE_COLOR }}
                />
                <span className="text-gray-600 dark:text-gray-400">
                  Inactive
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: WATER_COLOR }}
                />
                <span className="text-gray-600 dark:text-gray-400">Water</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: ELECTRIC_COLOR }}
                />
                <span className="text-gray-600 dark:text-gray-400">
                  Electric
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: ELECTRIC_COLOR }}
                />
                <span className="text-gray-600 dark:text-gray-400">Both</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value)
                }
                options={[
                  { value: "week", label: "Sort by Week" },
                  { value: "water", label: "Sort by Water" },
                  { value: "electric", label: "Sort by Electric" },
                ]}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Week
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Water (m³)
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Electric (kWh)
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {historyRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {record.week}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-900 dark:text-white">
                          {record.waterConsumption}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-gray-900 dark:text-white">
                          {record.electricConsumption}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Blockchain;
