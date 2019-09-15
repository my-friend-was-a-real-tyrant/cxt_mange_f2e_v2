/*
 * @Author: sunyonghua
 * @Date: 2019-09-04 11:43:25
 * @Description: file content
 */
import fetch from 'fetch/axios'
import {Dispatch} from 'redux'
import constants from "../constants/work"

/**
 * @desc 获取工作安排统计信息
 */
export const getWorkCount = () => (dispatch: any) => {
  fetch.get(`/apiv1/otb/task/findTaskCount?type=287`).then((res: any) => {
    if (res.code === 20000) {
      dispatch({type: constants.SET_WORK_COUNT, value: res.data})
    }
  })
}
/**
 * @desc 解密手机号
 * @param phone
 */
export const decryptMobile = (phone: string = '') => (dispatch: Dispatch) => {
  const params = {
    phone,
  }
  return new Promise((resolve) => {
    fetch.get(`/apiv1/wx/decrypt-mobile`, {params}).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        let data = res.data || ''
        if (data === "null") {
          data = '';
        }
        resolve(data || '')
      }
    })
  })
}
/**
 * @desc 设置用户列表搜索条件
 */
export const setUsersSearch = (value: any) => ({
  type: constants.SET_USERS_SEARCH,
  value
})

/**
 * @desc 设置工作台用户列表
 */
export const setWorkUsers = (value: any) => ({
  type: constants.SET_WORK_USERS,
  value
})
/**
 * @desc 获取工作台用户列表
 */
export const thunkWorkUsers = (key?: string) => (dispatch: Dispatch, getState: any) => {
  const {workUsers, usersSearch} = getState().work
  const params = {
    ...usersSearch,
    orderBy: 'recent_time desc',
  };
  const {data} = workUsers
  dispatch(setUserLoading(true))
  return new Promise((resolve, reject) => {
    fetch.get(`/apiv1/user-uni-data/list`, {params}).then((res: any) => {
      dispatch(setUserLoading(false))
      if (res.code === 20000) {
        const userList = res.data || []
        userList.forEach((v: any) => {
          v.unread = 0;
        })
        if (usersSearch.page === 1) {
          dispatch(setWorkUsers({data: userList, total: res.count || 0}))
        } else {
          dispatch(setWorkUsers({data: data.concat(userList), total: res.count || 0}))
        }
        resolve(data.concat(res.data || []))
      }
    })
  })
}

/**
 * @desc 设置用户加载loading
 */
export const setUserLoading = (value: boolean) => ({
  type: constants.SET_USER_LOADING,
  value
})

/**
 * @desc 设置选中用户
 */
export const setCurrentUser = (value: any) => ({
  type: constants.SET_CURRENT_USER,
  value
})

/**
 * @desc 获取聊天记录
 */
export const asyncGetWechatMessages = (server_wx?: string, target_wx?: string) => (dispatch: Dispatch, getState: any) => {
  const {currentUser, wechtMessageInfo} = getState().work
  const {offset, limit, data} = wechtMessageInfo

  const params = {
    offset,
    limit,
    targetWxId: target_wx || currentUser.target_wx,
    originWxId: server_wx || currentUser.server_wx
  }
  if (!params.targetWxId && !params.originWxId) {
    return dispatch(setWechatMessageInfo({limit, data: [], finished: false, offset: offset + 1}))
  } else {
    params.offset = 1
  }
  fetch.get(`/apiv1/wx/getWxCommunicateRecords`, {params}).then((res: any) => {
    let finished = res.data.length < 10
    if (res.code === 20000) {
      dispatch(setWechatMessageInfo({limit, data: res.data.reverse().concat(data), finished, offset: offset + 1}))
    } else if (res.code === 20003) {
    } else {
    }
  })
}

/**
 * @desc 设置微信聊天记录
 */
export const setWechatMessageInfo = (value: any) => ({
  type: constants.SET_WECHAT_MESSAGE_INFO,
  value
})
