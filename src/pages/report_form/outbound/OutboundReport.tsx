import React, {useState, useEffect, FunctionComponent} from 'react'
import {DatePicker, Button, Form} from 'antd'
import fetch from 'fetch/axios'
import moment from 'moment'
import BaseTableComponent from 'components/BaseTableComponent'

const OutboundReport: FunctionComponent = () => {
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [time, setTime] = useState({startTime: '', endTime: ''})
  const [search, setSearch] = useState({page: 1, pageSize: 10})
  const [expandedRow, setExpandedRow] = useState<Array<string>>([])

  useEffect(() => {
    getReport()
  }, [search])


  // 获取报表数据
  const getReport = () => {
    const params = {
      ...search,
      accountId: localStorage.getItem('mjoys_account_id'),
    }
    setLoading(true)
    fetch.get(`/apiv1/robot/rpt/outbound/report/date?`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000|| res.code === 20003) {
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
    fetch.get(`/apiv1/robot/rpt/outbound/report/seat`, {params}).then((res: any) => {
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
    {title: '分发任务', dataIndex: 'appropriatedCounter'},
    {title: '完成情况', dataIndex: 'rateOfComplete', render: (rate: number) => rate + '%'},
    {title: '呼叫次数', dataIndex: 'finishedCounter'},
    {title: '接通次数', dataIndex: 'getThroughCounter'},
    {title: '通话总时长', dataIndex: 'durationCounter'},
  ]

  return (
    <div>
      <Form layout="inline">
        <Form.Item label="日期">
          <DatePicker.RangePicker
            onChange={(date, dateString) => setTime({
              startTime: dateString[0] ? moment(dateString[0]).format('YYYYMMDDHHmmss') : '',
              endTime: dateString[1] ? moment(dateString[1]).format('YYYYMMDDHHmmss') : '',
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

export default OutboundReport
