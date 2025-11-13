import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import styles from './MixedUpCowsModal.module.css';
import { MixedUpCowsCard } from '../MixedUpCowsCard/MixedUpCowsCard';
import type { MixedUpCows } from '../../types/forms';

interface MixedUpCowsModalProps {
  data: MixedUpCows[];
  date: string;
  numberMilking: string | number;
  onClose?: () => void;
}

export const MixedUpCowsModal: React.FC<MixedUpCowsModalProps> = ({ data, date, numberMilking, onClose }) => {
  return (
    <Dialog.Root
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen && onClose) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.modalContent}>
          <Dialog.Close asChild>
            <button className={styles.closeButton} aria-label="Закрыть">
              <X className={styles.closeIcon} />
            </button>
          </Dialog.Close>
            <Dialog.Title className={styles.title}>
              <div>
                Дата: <span className={styles.value}>{date}</span>
              </div>
              <div>
                Доение: <span className={styles.value}>{numberMilking}</span>
              </div>
            </Dialog.Title>
          <MixedUpCowsCard data={data} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
