import React from 'react'
import {Tabs, Button, message} from 'antd'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
import MessageList from "components/work/MessageList"
import SendMessage from "components/work/SendMessage"
import RobotCallLog from "components/work/RobotCallLog"
import AgentCallLog from "components/work/AgentCallLog"
import ShortMessageLog from "components/work/ShortMessageLog"
import CallPanel from 'components/work/CallPanel'
import FollowUp from 'components/work/FollowUp'
import 'assets/styles/phone.less'

interface Iprops {
  wsState: string;
  sendMsg: (value: any) => any;
  currentUser: any;
  workUsers: any;
  setCurrentUser: (value: any) => any;
  thunkWorkUsers: () => any;
  setUsersSearch: (value: any) => any;
  usersSearch: any;
  asyncGetWechatMessages: (server: string, target: string) => any
}

class WorkCenterPanel extends React.Component<Iprops> {
  state = {
    index: -1
  }
  handleNextUser = async () => {
    const {currentUser, workUsers, setCurrentUser, thunkWorkUsers, setUsersSearch, usersSearch, asyncGetWechatMessages} = this.props;
    const {data: users, total} = workUsers
    const index = users.findIndex((v: any) => v.id === currentUser.id)
    this.setState({index})
    console.log(index)
    if (index < users.length) {
      if (index + 1 >= users.length && index + 1 < total) {
        await setUsersSearch({...usersSearch, page: usersSearch.page + 1})
        await thunkWorkUsers().then((res: any) => {
          setCurrentUser(res[index + 1])
          if (res[index + 1]) {
            asyncGetWechatMessages(res[index + 1].server_wx, res[index + 1].target_wx)
          }
        })
      } else if (index === total - 1) {
        message.info('已经是最后一条，请选择上一条')
      } else {
        setCurrentUser(users[index + 1])
        if (users[index + 1]) {
          asyncGetWechatMessages(users[index + 1].server_wx, users[index + 1].target_wx)
        }
      }
    }
  }

  handlePrevUser = async () => {
    const {currentUser, workUsers, setCurrentUser, asyncGetWechatMessages} = this.props;
    const {data: users} = workUsers
    const index = users.findIndex((v: any) => v.id === currentUser.id)
    this.setState({index})
    if (index === 0) {
      return message.info('已经是第一条，请选择下一条')
    }
    if (index > 0) {
      setCurrentUser(users[index - 1])
      if (users[index - 1]) {
        asyncGetWechatMessages(users[index - 1].server_wx, users[index - 1].target_wx)
      }
    }
  }


  render() {
    const pageButton = <div className="page-button">
      <Button type="primary" className="first" onClick={this.handlePrevUser}>上一条</Button>
      <Button type="primary" onClick={this.handleNextUser}>下一条</Button>
    </div>
    return (
      <div className="work-center">
        <Tabs tabBarGutter={0} animated={false} tabBarExtraContent={this.props.currentUser ? pageButton : null}>
          <Tabs.TabPane key="1" tab="微信">
            <div className="wechat-pane">
              <MessageList/>
              <SendMessage sendMsg={this.props.sendMsg} wsState={this.props.wsState}/>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="电话/短信">
            <div className="phone-panel">
              <CallPanel/>
              <div className="phone-panel__log">
                <RobotCallLog/>
                <AgentCallLog/>
                <ShortMessageLog/>
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="跟进">
            <FollowUp/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  workUsers: state.work.workUsers,
  currentUser: state.work.currentUser,
  usersSearch: state.work.usersSearch
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setCurrentUser: (value: any) => dispatch(actions.setCurrentUser(value)),
  setUsersSearch: (value: any) => dispatch(actions.setUsersSearch(value)),
  thunkWorkUsers: () => dispatch(actions.thunkWorkUsers()),
  asyncGetWechatMessages: (server: string, target: string) => dispatch(actions.asyncGetWechatMessages(server, target))
})
export default connect(mapStateToProps, mapDispatchToProps)(WorkCenterPanel)
