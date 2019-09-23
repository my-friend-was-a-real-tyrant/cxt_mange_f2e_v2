import React, {useState, useEffect, FunctionComponent} from 'react'
import {Form, Input, DatePicker, Button} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import fetch from 'fetch/axios'
import BaseTableComponent from 'components/BaseTableComponent'
import moment from 'moment'
import {formatTime, quickTimeSelect} from "utils/utils"

const WechatAddList: FunctionComponent<FormComponentProps> = (props) => {
  const [result, setResult] = useState({data: [], total: 0})
  const [search, setSearch] = useState({page: 1, pageSize: 10})
  const [loading, setLoading] = useState<boolean>(false)


  useEffect(() => {
    getList()
  }, [search])

  const getList = () => {
    const params = {
      ...search,
    }
    setLoading(true)
    fetch.get(`/apiv1/wx/wxFriendReport`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setResult({data: res.data || [], total: res.count || 0})
      }
    })
  }

  const handleTableChange = (pagiation: any, orderBy: string) => {
    setSearch({...search, page: pagiation.current, pageSize: pagiation.pageSize,})
  }

  const onSearch = () => {
    props.form.validateFields((err, values) => {
      const date = values.date;
      setSearch({
        ...search,
        ...values,
        timeBegin: formatTime(date, 'YYYY-MM-DD HH:mm:ss')[0],
        timeEnd: formatTime(date, 'YYYY-MM-DD HH:mm:ss')[1],
      })
    });
  }


  const columns = [
    {title: '微信大号ID', dataIndex: 'wx_account_id', key: 'wx_account_id'},
    {title: '微信大号（备注）', dataIndex: 'memo', key: 'memo'},
    {title: '昵称', dataIndex: 'wx_nickname', key: 'wx_nickname'},
    {title: '添加好友(个)', dataIndex: 'fnums', key: 'fnums'},
    {title: '创建时间', dataIndex: 'time_create', key: 'time_create'},
  ];
  const {getFieldDecorator} = props.form
  return (
    <div style={{padding: '0 20px'}}>
      <Form layout="inline">
        <Form.Item label="日期">
          {getFieldDecorator('date')(
            <DatePicker.RangePicker
              format="YYYY-MM-DD"
              ranges={quickTimeSelect()}
            />,
          )}
        </Form.Item>
        <Form.Item label="微信大号ID">{getFieldDecorator('wxid')(<Input placeholder="微信大号ID"/>)}</Form.Item>
        <Form.Item label="微信大号（备注）">{getFieldDecorator('memo')(<Input placeholder="请输入微信大号（备注）"/>)}</Form.Item>
        <Form.Item><Button type="primary" onClick={() => onSearch()}>搜索</Button></Form.Item>
      </Form>
      <BaseTableComponent
        columns={columns}
        dataSource={result.data}
        loading={loading}
        onChange={handleTableChange}
        total={result.total}/>
    </div>
  )
}

export default Form.create()(WechatAddList)
