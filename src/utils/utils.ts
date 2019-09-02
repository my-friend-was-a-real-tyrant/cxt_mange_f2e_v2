import moment from 'moment'

export const quickTimeSelect = (): any => {
  return {
    "今天": [
      moment().clone().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
      moment().clone().set({ hour: 23, minute: 59, second: 59, millisecond: 59 }),
    ],
    "昨天": [
      moment().add(-1, 'days').clone().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
      moment().clone().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    ],
    "最近一周": [
      moment().add(-1, 'week').startOf('week'),
      moment(),
    ],
    "最近一月": [moment().add(-1, 'month').startOf('month'), moment()],
    "最近一年": [moment().startOf('year'), moment().endOf('year')],
  }
}

export const formatTime = (date: any[] = [], format?: string) => {
  let result = [];
  if (date.length) {
    if (date[0]) {
      result.push(moment(date[0]).clone()
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format(format || 'YYYY-MM-DD'))
    } else {
      result.push('')
    }
    if (date[1]) {
      result.push(moment(date[1]).clone()
        .set({ hour: 23, minute: 59, second: 59, millisecond: 59 }).format(format || 'YYYY-MM-DD'))
    } else {
      result.push('')
    }
  }
  return result
}
