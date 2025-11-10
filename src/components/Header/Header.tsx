import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import type { MilkingReportParams } from "../../types/props";
import { ActiveFiltersModal } from "../ActiveFiltersModal/ActiveFiltersModal";

interface HeaderProps {
  onFilterChange: (params: MilkingReportParams) => void;
  initialParams?: MilkingReportParams;
  onApplyFilters: (values: {
    numeric: Record<string, { min: number | ""; max: number | "" }>;
    milking: number[];
    time: Record<string, { min: string; max: string }>;
  }) => void;
}

const farms = ["Наровчат", "Аршиновка", "Сердобск"];

export const Header = ({
  onFilterChange,
  initialParams,
  onApplyFilters,
}: HeaderProps) => {
  const [selectedFarm, setSelectedFarm] = useState(
    initialParams?.farm || "Наровчат"
  );
  const [selectedDmb, setSelectedDmb] = useState(
    initialParams?.dmb?.toString() || "1"
  );
  const [dates, setDates] = useState({
    date_start: initialParams?.date_start,
    date_end: initialParams?.date_end,
  });

  const [filterOpen, setFilterOpen] = useState(false);

  const getDmbOptions = (farm: string) =>
    farm === "Аршиновка" ? ["1", "2", "3"] : ["1", "2"];

const handleExportExcel = async () => {
  if (!dates.date_start || !dates.date_end) {
    alert("Выберите даты для отчета");
    return;
  }

  const query = new URLSearchParams({
    farm: selectedFarm,
    dmb: selectedDmb,
    date_start: dates.date_start,
    date_end: dates.date_end,
  }).toString();

  try {
    const res = await fetch(`/api/milking/report/excel/?${query}`);
    if (!res.ok) throw new Error("Ошибка при скачивании файла");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `milking_report_${selectedFarm}_${selectedDmb}_${dates.date_start}_${dates.date_end}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Не удалось скачать файл");
    console.error(err);
  }
};

const handleExportSummaryExcel = async () => {
  if (!dates.date_start || !dates.date_end) {
    alert("Выберите даты для отчета");
    return;
  }

  const query = new URLSearchParams({
    farm: selectedFarm,
    dmb: selectedDmb,
    date_start: dates.date_start,
    date_end: dates.date_end,
  }).toString();

  try {
    const res = await fetch(`/api/milking/summary/excel/?${query}`);
    if (!res.ok) throw new Error("Ошибка при скачивании файла");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `milking_summary_${selectedFarm}_${selectedDmb}_${dates.date_start}_${dates.date_end}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Не удалось скачать файл");
    console.error(err);
  }
};


  useEffect(() => {
    onFilterChange({
      farm: selectedFarm,
      dmb: parseInt(selectedDmb),
      ...dates,
    });
  }, [selectedFarm, selectedDmb]);

  useEffect(() => {
    setDates({
      date_start: initialParams?.date_start,
      date_end: initialParams?.date_end,
    });
  }, [initialParams]);


  return (
    <header className={styles.header}>
      {/* Селект фермы */}
      <select
        className={styles.select}
        value={selectedFarm}
        onChange={(e) => {
          setSelectedFarm(e.target.value);
          if (e.target.value !== "Аршиновка" && selectedDmb === "3")
            setSelectedDmb("1");
        }}
      >
        {farms.map((farm) => (
          <option key={farm} value={farm}>
            {farm}
          </option>
        ))}
      </select>

      {/* Селект ДМБ */}
      <select
        className={styles.select}
        value={selectedDmb}
        onChange={(e) => setSelectedDmb(e.target.value)}
      >
        {getDmbOptions(selectedFarm).map((dmb) => (
          <option key={dmb} value={dmb}>
            ДМБ {dmb}
          </option>
        ))}
      </select>

      {/* Просто отображение дат */}
      <div className={styles.dateBlock}>
        {dates.date_start && dates.date_end ? (
          <span className={styles.dateLabel}>
            {new Date(dates.date_start).toLocaleDateString()} –{" "}
            {new Date(dates.date_end).toLocaleDateString()}
          </span>
        ) : (
          <span className={styles.datePlaceholder}>Даты не выбраны</span>
        )}
      </div>

      {/* Фильтр */}
      <img
        src="/static/img/milking/filter.svg"
        alt="Фильтр"
        className={styles.filterIcon}
        style={{ cursor: "pointer" }}
        onClick={() => setFilterOpen(true)}
      />

      <img
        src="/static/img/milking/excel.svg"
        alt="Экспорт в Excel"
        className={styles.filterIcon}
        style={{ cursor: "pointer" }}
        onClick={handleExportExcel}
      />

      <img
        src="/static/img/milking/milk.svg"
        alt="Экспорт Summary в Excel"
        className={styles.filterIcon}
        style={{ cursor: "pointer" }}
        onClick={handleExportSummaryExcel}
      />

      <ActiveFiltersModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={onApplyFilters}
      />
    </header>
  );
};
