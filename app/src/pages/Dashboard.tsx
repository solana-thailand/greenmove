import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Link } from "react-router-dom";
import { Sun, Coins, ArrowRight } from "lucide-react";

function Dashboard() {
  const totalSupply = 1000000000;
  const totalSolarGeneration = 1250.5;
  const totalTokensMinted = 1875;

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
            <CardTitle className="text-lg">Solar Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-green-500" />
              <div className="text-3xl font-bold text-green-500">
                {totalSolarGeneration}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Kilowatt-hours (kWh) - This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tokens Minted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <div className="text-3xl font-bold text-yellow-500">
                {totalTokensMinted.toLocaleString()}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Tokens - This month
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
                <Sun className="h-4 w-4" />
                View Solar Generation
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/blockchain"
              className="flex items-center justify-between gap-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                View History
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/swap"
              className="flex items-center justify-between gap-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
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
