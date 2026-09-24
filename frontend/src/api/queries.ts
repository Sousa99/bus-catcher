import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

export function useSearchStops(q: string) {
  return useQuery({
    queryKey: ['stops', q],
    queryFn: () => api.searchStops(q),
    enabled: q.length >= 2,
    staleTime: 60_000,
  });
}

export function useStop(id: string | null) {
  return useQuery({
    queryKey: ['stop', id],
    queryFn: () => api.getStop(id as string),
    enabled: id !== null,
  });
}

export function useLines() {
  return useQuery({
    queryKey: ['lines'],
    queryFn: api.listLines,
  });
}

export function useConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: api.getConfig,
  });
}

export function useAddStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addConfigStop,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });
}

export function useStopTimes(stopId: string, limit = 5, lines?: string[]) {
  return useQuery({
    queryKey: ['stop-times', stopId, limit, lines?.join(',') ?? ''],
    queryFn: () => api.getStopTimes(stopId, limit, lines),
    refetchInterval: 60_000,
  });
}

export function useStatus() {
  return useQuery({
    queryKey: ['status'],
    queryFn: api.getStatus,
    refetchInterval: 60_000,
  });
}
