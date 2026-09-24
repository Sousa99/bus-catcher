import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { api } from '../api/client';
import type { ConfigStop, Stop } from '../api/types';
import { ConfigPanel } from './ConfigPanel';

vi.mock('../api/client', () => ({
  api: {
    searchStops: vi.fn(),
    getStop: vi.fn(),
    listLines: vi.fn(),
    getConfig: vi.fn(),
    addConfigStop: vi.fn(),
  },
}));

const mockedSearch = vi.mocked(api.searchStops);
const mockedGetStop = vi.mocked(api.getStop);
const mockedGetConfig = vi.mocked(api.getConfig);
const mockedAdd = vi.mocked(api.addConfigStop);

function renderWithQuery(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  mockedSearch.mockReset();
  mockedGetStop.mockReset();
  mockedGetConfig.mockReset();
  mockedAdd.mockReset();
});

describe('ConfigPanel', () => {
  it('shows an empty state when nothing is configured', async () => {
    mockedGetConfig.mockResolvedValue({ stops: [] });
    renderWithQuery(<ConfigPanel />);
    expect(
      await screen.findByText('No stops configured yet. Search above to add one.'),
    ).toBeInTheDocument();
  });

  it('adds a stop with a line filter', async () => {
    const stop: Stop = { id: 'S1', name: 'Av. Teste', lat: 0, lon: 0 };
    mockedSearch.mockResolvedValue({ stops: [stop] });
    mockedGetStop.mockResolvedValue({
      stop: {
        ...stop,
        lines: [{ id: 'L1', shortName: '736', longName: 'Cais do Sodré' }],
      },
    });
    mockedGetConfig.mockResolvedValue({ stops: [] });
    const created: ConfigStop = {
      id: 1,
      stop,
      lineFilter: ['736'],
      displayOrder: 0,
      enabled: true,
    };
    mockedAdd.mockResolvedValue({ stop: created });

    renderWithQuery(<ConfigPanel />);

    await userEvent.type(screen.getByLabelText('Search stops'), 'teste');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Av. Teste' })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Av. Teste' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '736' })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: '736' }));

    await userEvent.click(screen.getByRole('button', { name: 'Save stop' }));

    await waitFor(() => {
      expect(mockedAdd.mock.calls[0]?.[0]).toEqual({
        stopId: 'S1',
        lineFilter: ['736'],
      });
    });
  });
});
