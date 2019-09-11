import React, {useState, useEffect, FunctionComponent} from 'react'
import {Button} from 'antd'
import fetch from 'fetch/axios'
import BaseTableComponent from 'components/BaseTableComponent'

const RoleManage: FunctionComponent = () => {
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState({offset: 1, limit: 10, order: '-timeModified'})


  useEffect(() => getRole(), [search])

  const getRole = () => {
    const params = {
      ...search,
      offset: (search.offset - 1) * search.limit + 1,
    }
    setLoading(true)
    fetch.get(`/apiv1/uac/roles`, {params}).then((res: any) => {
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
    {title: '名称', dataIndex: 'name'},
    {title: '角色编码', dataIndex: 'code'},
    {title: '创建时间', dataIndex: 'timeCreate'},
    {title: '更新时间', dataIndex: 'timeModified'},
    {
      title: '操作', width: 100, render: (row: any) => <Button.Group>
        <Button type="primary" icon="edit"/>
        <Button type="danger" icon="delete"/>
      </Button.Group>
    },
  ]
  return (
    <div>
      <BaseTableComponent
        columns={columns}
        dataSource={result.data}
        loading={loading}
        onChange={handleTableChange}
        current={search.offset === 1 ? search.offset : undefined}/>
    </div>
  )
}

export default RoleManage
