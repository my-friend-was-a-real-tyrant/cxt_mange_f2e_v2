import React, {useState, useEffect, FunctionComponent} from 'react'
import fetch from 'fetch/axios'
import BaseTableComponent from 'components/BaseTableComponent'
import {formatTime} from "utils/utils"
import SearchForm from './SearchForm'

const OutboundList: FunctionComponent = () => {
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState({page: 1, pageSize: 10})

  useEffect(() => {
    getList()
  }, [search])

  const getList = (): void => {
    const params = {
      ...search,
      accountId: localStorage.getItem('mjoys_account_id'),
    }
    setLoading(true)
    fetch.get(`/apiv1/robot/rpt/outbound/record`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setResult({data: res.data || [], total: res.count})
      }
    })
  }

  const onSearch = (values: any): void => {
    setSearch({
      ...search, ...values,
      page: 1,
      startTime: formatTime(values.time, 'YYYYMMDDHHmmss')[0],
      endTime: formatTime(values.time, 'YYYYMMDDHHmmss')[1]
    })
  }

  const handleTableChange = (pagiation: any, orderBy: string) => {
    setSearch({...search, page: pagiation.current, pageSize: pagiation.pageSize,})
  }

  const columns = [
    {title: '坐席', dataIndex: 'seatUsername'},
    {title: '数据批次', dataIndex: 'dataBatchName'},
    {title: '电话', dataIndex: 'mobile'},
    {title: '车牌', dataIndex: 'licenseNumber'},
    {title: '主叫线路', dataIndex: 'callerLine'},
    {title: '主叫号码', dataIndex: 'caller'},
    {title: '呼叫时间', dataIndex: 'timeOfOutbound'},
    {title: '响铃时长（s）', dataIndex: 'ringTime'},
    {title: '通话时长（s）', dataIndex: 'duration'},
    {title: '录音'}
  ]
  return (
    <div>
      <SearchForm onSearch={onSearch}/>
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

export default OutboundList
