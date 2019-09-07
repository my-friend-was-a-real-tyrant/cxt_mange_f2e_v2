import React, {useState, useEffect, FunctionComponent} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {Tabs, Form, Input, DatePicker, message, Button, Modal} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import BaseTableComponent from 'components/BaseTableComponent'
import fetch from 'fetch/axios'
import {formatTime, quickTimeSelect} from "../../../utils/utils"
import moment from 'moment'

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

interface IRouteProps {
  id: string;
}

const AgentDataDetail: FunctionComponent<FormComponentProps & RouteComponentProps<IRouteProps>> = (props) => {
  const [result, setResult] = useState({data: [], total: 0})
  const [search, setSearch] = useState({offset: 1, limit: 10})
  const [deleteRow, setDeleteRow] = useState({serial_no: '', serialno_id: 0})
  const [confirmLoading, setConfimLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    getDetailList()
  }, [search])

  const getDetailList = () => {
    const time = props.form.getFieldValue('time') || []
    const params = {
      ...search,
      accountid: props.match.params.id,
      starttime: formatTime(time, 'YYYYMMDD')[0],
      endtime: formatTime(time, 'YYYYMMDD')[1],
      offset: (search.offset - 1) * search.limit + 1,
    }
    setLoading(true)
    fetch.get(`/apiv1/otb/import/findTaskImportList/expand`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000) {
        setResult({data: res.data || [], total: res.count || 0})
      }
    })
  }

  // 删除数据
  const onSubmit = () => {
    props.form.validateFields((err, values) => {
      if (err) return false;
      setConfimLoading(true)
      fetch.delete(`/apiv1/otb/importSerialno/deleteSerialno/${props.match.params.id}/${deleteRow.serialno_id}?memo=${values.memo}`)
        .then((res: any) => {
          setConfimLoading(false)
          if (res.code === 20000) {
            message.success('删除成功')
            setSearch({...search, offset: 1})
            setDeleteRow({serialno_id: 0, serial_no: ''})
          }
        })
    })
  }

  const handleTableChange = (pagination: any) => {
    setSearch({offset: pagination.current, limit: pagination.pageSize})
  }


  const columns = [
    {title: '批次号', dataIndex: 'serial_no', sorter: true, width: 200},
    {title: '展示名称', dataIndex: 'show_name', sorter: true, width: 200},
    {title: '上传时间', dataIndex: 'time_create', sorter: true, width: 200},
    {title: '上传条数', dataIndex: 'upload_num', sorter: true, width: 200},
    {title: '已使用条数', dataIndex: 'called_count', sorter: true, width: 200},
    {title: '批次描述', dataIndex: 'memo', sorter: true, width: 200},
    {title: '删除原因', dataIndex: 'delete_memo', sorter: true, width: 200},
    {
      title: '操作',
      dataIndex: 'status',
      sorter: true,
      width: 100,
      render: (status: number, row: any) => status === 1 ?
        <Button type="danger"
                onClick={() => setDeleteRow({serial_no: row.serial_no, serialno_id: row.serialno_id})}>
          删除
        </Button>
        : null
    },
  ]

  const {getFieldDecorator} = props.form;

  return (
    <Tabs>
      <Tabs.TabPane key="1" tab="人工坐席数据详情">
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
          <Form.Item>
            <Button type="primary" onClick={() => setSearch({...search, offset: 1})}>搜索</Button>
          </Form.Item>
        </Form>
        <BaseTableComponent
          columns={columns}
          dataSource={result.data}
          loading={loading}
          total={result.total}
          current={search.offset === 1 ? 1 : undefined}
          bordered
          offset
          onChange={handleTableChange}/>
        <Modal title={`删除数据-${deleteRow.serial_no}`}
               visible={Boolean(deleteRow.serialno_id)}
               okText="确认删除"
               onOk={onSubmit}
               confirmLoading={confirmLoading}
               destroyOnClose
               onCancel={() => setDeleteRow({serial_no: '', serialno_id: 0})}>
          <Form>
            <Form.Item label="删除原因" {...formItemLayout}>
              {getFieldDecorator("memo", {
                rules: [
                  {
                    required: true,
                    message: '请输入删除原因!',
                  },
                ]
              })(
                <Input.TextArea placeholder="请输入删除原因"/>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Tabs.TabPane>
    </Tabs>
  )
}

export default Form.create()(AgentDataDetail)
