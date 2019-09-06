import React, {FunctionComponent, useState} from 'react'
import {connect} from 'react-redux'
import Message from './Message'
import 'assets/styles/wechat.less'


interface IProps {
  wechtMessageInfo: any;
}

const MessageList: FunctionComponent<IProps> = (props) => {
  const {data} = props.wechtMessageInfo

  // 发送消息状态()
  const getMsgStatus = ({actionSubmitStatus, actionExecutionStatus}: { actionSubmitStatus: number; actionExecutionStatus: number }):string => {
    if (actionSubmitStatus === 1 && actionExecutionStatus === 1) {
      return '已发送'                                     // 已发送
    } else if (actionSubmitStatus === 0) {
      return '未发送'                                     // 未发送
    } else {
      return '发送中'                                     // 发送中
    }
  }

  const mapMessage = () => {
    return data.map((m: any) => {
      const isMe = parseInt(m.flow) === 0        // 0发送， 1接受
      const status = getMsgStatus(m)
      return <Message key={m.id}
                      type={m.type}
                      message={m.message}
                      status={status}
                      isMe={isMe}
                      time={m.timeModified}
                      cTime={m.timeCreate}/>
    })
  }
  return (
    <div id="message-list">
      {mapMessage()}
    </div>
  )
}
const mapStateToProps = (state: any) => ({
  wechtMessageInfo: state.work.wechtMessageInfo
})
export default connect(mapStateToProps)(MessageList)
