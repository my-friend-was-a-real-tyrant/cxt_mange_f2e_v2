import React, {useState, useEffect, FunctionComponent} from 'react'
import {Form, DatePicker, Button} from 'antd'
import fetch from 'fetch/axios'
import moment from 'moment'
import BaseTableComponent from 'components/BaseTableComponent'
import {quickTimeSelect} from "utils/utils"

const SeatOfferReport: FunctionComponent = () => {
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [time, setTime] = useState({
    startTime: moment().add(-1, 'week').startOf('week').format('YYYYMMDDHHmmss'),
    endTime: moment().clone().set({hour: 23, minute: 59, second: 59, millisecond: 59}).format('YYYYMMDDHHmmss'),
  })
  const [search, setSearch] = useState({page: 1, pageSize: 10, startTime: '', endTime: ''})

  useEffect(() => {
    getList()
  }, [search])

  const getList = (): void => {
    const params = {
      ...search,
      ...time,
    }
    setLoading(true)
    fetch.get(`/apiv1/robot/rpt/insurance/offer/record`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setResult({data: res.data || [], total: res.count})
      }
    })
  }

  const handleTableChange = (pagiation: any, orderBy: string) => {
    setSearch({...search, page: pagiation.current, pageSize: pagiation.pageSize,})
  }

  const columns = [
    {title: '日期', dataIndex: 'recordTime'},
    {title: '团队', dataIndex: 'teamName'},
    {title: '坐席', dataIndex: 'searUsername'},
    {title: '报价次数', dataIndex: 'allCounter'},
    {title: '成功次数', dataIndex: 'successCounter'},
  ]
  return (
    <div style={{padding: '0 20px'}}>
      <Form layout="inline">
        <Form.Item label="日期">
          <DatePicker.RangePicker
            ranges={quickTimeSelect()}
            defaultValue={
              [
                moment().add(-1, 'week').startOf('week'),
                moment().clone().set({hour: 23, minute: 59, second: 59, millisecond: 59}),
              ]
            }
            onChange={(date, dateString) => setTime({
              startTime: dateString[0] ? moment(dateString[0]).format('YYYYMMDDHHmmss') : '',
              endTime: dateString[1] ? moment(dateString[1]).clone().set({
                hour: 23,
                minute: 59,
                second: 59,
                millisecond: 59
              }).format('YYYYMMDDHHmmss') : '',
            })}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => setSearch({...search, ...time, page: 1})}>搜索</Button>
        </Form.Item>
      </Form>
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

export default SeatOfferReport
