import React, {useState} from 'react'
import {Button, Spin, Icon} from 'antd'
import {connect} from 'react-redux'
import SearchUsers from './SearchUsers'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
import {getWechatTime} from 'utils/utils'

interface IWorkUsers {
  data: [],
  total: number;
}

interface IProps {
  workUsers: IWorkUsers;
  setUsersSearch: (values: any) => any;
  usersSearch: any;
  thunkWorkUsers: () => any;
  getUserLoading: boolean;
  setCurrentUser: (user: any) => any;
  currentUser: any;
}

const Users = (props: IProps) => {
  const {setUsersSearch, usersSearch, thunkWorkUsers, workUsers, getUserLoading, currentUser, setCurrentUser} = props
  const {data, total} = workUsers


  const onSearch = async () => {
    await setUsersSearch({...usersSearch, page: usersSearch.page + 1})
    await thunkWorkUsers()
  }

  const handleSetCurrentUser = (user: any) => {
    setCurrentUser(user)
  }

  const userItem = data.map((v: any) => {
    const wechat: boolean = v.target_wx && v.server_wx
    return <div className={`user-item ${currentUser && currentUser.id === v.id ? 'active' : ''}`} key={v.id}
                onClick={() => handleSetCurrentUser(v)}>
      <span>{v.license ? v.license : '--'}</span>
      <span>{v.mobile ? v.mobile.replace('****', '*') : '--'}</span>
      <span>{v.name ? v.name : '--'}</span>
      <span>
        <b className={wechat ? v.online ? 'online' : 'no-online' : 'normal'}>
          <Icon type="wechat"/>
        </b>
      </span>
      <span>{getWechatTime(v.recent_time)}</span>
    </div>
  })
  return (
    <Spin spinning={getUserLoading}>
      <div className="work-left__user-list">
        <SearchUsers/>
        <ul className="users-title">
          <li>车牌</li>
          <li>电话</li>
          <li>姓名</li>
          <li>微信</li>
          <li>时间</li>
        </ul>
        <div className="users">
          {userItem}
        </div>
        <div className="loadmore">
          <span>{data.length}/{total}</span>
          {data.length === total ? '已全部加载完成' : <Button type="link" onClick={onSearch}>查看更多</Button>}
        </div>
      </div>
    </Spin>
  )
}
const mapStateToProps = (state: any) => ({
  workUsers: state.work.workUsers,
  usersSearch: state.work.usersSearch,
  getUserLoading: state.work.getUserLoading,
  currentUser: state.work.currentUser
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setUsersSearch: (value: any) => dispatch(actions.setUsersSearch(value)),
  thunkWorkUsers: () => dispatch(actions.thunkWorkUsers()),
  setCurrentUser: (value: any) => dispatch(actions.setCurrentUser(value))
})
export default connect(mapStateToProps, mapDispatchToProps)(Users)
