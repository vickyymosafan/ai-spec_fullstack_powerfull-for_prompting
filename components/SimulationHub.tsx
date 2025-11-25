
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SimulationMetric } from '../types';

interface SimulationHubProps {
  data: SimulationMetric[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-3 rounded shadow-xl font-mono text-xs text-popover-foreground">
        <p className="text-muted-foreground mb-1 font-bold">Time: {label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
            <span>{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const SimulationHub: React.FC<SimulationHubProps> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
          <XAxis 
            dataKey="time" 
            tick={{fontSize: 10, fill: 'var(--muted-foreground)'}} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tick={{fontSize: 10, fill: 'var(--muted-foreground)'}} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area 
            type="monotone" 
            dataKey="load" 
            stroke="var(--chart-1)" 
            fillOpacity={1} 
            fill="url(#colorLoad)" 
            strokeWidth={2} 
            name="Load" 
          />
          <Area 
            type="monotone" 
            dataKey="latency" 
            stroke="var(--chart-2)" 
            fillOpacity={1} 
            fill="url(#colorLatency)" 
            strokeWidth={2} 
            name="Latency (ms)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
