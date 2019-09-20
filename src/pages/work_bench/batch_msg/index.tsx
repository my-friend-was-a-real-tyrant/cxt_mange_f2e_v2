import React, {useState, useEffect, FC} from 'react';
import {Table, Button, Form, Input, Upload, Modal, Select, DatePicker, message} from 'antd';
import fetch from 'fetch/axios'
import {quickTimeSelect} from 'utils/utils'
import {FormComponentProps} from 'antd/lib/form';
import moment from 'moment'

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
}
const win: any = window
const U = win.U
const BatchShortMsg: FC<FormComponentProps> = (props) => {
  const [msgData, setMsgData] = useState({data: [], total: 0})
  const [search, setSearch] = useState({page: 1, pageSize: 10})
  const [loading, setLoading] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>('')
  const [msgContent, setMsgContent] = useState<string>('')
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const getMsgData = () => {
    const sendResult = props.form.getFieldValue('sendResult');
    const receiver = props.form.getFieldValue('receiver');
    const date = props.form.getFieldValue('time');
    const params = {
      access_token: localStorage.getItem('access_token'),
      accountId: localStorage.getItem('mjoys_account_id'),
      ...search,
      receiver,
      sendResult,
      startTime: date.length > 0 && date[0] ? moment(date[0]).format('YYYYMMDDHHmmss') : '',
      endTime: date.length > 0 && date[1] ? moment(date[1]).format('YYYYMMDDHHmmss') : '',
    }
    setLoading(true)
    fetch.get(`/apiv1/send/batch/shortmsg/list`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000) {
        setMsgData({
          data: res.data || [],
          total: res.count || 0
        })
      }
    })
  }

  useEffect(() => getMsgData(), [search])

  const handleSendMsg = () => {
    if (!msgContent) {
      return message.error('请填写发送内容')
    }
    if (!fileName) {
      return message.error('请上传发送数据')
    }
    const params = {
      access_token: localStorage.getItem('access_token'),
      importFile: fileName,
      accountId: localStorage.getItem('mjoys_account_id'),
      userId: localStorage.getItem('access_user_id'),
      content: msgContent,
    }
    setConfirmLoading(true)
    fetch.post(`/apiv1/send/batch/shortmsg`, null, {params}).then((res: any) => {
      setConfirmLoading(false)
      if (res.code === 20000) {
        message.success('发送成功')
        setSearch({...search, page: 1})
        setShow(false)
        setFileName('')
        setMsgContent('')
      }
    })
  }

  // 分页操作
  const handleChange = (pagination: any,) => {
    setSearch({
      page: pagination.current,
      pageSize: pagination.pageSize,
    })
  }

  const handleSearch = () => {
    setSearch({...search, page: 1,})
  }


  const uploadConfig = {
    action: `/apiv1/robot/file/uploadFile?access_token=${localStorage.getItem('access_token')}`,
    showUploadList: true,
    onChange(info: any) {
      if (info.file.status === 'done') {
        if (info.file.response.code === 20000) {
          setFileName(info.file.response.data.targetFileName)
        }
      } else if (info.file.status === 'error') {
        message.error('文件上传失败')
      }
    },
    onRemove: () => false,
    data: (file: any) => ({name: file.name, chunk: 0, chunks: 1})
  }
  const columns = [
    {title: '手机号', dataIndex: 'receiver', key: 'receiver'},
    {title: '发送内容', dataIndex: 'content', key: 'content'},
    {
      title: '发送结果',
      dataIndex: 'sendResult',
      key: 'sendResult',
      render: (result: any) => result === 'S0S' ? '发送成功' : result ? '发送失败' : ''
    },
    {title: '发送时间', dataIndex: 'timeCreate', key: 'timeCreate', width: 180,},
    {title: '上行回复', dataIndex: 'receiverReply', key: 'receiverReply'},
    {title: '回复时间', dataIndex: 'timeReceiverReply', key: 'timeReceiverReply', width: 180,},
  ]

  const {getFieldDecorator} = props.form;
  return (
    <div style={{padding: '20px'}}>
      <Form layout="inline">
        <Form.Item label="手机号">
          {getFieldDecorator('receiver', {initialValue: ''})(
            <Input placeholder="请输入短信接收人手机号"/>
          )}
        </Form.Item>
        <Form.Item label="发送结果">
          {getFieldDecorator('sendResult', {initialValue: -1})(
            <Select style={{width:150}}>
              <Select.Option value={-1}>全部</Select.Option>
              <Select.Option value={0}>发送失败</Select.Option>
              <Select.Option value={1}>发送成功</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="发送时间">
          {getFieldDecorator('time', {
            initialValue: [moment().add(-1, 'week').startOf('week'),
              moment().clone().set({
                hour: 23,
                minute: 59,
                second: 59,
                millisecond: 59
              }),]
          })(
            <DatePicker.RangePicker
              suffixIcon=" "
              format="YYYY-MM-DD"
              placeholder={['开始', '结束']}
              ranges={quickTimeSelect()}
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSearch}>搜索</Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => setShow(true)}>批量发送</Button>
        </Form.Item>
      </Form>
      <Table dataSource={msgData.data}
             rowKey={(row: any, index: number) => row.id || index}
             bordered size="middle"
             columns={columns}
             loading={loading}
             onChange={handleChange}
             pagination={{
               showQuickJumper: true,
               showSizeChanger: true,
               total: msgData.total,
               pageSizeOptions: ['10', '50', '100', '500', '1000'],
               showTotal: total => `总共 ${total} 条`,
             }}/>
      <Modal visible={show} title="批量发送短信"
             onCancel={() => setShow(false)} onOk={() => handleSendMsg()}
             okText={confirmLoading ? '发送中...' : "确定发送"}
             confirmLoading={confirmLoading}
             destroyOnClose>
        <Form>
          <Form.Item label="短信内容" {...formItemLayout}>
            <Input.TextArea placeholder="请输入短信发送内容"
                            rows={6}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMsgContent(e.target.value)}/>
          </Form.Item>
          <Form.Item label="发送数据" {...formItemLayout}>
            <div style={{display: 'flex'}}>
              <Upload {...uploadConfig}>
                {!fileName && <Button type="primary" icon="upload">上传文件</Button>}
                &nbsp;&nbsp;
              </Upload>
              <a href={`https://cxt.mjoys.com/api/1019/2019/9/20/20190920142812q4uiSO8.xlsx`}
                 download="phone-tpl">模版下载</a>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
const WrapperBatchShortMsg = Form.create()(BatchShortMsg)
export default WrapperBatchShortMsg



