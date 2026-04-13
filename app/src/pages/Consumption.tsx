import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import {
  Droplets,
  Zap,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";

function Consumption() {
  const [selectedMonth, setSelectedMonth] = useState("current");

  const waterConsumption = 1250.5;
  const waterPrevious = 1180.2;
  const electricConsumption = 850.3;
  const electricPrevious = 795.8;

  const waterChange =
    ((waterConsumption - waterPrevious) / waterPrevious) * 100;
  const electricChange =
    ((electricConsumption - electricPrevious) / electricPrevious) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Consumption Tracking
        </h2>
        <Select
          value={selectedMonth}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedMonth(e.target.value)
          }
          options={[
            { value: "current", label: "Current Month" },
            { value: "last", label: "Last Month" },
            { value: "3months", label: "Last 3 Months" },
          ]}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Water Consumption
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-4xl font-bold text-blue-500">
                {waterConsumption}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cubic meters (m³)
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {waterChange > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">
                    +{waterChange.toFixed(1)}% vs last month
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">
                    {waterChange.toFixed(1)}% vs last month
                  </span>
                </>
              )}
            </div>
            <div className="h-32 rounded-lg bg-blue-50 dark:bg-blue-950/20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Electric Consumption
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-4xl font-bold text-yellow-500">
                {electricConsumption}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kilowatt-hours (kWh)
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {electricChange > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">
                    +{electricChange.toFixed(1)}% vs last month
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">
                    {electricChange.toFixed(1)}% vs last month
                  </span>
                </>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Electric Meter
                </span>
                <span className="font-semibold text-yellow-500">
                  High Usage
                </span>
              </div>
              <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 rounded-lg bg-gray-50 dark:bg-gray-950/20" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Log New Reading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Input
                label="Water Reading (m³)"
                type="number"
                placeholder="0.00"
              />
            </div>
            <div>
              <Input
                label="Electric Reading (kWh)"
                type="number"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Submit Reading</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Consumption;
