import React from 'react'
import {connect} from 'react-redux'
import Message from './Message'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
import {Empty} from 'antd'
import 'assets/styles/wechat.less'


interface IProps {
  wechtMessageInfo: any;
  asyncGetWechatMessages: () => any;
  currentUser:any;
}

class MessageList extends React.Component<IProps> {


  componentDidUpdate() {
    const {finished, offset} = this.props.wechtMessageInfo

    setTimeout(() => {
      const wrapper: any = document.querySelector('#message-list')
      if (finished || offset <= 2) {
        wrapper.scrollTop = wrapper.scrollHeight
      }
    }, 50)
  }

  loadMore = () => {
    this.props.asyncGetWechatMessages()
  }


  render() {
const {currentUser} = this.props;
    const {data, finished} = this.props.wechtMessageInfo

    // 发送消息状态()
    const getMsgStatus = ({actionSubmitStatus, actionExecutionStatus}: { actionSubmitStatus: number; actionExecutionStatus: number }): string => {
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
        const fhead_picture = currentUser && currentUser.fhead_picture;
        const shead_picture = currentUser && currentUser.shead_picture;
        const isMe = parseInt(m.flow) === 0        // 0发送， 1接受
        const status = getMsgStatus(m)
        return <Message key={m.id}
                        type={m.type}
                        message={m.message}
                        status={status}
                        shead_picture={shead_picture}
                        fhead_picture={fhead_picture}
                        isMe={isMe}
                        time={m.timeModified}
                        cTime={m.timeCreate}/>
      })
    }
    const loadMore = !finished ? <span className="loadmore-btn" onClick={() => this.loadMore()}>查看更多</span> :
      <span className="loadmore-btn">没有更多了...</span>
    return (
      <div id="message-list">
        {data.length ? <>
          {loadMore}
          {mapMessage()}
        </> : <Empty image={`https://cxt.mjoys.com/mjoys_cxt_api/1019/2019/9/10/2019091019563595t5cmW.png`}/>}
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  wechtMessageInfo: state.work.wechtMessageInfo,
  currentUser:state.work.currentUser
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  asyncGetWechatMessages: () => dispatch(actions.asyncGetWechatMessages())
})
export default connect(mapStateToProps, mapDispatchToProps)(MessageList)
