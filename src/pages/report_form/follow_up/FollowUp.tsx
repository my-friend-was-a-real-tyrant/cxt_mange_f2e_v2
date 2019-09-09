import React, {FunctionComponent} from 'react'
import {Tabs} from 'antd'
import FollowUpList from './FollowUpList'
import FollowReport from './FollowReport'

const FollowUp: FunctionComponent = () => {
  return (
    <div>
      <Tabs>
        <Tabs.TabPane key="1" tab="跟进记录">
          <FollowUpList/>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="跟进报表">
          <FollowReport/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default FollowUp
