import React, {FunctionComponent} from 'react';
import {Tabs} from 'antd'
import ToBeDistributed from './ToBeDistributed'
import Allocated from './Allocated'
import TaskList from './TaskList'

const PhoneTask: FunctionComponent = () => {
  return (
    <div>
      <Tabs animated={false}>
        <Tabs.TabPane tab="未分配任务" key="1">
          <ToBeDistributed/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="已分配任务" key="2">
          <Allocated/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="任务列表" key="3">
          <TaskList/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default PhoneTask
