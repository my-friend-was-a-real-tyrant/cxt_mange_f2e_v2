import React, {useState, useEffect, FunctionComponent} from 'react'
import {connect} from 'react-redux'
import {Popover} from 'antd'
import moment from 'moment'
import fetch from 'fetch/axios'

interface IProps {
  currentUser: any;
}

const ShortMessageLog: FunctionComponent<IProps> = (props) => {
  const {currentUser} = props;
  const adminUser: any = localStorage.getItem('mjoys_user')
  const [MessageLog, setMessageLog] = useState<any>([])

  useEffect(() => {
    getLog()
  }, [currentUser])

  const getLog = () => {
    if (!currentUser || !currentUser.auto_add_aes_mobile) {
      setMessageLog([])
      return false
    }
    const params = {
      receiver: currentUser && currentUser.mobile,
      accountId: JSON.parse(adminUser).accountId,
    }
    fetch.get(`/apiv1/send/shortmsg/log`, {params}).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        setMessageLog(res.data)
      }
    })
  }

  return <div className="robot-call-log">
    <h5 className="title">
      <span className="icon icon-message"/>
      短信发送记录
    </h5>
    {MessageLog.map((v: any, index: number) => {
      return <div className="log-item message" key={v.id || index}>
        <span className="border"/>
        <div className="time">{v.timeOfSend ? moment(v.timeOfSend).format('MM/DD HH:mm:ss') : ''}</div>
        <Popover content={v.content}>
          <div className="content">
            {v.content}
          </div>
        </Popover>
        <div className="result">{v.result}</div>
      </div>
    })}
  </div>
}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser
})
export default connect(mapStateToProps)(ShortMessageLog)
