import React, {useState, useEffect, FunctionComponent} from 'react'
import {Form, DatePicker, Button, Radio} from 'antd'
import {RadioChangeEvent} from 'antd/es/radio'
import fetch from 'fetch/axios'
import moment from 'moment'
import BaseTableComponent from 'components/BaseTableComponent'

const AgentFee: FunctionComponent = () => {
  const [columns, setColumns] = useState([])
  const [time, setTime] = useState({
    starttime: moment().add(-1, 'week').startOf('week').format('YYYYMMDD'),
    endtime: moment().format('YYYYMMDD')
  })
  const [search, setSearch] = useState({offset: 1, limit: 10, order: '',})
  const [dateType, setDateType] = useState<number>(1)
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [expandedRow, setExpandedRow] = useState<Array<string>>([])

  useEffect(() => {
    getReport()
    getColumns()
  }, [search])


  const getColumns = () => {
    const params = {
      dimension: "accountFeeDeduction"
    }
    setLoading(true)
    fetch.get(`/apiv1/robot/rpt/head/info/optimized`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000) {
        const data = res.data.cols || []
        data.forEach((col: any) => {
          col.title = col.cnname;
          col.dataIndex = col.enname;
          if (col.dataIndex === "current_month") {
            col.dataIndex = 'fee_current_date'
          }
        })
        setColumns(res.data.cols)
      }
    })
  }

  const getReport = () => {
    const params = {
      ...search,
      ...time,
      datetype: dateType,
      accountid: localStorage.getItem('mjoys_account_id'),
      offset: (search.offset - 1) * search.limit + 1,
    }
    setLoading(true)
    fetch.get(`/apiv1/otb/report/findAccountFeeDeductionCompany`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000) {
        const data = res.data.totalReport || []
        data.forEach((v: any) => {
          v.children = []
        })
        setResult({data: res.data.totalTotalReport.concat(data), total: res.count})
      }
    })
  }

  // 获取当前日期下的子集列表
  const getExpand = (date: string) => {
    const params = {
      accountId: localStorage.getItem('mjoys_account_id'),
      date,
      datetype:dateType
    }
    setLoading(true)
    fetch.get(`/apiv1/otb/report/findAccountFeeDeductionCompany/expand`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        const data = result.data || []
        data.forEach((v: any) => {
          if (v.fee_current_date === date) {
            v.children = res.data || []
          }
        })
        setResult({...result, data: data})
      }
    })
  }


  const onExpand = (flag: boolean, record: any) => {
    if (flag) {
      getExpand(record.fee_current_date)
    }
  }

  const handleTableChange = (pagiation: any, orderBy: string) => {
    setExpandedRow([])
    setSearch({...search, offset: pagiation.current, limit: pagiation.pageSize})
  }


  return (
    <div style={{padding: 20}}>
      <Form layout="inline">
        <Form.Item label="日期">
          {
            dateType ? <DatePicker.RangePicker
              defaultValue={[moment().add(-1, 'week').startOf('week'), moment()]}
              onChange={(date, dateString) => setTime({
                starttime: dateString[0] ? moment(dateString[0]).format('YYYYMMDD') : '',
                endtime: dateString[1] ? moment(dateString[1]).format('YYYYMMDD') : '',
              })}/> : <>
              <DatePicker.MonthPicker defaultValue={moment().add(-1, 'month').startOf('month')} placeholder="请选择开始月份"/>
              ~
              <DatePicker.MonthPicker defaultValue={moment()} placeholder="请选择结束月份"/>
            </>
          }
        </Form.Item>
        <Form.Item>
          <Radio.Group onChange={(e: RadioChangeEvent) => setDateType(e.target.value)} value={dateType}>
            <Radio value={0}>按月</Radio>
            <Radio value={1}>按日</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => setSearch({...search, ...time, offset: 1})}>搜索</Button>
        </Form.Item>
      </Form>
      <BaseTableComponent
        expandedRowKeys={expandedRow}
        rowKey={(row: any, index: number) => (row.fee_current_date + row.contact + index).toString()}
        onExpandedRowsChange={(expandedRow: string[]) => setExpandedRow(expandedRow)}
        columns={columns}
        total={result.total}
        current={search.offset === 1 ? search.offset : undefined}
        onExpand={(flag: boolean, record: any) => onExpand(flag, record)}
        dataSource={result.data}
        onChange={handleTableChange}
        loading={loading}/>
    </div>
  )
}

export default AgentFee
