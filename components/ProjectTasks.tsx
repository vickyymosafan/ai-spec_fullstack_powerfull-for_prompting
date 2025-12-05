
import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Calendar, Trash2, CheckCircle2, Circle, Flag, Clock } from 'lucide-react';

interface ProjectTasksProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
}

export const ProjectTasks: React.FC<ProjectTasksProps> = ({ tasks, onUpdate }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      completed: false,
      dueDate: newTaskDate || undefined,
      priority: newTaskPriority,
      createdAt: Date.now(),
    };

    onUpdate([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDate('');
    setNewTaskPriority('medium');
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdate(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    onUpdate(updatedTasks);
  };

  // Sort: Incomplete first, then by date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.completed ? 1 : -1;
  });

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-emerald-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col bg-card/30 backdrop-blur-md border border-border/50 rounded-xl shadow-lg overflow-hidden animate-in fade-in duration-300">
      
      {/* Header & Add Task Form */}
      <div className="p-6 border-b border-white/5 bg-black/20">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4 font-sans flex items-center gap-2">
           <Calendar className="text-primary" /> Project Roadmap & Tasks
        </h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Add a new task..."
              className="w-full h-10 bg-background/50 border border-white/10 rounded-lg pl-4 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
            />
          </div>
          
          <div className="flex gap-2">
             <div className="relative group">
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="h-10 bg-background/50 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-muted-foreground w-[140px] appearance-none"
                />
             </div>
             
             <div className="relative">
                <select
                   value={newTaskPriority}
                   onChange={(e) => setNewTaskPriority(e.target.value as any)}
                   className="h-10 bg-background/50 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-muted-foreground appearance-none pr-8 cursor-pointer"
                >
                   <option value="low">Low</option>
                   <option value="medium">Medium</option>
                   <option value="high">High</option>
                </select>
                <Flag size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"/>
             </div>

             <button
               onClick={handleAddTask}
               disabled={!newTaskTitle.trim()}
               className="h-10 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/20"
             >
               <Plus size={16} /> <span className="hidden sm:inline">Add</span>
             </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-6 bg-black/10">
        {tasks.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 select-none">
              <Calendar size={48} className="mb-4 opacity-20" />
              <p className="font-mono text-sm tracking-widest">NO TASKS PENDING</p>
           </div>
        ) : (
          <div className="space-y-3 max-w-4xl mx-auto">
            {sortedTasks.map((task) => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
              return (
                <div 
                  key={task.id} 
                  className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    task.completed 
                      ? 'bg-black/20 border-white/5 opacity-60' 
                      : 'bg-card/50 border-white/10 hover:border-primary/20 hover:bg-card/80 shadow-sm'
                  }`}
                >
                  <button onClick={() => toggleTask(task.id)} className={`shrink-0 transition-colors ${task.completed ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                    {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                     <div className={`text-sm font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                     </div>
                     <div className="flex items-center gap-3 mt-1.5">
                        {task.dueDate && (
                           <div className={`flex items-center gap-1.5 text-[11px] font-mono ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                              <Clock size={12} />
                              <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              {isOverdue && <span className="font-bold uppercase tracking-wider ml-1 text-[9px] bg-destructive/10 px-1 rounded">Overdue</span>}
                           </div>
                        )}
                        <div className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold ${getPriorityColor(task.priority)}`}>
                           <Flag size={10} /> {task.priority}
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
