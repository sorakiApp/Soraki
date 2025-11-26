
import React, { useRef, useState } from 'react';
import Card from '../components/UI/Card';
import { Edit2, Flame, Clock, Activity, Moon, Sun, Download, Upload, AlertCircle, Check, Camera } from 'lucide-react';
import UserAvatar from '../components/UI/UserAvatar';
import { useData } from '../contexts/dataContext';

interface ProfileProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  refreshApp: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isDarkMode, toggleTheme, refreshApp }) => {
  const { userProfile, stats, updateUserProfile } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!userProfile) {
      return <div>Carregando perfil...</div>; // Ou um placeholder melhor
  }

  const handleAvatarUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportBackup = () => {
    try {
        const backupData = {
            version: 1,
            date: new Date().toISOString(),
            data: {
                stats: localStorage.getItem('soraki-stats'),
                settings: localStorage.getItem('soraki-settings'),
                tasks: localStorage.getItem('soraki-tasks'),
                reviews: localStorage.getItem('soraki-reviews'),
                profile: localStorage.getItem('soraki-profile')
            }
        };

        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const fileName = "soraki-backup.json";
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);

    } catch (error) {
        console.error("Export failed:", error);
        alert("Erro ao gerar backup. Tente novamente.");
    }
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target?.result as string;
            const parsed = JSON.parse(content);

            if (!parsed.data) throw new Error("Formato inválido");

            if (parsed.data.stats) localStorage.setItem('soraki-stats', parsed.data.stats);
            if (parsed.data.settings) localStorage.setItem('soraki-settings', parsed.data.settings);
            if (parsed.data.tasks) localStorage.setItem('soraki-tasks', parsed.data.tasks);
            if (parsed.data.reviews) localStorage.setItem('soraki-reviews', parsed.data.reviews);
            if (parsed.data.profile) localStorage.setItem('soraki-profile', parsed.data.profile);

            setImportStatus('success');
            refreshApp();
            setTimeout(() => setImportStatus('idle'), 3000);

        } catch (err) {
            console.error(err);
            setImportStatus('error');
            setTimeout(() => setImportStatus('idle'), 3000);
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in pb-20">
        {/* Avatar Header */}
        <div className="flex flex-col items-center mt-6 mb-8 relative">
            <div className="flex items-center justify-center gap-4">
                 <div className="w-24 h-24 rounded-2xl flex items-center justify-center relative overflow-visible">
                     <div className="relative z-10">
                         <UserAvatar profileImage={userProfile.avatar} size="lg" mood="happy" />
                         <div 
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-soraki-primaryDark text-white p-2 rounded-full border-4 border-soraki-bg cursor-pointer hover:bg-blue-600 transition-colors z-20"
                         >
                             <Camera size={14} />
                         </div>
                         <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpdate} />
                     </div>
                 </div>
            </div>
            
            <h2 className="text-2xl font-light text-soraki-primaryDark mt-4">{userProfile.name}</h2>
            <div className="text-soraki-textLight text-sm flex flex-col items-center">
                <span>{userProfile.age} anos • {userProfile.studyGoal}</span>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="flex flex-col items-center justify-center py-6">
                <Flame className="text-orange-500 fill-orange-500 mb-2 w-6 h-6" />
                <div className="bg-orange-50 dark:bg-orange-900/20 px-3 py-0.5 rounded-full mb-1 border border-orange-100 dark:border-orange-900/30">
                    <span className="text-orange-500 font-bold text-sm">{stats.streak}</span>
                    <span className="text-[10px] text-orange-400 ml-1">dias</span>
                </div>
                <span className="text-[10px] text-soraki-textLight">Sequência</span>
            </Card>
            <Card className="flex flex-col items-center justify-center py-6">
                <Clock className="text-soraki-text mb-2 w-6 h-6" />
                <span className="text-soraki-primaryDark font-bold text-lg mb-1">{stats.totalHours.toFixed(1)}h</span>
                <span className="text-[10px] text-soraki-textLight">Horas</span>
            </Card>
             <Card className="flex flex-col items-center justify-center py-6">
                <Activity className="text-soraki-text mb-2 w-6 h-6" />
                <span className="text-soraki-primaryDark font-bold text-lg mb-1">{stats.sessions}</span>
                <span className="text-[10px] text-soraki-textLight">Sessões</span>
            </Card>
        </div>

        {/* Settings */}
        <Card className="mb-6 space-y-4" padding="p-6">
             {/* Dark Mode Toggle */}
             {toggleTheme && (
                <div className="flex items-center justify-between border-b border-soraki-neutral pb-4">
                  <div className="flex items-center gap-3 text-soraki-primaryDark">
                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-yellow-100 text-yellow-600'}`}>
                        {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Modo {isDarkMode ? 'Noturno' : 'Claro'}</h3>
                        <p className="text-[10px] text-soraki-textLight">Ajuste a aparência do app</p>
                      </div>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-soraki-primary' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
             )}

             {/* Backup Section */}
             <div className="pt-2">
                <h3 className="font-bold text-sm text-soraki-primaryDark mb-3">Backup e Dados</h3>
                <div className="flex gap-3">
                    <button 
                        onClick={handleExportBackup}
                        className="flex-1 bg-soraki-surface border border-soraki-neutral py-3 rounded-xl flex flex-col items-center justify-center gap-1 text-soraki-text hover:bg-soraki-neutral/20 transition-colors"
                    >
                        <Download size={20} />
                        <span className="text-xs font-bold">Exportar</span>
                    </button>
                    
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 border border-soraki-neutral py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
                            importStatus === 'success' ? 'bg-green-50 text-green-600 border-green-200' : 
                            importStatus === 'error' ? 'bg-red-50 text-red-500 border-red-200' : 
                            'bg-soraki-surface text-soraki-text hover:bg-soraki-neutral/20'
                        }`}
                    >
                        {importStatus === 'success' ? <Check size={20} /> : 
                         importStatus === 'error' ? <AlertCircle size={20} /> : 
                         <Upload size={20} />}
                        <span className="text-xs font-bold">
                            {importStatus === 'success' ? 'Sucesso!' : 
                             importStatus === 'error' ? 'Erro' : 'Restaurar'}
                        </span>
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImportBackup}
                        onClick={(e) => (e.currentTarget.value = '')}
                        accept=".json" 
                        className="hidden" 
                    />
                </div>
                <p className="text-[10px] text-soraki-textLight mt-2 text-center">
                    Salve seu progresso em um arquivo seguro.
                </p>
             </div>
        </Card>
    </div>
  );
};

export default Profile;
