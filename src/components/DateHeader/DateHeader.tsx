import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateHeaderProps {
  // вызывается когда выбран диапазон (в правильном порядке: start <= end)
  onDateSelect: (startStr: string, endStr: string, startDate: Date, endDate: Date) => void;
  // текущий (внешний) value — передаётся из родителя, чтобы восстановить диапазон при монтировании
  value?: [Date | null, Date | null];
}

export const DateHeader: React.FC<DateHeaderProps> = ({ onDateSelect, value }) => {
  const [dates, setDates] = useState<[Date | null, Date | null]>(value ?? [null, null]);

  // если value изменился снаружи — синхронизируем локальный state
  useEffect(() => {
    if (!value) return;
    setDates(value);
  }, [value]);

  const formatDateLocal = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const handleChange = (selected: [Date | null, Date | null]) => {
    let [a, b] = selected;

    // если обе даты выбраны — нормализуем их так, чтобы a <= b
    if (a && b) {
      if (a.getTime() > b.getTime()) [a, b] = [b, a];
      setDates([a, b]);
      onDateSelect(formatDateLocal(a), formatDateLocal(b), a, b);
    } else {
      // пока выбран только один клик — сохраняем промежуточное состояние
      setDates([a, b]);
    }
  };

  return (
    <DatePicker
      selectsRange
      startDate={dates[0] ?? undefined}
      endDate={dates[1] ?? undefined}
      onChange={handleChange}
      inline
    />
  );
};
