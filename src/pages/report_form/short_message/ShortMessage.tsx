import React, {FunctionComponent} from 'react'
import {Tabs} from 'antd'
import ShortMessageList from './ShortMessageList'
import ShortMessageReport from './ShortMessageReport'

const ShortMessage: FunctionComponent = () => {
  return (
    <div>
      <Tabs animated={false}>
        <Tabs.TabPane key="1" tab="短信记录">
          <ShortMessageList/>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="短信报表">
          <ShortMessageReport/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default ShortMessage
