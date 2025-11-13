export interface MilkingReportRow {
    id: number;
    date: string; // date format
    farm: string;
    dmb: number;
    number_milking: number | null;
    total_cows: number | null;
    total_weight_kg: number | null;
    start_time: string | null;
    milking_duration: string | null;
    cows_per_hour: number | null;
    total_reattaches: number | null;
    percent_reattaches: number | null;
    percent_justified_reattach: number | null;
    percent_increasing_flow: number | null;
    average_low_flow: number | null;
    percent_low_flow: number | null;
    milk_two_min: number | null;
    percent_two_min_milk: number | null;
    average_duration: number | null;
    total_manual_detach: number | null;
    percent_manual_detach: number | null;
    total_manual_mode: number | null;
    percent_manual_mode: number | null;
    percent_no_milk: number | null;
    mixed_up_cows: number | null;
    milkingshift_id: number;
}

export interface MixedUpCows {
  id: number;
  milking_id: number;
  cow_id?: number | null;
  cow_number?: number | null;
  milkingshift_id: number;
  lot_number_assigned?: number | null;
  lot_number_milked?: number | null;
  farm: string;
  dmb: number;
  times: number | null;
}
