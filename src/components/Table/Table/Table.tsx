import React, { useState } from "react";
import { TheadRow } from "../TheadRow/TheadRow";
import { TbodyRow } from "../TbodyRow/TbodyRow";
import { UniversalChart } from "../../UniversalChart/UniversalChart"; 
import type { MilkingReportRow } from "../../../types/forms";
import { columns } from "../../../types/columns";

interface TableProps {
  data: MilkingReportRow[];
  onDateChange: (start: string, end: string) => void;
}

export const Table: React.FC<TableProps> = ({ data, onDateChange }) => {
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
            data.map((row, index) => (
              <TbodyRow key={row.id} row={row} index={index} />
            ))
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
