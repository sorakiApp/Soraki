
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "greetings.morning": "Good morning",
      "greetings.afternoon": "Good afternoon",
      "greetings.evening": "Good evening",
      "encouragement": "\"Studying a little every day is better than a lot at once.\"",
      "currentStreak": "Current Streak",
      "daysInARow": "days in a row",
      "todaysSummary": "Today's Summary",
      "dailyProgress": "Daily Progress",
      "noTasksForToday": "No tasks for today yet",
      "tasksCompleted": "{{completed}} of {{total}} tasks completed",
      "nav.home": "Home",
      "nav.planner": "Planner",
      "nav.focus": "Focus",
      "nav.reviews": "Reviews",
      "nav.shop": "Shop",
      "nav.profile": "Profile",
      "planner.title": "Planner",
      "planner.subtitle": "plant the seeds of your day",
      "planner.streak": "{{count}} day of consistency",
      "planner.streak_plural": "{{count}} days of consistency",
      "planner.cancel": "Cancel",
      "planner.new": "New",
      "planner.placeholder": "Ex: Study chapter 3 of biology...",
      "planner.priority": "Priority",
      "planner.section": "Section",
      "planner.addTask": "Add Task",
      "planner.allClean": "All clean here!",
      "planner.addTasksMessage": "Add today's tasks to clear up space in your mind. ☁️",
      "planner.addSubtaskPlaceholder": "Add micro-task...",
      "planner.sections.study": "Study",
      "planner.sections.college": "College",
      "planner.sections.personalLife": "Personal Life",
      "planner.sections.health": "Health",
      "planner.sections.projects": "Projects",
      "planner.priorities.light": "Light",
      "planner.priorities.medium": "Medium",
      "planner.priorities.deep": "Deep"
    }
  },
  pt: {
    translation: {
      "greetings.morning": "Bom dia",
      "greetings.afternoon": "Boa tarde",
      "greetings.evening": "Boa noite",
      "encouragement": "\"Estudar um pouco todo dia é melhor do que muito de uma vez só.\"",
      "currentStreak": "Sequência atual",
      "daysInARow": "dias seguidos",
      "todaysSummary": "Resumo de hoje",
      "dailyProgress": "Progresso diário",
      "noTasksForToday": "Nenhuma tarefa para hoje ainda",
      "tasksCompleted": "{{completed}} de {{total}} tarefas concluídas",
      "nav.home": "Início",
      "nav.planner": "Planner",
      "nav.focus": "Foco",
      "nav.reviews": "Revisões",
      "nav.shop": "Loja",
      "nav.profile": "Perfil",
      "planner.title": "Planner",
      "planner.subtitle": "plante as sementes do seu dia",
      "planner.streak": "{{count}} dia de constância",
      "planner.streak_plural": "{{count}} dias de constância",
      "planner.cancel": "Cancelar",
      "planner.new": "Nova",
      "planner.placeholder": "Ex: Estudar capítulo 3 de biologia...",
      "planner.priority": "Prioridade",
      "planner.section": "Seção",
      "planner.addTask": "Adicionar Tarefa",
      "planner.allClean": "Tudo limpo por aqui!",
      "planner.addTasksMessage": "Adicione as tarefas de hoje para liberarmos espaço na sua mente. ☁️",
      "planner.addSubtaskPlaceholder": "Adicionar microtarefa...",
      "planner.sections.study": "Estudo",
      "planner.sections.college": "Faculdade",
      "planner.sections.personalLife": "Vida Pessoal",
      "planner.sections.health": "Saúde",
      "planner.sections.projects": "Projetos",
      "planner.priorities.light": "Leve",
      "planner.priorities.medium": "Médio",
      "planner.priorities.deep": "Profundo"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    },
    
    pluralSeparator: '_plural',
  });

export default i18n;
