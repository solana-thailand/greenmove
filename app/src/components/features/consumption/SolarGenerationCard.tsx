import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Sun, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

interface SolarGenerationCardProps {
  generationKwh: number;
  change: number;
  isLoading: boolean;
}

function SolarGenerationCard({
  generationKwh,
  change,
  isLoading,
}: SolarGenerationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sun className="h-5 w-5 text-green-500" />
          Solar Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm">Fetching on-chain data…</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl font-bold text-green-500">
              {generationKwh.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kilowatt-hours (kWh)
            </p>
            <div className="flex items-center gap-2 text-sm">
              {change > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">
                    +{change.toFixed(1)}% vs last month
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">
                    {change.toFixed(1)}% vs last month
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SolarGenerationCard;
