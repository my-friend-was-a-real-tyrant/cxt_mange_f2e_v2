import moment from 'moment'

export const quickTimeSelect = (): any => {
  return {
    "今天": [
      moment().clone().set({hour: 0, minute: 0, second: 0, millisecond: 0}),
      moment().clone().set({hour: 23, minute: 59, second: 59, millisecond: 59}),
    ],
    "昨天": [
      moment().add(-1, 'days').clone().set({hour: 0, minute: 0, second: 0, millisecond: 0}),
      moment().clone().set({hour: 0, minute: 0, second: 0, millisecond: 0}),
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
        .set({hour: 0, minute: 0, second: 0, millisecond: 0}).format(format || 'YYYY-MM-DD'))
    } else {
      result.push('')
    }
    if (date[1]) {
      result.push(moment(date[1]).clone()
        .set({hour: 23, minute: 59, second: 59, millisecond: 59}).format(format || 'YYYY-MM-DD'))
    } else {
      result.push('')
    }
    return result

  } else {
    return ['', '']
  }
}

// 获取微信时间
export const getWechatTime = (time: string | number): string => {
  if (!time) {
    return ''
  }
  const curTime = new Date()
  const curDate = `${curTime.getFullYear()}-${curTime.getMonth() + 1}-${curTime.getDate()}`

  if (time < (new Date(curDate).getTime() + 1000 * 60 * 60 * 24) && time > new Date(curDate).getTime()) {
    return moment(time).format('hh:mm')
  } else {
    return moment(time).format('MM/DD')
  }
}

// 检测手机号
export const checkPhone = (phone: any) => {
  return /^1[3456789]\d{9}$/.test(phone);
}

// 校验机动车车牌
export const checkInsurance = (vehicleNumber: any) => {
  if (!vehicleNumber) return false;
  var result = false;
  if (vehicleNumber.length < 7 || vehicleNumber.length > 8) {
    return false
  } else {
    const express = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
    result = express.test(vehicleNumber)
    return result
  }
}
// 序列化对象
export const qsString = (data:any = {}) => {
  let kv = '';
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      kv += `${key}=${data[key]}&`;
    }
  }
  return kv.substring(0, kv.length - 1);
};
