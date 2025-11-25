
// Helper para obter a data no formato YYYY-MM-DD, respeitando o fuso horário local.
const getLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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

    isToday: (dateString: string): boolean => {
        return dateString === getLocalDate(new Date());
    },

    isYesterday: (dateString: string): boolean => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return dateString === getLocalDate(date);
    }
};