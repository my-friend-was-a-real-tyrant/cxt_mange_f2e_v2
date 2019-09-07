import React, {useState, FunctionComponent} from 'react'
import {Modal, Form, Tabs, Input, Select, message} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import fetch from 'fetch/axios'
import {checkPhone, checkInsurance} from 'utils/utils'
import 'assets/styles/work.less'

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
  addFlag: boolean;
  onClose: () => void
}

const AddUser: FunctionComponent<IProps> = (props) => {

  const handleAddUser = () => {
    props.form.validateFields((err, values) => {
      if (!values.mobile && !values.license) {
        return message.error('车牌电话微信三选一必填')
      }
      if (values.mobile && !checkPhone(values.mobile)) {
        return message.error('请输入正确的手机号')
      }
      if (values.license && !checkInsurance(values.license)) {
        return message.error('请输入正确的车牌')
      }
      const params = {
        ...values,
      }
      fetch.post(`/apiv1/user-uni-data/save`, params).then((res: any) => {
        if (res.code === 20000) {
          props.onClose()
          message.success('用户添加成功')
        }
      })
    })
  }
  const {getFieldDecorator} = props.form;
  return (
    <div className="add-user">
      <Modal title="添加新用户"
             wrapClassName="add-user-modal"
             visible={props.addFlag}
             onCancel={() => props.onClose()}
             onOk={() => handleAddUser()}
             destroyOnClose>
        <Form labelAlign="left">
          <Tabs animated={false} size="small">
            <Tabs.TabPane key="1" tab="普通用户">
              <Form.Item label="车牌" {...formItemLayout}>
                {getFieldDecorator('license')(
                  <Input placeholder="请输入车牌号"/>
                )}
              </Form.Item>
              <Form.Item label="电话" {...formItemLayout}>
                {getFieldDecorator('mobile')(
                  <Input placeholder="请输入电话"/>
                )}
              </Form.Item>
              <Form.Item label="姓名" {...formItemLayout}>
                {getFieldDecorator('name')(
                  <Input placeholder="请输入姓名"/>
                )}
              </Form.Item>
              <Form.Item label="数据来源" {...formItemLayout}>
                {getFieldDecorator('license')(
                  <Input placeholder="请输入车牌号"/>
                )}
              </Form.Item>
              <Form.Item label="用户状态" {...formItemLayout}>
                {getFieldDecorator('biz_status', {initialValue: 1})(
                  <Select>
                    {businessStatus.map(m => <Select.Option value={m.type} key={m.type}>{m.title}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key="2" tab="微信用户">

            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Modal>
    </div>
  )
}

export default Form.create<IProps>()(AddUser)
