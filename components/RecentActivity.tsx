import React from 'react';
import { SecurityAlert } from '../types';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface RecentActivityProps {
  report: SecurityAlert[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ report }) => {
  return (
    <div className="space-y-4 pr-2">
      {report.length === 0 ? (
         <div className="text-center text-muted-foreground text-sm py-4">No activity recorded.</div>
      ) : (
         report.map((alert, i) => (
           <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
              <div className={`mt-0.5 p-1 rounded-full shrink-0 ${
                 alert.severity === 'critical' ? 'bg-destructive/10 text-destructive' : 
                 alert.severity === 'high' ? 'bg-orange-500/10 text-orange-500' : 
                 'bg-yellow-500/10 text-yellow-500'
              }`}>
                 {alert.severity === 'critical' ? <ShieldAlert size={14} /> : <AlertTriangle size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">{alert.component}</p>
                    <span className="text-[10px] text-muted-foreground uppercase">{alert.severity}</span>
                 </div>
                 <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{alert.issue}</p>
                 <div className="mt-2 text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
                    FIX: {alert.fix}
                 </div>
              </div>
           </div>
         ))
      )}
    </div>
  );
};