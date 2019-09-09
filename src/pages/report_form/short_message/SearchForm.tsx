import React, {FunctionComponent, useState, useEffect} from 'react'
import {Form, Input, Select, DatePicker, Button} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import {quickTimeSelect} from "utils/utils"
import fetch from "../../../fetch/axios"

interface IProps extends FormComponentProps {
  onSearch: (values: any) => any
}

const SearchForm: FunctionComponent<IProps> = (props) => {
  const {getFieldDecorator} = props.form
  const [company, setCompany] = useState([])

  useEffect(() => getCompany(), [])

  // 获取坐席
  const getCompany = () => {
    fetch.get(`/apiv1/otb/taskAllot/findTaskAllotStatus`).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        setCompany(res.data || [])
      }
    })
  }

  const onSearch = () => {
    props.form.validateFields((err, values) => {
      props.onSearch(values)
    })
  }

  return (
    <div>
      <Form layout="inline">
        <Form.Item label="坐席">
          {getFieldDecorator('userId', {initialValue: ''})(
            <Select style={{width: 200}}>
              <Select.Option value="" key="-1">全部坐席</Select.Option>
              {company.map((v: any) => <Select.Option key={v.userId} value={v.contact}>{v.contact}</Select.Option>)}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="车牌/电话/姓名">
          {getFieldDecorator('keyword', {initialValue: ''})(
            <Input placeholder="请输入车牌/电话/姓名"/>
          )}
        </Form.Item>
        <Form.Item label="发送日期">
          {getFieldDecorator('time')(
            <DatePicker.RangePicker
              style={{width: 200}}
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
              ranges={quickTimeSelect()}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={onSearch}>搜索</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default Form.create<IProps>()(SearchForm)
