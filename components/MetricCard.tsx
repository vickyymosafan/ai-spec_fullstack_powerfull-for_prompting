
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend = 'neutral', icon: Icon }) => {
  return (
    <div className="group relative bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
      {/* Background Glow on Hover */}
      <div className="absolute -inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
          <div className="p-2 rounded-lg bg-background/50 border border-border/50 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
            <Icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground font-mono tracking-tight">{value}</div>
          <p className="text-xs font-medium mt-2 flex items-center gap-2">
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
              trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 
              trend === 'down' ? 'bg-destructive/10 text-destructive' : 
              'bg-muted text-muted-foreground'
            }`}>
              {change}
            </span> 
            <span className="text-muted-foreground/60">vs last check</span>
          </p>
        </div>
      </div>
    </div>
  );
};
