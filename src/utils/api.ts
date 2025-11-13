import axios from 'axios';
import type { MilkingReportRow } from '../types/forms';
import type { MilkingReportParams } from '../types/props';

import type { MixedUpCows } from '../types/forms';
import type { MixedUpCowsParams } from '../types/props';

export const getMilkingReport = async (params: MilkingReportParams = {}): Promise<MilkingReportRow[]> => {
    try {
        const response = await axios.get<MilkingReportRow[]>('/api/v1/milking/report/', { 
            params: params 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching milking report:', error);
        return [];
    }
};

export const getMixedUpCows = async (params: MixedUpCowsParams = {}): Promise<MixedUpCows[]> => {
    try {
        const { farm, dmb, milkingshift_ids } = params;

        // если ID немного — используем GET
        if (milkingshift_ids && milkingshift_ids.length > 0 && milkingshift_ids.length <= 300) {
            const response = await axios.get<MixedUpCows[]>('/api/v1/milking/mixed_up_cows/', {
                params: {
                    farm,
                    dmb,
                    shift_ids: milkingshift_ids.join(',')
                }
            });
            return response.data;
        }

        // если ID много — используем POST
        const response = await axios.post<MixedUpCows[]>('/api/v1/milking/mixed_up_cows/', {
            farm,
            dmb,
            milkingshift_ids
        });
        return response.data;

    } catch (error) {
        console.error('Error fetching mixed up cows:', error);
        return [];
    }
};