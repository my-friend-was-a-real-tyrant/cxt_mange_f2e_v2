import React, {useState, useEffect, FunctionComponent} from 'react'
import {Button, Tree, Modal, message, Input} from 'antd'
import fetch from 'fetch/axios'
import composeMenu from 'utils/composeMenu'
import BaseTableComponent from 'components/BaseTableComponent'

interface IItemProps {
  code: string;
  id: number;
  parentId: number;
  url: string;
  other_url: string;
  name: string;
  status: number;
  children: Array<IItemProps>;
}

// interface IProps {
//   propsShow: boolean | string;
//   setPropsShow: (value: boolean) => any;
// }

const {TreeNode} = Tree;
const RoleManage: FunctionComponent = (props) => {
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState({offset: 1, limit: 10, order: '-timeModified'})
  const [treeData, setTreeData] = useState<Array<IItemProps>>([])
  const [editRow, setEditRow] = useState<any>(null)
  const [checkedKeys, setCheckedKeys] = useState([])
  const [show, setShow] = useState<boolean | string>(false)


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

  const getUserAuth = () => {
    const params = {
      roleid: editRow && editRow.id
    }
    fetch.get(`/apiv1/uac/role/pagefunctions`, {params}).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        const data = res.data || []
        const checkedKeys = data.map((v: any) => v.pageFunctionId).filter((v: number) => v !== null)
        setCheckedKeys(checkedKeys)
      }
    })
  }

  const getTree = () => {
    fetch.get(`/apiv1/uac/role/subfuncs`).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        const data = composeMenu(res.data)
        setTreeData(data)
        if (show === 'edit') {
          getUserAuth()
        }
      }
    })
  }

  const onCheck = (checkedKeys: any) => {
    setCheckedKeys(checkedKeys)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '提示',
      content: '此操作不可恢复，您确定要继续么？',
      okType: 'danger',
      onOk() {
        return fetch.delete(`/apiv1/uac/role/${id}`).then((res: any) => {
          if (res.code === 20000) {
            message.success('删除成功')
            getRole()
          }
        })
      }
    })
  }

  const handleAdd = () => {
    fetch.post(`/apiv1/uac/role/`, {name: editRow.name}).then((res: any) => {
      if (res.code === 20000) {
        setShow(false)
        setEditRow(null)
        message.success('名称保存成功')
        setSearch({...search, offset: 1})
        const params = {
          pageFuntionId: checkedKeys.map((v: string) => Number(v)),
          roleid: res.data.id
        }
        fetch.post(`/apiv1/uac/role/pagefunctions`, params).then((res: any) => {
          if (res.code === 20000) {
            setShow(false)
            setEditRow(null)
            message.success('添加成功')
            getRole()
          }
        })
      }
    })
  }

  const handleSave = () => {
    const params = {
      pageFuntionId: checkedKeys.map((v: string) => Number(v)),
      roleid: editRow && editRow.id
    }
    fetch.post(`/apiv1/uac/role/pagefunctions`, params).then((res: any) => {
      if (res.code === 20000) {
        setShow(false)
        setEditRow(null)
        message.success('权限编辑成功')
        fetch.put(`/apiv1/uac/role/${editRow && editRow.id}`, {name: editRow.name}).then((res: any) => {
          if (res.code === 20000) {
            setShow(false)
            setEditRow(null)
            message.success('名称保存成功')
            setSearch({...search, offset: 1})
          }
        })
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
        <Button type="primary" icon="edit" onClick={() => {
          setEditRow(row)
          getTree()
          setShow('edit')
        }}/>
        <Button type="danger" icon="delete" onClick={() => handleDelete(row && row.id)}/>
      </Button.Group>
    },
  ]

  const renderTreeNodes = (data: any) => {
    return data.map((item: any) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name}/>;
    });
  }
  return (
    <div style={{padding: '0 20px'}}>
      <div style={{textAlign: 'right', marginBottom: 20}}>
        <Button type="primary" onClick={() => {
          setShow('add')
          getTree()
          setCheckedKeys([])
        }}>添加角色</Button>
      </div>
      <BaseTableComponent
        columns={columns}
        dataSource={result.data}
        loading={loading}
        onChange={handleTableChange}
        current={search.offset === 1 ? search.offset : undefined}/>
      <Modal title="编辑角色"
             visible={Boolean(show)}
             onCancel={() => {
               setShow(false)
               setEditRow(null)
             }}
             destroyOnClose
             onOk={() => show === 'edit' ? handleSave() : handleAdd()}>
        <Input placeholder="请输入名称" value={editRow && editRow.name}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditRow({...editRow, name: e.target.value})}/>
        <Tree showLine checkable checkedKeys={checkedKeys} onCheck={onCheck} className="hide-file-icon">
          {renderTreeNodes(treeData)}
        </Tree>
      </Modal>
    </div>
  )
}

export default RoleManage
