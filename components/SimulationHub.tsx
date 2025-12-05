
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SimulationMetric } from '../types';

interface SimulationHubProps {
  data: SimulationMetric[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur border border-border p-3 rounded-lg shadow-xl font-mono text-xs text-foreground ring-1 ring-white/10">
        <p className="text-muted-foreground mb-2 font-bold tracking-wider">TIME: {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-6 mb-1">
            <span style={{ color: entry.color }} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: entry.color}}></span>
                {entry.name}
            </span>
            <span className="font-bold font-mono">{entry.value}</span>
          </div>
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
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="time" 
            tick={{fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)'}} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tick={{fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)'}} 
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
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="latency" 
            stroke="var(--chart-2)" 
            fillOpacity={1} 
            fill="url(#colorLatency)" 
            strokeWidth={2} 
            name="Latency (ms)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
