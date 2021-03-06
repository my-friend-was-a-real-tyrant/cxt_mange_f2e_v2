import React, {useState, useEffect, FunctionComponent} from 'react'
import {Form, Input, Select, DatePicker, Button, Tag, Checkbox, message, Modal} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {formatTime, quickTimeSelect, qsString} from "utils/utils"
import fetch from "fetch/axios"
import BaseTableComponent from 'components/BaseTableComponent'
import CallMsgRecord from './CallMsgRecord'

interface IBusinessItem {
  business_id: number;
  business_name: string;
  status: number;
}

const callStatus: any = {
  '0': {title: '未接通(未知原因)', color: 'red'},
  '1': {title: '已接通', color: 'green'},
  '101': {title: '无人接听', color: 'gold'},
  '102': {title: '空号', color: 'volcano'},
  '103': {title: '停机', color: 'magenta'},
  '104': {title: '无法接通', color: 'cyan'},
  '105': {title: '占线/拒接', color: 'geekblue'},
  '106': {title: '留言', color: 'purple'},
  '107': {title: '关机', color: 'orange'}
}

const resultStatus: any = {
  "-2": {title: '未分类', color: ''},
  "0": {title: '不确定', color: ''},
  "1": {title: '意向用户', color: ''},
  "2": {title: '非意向用户', color: ''},
}

