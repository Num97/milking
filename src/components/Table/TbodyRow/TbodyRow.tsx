import React, { useState } from "react";
import type { MilkingReportRow, MixedUpCows } from "../../../types/forms";
import styles from "./TbodyRow.module.css";
import { MixedUpCowsModal } from "../../MixedUpCowsModal/MixedUpCowsModal";

interface TbodyRowProps {
  row: MilkingReportRow;
  index: number;
  mixedUpCows?: MixedUpCows[];
}

export const TbodyRow: React.FC<TbodyRowProps> = ({ row, index, mixedUpCows }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const rowClass = index % 2 === 0 ? styles.trEven : styles.trOdd;

  const formatTime = (time: string | null) => (time ? time.slice(0, 5) : "-");
  const formatInt = (value: number | null) => (value === null ? "-" : Math.round(value));

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

  const handleClick = () => {
    if (mixedUpCows && mixedUpCows.length > 0) {
      setModalOpen(true);
    }
  };

  return (
    <>
      <tr
        className={`${rowClass} ${styles.trHover}`}
        onClick={handleClick}
      >
        {cells.map((value, i) => (
          <td
            key={i}
            className={`${styles.td} ${i === 0 ? styles.firstTd : ""} ${
              i === cells.length - 1 ? styles.lastTd : ""
            }`}
          >
            {value}
          </td>
        ))}
      </tr>

      {/* Модальное окно */}
      {modalOpen && mixedUpCows && (
        <MixedUpCowsModal
          data={mixedUpCows}
          date={row.date}
          numberMilking={row.number_milking ?? "-"}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};
