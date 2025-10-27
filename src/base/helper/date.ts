import { format } from 'date-fns'

import { id } from 'date-fns/locale'

export const formatDate = (date: Date | any) => {
    try {
        if (date instanceof Date) {
            return format(date, 'dd MMMM yyyy HH:mm', { locale: id })
        }
        if (date?.toDate) {
            return format(date.toDate(), 'dd MMMM yyyy HH:mm', { locale: id })
        }
        return 'Tanggal tidak tersedia'
    } catch (error) {
        return 'Tanggal tidak tersedia'
    }
} 