import React, {FunctionComponent} from 'react'
import {Tabs} from 'antd'
import WechatReportList from './WechatReportList'
import WechatAddList from './WechatAddList'
import WechatBefore from './WechatBefore'

const WechatReport: FunctionComponent = () => {
  return (
    <div>
      <Tabs animated={false}>
        <Tabs.TabPane key="2" tab="好友报表">
          <WechatReportList/>
        </Tabs.TabPane>
        <Tabs.TabPane key="1" tab="微信前转化报表">
          <WechatBefore/>
        </Tabs.TabPane>
        <Tabs.TabPane key="3" tab="好友添加报表">
          <WechatAddList/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default WechatReport
