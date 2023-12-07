import moment from 'moment'

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  return moment(date).format(format)
}
