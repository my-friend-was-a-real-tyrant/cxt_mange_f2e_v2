import React, {FunctionComponent, useState, useEffect} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {Select, DatePicker, Form, Button, Icon, Modal, Input, Upload, message, Tabs} from 'antd'
import fetch from 'fetch/axios'
import {FormComponentProps} from 'antd/lib/form'
import BaseTableComponent from 'components/BaseTableComponent'
import {quickTimeSelect, formatTime} from "utils/utils"

interface IBusinessItem {
  business_id: number;
  business_name: string;
  status: number;
}

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
}

const RobotData: FunctionComponent<FormComponentProps & RouteComponentProps> = (props) => {

  const [businessList, setBusinessList] = useState<Array<IBusinessItem>>([])
  const [search, setSearch] = useState({limit: 10, offset: 1})
  const [fileName, setFileName] = useState('')
  const [show, setShow] = useState<number | boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState({data: [], total: 0})


  useEffect(() => getBusiness(), [])

  useEffect(() => getList(), [search])

  const getList = () => {
    const time = props.form.getFieldValue('time') || []
    const params = {
      ...search,
      starttime: formatTime(time, 'YYYYMMDD')[0],
      endtime: formatTime(time, 'YYYYMMDD')[1],
      business_id: props.form.getFieldValue('business_id') || -1,
    }
    setLoading(true)
    fetch.get(`/apiv1/oper/datasource/getDataSourceBatchListForDGJ`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000) {
        setResult({data: res.data || [], total: res.count})
      }
    })
  }


  // 获取业务
  const getBusiness = () => {
    fetch.get(`/apiv1/oper/get_business_by_company_userid`).then((res: any) => {
      if (res.code === 20000) {
        setBusinessList(res.data || [])
      }
    })
  }

  // 提交上传数据
  const onSubmit = () => {
    if (!fileName) return message.error('请先上传文件')
    props.form.validateFields((err, values) => {
      if (err) return false;
      const params = {
        businessId: show,
        showname: values.showname,
        comment: values.comment,
        importFile: fileName,
        is_join_call_plan: 0,
      }
      fetch.post(`/apiv1/oper/datasourcedetail/phoneImportForDGJ`, null, {params}).then((res: any) => {
        if (res.code === 20000) {
          setSearch({...search, offset: 1})
          setShow(false)
          message.success(`上传成功${res.data.success_count}条,重复${res.data.repeat_count}条,失败${res.data.error_count}条`)
        }
      })
    })

  }


  const {getFieldDecorator} = props.form;
  const businessOption = businessList.map((v: IBusinessItem) => <Select.Option
    key={v.business_id}>
    {v.business_name}{v.status !== 1 ? <span style={{color: 'red'}}>(停用)</span> : ''}
  </Select.Option>)

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

  const jumpDetail = (row: any) => {
    props.history.push(`/app/robot_data/${row.business_id}`)
  }


  const columns = [
    {title: '业务', dataIndex: 'business_name', key: 'business_name',},
    {title: '批次数量', dataIndex: 'upload_batch_cnt', key: 'upload_batch_cnt',},
    {title: '上传数量', dataIndex: 'upload_detail_cnt', key: 'upload_detail_cnt',},
    {title: '已拨打数', dataIndex: 'already_call', key: 'already_call',},
    {title: '剩余任务数', dataIndex: 'remain_task_cnt', key: 'remain_task_cnt',},
    {
      title: '操作', width: 240, render: (row: any) =>
        <Button.Group className="Group">
          <Button type="primary" onClick={() => setShow(row.business_id)}><Icon type="cloud-upload"/>上传数据</Button>
          <Button type="primary" onClick={() => jumpDetail(row)}><Icon type="profile"/>查看详情</Button>
        </Button.Group>
    }
  ]

  return <div style={{padding: '0 10px'}}>
    <Tabs>
      <Tabs.TabPane key="1" tab="机器人数据管理">
        <Form layout="inline">
          <Form.Item label="业务">
            {getFieldDecorator('business_id', {initialValue: "-1"})(
              <Select style={{width: 200}}>
                <Select.Option key="-1" value="-1">全部业务</Select.Option>
                {businessOption}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="日期">
            {getFieldDecorator('time', {initialValue: []})(
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
          rowKey="business_id"
          columns={columns}
          dataSource={result.data}
          total={result.total}
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
              {getFieldDecorator('comment', {initialValue: ''})(
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
                <a href={`/assets/download-tpl/human-car-tpl`} download="car-tpl">模版下载</a>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </Tabs.TabPane>
    </Tabs>
  </div>
}

export default Form.create()(RobotData)
