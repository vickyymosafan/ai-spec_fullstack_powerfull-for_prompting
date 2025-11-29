import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NexusBlueprint, NodeType, NodeData } from '../types';
import { Server, Database, Activity, Cloud, Globe, Layers, Cpu } from 'lucide-react';

interface NodeCanvasProps {
  blueprint: NexusBlueprint | null;
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
      .force("link", d3.forceLink(d3Links).id((d: any) => d.id).distance(180))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(80));

    simulation.on("tick", () => {
      setNodes([...d3Nodes]);
      setLinks([...d3Links]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueprint?.timestamp, techFilter]); // Re-run only if blueprint changes (new generation) or filter changes

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
    <div className="w-full h-full flex flex-col items-center justify-center text-primary font-mono select-none">
       <div className="relative w-24 h-24 mb-4">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
          <div className="absolute inset-2 border-4 border-primary/50 rounded-full animate-spin"></div>
          <Activity className="absolute inset-0 m-auto text-primary animate-pulse" size={32} />
       </div>
       <span className="tracking-[0.3em] text-xs animate-pulse">MENUNGGU NEURAL LINK...</span>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-background select-none cursor-crosshair">
      <div className="absolute inset-0 grid-bg pointer-events-none"></div>

      <svg className="w-full h-full absolute inset-0 pointer-events-none z-0">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--primary)" fillOpacity="0.5" />
          </marker>
        </defs>
        <g>
          {links.map((link, i) => (
            <React.Fragment key={i}>
              <line
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                stroke="var(--border)"
                strokeWidth="2"
              />
              <line
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                markerEnd="url(#arrowhead)"
                strokeDasharray="4,4"
              />
               <circle r="2" fill="var(--chart-2)">
                <animateMotion 
                  dur={`${Math.max(0.5, 3 - (link.latency / 200))}s`} 
                  repeatCount="indefinite"
                  path={`M${link.source.x},${link.source.y} L${link.target.x},${link.target.y}`}
                />
              </circle>
            </React.Fragment>
          ))}
        </g>
      </svg>

      {nodes.map((node) => {
        const Icon = getIcon(node.type);
        const statusColors = {
          critical: 'border-destructive/80 shadow-[0_0_20px_rgba(239,68,68,0.4)] bg-destructive/20',
          warning: 'border-yellow-500/80 shadow-[0_0_20px_rgba(234,179,8,0.4)] bg-yellow-500/20',
          optimal: 'border-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] bg-card/90'
        };

        return (
          <div
            key={node.id}
            onMouseDown={(e) => handleMouseDown(e, node)}
            onClick={(e) => {
              if(!isDragging) onNodeSelect(node);
            }}
            className={`absolute flex flex-col items-center justify-center p-3 rounded-xl border backdrop-blur-md transition-all duration-200 cursor-pointer hover:scale-105 z-10 hover:border-foreground/50 group ${statusColors[node.status]}`}
            style={{ 
              left: node.x, 
              top: node.y, 
              transform: 'translate(-50%, -50%)',
              width: '150px'
            }}
          >
            {/* Connection Node Decorators */}
            <div className="absolute -left-1 top-1/2 w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
            <div className="absolute -right-1 top-1/2 w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>

            <div className={`p-2.5 rounded-full mb-2 bg-background/40 border border-foreground/10 group-hover:border-foreground/30 transition-colors`}>
              <Icon size={20} className={node.status === 'critical' ? 'text-destructive' : 'text-primary'} />
            </div>
            
            <div className="text-[11px] font-bold text-foreground text-center leading-tight tracking-wide font-mono mb-1">{node.label}</div>
            <div className="text-[9px] text-muted-foreground font-mono px-2 py-0.5 bg-background/30 rounded border border-foreground/5">{node.tech}</div>
            
            {node.status !== 'optimal' && (
               <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-destructive rounded-full border-2 border-background animate-bounce shadow-lg">
                 <span className="text-[10px] font-bold text-destructive-foreground">!</span>
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};