import React, {useState, useEffect, FunctionComponent} from 'react'
import fetch from 'fetch/axios'
import BaseTableComponent from 'components/BaseTableComponent'
import {formatTime} from "utils/utils"
import SearchForm from './SearchForm'

const ShortMessageList: FunctionComponent = () => {
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
    fetch.get(`/apiv1/robot/rpt/shortmsg/record`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setResult({data: res.data || [], total: res.count})
      }
    })
  }

  const onSearch = (values: any): void => {
    setSearch({
      ...search, ...values,
      startTime: formatTime(values.time, 'YYYYMMDDHHmmss')[0],
      endTime: formatTime(values.time, 'YYYYMMDDHHmmss')[1]
    })
  }

  const handleTableChange = (pagiation: any, orderBy: string) => {
    setSearch({...search, page: pagiation.current, pageSize: pagiation.pageSize,})
  }

  const columns = [
    // {title: '号码', dataIndex: 'seatUsername'},
    {title: '姓名', dataIndex: 'realname'},
    {title: '坐席', dataIndex: 'seatUsername'},
    {title: '车牌', dataIndex: 'licenseNumber'},
    {title: '发送日期', dataIndex: 'timeOfSend'},
    {title: '发送状态', dataIndex: 'sendResult'},
    {title: '短信内容', dataIndex: 'content'}
  ]
  return (
    <div>
      <SearchForm onSearch={onSearch}/>
      <BaseTableComponent
        loading={loading}
        columns={columns}
        onChange={handleTableChange}
        dataSource={result.data}
        total={result.total}/>
    </div>
  )
}

export default ShortMessageList
