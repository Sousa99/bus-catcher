import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Passing } from '../api/types';
import { StopTimesList } from './StopTimesList';

const scheduledTimes: Passing[] = [
  {
    lineId: 'L1',
    lineShortName: '736',
    headsign: 'Cais',
    scheduledAt: '2026-06-15T08:00:00.000Z',
    minutesUntil: 10,
  },
  {
    lineId: 'L2',
    lineShortName: '3705',
    headsign: 'Almada',
    scheduledAt: '2026-06-15T08:15:00.000Z',
    minutesUntil: 25,
  },
];

const liveTimes: Passing[] = [
  {
    tripId: 'T2',
    lineId: 'L1',
    lineShortName: '736',
    headsign: 'Cais',
    scheduledAt: '2026-06-15T08:00:00.000Z',
    minutesUntil: 10,
    source: 'live',
    predictedAt: '2026-06-15T08:04:00.000Z',
    delayMinutes: 4,
  },
];

const meta = {
  component: StopTimesList,
  tags: ['autodocs'],
  args: {
    times: [],
  },
} satisfies Meta<typeof StopTimesList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Mixed: Story = {
  args: {
    times: [...liveTimes, ...scheduledTimes],
  },
};

export const ScheduleOnly: Story = {
  args: {
    times: scheduledTimes,
  },
};

export const Empty: Story = {
  args: {
    times: [],
  },
};