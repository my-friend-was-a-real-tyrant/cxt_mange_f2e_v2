import React from 'react'
import {Modal, Row, Col, Card, Statistic, message} from 'antd'
import moment from 'moment'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
import {connect} from 'react-redux'
import {checkPhone} from "utils/utils"
import debounce from 'lodash/debounce';
import fetch from 'fetch/axios'

interface IProps {
  workCount: any;
  getWorkCount: () => any;
}

let win: any = window
const numbers: Array<number | string> = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'
]

class WorkFixed extends React.Component<IProps> {
  state = {
    phone: '',
    workShow: false,
    phoneShow: false,
    callFlag: false,

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
    this.handleCall = debounce(this.handleCall, 400)
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

  onSaveTask = (mobile: number | string) => {
    const params = {
      mobile
    }
    return new Promise((resolve, reject) => {
      fetch.post(`/apiv1/otb/task/saveSelfAddTask`, null, {params}).then((res: any) => {
        if (res.code === 20000) {
          sessionStorage.setItem('task_id', res.data.id)
          resolve()
        }
      })
    })
  }

  handleCall = () => {
    const {phone} = this.state;
    const win: any = window
    if (sessionStorage.getItem('verto-call-flag') === '0') {
      message.info('没有可供使用的sip账号，请联系管理员配置')
      return false
    }
    if (!checkPhone(phone)) return message.error('请输入正确的手机号')
    if (!this.state.callFlag) {
      sessionStorage.setItem('task_id', '')
      this.onSaveTask(phone).then(() => {
        win.postMessage(`call~${phone}`, win.sipSDK || window.location.origin)
      })
    } else {
      win.postMessage(`hangup~${phone}`, win.sipSDK || window.location.origin)
    }
    this.setState({callFlag: !this.state.callFlag})
    this.setState({hour: 0, minute: 0, second: 0, millisecond: 0})
  }

  handleMessage = (event: any) => {
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

  render() {
    const {workShow, phoneShow, phone, callFlag, hour, minute, second, timerId} = this.state;
    const {todoDetail, todoPre} = this.props.workCount
    return (
      <div className="work-fixed">
        <div className="work-fixed__task" onClick={() => {
          this.setState({workShow: true})
          this.props.getWorkCount()
        }}>
          工作安排
        </div>
        <div className="work-fixed__phone" onClick={() => this.setState({phoneShow: true})}>
          电话拨号
        </div>

        <Modal title="我的工作安排"
               visible={workShow}
               onCancel={() => this.setState({workShow: false})}
               footer={null}
               width={650}
               className="work-info">
          <Row gutter={24}>
            <Col span={5}>
              <Card className="fixed-task__count" bordered={false}>
                <Statistic title="电话任务" value={todoDetail['phoneTaskCounter']}/>
              </Card>
            </Col>
            <Col span={5}>
              <Card className="fixed-task__today_call" bordered={false}>
                <Statistic title="今日预约" value={todoDetail['todayAppointCounter']}/>
              </Card>
            </Col>
            <Col span={5}>
              <Card className="fixed-task__today_count" bordered={false}>
                <Statistic title="今日跟进" value={todoDetail['todayFollowUpCounter']}/>
              </Card>
            </Col>
            <Col span={5}>
              <Card className="fixed-task__wait" bordered={false}>
                <Statistic title="未处理" value={todoDetail['untreatedCounter']}/>
              </Card>
            </Col>
            <Col span={4}>
              <Card className="fixed-task__today_add" bordered={false}>
                <Statistic title="今日新增" value={todoDetail['todayNewCounter']}/>
              </Card>
            </Col>
          </Row>
          <h5>未来一周待跟进：</h5>
          <Row gutter={24} className="week">
            {
              [1, 2, 3, 4, 5, 6, 7].map((v, i) => <Col span={3} key={i}>
                <Card bordered={false}>
                  <Statistic title={moment().add(v, 'days').format('MM/DD')} value={todoPre[v - 1].counter}/>
                </Card>
              </Col>)
            }
          </Row>
        </Modal>

        <Modal title="电话拨号"
               visible={phoneShow}
               onCancel={this.onClose}
               footer={null}
               width={350}
               className="call-phone-mask">
          <div className="call-phone">
            <input type="text" value={phone}
                   placeholder="请输入手机号"
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({phone: e.target.value})}/>
            {
              timerId ? <span className="time">
              {hour <= 9 ? '0' + hour : hour}:{minute <= 9 ? '0' + minute : minute}:{second <= 9 ? '0' + second : second}
            </span> : null
            }
          </div>
          <div className="numbers">
            {numbers.map((v: number | string) =>
              <span key={v} className="number" onClick={() => this.setState({phone: phone + v})}>{v}</span>)}
          </div>

          <div className="btn-wrap">
            <span className={`call-btn ${callFlag ? 'hangup' : 'call'}`} onClick={this.handleCall}> </span>
            <span className="backspace" onClick={() => this.setState({phone: phone.slice(0, -1)})}> </span>
          </div>
        </Modal>
      </div>
    )
  }


}

const mapStateToProps = (state: any) => ({
  workCount: state.work.workCount
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  getWorkCount: () => dispatch(actions.getWorkCount())
})

export default connect(mapStateToProps, mapDispatchToProps)(WorkFixed)
