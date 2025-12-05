
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { VickyBlueprint, NodeType, NodeData } from '../types';
import { Server, Database, Activity, Cloud, Globe, Layers, Cpu, Box } from 'lucide-react';

interface NodeCanvasProps {
  blueprint: VickyBlueprint | null;
  onNodeSelect: (node: NodeData) => void;
  techFilter: string | null;
}

const getIcon = (type: NodeType) => {
  switch (type) {
    case NodeType.DATABASE: return Database;
    case NodeType.SERVICE: return Server;
    case NodeType.GATEWAY: return Cloud;
    case NodeType.CLIENT: return Globe;
    case NodeType.CACHE: return Cpu;
    case NodeType.QUEUE: return Box;
    default: return Layers;
  }
};

export const NodeCanvas: React.FC<NodeCanvasProps> = ({ blueprint, onNodeSelect, techFilter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize Data
  useEffect(() => {
    if (!blueprint || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Filter Logic
    let filteredNodes = [...blueprint.nodes];
    if (techFilter) {
      filteredNodes = blueprint.nodes.filter(n => n.tech === techFilter);
    }
    
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = blueprint.edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));

    // Preserve positions if re-rendering same nodes (keeps layout stable during updates)
    const d3Nodes = filteredNodes.map(n => {
      const existing = nodes.find(en => en.id === n.id);
      return { 
        ...n, 
        x: existing?.x ?? width / 2 + (Math.random() - 0.5) * 100, 
        y: existing?.y ?? height / 2 + (Math.random() - 0.5) * 100 
      };
    });

    const d3Links = filteredEdges.map(e => ({ ...e }));

    // D3 Simulation Setup
    const simulation = d3.forceSimulation(d3Nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(d3Links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(70));

    simulation.on("tick", () => {
      setNodes([...d3Nodes]);
      setLinks([...d3Links]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueprint?.timestamp, techFilter]);

  // Drag Handling Logic
  const handleMouseDown = (e: React.MouseEvent, node: any) => {
    e.stopPropagation();
    if (!simulationRef.current || !containerRef.current) return;
    
    setIsDragging(true);
    simulationRef.current.alphaTarget(0.3).restart();
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Lock the node being dragged
    node.fx = node.x;
    node.fy = node.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
        const x = moveEvent.clientX - containerRect.left;
        const y = moveEvent.clientY - containerRect.top;
        node.fx = x;
        node.fy = y;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (simulationRef.current) simulationRef.current.alphaTarget(0);
        node.fx = null;
        node.fy = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!blueprint) return (
    <div className="w-full h-full flex flex-col items-center justify-center text-primary font-mono select-none bg-background/50">
       <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-4 border-2 border-primary/40 rounded-full animate-[spin_5s_linear_infinite_reverse]"></div>
          <div className="absolute inset-8 border-2 border-primary/60 rounded-full animate-[spin_2s_linear_infinite]"></div>
          <Activity className="absolute inset-0 m-auto text-primary animate-pulse" size={40} />
       </div>
       <span className="tracking-[0.5em] text-xs font-bold animate-pulse text-muted-foreground">AWAITING NEURAL SYNC</span>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-background/50 select-none cursor-crosshair">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/10 to-background/80 pointer-events-none"></div>

      <svg className="w-full h-full absolute inset-0 pointer-events-none z-0">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--primary)" fillOpacity="0.8" />
          </marker>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <g>
          {links.map((link, i) => (
            <React.Fragment key={i}>
              {/* Data packet animation */}
              <circle r="3" fill="var(--primary)">
                <animateMotion 
                  dur={`${Math.max(0.8, 2 - (link.latency / 300))}s`} 
                  repeatCount="indefinite"
                  path={`M${link.source.x},${link.source.y} L${link.target.x},${link.target.y}`}
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="linear"
                />
              </circle>
              {/* Base Line */}
              <line
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                stroke="var(--border)"
                strokeWidth="1"
                opacity="0.3"
              />
              {/* Protocol overlay */}
              <text 
                 x={(link.source.x + link.target.x) / 2} 
                 y={(link.source.y + link.target.y) / 2}
                 textAnchor="middle" 
                 fill="var(--muted-foreground)"
                 fontSize="9"
                 dy="-5"
                 opacity="0.7"
                 className="font-mono bg-background"
              >
                  {link.protocol}
              </text>
            </React.Fragment>
          ))}
        </g>
      </svg>

      {nodes.map((node) => {
        const Icon = getIcon(node.type);
        const statusColors = {
          critical: 'border-destructive shadow-[0_0_20px_rgba(239,68,68,0.5)] bg-destructive/10 text-destructive',
          warning: 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] bg-yellow-500/10 text-yellow-500',
          optimal: 'border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.3)] bg-background/80 text-primary'
        };

        return (
          <div
            key={node.id}
            onMouseDown={(e) => handleMouseDown(e, node)}
            onClick={(e) => {
              if(!isDragging) onNodeSelect(node);
            }}
            className={`
                absolute flex flex-col items-center justify-center p-3 
                backdrop-blur-md transition-all duration-300 z-10 
                border hover:scale-110 group hover:z-20
                ${statusColors[node.status]}
                before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none
            `}
            style={{ 
              left: node.x, 
              top: node.y, 
              transform: 'translate(-50%, -50%)',
              width: '140px',
              borderRadius: '12px',
            }}
          >
            {/* Tech Badge */}
            <div className="absolute -top-3 bg-background border border-border px-2 py-0.5 rounded text-[9px] font-mono text-muted-foreground uppercase tracking-wider shadow-sm">
                {node.tech}
            </div>

            <div className={`p-2 rounded-lg mb-2 bg-background/50 border border-white/5 shadow-inner`}>
              <Icon size={24} className="opacity-90" />
            </div>
            
            <div className="text-[11px] font-bold text-foreground text-center leading-tight tracking-wide font-mono w-full truncate px-1">
                {node.label}
            </div>
            
            {/* Status Indicator Dot */}
            <div className={`absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full ${node.status === 'optimal' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`}></div>
          </div>
        );
      })}
    </div>
  );
};
