import React, {FunctionComponent} from 'react'
import {Tabs} from 'antd'
import AllFee from './AllFee'
import RentFee from './RentFee'
import SpeakFee from './SpeakFee'
import CallFee from './CallFee'

const RobotFee: FunctionComponent = () => {
  return (
    <div>
      <Tabs animated={false}>
        <Tabs.TabPane key="1" tab="总费用统计">
          <AllFee/>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="租用费用">
          <RentFee/>
        </Tabs.TabPane>
        <Tabs.TabPane key="3" tab="话术费用">
          <SpeakFee/>
        </Tabs.TabPane>
        <Tabs.TabPane key="4" tab="通讯费用">
          <CallFee/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default RobotFee
