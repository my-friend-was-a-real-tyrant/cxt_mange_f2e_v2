import React, {FunctionComponent, useState, useEffect} from 'react'
import {Button, Tooltip, Form, Input, DatePicker, Modal, message, Tree, Radio, Select} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import fetch from "fetch/axios"
import BaseTableComponent from 'components/BaseTableComponent'
import {formatTime, quickTimeSelect} from "utils/utils"
import 'assets/styles/acccount-manage.less'

const {TreeNode} = Tree;

const SubAccountManage: FunctionComponent<FormComponentProps> = (props) => {
  const {getFieldDecorator} = props.form
  const [editRow, setEditRow] = useState<any>(null)
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState({offset: 1, limit: 10})
  const [show, setShow] = useState<boolean | string>(false)
  const [role, setRole] = useState([])
  const [roleCheckedKeys, setRoleCheckedKeys] = useState([])
  const [business, setBusiness] = useState([])
  const [businessCheckedKeys, setBusinessCheckedKeys] = useState([])
  const [team, setTeam] = useState<any>([])

  useEffect(() => getList(), [search])

  const getList = () => {
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

  const getRole = (id: number) => {
    const params = {
      offset: 1,
      limit: 100,
      order: '-timeModified'
    }
    fetch.get(`/apiv1/uac/roles`, {params}).then((res: any) => {
      if (res.code === 20000) {
        setRole(res.data || [])
        getUserRole(id)
      }
    })
  }

  const getBusiness = (id: number) => {
    fetch.get(`/apiv1/oper/get_business_by_company_userid`).then((res: any) => {
      if (res.code === 20000) {
        setBusiness(res.data || [])
        getUserBusiness(id)
      }
    })
  }

  const getUserRole = (id: number) => {
    const params = {
      accountid: id,
      userid: id
    }
    fetch.get(`/apiv1/uac/userroles`, {params}).then((res: any) => {
      if (res.code === 20000) {
        const data = res.data || []
        setRoleCheckedKeys(data.map((v: any) => v.roleid))
      }
    })
  }

  const getUserBusiness = (id: number) => {
    const params = {
      userId: id,
    }
    fetch.get(`/apiv1/uac/user/business`, {params}).then((res: any) => {
      if (res.code === 20000) {
        const data = res.data || []
        setBusinessCheckedKeys(data.map((v: any) => v.id))
      }
    })
  }

  const saveRole = () => {
    const params = {
      roleid: roleCheckedKeys,
      userid: editRow.id,
    }
    const params2 = {
      businessids: businessCheckedKeys,
      userId: editRow.id,
    }
    fetch.post(`/apiv1/uac/userroles`, params).then((res: any) => {
      if (res.code === 20000) {
        message.success('保存成功')
        setEditRow(null)
        setShow(false)
        setRoleCheckedKeys([])
      }
      fetch.post(`/apiv1/uac/user/business`, params2).then((res: any) => {
        if (res.code === 20000) {
          message.success('保存成功')
          setBusinessCheckedKeys([])
          setSearch({...search, offset: 1})
        }
      })
    })
  }

  const onCheckRole = (checkedKeys: any) => {
    setRoleCheckedKeys(checkedKeys)
  }

  const onCheckBusiness = (checkedKeys: any) => {
    setBusinessCheckedKeys(checkedKeys)
  }

  // 获取团队列表
  const getTeam = () => {
    const params = {
      page: 1,
      pageSize: 100,
    }
    fetch.get(`/apiv1/user_team/list`, {params}).then((res: any) => {
      if (res.code === 20000) {
        setTeam(res.data || [])
      }
    })
  }

  // 保存子账号
  const saveSubAccount = () => {
    props.form.validateFields((err, values) => {
      const params = {
        ...values,
        type: 2,
      }
      fetch.post(`/apiv1/uac/manage/user`, params).then((res: any) => {
        if (res.code === 20000) {
          message.success('添加成功')
          setShow(false)
          setEditRow(null)
          setSearch({...search, offset: 1})
        }
      })
    })
  }

  // 编辑子账号
  const handleChangeAccount = () => {
    props.form.validateFields((err, values) => {
      const params = {
        email: '',
        ...values,
        type: 2,
      }
      fetch.put(`/apiv1/uac/manage/user/${editRow && editRow.id}`, params).then((res: any) => {
        if (res.code === 20000) {
          message.success('编辑成功')
          setShow(false)
          setEditRow(null)
          setSearch({...search, offset: 1})
        }
      })
    })
  }

  // 删除子账号
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '提示',
      content: '此操作不可恢复，您确定要继续么？',
      okType: 'danger',
      onOk() {
        return fetch.delete(`/apiv1/uac/manage/user/${id}`).then((res: any) => {
          if (res.code === 20000) {
            message.success('删除成功')
            getList()
          }
        })
      }
    })
  }

  const handleTableChange = (pagination: any) => {
    setSearch({...search, offset: pagination.current, limit: pagination.pageSize})
  }
  const codeMap: any = {
    '1': '普通坐席',
    '2': '管理员',
    '3': '超级坐席',
  }

  const columns = [
    {title: '编号', dataIndex: 'id'},
    {title: '登录名', dataIndex: 'login_name'},
    {title: '姓名', dataIndex: 'user_name'},
    {title: '账号类型', dataIndex: 'role_code', render: (code: string) => codeMap[code]},
    {title: '角色', dataIndex: 'roles'},
    {title: '业务', dataIndex: 'business'},
    {title: '所属团队', dataIndex: 'team_name'},
    {title: '手机号', dataIndex: 'mobilephone'},
    {title: '邮箱', dataIndex: 'email', width: 200,},
    {title: '创建时间', dataIndex: 'time_create'},
    {
      title: '操作', width: 120, render: (row: any) => <Button.Group>
        <Tooltip title="设置权限">
          <Button type="primary" icon="setting" onClick={() => {
            setEditRow(row)
            setShow('setting')
            getRole(row && row.id)
            getBusiness(row && row.id)
          }}/>
        </Tooltip>
        <Tooltip title="编辑权限">
          <Button icon="edit" onClick={() => {
            setEditRow(row)
            getTeam()
            setShow('edit')
          }}/>
        </Tooltip>
        <Tooltip title="删除用户">
          <Button type="danger" icon="delete" onClick={() => handleDelete(row && row.id)}/>
        </Tooltip>
      </Button.Group>
    },
  ]

  const renderTreeNodes = (data: any) => {
    return data.map((item: any) => {
      return <TreeNode key={item.id} title={item.name}/>;
    });
  }
  console.log(editRow)
  return (
    <div style={{padding: '0 20px'}}>
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
        <Form.Item>
          <Button type="primary" onClick={() => {
            getTeam()
            setShow('add')
          }}>添加子账号</Button>
        </Form.Item>
      </Form>
      <BaseTableComponent
        columns={columns}
        dataSource={result.data}
        loading={loading}
        onChange={handleTableChange}
        scroll={{x: 1400}}
        current={search.offset === 1 ? search.offset : undefined}/>


      <Modal title="设置权限"
             destroyOnClose
             visible={show === 'setting'}
             onOk={() => saveRole()}
             onCancel={() => {
               setEditRow(null)
               setRoleCheckedKeys([])
               setBusinessCheckedKeys([])
               setShow(false)
             }}>
        <div className="setting-role-inner">
          <div className="role-setting">
            <Tree showLine checkable checkedKeys={roleCheckedKeys} onCheck={onCheckRole} className="hide-file-icon">
              <TreeNode title="全部" key="0-0">
                {renderTreeNodes(role)}
              </TreeNode>
            </Tree>
          </div>
          <div className="business-setting">
            <Tree showLine checkable checkedKeys={businessCheckedKeys} onCheck={onCheckBusiness}
                  className="hide-file-icon">
              <TreeNode title="全部" key="0-0">
                {business.map((item: any) => <TreeNode key={item.business_id} title={item.business_name}/>)}
              </TreeNode>
            </Tree>
          </div>
        </div>
      </Modal>


      <Modal title="添加子账号"
             destroyOnClose
             visible={show === 'add'}
             onOk={() => saveSubAccount()}
             onCancel={() => {
               setShow(false)
             }}>
        <Form labelAlign="left">
          <Form.Item label="登录名" {...formItemLayout}>
            {getFieldDecorator('contact')(
              <Input placeholder="请输入登录名"/>
            )}
          </Form.Item>
          <Form.Item label="姓名"  {...formItemLayout}>
            {getFieldDecorator('user')(
              <Input placeholder="请输入姓名"/>
            )}
          </Form.Item>
          <Form.Item label="密码"  {...formItemLayout}>
            {getFieldDecorator('password')(
              <Input type="password" placeholder="请输入密码"/>
            )}
          </Form.Item>
          <Form.Item label="手机"  {...formItemLayout}>
            {getFieldDecorator('mobilephone')(
              <Input placeholder="请输入手机号"/>
            )}
          </Form.Item>
          <Form.Item label="邮箱"  {...formItemLayout}>
            {getFieldDecorator('email')(
              <Input placeholder="请输入手机号"/>
            )}
          </Form.Item>
          <Form.Item label="是否坐席"  {...formItemLayout}>
            {getFieldDecorator('isSip', {initialValue: 0})(
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          {
            props.form.getFieldValue('isSip') === 1 ?
              <Form.Item label="坐席类型"  {...formItemLayout}>
                {getFieldDecorator('roleCode')(
                  <Select>
                    <Select.Option value={1}>普通坐席</Select.Option>
                    <Select.Option value={3}>超级坐席</Select.Option>
                  </Select>
                )}
              </Form.Item> : null
          }
          <Form.Item label="所属团队"  {...formItemLayout}>
            {getFieldDecorator('team_id', {initialValue: team.length && team[0].id})(
              <Select>
                {team.map((v: any) => <Select.Option key={v.id} value={v.id}>{v.team_name}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="编辑子账号"
             destroyOnClose
             visible={show === 'edit'}
             onOk={() => handleChangeAccount()}
             onCancel={() => {
               setShow(false)
             }}>
        {editRow ? <Form labelAlign="left">
            <Form.Item label="登录名" {...formItemLayout}>
              {getFieldDecorator('contact', {initialValue: editRow.login_name})(
                <Input placeholder="请输入登录名"/>
              )}
            </Form.Item>
            <Form.Item label="手机"  {...formItemLayout}>
              {getFieldDecorator('mobilephone', {initialValue: editRow && editRow.mobilephone})(
                <Input placeholder="请输入手机号"/>
              )}
            </Form.Item>
            <Form.Item label="邮箱"  {...formItemLayout}>
              {getFieldDecorator('email', {initialValue: editRow && editRow.email})(
                <Input placeholder="请输入邮箱号码"/>
              )}
            </Form.Item>
            <Form.Item label="是否坐席"  {...formItemLayout}>
              {getFieldDecorator('isSip', {initialValue: (editRow && editRow.role_code) === '0' || (editRow && !editRow.role_code) ? 0 : 1})(
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            {
              props.form.getFieldValue('isSip') === 1 ?
                <Form.Item label="坐席类型"  {...formItemLayout}>
                  {getFieldDecorator('roleCode', {initialValue: editRow.role_code === '0' ? '1' : editRow.role_code})(
                    <Select>
                      <Select.Option value={'1'}>普通坐席</Select.Option>
                      <Select.Option value={'2'}>管理员</Select.Option>
                      <Select.Option value={'3'}>超级坐席</Select.Option>
                    </Select>
                  )}
                </Form.Item> : null
            }
            <Form.Item label="所属团队"  {...formItemLayout}>
              {getFieldDecorator('team_id', {initialValue: editRow && editRow.team_id})(
                <Select>
                  {team.map((v: any) => <Select.Option key={v.id} value={v.id}>{v.team_name}</Select.Option>)}
                </Select>
              )}
            </Form.Item>
          </Form>
          : null}
      </Modal>
    </div>
  )
}

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 19},
};
export default Form.create()(SubAccountManage)
