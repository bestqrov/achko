import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export function useResource<T>(resource: string, params?: Record<string, any>) {
  return useQuery<{ data: T[]; total: number; page: number; pages: number }>({
    queryKey: [resource, params],
    queryFn: async () => {
      const { data } = await api.get(`/${resource}`, { params });
      return data;
    },
  });
}

export function useResourceOne<T>(resource: string, id: string) {
  return useQuery<{ data: T }>({
    queryKey: [resource, id],
    queryFn: async () => {
      const { data } = await api.get(`/${resource}/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateResource(resource: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => api.post(`/${resource}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [resource] }),
  });
}

export function useUpdateResource(resource: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => api.put(`/${resource}/${id}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [resource] }),
  });
}

export function useDeleteResource(resource: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/${resource}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [resource] }),
  });
}
