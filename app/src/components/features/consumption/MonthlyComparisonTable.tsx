import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import { Calendar, Loader2 } from "lucide-react";
import type { MonthlyComparisonData } from "../../../types";

interface MonthlyComparisonTableProps {
  data: MonthlyComparisonData;
  isLoading: boolean;
}

function MonthlyComparisonTable({
  data,
  isLoading,
}: MonthlyComparisonTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Monthly Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-20">
                  Week
                </th>
                {data.data.map((month, index) => (
                  <th
                    key={`${month.year}-${month.month}`}
                    className="py-2 px-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[60px]"
                  >
                    {(index + 1).toString().padStart(2, "0")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((weekNum) => (
                <tr
                  key={weekNum}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <td className="py-2 px-3 text-sm font-medium text-gray-900 dark:text-white">
                    Week {weekNum}
                  </td>
                  {data.data.map((month) => {
                    const week = month.weeks.find(
                      (w) => w.weekNumber === weekNum
                    );
                    return (
                      <td
                        key={`${month.year}-${month.month}-${weekNum}`}
                        className="py-2 px-2"
                      >
                        {week && week.isEmpty ? (
                          <div className="h-12 w-12 mx-auto rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
                        ) : (
                          <div
                            className="h-12 w-12 mx-auto rounded-md border border-white dark:border-gray-700 shadow-sm"
                            style={{
                              backgroundColor: week?.color || "#f3f4f6",
                            }}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
              <span>Empty</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-green-400" />
              <span>Low Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-yellow-400" />
              <span>Medium Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-red-600" />
              <span>High Generation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MonthlyComparisonTable;
