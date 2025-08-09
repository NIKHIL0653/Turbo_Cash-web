import React from "react";

interface ChartData {
  name: string;
  value: number;
}

interface LineChartProps {
  data: ChartData[];
  height?: number;
  color?: string;
  currencySymbol?: string;
}

export function SimpleLineChart({
  data,
  height = 200,
  color = "#14b8a6",
  currencySymbol = "₹",
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-muted rounded-lg text-muted-foreground"
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const chartHeight = height - 60; // Leave space for labels
  const chartWidth = 100; // Use percentage
  const stepWidth = chartWidth / (data.length - 1 || 1);

  // Generate path for the line
  const pathData = data
    .map((point, index) => {
      const x = index * stepWidth;
      const y = chartHeight - ((point.value - minValue) / range) * chartHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="w-full bg-background rounded-lg">
      <div style={{ height }} className="relative">
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${chartWidth} ${height}`}
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <line
              key={index}
              x1="0"
              y1={chartHeight * ratio}
              x2={chartWidth}
              y2={chartHeight * ratio}
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          ))}

          {/* Line chart */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = index * stepWidth;
            const y =
              chartHeight - ((point.value - minValue) / range) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 w-full flex justify-between px-2 py-2">
          {data.map((point, index) => (
            <span
              key={index}
              className="text-xs text-gray-600 text-center"
              style={{ width: `${100 / data.length}%` }}
            >
              {point.name}
            </span>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 pr-2 text-right">
          {[maxValue, (maxValue + minValue) / 2, minValue].map(
            (value, index) => (
              <span
                key={index}
                className="text-xs text-muted-foreground whitespace-nowrap"
              >
                {currencySymbol}
                {Math.round(value).toLocaleString()}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

interface BarChartProps {
  data: ChartData[];
  height?: number;
  color?: string;
  currencySymbol?: string;
}

export function SimpleBarChart({
  data,
  height = 200,
  color = "#14b8a6",
  currencySymbol = "₹",
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-muted rounded-lg text-muted-foreground"
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="w-full bg-background rounded-lg">
      <div style={{ height }} className="relative p-4">
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color,
                  minHeight: "4px",
                }}
              />
              <span className="text-xs text-gray-600 mt-2 text-center">
                {item.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {currencySymbol}
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ComparisonChartData {
  month: string;
  income: number;
  expense: number;
}

interface ComparisonBarChartProps {
  data: ComparisonChartData[];
  height?: number;
  currencySymbol?: string;
}

export function ComparisonBarChart({
  data,
  height = 200,
  currencySymbol = "₹",
}: ComparisonBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 rounded-lg text-gray-500"
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expense]));
  const chartHeight = height - 20; // More compact spacing

  return (
    <div className="w-full bg-background rounded-lg p-2">
      <div style={{ height }} className="relative">
        <div className="flex items-end justify-between h-full space-x-2 pb-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center flex-1 space-y-1"
            >
              {/* Month label */}
              <div className="text-xs font-medium text-foreground mb-1">
                {item.month}
              </div>

              {/* Bars container */}
              <div className="flex items-end space-x-0.5 h-full">
                {/* Income bar */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 bg-green-500 rounded-t-md transition-all duration-300 hover:opacity-80 relative group"
                    style={{
                      height: `${item.income > 0 ? (item.income / maxValue) * (chartHeight - 25) : 3}px`,
                      minHeight: "3px",
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                      {currencySymbol}
                      {item.income.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-green-600 mt-1 font-medium">
                    Income
                  </span>
                </div>

                {/* Expense bar */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 bg-red-500 rounded-t-md transition-all duration-300 hover:opacity-80 relative group"
                    style={{
                      height: `${item.expense > 0 ? (item.expense / maxValue) * (chartHeight - 25) : 3}px`,
                      minHeight: "3px",
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                      {currencySymbol}
                      {item.expense.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-red-600 mt-1 font-medium">
                    Expense
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
