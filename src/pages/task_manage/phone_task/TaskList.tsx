import React, {FunctionComponent, useState, useEffect} from 'react';
import {Table} from 'antd'
import fetch from 'fetch/axios';

const TaskList: FunctionComponent = () => {

  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => getReport(), [])

  const getReport = () => {
    setLoading(true)
    fetch.get(`/apiv1/otb/taskAllot/findTaskAllotStatus`).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setResult({data: res.data, total: res.count})
      }
    })
  }


  const columns = [
    {title: '坐席', dataIndex: 'user',},
    {title: '坐席姓名', dataIndex: 'contact',},
    {title: '分配任务数', dataIndex: 'taskTotal',},
    {title: '剩余任务数', dataIndex: 'notFishCount',},
  ]
  return <div style={{padding: '0 10px 10px'}}>
    <Table columns={columns}
           dataSource={result.data}
           rowKey="userId"
           loading={loading}
           size="middle"
           bordered
           pagination={false}/>
  </div>
}

export default TaskList
