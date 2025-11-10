import axios from 'axios';
import type { MilkingReportRow } from '../types/forms';
import type { MilkingReportParams } from '../types/props';

// The proxy in vite.config.ts will forward requests to http://10.90.25.125:5000
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