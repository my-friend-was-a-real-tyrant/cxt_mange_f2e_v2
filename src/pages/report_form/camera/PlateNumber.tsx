import React, {useState, useEffect, FunctionComponent} from 'react'
import fetch from 'fetch/axios'
import BaseTableComponent from 'components/BaseTableComponent'

import {formatTime} from "utils/utils"
import service from "fetch/service"
import SearchForm from "./SearchForm";

const followType = [
  {title: '电话', type: 1},
  {title: '微信', type: 2},
  {title: '短信', type: 3},
]
const businessStatus = [
  {title: '沉默用户', type: 1},
  {title: '互动用户', type: 2},
  {title: '报价用户', type: 3},
  {title: '报价失败', type: 4},
  {title: '促成中', type: 5},
  {title: '成功出单', type: 6},
  {title: '出单失败', type: 7},
  {title: '无效用户', type: 8},
]
const PlateNumber: FunctionComponent = () => {
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState({page: 1, pageSize: 10})
  const [user, setUser] = useState<Array<object>>([])

  useEffect(() => {
    getList()
    service.getUser()
        .then((res: Array<object>) => setUser(res))
        .catch(() => setUser([]))
  }, [search])

  const getList = () => {
    const params = {
      ...search,
      accountId: localStorage.getItem('mjoys_account_id'),
      userId: localStorage.getItem('mjoys_user_id')
    }
    setLoading(true)
    fetch.get(`/apiv1/robot/rpt/followup/record`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setResult({data: res.data || [], total: res.count})
      }
    })
  }

  const onSearch = (values: any): void => {
    console.log(values)
    setSearch({
      ...search, ...values,
      page: 1,
      startTime: formatTime(values.time, 'YYYYMMDDHHmmss')[0],
      endTime: formatTime(values.time, 'YYYYMMDDHHmmss')[1],
      appointStartTime: formatTime(values.nextTime, 'YYYYMMDDHHmmss')[0],
      appointEndTime: formatTime(values.nextTime, 'YYYYMMDDHHmmss')[1],
    })
  }

  const handleTableChange = (pagiation: any, orderBy: string) => {
    setSearch({...search, page: pagiation.current, pageSize: pagiation.pageSize,})
  }

  const columns = [
    {title: '场地编号', dataIndex: 'seatUsername'},
    {title: '摄像头编号', dataIndex: 'license'},
    {title: '识别车牌', dataIndex: 'mobile'},
    {title: '图片', dataIndex: 'realname'},
    {title: '识别时间', dataIndex: 'wechatAccountId'},
    {title: '是否分配标价', dataIndex: 'timeOfFollowUp'},
    {title: '报价是否成功', dataIndex: 'followUpType', render: (status: number) => followType[status - 1].title}
  ]
  return (
      <div style={{padding: '0 20px'}}>
        <SearchForm onSearch={(values: any) => onSearch(values)} user={user}/>
        <BaseTableComponent
            loading={loading}
            columns={columns}
            current={search.page}
            onChange={handleTableChange}
            dataSource={result.data}
            total={result.total}/>
      </div>
  )
}

export default PlateNumber
