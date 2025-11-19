import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { TestRequest } from "@star-lab/shared";

export interface LabRequestFilters {
  status?: string;
  search?: string;
}

export type LabStats = Record<string, number>;

export interface LabRequestSample {
  id: string;
  type: string;
  description: string;
  quantity: number;
}

export interface LabRequestDetail extends TestRequest {
  company?: string;
  date?: string | Date;
  samples?: LabRequestSample[];
}

interface MutationVariables<T = unknown> {
  id: string;
  payload?: T;
}

interface SubmitResultsVariables<T = unknown> extends MutationVariables<T> {
  payload: T;
}

interface AcknowledgeSamplesVariables {
  id: string;
  notes?: string;
  allSamplesReceived?: boolean;
}

function sanitizeFilters(filters: LabRequestFilters = {}) {
  const params: Record<string, string> = {};
  if (filters.status) params.status = filters.status;
  if (filters.search?.trim()) params.search = filters.search.trim();
  return params;
}

async function fetchLabRequests(filters: LabRequestFilters = {}) {
  const params = sanitizeFilters(filters);
  const response = await apiClient.get<TestRequest[]>("/lab/test-requests", {
    params: Object.keys(params).length ? params : undefined,
  });
  return response.data;
}

async function fetchLabRequest(id: string) {
  const response = await apiClient.get<LabRequestDetail>(`/lab/test-requests/${id}`);
  return response.data;
}

async function fetchLabStats() {
  const response = await apiClient.get<LabStats>("/lab/statistics");
  return response.data;
}

async function acknowledgeSamples({ id, ...payload }: AcknowledgeSamplesVariables) {
  await apiClient.post(`/lab/acknowledge/${id}`, payload);
}

async function submitResults<T = unknown>({ id, payload }: SubmitResultsVariables<T>) {
  await apiClient.post(`/lab/results/${id}`, payload);
}

function invalidateLabQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["lab-requests"] });
  queryClient.invalidateQueries({ queryKey: ["lab-request"] });
}

export function useLabRequests(filters: LabRequestFilters = {}) {
  return useQuery<TestRequest[]>({
    queryKey: ["lab-requests", filters],
    queryFn: () => fetchLabRequests(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useLabRequest(id: string) {
  return useQuery<LabRequestDetail>({
    queryKey: ["lab-request", id],
    queryFn: () => fetchLabRequest(id),
    enabled: Boolean(id),
  });
}

export function useAcknowledgeSamples() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, AcknowledgeSamplesVariables>({
    mutationFn: acknowledgeSamples,
    onSuccess: () => invalidateLabQueries(queryClient),
  });
}

export function useSubmitResults<T = unknown>() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, SubmitResultsVariables<T>>({
    mutationFn: submitResults,
    onSuccess: () => invalidateLabQueries(queryClient),
  });
}

export function useLabStats() {
  return useQuery<LabStats>({
    queryKey: ["lab-stats"],
    queryFn: fetchLabStats,
    staleTime: 60 * 1000,
  });
}
