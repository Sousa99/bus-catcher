import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { api } from '../api/client';
import type { ConfigStop, Passing } from '../api/types';
import DashboardPage from '../pages/Dashboard';

vi.mock('../api/client', () => ({
  api: {
    searchStops: vi.fn(),
    getStop: vi.fn(),
    listLines: vi.fn(),
    getConfig: vi.fn(),
    addConfigStop: vi.fn(),
    getStopTimes: vi.fn(),
    getStatus: vi.fn(),
  },
}));

const mockedGetConfig = vi.mocked(api.getConfig);
const mockedGetStopTimes = vi.mocked(api.getStopTimes);
const mockedGetStatus = vi.mocked(api.getStatus);

function renderWithQuery(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  mockedGetConfig.mockReset();
  mockedGetStopTimes.mockReset();
  mockedGetStatus.mockReset();
});

describe('DashboardPage', () => {
  it('shows the empty state and a stale warning', async () => {
    mockedGetConfig.mockResolvedValue({ stops: [] });
    mockedGetStatus.mockResolvedValue({
      lastRefresh: null,
      feedVersion: null,
      stale: true,
    });

    renderWithQuery(<DashboardPage />);

    expect(
      await screen.findByText('No stops configured yet. Go to the Config tab to add one.'),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Schedule data may be out of date/)).toBeInTheDocument();
  });

  it('renders configured stops with their next buses', async () => {
    const stop: ConfigStop = {
      id: 1,
      stop: { id: 'S1', name: 'Av. Teste', lat: 0, lon: 0 },
      lineFilter: ['736'],
      displayOrder: 0,
      enabled: true,
    };
    const times: Passing[] = [
      {
        lineId: 'L1',
        lineShortName: '736',
        headsign: 'Cais',
        scheduledAt: '2026-06-15T08:00:00.000Z',
        minutesUntil: 10,
      },
    ];
    mockedGetConfig.mockResolvedValue({ stops: [stop] });
    mockedGetStopTimes.mockResolvedValue({ stopId: 'S1', times });
    mockedGetStatus.mockResolvedValue({
      lastRefresh: '2026-09-25T08:00:00.000Z',
      feedVersion: 'abc',
      stale: false,
    });

    renderWithQuery(<DashboardPage />);

    expect(await screen.findByText('Av. Teste')).toBeInTheDocument();
    expect(screen.getByText('736')).toBeInTheDocument();
    expect(await screen.findByText('Cais')).toBeInTheDocument();
    expect(screen.getByText(/Schedule updated/)).toBeInTheDocument();
    await waitFor(() => {
      expect(mockedGetStopTimes).toHaveBeenCalled();
    });
  });
});
