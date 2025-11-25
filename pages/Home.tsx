
import React from 'react';
import Card from '../components/UI/Card';
import MascotPlaceholder from '../components/UI/MascotPlaceholder';
import { Calendar, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/dataContext';
import { 하루 } from '../utils/time';

interface HomeProps {
  userProfile: UserProfile;
}

const Home: React.FC<HomeProps> = ({ userProfile }) => {
  const navigate = useNavigate();
  const { tasks, streak } = useData();

  // Calculate Progress based on tasks from context
  const todayStr = 하루.today();
  const todaysTasks = tasks.filter(t => t.date === todayStr);
  const total = todaysTasks.length;
  const completed = todaysTasks.filter(t => t.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const dateString = today.toLocaleDateString('pt-BR', options);
  
  const hour = today.getHours();
  let greeting = "Bom dia";
  let mascotMood: "happy" | "sleep" | "study" = "study";

  if (hour >= 18) {
    greeting = "Boa noite";
    mascotMood = "sleep";
  } else if (hour >= 12) {
    greeting = "Boa tarde";
    mascotMood = "happy";
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-24">
      {/* Greeting Section */}
      <Card className="relative overflow-visible mt-4 bg-gradient-to-br from-soraki-surface to-soraki-card border-soraki-primaryLight/30">
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <h2 className="text-3xl font-bold text-soraki-primaryDark mb-1 leading-tight">{greeting},<br/>{userProfile.name}!</h2>
                <div className="flex items-center gap-2 text-soraki-textLight text-sm mt-2 bg-soraki-card/50 py-1 px-3 rounded-full w-fit">
                    <Calendar size={14} />
                    <span className="capitalize">{dateString}</span>
                </div>
            </div>
             <div className="absolute -right-4 -top-8 filter drop-shadow-lg animate-float">
                <MascotPlaceholder size="md" mood={mascotMood} />
             </div>
        </div>
      </Card>

      {/* Encouragement */}
      <Card className="flex items-center gap-4 py-4 border-l-4 border-l-soraki-primary">
        <MascotPlaceholder size="sm" mood="happy" className="!w-12 !h-12" />
        <p className="text-soraki-text font-medium text-sm leading-snug">
          "Estudar um pouco todo dia é melhor do que muito de uma vez só." 🌿
        </p>
      </Card>

      {/* Stats Grid - Modified to just show Streak full width */}
      <div className="w-full">
        <Card className="flex flex-row items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
             <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-full">
                <Flame className="text-orange-400 fill-orange-400 w-6 h-6" />
             </div>
             <span className="text-sm text-soraki-text font-semibold">Sequência atual</span>
          </div>
          <div className="text-right">
             <span className="text-2xl text-orange-500 font-bold block leading-none">{streak}</span>
             <span className="text-xs text-orange-300">dias seguidos</span>
          </div>
        </Card>
      </div>

      {/* Daily Summary */}
      <Card className="mb-4 relative overflow-hidden" onClick={() => navigate('/planner')}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="bg-soraki-primaryLight p-2 rounded-xl text-soraki-primaryDark">
                    <CheckCircle2 size={20} />
                </div>
                <h3 className="font-bold text-soraki-primaryDark text-lg">Resumo de hoje</h3>
            </div>
            <ArrowRight size={18} className="text-soraki-primary/60" />
        </div>
        
        <div className="relative pt-2 pb-2">
            <div className="flex justify-between text-xs text-soraki-textLight mb-2">
              <span>Progresso diário</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-soraki-neutral/50 rounded-full h-3 mb-1 overflow-hidden">
                <div 
                    className="bg-soraki-primary h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-xs text-center text-soraki-textLight mt-2">
                {total === 0 
                    ? "Nenhuma tarefa para hoje ainda" 
                    : `${completed} de ${total} tarefas concluídas`
                }
            </p>
        </div>
      </Card>
    </div>
  );
};

export default Home;
