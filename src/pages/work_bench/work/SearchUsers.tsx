import React, {useState, useEffect} from 'react'
import {Form, Input, Select, DatePicker, Icon} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import {quickTimeSelect} from "../../../utils/utils"

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 18},
};
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

}

const SearchUsers: React.FC<IProps> = (props) => {
  const [open, setOpen] = useState<boolean>(false)


  const {getFieldDecorator} = props.form
  return (
    <div className={`search-user ${open ? 'open' : ''}`}>
      <Form>
        <Form.Item className="union_item">
          {getFieldDecorator('uni_query')(
            <Input placeholder="车牌/电话/微信/姓名" addonBefore={<Icon type="search"/>}/>
          )}
          <span className="search-icon" onClick={() => setOpen(!open)}> </span>
        </Form.Item>
        <Form.Item label="预约日期" {...formItemLayout}>
          {getFieldDecorator('recentTime')(
            <DatePicker.RangePicker
              format="YYYY-MM-DD"
              suffixIcon=" "
              placeholder={['开始日期', '结束日期']}
              ranges={quickTimeSelect()}
            />
          )}
        </Form.Item>
        <Form.Item label="保险日期" {...formItemLayout}>
          {getFieldDecorator('regDate')(
            <DatePicker.RangePicker
              format="MM-DD"
              suffixIcon=" "
              placeholder={['开始日期', '结束日期']}
              ranges={quickTimeSelect()}
            />
          )}
        </Form.Item>
        <Form.Item label="下发日期" {...formItemLayout}>
          {getFieldDecorator('createTime')(
            <DatePicker.RangePicker
              format="YYYY-MM-DD"
              suffixIcon=" "
              placeholder={['开始日期', '结束日期']}
              ranges={quickTimeSelect()}
            />
          )}
        </Form.Item>
        <Form.Item label="跟进状态" {...formItemLayout}>
          {getFieldDecorator('biz_status', {initialValue: ''})(
            <Select>
              <Select.Option value="">全部状态</Select.Option>
              {businessStatus.map((m: any) => <Select.Option value={m.type} key={m.type}>{m.title}</Select.Option>)}
            </Select>
          )}
        </Form.Item>
      </Form>
    </div>
  )
}

export default Form.create()(SearchUsers)
