
import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Send, Terminal, User, Code, Trash2, 
  Maximize2, Minimize2, Cpu, ChevronDown, 
  ChevronRight, Activity, Copy, Check 
} from 'lucide-react';
import { ChatMessage } from '../types';
import { VickyLogo } from './Icons';

interface ConsoleInterfaceProps {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (text: string) => void;
  onClear: () => void;
}

export const ConsoleInterface: React.FC<ConsoleInterfaceProps> = ({ 
  messages, 
  loading, 
  onSendMessage,
  onClear 
}) => {
  const [input, setInput] = useState('');
  const [isMinimal, setIsMinimal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading, isMinimal]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading) {
        onSendMessage(input);
        setInput('');
      }
    }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto animate-in fade-in duration-500 relative bg-black/40 rounded-t-2xl border-x border-t border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
      
      {/* Terminal Header */}
      <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between select-none">
         <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50 hover:bg-red-500 transition-colors"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50 hover:bg-yellow-500 transition-colors"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500 transition-colors"></div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground ml-2">
               <Terminal size={12} className="text-primary"/>
               <span className="opacity-70">root@vicky-ai:~/console</span>
            </div>
         </div>
         
         <div className="flex items-center gap-2">
            <button 
              onClick={onClear}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all" 
              title="Clear History"
            >
               <Trash2 size={14} />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1"></div>
            <button 
              onClick={() => setIsMinimal(!isMinimal)}
              className={`p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all ${isMinimal ? 'text-primary bg-primary/10' : ''}`}
              title={isMinimal ? "Expand View" : "Minimize History"}
            >
               {isMinimal ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
         </div>
      </div>

      {/* Messages Area */}
      <div 
        className={`flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar transition-all duration-300 ${isMinimal ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'}`} 
        ref={scrollRef}
      >
         {messages.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 select-none">
              <VickyLogo size={64} className="mb-4 opacity-20" />
              <p className="font-mono text-xs tracking-widest">SYSTEM ONLINE. AWAITING INPUT.</p>
           </div>
         )}

         {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 group ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
                {/* Avatar */}
                <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg border 
                    ${msg.role === 'vicky' 
                      ? 'bg-black/60 border-primary/30 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]' 
                      : 'bg-white/5 border-white/10 text-foreground'}
                `}>
                  {msg.role === 'vicky' ? <VickyLogo size={16} /> : <User size={16} />}
               </div>

               {/* Bubble */}
               <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`
                     relative px-5 py-4 rounded-2xl text-sm border shadow-md backdrop-blur-md overflow-hidden
                     ${msg.role === 'user' 
                       ? 'bg-primary/10 border-primary/20 text-foreground rounded-tr-sm' 
                       : 'bg-card/40 border-white/10 text-foreground rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]'}
                  `}>
                     {msg.role === 'vicky' && (
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5 w-full">
                           <span className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
                              <Activity size={10} /> VICKY AI
                           </span>
                           <span className="text-[9px] font-mono text-muted-foreground ml-auto opacity-50">
                             {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                           </span>
                        </div>
                     )}
                     
                     <div className="markdown-content font-mono text-[13px] leading-relaxed">
                       {msg.role === 'user' ? (
                         <div className="whitespace-pre-wrap">{msg.content}</div>
                       ) : (
                         <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({node, className, children, ...props}: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                const isInline = !match && !String(children).includes('\n');
                                const id = Math.random().toString(36).substr(2, 9);
                                
                                if (isInline) {
                                  return (
                                    <code className="bg-primary/10 px-1.5 py-0.5 rounded text-xs font-mono text-primary border border-primary/20" {...props}>
                                      {children}
                                    </code>
                                  );
                                }

                                return (
                                  <div className="relative my-4 rounded-lg overflow-hidden border border-white/10 bg-black/50 group/code">
                                    <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
                                       <div className="flex items-center gap-2">
                                          <Code size={12} className="text-muted-foreground"/>
                                          <span className="text-[10px] font-mono text-muted-foreground uppercase">{match?.[1] || 'text'}</span>
                                       </div>
                                       <button 
                                          onClick={() => handleCopy(String(children), id)}
                                          className="text-muted-foreground hover:text-foreground transition-colors"
                                       >
                                          {copiedBlock === id ? <Check size={12} className="text-emerald-500"/> : <Copy size={12}/>}
                                       </button>
                                    </div>
                                    <pre className="p-3 overflow-x-auto text-xs custom-scrollbar">
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </pre>
                                  </div>
                                );
                              },
                              ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            }}
                         >
                            {msg.content}
                         </ReactMarkdown>
                       )}
                     </div>
                  </div>
               </div>
            </div>
         ))}
         
         {loading && (
            <div className="flex items-center gap-3 text-primary text-xs font-mono ml-14 p-3 bg-primary/5 border border-primary/10 rounded-lg w-fit animate-pulse">
               <Cpu size={14} className="animate-spin-slow" />
               <span className="tracking-wider">PROCESSING NEURAL ARCHITECTURE...</span>
            </div>
         )}
         
         {/* Spacing for bottom input */}
         <div className="h-24"></div>
      </div>
      
      {/* Floating Input Area */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
         <div className="relative group">
            {/* Input Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500 group-focus-within:opacity-70"></div>
            
            <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col shadow-2xl transition-all duration-300 group-focus-within:border-primary/50 group-focus-within:bg-black/90">
                <div className="flex items-start">
                   <div className="pt-4 pl-4 text-primary animate-pulse">
                      <ChevronRight size={18} />
                   </div>
                   <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Describe architectural requirements..."
                      className="w-full bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none min-h-[50px] max-h-[200px] resize-none font-mono"
                      rows={1}
                   />
                   <button 
                      onClick={() => { if(input.trim() && !loading) { onSendMessage(input); setInput(''); } }}
                      disabled={loading || !input.trim()}
                      className="m-2 p-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-lg transition-all disabled:opacity-0 disabled:scale-75"
                   >
                      <Send size={16} />
                   </button>
                </div>
                
                {/* Input Footer */}
                <div className="flex items-center justify-between px-4 pb-2 pt-1">
                    <div className="flex gap-4 text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider">
                       <span className="flex items-center gap-1"><Terminal size={10}/> CMD</span>
                       <span className="hidden sm:inline">SHIFT+ENTER for new line</span>
                    </div>
                    {input.length > 0 && (
                       <span className="text-[9px] text-muted-foreground/60 font-mono">{input.length} chars</span>
                    )}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
