import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { PerformanceTrend } from '../../types/organisationTypes';

interface PerformanceChartProps {
  data: PerformanceTrend[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const metrics = [
    { key: 'averageScore', label: 'Avg Score', color: 'rgb(59, 130, 246)' },
    { key: 'averageConfidence', label: 'Avg Confidence', color: 'rgb(16, 185, 129)' },
    { key: 'averageAnswerScore', label: 'Avg Answer Score', color: 'rgb(245, 158, 11)' },
    { key: 'completedQuestions', label: 'Completed Questions', color: 'rgb(139, 92, 246)', scale: 10 },
  ];

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    metrics.map(m => m.key)
  );

  const toggleMetric = (key: string) => {
    if (selectedMetrics.includes(key)) {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter(m => m !== key));
      }
    } else {
      setSelectedMetrics([...selectedMetrics, key]);
    }
  };

  const chartHeight = 300;
  const chartWidth = 800;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const getMaxValue = () => {
    let max = 0;
    data.forEach(point => {
      metrics.forEach(metric => {
        if (selectedMetrics.includes(metric.key)) {
          const value = point[metric.key as keyof PerformanceTrend] as number;
          const scaledValue = metric.scale ? value / metric.scale : value;
          max = Math.max(max, scaledValue);
        }
      });
    });
    return Math.ceil(max / 10) * 10;
  };

  const maxValue = getMaxValue();

  const getYPosition = (value: number) => {
    return innerHeight - (value / maxValue) * innerHeight;
  };

  const getXPosition = (index: number) => {
    return (index / (data.length - 1)) * innerWidth;
  };

  const createPath = (metricKey: string, scale?: number) => {
    return data
      .map((point, index) => {
        const value = point[metricKey as keyof PerformanceTrend] as number;
        const scaledValue = scale ? value / scale : value;
        const x = getXPosition(index);
        const y = getYPosition(scaledValue);
        return `${index === 0 ? 'M' : 'L'} ${x + padding.left} ${y + padding.top}`;
      })
      .join(' ');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Performance Trends
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => toggleMetric(metric.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedMetrics.includes(metric.key)
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
            style={
              selectedMetrics.includes(metric.key)
                ? { borderLeft: `4px solid ${metric.color}` }
                : {}
            }
          >
            {metric.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="w-full"
          style={{ minWidth: '600px' }}
        >
          <defs>
            {metrics.map((metric) => (
              <linearGradient
                key={`gradient-${metric.key}`}
                id={`gradient-${metric.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={metric.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={metric.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {Array.from({ length: 6 }).map((_, i) => {
            const y = padding.top + (innerHeight / 5) * i;
            const value = maxValue - (maxValue / 5) * i;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 5}
                  textAnchor="end"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                >
                  {value.toFixed(0)}
                </text>
              </g>
            );
          })}

          {metrics.map((metric) =>
            selectedMetrics.includes(metric.key) ? (
              <motion.path
                key={metric.key}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                d={createPath(metric.key, metric.scale)}
                fill="none"
                stroke={metric.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null
          )}

          {data.map((point, index) => {
            const x = getXPosition(index) + padding.left;
            return (
              <g key={index}>
                <text
                  x={x}
                  y={chartHeight - padding.bottom + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                >
                  {point.date}
                </text>

                {selectedMetrics.map((metricKey) => {
                  const metric = metrics.find(m => m.key === metricKey);
                  if (!metric) return null;

                  const value = point[metricKey as keyof PerformanceTrend] as number;
                  const scaledValue = metric.scale ? value / metric.scale : value;
                  const y = getYPosition(scaledValue) + padding.top;

                  return (
                    <motion.circle
                      key={`${index}-${metricKey}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      cx={x}
                      cy={y}
                      r={hoveredIndex === index ? 6 : 4}
                      fill={metric.color}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                })}

                {hoveredIndex === index && (
                  <g>
                    <rect
                      x={x - 70}
                      y={padding.top - 10}
                      width="140"
                      height={selectedMetrics.length * 20 + 30}
                      fill="currentColor"
                      className="fill-gray-900 dark:fill-gray-800"
                      rx="6"
                      opacity="0.95"
                    />
                    <text
                      x={x}
                      y={padding.top + 10}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-white"
                    >
                      {point.date}
                    </text>
                    {selectedMetrics.map((metricKey, i) => {
                      const metric = metrics.find(m => m.key === metricKey);
                      if (!metric) return null;
                      const value = point[metricKey as keyof PerformanceTrend] as number;
                      return (
                        <text
                          key={metricKey}
                          x={x}
                          y={padding.top + 30 + i * 20}
                          textAnchor="middle"
                          className="text-xs fill-white"
                        >
                          {metric.label}: {value.toFixed(1)}
                        </text>
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
