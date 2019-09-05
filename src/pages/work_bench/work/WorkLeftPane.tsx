import React from 'react'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {Tabs, Icon} from 'antd'
import * as actions from 'store/actions/work'
import Users from './Users'
import 'assets/styles/work.less'

interface IWorkUsers {
  data: [],
  total: number;
}

interface IProps {
  workUsers: IWorkUsers;
  getWorkUsers: () => Dispatch;
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

  render() {
    return (
      <div className="work-left">
        <Tabs animated={false}
              tabBarGutter={0}
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
  workUsers: state.work.workUsers
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  getWorkUsers: () => dispatch(actions.thunkWorkUsers())
})
export default connect(mapStateToProps, mapDispatchToProps)(WorkLeftPane)
