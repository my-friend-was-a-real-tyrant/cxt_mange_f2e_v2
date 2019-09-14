import React from 'react'
import {Modal, Row, Col, Card, Statistic} from 'antd'
import moment from 'moment'
import {connect} from 'react-redux'

interface IProps {
  workCount: any;
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
  }

  componentDidMount() {
    if (window.addEventListener) {
      window.addEventListener('message', this.handleMessage, false)
    }
  }


  handleCall = () => {
    const parentW:any = window
    parentW.postMessage('call~' + '17606531812', win.sipSDK || window.location.origin)
  }

  handleMessage = (event: any) => {
    const pmsgOrigin = win.sipSDK || window.location.origin
    // const sipUrl = pmsgOrigin + '/sip'
    // const mjoysFs: any = document.getElementById('mjoysFs') as HTMLElement;
    // const iframeWindow = mjoysFs.contentWindow
    event = event || window.event
    if (event.origin != pmsgOrigin) return
    const msgStr = event.data + ''
    const __act = msgStr.split('~')[0]
    const __str = msgStr.split('~')[1]
    // if (__act === 'calldisplayuuid') {
    //   this.setState({
    //     // buttonText: '挂断',
    //     timerId: setInterval(this.timer, 50)
    //   })
    // } else if (__act === 'hangup') {
    //   clearInterval(this.state.timerId)
    //   this.setState({ buttonText: '拨打', hour: 0, minute: 0, second: 0, millisecond: 0, timerId: 0 })
    // }
  }

  render() {
    const {workShow, phoneShow, phone} = this.state;
    const {workCount} = this.props
    return (
      <div className="work-fixed">
        <div className="work-fixed__task" onClick={() => this.setState({workShow: true})}>
          工作安排
        </div>
        <div className="work-fixed__phone" onClick={() => this.setState({phoneShow: true})}>
          电话拨号
        </div>

        <Modal title="我的工作安排"
               visible={workShow}
               onCancel={() => this.setState({workShow: false})}
               footer={null}
               width={600}
               className="work-info">
          <Row gutter={24}>
            <Col span={5}>
              <Card className="fixed-task__count" bordered={false}>
                <Statistic title="总电话任务" value={workCount['count']}/>
              </Card>
            </Col>
            <Col span={5}>
              <Card className="fixed-task__today_call" bordered={false}>
                <Statistic title="今日待跟进" value={workCount['today_call']}/>
              </Card>
            </Col>
            <Col span={5}>
              <Card className="fixed-task__today_count" bordered={false}>
                <Statistic title="今日已跟进" value={workCount['today_count']}/>
              </Card>
            </Col>
            <Col span={5}>
              <Card className="fixed-task__wait" bordered={false}>
                <Statistic title="待呼叫" value={workCount['wait']}/>
              </Card>
            </Col>
            <Col span={4}>
              <Card className="fixed-task__today_add" bordered={false}>
                <Statistic title="今日新增" value={workCount['today_add']}/>
              </Card>
            </Col>
          </Row>
          <h5>未来一周待跟进：</h5>
          <Row gutter={24} className="week">
            {
              [1, 2, 3, 4, 5, 6].map((v, i) => <Col span={4} key={i}>
                <Card bordered={false}>
                  <Statistic title={moment().add(v, 'days').format('MM/DD')} value={workCount[`today_call_${v}`]}/>
                </Card>
              </Col>)
            }
          </Row>
        </Modal>

        <Modal title="电话拨号"
               visible={phoneShow}
               onCancel={() => this.setState({phoneShow: false})}
               footer={null}
               width={350}
               className="call-phone-mask">
          <div className="call-phone">
            <input type="text" value={phone}
                   placeholder="请输入手机号"
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({phone: e.target.value})}/>
            <span className="time">00:00:00</span>
          </div>
          <div className="numbers">
            {numbers.map((v: number | string) =>
              <span key={v} className="number" onClick={() => this.setState({phone: phone + v})}>{v}</span>)}
          </div>

          <div className="btn-wrap">
            <span className="call-btn" onClick={this.handleCall}> </span>
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
export default connect(mapStateToProps)(WorkFixed)
