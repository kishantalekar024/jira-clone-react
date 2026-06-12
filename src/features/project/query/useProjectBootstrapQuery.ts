import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectQueryKeys } from '@/features/project/mock/queryKeys';
import { mapAngularPayloadToDomain } from '@/features/project/mappers/angularDataMapper';
import { useProjectDataStore } from '@/features/project/stores/projectDataStore';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return response.json() as Promise<T>;
}

export function useProjectBootstrapQuery() {
  const setInitialData = useProjectDataStore((state) => state.setInitialData);

  const query = useQuery({
    queryKey: projectQueryKeys.all,
    queryFn: async () => {
      const [projectPayload, authPayload] = await Promise.all([
        fetchJson<Parameters<typeof mapAngularPayloadToDomain>[0]>('/assets/data/project.json'),
        fetchJson<Parameters<typeof mapAngularPayloadToDomain>[1]>('/assets/data/auth.json'),
      ]);
      return mapAngularPayloadToDomain(projectPayload, authPayload);
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!query.data) {
      return;
    }
    setInitialData(query.data);
  }, [query.data, setInitialData]);

  return query;
}
