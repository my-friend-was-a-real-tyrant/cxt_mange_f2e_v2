import React, {useState, useEffect, FunctionComponent} from 'react'
import {Spin} from 'antd'
import {connect} from 'react-redux'
import fetch from 'fetch/axios'

interface IProps {
  currentUser: any;
}

const RobotCallLog: FunctionComponent<IProps> = (props) => {
  const {currentUser} = props;
  const [loading, setLoading] = useState<boolean>(false)
  const [callLog, setCallLog] = useState<any>([])

  useEffect(() => {
    getLog()
  }, [currentUser])

  const getLog = () => {
    if (!currentUser || !currentUser.auto_add_aes_mobile) {
      setCallLog([])
      return false
    }
    const params = {
      phone: currentUser && currentUser.auto_add_aes_mobile,
      offset: 1,
      limit: 10,
    }
    setLoading(true)
    fetch.get(`/apiv1/robot/report/findCallLogList`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setCallLog(res.data)
      }
    })
  }

  return <Spin spinning={loading}>
    <div className="robot-call-log">
      <h5 className="title">
        <span className="icon icon-robot"/>
        机器人通话记录
      </h5>
      {callLog.map((v: any, index: number) => {
        return <div className="log-item robot" key={v.id || index}>
          <span className="border"></span>
          <div className="time">06/31 12/:13</div>
          <div className="user">四川车险</div>
          <div className="audio">四川车险</div>
          <div className="duration">四川车险</div>
          <div className="download">四川车险</div>
        </div>
      })}
    </div>
  </Spin>

}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser
})
export default connect(mapStateToProps)(RobotCallLog)
