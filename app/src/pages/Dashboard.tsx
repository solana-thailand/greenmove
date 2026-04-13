import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Link } from "react-router-dom";
import { Zap, Droplets, ArrowRight } from "lucide-react";

function Dashboard() {
  const totalSupply = 1000000000;
  const totalWaterConsumption = 1250.5;
  const totalElectricConsumption = 850.3;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {totalSupply.toLocaleString()}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              GREENMOVE tokens
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Water Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <div className="text-3xl font-bold text-blue-500">
                {totalWaterConsumption}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Cubic meters (m³) - This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Electric Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div className="text-3xl font-bold text-yellow-500">
                {totalElectricConsumption}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Kilowatt-hours (kWh) - This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/consumption"
              className="flex items-center justify-between gap-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                View Consumption
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/blockchain"
              className="flex items-center justify-between gap-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                View History
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/swap"
              className="flex items-center justify-between gap-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Swap Tokens
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/kyc"
              className="flex items-center justify-between gap-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Verify KYC
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
