import React, {useState, useEffect, FunctionComponent, Fragment} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {Tabs, Form, Input, DatePicker, message, Button, Modal, Switch, Icon, Select} from 'antd'
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

const RobotDataDetail: FunctionComponent<FormComponentProps & RouteComponentProps<IRouteProps>> = (props) => {
  const [result, setResult] = useState({data: [], total: 0})
  const [opRow, setOpRow] = useState(null)
  const [search, setSearch] = useState({offset: 1, limit: 10})
  const [confirmLoading, setConfimLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    getDetailList()
  }, [search])

  const getDetailList = () => {
    const time = props.form.getFieldValue('time') || []
    const params = {
      ...search,
      business_id: props.match.params.id,
      starttime: formatTime(time, 'YYYYMMDD')[0],
      endtime: formatTime(time, 'YYYYMMDD')[1],
      offset: (search.offset - 1) * search.limit + 1,
    }
    setLoading(true)
    fetch.get(`/apiv1/oper/datasource/getDataSourceBatchListForDGJ/expand`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000) {
        setResult({data: res.data || [], total: res.count || 0})
      }
    })
  }

  // 修改状态
  const onChangeStatus = (status: number, row: any): void => {
    setConfimLoading(true)
    fetch.put(`/apiv1/oper/datasource/updateBatchStatus/${row.data_source_batch_id}/${status === 1 ? 0 : 1}`).then((res: any) => {
      setConfimLoading(false)
      if (res.code === 20000) {
        message.success(`状态${status === 1 ? '关闭' : '打开'}成功`)
        const data = result.data || []
        data.forEach((v: any) => {
          v.status = status === 1 ? 0 : 1;
        })
        setResult({...result, data: [...data]})
      }
    })
  }
  // 修改状态
  const onChangePlanStatus = (plan: number, row: any): void => {
    setConfimLoading(true)
    fetch.put(`/apiv1/oper/datasource/updatePlanStatus/${row.data_source_batch_id}/${plan === 1 ? 0 : 1}`).then((res: any) => {
      setConfimLoading(false)
      if (res.code === 20000) {
        message.success(`计划${plan === 1 ? '退出' : '加入'}成功`)
        const data = result.data || []
        data.forEach((v: any) => {
          v.is_join_call_plan = plan === 1 ? 0 : 1;
        })
        setResult({...result, data: [...data]})
      }
    })
  }


  // 导入数据
  const onSubmitImport = () => {
    props.form.validateFields((err, values) => {
      if (err) return false;
      const row: any = opRow
      const params = {
        dial_source_id: row.data_source_batch_id,
        memo: values.memo,
        resultStatus: values.resultStatus
      }
      fetch.post(`/apiv1/otb/import/taskImportFromDial`, null, {params}).then((res: any) => {
        if (res.code === 20000) {
          setOpRow(null)
          message.success(`导入成功${res.data.success_count}条`)
        }
      })
    })
  }
  // 删除数据
  const onSubmit = (row: any) => {
    Modal.confirm({
      title: '提示',
      content: '此操作不可恢复，您确定要继续么？',
      okType: 'danger',
      onOk() {
        return fetch.delete(`/apiv1/oper/datasource/deleteDataSourceBatch/${row.data_source_batch_id}`)
          .then((res: any) => {
            if (res.code === 20000) {
              message.success('删除成功')
            }
          })
      },
    });

  }

  const handleTableChange = (pagination: any) => {
    setSearch({offset: pagination.current, limit: pagination.pageSize})
  }


  const columns = [
    {title: '展示名称', dataIndex: 'show_name', sorter: true, width: 200},
    {title: '上传时间', dataIndex: 'time_create', sorter: true, width: 200},
    {title: '上传条数', dataIndex: 'upload_detail_cnt', sorter: true, width: 200},
    {title: '已拨打数', dataIndex: 'already_call_cnt', sorter: true, width: 200},
    {title: '剩余任务数', dataIndex: 'no_yet_call_cnt', sorter: true, width: 200},
    {title: '批次描述', dataIndex: 'comment', sorter: true, width: 200},
    {
      title: '加入拨打计划', dataIndex: 'is_join_call_plan', sorter: true, width: 200, render: (plan: number, row: any) =>
        <Switch checkedChildren={<Icon type="check"/>}
                disabled={row.status !== 1 || plan === 1}
                unCheckedChildren={<Icon type="close"/>}
                onClick={() => onChangePlanStatus(plan, row)}
                checked={plan === 1}
        />
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      width: 200,
      render: (status: number, row: any) =>
        <Switch checked={status === 1}
                onClick={() => onChangeStatus(status, row)}
                loading={confirmLoading}/>
    },
    {
      title: '操作',
      width: 240,
      render: (row: any) => <Fragment>
        <Button type="primary" onClick={() => setOpRow(row)}>导入数据</Button>
        &nbsp;
        <Button type="danger"
                onClick={() => onSubmit(row)}>
          删除
        </Button>
      </Fragment>
    },
  ]

  const {getFieldDecorator} = props.form;

  return (
    <Tabs tabBarExtraContent={<Button
      type="primary"
      onClick={() => props.history.push('/app/robot_data')}
      style={{marginRight: '20px'}}>返回上级列表</Button>}>
      <Tabs.TabPane key="1" tab="机器人数据详情">
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
          bordered
          current={search.offset === 1 ? 1 : undefined}
          onChange={handleTableChange}/>

        <Modal title={`导入数据`}
               visible={Boolean(opRow)}
               onOk={() => onSubmitImport()}
               onCancel={() => setOpRow(null)}
               confirmLoading={confirmLoading}
               destroyOnClose
               okText="确认导入">
          <Form>
            <Form.Item label="数据批次" {...formItemLayout}>
              {getFieldDecorator("resultStatus", {
                initialValue: -1,
                rules: [
                  {
                    required: true,
                    message: '请选择导入类型!',
                  },
                ]
              })(
                <Select>
                  <Select.Option value={-1}>导入全部</Select.Option>
                  <Select.Option value={1}>导入意向</Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="备注" {...formItemLayout}>
              {getFieldDecorator("memo", {
                rules: [
                  {
                    required: true,
                    message: '请输入备注!',
                  },
                ]
              })(
                <Input.TextArea placeholder="请输入备注"/>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Tabs.TabPane>
    </Tabs>
  )
}

export default Form.create()(RobotDataDetail)
