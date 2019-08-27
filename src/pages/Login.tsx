/*
 * @Author: sunyonghua
 * @Date: 2019-08-26 16:10:04
 * @Description: 登录界面
 */
import React, {FunctionComponent, ChangeEvent, FormEvent, useState} from 'react'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import {Form, Icon, Input, Button, Checkbox} from 'antd'
import fetch from 'fetch/axios'
import {FormComponentProps} from 'antd/lib/form'
import CryptoJS from "crypto-js";
import 'assets/styles/login.less'


const Login: FunctionComponent<FormComponentProps & RouteComponentProps> = (props) => {
  const [userStatus, setUserStatus] = useState<boolean>(false)
  // 检测用户是否存在
  const checkUser = (e: ChangeEvent<HTMLInputElement>) => {
    const params = {
      loginuser: e.target.value,
      appid: 'dgj',
      noToken: true
    }
    fetch.get(`/apiv1/app/manage/user/validate`, {params}).then((res: any) => {
      if (res.code === 20000 && res.data.exist === 0) {
        setUserStatus(true)
      } else {
        setUserStatus(false)
      }
    })
  }

  // 提交登录
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = {
      client_id: 'ROBOT',
      client_secret: 1,
      grant_type: "password",
      username: 'liuhao0627',
      password: CryptoJS.SHA1('&m34nh4fd22888888').toString(CryptoJS.enc.Hex),
    }
    fetch.post(`/api/oauth/token/getAccessToken`, null, {params}).then((res: any) => {
      console.log(res)
    })
  }

  const {getFieldDecorator} = props.form;
  return <Form onSubmit={handleSubmit} className="login-form">
    <Form.Item validateStatus={userStatus ? 'error' : 'validating'} help={userStatus ? '用户名校验失败!!' : ''}>
      {getFieldDecorator('username', {
        rules: [{required: true, message: '请输入正确的用户名!'}],
      })(
        <Input
          prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
          onBlur={(e: ChangeEvent<HTMLInputElement>) => checkUser(e)}
          onChange={() => setUserStatus(false)}
          placeholder="Username"
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('password', {
        rules: [{required: true, message: '请输入密码!'}],
      })(
        <Input
          prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
          type="password"
          placeholder="Password"
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('remember', {valuePropName: 'checked', initialValue: true})(
        <Checkbox>一周内登录不过期</Checkbox>
      )}
      <Button type="primary" htmlType="submit" className="login-form-button">
        登录
      </Button>
    </Form.Item>
  </Form>
}

export default withRouter(Form.create<FormComponentProps & RouteComponentProps>()(Login))
