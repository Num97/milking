import React, { useState, useMemo, useEffect } from "react";
import styles from "./UniversalChart.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

interface UniversalChartProps {
  data: any[];
  metric: string;
  metricLabel: string;
  onClose: () => void;
}

interface ChartPoint {
  x: string;
  y: number;
}

export const UniversalChart: React.FC<UniversalChartProps> = ({
  data,
  metric,
  metricLabel,
  onClose,
}) => {
  // мемоизация данных графика
  const chartData: ChartPoint[] = useMemo(
    () =>
      data.map((row) => ({
        x: `${row.date} (${row.number_milking})`,
        y: (row as any)[metric] ?? 0,
      })),
    [data, metric]
  );

  const [selectedPoints, setSelectedPoints] = useState<ChartPoint[]>([]);
  const [showMA, setShowMA] = useState(false);

  const handleChartClick = (e: any) => {
    if (!e || !e.activeLabel) return;

    const nearestPoint = chartData.find((p) => p.x === e.activeLabel);
    if (!nearestPoint) return;

    setSelectedPoints((prev) => {
      if (prev.length === 0) return [nearestPoint];
      if (prev.length === 1) return [...prev, nearestPoint];
      return [nearestPoint];
    });
  };

  // скользящая средняя
  const getMovingAverage = (data: ChartPoint[], windowSize = 3) => {
    return data.map((_, i) => {
      const start = Math.max(0, i - windowSize + 1);
      const subset = data.slice(start, i + 1);
      const avg = subset.reduce((sum, p) => sum + p.y, 0) / subset.length;
      return { x: data[i].x, y: avg };
    });
  };

const movingAvgData = useMemo(() => getMovingAverage(chartData, 5), [chartData]);
const allYs = [
  ...chartData.map(p => p.y),
  ...movingAvgData.map(p => p.y),
];
const minYRaw = Math.min(...allYs);
const maxYRaw = Math.max(...allYs);

const padding = (maxYRaw - minYRaw) * 0.1; // 5% сверху и снизу
const minY = Math.floor(minYRaw - padding); // вниз
const maxY = Math.ceil(maxYRaw + padding);  // вверх

  // useEffect для сброса выбранных точек, если какая-то исчезла из данных
  useEffect(() => {
    const anyMissing = selectedPoints.some(
      (p) => !chartData.some((d) => d.x === p.x && d.y === p.y)
    );
    if (anyMissing) {
      setSelectedPoints([]);
    }
  }, [chartData, selectedPoints]);

  // фильтруем только существующие точки
  const validSelectedPoints = selectedPoints.filter((p) =>
    chartData.some((d) => d.x === p.x && d.y === p.y)
  );

  // расчёт процента и области подсветки
  let percentChange: string | null = null;
  let highlightRange: [string, string] | null = null;

  if (validSelectedPoints.length === 2) {
    const sortedPoints = validSelectedPoints
      .slice()
      .sort(
        (a, b) =>
          chartData.findIndex((p) => p.x === a.x) -
          chartData.findIndex((p) => p.x === b.x)
      );
    const [p1, p2] = sortedPoints;

    percentChange = (((p2.y - p1.y) / p1.y) * 100).toFixed(2);

    const idx1 = chartData.findIndex((p) => p.x === p1.x);
    const idx2 = chartData.findIndex((p) => p.x === p2.x);
    highlightRange = [chartData[idx1].x, chartData[idx2].x];
  }

  return (
    <div style={{ position: "relative", padding: "16px" }}>
      <div className={styles.buttonsContainer}>
        <button
          onClick={onClose}
          className={`${styles.chartButton}`}
        >
          Закрыть график
        </button>

        <button
          onClick={() => setShowMA(prev => !prev)}
          className={`${styles.chartButton} ${styles.maButton} ${showMA ? styles.show : ""}`}
        >
          {showMA ? "Скрыть скользящее среднее" : "Показать скользящее среднее"}
        </button>

        {validSelectedPoints.length > 0 && (
          <button
            onClick={() => setSelectedPoints([])}
            className={`${styles.chartButton}`}
          >
            Сбросить точки
          </button>
        )}
      </div>

      <div
        style={{
          marginTop: 10,
          marginBottom: 20,
          fontWeight: "bold",
          color:
            percentChange !== null
              ? parseFloat(percentChange) >= 0
                ? "green"
                : "red"
              : "black",
        }}
      >
        {percentChange
          ? `Изменение между "${validSelectedPoints[0].x}" и "${validSelectedPoints[1].x}": ${percentChange}%`
          : "Выберете две точки для измерения"}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} onClick={handleChartClick}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis domain={[minY, maxY]}/>
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;
              const mainLine = payload.find((p) => p.name === metricLabel);
              if (!mainLine) return null;

              return (
                <div
                  style={{
                    background: "white",
                    border: "1px solid #ccc",
                    padding: "8px",
                  }}
                >
                  <div>{label}</div>
                  <div style={{ color: "#8884d8" }}>
                    {mainLine.name}: {mainLine.value}
                  </div>
                </div>
              );
            }}
          />
          <Legend />

          {/* основная линия */}
          <Line
            type="monotone"
            dataKey="y"
            stroke="#8884d8"
            name={metricLabel}
            dot={{ r: 6 }}
          />

          {/* выделенный участок */}
          {highlightRange && (
            <ReferenceArea
              x1={highlightRange[0]}
              x2={highlightRange[1]}
              strokeOpacity={0.1}
              fill={
                percentChange !== null && parseFloat(percentChange) >= 0
                  ? "rgba(0, 128, 0, 0.3)"
                  : "rgba(255, 85, 85, 0.3)"
              }
            />
          )}
          {/* Скользящее среднее */}
          {showMA && (
          <Line
            type="monotone"
            data={movingAvgData}
            dataKey="y"
            stroke="#ffb040ff"
            strokeWidth={2}
            dot={false}
            name="Скользящее среднее"
          />
          )}

          {/* точки */}
          <Line
            type="monotone"
            dataKey="y"
            stroke="#8884d8"
            dot={(props: any) => {
              const { cx, cy, payload, index } = props;
              const isSelected = validSelectedPoints.some(
                (p) => p.x === payload.x && p.y === payload.y
              );
              return (
                <circle
                  key={`dot-${index}`}
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 10 : 6}
                  fill={isSelected ? "red" : "blue"}
                  stroke="white"
                  strokeWidth={2}
                  style={{ cursor: "pointer" }}
                />
              );
            }}
            legendType="none"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
