import React, {FunctionComponent, Fragment, useState, useEffect} from 'react'
import {Form, Input, Select, DatePicker, Button, Row, Checkbox} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {quickTimeSelect} from "../../../utils/utils"
import fetch from "../../../fetch/axios"

interface IBusinessItem {
  business_id: number;
  business_name: string;
  status: number;
}

const SearchForm: FunctionComponent<FormComponentProps> = (props) => {
  const [businessList, setBusinessList] = useState<Array<IBusinessItem>>([])
  const [checkAll, setCheckAll] = useState<boolean>(false)

  useEffect(() => getBusiness(), [])


  // 获取业务
  const getBusiness = () => {
    fetch.get(`/apiv1/oper/get_business_by_company_userid`).then((res: any) => {
      if (res.code === 20000) {
        setBusinessList(res.data || [])
      }
    })
  }

  const {getFieldDecorator} = props.form;
  const businessOption = businessList.map((v: IBusinessItem) => <Select.Option
    key={v.business_id}>
    {v.business_name}{v.status !== 1 ? <span style={{color: 'red'}}>(停用)</span> : ''}
  </Select.Option>)
  return <Fragment>
    <Form layout="inline">
      <Row>
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
          {getFieldDecorator('time')(
            <Input placeholder="请输入展示名称"/>
          )}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('time')(
            <Input placeholder="请输入手机号"/>
          )}
        </Form.Item>
      </Row>
      <Row>
        <Form.Item label="计划状态">
          {getFieldDecorator('planStatus', {initialValue: -1})(
            <Select style={{width: 180}}>
              <Select.Option value={-1}>全部状态</Select.Option>
              <Select.Option value={0}>未计划</Select.Option>
              <Select.Option value={1}>计划中</Select.Option>
              <Select.Option value={2}>计划完成</Select.Option>
              <Select.Option value={3}>计划已经停用</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="号码状态">
          {getFieldDecorator('phoneStatus', {initialValue: -1})(
            <Select style={{width: 180}}>
              <Select.Option value={-1}>全部状态</Select.Option>
              <Select.Option value={2}>已拨打</Select.Option>
              <Select.Option value={1}>未拨打</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary">搜索</Button>
        </Form.Item>
        <Form.Item>
          <Button.Group>
            <Button type="dashed" onClick={() => setCheckAll(!checkAll)}>
              <Checkbox checked={checkAll} onChange={(e: CheckboxChangeEvent) => setCheckAll(e.target.checked)}/>
              &nbsp;
              选择全部
            </Button>
            <Button type="default" icon="clock-circle"> 优先拨打</Button>
            <Button type="primary" icon="plus-circle">加入计划</Button>
            <Button type="danger" icon="close-circle">取消计划</Button>
          </Button.Group>
        </Form.Item>
      </Row>
    </Form>
  </Fragment>
}

export default Form.create()(SearchForm);
