
import React from 'react';
import { ExternalLink } from 'lucide-react';

const Shop: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-24 h-full justify-center">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-soraki-primaryDark">Loja</h2>
        <div className="text-soraki-textLight text-sm mt-4 max-w-sm mx-auto flex flex-col gap-4">
            <p>🌤 Apoie o projeto e leve um pedacinho da Soraki com você</p>
            <p>Cada produto da lojinha ajuda a manter o app vivo, gentil e sempre evoluindo.<br/>Se você acredita na proposta de estudar com leveza, constância e calma… essa é a melhor forma de apoiar.</p>
            <p>🛍 Visite nossa lojinha e dê um boost no Soraki<br/>(Com amor e um pouquinho de fofura sempre 💛)</p>
        </div>
      </div>

      {/* External Shop */}
      <div 
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-lg cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-transform"
        onClick={() => window.open('https://soraki-catalogo.vercel.app/', '_blank')}
      >
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
             <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold inline-block text-white uppercase tracking-widest">
                 LOJA EXTERNA
             </div>
             
             <div>
                 <h3 className="font-bold text-2xl mb-2">Materiais Premium</h3>
                 <p className="text-indigo-100 text-sm max-w-[260px] mx-auto leading-relaxed">
                    Acesse planners digitais completos, e-books de estudo e adesivos exclusivos na nossa loja oficial.
                 </p>
             </div>

             <div className="mt-4 bg-white text-indigo-600 px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2">
                <span>Visitar Loja</span>
                <ExternalLink size={18} />
             </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default Shop;
