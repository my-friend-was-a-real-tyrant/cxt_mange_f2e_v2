import React, {useState, useEffect, FunctionComponent} from 'react';
import {Tabs} from 'antd'
import ToBeDistributed from './ToBeDistributed'
import Allocated from './Allocated'
import TaskList from './TaskList'
import fetch from "../../../fetch/axios"

const PhoneTask: FunctionComponent = () => {
  const [serialData, setSerialData] = useState<Array<object>>([])

  // 获取数据批次
  const getSerialData = () => {
    const params = {
      limit_tasks: 1,
    }
    fetch.get(`/apiv1/otb/import/getImportSerialNoNamesFromTask`, {params}).then((res: any) => {
      if (res.code === 20000) {
        setSerialData(res.data || [])
      }
    })
  }

  useEffect(() => getSerialData(), [])

  return (
    <div>
      <Tabs animated={false}>
        <Tabs.TabPane tab="未分配任务" key="1">
          <ToBeDistributed serialData={serialData}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="已分配任务" key="2">
          <Allocated serialData={serialData}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="任务列表" key="3">
          <TaskList/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default PhoneTask
