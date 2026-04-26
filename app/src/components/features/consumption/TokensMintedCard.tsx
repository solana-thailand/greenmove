import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import { Coins, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

interface TokensMintedCardProps {
  tokens: number;
  change: number;
  isLoading: boolean;
}

const TOKENS_DECIMALS = 0;

function TokensMintedCard({ tokens, change, isLoading }: TokensMintedCardProps) {
  const formattedTokens = tokens.toLocaleString(undefined, {
    maximumFractionDigits: TOKENS_DECIMALS,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          Tokens Minted
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-2">
            <div>
              <div className="text-4xl font-bold text-yellow-500">
                {formattedTokens}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tokens
              </p>
            </div>
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

export default TokensMintedCard;
