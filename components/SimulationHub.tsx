import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { SimulationMetric } from '../types';

interface SimulationHubProps {
  data: SimulationMetric[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-cyan-500/50 p-3 rounded shadow-xl font-mono text-xs">
        <p className="text-cyan-400 mb-1 font-bold">W: {label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const SimulationHub: React.FC<SimulationHubProps> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex items-center justify-between text-cyan-400 mb-2">
        <h3 className="text-sm font-bold tracking-widest uppercase">Mesin Simulasi Pra-Kode // Stress Test</h3>
        <span className="text-xs bg-cyan-900/30 px-2 py-1 rounded text-cyan-200 animate-pulse">PREDIKSI LANGSUNG</span>
      </div>

      <div className="h-48 w-full bg-slate-900/50 border border-slate-800 rounded relative overflow-hidden">
         <div className="absolute top-2 left-2 text-[10px] text-slate-500 z-10">PENGGUNA KONKUREN vs LATENSI (ms)</div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="load" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2} name="Beban" />
            <Area type="monotone" dataKey="latency" stroke="#f43f5e" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={2} name="Latensi" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-32 w-full bg-slate-900/50 border border-slate-800 rounded relative">
        <div className="absolute top-2 left-2 text-[10px] text-slate-500 z-10">PROBABILITAS TINGKAT ERROR (%)</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
             <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
             <Tooltip content={<CustomTooltip />} />
             <Line type="step" dataKey="errors" stroke="#eab308" strokeWidth={2} dot={false} name="Err%" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};