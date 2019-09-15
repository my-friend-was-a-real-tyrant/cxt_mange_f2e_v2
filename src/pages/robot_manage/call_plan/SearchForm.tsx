import React, {FunctionComponent, Fragment, useState, useEffect} from 'react'
import {Form, Input, Select, DatePicker, Button, Row, Checkbox, message, Modal} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {formatTime, quickTimeSelect} from "utils/utils"
import fetch from "fetch/axios"

interface IProps extends FormComponentProps {
  onSearch: (values: any) => any,
  selectedRowKeys: number[]
}

interface IBusinessItem {
  business_id: number;
  business_name: string;
  status: number;
}

const SearchForm: FunctionComponent<IProps> = (props) => {
  const [businessList, setBusinessList] = useState<Array<IBusinessItem>>([])
  const [checkAll, setCheckAll] = useState<boolean>(false)

  useEffect(() => getBusiness(), [])


  // 获取业务
  const getBusiness = () => {
    fetch.get(`/apiv1/oper/get_business_by_company_userid`).then((res: any) => {
      if (res.code === 20000) {
        setBusinessList(res.data || [])
      } else if (res.code === 20003) {
        setBusinessList([])
      }
    })
  }

  // 加入计划
  const handleAddPlan = () => {
    props.form.validateFields((err, values) => {

      Modal.confirm({
        title: '提示',
        content: `您选中了"${checkAll ? '所有' : selectedRowKeys.length + '条'}数据"，将批量操作【加入计划】请确认？`,
        onOk() {
          const params = {
            ...values,
            start_time: formatTime(values.time, 'YYYYMMDD')[0],
            end_time: formatTime(values.time, 'YYYYMMDD')[1],
            is_all: checkAll ? 1 : 0,
            detailIds: checkAll ? -1 : selectedRowKeys.join(',')
          }
          delete params.time
          return fetch.post(`/apiv1/phonecallplan/dgj/addplan`, null, {params}).then((res: any) => {
            if (res.code === 20000) {
              message.success(`加入计划成功${res.data}条`)
            }
          })
        },
      })
    })
  }

  // 优先拨打
  const handleCall = () => {
    props.form.validateFields((err, values) => {
      Modal.confirm({
        title: '提示',
        content: `您选中了"${checkAll ? '所有' : selectedRowKeys.length + '条'}数据"，将批量操作【优先拨打】请确认？`,
        onOk() {
          const params = {
            ...values,
            start_time: formatTime(values.time, 'YYYYMMDD')[0],
            end_time: formatTime(values.time, 'YYYYMMDD')[1],
            is_all: checkAll ? 1 : 0,
            detailIds: checkAll ? -1 : selectedRowKeys.join(',')
          }
          delete params.time
          return fetch.put(`/apiv1/phonecallplan/dgj/setCallPriorityFirst`, null, {params}).then((res: any) => {
            if (res.code === 20000) {
              message.success(`优先拨打成功${res.data}条`)
            }
          })
        },
      })
    })
  }

  // 取消计划
  const handleCancelCall = () => {
    props.form.validateFields((err, values) => {
      Modal.confirm({
        title: '提示',
        content: `您选中了"${checkAll ? '所有' : selectedRowKeys.length + '条'}数据"，将批量操作【取消计划】请确认？`,
        onOk() {
          const params = {
            ...values,
            start_time: formatTime(values.time, 'YYYYMMDD')[0],
            end_time: formatTime(values.time, 'YYYYMMDD')[1],
            is_all: checkAll ? 1 : 0,
            detailIds: checkAll ? -1 : selectedRowKeys.join(',')
          }
          delete params.time
          return fetch.delete(`/apiv1/phonecallplan/dgj/cancelphoneplan`, {params}).then((res: any) => {
            if (res.code === 20000) {
              message.success(`取消计划成功${res.data}条`)
            }
          })
        },
      })
    })
  }

  // 搜索
  const onSearch = () => {
    props.form.validateFields((err, values) => {
      const {onSearch} = props;
      if (err) return false;
      onSearch && onSearch({
        ...values,
        start_time: formatTime(values.time, 'YYYYMMDD')[0],
        end_time: formatTime(values.time, 'YYYYMMDD')[1]
      })
    })
  }
  const {getFieldDecorator} = props.form;
  const {selectedRowKeys} = props;
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
          {getFieldDecorator('show_name', {initialValue: ''})(
            <Input placeholder="请输入展示名称"/>
          )}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('phone_number', {initialValue: ''})(
            <Input placeholder="请输入手机号"/>
          )}
        </Form.Item>
      </Row>
      <Row>
        <Form.Item label="计划状态">
          {getFieldDecorator('plan_status', {initialValue: -1})(
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
          {getFieldDecorator('phone_number_status', {initialValue: -1})(
            <Select style={{width: 180}}>
              <Select.Option value={-1}>全部状态</Select.Option>
              <Select.Option value={2}>已拨打</Select.Option>
              <Select.Option value={1}>未拨打</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={onSearch}>搜索</Button>
        </Form.Item>
        <Form.Item>
          <Button.Group>
            <Button type={checkAll ? "primary" : "dashed"} onClick={() => setCheckAll(!checkAll)}>
              <Checkbox checked={checkAll} onChange={(e: CheckboxChangeEvent) => setCheckAll(e.target.checked)}/>
              &nbsp;
              选择全部
            </Button>
            <Button type="default"
                    icon="clock-circle"
                    disabled={!selectedRowKeys.length && !checkAll}
                    onClick={handleCall}>
              优先拨打
            </Button>
            <Button type="primary"
                    icon="plus-circle"
                    disabled={!selectedRowKeys.length && !checkAll}
                    onClick={handleAddPlan}>
              加入计划
            </Button>
            <Button type="danger"
                    icon="close-circle"
                    onClick={handleCancelCall}
                    disabled={!selectedRowKeys.length && !checkAll}>
              取消计划
            </Button>
          </Button.Group>
        </Form.Item>
      </Row>
    </Form>
  </Fragment>
}

export default Form.create<IProps>()(SearchForm);
