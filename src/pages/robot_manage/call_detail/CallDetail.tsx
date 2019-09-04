import React, {useState, useEffect, FunctionComponent} from 'react'
import {Form, Input, Select, DatePicker, Button, Tag} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import {formatTime, quickTimeSelect} from "utils/utils"
import fetch from "fetch/axios"
import BaseTableComponent from 'components/BaseTableComponent'

interface IBusinessItem {
  business_id: number;
  business_name: string;
  status: number;
}

const callStatus: any = {
  '0': {title: '未接通(未知原因)', color: 'red'},
  '1': {title: '已接通', color: 'green'},
  '101': {title: '无人接听', color: 'gold'},
  '102': {title: '空号', color: 'volcano'},
  '103': {title: '停机', color: 'magenta'},
  '104': {title: '无法接通', color: 'cyan'},
  '105': {title: '占线/拒接', color: 'geekblue'},
  '106': {title: '留言', color: 'purple'},
  '107': {title: '关机', color: 'orange'}
}

const resultStatus: any = {
  "-2": {title: '未分类', color: ''},
  "0": {title: '不确定', color: ''},
  "1": {title: '意向用户', color: ''},
  "2": {title: '非意向用户', color: ''},
}

const CallDetail: FunctionComponent<FormComponentProps> = (props) => {
  const [businessList, setBusinessList] = useState<Array<IBusinessItem>>([])
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState({offset: 1, limit: 10})

  useEffect(() => getBusiness(), [])

  useEffect(() => getDetailList(), [search])

  // 获取业务
  const getBusiness = () => {
    fetch.get(`/apiv1/oper/get_business_by_company_userid`).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        setBusinessList(res.data || [])
      }
    })
  }

  // 获取列表数据
  const getDetailList = () => {
    setLoading(true)
    props.form.validateFields((err, values) => {
      const params = {
        ...search,
        offset: (search.offset - 1) * search.limit + 1,
        start_time: formatTime(values.time, 'YYYYMMDDHHMM')[0],
        end_time: formatTime(values.time, 'YYYYMMDDHHMM')[1],
        ...values,
      }
      delete params.time;
      fetch.get(`/apiv1/robot/report/find_call_log_list_customer`, {params}).then((res: any) => {
        setLoading(false)
        if (res.code === 20000 || res.code === 20003) {
          const data = res.data || []
          data.forEach((v: any) => {
            // eslint-disable-next-line no-mixed-operators
            v.resultTypeName = v.resultTypeName && v.resultTypeName.split(',') || []
          })
          setResult({data: data || [], total: res.count || 0})
        }
      })
    })
  }

  const handleTableChange = (pagination: any) => {
    setSearch({offset: pagination.current, limit: pagination.pageSize})
  }


  const {getFieldDecorator} = props.form
  const businessOption = businessList.map((v: IBusinessItem) => <Select.Option
    key={v.business_id}>
    {v.business_name}{v.status !== 1 ? <span style={{color: 'red'}}>(停用)</span> : ''}
  </Select.Option>)

  const columns = [
    {title: '展示名称', dataIndex: 'show_name'},
    {title: '电话号码', dataIndex: 'phone'},
    {title: '拨打次数', dataIndex: 'call_num'},
    {title: '拨打时间', dataIndex: 'dail_time'},
    {
      title: '通话状态', dataIndex: 'call_status', render: (status: number) => (
        <Tag color={callStatus[status].color}>{callStatus[status].title}</Tag>
      )
    },
    {title: '通话时长', dataIndex: 'call_time'},
    {
      title: '用户分类', dataIndex: 'result_status', render: (status: number, row: any) => (
        <div className="user-type" style={{maxWidth: '200px'}}>
          <Tag color={resultStatus[status].color}>{resultStatus[status].title}</Tag>
          {row.resultTypeName.map((v: string) => <Tag key={v}>{v}</Tag>)}
        </div>
      )
    },
    {title: '备注', dataIndex: 'comment'},
    {title: '操作'},
  ]

  return (
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
        <Form.Item label="展示名称">
          {getFieldDecorator('show_name', {initialValue: ''})(
            <Input placeholder="请输入展示名称"/>
          )}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('phone_number', {initialValue: ''})(
            <Input placeholder="请输入手机号"/>
          )}
        </Form.Item>
        <Form.Item label="通话时长">
          {getFieldDecorator('duration', {initialValue: ''})(
            <Input addonAfter="s"/>
          )}
        </Form.Item>
        <Form.Item label="通话状态">
          {getFieldDecorator('call_status', {initialValue: "-1"})(
            <Select style={{width: 200}}>
              <Select.Option value="-1">全部状态</Select.Option>
              <Select.Option value="0">未接通(未知原因)</Select.Option>
              <Select.Option value="1">已接通</Select.Option>
              <Select.Option value="101">无人接听</Select.Option>
              <Select.Option value="102">空号</Select.Option>
              <Select.Option value="103">停机</Select.Option>
              <Select.Option value="104">无法接通</Select.Option>
              <Select.Option value="105">占线/拒接</Select.Option>
              <Select.Option value="106">留言</Select.Option>
              <Select.Option value="107">关机</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="自定义分类">
          {getFieldDecorator('resultTypeName', {initialValue: ''})(
            <Input placeholder="请输入分类"/>
          )}
        </Form.Item>
        <Form.Item label="用户意向">
          {getFieldDecorator('result_status', {initialValue: "-1"})(
            <Select style={{width: 200}}>
              <Select.Option value="-1">全部</Select.Option>
              <Select.Option value="1">意向</Select.Option>
              <Select.Option value="2">非意向</Select.Option>
              <Select.Option value="0">不确定</Select.Option>
              <Select.Option value="-2">未分类</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={getDetailList}>搜索</Button>
        </Form.Item>
      </Form>

      <BaseTableComponent
        columns={columns}
        dataSource={result.data}
        total={result.total}
        onChange={handleTableChange}
        loading={loading}/>
    </div>
  )
}

export default Form.create()(CallDetail)
