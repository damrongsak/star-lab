import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import { toast } from "sonner";

export interface SystemSettings {
  [key: string]: string;
}

async function fetchSettings(): Promise<SystemSettings> {
  const response = await apiClient.get<{ success: boolean; data: SystemSettings }>("/admin/settings");
  return response.data.data;
}

async function updateSettings(settings: SystemSettings): Promise<void> {
  await apiClient.put("/admin/settings", settings);
}

export function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateSettings: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
