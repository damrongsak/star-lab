import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Project } from "@star-lab/shared";
import { toast } from "sonner";

export interface CreateProjectData {
    projectCode: string;
    name: string;
    description?: string;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    isActive?: boolean;
}

export function useProjects(includeInactive = false) {
    return useQuery({
        queryKey: ["projects", includeInactive],
        queryFn: async () => {
            const { data } = await apiClient.get<Project[]>(`/projects?includeInactive=${includeInactive}`);
            return data;
        },
    });
}

export function useProject(id: string) {
    return useQuery({
        queryKey: ["projects", id],
        queryFn: async () => {
            const { data } = await apiClient.get<Project>(`/projects/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateProjectData) => {
            const response = await apiClient.post<Project>("/projects", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success("Project created successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create project");
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateProjectData }) => {
            const response = await apiClient.put<Project>(`/projects/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["projects", data.id] });
            toast.success("Project updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update project");
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await apiClient.delete<Project>(`/projects/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success("Project deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete project");
        },
    });
}
