import React from 'react'
import {Tabs} from 'antd'
import UserInfo from 'components/work/UserInfo'
import CarInfo from 'components/work/CarInfo'
import ComputePrice from 'components/work/ComputePrice'
import CarOffer from 'components/work/CarOffer'

class WorkRightPanel extends React.Component {
  state = {
    key: '1'
  }

  onChange = (key: string) => {
    this.setState({key})
  }

  render() {
    return (
      <div className="work-right">
        <Tabs tabBarGutter={0} animated={false}
              onChange={this.onChange}>
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
            <CarOffer key={this.state.key}/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

export default WorkRightPanel
