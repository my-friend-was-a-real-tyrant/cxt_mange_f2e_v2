import React, {useState, useEffect, FunctionComponent} from 'react'
import fetch from 'fetch/axios'
import {Button, Modal, Form, message, Input} from 'antd'
import moment from 'moment'
import {FormComponentProps} from 'antd/es/form'
import BaseTableComponent from 'components/BaseTableComponent'

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};
const TeamMange: FunctionComponent<FormComponentProps> = (props) => {

  const [teamResult, setTeamResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [show, setShow] = useState<boolean | string>(false)
  const [search, setSearch] = useState({page: 1, pageSize: 10})
  const [row, setRow] = useState<any>(null)
  useEffect(() => getTeam(), [search])

  const getTeam = () => {
    setLoading(true)
    fetch.get(`/apiv1/user_team/list`).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setTeamResult({data: res.data || [], total: res.count})
      }
    })
  }

  const handleSubmit = () => {
    props.form.validateFields((err, values) => {
      const params = {
        ...values
      }
      if (show === 'add') {
        fetch.post(`/apiv1/user_team/save`, params).then((res: any) => {
          if (res.code === 20000) {
            message.success('团队添加成功')
            setShow(false)
            setSearch({...search, page: 1})
          }
        })
      } else {
        fetch.put(`/apiv1/user_team/update`, {...params, id: row.id}).then((res: any) => {
          if (res.code === 20000) {
            message.success('团队编辑成功')
            setShow(false)
            setSearch({...search, page: 1})
          }
        })
      }
    })
  }

  const handleDelete = (row: any) => {
    Modal.confirm({
      title: '提示',
      content: '当前操作不可恢复，您确定要继续么？',
      okType: 'danger',
      onOk() {
        const params = {
          ids: row && row.id
        }
        return fetch.delete(`/apiv1/user_team/delete`, {params}).then((res: any) => {
          if (res.code === 20000) {
            message.success('团队删除成功')
            setSearch({...search, page: 1})
          }
        })
      }
    })
  }

  const handleTableChange = (pagination: any) => {
    setSearch({...search, page: pagination.current, pageSize: pagination.pageSize})
  }

  const {getFieldDecorator} = props.form;

  const columns = [
    {title: '编号', dataIndex: 'id'},
    {title: '团队名称', dataIndex: 'team_name'},
    {
      title: '创建时间',
      dataIndex: 'time_create',
      render: (time: any) => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
    },
    {
      title: '操作',
      width: 100,
      render: (row: any) => <Button.Group>
        <Button type="primary" icon="edit" onClick={() => {
          setRow(row)
          setShow('edit')
        }}/>
        <Button type="danger" icon="delete" onClick={() => handleDelete(row)}/>
      </Button.Group>
    }
  ]

  return (
    <div style={{padding: '0 20px'}}>
      <div style={{textAlign: 'right', marginBottom: 20}}>
        <Button type="primary" onClick={() => {
          setShow('add')
        }}>添加团队</Button>
      </div>
      <BaseTableComponent
        columns={columns}
        onChange={handleTableChange}
        dataSource={teamResult.data}
        loading={loading}
        total={teamResult.total}/>

      <Modal title={show === 'add' ? '添加团队' : '修改团队'}
             visible={Boolean(show)}
             destroyOnClose
             onOk={() => handleSubmit()}
             onCancel={() => setShow(false)}>
        <Form>
          <Form.Item label="团队名称" {...formItemLayout}>
            {
              getFieldDecorator('team_name', {initialValue: row && row.team_name})(
                <Input placeholder="请输入团队名称"/>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Form.create()(TeamMange)
