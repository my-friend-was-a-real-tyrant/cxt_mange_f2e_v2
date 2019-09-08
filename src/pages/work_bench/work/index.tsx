import React from 'react'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
import WorkLeftPane from './WorkLeftPane'
import WorkRightPane from './WorkRightPane'
import WorkCenterPane from './WorkCenterPane'
import WorkFixed from 'components/work/WorkFixed'
import 'assets/styles/work.less'

interface IProps {
  workUsers: any;
  setWorkUsers: (value: any) => any;
  currentUser: any;
  wechtMessageInfo: any;
  setWechatMessageInfo: (value: any) => any;
  getWorkCount: () => void
}

interface IState {
  socket: any;
  wsState: string;
}

class Work extends React.Component<IProps, IState> {
  timer: any = null;
  state = {
    socket: null,
    wsState: 'init',
  }

  componentDidMount() {
    this.props.getWorkCount()
    this.createConnect()
    this.timer = setInterval(() => this.sendWsHeartBeat(), 30000)
  }

  // 创建webSocket通讯
  createConnect = () => {
    const webUrl = window.location.origin.replace('http', 'ws')
    const socket = new WebSocket(`${webUrl}/ws`)
    this.setState({socket})
    console.log(localStorage.getItem('access_token'))
    if (socket) {
      socket.onopen = () => {
        this.setState({wsState: 'ready'})
        socket.send(JSON.stringify({
          wxId: '',
          ws_event_type: 'wx_bind',
          token: localStorage.getItem('access_token'),
          userId: '',
        }))
        socket.send(JSON.stringify({
          type: 'wx_manual_notice',
          ws_event_type: 'notify_bind',
          token: localStorage.getItem('access_token'),
        }))
      }
    }

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      this.handleWechatMessage(data)
    }

    socket.onclose = (e) => {
      console.log('发生websocket关闭事件', e)
      this.setState({wsState: 'disconnected', socket: null,})
    }
  }

  // 发送websocket心跳包，因为60s内无数据，nginx会将连接关闭。
  sendWsHeartBeat = () => {
    const {wsState, socket} = this.state
    const socketAny: any = socket
    if (wsState === 'disconnected') {
      // 重新建立链接
      setTimeout(() => this.createConnect(), 1000)
      return
    }

    if (wsState === 'ready') {
      socketAny.send(JSON.stringify({ws_event_type: 'wx_ping'}))
    }
  }

  // ws 消息处理
  handleWechatMessage = (DATA: any) => {
    const {workUsers, setWorkUsers, wechtMessageInfo, currentUser, setWechatMessageInfo} = this.props;
    const {data} = workUsers
    const {data: messageList} = wechtMessageInfo
    switch (DATA.ws_event_type) {
      // 设置微信用户在线离线状态
      case 'client_status_push': {
        data.forEach((v: any) => {
          if (v.server_wx === DATA.serverAccount) {
            v.online = DATA.status
          }
        })
        setWorkUsers({...workUsers, data: [...data]})
        break
      }
      // 聊天内容推送
      case 'resp_wx_msg_log': {
        const messages = DATA.messages || []
        messages.forEach((m: any) => {
          console.log(currentUser, m)
          if (currentUser && currentUser.target_wx === m.targetAccount && currentUser.server_wx === m.serverAccount) {
            messageList.push(m)
            setWechatMessageInfo({...wechtMessageInfo, data: [...messageList]})
          }
        })
        break
      }
      // 消息发送状态变化通知
      case 'wx_status_push': {
        console.log('发送消息状态变化通知')
        const index = messageList.findIndex((d: any) => d.id === DATA.id)
        if (index > -1) {
          delete DATA.ws_event_type
          messageList[index] = {
            ...messageList[index],
            ...DATA,
          }
        }
        setWechatMessageInfo({...wechtMessageInfo, data: [...messageList]})
        break
      }
    }
  }

  // 发送微信消息
  sendWechatMsg = (value: any) => {
    const {currentUser} = this.props;
    const socket: any = this.state.socket
    if (socket) {
      socket.send(JSON.stringify({
          ws_event_type: 'send_wx_msg',
          message: value.message,
          cid: 'web_' + value.time,
          serverAccount: currentUser.server_wx,
          targetAccount: currentUser.target_wx,
          time: value.time,
          type: value.type,
        }),
      )
    }
  }


  render() {
    return (
      <div className="work">
        <WorkLeftPane/>
        <WorkRightPane/>
        <WorkCenterPane
          wsState={this.state.wsState}
          sendMsg={this.sendWechatMsg}/>
        <WorkFixed/>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  workUsers: state.work.workUsers,
  currentUser: state.work.currentUser,
  wechtMessageInfo: state.work.wechtMessageInfo,
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setWorkUsers: (value: any) => dispatch(actions.setWorkUsers(value)),
  setWechatMessageInfo: (value: any) => dispatch(actions.setWechatMessageInfo(value)),
  getWorkCount: () => dispatch(actions.getWorkCount())
})
export default connect(mapStateToProps, mapDispatchToProps)(Work)
