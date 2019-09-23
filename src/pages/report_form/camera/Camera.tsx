import React, {FunctionComponent} from 'react'
import {Tabs} from 'antd'
import PlateNumber from './PlateNumber'
// import WechatAddList from './WechatAddList'
import StatisticalForm from './StatisticalForm'

const Camera: FunctionComponent = () => {
  return (
    <div>
      <Tabs animated={false}>
        <Tabs.TabPane key="2" tab="识别车牌">
          <PlateNumber/>
        </Tabs.TabPane>
        <Tabs.TabPane key="1" tab="统计报表">
          <StatisticalForm/>
        </Tabs.TabPane>
        {/*<Tabs.TabPane key="3" tab="好友添加报表">*/}
          {/*<WechatAddList/>*/}
        {/*</Tabs.TabPane>*/}
      </Tabs>
    </div>
  )
}

export default Camera
