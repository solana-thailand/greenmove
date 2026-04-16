import { useRef, useState, useEffect } from "react";

interface MonthlyBlock {
  month: number;
  monthName: string;
  usage: number;
  ratio: number;
}

interface ContributionGraphProps {
  blocks: MonthlyBlock[];
  title: string;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTH_POSITIONS = [0, 3, 6, 9];

const SOLAR_COLORS = [
  { ratio: 0, color: "#f3f4f6" },
  { ratio: 0.25, color: "#dcfce7" },
  { ratio: 0.5, color: "#86efac" },
  { ratio: 0.75, color: "#fcd34d" },
  { ratio: 1, color: "#991b1b" },
];

function interpolateColor(
  ratio: number,
  colors: { ratio: number; color: string }[]
): string {
  if (ratio === 0) return colors[0].color;
  if (ratio >= 1) return colors[colors.length - 1].color;

  let lower = colors[0];
  let upper = colors[colors.length - 1];

  for (let i = 0; i < colors.length - 1; i++) {
    if (colors[i].ratio <= ratio && colors[i + 1].ratio >= ratio) {
      lower = colors[i];
      upper = colors[i + 1];
      break;
    }
  }

  const range = upper.ratio - lower.ratio;
  const factor = range === 0 ? 0 : (ratio - lower.ratio) / range;

  const lowerRgb = hexToRgb(lower.color);
  const upperRgb = hexToRgb(upper.color);

  const r = Math.round(lowerRgb.r + (upperRgb.r - lowerRgb.r) * factor);
  const g = Math.round(lowerRgb.g + (upperRgb.g - lowerRgb.g) * factor);
  const b = Math.round(lowerRgb.b + (upperRgb.b - lowerRgb.b) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function ContributionGraph({ blocks, title }: ContributionGraphProps) {
  const [hoveredBlock, setHoveredBlock] = useState<MonthlyBlock | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  const colors = SOLAR_COLORS;

  const handleMouseEnter = (block: MonthlyBlock, index: number) => {
    setHoveredBlock(block);

    const blockElement = blockRefs.current[index];
    if (blockElement && containerRef.current) {
      const blockRect = blockElement.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const x = blockRect.left - containerRect.left + blockRect.width / 2;
      const y = blockRect.top - containerRect.top;

      setTooltipPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredBlock(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setHoveredBlock(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      <div className="mb-4 overflow-x-auto">
        <div className="min-w-max">
          <div className="mb-2 flex gap-1 text-xs text-gray-500 dark:text-gray-400">
            {MONTH_POSITIONS.map((pos) => (
              <div
                key={pos}
                className="text-center"
                style={{
                  minWidth: "28px",
                  marginLeft: pos === 0 ? "0" : pos > 0 ? "84px" : "0",
                }}
              >
                {MONTHS[pos]}
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="flex gap-1">
              {blocks.map((block, index) => {
                const backgroundColor =
                  block.usage === 0
                    ? "#f3f4f6"
                    : interpolateColor(block.ratio, colors);

                return (
                  <div
                    key={index}
                    ref={(el) => {
                      blockRefs.current[index] = el;
                    }}
                    className="relative h-7 w-7 shrink-0 cursor-pointer rounded-md transition-all hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{
                      backgroundColor,
                      opacity: block.usage === 0 ? 0.3 : 1,
                    }}
                    onMouseEnter={() => handleMouseEnter(block, index)}
                    onMouseLeave={handleMouseLeave}
                    onFocus={() => handleMouseEnter(block, index)}
                    onBlur={handleMouseLeave}
                    role="button"
                    tabIndex={0}
                    aria-label={`${block.monthName}: ${block.usage.toFixed(
                      1
                    )} kWh`}
                  >
                    {block.usage > 0 && (
                      <div className="absolute inset-0 rounded-md ring-1 ring-black/5 dark:ring-white/10" />
                    )}
                  </div>
                );
              })}
            </div>

            {hoveredBlock && (
              <div
                className="absolute z-50 rounded-lg bg-white px-3 py-2 text-xs shadow-lg dark:bg-gray-800 transition-opacity"
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y - 8}px`,
                  transform: "translate(-50%, -100%)",
                  whiteSpace: "nowrap",
                }}
              >
                <div className="font-semibold text-gray-900 dark:text-white">
                  {hoveredBlock.monthName}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {hoveredBlock.usage.toFixed(1)} kWh
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {(hoveredBlock.ratio * 100).toFixed(0)}% of max
                </div>
                <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-white dark:bg-gray-800" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-4">
        <span className="font-medium">No Data</span>
        <div className="flex items-center gap-1">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <div
              key={ratio}
              className="h-3 w-3 rounded-md transition-all"
              style={{
                backgroundColor: interpolateColor(ratio, colors),
                opacity: ratio === 0 ? 0.3 : 1,
              }}
            />
          ))}
        </div>
        <span className="font-medium">High Generation</span>
      </div>
    </div>
  );
}

export default ContributionGraph;
