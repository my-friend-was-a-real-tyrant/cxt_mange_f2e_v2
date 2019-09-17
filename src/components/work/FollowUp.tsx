import React, {useState, useEffect, FunctionComponent} from 'react'
import {Button, Modal, Form, Input, DatePicker, Select, message} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import {connect} from 'react-redux'
import fetch from 'fetch/axios'
import moment from 'moment'
import BaseTableComponent from 'components/BaseTableComponent'
import * as actions from "../../store/actions/work"
import {Dispatch} from 'redux'

const formItemLayout = {
  labelCol: {span: 6},
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
  currentUser: any;
  workUsers: any;
  setWorkUsers: (value: any) => any;
  setCurrentUser: (value: any) => any
}

const FollowUp: FunctionComponent<IProps> = (props) => {
  const {currentUser, setCurrentUser, workUsers, setWorkUsers} = props;
  const {getFieldDecorator} = props.form;
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    getList()
  }, [currentUser])

  // 获取跟进记录
  const getList = () => {
    if (!currentUser) return false;
    const params = {
      customerId: currentUser && currentUser.id,
    }
    setLoading(true)
    fetch.get(`/apiv1/otb/followup/list`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setResult({data: res.data || [], total: res.count})
      }
    })
  }

  // 添加跟进记录
  const handleSubmit = () => {
    props.form.validateFields((err, values) => {
      const params = {
        ...values,
        aesMobile: currentUser.mobile && currentUser.auto_add_aes_mobile,
        accountId: JSON.parse(localStorage.getItem('mjoys_user') || '').accountId,
        seatId: localStorage.getItem('mjoys_user_id'),
        customerId: currentUser.id,
        timeAppoint: values.timeAppoint ? moment(values.timeAppoint).format('YYYY-MM-DD') : ''
      }
      fetch.post(`/apiv1/otb/followup/add`, null, {params}).then((res: any) => {
        if (res.code) {
          const {data} = workUsers
          const newData = data.map((v: any) => {
            if (v.id === currentUser.id) {
              return {...v, biz_status: values.followUpStatus, next_follow_time: values.timeAppoint}
            } else {
              return v
            }
          })
          setWorkUsers({...workUsers, data: newData})
          setCurrentUser({...currentUser, biz_status: values.followUpStatus, next_follow_time: values.timeAppoint})
          message.success('跟进记录添加成功')
          setShow(false)
          getList()
        }
      })
    })
  }
  // 删除跟进记录
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '提示?',
      content: '此操作不可恢复，您确定要继续么',
      onOk() {
        return fetch.post(`/apiv1/otb/followup/delete?id=${id}`).then((res: any) => {
          if (res.code === 20000) {
            getList()
            message.success('删除成功')
          }
        })
      }
    });
  }

  const columns = [
    {title: '跟进方式', dataIndex: 'followUpType', width: 100,},
    {
      title: '跟进状态',
      dataIndex: 'followUpStatus',
      width: 100,
      render: (status: number) => businessStatus[status - 1].title
    },
    {title: '跟进时间', dataIndex: 'timeCreate', width: 200,},
    {title: '跟进说明', dataIndex: 'remark', width: 300,},
    {title: '预约时间', dataIndex: 'timeAppoint', width: 140,},
    {
      title: '操作',
      width: 100,
      render: (row: any) => <Button type="link" onClick={() => handleDelete(row.id)}>删除</Button>
    },
  ]
  return <div style={{padding: '0 20px'}}>
    <BaseTableComponent
      columns={columns}
      loading={loading}
      dataSource={result.data}
      bordered={false}
      scroll={{x: 600}}
      total={result.total}/>
    <div style={{textAlign: 'center', marginTop: '20px'}}>
      <Button type="primary" onClick={() => setShow(true)} disabled={!currentUser}>添加跟进说明</Button>
    </div>
    <Modal visible={show}
           title="添加跟进说明"
           destroyOnClose
           onOk={handleSubmit}
           onCancel={() => setShow(false)}>
      <Form labelAlign="left">
        <Form.Item label="跟进方式" {...formItemLayout}>
          {getFieldDecorator('followUpType', {initialValue: 1})(
            <Select>
              <Select.Option value={1}>电话</Select.Option>
              <Select.Option value={2}>微信</Select.Option>
              <Select.Option value={3}>短信</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="跟进状态"  {...formItemLayout}>
          {getFieldDecorator('followUpStatus', {initialValue: 1})(
            <Select>
              {businessStatus.map(m => <Select.Option value={m.type} key={m.type}>{m.title}</Select.Option>)}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="预约时间"  {...formItemLayout}>
          {getFieldDecorator('timeAppoint')(
            <DatePicker format="YYYY-MM-DD" style={{width: '100%'}}/>
          )}
        </Form.Item>
        <Form.Item label="跟进说明"  {...formItemLayout}>
          {getFieldDecorator('remark', {initialValue: ''})(
            <Input.TextArea rows={5}/>
          )}
        </Form.Item>
      </Form>
    </Modal>
  </div>
}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser,
  workUsers: state.work.workUsers
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setWorkUsers: (value: any) => dispatch(actions.setWorkUsers(value)),
  setCurrentUser: (value: any) => dispatch(actions.setCurrentUser(value))
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create<IProps>()(FollowUp))
