import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface ActiveFiltersModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (values: {
    numeric: Record<string, { min: number | ''; max: number | '' }>;
    milking: number[];
    time: Record<'start_time' | 'milking_duration', { min: string; max: string }>;
  }) => void;
}

const columns: Record<string, string> = {
  total_cows: 'Всего коров',
  total_weight_kg: 'Надой',
  cows_per_hour: 'Коров в час',
  total_reattaches: 'Повторные соединения',
  percent_reattaches: '% повторные соединения',
  percent_justified_reattach: '% оправданных переподкл.',
  percent_increasing_flow: '% возр. молокопотока',
  average_low_flow: 'Секунд в слабом потоке',
  percent_low_flow: '% секунд в слабом потоке',
  milk_two_min: 'Молоко за 2 минуты',
  percent_two_min_milk: '% молока за 2 минуты',
  average_duration: 'Время на 1 корову',
  total_manual_detach: 'Руч. откл.',
  percent_manual_detach: '% руч.откл.',
  total_manual_mode: 'Ручные режимы',
  percent_manual_mode: '% ручных режимов',
  percent_no_milk: 'Не присвоено молока',
  mixed_up_cows: 'Путанные коровы',
};

export const ActiveFiltersModal: React.FC<ActiveFiltersModalProps> = ({
  open,
  onClose,
  onApply,
}) => {
  const [values, setValues] = useState<Record<string, { min: number | ''; max: number | '' }>>(
    Object.fromEntries(Object.keys(columns).map((col) => [col, { min: '', max: '' }]))
  );

  const [milking, setMilking] = useState<number[]>([]);
  const [timeValues, setTimeValues] = useState<Record<'start_time' | 'milking_duration', { min: string; max: string }>>({
    start_time: { min: '', max: '' },
    milking_duration: { min: '', max: '' },
  });

  // ⚡ Автоприменение фильтров при изменении любого состояния
  useEffect(() => {
    onApply({ numeric: values, milking, time: timeValues });
  }, [values, milking, timeValues]);

  const handleChange = (col: string, type: 'min' | 'max', val: string) => {
    setValues((prev) => ({
      ...prev,
      [col]: { ...prev[col], [type]: val === '' ? '' : Number(val) },
    }));
  };

  const handleCheckbox = (num: number) => {
    setMilking((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const handleTimeChange = (key: 'start_time' | 'milking_duration', type: 'min' | 'max', date: Date | null) => {
    if (date) {
      const hh = date.getHours().toString().padStart(2, '0');
      const mm = date.getMinutes().toString().padStart(2, '0');
      setTimeValues((prev) => ({
        ...prev,
        [key]: { ...prev[key], [type]: `${hh}:${mm}` },
      }));
    } else {
      setTimeValues((prev) => ({
        ...prev,
        [key]: { ...prev[key], [type]: '' },
      }));
    }
  };

  const handleReset = () => {
    setValues(Object.fromEntries(Object.keys(columns).map((col) => [col, { min: '', max: '' }])) );
    setMilking([]);
    setTimeValues({
      start_time: { min: '', max: '' },
      milking_duration: { min: '', max: '' },
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
          <Box
            sx={{
              position: 'absolute' as 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 1200,
              maxHeight: '80vh',
              bgcolor: 'background.paper',
              boxShadow: 24,
              pt: 0,
              pr: 4,
              pb: 4,
              pl: 4,
              overflowY: 'auto',
              borderRadius: 2,
            }}
          >
            {/* Кнопки управления сверху */}
            <Box
              sx={{
                position: 'sticky',
                top: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                backgroundColor: 'background.paper',
                zIndex: 10,
                p: 2,
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={handleReset}
              >
                Сбросить фильтры
              </Button>

              <Typography variant="h6" textAlign="center" mr={12}>
                Активные фильтры
              </Typography>

              <Button
                variant="text"
                color="error"
                size="small"
                onClick={onClose}
              >
                ✖
              </Button>
            </Box>

    {/* <Typography variant="h6" mb={3} textAlign="center">
      Активные фильтры
    </Typography> */}

    {/* чекбоксы для доек */}
    <Box mb={3} textAlign="center">
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, color: '#5c5c5cff', textDecoration: 'underline', mb: 1 }}
      >
        Дойка
      </Typography>
      <FormGroup
        row
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {[1, 2, 3].map((num) => (
          <FormControlLabel
            key={num}
            control={<Checkbox checked={milking.includes(num)} onChange={() => handleCheckbox(num)} />}
            label={`Дойка ${num}`}
          />
        ))}
      </FormGroup>
    </Box>

        {/* фильтры по времени */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 3 }}>
            {(['start_time', 'milking_duration'] as const).map((timeKey) => (
              <Box key={timeKey} sx={{ width: '30%', textAlign: 'center' }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: '#5c5c5cff', textDecoration: 'underline', mb: 1 }}
                >
                  {timeKey === 'start_time' ? 'Начало доения' : 'Продолжительность'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TimePicker
                    label="min"
                    value={timeValues[timeKey].min ? new Date(`1970-01-01T${timeValues[timeKey].min}:00`) : null}
                    onChange={(date) => handleTimeChange(timeKey, 'min', date)}
                    ampm={false}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <TimePicker
                    label="max"
                    value={timeValues[timeKey].max ? new Date(`1970-01-01T${timeValues[timeKey].max}:00`) : null}
                    onChange={(date) => handleTimeChange(timeKey, 'max', date)}
                    ampm={false}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </LocalizationProvider>

        {/* числовые фильтры */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 3 }}>
          {Object.entries(columns).map(([key, label]) => (
            <Box key={key} sx={{ width: '23%', textAlign: 'center' }}>
              <Typography variant="subtitle1" mb={1} sx={{ fontWeight: 600, color: '#5c5c5cff', textDecoration: 'underline' }}>
                {label}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  type="number"
                  label="min"
                  value={values[key].min}
                  onChange={(e) => handleChange(key, 'min', e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  type="number"
                  label="max"
                  value={values[key].max}
                  onChange={(e) => handleChange(key, 'max', e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};
