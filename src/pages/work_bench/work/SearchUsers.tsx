import React, {useState} from 'react'
import {Form, Input, Select, DatePicker, Icon, Button} from 'antd'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
import {FormComponentProps} from 'antd/es/form'
import {formatTime, quickTimeSelect} from "utils/utils"

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 17},
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
  setUsersSearch: (value: any) => any;
  thunkWorkUsers: () => any;
  usersSearch: any;
}

const SearchUsers: React.FC<IProps> = (props) => {
  const [open, setOpen] = useState<boolean>(false)

  const onSearch = () => {
    const {usersSearch, setUsersSearch, thunkWorkUsers} = props;
    props.form.validateFields(async (err, values) => {
      const params = {
        uni_query: values.uni_query,
        biz_status: values.biz_status,
        reg_date_b: formatTime(values.regDate)[0],
        reg_date_e: formatTime(values.regDate)[1],
        create_time_b: formatTime(values.createTime, 'YYYY-MM-DD HH:mm:ss')[0],
        create_time_e: formatTime(values.createTime, 'YYYY-MM-DD HH:mm:ss')[1],
        next_follow_time_b: formatTime(values.nextTime, 'YYYY-MM-DD')[0],
        next_follow_time_e: formatTime(values.nextTime, 'YYYY-MM-DD')[1],
      }
      await setUsersSearch({...usersSearch, ...params, page: 1})
      await thunkWorkUsers()
      setOpen(false)
    })
  }

  const {getFieldDecorator} = props.form
  return (
    <div className={`search-user ${open ? 'open' : ''}`}>
      <Form labelAlign="left">
        <Form.Item className="union_item">
          {getFieldDecorator('uni_query')(
            <Input.Search onSearch={onSearch}
                          placeholder="车牌/电话/微信/姓名"/>
          )}
          <span className="search-icon" onClick={() => setOpen(!open)}> </span>
        </Form.Item>
        <Form.Item label="预约日期" {...formItemLayout}>
          {getFieldDecorator('nextTime')(
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
        <Form.Item>
          <Button type="primary" block onClick={onSearch}> 确定搜索</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
const WrapperSearchUsers = Form.create()(SearchUsers)
const mapStateToProps = (state: any) => ({
  usersSearch: state.work.usersSearch
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setUsersSearch: (value: any) => dispatch(actions.setUsersSearch(value)),
  thunkWorkUsers: () => dispatch(actions.thunkWorkUsers()),
})
export default connect(mapStateToProps, mapDispatchToProps)(WrapperSearchUsers)
