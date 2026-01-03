/**
 * BioChart Component
 * SVG-based biorhythm chart visualization
 */

import React, { useMemo } from 'react';
import { BiorhythmDay, formatBiorhythmDate } from '../../services/biorhythm.service';

interface BioChartProps {
  data: BiorhythmDay[];
  onDayClick?: (date: string) => void;
  selectedDate?: string | null;
}

// Helper to get cycle value by type
const getCycleValue = (day: BiorhythmDay, type: 'physical' | 'emotional' | 'intellectual'): number => {
  const cycle = day.cycles.find(c => c.type === type);
  return cycle?.value ?? 0;
};

const CHART_CONFIG = {
  width: 600,
  height: 280,
  padding: { top: 30, right: 20, bottom: 40, left: 45 },
  colors: {
    physical: '#FF6B6B',
    emotional: '#4ECDC4',
    intellectual: '#45B7D1',
    grid: 'rgba(255, 255, 255, 0.1)',
    zeroLine: 'rgba(255, 255, 255, 0.3)',
    text: 'rgba(255, 255, 255, 0.6)',
  },
};

export const BioChart: React.FC<BioChartProps> = ({ data, onDayClick, selectedDate }) => {
  const { width, height, padding, colors } = CHART_CONFIG;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Calculate positions
  const points = useMemo(() => {
    if (data.length === 0) return { physical: '', emotional: '', intellectual: '' };

    const xStep = chartWidth / (data.length - 1 || 1);
    const yScale = (value: number) => {
      // Value is -100 to 100, map to chartHeight (inverted for SVG)
      return padding.top + chartHeight / 2 - (value / 100) * (chartHeight / 2);
    };

    const createPath = (key: 'physical' | 'emotional' | 'intellectual') => {
      return data
        .map((d, i) => {
          const x = padding.left + i * xStep;
          const y = yScale(getCycleValue(d, key));
          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
    };

    return {
      physical: createPath('physical'),
      emotional: createPath('emotional'),
      intellectual: createPath('intellectual'),
    };
  }, [data, chartWidth, chartHeight, padding]);

  // Create smooth curve paths using Catmull-Rom to Bezier conversion
  const smoothPaths = useMemo(() => {
    if (data.length < 2) return points;

    const xStep = chartWidth / (data.length - 1 || 1);
    const yScale = (value: number) => {
      return padding.top + chartHeight / 2 - (value / 100) * (chartHeight / 2);
    };

    const createSmoothPath = (key: 'physical' | 'emotional' | 'intellectual') => {
      const pts = data.map((d, i) => ({
        x: padding.left + i * xStep,
        y: yScale(getCycleValue(d, key)),
      }));

      if (pts.length < 2) return '';

      let path = `M ${pts[0].x} ${pts[0].y}`;

      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }

      return path;
    };

    return {
      physical: createSmoothPath('physical'),
      emotional: createSmoothPath('emotional'),
      intellectual: createSmoothPath('intellectual'),
    };
  }, [data, chartWidth, chartHeight, padding, points]);

  // Calculate dot positions for interactivity
  const dotPositions = useMemo(() => {
    if (data.length === 0) return [];

    const xStep = chartWidth / (data.length - 1 || 1);
    const yScale = (value: number) => {
      return padding.top + chartHeight / 2 - (value / 100) * (chartHeight / 2);
    };

    return data.map((d, i) => {
      const physicalVal = getCycleValue(d, 'physical');
      const emotionalVal = getCycleValue(d, 'emotional');
      const intellectualVal = getCycleValue(d, 'intellectual');
      return {
        date: d.date,
        x: padding.left + i * xStep,
        physical: { y: yScale(physicalVal), value: physicalVal },
        emotional: { y: yScale(emotionalVal), value: emotionalVal },
        intellectual: { y: yScale(intellectualVal), value: intellectualVal },
        isToday: d.date === today,
        isSelected: d.date === selectedDate,
      };
    });
  }, [data, chartWidth, chartHeight, padding, today, selectedDate]);

  // Grid lines
  const gridLines = useMemo(() => {
    const yLines = [-100, -50, 0, 50, 100];
    const yScale = (value: number) => {
      return padding.top + chartHeight / 2 - (value / 100) * (chartHeight / 2);
    };

    return yLines.map((value) => ({
      value,
      y: yScale(value),
    }));
  }, [chartHeight, padding]);

  // X-axis labels (show fewer labels for clarity)
  const xLabels = useMemo(() => {
    if (data.length === 0) return [];

    const step = data.length <= 7 ? 1 : Math.ceil(data.length / 7);
    const xStep = chartWidth / (data.length - 1 || 1);

    return data
      .filter((_, i) => i % step === 0 || i === data.length - 1)
      .map((d, _) => {
        const actualIndex = data.findIndex((item) => item.date === d.date);
        return {
          date: d.date,
          label: formatBiorhythmDate(d.date),
          x: padding.left + actualIndex * xStep,
          isToday: d.date === today,
        };
      });
  }, [data, chartWidth, padding, today]);

  return (
    <div className="biochart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="biochart__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients for glowing effect */}
          <linearGradient id="physicalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.physical} stopOpacity="0.8" />
            <stop offset="50%" stopColor={colors.physical} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.physical} stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="emotionalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.emotional} stopOpacity="0.8" />
            <stop offset="50%" stopColor={colors.emotional} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.emotional} stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="intellectualGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.intellectual} stopOpacity="0.8" />
            <stop offset="50%" stopColor={colors.intellectual} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.intellectual} stopOpacity="0.8" />
          </linearGradient>

          {/* Glow filters */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {gridLines.map(({ value, y }) => (
          <g key={value}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke={value === 0 ? colors.zeroLine : colors.grid}
              strokeWidth={value === 0 ? 2 : 1}
              strokeDasharray={value === 0 ? '' : '4 4'}
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              fill={colors.text}
              fontSize="11"
              textAnchor="end"
            >
              {value > 0 ? `+${value}` : value}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map(({ date, label, x, isToday }) => (
          <text
            key={date}
            x={x}
            y={height - 10}
            fill={isToday ? '#fff' : colors.text}
            fontSize="10"
            textAnchor="middle"
            fontWeight={isToday ? 'bold' : 'normal'}
          >
            {label}
          </text>
        ))}

        {/* Biorhythm lines */}
        <path
          d={smoothPaths.physical}
          fill="none"
          stroke="url(#physicalGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
          className="biochart__line biochart__line--physical"
        />
        <path
          d={smoothPaths.emotional}
          fill="none"
          stroke="url(#emotionalGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
          className="biochart__line biochart__line--emotional"
        />
        <path
          d={smoothPaths.intellectual}
          fill="none"
          stroke="url(#intellectualGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
          className="biochart__line biochart__line--intellectual"
        />

        {/* Interactive dots */}
        {dotPositions.map((pos) => (
          <g
            key={pos.date}
            className={`biochart__dot-group ${pos.isToday ? 'biochart__dot-group--today' : ''} ${pos.isSelected ? 'biochart__dot-group--selected' : ''}`}
            onClick={() => onDayClick?.(pos.date)}
            style={{ cursor: 'pointer' }}
          >
            {/* Invisible larger hit area */}
            <rect
              x={pos.x - 15}
              y={padding.top}
              width={30}
              height={chartHeight}
              fill="transparent"
            />

            {/* Today indicator */}
            {pos.isToday && (
              <line
                x1={pos.x}
                y1={padding.top}
                x2={pos.x}
                y2={padding.top + chartHeight}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            )}

            {/* Dots */}
            <circle
              cx={pos.x}
              cy={pos.physical.y}
              r={pos.isSelected || pos.isToday ? 6 : 4}
              fill={colors.physical}
              className="biochart__dot"
            />
            <circle
              cx={pos.x}
              cy={pos.emotional.y}
              r={pos.isSelected || pos.isToday ? 6 : 4}
              fill={colors.emotional}
              className="biochart__dot"
            />
            <circle
              cx={pos.x}
              cy={pos.intellectual.y}
              r={pos.isSelected || pos.isToday ? 6 : 4}
              fill={colors.intellectual}
              className="biochart__dot"
            />
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="biochart__legend">
        <div className="biochart__legend-item">
          <span className="biochart__legend-color" style={{ background: colors.physical }} />
          <span className="biochart__legend-label">Fisico</span>
        </div>
        <div className="biochart__legend-item">
          <span className="biochart__legend-color" style={{ background: colors.emotional }} />
          <span className="biochart__legend-label">Emocional</span>
        </div>
        <div className="biochart__legend-item">
          <span className="biochart__legend-color" style={{ background: colors.intellectual }} />
          <span className="biochart__legend-label">Intelectual</span>
        </div>
      </div>
    </div>
  );
};

export default BioChart;
