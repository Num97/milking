import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./TheadRow.module.css";
import { DateHeader } from "../../DateHeader/DateHeader";
import { columns } from "../../../types/columns";

interface TheadRowProps {
  onDateChange: (start: string, end: string) => void;
  onMetricSelect: (metric: string | null) => void;
  selectedMetric?: string | null;
}

export const TheadRow: React.FC<TheadRowProps> = ({ onDateChange, onMetricSelect, selectedMetric }) => {
  const [open, setOpen] = useState(false);
  const thRef = useRef<HTMLTableHeaderCellElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  // Храним выбранные даты здесь, чтобы они сохранялись между открытием/закрытием
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    if (open && thRef.current) {
      const rect = thRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  // закрытие при клике вне th и popup
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node | null;
      if (popupRef.current && popupRef.current.contains(t)) return;
      if (thRef.current && thRef.current.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <thead className={styles.theadMain}>
      <tr>
        {Object.entries(columns).map(([key, label], i) => (
            <th
              key={label}
              ref={key === "date" ? thRef : null}
              className={`
                ${styles.th} 
                ${i === 0 ? styles.firstTh : ""} 
                ${key !== "date" && key !== "number_milking" && key !== "start_time" && key !== "milking_duration" ? styles.clickableTh : ""} 
                ${selectedMetric === key ? styles.activeTh : ""}  // 👈 выделение активного
              `}
              onClick={() => {
                if (key === "date") {
                  setOpen((v) => !v);
                } else if (
                  key !== "number_milking" &&
                  key !== "start_time" &&
                  key !== "milking_duration"
                ) {
                  onMetricSelect(key);
                }
              }}
            >
            {key === "date" ? (
              <div className={styles.dateHeaderWrapper}>
                <div className={styles.dateHeaderClickable}>
                  <span>{label}</span>
                  <img
                    src="/static/img/milking/calendar.svg"
                    alt="calendar"
                    className={styles.calendarIcon}
                  />
                </div>
              </div>
            ) : (
              label
            )}
          </th>
        ))}
      </tr>

      {open &&
        coords &&
        ReactDOM.createPortal(
          <div
            ref={popupRef}
            className={styles.datePopup}
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              zIndex: 3000,
            }}
          >
            <DateHeader
              value={selectedDates}
              onDateSelect={(startStr, endStr, startDate, endDate) => {
                setSelectedDates([startDate, endDate]);
                onDateChange(startStr, endStr);
                setOpen(false);
              }}
            />
          </div>,
          document.body
        )}
    </thead>
  );
};
