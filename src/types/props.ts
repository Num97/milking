export interface MilkingReportParams {
    farm?: string;
    dmb?: number;
    date_start?: string;
    date_end?: string;
}

export interface MixedUpCowsParams {
    farm?: string;
    dmb?: number;
    milkingshift_ids?: number[];
}