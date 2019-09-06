import React, {FunctionComponent, useState} from 'react'
import {Form, Input, Select, DatePicker, Icon, Button} from 'antd'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {FormComponentProps} from 'antd/es/form'
import * as actions from 'store/actions/work'
import moment from 'moment'
import 'assets/styles/right-panel.less'

const wxStatus: any = {
  "-1": "已删除",
  "1": "未删除",
  "-2": "拉黑",
}
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
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};

interface IProps extends FormComponentProps {
  currentUser: any;
}

const UserInfo: FunctionComponent<IProps> = (props) => {
  const currentUser: any = props.currentUser;
  const [edit, setEdit] = useState<boolean>(false)

  const {getFieldDecorator} = props.form;
  return (
    <div>
      <Form className="user-info-form" labelAlign="left">
        <div className="right-panel-title">
          <span className="title">用户信息</span>
          <span className="btn" onClick={() => setEdit(!edit)}>
            <b><Icon type="edit"/></b>&nbsp; {edit?'取消':'编辑'}
          </span>
        </div>
        <Form.Item label="车牌" {...formItemLayout}>
          {edit ? <Input placeholder="请输入车牌号"/> : currentUser && currentUser.license}
        </Form.Item>
        <Form.Item label="姓名"  {...formItemLayout}>
          {edit ? <Input placeholder="请输入姓名"/> : currentUser && currentUser.name}
        </Form.Item>
        <Form.Item label="电话"  {...formItemLayout}>
          {edit ? <Input placeholder="请输入电话"/> : currentUser && currentUser.mobile}
        </Form.Item>
        <Form.Item label="微信"  {...formItemLayout}>
          {edit ? <Input placeholder="请输入微信" disabled/> : currentUser && currentUser.target_wx}
        </Form.Item>
        <div className="line"/>
        <Form.Item label="微信昵称"  {...formItemLayout}>
          {edit ? <Input placeholder="请输入微信昵称" disabled/> : currentUser && currentUser.swx_nickname}
        </Form.Item>
        <Form.Item label="微信备注"  {...formItemLayout}>
          {edit ? <Input placeholder="请输入微信备注"/> : currentUser && currentUser.swx_memo}
        </Form.Item>
        <Form.Item label="企业微信"  {...formItemLayout}>
          {edit ? <Input placeholder="企业微信" disabled/> : currentUser && currentUser.server_wx}
        </Form.Item>
        <Form.Item label="添加日期"  {...formItemLayout}>

        </Form.Item>
        <Form.Item label="好友状态"  {...formItemLayout}>
          {edit ?
            getFieldDecorator('wx_status', {initialValue: ''})(
              <Select>
                <Select.Option value="">全部</Select.Option>
                <Select.Option value={-1}>已删除</Select.Option>
                <Select.Option value={1}>未删除</Select.Option>
                <Select.Option value={-2}>拉黑</Select.Option>
              </Select>
            ) : currentUser && wxStatus[currentUser.wx_status]}
        </Form.Item>
        <div className="line"/>
        <Form.Item label="下发时间"  {...formItemLayout}>
          {edit ? '' : currentUser && currentUser.time_create ? moment(currentUser.time_create).format('YYYY-MM-DD') : ''}
        </Form.Item>
        <Form.Item label="预约时间"  {...formItemLayout}>
          {edit ?
            <DatePicker/> : currentUser && currentUser.next_follow_time ? moment(currentUser.next_follow_time).format('YYYY-MM-DD') : ''}
        </Form.Item>
        <Form.Item label="跟进状态"  {...formItemLayout}>
          {edit ? <Select>
            <Select.Option value="">全部</Select.Option>
            {businessStatus.map(m => <Select.Option value={m.type} key={m.type}>{m.title}</Select.Option>)}
          </Select> : currentUser && currentUser.biz_status ? businessStatus[currentUser.biz_status].title : '未知'}
        </Form.Item>
        <Form.Item>
          {edit?<Button type="primary" block>确认</Button>:null}
        </Form.Item>
      </Form>
    </div>
  )
}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser
})

export default connect(mapStateToProps)(Form.create()(UserInfo))
