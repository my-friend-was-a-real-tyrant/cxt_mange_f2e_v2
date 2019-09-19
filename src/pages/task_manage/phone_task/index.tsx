import React, {useState, useEffect, FunctionComponent} from 'react';
import {Tabs} from 'antd'
import ToBeDistributed from './ToBeDistributed'
import Allocated from './Allocated'
import TaskList from './TaskList'
import fetch from "fetch/axios"

const PhoneTask: FunctionComponent = () => {
  const [serialData, setSerialData] = useState<Array<object>>([])
  const [key, setKey] = useState<string>('1')
  // 获取数据批次
  const getSerialData = (key: string) => {
    const params = {
      limit_tasks: key,
    }
    fetch.get(`/apiv1/otb/import/getImportSerialNoNamesFromTask`, {params}).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        setSerialData(res.data || [])
      }
    })
  }

  useEffect(() => getSerialData('1'), [])

  return (
    <div>
      <Tabs animated={false} onChange={(key: string) => {
        setKey(key)
        getSerialData(key)
      }}>
        <Tabs.TabPane tab="未分配任务" key="1">
          <ToBeDistributed serialData={serialData}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="已分配任务" key="2">
          <Allocated serialData={serialData} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="任务列表" key="3">
          <TaskList/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default PhoneTask
