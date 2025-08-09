import React, { useState } from "react";

interface ChartData {
  month: string;
  amount: number;
}

interface CategoryTrendsProps {
  categoryTrends: Record<string, ChartData[]>;
  totalTrends: ChartData[];
  height?: number;
}

const categoryColors: Record<string, string> = {
  "Food & Dining": "#ef4444",
  Transportation: "#3b82f6",
  Shopping: "#10b981",
  Entertainment: "#f59e0b",
  "Bills & Utilities": "#8b5cf6",
  Healthcare: "#ec4899",
  Education: "#06b6d4",
  Travel: "#84cc16",
  Other: "#6b7280",
};

export function CategoryTrendsChart({
  categoryTrends,
  totalTrends,
  height = 300,
}: CategoryTrendsProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Object.keys(categoryTrends).slice(0, 3), // Show top 3 by default
  );
  const [showTotal, setShowTotal] = useState(true);

  if (!categoryTrends || Object.keys(categoryTrends).length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 rounded-lg text-gray-500"
        style={{ height }}
      >
        No spending data available
      </div>
    );
  }

  const allCategories = Object.keys(categoryTrends);
  const maxValue = Math.max(
    ...Object.values(categoryTrends)
      .flat()
      .map((d) => d.amount),
    ...totalTrends.map((d) => d.amount),
  );
  const chartHeight = height - 80; // Leave space for labels and legend

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <div className="w-full">
      {/* Category Legend/Controls */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setShowTotal(!showTotal)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
              showTotal
                ? "bg-gray-600 text-white border-gray-600"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
          >
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            Total
          </button>
          {allCategories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            const color = categoryColors[category] || "#6b7280";
            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                  isSelected
                    ? "text-white border-transparent"
                    : "bg-gray-100 text-gray-600 border-gray-300"
                }`}
                style={
                  isSelected
                    ? { backgroundColor: color, borderColor: color }
                    : {}
                }
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-background rounded-lg border">
        <div style={{ height }} className="relative p-4">
          <svg
            className="w-full h-full"
            viewBox={`0 0 100 ${chartHeight}`}
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <line
                key={index}
                x1="5"
                y1={chartHeight * ratio}
                x2="95"
                y2={chartHeight * ratio}
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-muted-foreground opacity-30"
              />
            ))}

            {/* Total line */}
            {showTotal && totalTrends.length > 1 && (
              <path
                d={totalTrends
                  .map((point, index) => {
                    const x = 5 + index * (90 / (totalTrends.length - 1));
                    const y =
                      chartHeight - (point.amount / maxValue) * chartHeight;
                    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#6b7280"
                strokeWidth="2.5"
                strokeDasharray="5,5"
                className="opacity-70"
              />
            )}

            {/* Category lines */}
            {selectedCategories.map((category) => {
              const data = categoryTrends[category];
              const color = categoryColors[category] || "#6b7280";

              if (!data || data.length < 2) return null;

              const pathData = data
                .map((point, index) => {
                  const x = 5 + index * (90 / (data.length - 1));
                  const y =
                    chartHeight - (point.amount / maxValue) * chartHeight;
                  return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ");

              return (
                <g key={category}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    className="drop-shadow-sm"
                  />
                  {/* Data points */}
                  {data.map((point, index) => {
                    const x = 5 + index * (90 / (data.length - 1));
                    const y =
                      chartHeight - (point.amount / maxValue) * chartHeight;
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="2"
                        fill={color}
                        className="drop-shadow-sm"
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-2 left-4 right-4 flex justify-between">
            {totalTrends.map((point, index) => (
              <span
                key={index}
                className="text-xs text-muted-foreground text-center"
              >
                {point.month}
              </span>
            ))}
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-4 bottom-4 flex flex-col justify-between">
            {[maxValue, maxValue * 0.5, 0].map((value, index) => (
              <span key={index} className="text-xs text-muted-foreground">
                ${Math.round(value).toLocaleString()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      {selectedCategories.length > 0 && (
        <div className="mt-3 text-xs text-muted-foreground">
          Showing {selectedCategories.length} categor
          {selectedCategories.length === 1 ? "y" : "ies"}
          {showTotal && " + total spending trend"}
        </div>
      )}
    </div>
  );
}
