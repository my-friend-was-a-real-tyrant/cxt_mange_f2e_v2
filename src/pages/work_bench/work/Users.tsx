import React, {useState} from 'react'
import {connect} from 'react-redux'
import SearchUsers from './SearchUsers'

interface IWorkUsers {
  data: [],
  total: number;
}

interface IProps {
  workUsers: IWorkUsers
}

const Users = (props: IProps) => {
  const {workUsers} = props
  const {data, total} = workUsers

  const userItem = data.map((v: any) => <div className="user-item" key={v.id}>
    <span>{v.license}</span>
    <span>{v.mobile ? v.mobile.replace('****', '*') : v.mobile}</span>
    <span>孙勇华拾</span>
    <span>11111</span>
    <span>12:00</span>
  </div>)
  return (
    <div className="work-left__user-list">
      <SearchUsers />
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
    </div>
  )
}
const mapStateToProps = (state: any) => ({
  workUsers: state.work.workUsers
})
export default connect(mapStateToProps)(Users)
