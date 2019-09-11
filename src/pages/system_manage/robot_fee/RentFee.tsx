import React, {useState, useEffect, FunctionComponent} from 'react'
import {Form, DatePicker, Button} from 'antd'
import fetch from 'fetch/axios'
import moment from 'moment'
import BaseTableComponent from 'components/BaseTableComponent'

const RentFee: FunctionComponent = () => {
  const [time, setTime] = useState({
    beginTime: moment().add(-1, 'week').startOf('week').format('YYYYMMDD'),
    endTime: moment().format('YYYYMMDD')
  })
  const [search, setSearch] = useState({offset: 1, limit: 10, order: '',})
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    getReport()
  }, [search])


  const getReport = () => {
    const params = {
      ...search,
      ...time,
      type: 1,
      accountId: localStorage.getItem('mjoys_account_id'),
      offset: (search.offset - 1) * search.limit + 1,
    }
    setLoading(true)
    fetch.get(`/apiv1/uac/account/fee/record/detail`, {params}).then((res: any) => {
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
    {title: '公司', dataIndex: 'account_id'},
    {title: '操作时间', dataIndex: 'time_create'},
    {title: '开通前路数', dataIndex: 'b_robot_count'},
    {title: '开通前有效期', dataIndex: 'b_expire_date'},
    {title: '开通后路数', dataIndex: 'a_robot_count'},
    {title: '开通后有效期', dataIndex: 'a_expire_date'},
    {title: '扣费金额', dataIndex: 'cost'},
    {title: '备注', dataIndex: 'memo'},
  ]

  return (
    <div style={{padding: '0 20px'}}>
      <Form layout="inline">
        <Form.Item label="日期">
          <DatePicker.RangePicker
            defaultValue={[moment().add(-1, 'week').startOf('week'), moment()]}
            onChange={(date, dateString) => setTime({
              beginTime: dateString[0] ? moment(dateString[0]).format('YYYYMMDD') : '',
              endTime: dateString[1] ? moment(dateString[1]).format('YYYYMMDD') : '',
            })}/>
        </Form.Item>
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

export default RentFee
