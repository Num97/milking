import React, { useState } from "react";
import { TheadRow } from "../TheadRow/TheadRow";
import { TbodyRow } from "../TbodyRow/TbodyRow";
import { UniversalChart } from "../../UniversalChart/UniversalChart"; 
import type { MilkingReportRow, MixedUpCows } from "../../../types/forms";
import { columns } from "../../../types/columns";

interface TableProps {
  data: MilkingReportRow[];
  onDateChange: (start: string, end: string) => void;
  mixedUpCowsData?: MixedUpCows[];
}

export const Table: React.FC<TableProps> = ({ data, onDateChange, mixedUpCowsData }) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const handleMetricSelect = (metric: string | null) => {
    setSelectedMetric((prev) => (prev === metric ? null : metric));
  };


  return (
    <table>
      <TheadRow
        onDateChange={onDateChange}
        onMetricSelect={handleMetricSelect}
        selectedMetric={selectedMetric}
      />

      {selectedMetric ? (
        <tbody>
          <tr>
            <td colSpan={24}>
              <UniversalChart
                data={data}
                metric={selectedMetric}
                metricLabel={columns[selectedMetric]}
                onClose={() => setSelectedMetric(null)}
              />
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => {
              // Отбираем все mixedUpCows для этой строки
              const mixedUpForRow = mixedUpCowsData
                ? mixedUpCowsData.filter((m) => m.milkingshift_id === row.milkingshift_id)
                : [];

              return (
                <TbodyRow
                  key={row.id}
                  row={row}
                  index={index}
                  mixedUpCows={mixedUpForRow} // <-- передаем сюда массив
                />
              );
            })
          ) : (
            <tr>
              <td colSpan={24} style={{ textAlign: "center" }}>
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      )}
    </table>
  );
};
