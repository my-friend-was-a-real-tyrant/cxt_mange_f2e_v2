import React, {FunctionComponent, useState} from 'react'
import {Form, Input, Select, DatePicker, Icon, Button, message, Empty} from 'antd'
import {connect} from 'react-redux'
import {FormComponentProps} from 'antd/es/form'
import fetch from 'fetch/axios'
import moment from 'moment'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
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
  workUsers: any;
  setWorkUsers: (value: any) => any;
  setCurrentUser: (value: any) => any
}

const UserInfo: FunctionComponent<IProps> = (props) => {
  const currentUser: any = props.currentUser;
  const [edit, setEdit] = useState<boolean>(false)
  const {workUsers, setWorkUsers, setCurrentUser} = props;
  const {data, total} = workUsers
  const handleChangeUserInfo = () => {
    props.form.validateFields((err, values) => {
      const params = {
        id: currentUser.id,
        ...values,
        wx_add_time: values.wx_add_time ? moment(values.wx_add_time).format('YYYY-MM-DD') : values.wx_add_time,
        next_follow_time: values.next_follow_time ? moment(values.next_follow_time).format('YYYY-MM-DD') : values.next_follow_time,
        time_create: values.time_create ? moment(values.time_create).format('YYYY-MM-DD') : values.time_create,
      }
      //TODO 查看返回数据extent字段 如果有id,则把列表中相同id数据删除
      fetch.post(`/apiv1/user-uni-data/update`, params).then(async (res: any) => {
        if (res.code === 20000) {
          message.success('修改成功')
          setEdit(false)
          const newData = await data.map((v: any) => {
            if (v.id === currentUser.id) {
              setCurrentUser({...v, ...res.data[0]})
              return {...v, ...res.data[0]}
            }
            return v
          })
          await setWorkUsers({total, data: [...newData]})
        }
      })
    })
  }

  const {getFieldDecorator} = props.form;
  return (
    <div className="right-panel-container">
      {currentUser ? <Form className="user-info-form" labelAlign="left">
        <div className="right-panel-title">
          <span className="title">用户信息</span>
          <span className="btn" onClick={() => setEdit(!edit)}>
            <b><Icon type="edit"/></b>&nbsp; {edit ? '取消' : '编辑'}
          </span>
        </div>
        <Form.Item label="车牌" {...formItemLayout}>
          {edit ? getFieldDecorator("license", {initialValue: currentUser && currentUser.license})(
            <Input placeholder="请输入车牌号"/>
          ) : currentUser && currentUser.license}
        </Form.Item>
        <Form.Item label="姓名"  {...formItemLayout}>
          {edit ? getFieldDecorator("name", {initialValue: currentUser && currentUser.name})(
            <Input placeholder="请输入姓名"/>
          ) : currentUser && currentUser.name}
        </Form.Item>
        <Form.Item label="电话"  {...formItemLayout}>
          {edit ? getFieldDecorator("mobile", {initialValue: currentUser && currentUser.mobile})(
            <Input placeholder="请输入电话"/>
          ) : currentUser && currentUser.mobile}
        </Form.Item>
        <Form.Item label="微信"  {...formItemLayout}>
          {edit ? <Input placeholder="请输入微信" disabled/> : currentUser && currentUser.target_wx}
        </Form.Item>
        <div className="line"/>
        <Form.Item label="微信昵称"  {...formItemLayout}>
          {edit ? <Input placeholder="请输入微信昵称" disabled/> : currentUser && currentUser.wx_nickname}
        </Form.Item>
        <Form.Item label="微信备注"  {...formItemLayout}>
          {edit ? getFieldDecorator("wx_memo", {initialValue: currentUser && currentUser.wx_memo})(
            <Input placeholder="请输入微信备注"/>
          ) : currentUser && currentUser.wx_memo}
        </Form.Item>
        <Form.Item label="企业微信"  {...formItemLayout}>
          {edit ? <Input placeholder="企业微信" disabled/> : currentUser && currentUser.server_wx}
        </Form.Item>
        <Form.Item label="添加日期"  {...formItemLayout}>
          {edit ? getFieldDecorator("wx_add_time", {initialValue: currentUser && currentUser.wx_add_time ? moment(currentUser.wx_add_time) : null})(
            <DatePicker disabled/>
          ) : currentUser && currentUser.wx_add_time ? moment(currentUser.wx_add_time).format('YYYY-MM-DD') : ''}
        </Form.Item>
        <Form.Item label="好友状态"  {...formItemLayout}>
          {edit ? getFieldDecorator('wx_status', {initialValue: currentUser && currentUser.wx_status})(
            <Select disabled>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value={-1}>已删除</Select.Option>
              <Select.Option value={1}>未删除</Select.Option>
              <Select.Option value={-2}>拉黑</Select.Option>
            </Select>
          ) : currentUser && wxStatus[currentUser.wx_status]}
        </Form.Item>
        <div className="line"/>
        <Form.Item label="下发时间"  {...formItemLayout}>
          {edit ? getFieldDecorator("time_create", {initialValue: currentUser && currentUser.time_create ? moment(currentUser.time_create) : null})(
            <DatePicker disabled/>
          ) : currentUser && currentUser.time_create ? moment(currentUser.time_create).format('YYYY-MM-DD') : ''}
        </Form.Item>
        <Form.Item label="预约时间"  {...formItemLayout}>
          {edit ? getFieldDecorator("next_follow_time", {initialValue: currentUser && currentUser.next_follow_time ? moment(currentUser.next_follow_time) : null})(
            <DatePicker/>
          ) : currentUser && currentUser.next_follow_time ? moment(currentUser.next_follow_time).format('YYYY-MM-DD') : ''}
        </Form.Item>
        <Form.Item label="跟进状态"  {...formItemLayout}>
          {edit ? getFieldDecorator('biz_status', {initialValue: currentUser && currentUser.biz_status})(
            <Select>
              <Select.Option value="">全部</Select.Option>
              {businessStatus.map(m => <Select.Option value={m.type} key={m.type}>{m.title}</Select.Option>)}
            </Select>) : currentUser && currentUser.biz_status ? businessStatus[currentUser.biz_status - 1].title : '未知'}
        </Form.Item>
        <Form.Item>
          {edit ? <Button type="primary" block onClick={handleChangeUserInfo}>确认</Button> : null}
        </Form.Item>
      </Form> : <Empty description="暂无用户信息"
                       image={`https://cxt.mjoys.com/mjoys_cxt_api/1019/2019/9/10/2019091019563595t5cmW.png`}/>}

    </div>
  )
}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser,
  workUsers: state.work.workUsers
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setWorkUsers: (value: any) => dispatch(actions.setWorkUsers(value)),
  setCurrentUser: (value: any) => dispatch(actions.setCurrentUser(value))
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UserInfo))
