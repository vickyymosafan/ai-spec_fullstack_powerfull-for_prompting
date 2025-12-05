
import React from 'react';

export const VickyLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5"/>
    <path d="M7.5 9L12 17L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
    <circle cx="12" cy="17" r="2" className="fill-current" />
    <circle cx="7.5" cy="9" r="1.5" className="fill-current" />
    <circle cx="16.5" cy="9" r="1.5" className="fill-current" />
    <circle cx="12" cy="12" r="1" className="fill-current" fillOpacity="0.5" />
  </svg>
);
