import React, {useState, FunctionComponent} from 'react'
import {Modal, Form, Tabs, Input, Select, message, Spin} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import debounce from 'lodash/debounce';
import fetch from 'fetch/axios'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
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

interface IWechatUser {
  key: string;
  label: string;
}

interface IProps extends FormComponentProps {
  addFlag: boolean;
  onClose: () => void;
  thunkWorkUsers: () => void;
}

const AddUser: FunctionComponent<IProps> = (props) => {
  const [data, setData] = useState([])
  const [value, setValue] = useState<IWechatUser | undefined>(undefined)
  const [fetching, setFetching] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<string>('1')

  let lastFetchId = 0;

  const handleAddUser = () => {
    props.form.validateFields((err, values) => {
      if (!values.mobile && !values.license && !value) {
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
        originWxId: value ? value.key.split('@')[0] : '',
        targetWxId: value ? value.key.split('@')[1] : '',
      }
      fetch.post(`/apiv1/user-uni-data/save`, params).then(async (res: any) => {
        if (res.code === 20000) {
          props.onClose()
          message.success('用户添加成功')
          await props.thunkWorkUsers()
        }
      })
    })
  }

  //  添加微信用户
  const handleAddWxUser = () => {
    props.form.validateFields((err, values) => {
      const params = {
        targetAccount: values.targetAccount,
        type: 0,
        task_source: 3
      }
      fetch.get(`/apiv1/phonecallplan/sendSMSOrAddWechat`, {params}).then((res: any) => {
        if (res.code === 20000) {
          props.onClose()
          message.success('添加成功')
        }
      })
    })
  }

  let fetchUser = (value: any) => {
    console.log('fetching user', value);
    const params = {
      nickName: value,
    }
    setFetching(true)
    lastFetchId += 1;
    const fetchId = lastFetchId;
    fetch.get(`/apiv1/wx/simp-query-friend`, {params}).then((res: any) => {
      setFetching(false)
      if (fetchId !== lastFetchId) {
        return;
      }
      if (res.code === 20000 || res.code === 20003) {
        setData(res.data || [])
      }
    })
  }

  fetchUser = debounce(fetchUser, 800);

  const handleTabsChange = (key: string) => {
    setCurrentTab(key)
  }

  const handleChange = (value: any) => {
    console.log(value)
    setValue(value)
  }
  const {getFieldDecorator} = props.form;
  return (
    <div className="add-user">
      <Modal title="添加新用户"
             wrapClassName="add-user-modal"
             visible={props.addFlag}
             onCancel={() => props.onClose()}
             onOk={() => currentTab === '1' ? handleAddUser() : handleAddWxUser()}
             destroyOnClose>
        <Form labelAlign="left">
          <Tabs animated={false} size="small" onChange={handleTabsChange} activeKey={currentTab}>
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
              <Form.Item label="微信" {...formItemLayout}>
                <Select
                  allowClear
                  showSearch
                  labelInValue
                  value={value}
                  placeholder="请搜索微信"
                  notFoundContent={fetching ? <Spin size="small"/> : null}
                  filterOption={false}
                  onSearch={fetchUser}
                  onChange={handleChange}
                  style={{width: '100%'}}
                >
                  {data.map((d: any) => (
                    <Select.Option key={`${d.originWxId}@${d.targetWxId}@${d.id}`}>{d.wxNickname}</Select.Option>
                  ))}
                </Select>
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
              <Form.Item label="微信号码"  {...formItemLayout}>
                {getFieldDecorator('targetAccount', {initialValue: ''})(
                  <Input placeholder="请输入要添加的微信号码"/>
                )}
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Modal>
    </div>
  )
}
const WrapperAddUser = Form.create<IProps>()(AddUser)
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  thunkWorkUsers: () => dispatch(actions.thunkWorkUsers()),
})
export default connect(null, mapDispatchToProps)(WrapperAddUser)
