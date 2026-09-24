import { useState } from 'react';
import { useAddStop, useConfig, useStop } from '../api/queries';
import type { Stop } from '../api/types';
import { StopSearch } from './StopSearch';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function ConfigPanel() {
  const config = useConfig();
  const addStop = useAddStop();
  const [selected, setSelected] = useState<Stop | null>(null);
  const [lineFilter, setLineFilter] = useState<string[]>([]);
  const stopQuery = useStop(selected?.id ?? null);

  const servingLines = stopQuery.data?.stop.lines ?? [];

  function toggleLine(line: string) {
    setLineFilter((prev) =>
      prev.includes(line) ? prev.filter((l) => l !== line) : [...prev, line],
    );
  }

  function selectStop(stop: Stop) {
    setSelected(stop);
    setLineFilter([]);
  }

  async function save() {
    if (!selected) return;
    await addStop.mutateAsync({ stopId: selected.id, lineFilter });
    setSelected(null);
    setLineFilter([]);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add a stop</CardTitle>
        </CardHeader>
        <CardContent>
          <StopSearch onSelect={selectStop} />
          {selected && (
            <div className="mt-3 rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-medium text-slate-700">{selected.name}</p>
              {servingLines.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-slate-500">Filter by line (optional)</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {servingLines.map((line) => (
                      <Button
                        key={line.id}
                        size="sm"
                        variant={lineFilter.includes(line.shortName) ? 'default' : 'secondary'}
                        onClick={() => toggleLine(line.shortName)}
                      >
                        {line.shortName}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <Button className="mt-3" onClick={save} disabled={addStop.isPending}>
                Save stop
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Configured stops ({config.data?.stops.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {config.data?.stops.length === 0 ? (
            <p className="text-sm text-slate-500">
              No stops configured yet. Search above to add one.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {config.data?.stops.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-1.5 text-sm text-slate-700"
                >
                  <span>{item.stop.name}</span>
                  {item.lineFilter.length > 0 && (
                    <span className="text-xs text-slate-500">{item.lineFilter.join(', ')}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
