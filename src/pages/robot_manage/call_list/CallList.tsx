import React, {useState, useEffect, FunctionComponent, Fragment} from 'react'
import BaseTableComponent from 'components/BaseTableComponent'
import {Form, DatePicker, Select, Button} from 'antd'
import fetch from 'fetch/axios'
import {formatTime, quickTimeSelect} from "utils/utils"
import {FormComponentProps} from 'antd/es/form'


interface IBusinessItem {
  business_id: number;
  business_name: string;
  status: number;
}

const CallList: FunctionComponent<FormComponentProps> = (props) => {

  const [businessList, setBusinessList] = useState<Array<IBusinessItem>>([])
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState({offset: 1, limit: 10})

  // 获取业务
  const getBusiness = () => {
    fetch.get(`/apiv1/oper/get_business_by_company_userid`).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        setBusinessList(res.data || [])
      }
    })
  }

  useEffect(() => getBusiness(), [])

  useEffect(() => getCallList(), [search])

  const getCallList = () => {
    setLoading(true)
    props.form.validateFields((err, values) => {
      const params = {
        ...search,
        business_id: values.business_id,
        start_time: formatTime(values.time, 'YYYYMMDD')[0],
        end_time: formatTime(values.time, 'YYYYMMDD')[1],
      }
      fetch.get(`/apiv1/robot/report/find_call_detail_censuslist_customer`, {params}).then((res: any) => {
        setLoading(false)
        if (res.code === 20000 || res.code === 20003) {
          setResult({data: res.data, total: res.count})
        }
      })
    })
  }

  const columns = [
    {title: '日期', dataIndex: 'time_create'},
    {title: '业务', dataIndex: 'business_name'},
    {title: '总电话数', dataIndex: 'sum'},
    {title: '已接听数', dataIndex: 'connect_count'},
    {title: '未接听数', dataIndex: 'not_connect_count'},
    {title: '未拨打数', dataIndex: 'not_call_count'},
    {title: '拒绝', dataIndex: 'not_need_count'},
    {title: '触发1个问题', dataIndex: 'trigger_count1'},
    {title: '触发2个问题', dataIndex: 'trigger_count2'},
    {title: '触发3个以上问题', dataIndex: 'trigger_count3'},
    {title: '需要产品', dataIndex: 'need_count'},
  ]

  const {getFieldDecorator} = props.form
  const businessOption = businessList.map((v: IBusinessItem) => <Select.Option
    key={v.business_id}>
    {v.business_name}{v.status !== 1 ? <span style={{color: 'red'}}>(停用)</span> : ''}
  </Select.Option>)

  return (
    <Fragment>
      <div style={{padding: '10px'}}>
        <Form layout="inline">
          <Form.Item label="日期">
            {getFieldDecorator('time')(
              <DatePicker.RangePicker
                style={{width: 250}}
                format="YYYY-MM-DD"
                suffixIcon=" "
                placeholder={['开始日期', '结束日期']}
                ranges={quickTimeSelect()}
              />
            )}
          </Form.Item>
          <Form.Item label="业务">
            {getFieldDecorator('business_id', {initialValue: "-1"})(
              <Select style={{width: 200}}>
                <Select.Option key="-1" value="-1">全部业务</Select.Option>
                {businessOption}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={getCallList}>搜索</Button>
          </Form.Item>
        </Form>
        <BaseTableComponent
          columns={columns}
          dataSource={result.data}
          loading={loading}
          total={result.total}/>
      </div>
    </Fragment>
  )
}

export default Form.create()(CallList)
