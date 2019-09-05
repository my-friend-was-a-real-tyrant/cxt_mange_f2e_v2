/*
 * @Author: sunyonghua
 * @Date: 2019-09-04 11:43:25
 * @Description: file content
 */
import fetch from 'fetch/axios'
import {Dispatch} from 'redux'
import constants from "../constants/work"


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
export const thunkWorkUsers = () => async (dispatch: Dispatch, getState: any) => {
  const {workUsers, usersSearch} = getState().work
  const params = usersSearch;
  const {data} = workUsers
  dispatch(setUserLoading(true))
  await fetch.get(`/apiv1/user-uni-data/list`, {params}).then((res: any) => {
    dispatch(setUserLoading(false))
    if (res.code === 20000) {
      dispatch(setWorkUsers({data: data.concat(res.data || []), total: res.count || 0}))
    }
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
