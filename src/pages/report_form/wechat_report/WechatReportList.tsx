import React, {useState, useEffect, FunctionComponent} from 'react'
import {DatePicker, Button, Form} from 'antd'
import fetch from 'fetch/axios'
import moment from 'moment'
import BaseTableComponent from 'components/BaseTableComponent'
import {quickTimeSelect} from "utils/utils"

const WechatReportList: FunctionComponent = () => {
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [time, setTime] = useState({
    startTime: moment().add(-1, 'week').startOf('week').format('YYYYMMDDHHmmss'),
    endTime: moment().clone().set({hour: 23, minute: 59, second: 59, millisecond: 59}).format('YYYYMMDDHHmmss'),
  })
  const [search, setSearch] = useState({page: 1, pageSize: 10})
  const [expandedRow, setExpandedRow] = useState<Array<string>>([])

  useEffect(() => {
    getReport()
  }, [search])


  // 获取报表数据
  const getReport = () => {
    const params = {
      ...search,
      ...time,
      accountId: localStorage.getItem('mjoys_account_id'),
    }
    setLoading(true)
    fetch.get(`/apiv1/robot/rpt/wechat/friend/report/date?`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        const data = res.data || []
        data.forEach((v: any) => {
          v.children = []
        })
        console.log(data)
        setResult({data: data, total: res.count})
      }
    })
  }

  // 获取当前日期下的子集列表
  const getExpand = (time: string) => {
    const params = {
      accountId: localStorage.getItem('mjoys_account_id'),
      startTime: moment(time).clone().set({hour: 0, minute: 0, second: 0, millisecond: 0}).format('YYYYMMDDHHmmss'),
      endTime: moment(time).clone().set({hour: 23, minute: 59, second: 59, millisecond: 59}).format('YYYYMMDDHHmmss'),
    }
    setLoading(true)
    fetch.get(`/apiv1/robot/rpt/wechat/friend/report/seat`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        const data = result.data || []
        data.forEach((v: any) => {
          if (v.recordTime === time) {
            v.children = res.data || []
          }
        })
        setResult({...result, data: data})
      }
    })
  }

  const onEcpand = (flag: boolean, record: any) => {
    if (flag) {
      getExpand(record.recordTime)
    }
  }

  const handleTableChange = (pagiation: any, orderBy: string) => {
    setExpandedRow([])
    setSearch({...search, page: pagiation.current, pageSize: pagiation.pageSize})
  }

  const columns = [
    {title: '日期', dataIndex: 'recordTime'},
    {title: '团队', dataIndex: 'teamName'},
    {title: '坐席', dataIndex: 'seatUsername'},
    {title: '好友总量', dataIndex: 'friendCounter'},
    {title: '今日互动', dataIndex: 'todayActiveCounter'},
    {title: '今日新加', dataIndex: 'todayNewCounter'},
  ]

  return (
    <div style={{padding:'0 20px'}}>
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
        expandedRowKeys={expandedRow}
        onExpandedRowsChange={(expandedRow: string[]) => setExpandedRow(expandedRow)}
        rowKey={(row: any, index: number) => row.recordTime + row.seatUsername + row.teamName}
        indentSize={0}
        onExpand={(flag: boolean, record: any) => onEcpand(flag, record)}
        columns={columns}
        dataSource={result.data}
        loading={loading}
        current={search.page}
        onChange={handleTableChange}
        total={result.total}/>
    </div>
  )
}

export default WechatReportList
