import React, {FunctionComponent} from 'react'
import {Tabs} from 'antd'
import OutboundList from './OutboundList'
import OutboundReport from './OutboundReport'

const Outbound: FunctionComponent = () => {
  return (
    <div>
      <Tabs animated={false}>
        <Tabs.TabPane key="1" tab="外呼记录">
          <OutboundList/>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="外呼报表">
          <OutboundReport/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default Outbound
