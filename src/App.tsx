import { useEffect, useState } from "react";
import { BrowserRouter, useSearchParams } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header/Header";
import { getMilkingReport } from "./utils/api";
import type { MilkingReportRow } from "./types/forms";
import type { MilkingReportParams } from "./types/props";
import { Table } from "./components/Table/Table/Table";

function AppContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<MilkingReportRow[]>([]);
  const [filters, setFilters] = useState<{
  numeric: Record<string, { min: number | ""; max: number | "" }>;
  time: Record<string, { min: string; max: string }>;
  milking: number[];
}>({
  numeric: {},
  time: {},
  milking: [],
});

const handleApplyFilters = (newFilters: {
  numeric: Record<string, { min: number | ""; max: number | "" }>;
  time: Record<string, { min: string; max: string }>;
  milking: number[];
}) => {
  setFilters(newFilters);
};



  const formatDateLocal = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  // начальные параметры
  const getInitialParams = (): MilkingReportParams => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const weekAgo = new Date(yesterday);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      farm: searchParams.get("farm") || "Наровчат",
      dmb: parseInt(searchParams.get("dmb") || "1"),
      date_start: searchParams.get("date_start") || formatDateLocal(weekAgo),
      date_end: searchParams.get("date_end") || formatDateLocal(yesterday),
    };
  };

  const [params, setParams] = useState<MilkingReportParams>(getInitialParams);

  // Получаем данные при изменении params
  useEffect(() => {
    const fetchData = async () => {
      const response = await getMilkingReport(params);
      setData(response);
    };
    fetchData();
  }, [params]);

  // Обновление фильтров и URL
  const handleFilterChange = (newParams: Partial<MilkingReportParams>) => {
    const updated = { ...params, ...newParams };
    setParams(updated);               // обновляем состояние
    setSearchParams(updated as any);  // обновляем URL отдельно
  };

  // Обновление дат из календаря
  const handleDateChange = (date_start: string, date_end: string) => {
    handleFilterChange({ date_start, date_end });
  };

const filteredData = data.filter((row) => {
  // --- числовые фильтры ---
  const numericPass = Object.entries(filters.numeric).every(
    ([key, { min, max }]) => {
      let value = row[key as keyof MilkingReportRow] as number;
      if (value == null || isNaN(value)) return true;

      if ([
        "total_weight_kg",
        "cows_per_hour",
        "percent_justified_reattach",
        "percent_increasing_flow",
        "percent_low_flow",
        "percent_two_min_milk"
      ].includes(key)) {
        value = Math.round(value);
      }

      if (min !== "" && value < (min as number)) return false;
      if (max !== "" && value > (max as number)) return false;
      return true;
    }
  );

  // --- фильтр по доениям ---
  const milkingPass =
    filters.milking.length === 0 ||
    (row.number_milking != null &&
      filters.milking.includes(row.number_milking));

  // --- фильтры по времени ---
  const timePass = (["start_time", "milking_duration"] as const).every(
    (timeKey) => {
      const timeStr = row[timeKey] as string | null;
      if (!timeStr) return true;

      const [hours, minutes] = timeStr.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;

      const minStr = filters.time[timeKey]?.min || "";
      const maxStr = filters.time[timeKey]?.max || "";

      let minMinutes = 0;
      let maxMinutes = 24 * 60;

      if (minStr) {
        const [h, m] = minStr.split(":").map(Number);
        minMinutes = h * 60 + m;
      }

      if (maxStr) {
        const [h, m] = maxStr.split(":").map(Number);
        maxMinutes = h * 60 + m;
      }

      return totalMinutes >= minMinutes && totalMinutes <= maxMinutes;
    }
  );

  return numericPass && milkingPass && timePass;
});

  return (
    <div>
      <Header onFilterChange={handleFilterChange} initialParams={params} onApplyFilters={handleApplyFilters}/>
      <Table data={filteredData} onDateChange={handleDateChange} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

