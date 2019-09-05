import React from 'react'
import {Tabs, Button} from 'antd'
import MessageList from "components/work/MessageList"
import SendMessage from "components/work/SendMessage"

interface Iprops {
  wsState:string;
  sendMsg: (value: any) => any
}

class WorkCenterPane extends React.Component<Iprops> {
  render() {
    const pageButton = <div className="page-button">
      <Button type="primary" className="first">上一条</Button>
      <Button type="primary">下一条</Button>
    </div>
    return (
      <div className="work-center">
        <Tabs tabBarGutter={0} animated={false} tabBarExtraContent={pageButton}>
          <Tabs.TabPane key="1" tab="微信">
            <div className="wechat-pane">
              <MessageList />
              <SendMessage sendMsg={this.props.sendMsg} wsState={this.props.wsState}/>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="电话/短信">

          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="跟进">

          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

export default WorkCenterPane
