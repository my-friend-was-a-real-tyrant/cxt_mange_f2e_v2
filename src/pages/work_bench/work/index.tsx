import React from 'react'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
import WorkLeftPane from './WorkLeftPane'
import WorkRightPane from './WorkRightPane'
import WorkCenterPane from './WorkCenterPane'
import 'assets/styles/work.less'

interface IProps {
  workUsers: any;
  setWorkUsers: (value: any) => any;
  currentUser: any;
}

interface IState {
  socket: any;
  wsState: string;
}

class Work extends React.Component<IProps, IState> {
  state = {
    socket: null,
    wsState: 'init',
  }

  componentDidMount() {
    this.createConnect()
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

  handleWechatMessage = (DATA: any) => {
    const {workUsers, setWorkUsers} = this.props;
    const {data} = workUsers
    switch (data.ws_event_type) {
      // 设置微信用户在线离线状态
      case 'client_status_push': {
        data.forEach((v: any) => {
          v.online = DATA.status
        })
        setWorkUsers({...workUsers, data: [...data]})
        break
      }
      case 'resp_wx_msg_log': {
        const messages = data.messages || []
        console.log(messages)
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
        <WorkCenterPane wsState={this.state.wsState}
                        sendMsg={this.sendWechatMsg}/>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  workUsers: state.work.workUsers,
  currentUser: state.work.currentUser
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setWorkUsers: (value: any) => dispatch(actions.setWorkUsers(value))
})
export default connect(mapStateToProps, mapDispatchToProps)(Work)
