import React, {useState, useEffect, FunctionComponent} from 'react'
import {DatePicker, Button, Form} from 'antd'
import fetch from 'fetch/axios'
import moment from 'moment'
import BaseTableComponent from 'components/BaseTableComponent'

const ChannelOfferReport: FunctionComponent = () => {
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [time, setTime] = useState({
    startTime: moment().add(-1, 'week').startOf('week').format('YYYYMMDDHHmmss'),
    endTime: moment().clone().set({hour: 23, minute: 59, second: 59, millisecond: 59}).format('YYYYMMDDHHmmss'),
  })
  const [search, setSearch] = useState({page: 1, pageSize: 10})

  useEffect(() => {
    getReport()
  }, [search])


  // 获取报表数据
  const getReport = () => {
    const params = {
      ...time,
      ...search,
      accountId: localStorage.getItem('mjoys_account_id'),
    }
    setLoading(true)
    fetch.get(`/apiv1/robot/rpt/insurance/offer/report/date?`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        const data = res.data || []
        setResult({data: data, total: res.count})
      }
    })
  }

  const handleTableChange = (pagiation: any, orderBy: string) => {
    setSearch({...search, page: pagiation.current, pageSize: pagiation.pageSize})
  }

  const columns = [
    {title: '日期', dataIndex: 'recordTime'},
    {title: '平安', dataIndex: 'pinganCounter'},
    {title: '人保', dataIndex: 'renbaoCounter'},
    {title: '太平洋', dataIndex: 'taipingyangCounter'},
  ]

  return (
    <div style={{padding:'0 20px'}}>
      <Form layout="inline">
        <Form.Item label="日期">
          <DatePicker.RangePicker
            defaultValue={
              [
                moment().add(-1, 'week').startOf('week'),
                moment().clone().set({hour: 23, minute: 59, second: 59, millisecond: 59}),
              ]
            }
            onChange={(date, dateString) => setTime({
              startTime: dateString[0] ? moment(dateString[0]).format('YYYYMMDDHHmmss') : '',
              endTime: dateString[1] ? moment(dateString[1]).clone().set({hour: 23, minute: 59, second: 59, millisecond: 59}).format('YYYYMMDDHHmmss') : '',
            })}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => setSearch({...search, ...time, page: 1})}>搜索</Button>
        </Form.Item>
      </Form>
      <BaseTableComponent
        rowKey={(row: any, index: number) => row.recordTime + row.seatUsername + row.teamName}
        indentSize={0}
        columns={columns}
        dataSource={result.data}
        loading={loading}
        current={search.page}
        onChange={handleTableChange}
        total={result.total}/>
    </div>
  )
}

export default ChannelOfferReport
