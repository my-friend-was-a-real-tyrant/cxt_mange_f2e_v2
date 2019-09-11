import React, {useState, useEffect, FunctionComponent} from 'react'
import {Collapse, Form, DatePicker, Button} from 'antd'
import moment from 'moment'
import fetch from 'fetch/axios'
import BaseTableComponent from 'components/BaseTableComponent'

const RechargeList: FunctionComponent = () => {
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [time, setTime] = useState({
    startTime: moment().add(-1, 'week').startOf('week').format('YYYYMMDD'),
    endTime: moment().format('YYYYMMDD'),
  })
  const [search, setSearch] = useState({offset: 1, limit: 10})

  useEffect(() => getList(), [search])

  const getList = () => {
    setLoading(true)
    const params = {
      accountid: localStorage.getItem('mjoys_account_id'),
      ...search,
      ...time,
      offset: (search.offset - 1) * search.limit + 1,
    }
    fetch.get(`/apiv1/uac/account/fee/findRechargeList`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setResult({data: res.data || [], total: res.count || 0})
      }
    })
  }
  const handleTableChange = (pagiation: any, orderBy: string) => {
    setSearch({...search, offset: pagiation.current, limit: pagiation.pageSize})
  }

  const columns = [
    {title: '公司名', dataIndex: 'account_id'},
    {title: '充值时间', dataIndex: 'time_create'},
    {title: '充值金额', dataIndex: 'recharge_amount'},
    {title: '充值前金额', dataIndex: 'before_recharge'},
    {title: '充值后金额', dataIndex: 'after_recharge'},
    {title: '备注', dataIndex: 'memo'},
  ]
  return (
    <Collapse defaultActiveKey={['1']}>
      <Collapse.Panel header="充值记录" key="1">
        <Form layout="inline">
          <Form.Item label="日期">
            <DatePicker.RangePicker
              defaultValue={[moment().add(-1, 'week').startOf('week'), moment(),]}
              onChange={(date, dateString) => setTime({
                startTime: dateString[0] ? moment(dateString[0]).format('YYYYMMDD') : '',
                endTime: dateString[1] ? moment(dateString[1]).format('YYYYMMDD') : '',
              })}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => setSearch({...search, ...time, offset: 1})}>搜索</Button>
          </Form.Item>
        </Form>
        <BaseTableComponent
          columns={columns}
          dataSource={result.data}
          loading={loading}
          onChange={handleTableChange}
          current={search.offset === 1 ? search.offset : undefined}/>
      </Collapse.Panel>
    </Collapse>
  )
}

export default RechargeList
