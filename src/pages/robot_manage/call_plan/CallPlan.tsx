import React, {useState, FunctionComponent, useEffect} from 'react'
import SearchForm from './SearchForm'
import BaseTableComponent from 'components/BaseTableComponent'
import fetch from 'fetch/axios'

const CallPlan: FunctionComponent = () => {
  const [result, setResult] = useState({data: [], total: 0})

  useEffect(() => getList(), [])

  const getList = () => {
    fetch.get(`/apiv1/phonecallplan/dgj/list`).then((res: any) => {
      if (res.code === 20000) {
        setResult({data: res.data || [], total: res.count || 0})
      }
    })
  }

  const columns = [
    {title: '优先级', dataIndex: 'priority', sorter: true, render: (priority: number) => priority === 1 ? '高' : '低'},
    {title: '展示名称', dataIndex: 'show_name', sorter: true},
    {title: '电话号码', dataIndex: 'phone', sorter: true},
    {title: '计划状态', dataIndex: 'plan_status', sorter: true},
    {title: '号码状态', dataIndex: 'phone_status', sorter: true},
    {title: '上传时间', dataIndex: 'upload_time', sorter: true},
    {title: '业务', dataIndex: 'business_name', sorter: true},
  ]
  return (
    <div style={{padding: '10px'}}>
      <SearchForm/>
      <BaseTableComponent columns={columns} dataSource={result.data}/>
    </div>
  )
}

export default CallPlan
