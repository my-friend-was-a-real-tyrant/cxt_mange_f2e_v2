import React from 'react'
import {Tabs} from 'antd'

class WorkCenterPane extends React.Component {
  render() {
    return (
      <div className="work-center">
        <Tabs tabBarGutter={0} animated={false}>
          <Tabs.TabPane key="1" tab="微信">

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
