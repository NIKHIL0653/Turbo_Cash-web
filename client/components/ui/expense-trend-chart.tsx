interface ComparisonChartData {
  month: string;
  income: number;
  expense: number;
}

interface ExpenseTrendChartProps {
  data: ComparisonChartData[];
  height?: number;
  currencySymbol?: string;
}

export function ExpenseTrendChart({
  data,
  height = 200,
  currencySymbol = "₹",
}: ExpenseTrendChartProps) {
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

  const expenseData = data.map(item => ({
    name: item.month,
    value: item.expense
  }));

  const maxValue = Math.max(...expenseData.map(d => d.value));
  const minValue = Math.min(...expenseData.map(d => d.value));
  const range = maxValue - minValue || 1;

  const chartHeight = height - 60;
  const chartWidth = 100;
  const stepWidth = chartWidth / (expenseData.length - 1 || 1);

  // Generate path for the line
  const pathData = expenseData
    .map((point, index) => {
      const x = index * stepWidth;
      const y = chartHeight - ((point.value - minValue) / range) * chartHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="w-full bg-background rounded-lg p-3">
      <div style={{ height }} className="relative">
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${chartWidth} ${height}`}
          preserveAspectRatio="none"
        >
          {/* Background */}
          <rect
            x="0"
            y="0"
            width={chartWidth}
            height={chartHeight}
            fill="transparent"
          />

          {/* Horizontal Grid lines */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio, index) => (
            <line
              key={index}
              x1="0"
              y1={chartHeight * ratio}
              x2={chartWidth}
              y2={chartHeight * ratio}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border opacity-30"
            />
          ))}

          {/* Vertical Grid lines */}
          {expenseData.map((_, index) => {
            const x = index * stepWidth;
            return (
              <line
                key={index}
                x1={x}
                y1={0}
                x2={x}
                y2={chartHeight}
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-border opacity-20"
              />
            );
          })}

          {/* Gradient for area fill */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02"/>
            </linearGradient>
          </defs>

          {/* Area under the line */}
          <path
            d={`${pathData} L ${(expenseData.length - 1) * stepWidth} ${chartHeight} L 0 ${chartHeight} Z`}
            fill="url(#areaGradient)"
            stroke="none"
          />

          {/* Line chart */}
          <path
            d={pathData}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {expenseData.map((point, index) => {
            const x = index * stepWidth;
            const y = chartHeight - ((point.value - minValue) / range) * chartHeight;
            return (
              <g key={index}>
                {/* Outer ring for hover effect */}
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="transparent"
                  className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                />
                {/* Main dot */}
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#ffffff"
                  stroke="#ef4444"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
                {/* Hover tooltip */}
                <g className="opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                  <rect
                    x={x - 25}
                    y={y - 25}
                    width="50"
                    height="16"
                    fill="#ef4444"
                    rx="4"
                    className="drop-shadow-md"
                  />
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    className="text-xs fill-white font-medium"
                  >
                    {currencySymbol}{point.value.toLocaleString()}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-2 w-full flex justify-between px-4">
          {expenseData.map((point, index) => (
            <span
              key={index}
              className="text-xs text-muted-foreground text-center font-medium"
              style={{ width: `${100 / expenseData.length}%` }}
            >
              {point.name}
            </span>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-2 top-2 h-full flex flex-col justify-between py-4">
          {[maxValue, (maxValue + minValue) / 2, minValue].map((value, index) => (
            <span
              key={index}
              className="text-xs text-muted-foreground whitespace-nowrap font-medium"
            >
              {currencySymbol}{Math.round(value).toLocaleString()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
