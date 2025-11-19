import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { TestRequest, TestRequestSample, LabTest } from "@star-lab/shared";

export interface LabRequestFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type LabStats = Record<string, number>;

export interface LabRequestSample extends TestRequestSample {
  // Add any frontend specific fields if needed
  labTests?: LabTest[];
}

export interface LabRequestDetail extends TestRequest {
  company?: string;
  date?: string | Date;
  samples?: LabRequestSample[];
}

interface LabRequestsResponse {
  testRequests: TestRequest[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface LabRequestByIdResponse {
  testRequest: TestRequest;
}

interface MutationVariables<T = unknown> {
  id: string;
  payload?: T;
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
  if (filters.page) params.page = filters.page.toString();
  if (filters.limit) params.limit = filters.limit.toString();
  return params;
}

async function fetchLabRequests(filters: LabRequestFilters = {}) {
  const params = sanitizeFilters(filters);
  const response = await apiClient.get<LabRequestsResponse>("/lab/test-requests", {
    params: Object.keys(params).length ? params : undefined,
  });
  return response.data;
}

async function fetchLabRequest(id: string) {
  const response = await apiClient.get<LabRequestByIdResponse>(`/lab/test-requests/${id}`);
  const data = response.data.testRequest;
  
  // Transform to match LabRequestDetail convenience props
  return {
    ...data,
    samples: data.testRequestSamples as LabRequestSample[],
    company: data.customer?.companyNameEn,
    date: data.requestDate
  } as LabRequestDetail;
}

async function fetchLabStats() {
  const response = await apiClient.get<LabStats>("/lab/statistics");
  return response.data;
}



async function acknowledgeSamples({ id, ...payload }: AcknowledgeSamplesVariables) {

  await apiClient.post(`/lab/acknowledge/${id}`, payload);

}



async function createLabResult(payload: unknown) {
  await apiClient.post("/lab/results", payload);
}

async function updateLabResult({ id, ...payload }: MutationVariables) {
  await apiClient.put(`/lab/results/${id}`, payload);
}

function invalidateLabQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["lab-requests"] });
  queryClient.invalidateQueries({ queryKey: ["lab-request"] });
}

export function useLabRequests(filters: LabRequestFilters = {}) {
  return useQuery<LabRequestsResponse>({
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

export function useCreateLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLabResult,
    onSuccess: () => invalidateLabQueries(queryClient),
  });
}

export function useUpdateLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLabResult,
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
