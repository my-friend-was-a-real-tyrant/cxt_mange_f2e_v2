/*
 * @Author: sunyonghua
 * @Date: 2019-09-04 11:43:25
 * @Description: file content
 */
import fetch from 'fetch/axios'
import {Dispatch} from 'redux'
import constants from "../constants/work"

/**
 * @desc 获取工作台用户列表
 */
export const thunkWorkUsers = () => (dispatch: Dispatch) => {
  fetch.get(`/apiv1/user-uni-data/list`).then((res: any) => {
    if (res.code === 20000) {
      dispatch({
        type: constants.SET_WORK_USERS, value: {
          data: res.data || [],
          total: res.count || 0
        }
      })
    }
  })
}
