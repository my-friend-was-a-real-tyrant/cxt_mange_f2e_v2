import React, {FunctionComponent, useState, useEffect} from 'react'
import {Button, Tooltip, Form, Input, DatePicker} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import fetch from "fetch/axios"
import BaseTableComponent from 'components/BaseTableComponent'
import {formatTime, quickTimeSelect} from "utils/utils"

const SubAccountManage: FunctionComponent<FormComponentProps> = (props) => {
  const {getFieldDecorator} = props.form
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState({offset: 1, limit: 10})


  useEffect(() => getRole(), [search])

  const getRole = () => {
    const time = props.form.getFieldValue('time');
    const search_value = props.form.getFieldValue('search_value');
    const params = {
      ...search,
      create_starttime: formatTime(time, 'YYYY-MM-DD')[0],
      create_endtime: formatTime(time, 'YYYY-MM-DD')[1],
      search_value,
      offset: (search.offset - 1) * search.limit + 1,
    }
    setLoading(true)
    fetch.get(`/apiv1/uac/manage/subusers`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000) {
        setResult({data: res.data || [], total: res.count || 0})
      }
    })
  }

  const handleTableChange = (pagination: any) => {
    setSearch({...search, offset: pagination.current, limit: pagination.pageSize})
  }

  const columns = [
    {title: '编号', dataIndex: 'id'},
    {title: '登录名', dataIndex: 'login_name'},
    {title: '姓名', dataIndex: 'user_name'},
    {title: '账号类型', dataIndex: 'role_code'},
    {title: '角色', dataIndex: 'roles'},
    {title: '业务', dataIndex: 'business'},
    {title: '创建时间', dataIndex: 'time_create'},
    {
      title: '操作', width: 120, render: () => <Button.Group>
        <Tooltip title="设置权限">
          <Button type="primary" icon="setting"/>
        </Tooltip>
        <Tooltip title="编辑权限">
          <Button icon="edit"/>
        </Tooltip>
        <Tooltip title="删除用户">
          <Button type="danger" icon="delete"/>
        </Tooltip>
      </Button.Group>
    },
  ]

  return (
    <div>
      <Form layout="inline">
        <Form.Item>
          {getFieldDecorator('search_value')(
            <Input placeholder="请输入登录名/用户名"/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('time')(
            <DatePicker.RangePicker ranges={quickTimeSelect()}/>
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
        onChange={handleTableChange}
        current={search.offset === 1 ? search.offset : undefined}/>
    </div>
  )
}
export default Form.create()(SubAccountManage)
