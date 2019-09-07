import React from 'react'
import {Tabs} from 'antd'
import UserInfo from 'components/work/UserInfo'
import CarInfo from 'components/work/CarInfo'
import ComputePrice from 'components/work/ComputePrice'
class WorkRightPane extends React.Component {
  render() {
    return (
      <div className="work-right">
        <Tabs tabBarGutter={0} animated={false}>
          <Tabs.TabPane key="1" tab="用户信息">
            <UserInfo/>
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="车辆信息">
            <CarInfo/>
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="快速算价">
            <ComputePrice/>
          </Tabs.TabPane>
          <Tabs.TabPane key="4" tab="历史报价">

          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

export default WorkRightPane
