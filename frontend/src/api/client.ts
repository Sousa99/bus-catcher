import type { ConfigStop, Line, Stop, StopWithLines } from './types';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    public readonly detail?: unknown,
  ) {
    super(code);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { 'content-type': 'application/json' },
    ...init,
  });
  if (!response.ok) {
    let error: { error?: string; detail?: unknown } | undefined;
    try {
      error = (await response.json()) as { error?: string; detail?: unknown };
    } catch {
      // non-JSON error body — ignore
    }
    throw new ApiError(response.status, error?.error ?? 'request_failed', error?.detail);
  }
  return (await response.json()) as T;
}

export interface AddConfigStopBody {
  stopId: string;
  lineFilter?: string[];
  displayOrder?: number;
  enabled?: boolean;
}

export const api = {
  searchStops: (q: string, limit = 20) =>
    request<{ stops: Stop[] }>(`/stops?q=${encodeURIComponent(q)}&limit=${limit}`),
  getStop: (id: string) => request<{ stop: StopWithLines }>(`/stops/${encodeURIComponent(id)}`),
  listLines: () => request<{ lines: Line[] }>('/lines'),
  getConfig: () => request<{ stops: ConfigStop[] }>('/config'),
  addConfigStop: (body: AddConfigStopBody) =>
    request<{ stop: ConfigStop }>('/config/stops', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
