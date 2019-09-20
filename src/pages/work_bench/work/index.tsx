import React from 'react'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
import WorkLeftPane from './WorkLeftPanel'
import WorkRightPanel from './WorkRightPanel'
import WorkCenterPane from './WorkCenterPanel'
import WorkFixed from 'components/work/WorkFixed'
import SendShortMessage from 'components/work/SendShortMessage'
import Verto from 'components/Verto.jsx'
import fetch from 'fetch/axios'
import 'assets/styles/work.less'

interface IProps {
  workUsers: any;
  setWorkUsers: (value: any) => any;
  currentUser: any;
  wechtMessageInfo: any;
  setWechatMessageInfo: (value: any) => any;
  getWorkCount: () => void;
  setSocket: (value: any) => any;
  socket: any;
}

interface IState {
  wsState: string;
}

class Work extends React.Component<IProps, IState> {
  timer: any = null;
  state = {
    wsState: 'init',
  }

  componentDidMount() {
    this.props.setWorkUsers({data: [], total: 0})
    this.props.getWorkCount()
    if (!this.props.socket) {
      this.createConnect()
    } else {
      this.setState({wsState: 'ready'})
    }
    this.timer = setInterval(() => this.sendWsHeartBeat(), 30000)
  }

  // 创建webSocket通讯
  createConnect = () => {
    const webUrl = window.location.origin.replace('http', 'ws')
    const socket = new WebSocket(`${webUrl}/ws`)
    this.props.setSocket(socket)
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
      this.props.setSocket(null)
      this.setState({wsState: 'disconnected'})
    }
  }

  // 发送websocket心跳包，因为60s内无数据，nginx会将连接关闭。
  sendWsHeartBeat = () => {
    const {wsState} = this.state
    const socketAny: any = this.props.socket
    if (wsState === 'disconnected') {
      // 重新建立链接
      setTimeout(() => this.createConnect(), 1000)
      return
    }

    if (wsState === 'ready' && socketAny) {
      socketAny.send(JSON.stringify({ws_event_type: 'wx_ping'}))
    }
  }
  getFirend = (server_wx: string, target_wx: string) => {
    return new Promise((resolve, reject) => {
      const params = {
        server_wx,
        target_wx,
      }
      fetch.get(`/apiv1/user-uni-data/list`, {params}).then((res: any) => {
        if (res.code === 20000) {
          resolve(res.data || [])
        }
      })
    })
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
        const audio: any = document.getElementById('messageAudio');
        if (messages.length > 0 && messages[0].flow === 1) {
          audio.play();
        }
        messages.forEach((m: any) => {
          console.log(currentUser, m)
          if (currentUser && currentUser.target_wx === m.targetAccount && currentUser.server_wx === m.serverAccount) {
            messageList.push(m)
            setWechatMessageInfo({...wechtMessageInfo, data: [...messageList]})
          }

          const mUser = data.findIndex((v: any) => `${v.server_wx}_${v.target_wx}` === `${m.serverAccount}_${m.targetAccount}`)
          if (mUser > -1) {
            let unread;
            if (currentUser && currentUser.target_wx === m.targetAccount && currentUser.server_wx === m.serverAccount) {
              unread = 0;
            } else {
              unread = m.flow === 1 ? 1 : 0
            }
            data[mUser] = {...data[mUser], recent_time: m.timeCreate, unread};
            setWorkUsers({...workUsers, data: [...data]})
          } else {
            // TODO 获取好友来添加到列表中
            this.getFirend(m.serverAccount, m.targetAccount).then((res: any) => {
              setWorkUsers({...workUsers, data: [...res, ...data]})
            })
          }
          console.log(mUser)
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
    const socket: any = this.props.socket
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


  // componentWillUnmount() {
  //   this.setState({
  //     socket: null
  //   })
  // }


  render() {
    return (
      <div className="work">
        <WorkLeftPane/>
        <WorkRightPanel/>
        <WorkCenterPane
          wsState={this.state.wsState}
          sendMsg={this.sendWechatMsg}/>
        <WorkFixed/>
        <Verto/>
        <SendShortMessage/>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  workUsers: state.work.workUsers,
  currentUser: state.work.currentUser,
  wechtMessageInfo: state.work.wechtMessageInfo,
  socket: state.work.socket,
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setWorkUsers: (value: any) => dispatch(actions.setWorkUsers(value)),
  setWechatMessageInfo: (value: any) => dispatch(actions.setWechatMessageInfo(value)),
  getWorkCount: () => dispatch(actions.getWorkCount()),
  setSocket: (value: any) => dispatch(actions.setSocket(value))
})
export default connect(mapStateToProps, mapDispatchToProps)(Work)
