import React, {useState, useEffect, FunctionComponent} from 'react'
import {connect} from 'react-redux'
import {Popover, Spin} from 'antd'
import moment from 'moment'
import fetch from 'fetch/axios'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'

interface IProps {
  currentUser: any;
  decryptMobile: (phone: string) => Promise<string>;
}

const ShortMessageLog: FunctionComponent<IProps> = (props) => {
  const {currentUser, decryptMobile} = props;
  const adminUser: any = localStorage.getItem('mjoys_user')
  const [MessageLog, setMessageLog] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    getLog()
  }, [currentUser])

  const getLog = async () => {
    if (!currentUser || !currentUser.auto_add_aes_mobile) {
      setMessageLog([])
      return false
    }
    const phone = await decryptMobile(currentUser.auto_add_aes_mobile)
    const params = {
      receiver: phone,
      accountId: JSON.parse(adminUser).accountId,
    }
    setLoading(true)
    await fetch.get(`/apiv1/send/shortmsg/log`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setMessageLog(res.data)
      }
    })
  }

  return <Spin spinning={loading}>
    <div className="robot-call-log">
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
  </Spin>
}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  decryptMobile: (phone: string) => dispatch(actions.decryptMobile(phone))
})
export default connect(mapStateToProps,mapDispatchToProps)(ShortMessageLog)