const CallDetail: FunctionComponent<FormComponentProps> = (props) => {
  const [commentShow, setCommentShow] = useState<boolean>(false)
  const [row, setRow] = useState<any>(null)
  const [comment, setComment] = useState<string>('')
  const [businessList, setBusinessList] = useState<Array<IBusinessItem>>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string | number>>([])
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState({offset: 1, limit: 10})
  const [checkAll, setCheckAll] = useState<boolean>(false)
  const [recordRow, setRecordRow] = useState(null)
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => getBusiness(), [])

  useEffect(() => getDetailList(), [search])

  // 获取业务
  const getBusiness = () => {
    fetch.get(`/apiv1/oper/get_business_by_company_userid`).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        setBusinessList(res.data || [])
      }
    })
  }

  // 获取列表数据
  const getDetailList = () => {
    setLoading(true)
    props.form.validateFields((err, values) => {
      const params = {
        ...search,
        offset: (search.offset - 1) * search.limit + 1,
        start_time: formatTime(values.time, 'YYYYMMDDHHMM')[0],
        end_time: formatTime(values.time, 'YYYYMMDDHHMM')[1],
        ...values,
      }
      delete params.time;
      fetch.get(`/apiv1/robot/report/find_call_log_list_customer`, {params}).then((res: any) => {
        setLoading(false)
        if (res.code === 20000 || res.code === 20003) {
          const data = res.data || []
          data.forEach((v: any) => {
            // eslint-disable-next-line no-mixed-operators
            v.resultTypeName = v.resultTypeName && v.resultTypeName.split(',') || []
          })
          setResult({data: data || [], total: res.count || 0})
        }
      })
    })
  }

  // 重拨
  const handleCall = () => {
    props.form.validateFields((err, values) => {
      const params = {
        ...search,
        offset: (search.offset - 1) * search.limit + 1,
        start_time: formatTime(values.time, 'YYYYMMDDHHMM')[0],
        end_time: formatTime(values.time, 'YYYYMMDDHHMM')[1],
        ...values,
        is_all: checkAll ? 1 : 0,
        result_ids: checkAll ? -1 : selectedRowKeys.join(',')
      }
      fetch.put(`/apiv1/robot/report/batch_detail/call_again_customer`, null, {params}).then((res: any) => {
        if (res.code === 20000) {
          message.success(`重拨设置成功${res.data}条`)
          getDetailList()
          setSelectedRowKeys([])
        }
      })
    })

  }

  // 导出数据
  const handleExportData = () => {
    props.form.validateFields((err, values) => {
      const params = {
        ...search,
        offset: (search.offset - 1) * search.limit + 1,
        start_time: formatTime(values.time, 'YYYYMMDDHHMM')[0],
        end_time: formatTime(values.time, 'YYYYMMDDHHMM')[1],
        ...values,
        is_all: checkAll ? 1 : 0,
        result_ids: checkAll ? -1 : selectedRowKeys.join(',')
      }
      window.open(`/apiv1/robot/report/export_excelList_customer?${qsString(params)}&access_token=${localStorage.getItem('access_token')}`)
    })
  }

  // 保存备注
  const handleSaveComment = () => {
    const params = {
      comment: comment
    }
    fetch.put(`/apiv1/robot/report/updatedialresultcomment/${row.result_id}`, params).then((res: any) => {
      if (res.code === 20000) {
        message.success('备注添加成功')
        getDetailList()
        setCommentShow(false)
        setRow(null)
      }
    })
  }

  // 选中操作
  const onSelectChange = (value: any) => {
    setSelectedRowKeys(value)
  }

  const handleTableChange = (pagination: any) => {
    setSearch({offset: pagination.current, limit: pagination.pageSize})
  }


  const {getFieldDecorator} = props.form
  const businessOption = businessList.map((v: IBusinessItem) => <Select.Option
    key={v.business_id}>
    {v.business_name}{v.status !== 1 ? <span style={{color: 'red'}}>(停用)</span> : ''}
  </Select.Option>)

  const columns = [
    {title: '展示名称', dataIndex: 'show_name'},
    {title: '电话号码', dataIndex: 'phone'},
    {title: '拨打次数', dataIndex: 'call_num'},
    {title: '拨打时间', dataIndex: 'dail_time'},
    {
      title: '通话状态', dataIndex: 'call_status', render: (status: number) => (
        <Tag color={callStatus[status].color}>{callStatus[status].title}</Tag>
      )
    },
    {title: '通话时长', dataIndex: 'call_time'},
    {
      title: '用户分类', dataIndex: 'result_status', render: (status: number, row: any) => (
        <div className="user-type" style={{maxWidth: '200px'}}>
          <Tag color={resultStatus[status].color}>{resultStatus[status].title}</Tag>
          {row.resultTypeName.map((v: string) => <Tag key={v}>{v}</Tag>)}
        </div>
      )
    },
    {title: '备注', dataIndex: 'comment'},
    {
      title: '操作', width: 210, render: (row: any) => row.show_call_log === 1 ? <>
        {/*<Button.Group>*/}
        {/*<Button type="primary" icon="message" onClick={() => {*/}
        {/*  setRecordRow(row)*/}
        {/*  setShow(true)*/}
        {/*}}>通话记录</Button>*/}
        <Button type="primary" icon="profile" onClick={() => {
          setRow(row)
          setCommentShow(true)
        }}>备注</Button>
        {/*</Button.Group>*/}
      </> : <Button disabled>暂无对话记录</Button>
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div style={{padding: '10px'}}>
      <Form layout="inline">
        <Form.Item label="日期">
          {getFieldDecorator('time')(
            <DatePicker.RangePicker
              style={{width: 250}}
              format="YYYY-MM-DD"
              suffixIcon=" "
              placeholder={['开始日期', '结束日期']}
              ranges={quickTimeSelect()}
            />
          )}
        </Form.Item>
        <Form.Item label="业务">
          {getFieldDecorator('business_id', {initialValue: "-1"})(
            <Select style={{width: 200}}>
              <Select.Option key="-1" value="-1">全部业务</Select.Option>
              {businessOption}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="展示名称">
          {getFieldDecorator('show_name', {initialValue: ''})(
            <Input placeholder="请输入展示名称"/>
          )}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('phone_number', {initialValue: ''})(
            <Input placeholder="请输入手机号"/>
          )}
        </Form.Item>
        <Form.Item label="通话时长">
          {getFieldDecorator('duration', {initialValue: ''})(
            <Input addonAfter="s"/>
          )}
        </Form.Item>
        <Form.Item label="通话状态">
          {getFieldDecorator('call_status', {initialValue: "-1"})(
            <Select style={{width: 200}}>
              <Select.Option value="-1">全部状态</Select.Option>
              <Select.Option value="0">未接通(未知原因)</Select.Option>
              <Select.Option value="1">已接通</Select.Option>
              <Select.Option value="101">无人接听</Select.Option>
              <Select.Option value="102">空号</Select.Option>
              <Select.Option value="103">停机</Select.Option>
              <Select.Option value="104">无法接通</Select.Option>
              <Select.Option value="105">占线/拒接</Select.Option>
              <Select.Option value="106">留言</Select.Option>
              <Select.Option value="107">关机</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="自定义分类">
          {getFieldDecorator('resultTypeName', {initialValue: ''})(
            <Input placeholder="请输入分类"/>
          )}
        </Form.Item>
        <Form.Item label="用户意向">
          {getFieldDecorator('result_status', {initialValue: "-1"})(
            <Select style={{width: 200}}>
              <Select.Option value="-1">全部</Select.Option>
              <Select.Option value="1">意向</Select.Option>
              <Select.Option value="2">非意向</Select.Option>
              <Select.Option value="0">不确定</Select.Option>
              <Select.Option value="-2">未分类</Select.Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={() => setSearch({...search, offset: 1})}>搜索</Button>
        </Form.Item>
        <Form.Item>
          <Button.Group>
            <Button type={checkAll ? "primary" : "dashed"} onClick={() => setCheckAll(!checkAll)}>
              <Checkbox checked={checkAll} onChange={(e: CheckboxChangeEvent) => setCheckAll(e.target.checked)}/>
              &nbsp;
              选择全部
            </Button>
            <Button type="default"
                    icon="clock-circle"
                    disabled={!selectedRowKeys.length && !checkAll}
                    onClick={handleCall}>
              重拨选中
            </Button>
            <Button type="primary"
                    icon="cloud-download"
                    disabled={!selectedRowKeys.length && !checkAll}
                    onClick={handleExportData}>
              导出所选数据
            </Button>
          </Button.Group>
        </Form.Item>
      </Form>

      <BaseTableComponent
        rowSelection={rowSelection}
        rowKey="result_id"
        columns={columns}
        dataSource={result.data}
        total={result.total}
        current={search.offset === 1 ? 1 : undefined}
        onChange={handleTableChange}
        loading={loading}/>

      <Modal visible={Boolean(commentShow && row)}
             destroyOnClose
             onCancel={() => {
               setCommentShow(false)
               setRow(null)
             }}
             onOk={handleSaveComment}
             title={`添加备注-${row && row.phone}`}>
        <Input.TextArea rows={4}
                        defaultValue={row && row.comment}
                        placeholder={`请对${row && row.phone}通话添加备注`}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}/>
      </Modal>

      <Modal title="通话记录" visible={Boolean(recordRow && show)} onCancel={() => {
        setRecordRow(null)
        setShow(false)
      }}>
        <CallMsgRecord row={recordRow}/>
      </Modal>
    </div>
  )
}

export default Form.create()(CallDetail)
