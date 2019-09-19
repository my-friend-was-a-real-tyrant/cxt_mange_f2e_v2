import React from 'react'
import {Button, Spin, Icon, Empty, Badge} from 'antd'
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
  asyncGetWechatMessages: () => any;
  setWechatMessageInfo: (value: any) => any;
}


const Users = (props: IProps) => {
  const {setUsersSearch, usersSearch, thunkWorkUsers, workUsers, getUserLoading, currentUser, setCurrentUser, asyncGetWechatMessages, setWechatMessageInfo} = props
  const {data, total} = workUsers
  // 根据最后联系时间排序
  data.sort((obj1: any, obj2: any) => {
    if (obj1.recent_time > obj2.recent_time) {
      return -1
    } else if (obj1.recent_time < obj2.recent_time) {
      return 1
    } else {
      return 0
    }
  })
  const onSearch = async () => {
    await setUsersSearch({...usersSearch, page: usersSearch.page + 1})
    await thunkWorkUsers()
  }

  const handleSetCurrentUser = (user: any) => {
    setWechatMessageInfo({data: [], finished: false, limit: 10, offset: 1})
    setCurrentUser(user)
    if (user.server_wx && user.target_wx) {
      asyncGetWechatMessages()
    }
  }

  const userItem = data.map((v: any) => {
    const wechat: boolean = v.target_wx && v.server_wx
    return <div className={`user-item ${currentUser && currentUser.id === v.id ? 'active' : ''}`} key={v.id}
                onClick={() => {
                  v.unread = 0
                  handleSetCurrentUser(v)
                }}>
      <span>{v.license ? v.license : '--'}</span>
      <span>{v.mobile ? v.mobile.replace('****', '*') : '--'}</span>
      <span>{v.name ? v.name : '--'}</span>
      <span>
        <Badge dot={Boolean(v.unread)}>
          <b className={`${wechat ? v.online ? 'online' : 'no-online' : 'normal'}`}>
            <Icon type="wechat"/>
          </b>
        </Badge>
      </span>
      <span>{getWechatTime(v.recent_time)}</span>
    </div>
  })
  return (
    <Spin spinning={getUserLoading}>
      <div className="work-left__user-list">
        <SearchUsers/>
        {
          data.length ? <>
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
          </> : <Empty image={`https://cxt.mjoys.com/api/1019/2019/9/10/2019091019563595t5cmW.png`}/>
        }
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
  setCurrentUser: (value: any) => dispatch(actions.setCurrentUser(value)),
  asyncGetWechatMessages: () => dispatch(actions.asyncGetWechatMessages()),
  setWechatMessageInfo: (value: any) => dispatch(actions.setWechatMessageInfo(value))
})
export default connect(mapStateToProps, mapDispatchToProps)(Users)
