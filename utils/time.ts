
// Helper para obter a data no formato YYYY-MM-DD
const getLocalDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
}

export const 하루 = { // "haru" significa "dia" em coreano
    today: (): string => {
        return getLocalDate(new Date());
    },
    
    yesterday: (): string => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return getLocalDate(date);
    },

    isToday: (dateStr: string): boolean => {
        return dateStr === 하루.today();
    },

    isYesterday: (dateStr: string): boolean => {
        return dateStr === 하루.yesterday();
    }
};