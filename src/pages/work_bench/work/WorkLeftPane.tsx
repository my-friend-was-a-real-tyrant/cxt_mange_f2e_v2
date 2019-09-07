import React from 'react'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {Tabs, Icon} from 'antd'
import * as actions from 'store/actions/work'
import Users from './Users'
import moment from 'moment'
import 'assets/styles/work.less'
import {formatTime} from "../../../utils/utils"

interface IWorkUsers {
  data: [],
  total: number;
}

interface IProps {
  workUsers: IWorkUsers;
  getWorkUsers: (key?: string) => Dispatch;
  setUsersSearch: (value: any) => any;
  usersSearch: any;
  setWorkUsers: (value: any) => any
}

class WorkLeftPane extends React.Component<IProps> {

  componentDidMount() {
    this.getUsers()
  }

  // 获取用户列表
  getUsers = () => {
    const {getWorkUsers} = this.props;
    getWorkUsers()
  }

  handleTabsChange = async (key: string) => {
    const {setUsersSearch, usersSearch, getWorkUsers, setWorkUsers} = this.props;
    await setWorkUsers({data: [], total: 0})

    switch (key) {
      case '1':
        await setUsersSearch({
          uni_query: '',
          biz_status: '',
          reg_date_b: '',
          reg_date_e: '',
          create_time_b: '',
          create_time_e: '',
          next_follow_time_b: '',
          next_follow_time_e: '',
          page: 1,
          pageSize: 40,
        });
        await getWorkUsers()
        break
      case '2':
        await setUsersSearch({
          uni_query: '',
          reg_date_b: '',
          reg_date_e: '',
          create_time_b: '',
          create_time_e: '',
          next_follow_time_b: '',
          next_follow_time_e: '',
          page: 1,
          pageSize: 40,
          biz_status: 1
        });
        await getWorkUsers()
        break
      case '3':
        await setUsersSearch({
          uni_query: '',
          reg_date_b: '',
          reg_date_e: '',
          create_time_b: '',
          create_time_e: '',
          next_follow_time_b: moment().clone().set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
          }).format('YYYY-MM-DD HH:mm:ss'),
          next_follow_time_e: moment().clone().set({
            hour: 23,
            minute: 59,
            second: 59,
            millisecond: 59
          }).format('YYYY-MM-DD HH:mm:ss'),
          page: 1,
          pageSize: 40,
        });
        await getWorkUsers(key)
        break
      case '4':
        await setUsersSearch({
          uni_query: '',
          reg_date_b: '',
          reg_date_e: '',
          create_time_b: '',
          create_time_e: '',
          next_follow_time_b: '',
          next_follow_time_e: moment().add(-1, 'days').clone().set({
            hour: 23,
            minute: 59,
            second: 59,
            millisecond: 59
          }).format('YYYY-MM-DD HH:mm:ss'),
          page: 1,
          pageSize: 40,
          biz_status: ''
        });
        await getWorkUsers()
        break
    }
  }

  render() {
    return (
      <div className="work-left">
        <Tabs animated={false}
              tabBarGutter={0}
              onChange={this.handleTabsChange}
              tabBarExtraContent={<div className="add-user-btn"><span className="btn"><Icon type="plus"/></span></div>}>
          <Tabs.TabPane key="1" tab="全部用户">
            <Users/>
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="未 &nbsp;处&nbsp; 理">
            <Users/>
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="今日预约">
            <Users/>
          </Tabs.TabPane>
          <Tabs.TabPane key="4" tab="预约过期">
            <Users/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  workUsers: state.work.workUsers,
  usersSearch: state.work.usersSearch
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  getWorkUsers: (key?: string) => dispatch(actions.thunkWorkUsers(key)),
  setUsersSearch: (value: any) => dispatch(actions.setUsersSearch(value)),
  setWorkUsers: (value: any) => dispatch(actions.setWorkUsers(value))
})
export default connect(mapStateToProps, mapDispatchToProps)(WorkLeftPane)
