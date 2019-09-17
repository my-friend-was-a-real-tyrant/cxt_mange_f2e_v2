import React from 'react'
import {Form,  message} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
import {checkPhone} from "utils/utils"


interface IProps extends FormComponentProps {
  currentUser: any;
  sendShow: boolean;
  decryptMobile: (phone: string) => Promise<string>;
  setSendShow: (flag: boolean) => any
}

class CallPanel extends React.Component<IProps> {
  state = {
    callFlag: false,

    phone: '',

    hour: 0,
    minute: 0,
    second: 0,
    timerId: 0,
    millisecond: 0,

  }

  componentDidMount() {
    if (window.addEventListener) {
      window.addEventListener('message', this.handleMessage, false)
    }
  }

  timer = () => {
    const {millisecond, hour, minute, second} = this.state;
    this.setState({millisecond: millisecond + 50})
    if (millisecond >= 1000) {
      this.setState({millisecond: 0, second: second + 1})
    }
    if (second >= 60) {
      this.setState({second: 0, minute: minute + 1})
    }

    if (minute >= 60) {
      this.setState({minute: 0, hour: minute + 1})
    }
  }


  handleCall = async () => {
    const {decryptMobile, currentUser} = this.props;
    const phone = await decryptMobile(currentUser.auto_add_aes_mobile)
    console.log(phone, checkPhone(phone))
    if (!checkPhone(phone)) return message.error('请输入正确的手机号')
    const parentW: any = window
    parentW.postMessage(`call~${phone}`, parentW.sipSDK || window.location.origin)
    this.setState({callFlag: true})
    this.setState({hour: 0, minute: 0, second: 0, millisecond: 0})
  }

  handleMessage = (event: any) => {
    const win: any = window;
    const pmsgOrigin = win.sipSDK || window.location.origin
    event = event || window.event
    if (event.origin != pmsgOrigin) return
    const msgStr = event.data + ''
    const __act = msgStr.split('~')[0]
    const __str = msgStr.split('~')[1]
    if (__act === 'calldisplayuuid') {
      message.info('电话接通了')
      this.setState({
        timerId: setInterval(this.timer, 50)
      })
    } else if (__act === 'hangup') {
      message.info('电话挂断')
      clearInterval(this.state.timerId)
      this.setState({hour: 0, minute: 0, second: 0, millisecond: 0, timerId: 0, callFlag: false})
    }
  }
  onClose = () => {
    clearInterval(this.state.timerId)
    this.setState({timerId: 0, phoneShow: false})
  }

  componentWillUnmount() {
    this.onClose()
  }

  handleTableChange = () => {

  }


  render() {
    const {currentUser, sendShow} = this.props
    const { callFlag} = this.state

    return (
      <div className="call-panel">
        <div className="user-info">
          <div className="avatar"></div>
          <div className="user">
            <span className="username">{currentUser ? currentUser.name : '暂无选中用户'}</span>
            <span className="mobile">{currentUser ? currentUser.mobile : '暂无手机号'}</span>
          </div>
        </div>

        <div className="call-message">

          <div className={`call ${callFlag ? 'active' : ''}`} onClick={() => {
            if (!currentUser) return message.error('请先选中操作用户')
            this.handleCall()
          }}>
            <div className={`icon  icon-call`}>

            </div>
            <span className="content">
              {callFlag ? '挂断' : '拨打'}
            </span>
          </div>

          <div className={`message ${sendShow ? 'active' : ''}`}
               onClick={() => {
                 if (!currentUser) return message.error('请先选中操作用户')
                 this.props.setSendShow(true)
               }}>
            <div className={`icon icon-short-message`}>

            </div>
            <span className="content">
               短信
            </span>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser,
  sendShow: state.work.sendShow
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setSendShow: (flag: boolean) => dispatch(actions.setSendShow(flag)),
  decryptMobile: (phone: string) => dispatch(actions.decryptMobile(phone))
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CallPanel))
