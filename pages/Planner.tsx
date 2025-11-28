
import React, { useState } from 'react';
import { Plus, Check, Tag, Trash2, Circle, CheckCircle2, Zap } from 'lucide-react';
import { Priority } from '../types';
import MascotPlaceholder from '../components/UI/MascotPlaceholder';
import { useData } from '../contexts/dataContext';
import { useTranslation } from 'react-i18next';

const Planner: React.FC = () => {
  const { t } = useTranslation();
  const { tasks, streak, addTask, toggleTask, deleteTask, addSubtask, toggleSubtask } = useData();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedSection, setSelectedSection] = useState('Estudo');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('leve');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle, selectedSection, selectedPriority);
    setNewTaskTitle('');
    setIsAdding(false);
  };
  
  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      deleteTask(id);
  }

  const sections = [t('planner.sections.study'), t('planner.sections.college'), t('planner.sections.personalLife'), t('planner.sections.health'), t('planner.sections.projects')];
  const priorities: { id: Priority; label: string; icon: string; }[] = [
    { id: 'leve', label: t('planner.priorities.light'), icon: '🌱' },
    { id: 'medio', label: t('planner.priorities.medium'), icon: '🌿' },
    { id: 'profundo', label: t('planner.priorities.deep'), icon: '🌳' },
  ];
  
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
            <h2 className="text-3xl font-bold text-soraki-primaryDark">{t('planner.title')}</h2>
            <p className="text-soraki-textLight text-sm">{t('planner.subtitle')} 🌱</p>
        </div>
        <div className='flex items-center gap-4'>
            {streak > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
                    <Zap size={14} />
                    <span>{t('planner.streak', { count: streak })}</span>
                </div>
            )}
            <button 
                onClick={() => setIsAdding(!isAdding)}
                className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-soft transition-all flex items-center gap-1 ${isAdding ? 'bg-soraki-neutral text-soraki-textLight' : 'bg-soraki-primary text-white hover:bg-soraki-primaryDark'}`}
            >
                <Plus size={18} /> {isAdding ? t('planner.cancel') : t('planner.new')}
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
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    placeholder={t('planner.placeholder')}
                    className="w-full p-3 mb-3 rounded-xl bg-soraki-bg border-none focus:ring-2 focus:ring-soraki-primary/50 text-white-800 placeholder-gray-500"
                />
                <div className='flex justify-between items-center mb-4'>
                    <div className="flex gap-2 items-center flex-wrap">
                        <span className="text-sm font-semibold text-gray-600 mr-2">{t('planner.priority')}:</span>
                        {priorities.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPriority(p.id)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedPriority === p.id 
                                    ? 'bg-soraki-primaryDark text-white shadow-sm' 
                                    : 'bg-soraki-bg text-gray-700 border border-soraki-neutral'
                                }`}
                            >
                                {p.icon} {p.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4 items-center flex-wrap">
                     <span className="text-sm font-semibold text-gray-600 mr-2 whitespace-nowrap mt-1">{t('planner.section')}:</span>
                    {sections.map(sec => (
                        <button
                            key={sec}
                            onClick={() => setSelectedSection(sec)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                                selectedSection === sec 
                                ? 'bg-soraki-primaryDark text-white' 
                                : 'bg-soraki-bg text-gray-700 border border-soraki-neutral'
                            }`}
                        >
                            {sec}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end mt-3">
                    <button onClick={handleAddTask} className="bg-soraki-primaryDark text-white px-6 py-2 rounded-xl text-sm font-bold">
                        {t('planner.addTask')}
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {tasks.length === 0 && !isAdding ? (
             <div className="flex flex-col items-center justify-center mt-12 opacity-70">
                <MascotPlaceholder size="md" mood="happy" className="mb-4" />
                <p className="text-soraki-primaryDark font-bold mb-2">{t('planner.allClean')}</p>
                <p className="text-sm text-soraki-textLight text-center max-w-[200px]">
                    {t('planner.addTasksMessage')} ☁️
                </p>
            </div>
        ) : (
            tasks.map(task => (
                <div 
                    key={task.id}
                    className={`p-4 rounded-2xl group transition-all duration-300 border ${
                        task.completed 
                        ? 'bg-gray-100/50 border-transparent opacity-60' 
                        : `${getPriorityBgClass(task.priority)} ${getPriorityClass(task.priority)} shadow-card`
                    }`}
                >
                    <div 
                        onClick={() => toggleTask(task.id)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                                task.completed ? 'bg-soraki-primary border-soraki-primary' : 'border-gray-400'
                            }`}>
                                {task.completed && <Check size={14} className="text-white" />}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className={`text-gray-800 font-bold text-sm truncate ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                    {task.title}
                                </span>
                                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <Tag size={10} /> {task.subject}
                                </span>
                            </div>
                        </div>
                        
                        <div className='flex items-center'>
                             <span className='text-xs mr-4 text-gray-600'>
                                {priorities.find(p => p.id === task.priority)?.icon}
                            </span>
                            <button 
                                onClick={(e) => handleDeleteTask(task.id, e)}
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
                                {sub.completed ? <CheckCircle2 size={14} className="text-soraki-primary" /> : <Circle size={14} className="text-gray-400" />}
                                <span className={`text-sm ${sub.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
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
                                placeholder={t('planner.addSubtaskPlaceholder')}
                                className="w-full text-sm bg-transparent border-t-0 border-x-0 border-b border-dashed border-gray-300/50 focus:ring-0 focus:border-soraki-primary/50 placeholder-gray-500 py-1 pl-0 text-gray-700"
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
