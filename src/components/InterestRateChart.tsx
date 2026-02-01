"use client";

import { useState } from "react";

// Mock historical rate data
const generateRateHistory = (baseRate: number, days: number = 30) => {
  const data = [];
  let rate = baseRate;
  for (let i = days; i >= 0; i--) {
    rate = Math.max(0.5, Math.min(15, rate + (Math.random() - 0.5) * 0.8));
    data.push({
      day: i,
      rate: parseFloat(rate.toFixed(2)),
    });
  }
  return data.reverse();
};

const supplyHistory = generateRateHistory(3.2);
const borrowHistory = generateRateHistory(5.8);

type TimeRange = "7d" | "30d" | "90d";

export function InterestRateChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [hoveredPoint, setHoveredPoint] = useState<{ supply: number; borrow: number } | null>(null);

  const currentSupplyAPY = supplyHistory[supplyHistory.length - 1].rate;
  const currentBorrowAPY = borrowHistory[borrowHistory.length - 1].rate;

  // Filter data based on time range
  const getDaysToShow = (range: TimeRange) => {
    switch (range) {
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
    }
  };

  const daysToShow = getDaysToShow(timeRange);
  const supplyData = supplyHistory.slice(-daysToShow);
  const borrowData = borrowHistory.slice(-daysToShow);

  // Calculate chart dimensions
  const chartWidth = 100;
  const chartHeight = 60;
  const maxRate = Math.max(...borrowData.map(d => d.rate), ...supplyData.map(d => d.rate)) + 1;
  const minRate = Math.min(...borrowData.map(d => d.rate), ...supplyData.map(d => d.rate)) - 0.5;

  const toX = (i: number) => (i / (supplyData.length - 1)) * chartWidth;
  const toY = (rate: number) => chartHeight - ((rate - minRate) / (maxRate - minRate)) * chartHeight;

  const supplyPath = supplyData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.rate)}`).join(' ');
  const borrowPath = borrowData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.rate)}`).join(' ');

  return (
    <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-magic-800/30 glow-magic">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-treasure-gold flex items-center gap-2">
          <span>📈</span> Interest Rates
        </h3>
        <div className="flex gap-1">
          {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 text-xs rounded transition ${
                timeRange === range
                  ? "bg-gradient-to-r from-treasure-ruby to-treasure-magenta text-white"
                  : "bg-treasure-navy/60 text-magic-400 hover:bg-treasure-navy/80 border border-magic-800/30"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Current Rates */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-treasure-navy/60 rounded-lg p-3 border border-treasure-gold/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-treasure-gold rounded-full"></div>
            <span className="text-xs text-magic-400">Supply APY</span>
          </div>
          <div className="text-xl font-bold text-treasure-gold">
            {hoveredPoint?.supply ?? currentSupplyAPY}%
          </div>
        </div>
        <div className="bg-treasure-navy/60 rounded-lg p-3 border border-treasure-ruby/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-treasure-ruby rounded-full"></div>
            <span className="text-xs text-magic-400">Borrow APY</span>
          </div>
          <div className="text-xl font-bold text-treasure-ruby">
            {hoveredPoint?.borrow ?? currentBorrowAPY}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div 
        className="relative h-40 mt-4"
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
            <line
              key={pct}
              x1="0"
              y1={chartHeight * pct}
              x2={chartWidth}
              y2={chartHeight * pct}
              stroke="#312E81"
              strokeWidth="0.2"
            />
          ))}

          {/* Supply line */}
          <path
            d={supplyPath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Borrow line */}
          <path
            d={borrowPath}
            fill="none"
            stroke="#DC2626"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover areas */}
          {supplyData.map((d, i) => (
            <rect
              key={i}
              x={toX(i) - chartWidth / supplyData.length / 2}
              y="0"
              width={chartWidth / supplyData.length}
              height={chartHeight}
              fill="transparent"
              onMouseEnter={() => setHoveredPoint({ supply: d.rate, borrow: borrowData[i].rate })}
            />
          ))}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-magic-500 -ml-6">
          <span>{maxRate.toFixed(1)}%</span>
          <span>{((maxRate + minRate) / 2).toFixed(1)}%</span>
          <span>{minRate.toFixed(1)}%</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-magic-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-treasure-gold"></div>
          <span>Supply APY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-treasure-ruby"></div>
          <span>Borrow APY</span>
        </div>
      </div>

      {/* Rate info */}
      <div className="mt-4 p-3 bg-treasure-navy/60 rounded-lg border border-magic-800/20">
        <p className="text-xs text-magic-400">
          ✨ Interest rates are algorithmically determined based on supply and demand. 
          Higher utilization = higher rates.
        </p>
      </div>
    </div>
  );
}
