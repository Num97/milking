import React from "react";
import type { MilkingReportRow } from "../../../types/forms";
import styles from "./TbodyRow.module.css";

interface TbodyRowProps {
  row: MilkingReportRow;
  index: number;
}

export const TbodyRow: React.FC<TbodyRowProps> = ({ row, index }) => {
  const rowClass = index % 2 === 0 ? styles.trEven : styles.trOdd;

  // 🔹 форматируем время (оставляем только часы и минуты)
  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return time.slice(0, 5); // "HH:MM"
  };

  // 🔹 округляем числа до целого
  const formatInt = (value: number | null) => {
    if (value === null) return "-";
    return Math.round(value);
  };

  const cells = [
    row.date,
    row.number_milking ?? "-",
    row.total_cows ?? "-",
    formatInt(row.total_weight_kg),
    formatTime(row.start_time),
    row.milking_duration ?? "-",
    formatInt(row.cows_per_hour),
    row.total_reattaches ?? "-",
    row.percent_reattaches != null ? `${row.percent_reattaches} %` : "-",
    formatInt(row.percent_justified_reattach) + " %",
    formatInt(row.percent_increasing_flow) + " %",
    row.average_low_flow ?? "-",
    formatInt(row.percent_low_flow) + " %",
    row.milk_two_min ?? "-", 
    formatInt(row.percent_two_min_milk) + " %",
    row.average_duration ?? "-",
    row.total_manual_detach ?? "-",
    row.percent_manual_detach != null ? `${row.percent_manual_detach} %` : "-",
    row.total_manual_mode ?? "-",
    row.percent_manual_mode != null ? `${row.percent_manual_mode} %` : "-",
    row.percent_no_milk != null ? `${row.percent_no_milk} %` : "-",
    row.mixed_up_cows ?? "-",
  ];

  return (
    <tr className={`${rowClass} ${styles.trHover}`}>
      {cells.map((value, i) => (
        <td
          key={i}
          className={`${styles.td} ${
            i === 0 ? styles.firstTd : ""
          } ${i === cells.length - 1 ? styles.lastTd : ""}`}
        >
          {value}
        </td>
      ))}
    </tr>
  );
};
