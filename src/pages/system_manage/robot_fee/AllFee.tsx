import React, {useState, useEffect, FunctionComponent} from 'react'
import {Form, DatePicker, Button, Radio} from 'antd'
import {RadioChangeEvent} from 'antd/es/radio'
import fetch from 'fetch/axios'
import moment from 'moment'
import BaseTableComponent from 'components/BaseTableComponent'

const AllFee: FunctionComponent = () => {
  const [time, setTime] = useState({
    starttime: moment().add(-1, 'week').startOf('week').format('YYYYMMDD'),
    endtime: moment().format('YYYYMMDD')
  })
  const [search, setSearch] = useState({offset: 1, limit: 10, order: '',})
  const [dateType, setDateType] = useState<number>(1)
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    getReport()
  }, [search])


  const getReport = () => {
    const params = {
      ...search,
      ...time,
      datetype: dateType,
      accountid: localStorage.getItem('mjoys_account_id'),
      offset: (search.offset - 1) * search.limit + 1,
    }
    setLoading(true)
    fetch.get(`/apiv1/uac/account/fee/record`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000) {
        setResult({data: res.data || [], total: res.count})
      }
    })
  }

  const handleTableChange = (pagiation: any, orderBy: string) => {
    setSearch({...search, offset: pagiation.current, limit: pagiation.pageSize})
  }

  const columns = [
    {title: '日期', dataIndex: 'time_create'},
    {title: '话术费用', dataIndex: 'robot_fee'},
    {title: '租用费用', dataIndex: 'user_fee'},
    {title: '总费用', dataIndex: 'all_fee'},
  ]

  return (
    <div style={{padding: '0 20px'}}>
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
        {/*<Form.Item>*/}
        {/*  <Radio.Group onChange={(e: RadioChangeEvent) => setDateType(e.target.value)} value={dateType}>*/}
        {/*    <Radio value={0}>按月</Radio>*/}
        {/*    <Radio value={1}>按日</Radio>*/}
        {/*  </Radio.Group>*/}
        {/*</Form.Item>*/}
        <Form.Item>
          <Button type="primary" onClick={() => setSearch({...search, ...time, offset: 1})}>搜索</Button>
        </Form.Item>
      </Form>
      <BaseTableComponent
        columns={columns}
        total={result.total}
        current={search.offset === 1 ? search.offset : undefined}
        dataSource={result.data}
        onChange={handleTableChange}
        loading={loading}/>
    </div>
  )
}

export default AllFee
