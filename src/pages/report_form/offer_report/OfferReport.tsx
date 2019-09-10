import React, {FunctionComponent} from 'react'
import {Tabs} from 'antd'
import SeatOfferReport from './SeatOfferReport'
import ChannelOfferReport from './ChannelOfferReport'

const OfferReport: FunctionComponent = () => {
  return (
    <div>
      <Tabs animated={false}>
        <Tabs.TabPane key="1" tab="坐席报价报表">
          <SeatOfferReport/>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="渠道报价报表">
          <ChannelOfferReport/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default OfferReport
