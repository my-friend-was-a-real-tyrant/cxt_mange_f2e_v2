import React, {useState, useEffect, FunctionComponent} from 'react'
import {Spin} from 'antd'
import {connect} from 'react-redux'
import fetch from 'fetch/axios'
import moment from 'moment'
import Player from "./Player"

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
        const time = moment(v.dail_time).format('YYYYMMDD');
        const dial = v.call_record_path ? v.call_record_path.split('-')[0].substr(-2) : ''
        const fileUrl = `/sound/${time}/${dial}/${v.call_record_path}.oga`
        return <div className="log-item robot" key={v.id || index}>
          <span className="border"/>
          <div className="time">{v.dail_time ? moment(v.dail_time).format('MM/DD HH:mm:ss') : ''}</div>
          {/*<div className="user">{v.contact ? v.contact : '--'}</div>*/}
          <div className="audio">
            <Player fileUrl={`/sound/${time}/${dial}/${v.call_record_path}.oga`}/>
          </div>
          <div className="duration">{v.call_time ? v.call_time : 0}s</div>
          <a href={fileUrl} download={fileUrl} className="download">
            <span className="icon"/>
            下载
          </a>
        </div>
      })}
    </div>
  </Spin>

}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser
})
export default connect(mapStateToProps)(RobotCallLog)
