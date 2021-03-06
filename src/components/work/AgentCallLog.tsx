import React, {useState, useEffect, FunctionComponent} from 'react'
import {Spin} from 'antd'
import {connect} from 'react-redux'
import moment from 'moment'
import fetch from 'fetch/axios'
import Player from 'components/work/Player.js'

interface IProps {
  currentUser: any;
}

const AgentCallLog: FunctionComponent<IProps> = (props) => {
  const {currentUser} = props;
  const [callLog, setCallLog] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    getLog()
  }, [currentUser])


  const getLog = () => {
    if (!currentUser || !currentUser.auto_add_aes_mobile) {
      setCallLog([])
      return false
    }
    const params = {
      mobile: currentUser && currentUser.auto_add_aes_mobile,
      starttime: '20100102',
      endtime: moment().format('YYYYMMDD'),
      marketingresult: -1,
    }
    setLoading(true)
    fetch.get(`/apiv1/otb/report/findCallStatistics`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setCallLog(res.data)
      }
    })
  }

  return <Spin spinning={loading}>
    <div className="robot-call-log">
      <h5 className="title">
        <span className="icon icon-agent"/>
        人工坐席通话记录
      </h5>
      {callLog.map((v: any, index: number) => {
        const time = moment(v.time_create).format('YYYYMMDD');
        const dial = v.sound_path ? v.sound_path.split('-')[0].substr(-2) : ''
        const fileUrl = `/sound/${time}/${dial}/${v.sound_path}.oga`
        return <div className="log-item agent" key={v.id || index}>
          <span className="border"/>
          <div className="time">{v.call_time ? moment(v.call_time).format('MM/DD HH:mm:ss') : ''}</div>
          <div className="user">{v.contact ? v.contact : '--'}</div>
          <div className="audio">
            <Player fileUrl={fileUrl}/>
          </div>
          <div className="duration">{v.duration ? v.duration : 0}s</div>
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
export default connect(mapStateToProps)(AgentCallLog)
