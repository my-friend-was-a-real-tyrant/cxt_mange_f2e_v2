import React, {FunctionComponent} from 'react'
import {Form, Input, Select, DatePicker, Button} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import {quickTimeSelect} from "utils/utils"

const businessStatus = [
  {title: '沉默用户', type: 1},
  {title: '互动用户', type: 2},
  {title: '报价用户', type: 3},
  {title: '报价失败', type: 4},
  {title: '促成中', type: 5},
  {title: '成功出单', type: 6},
  {title: '出单失败', type: 7},
  {title: '无效用户', type: 8},
]

interface IProps extends FormComponentProps {
  onSearch: (values: any) => any;
  user:any
}

const SearchForm: FunctionComponent<IProps> = (props) => {
  const {getFieldDecorator} = props.form

  const onSearch = () => {
    props.form.validateFields((err, values) => {

      props.onSearch(values)
    })
  }


  return (
    <div>
      <Form layout="inline">
        {/*<Form.Item label="场地编号">
          {getFieldDecorator('seatId', {initialValue: ''})(
              <Select style={{width: 200}}>
                <Select.Option value="" key="-1">全部坐席</Select.Option>
                {props.user && props.user.map((v: any) => <Select.Option key={v.id} value={v.id}>{v.contact}</Select.Option>)}
              </Select>
          )}
        </Form.Item>
        <Form.Item label="摄像头标号">
          {getFieldDecorator('seatId', {initialValue: ''})(
              <Select style={{width: 200}}>
                <Select.Option value="" key="-1">全部坐席</Select.Option>
                {props.user && props.user.map((v: any) => <Select.Option key={v.id} value={v.id}>{v.contact}</Select.Option>)}
              </Select>
          )}
        </Form.Item>*/}
        <Form.Item label="">
          {getFieldDecorator('address_code', {initialValue: ''})(
            <Input placeholder="场地编号"/>
          )}
        </Form.Item>
        <Form.Item label="">
          {getFieldDecorator('license', {initialValue: ''})(
            <Input placeholder="摄像头标号"/>
          )}
        </Form.Item>
        <Form.Item label="">
          {getFieldDecorator('code', {initialValue: ''})(
            <Input placeholder="车牌"/>
          )}
        </Form.Item>
        <Form.Item label="">
          {getFieldDecorator('time')(
            <DatePicker.RangePicker
              style={{width: 250}}
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
              ranges={quickTimeSelect()}
            />
          )}
        </Form.Item>

        <Form.Item label="">
          {getFieldDecorator('price_result', {initialValue:-1})(
            <Select style={{width: 150}} >
              <Select.Option value={-1}>是否报价成功</Select.Option>
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={0}>否</Select.Option>
            </Select>
          )}
        </Form.Item>
        {/*<Form.Item label="跟进状态">*/}
          {/*{getFieldDecorator('followUpStatus', {initialValue: -1})(*/}
            {/*<Select style={{width: 100}}>*/}
              {/*<Select.Option value={-1} key={-1}>全部</Select.Option>*/}
              {/*{businessStatus.map(m => <Select.Option value={m.type} key={m.type}>{m.title}</Select.Option>)}*/}
            {/*</Select>*/}
          {/*)}*/}
        {/*</Form.Item>*/}
        <Form.Item>
          <Button type="primary" onClick={onSearch}>搜索</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default Form.create<IProps>()(SearchForm)
