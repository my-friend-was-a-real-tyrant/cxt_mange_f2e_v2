import React, {useState, FunctionComponent} from 'react'
import {Form, Modal, Input, message} from 'antd'
import {FormComponentProps} from 'antd/lib/form'
import fetch from 'fetch/axios'
import CryptoJS from "crypto-js";
import {withRouter, RouteComponentProps} from 'react-router-dom'

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};
const BaseUserComponent: FunctionComponent<FormComponentProps & RouteComponentProps> = (props) => {
  let user: any
  try {
    user = JSON.parse(localStorage.getItem('mjoys_user') || '')
  } catch (e) {
    props.history.push('/login')
  }

  const [show, setShow] = useState<boolean>(false)


  const onSubmit = () => {
    props.form.validateFields((err, values) => {
      if (err) return false;
      const params = {
        oldPassword: CryptoJS.SHA1(`&m34nh4fd22${values.oldPassword}`).toString(CryptoJS.enc.Hex),
        newPassword: CryptoJS.SHA1(`&m34nh4fd22${values.newPassword}`).toString(CryptoJS.enc.Hex),
      }
      fetch.post(`/apiv1/uac/manage/user/${user.userId}/password`, null, {params}).then((res: any) => {
        if (res.code === 20000) {
          setShow(false)
          message.success('修改成功')
        }
      })
    })
  }

  const logout = () => {
    localStorage.clear()
    props.history.push('/login')
  }

  const {getFieldDecorator} = props.form;
  return (
    <div className="user">
      <span>
        <i className="icon icon-user"/>
        {user && user.loginUser}
      </span>
      <span onClick={() => setShow(true)}>
        <i className="icon icon-password"/>
        修改密码
      </span>
      <span onClick={() => logout()}>
        <i className="icon icon-logout"/>
        退出
      </span>
      <Modal visible={show}
             title="修改密码"
             destroyOnClose
             okText="确认修改"
             onOk={onSubmit}
             onCancel={() => setShow(false)}>
        <Form>
          <Form.Item label="原密码" {...formItemLayout}>
            {getFieldDecorator('oldPassword', {
              rules: [
                {min: 6, message: '密码最少为6位'},
                {
                  required: true,
                  message: '请输入原密码!',
                },
              ]
            })(
              <Input placeholder="请输入原密码"/>
            )}
          </Form.Item>
          <Form.Item label="新密码" {...formItemLayout}>
            {getFieldDecorator('newPassword', {
              rules: [
                {min: 6, message: '密码最少为6位'},
                {
                  required: true,
                  message: '请输入新密码!',
                },
              ]
            })(
              <Input placeholder="请输入新密码"/>
            )}
          </Form.Item>
          <Form.Item label="确认新密码" {...formItemLayout}>
            {getFieldDecorator('newPassword', {
              rules: [
                {min: 6, message: '密码最少为6位'},
                {
                  required: true,
                  message: '请确认新密码!',
                },
              ]
            })(
              <Input placeholder="请输入新密码"/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
const WrapperBaseUser = Form.create<FormComponentProps & RouteComponentProps>()(BaseUserComponent)
export default withRouter(WrapperBaseUser)
