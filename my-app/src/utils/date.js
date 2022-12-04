import moment from 'moment'

export const formatTime = (dateStr) => moment(dateStr).utc().format('HH:mm')

export const formatFullDate = (dateStr) => moment(dateStr).utc().format('DD MMM dd').replace('.', '')

export const formatDatetime = (dateStr) => moment(dateStr).utc().format('DD MMM, HH:mm')

export const formatDate = (dateStr) => moment(dateStr).utc().format('DD MMM').replace('.', '')
