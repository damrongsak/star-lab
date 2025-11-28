import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Chart data hooks
export const useRequestVolumeData = () => {
    return useQuery<{ data: Array<{ date: string; count: number }> }>({
        queryKey: ["request-volume-chart"],
        queryFn: async () => {
            const response = await apiClient.get("/reports/chart/request-volume");
            return response.data;
        },
    });
};

export const useRevenueData = () => {
    return useQuery<{ data: Array<{ date: string; revenue: number }> }>({
        queryKey: ["revenue-chart"],
        queryFn: async () => {
            const response = await apiClient.get("/reports/chart/revenue");
            return response.data;
        },
    });
};

// Report generation hooks
export const useGenerateReport = (reportType: string) => {
    return useMutation({
        mutationFn: async () => {
            const response = await apiClient.get(`/reports/generate/${reportType}`);
            return response.data;
        },
    });
};

export const useExportReport = (reportType: string) => {
    return useMutation({
        mutationFn: async () => {
            const response = await apiClient.get(`/reports/generate/${reportType}`);

            // Create a downloadable JSON file
            const dataStr = JSON.stringify(response.data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`;

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();

            return response.data;
        },
    });
};
