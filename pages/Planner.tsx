
import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import { Plus, Check, Tag, Trash2 } from 'lucide-react';
import { Task } from '../types';
import MascotPlaceholder from '../components/UI/MascotPlaceholder';

const Planner: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Geral');
  const [isAdding, setIsAdding] = useState(false);

  // Load Tasks on Mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('soraki-tasks');
    if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save Tasks on Change
  useEffect(() => {
    localStorage.setItem('soraki-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const subjects = ['Geral', 'Matemática', 'Português', 'História', 'Inglês', 'Biologia'];

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    // Create Local Date String YYYY-MM-DD
    const date = new Date();
    const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      subject: selectedSubject,
      completed: false,
      date: localDate,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col h-full pb-24 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-soraki-primaryDark">Planner</h2>
            <p className="text-soraki-textLight text-sm">organize seu dia ✨</p>
        </div>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-soft transition-all flex items-center gap-1 ${isAdding ? 'bg-soraki-neutral text-soraki-textLight' : 'bg-soraki-primary text-white hover:bg-soraki-primaryDark'}`}
        >
            <Plus size={18} /> {isAdding ? 'Cancelar' : 'Nova'}
        </button>
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
                    placeholder="O que vamos estudar?"
                    className="w-full p-3 mb-3 rounded-xl bg-soraki-bg border-none focus:ring-2 focus:ring-soraki-primary/50 text-soraki-text placeholder-soraki-textLight"
                />
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {subjects.map(sub => (
                        <button
                            key={sub}
                            onClick={() => setSelectedSubject(sub)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                                selectedSubject === sub 
                                ? 'bg-soraki-primaryDark text-white' 
                                : 'bg-soraki-bg text-soraki-textLight border border-soraki-neutral'
                            }`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end mt-3">
                    <button onClick={addTask} className="bg-soraki-primaryDark text-white px-6 py-2 rounded-xl text-sm font-bold">
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="flex-1 space-y-3">
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
                    onClick={() => toggleTask(task.id)}
                    className={`p-4 rounded-2xl flex items-center justify-between group cursor-pointer transition-all duration-300 border ${
                        task.completed 
                        ? 'bg-soraki-bg border-transparent opacity-60' 
                        : 'bg-soraki-card border-soraki-card shadow-card hover:border-soraki-primaryLight'
                    }`}
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
                    
                    <button 
                        onClick={(e) => deleteTask(task.id, e)}
                        className="text-red-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Planner;