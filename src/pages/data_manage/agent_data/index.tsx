import React, {FunctionComponent, useState, useEffect} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {DatePicker, Form, Button, Icon, Modal, Input, Upload, message, Tabs} from 'antd'
import fetch from 'fetch/axios'
import {FormComponentProps} from 'antd/lib/form'
import BaseTableComponent from 'components/BaseTableComponent'
import {quickTimeSelect, formatTime} from "utils/utils"
import moment from 'moment'

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const RobotData: FunctionComponent<FormComponentProps & RouteComponentProps> = (props) => {
  const [search, setSearch] = useState({limit: 10, offset: 1})
  const [fileName, setFileName] = useState('')
  const [show, setShow] = useState<number | boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState({data: [], total: 0})

  useEffect(() => {
    getList()
  }, [search])

  const getList = () => {
    const time = props.form.getFieldValue('time') || []
    const params = {
      ...search,
      starttime: formatTime(time, 'YYYYMMDD')[0],
      endtime: formatTime(time, 'YYYYMMDD')[1],
      offset: (search.offset - 1) * search.limit + 1,
    }
    setLoading(true)
    fetch.get(`/apiv1/otb/import/findTaskImportList`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000) {
        setResult({data: res.data.totalReport || [], total: res.count})
      }
    })
  }

  // 提交上传数据
  const onSubmit = () => {
    if (!fileName) return message.error('请先上传文件')
    props.form.validateFields((err, values) => {
      if (err) return false;
      const params = {
        accountid: show,
        showname: values.showname,
        memo: values.memo,
        importfile: fileName,
      }
      fetch.post(`/apiv1/otb/import/taskImport`, null, {params}).then((res: any) => {
        if (res.code === 20000) {
          setSearch({...search, offset: 1})
          setShow(false)
          setFileName('')
          message.success(`上传成功${res.data.success_count}条,重复${res.data.repeat_count}条,失败${res.data.error_count}条`)
        }
      })
    })
  }

  const jumpDetail = (row: any) => {
    props.history.push(`/app/agent_data/${row.account_id}`)
  }


  const {getFieldDecorator} = props.form;

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
  const handleTableChange = (pagination: any) => {
    setSearch({offset: pagination.current, limit: pagination.pageSize})
  }

  const columns = [
    {title: '账号名称', dataIndex: 'contact', key: 'contact',},
    {title: '批次数量', dataIndex: 'import_serial_num', key: 'import_serial_num',},
    {title: '数据总数量', dataIndex: 'importCount', key: 'importCount',},
    {title: '总任务数', dataIndex: 'sum', key: 'sum',},
    {title: '已完成任务数', dataIndex: 'finish_count', key: 'finish_count',},
    {title: '剩余任务数', dataIndex: 'not_finish_count', key: 'not_finish_count',},
    {
      title: '操作', width: 240, render: (row: any) =>
        <Button.Group className="Group">
          <Button type="primary" onClick={() => setShow(row.account_id)}><Icon type="cloud-upload"/>上传数据</Button>
          <Button type="primary" onClick={() => jumpDetail(row)}><Icon type="profile"/>查看详情</Button>
        </Button.Group>
    }
  ]

  return <div style={{padding: '0 10px'}}>
    <Tabs>
      <Tabs.TabPane key="1" tab="人工坐席数据管理">
        <Form layout="inline">
          <Form.Item label="日期">
            {getFieldDecorator('time', {
              initialValue: [
                moment().add(-1, 'week').startOf('week'),
                moment().clone().set({hour: 23, minute: 59, second: 59, millisecond: 59})
              ]
            })(
              <DatePicker.RangePicker
                format="YYYY-MM-DD"
                suffixIcon=" "
                placeholder={['开始日期', '结束日期']}
                ranges={quickTimeSelect()}
              />
            )}
          </Form.Item>
          <Form.Item label="日期">
            <Button type="primary" onClick={() => setSearch({...search, offset: 1})}>搜索</Button>
          </Form.Item>
        </Form>
        <BaseTableComponent
          columns={columns}
          dataSource={result.data}
          total={result.total}
          current={search.offset === 1 ? 1 : undefined}
          onChange={handleTableChange}
          loading={loading}
          bordered/>

        <Modal visible={Boolean(show)}
               title="上传数据"
               onOk={() => onSubmit()}
               onCancel={() => setShow(false)}
               destroyOnClose>
          <Form>
            <Form.Item label="展示名称" {...formItemLayout}>
              {getFieldDecorator('showname', {
                initialValue: '', rules: [
                  {
                    required: true,
                    message: '请填写正确的展示名称!',
                  },
                ]
              })(
                <Input placeholder="请填写展示名称"/>
              )}
            </Form.Item>
            <Form.Item label="详细描述" {...formItemLayout}>
              {getFieldDecorator('memo', {initialValue: ''})(
                <Input placeholder="请填写展示名称"/>
              )}
            </Form.Item>
            <Form.Item label="选择文件" {...formItemLayout}>
              <div style={{display: 'flex'}}>
                <Upload {...uploadConfig}>
                  {!fileName && <Button type="primary" icon="upload">上传文件</Button>}
                </Upload>
                &nbsp;
                &nbsp;
                <a href='/tpl/human-tpl.xlsx' download="human-tpl.xlsx">模版下载</a>
                &nbsp;
                &nbsp;
                <a href='/tpl/human-car-tpl.xlsc' download="human-car-tpl.xlsx">车险模版下载</a>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </Tabs.TabPane>
    </Tabs>
  </div>
}

export default Form.create()(RobotData)
