/*
 * @Author: sunyonghua
 * @Date: 2019-08-28 11:43:25
 * @Description: file content
 */
import fetch from 'fetch/axios'
import {Dispatch} from 'redux'
import constants from "../constants/common"

/**
 * @desc 获取菜单列表
 */
export const thunkSetMenuList = () => (dispatch: Dispatch): Promise<string> => {
  const params = {
    order: '+dorder',
    appcode: 'ROBOT',
    userid: localStorage.getItem('mjoys_user_id'),
    // access_token: localStorage.getItem('access_token'),
  }
  return new Promise((resolve, reject) => {
    fetch.get(`/apiv1/uac/user/pagefunctiontree`, {params}).then((res: any) => {
      if (res.code === 20000) {
        localStorage.setItem('cxt_menu_list', JSON.stringify(res.data))
        dispatch({
          type: constants.SET_MENU_LIST,
          value: res.data
        })
        resolve('success')
      }
    })
  })
}
