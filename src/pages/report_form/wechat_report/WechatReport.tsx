import React, {FunctionComponent} from 'react'
import {Tabs} from 'antd'
import FollowUpList from './FollowUpList'
import WechatReportList from './WechatReportList'
import WechatAddList from './WechatAddList'
const WechatReport: FunctionComponent = () => {
  return (
    <div >
      <Tabs animated={false}>
        {/*<Tabs.TabPane key="1" tab="跟进记录">*/}
        {/*  <FollowUpList/>*/}
        {/*</Tabs.TabPane>*/}
        <Tabs.TabPane key="2" tab="好友报表">
          <WechatReportList/>
        </Tabs.TabPane>
        <Tabs.TabPane key="3" tab="好友添加报表">
          <WechatAddList/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default WechatReport
