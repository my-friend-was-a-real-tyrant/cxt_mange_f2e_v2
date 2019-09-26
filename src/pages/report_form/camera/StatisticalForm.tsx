import React, {useState, useEffect, FunctionComponent} from 'react'
import {DatePicker, Button, Form} from 'antd'
import fetch from 'fetch/axios'
import moment from 'moment'
import BaseTableComponent from 'components/BaseTableComponent'
import {quickTimeSelect} from "utils/utils"

const StatisticalForm: FunctionComponent = () => {
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
      // ...time,
      // ...search,
      // accountId: localStorage.getItem('access_token'),
    }
    setLoading(true)
    fetch.get(`/apiv1/camera/submit-license-report?`, {params}).then((res: any) => {
      setLoading(false)
      console.log(res)
      if (res.code === 20000 || res.code === 20003) {
        const data = res.data || []
        // debugger
        // data.forEach((v: any) => {
        //   v.children = []
        // })
        // console.log(data)
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
    fetch.get(`/apiv1/robot/rpt/followup/report/seat`, {params}).then((res: any) => {
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
    {title: '日期', dataIndex: 'dtime'},
    {title: '场地名称', dataIndex: 'address'},
    {title: '摄像头编号', dataIndex: 'camera_id'},
    {title: '识别车牌PV', dataIndex: 'PV'},
    {title: '识别车牌UV', dataIndex: 'UV'},
    {title: '投保期车牌UV', dataIndex: 'UV1'},
    {title: '报价次数', dataIndex: 'cprice_submit'},
    {title: '成功报价次数', dataIndex: 'cprice_result'},
  ]

  return (
      <div style={{padding: '0 20px'}}>
        {/*<Form layout="inline">
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
        </Form>*/}
        <BaseTableComponent
            expandedRowKeys={expandedRow}
            onExpandedRowsChange={(expandedRow: string[]) => setExpandedRow(expandedRow)}
            // rowKey={(row: any, index: number) => row.recordTime + row.seatUsername + row.teamName}
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

export default StatisticalForm
