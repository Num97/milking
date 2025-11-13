import React from 'react';
import styles from './MixedUpCowsCard.module.css';
import type { MixedUpCows } from '../../types/forms';

interface MixedUpCowsCardProps {
  data: MixedUpCows[];
}

export const MixedUpCowsCard: React.FC<MixedUpCowsCardProps> = ({ data }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Смешанные коровы</h3>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>№</th>
              <th>Присвоенная</th>
              <th>Подоена</th>
              <th>Подряд</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const isHighlighted = row.times !== null && row.times >= 3;
              return (
                <tr
                  key={row.id}
                  className={`${styles.tr} ${
                    isHighlighted ? styles.highlight : ''
                  }`}
                >
                  <td className={styles.cowNumber}>{row.cow_number ?? '-'}</td>
                  <td className={styles.cell}>{row.lot_number_assigned ?? '-'}</td>
                  <td className={styles.cell}>{row.lot_number_milked ?? '-'}</td>
                  <td
                    className={`${styles.cell} ${styles.times} ${
                      isHighlighted ? styles.timesHighlight : ''
                    }`}
                  >
                    {row.times ?? '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
