
import React, { useState, useEffect } from 'react';
import { Plus, Check, Tag, Trash2, Circle, CheckCircle2, Zap } from 'lucide-react';
import { Task, Priority, SubTask } from '../types';
import MascotPlaceholder from '../components/UI/MascotPlaceholder';
import { 하루 } from '../utils/time'; // Assumindo que `haru` é um utilitário de data

const Planner: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedSection, setSelectedSection] = useState('Estudo');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('leve');
  const [isAdding, setIsAdding] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedTasks = localStorage.getItem('soraki-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    // Carregar e verificar a constância
    const stats = localStorage.getItem('soraki-stats');
    if (stats) {
      const { streak, lastCompletionDay } = JSON.parse(stats);
      if (하루.isYesterday(lastCompletionDay)) {
        setStreak(streak);
      } else if (!하루.isToday(lastCompletionDay)) {
        setStreak(0); // Quebrou a sequência
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('soraki-tasks', JSON.stringify(tasks));
    checkCompletionForStreak();
  }, [tasks]);

  const checkCompletionForStreak = () => {
    const todayStr = 하루.today();
    const completedToday = tasks.filter(t => t.date === todayStr && t.completed).length > 0;
    
    if (completedToday) {
      const stats = localStorage.getItem('soraki-stats');
      let currentStreak = 0;
      let lastCompletionDay = '';

      if (stats) {
        const parsedStats = JSON.parse(stats);
        currentStreak = parsedStats.streak || 0;
        lastCompletionDay = parsedStats.lastCompletionDay || '';
      }

      if (lastCompletionDay !== todayStr) {
        const newStreak = 하루.isYesterday(lastCompletionDay) ? currentStreak + 1 : 1;
        setStreak(newStreak);
        localStorage.setItem('soraki-stats', JSON.stringify({ streak: newStreak, lastCompletionDay: todayStr }));
      }
    }
  };

  const sections = ['Estudo', 'Faculdade', 'Vida pessoal', 'Saúde', 'Projetos'];
  const priorities: { id: Priority; label: string; icon: string; }[] = [
    { id: 'leve', label: 'Leve', icon: '🌱' },
    { id: 'medio', label: 'Médio', icon: '🌿' },
    { id: 'profundo', label: 'Profundo', icon: '🌳' },
  ];

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const date = new Date();
    const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      subject: selectedSection,
      completed: false,
      date: localDate,
      priority: selectedPriority,
      subtasks: [],
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  
  const addSubtask = (taskId: string, subtaskTitle: string) => {
    if(!subtaskTitle.trim()) return;

    const newSubtask: SubTask = {
        id: Date.now().toString(),
        title: subtaskTitle,
        completed: false
    }

    setTasks(tasks.map(t => t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSubtask] } : t));
  }

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => {
        if (task.id === taskId) {
            const updatedSubtasks = task.subtasks.map(sub => 
                sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
            );
            return { ...task, subtasks: updatedSubtasks };
        }
        return task;
    }));
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };
  
  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
        case 'leve': return 'border-green-200';
        case 'medio': return 'border-yellow-200';
        case 'profundo': return 'border-orange-200';
        default: return 'border-soraki-neutral';
    }
  }
  
  const getPriorityBgClass = (priority: Priority) => {
    switch (priority) {
        case 'leve': return 'bg-green-50';
        case 'medio': return 'bg-yellow-50';
        case 'profundo': return 'bg-orange-50';
        default: return 'bg-soraki-card';
    }
  }

  return (
    <div className="flex flex-col h-full pb-24 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-soraki-primaryDark">Planner</h2>
            <p className="text-soraki-textLight text-sm">plante as sementes do seu dia 🌱</p>
        </div>
        <div className='flex items-center gap-4'>
            {streak > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
                    <Zap size={14} />
                    <span>{streak} dia{streak > 1 ? 's' : ''} de constância</span>
                </div>
            )}
            <button 
                onClick={() => setIsAdding(!isAdding)}
                className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-soft transition-all flex items-center gap-1 ${isAdding ? 'bg-soraki-neutral text-soraki-textLight' : 'bg-soraki-primary text-white hover:bg-soraki-primaryDark'}`}
            >
                <Plus size={18} /> {isAdding ? 'Cancelar' : 'Nova'}
            </button>
        </div>
      </div>

      {isAdding && (
        <div className="mb-6 animate-fade-in">
            <div className="bg-soraki-card p-4 rounded-[24px] shadow-soft border border-soraki-primaryLight">
                <input 
                    autoFocus
                    type="text" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    placeholder="Ex: Estudar capítulo 3 de biologia..."
                    className="w-full p-3 mb-3 rounded-xl bg-soraki-bg border-none focus:ring-2 focus:ring-soraki-primary/50 text-soraki-text placeholder-soraki-textLight"
                />

                <div className='flex justify-between items-center mb-4'>
                    <div className="flex gap-2 items-center flex-wrap">
                        <span className="text-sm font-semibold text-soraki-textLight mr-2">Prioridade:</span>
                        {priorities.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPriority(p.id)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedPriority === p.id 
                                    ? 'bg-soraki-primaryDark text-white shadow-sm' 
                                    : 'bg-soraki-bg text-soraki-textLight border border-soraki-neutral'
                                }`}
                            >
                                {p.icon} {p.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4 items-center flex-wrap">
                     <span className="text-sm font-semibold text-soraki-textLight mr-2 whitespace-nowrap mt-1">Seção:</span>
                    {sections.map(sec => (
                        <button
                            key={sec}
                            onClick={() => setSelectedSection(sec)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                                selectedSection === sec 
                                ? 'bg-soraki-primaryDark text-white' 
                                : 'bg-soraki-bg text-soraki-textLight border border-soraki-neutral'
                            }`}
                        >
                            {sec}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end mt-3">
                    <button onClick={addTask} className="bg-soraki-primaryDark text-white px-6 py-2 rounded-xl text-sm font-bold">
                        Adicionar Tarefa
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {tasks.length === 0 && !isAdding ? (
             <div className="flex flex-col items-center justify-center mt-12 opacity-70">
                <MascotPlaceholder size="md" mood="happy" className="mb-4" />
                <p className="text-soraki-primaryDark font-bold mb-2">Tudo limpo por aqui!</p>
                <p className="text-sm text-soraki-textLight text-center max-w-[200px]">
                    Adicione as tarefas de hoje para liberarmos espaço na sua mente. ☁️
                </p>
            </div>
        ) : (
            tasks.map(task => (
                <div 
                    key={task.id}
                    className={`p-4 rounded-2xl group transition-all duration-300 border ${
                        task.completed 
                        ? 'bg-soraki-bg border-transparent opacity-60' 
                        : `${getPriorityBgClass(task.priority)} ${getPriorityClass(task.priority)} shadow-card`
                    }`}
                >
                    <div 
                        onClick={() => toggleTask(task.id)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                                task.completed ? 'bg-soraki-primary border-soraki-primary' : 'border-soraki-neutral'
                            }`}>
                                {task.completed && <Check size={14} className="text-white" />}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className={`text-soraki-text font-bold text-sm truncate ${task.completed ? 'line-through text-soraki-textLight' : ''}`}>
                                    {task.title}
                                </span>
                                <span className="text-[10px] text-soraki-textLight flex items-center gap-1">
                                    <Tag size={10} /> {task.subject}
                                </span>
                            </div>
                        </div>
                        
                        <div className='flex items-center'>
                             <span className='text-xs mr-4 text-soraki-textLight'>
                                {priorities.find(p => p.id === task.priority)?.icon}
                            </span>
                            <button 
                                onClick={(e) => deleteTask(task.id, e)}
                                className="text-red-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div className="pl-9 mt-3 space-y-2">
                        {task.subtasks.map(sub => (
                             <div key={sub.id} onClick={() => toggleSubtask(task.id, sub.id)} className="flex items-center gap-2 group cursor-pointer">
                                {sub.completed ? <CheckCircle2 size={14} className="text-soraki-primary" /> : <Circle size={14} className="text-soraki-neutral" />}
                                <span className={`text-xs ${sub.completed ? 'line-through text-soraki-textLight' : 'text-soraki-text'}`}>
                                    {sub.title}
                                </span>
                            </div>
                        ))}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const input = e.currentTarget.elements.namedItem('subtaskTitle') as HTMLInputElement;
                            if (!input.value.trim()) return;
                            addSubtask(task.id, input.value);
                            input.value = '';
                        }}>
                             <input
                                name="subtaskTitle"
                                type="text"
                                placeholder="Adicionar microtarefa..."
                                className="w-full text-xs bg-transparent border-t-0 border-x-0 border-b border-dashed border-soraki-neutral/30 focus:ring-0 focus:border-soraki-primary/50 placeholder-soraki-textLight py-1 pl-0"
                            />
                        </form>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Planner;
