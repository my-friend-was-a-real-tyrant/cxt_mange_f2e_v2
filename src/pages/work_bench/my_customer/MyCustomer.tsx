import React, {FunctionComponent, useState, useEffect} from 'react'
import fetch from 'fetch/axios'
import {Form, Input, Select, DatePicker, Button, Modal, message} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import BaseTableComponent from 'components/BaseTableComponent'
import {formatTime, quickTimeSelect} from "utils/utils"
import moment from 'moment'
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
const MyCustomer: FunctionComponent<FormComponentProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState({data: [], total: 0})
  const [search, setSearch] = useState({page: 1, pageSize: 10})

  useEffect(() => {
    getList()
  }, [search])

  const onSearch = () => {
    props.form.validateFields(async (err, values) => {
      const params = {
        uni_query: values.uni_query,
        biz_status: values.biz_status,
        reg_date_b: formatTime(values.regDate)[0],
        reg_date_e: formatTime(values.regDate)[1],
        create_time_b: formatTime(values.createTime, 'YYYY-MM-DD')[0],
        create_time_e: formatTime(values.createTime, 'YYYY-MM-DD')[1],
        next_follow_time_b: formatTime(values.nextTime, 'YYYY-MM-DD')[0],
        next_follow_time_e: formatTime(values.nextTime, 'YYYY-MM-DD')[1],
        page: 1,
      }
      setSearch({...search, ...params})
    })
  }

  const getList = () => {
    const params = {
      ...search,
      with_detail: 1,
    }
    setLoading(true)
    fetch.get(`/apiv1/user-uni-data/list`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setResult({data: res.data || [], total: res.count})
      }
    })
  }

  const handleDelete = (row: any) => {
    Modal.confirm({
      title: '提示?',
      content: '此操作不可恢复，您确定要继续么',
      okType: 'danger',
      onOk() {
        const params = {
          ids: row.id
        }
        return fetch.delete(`/apiv1/user-uni-data/delete`, {params}).then((res: any) => {
          if (res.code === 20000) {
            message.success('删除成功')
            getList()
          }
        })
      }
    })
  }

  const handleTableChange = (pagiation: any, orderBy: string) => {
    setSearch({...search, page: pagiation.current, pageSize: pagiation.pageSize})
  }

  const columns = [
    {title: '电话', dataIndex: 'mobile'},
    {title: '姓名', dataIndex: 'name'},
    {title: '车牌', dataIndex: 'license'},
    {title: '品牌/车型', dataIndex: 'brand'},
    {title: '车架号', dataIndex: 'cry_frame_no'},
    {title: '发动机号', dataIndex: 'cry_engine_no'},
    {title: '注册日期', dataIndex: 'src_time'},
    {title: '保险日期', dataIndex: 'reg_date'},
    {
      title: '下发日期',
      dataIndex: 'time_create',
      render: (time: string) => time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    {
      title: '预约日期',
      dataIndex: 'next_follow_time',
      render: (time: string) => time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    {title: '用户状态', dataIndex: 'biz_status'},
    {title: '操作', render: (row: any) => <Button type="danger" onClick={() => handleDelete(row)}>删除</Button>},
  ]
  const {getFieldDecorator} = props.form
  return (
    <div style={{padding: '20px'}}>
      <Form layout="inline">
        <Form.Item className="union_item">
          {getFieldDecorator('uni_query')(
            <Input placeholder="车牌/电话/微信/姓名"/>
          )}
        </Form.Item>
        <Form.Item label="预约日期">
          {getFieldDecorator('nextTime')(
            <DatePicker.RangePicker
              format="YYYY-MM-DD"
              suffixIcon=" "
              placeholder={['开始日期', '结束日期']}
              ranges={quickTimeSelect()}
            />
          )}
        </Form.Item>
        <Form.Item label="保险日期">
          {getFieldDecorator('regDate')(
            <DatePicker.RangePicker
              format="MM-DD"
              suffixIcon=" "
              placeholder={['开始日期', '结束日期']}
              ranges={quickTimeSelect()}
            />
          )}
        </Form.Item>
        <Form.Item label="下发日期">
          {getFieldDecorator('createTime')(
            <DatePicker.RangePicker
              format="YYYY-MM-DD"
              suffixIcon=" "
              placeholder={['开始日期', '结束日期']}
              ranges={quickTimeSelect()}
            />
          )}
        </Form.Item>
        <Form.Item label="跟进状态">
          {getFieldDecorator('biz_status', {initialValue: ''})(
            <Select>
              <Select.Option value="">全部状态</Select.Option>
              {businessStatus.map((m: any) => <Select.Option value={m.type} key={m.type}>{m.title}</Select.Option>)}
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" block onClick={onSearch}> 确定搜索</Button>
        </Form.Item>
      </Form>

      <BaseTableComponent
        onChange={handleTableChange}
        columns={columns}
        dataSource={result.data}
        loading={loading}
        current={search.page}
        total={result.total}/>
    </div>
  )
}
export default Form.create()(MyCustomer)
