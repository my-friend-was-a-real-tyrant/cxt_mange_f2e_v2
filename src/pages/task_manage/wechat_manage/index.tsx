import React, {useState, useEffect, FunctionComponent, Fragment} from 'react';
import {Tabs, Button, message, Modal, Upload, Icon, Form, Input, Select,} from 'antd'
import fetch from 'fetch/axios'
import BaseTableComponent from 'components/BaseTableComponent'
import {EditableCell, EditableFormRow} from "components/BaseEditCellComponent.js"
import {FormComponentProps} from 'antd/lib/form';
import service from 'fetch/service'

interface IResult {
  data: Array<object>[];
  total: any;
  loading: boolean
}

interface Iupdate {
  id: number,
  memo: string,
  wx_account?: string
}

const WechatManage: FunctionComponent<FormComponentProps> = (props) => {
  const [result, setResult] = useState<IResult>({data: [], total: 0, loading: false})
  const [search, setSearch] = useState({offset: 1, limit: 10})
  const [uploadInfo, setUploadInfo] = useState<any>({uploadShow: false, fileContent: {id: '', importfile: ''}})
  const {uploadShow, fileContent} = uploadInfo;
  const [user, setUser] = useState<Array<object>>([])
  // const [companies, setCompanies] = useState<Array<object>>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number | string>>([])


  useEffect(() => {
    getWechat()
  }, [search])

  useEffect(() => {
    // getCompanies()
    service.getUser()
      .then((res: Array<object>) => setUser(res))
      .catch(() => setUser([]))
  }, [])

  // 获取菜单栏下的公司及坐席树
  const getCompanies = () => {
    fetch.get(`/apiv1/wx/getWxTree`, {params: {commond: 0}}).then((res: any) => {
      if (res.code === 20000) {
        const {treeVo} = res.data;
        // setCompanies(treeVo)
      } else {
        message.error(res.message)
      }
    })
  }

  // 获取微信列表
  const getWechat = (wechat?: number | string) => {
    const params = {
      // accountId: props.accountId,
      userId: props.form.getFieldValue('userId'),
      ...search,
      wechat: props.form.getFieldValue('wechat'),
      commond: 0,
    }
    setResult({...result, loading: true})
    fetch.get(`/apiv1/wx/getWxConfigList`, {params}).then((res: any) => {
      if (res.code === 20000) {
        setResult({data: res.data || [], total: res.count, loading: false})
      } else {
        setResult({data: [], total: 0, loading: false})
      }
    })
  }

  // 分配微信给坐席
  const distributeSeats = (userId: number) => {
    if (!selectedRowKeys || selectedRowKeys.length <= 0) return message.warning('请选择操作微信')
    console.log(selectedRowKeys)
    fetch.put(`/apiv1/wx/updateWxConfigUser`, {
      userId,
      wxConfigIds: selectedRowKeys.join(','),
    }).then((res: any) => {
      if (res.code === 20000) {
        setSearch({...search, offset: 1})
        message.success('分配成功')
        setSelectedRowKeys([])
      }
    })
  }

  // 禁用微信
  const handleDisabled = () => {
    if (!selectedRowKeys || selectedRowKeys.length <= 0) return message.warning('请选择操作微信')
    Modal.confirm({
      title: '提示',
      content: '当前操作不可恢复，您确定要继续么？',
      okType: 'danger',
      onOk() {
        const params = {
          wxConfigIds: selectedRowKeys.join(','),
          newStatus: 0,
        }
        return fetch.get(`/apiv1/wx/updateWxConfigStatus`, {params}).then((res: any) => {
          if (res.code === 20000) {
            const newData = [...result.data]
            newData.forEach((s: any) => {
              if (selectedRowKeys.indexOf(s.id) !== -1) {
                s.status = 0
              }
            })
            message.success('禁用成功')
            setResult({...result, data: [...newData]})
            setSelectedRowKeys([])
          }
        })
      }
    })
  }
  // 解绑微信
  const handleDelete = () => {
    if (!selectedRowKeys || selectedRowKeys.length <= 0) return message.warning('请选择操作微信')
    Modal.confirm({
      title: '提示',
      content: '当前操作不可恢复，您确定要继续么？',
      okType: 'danger',
      onOk() {
        return fetch.get(`/apiv1/wx/delWxConfigBindUser`, {params: {wxConfigIds: selectedRowKeys.join(',')}}).then((res: any) => {
          if (res.code === 20000) {
            setSelectedRowKeys([])
            setSearch({...search, offset: 1})
            message.success('解绑成功')
          }
        })
      }
    })
  }

  // 上传图片回调
  const handleUploadChange = ({file}: any) => {
    console.log(file)
    if (file && file.response && file.response.code === 20000) {
      setUploadInfo({...uploadInfo, fileContent: {...fileContent, importfile: file.response.data.targetFileName}})
    } else if (file && file.response && file.response.code !== 20000) {
      message.error(file.response.message || '上传失败')
    }
  }

  const onSubmitFile = () => {
    if (!fileContent.importfile) {
      return message.error('请先上传文件');
    }
    const params = {
      ...fileContent,
    }
    fetch.post(`/apiv1/wx/updateWxConfigSelfPic`, null, {params}).then((res: any) => {
      if (res.code === 20000) {
        setUploadInfo({uploadShow: false, fileContent: {id: '', importfile: ''}})
        getWechat()
        message.success('客服二维码上传成功')
      } else {
        message.error('客服二维码上传失败')
      }
    })
  }

  // 修改微信号
  const updateWxAccount = ({id, memo, wx_account}: Iupdate) => {
    const params = {
      id,
      wx_account,
    }
    fetch.post(`/apiv1/wx/updateWxConfig`, null, {params}).then((res: any) => {
      if (res.code === 20000) {
        const newData: any = []
        const {data} = result;
        data.map((s: any) => {
          if (s.id === id) {
            newData.push({...s, wx_account})
          } else {
            newData.push(s)
          }
        })
        setResult({...result, data: [...newData]})
        message.success('编辑成功')
      } else {
        message.error(res.message || '编辑失败')
      }
    })
  }

  // 修改微信备注
  const updateWxMemo = ({id, memo}: Iupdate) => {
    const params = {memo}
    fetch.get(`/apiv1/wx/updateWxConfigMemo/${id}`, {params}).then((res: any) => {
      if (res.code === 20000) {
        const newData: any = []
        const {data} = result;
        data.map((s: any) => {
          if (s.id === id) {
            newData.push({...s, memo})
          } else {
            newData.push(s)
          }
        })
        message.success('编辑成功')
        setResult({...result, data: [...newData]})
      } else {
        message.error(res.message || '编辑失败')
      }
    })
  }

  const handleTableChange = (pagination: any) => {
    setSearch({offset: pagination.current, limit: pagination.pageSize})
  }

  const columns = [
    {title: '微信id', dataIndex: 'wxAccountId', width: 200},
    {title: '微信昵称', dataIndex: 'wxNickname', width: 200},
    {title: '微信号', dataIndex: 'wx_account', editable: true,},
    {
      title: '客服二维码',
      dataIndex: 'self_add_pic',
      render: (text: string, row: any) => <div className="wx_user_pic"
                                               style={{textAlign: 'center'}}
                                               onClick={() => setUploadInfo({
                                                 uploadShow: true,
                                                 fileContent: {...fileContent, id: row.id}
                                               })}>
        {
          text ? <img src={process.env.REACT_APP_PIC_URL + text} alt="" style={{width: '30px', height: '30px'}}/> :
            <Button type="link" size="small"> 添加二维码</Button>
        }
      </div>
    },
    {title: '地区', dataIndex: 'mp_location'},
    {title: '备注', editable: true, dataIndex: 'memo'},
    {title: '分配公司', dataIndex: 'accountName'},
    {title: '分配坐席', dataIndex: 'userName', width: 200},
    {
      title: '微信状态',
      dataIndex: 'online',
      render: (online: number) => <span className={`mjoys-tag mjoys-${online ? 'tag__normal' : 'tag__error'} `}>
        {online ? '在线' : '离线'}
      </span>
    },
    {
      title: '加好友限制',
      dataIndex: 'disabled',
      render: (disabled: number) => <span className={`mjoys-tag mjoys-${disabled ? 'tag__disabled' : 'tag__normal'} `}>
        {disabled ? '被限制' : '正常'}
      </span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: number) => <span
        className={`mjoys-tag mjoys-${status === 1 ? 'tag__normal' : 'tag__disabled'} `}>
        {status === 1 ? '正常' : '禁用'}
      </span>
    },
    {title: '登录设备', dataIndex: 'device'}
  ]

  const rowSelection: object = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<number>) => setSelectedRowKeys(selectedRowKeys)
  }

  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell
    }
  }

  const newColumns = columns.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: ({id, memo, wx_account}: Iupdate) => {
          console.log(id, memo, wx_account)
          updateWxMemo({id, memo})
          updateWxAccount({id, memo, wx_account})
        }
      })
    }
  })

  const {getFieldDecorator} = props.form;
  const mjoysUser = JSON.parse(localStorage.getItem('mjoys_user') || '')
  // let users: any[] = companies.filter((v: any) => v.accountId === mjoysUser.accountId)
  // users = users.length ? users[0].users || [] : []


  return (
    <div style={{padding: '0 10px'}}>
      <Tabs>
        <Tabs.TabPane key="1" tab="企微列表">
          <Form layout="inline">
            <Form.Item>
              {getFieldDecorator('wechat')(
                <Input placeholder="微信id/微信昵称"/>
              )}
            </Form.Item>
            {
              mjoysUser.type === 1 ?
                <Fragment>
                  <Form.Item>
                    {getFieldDecorator('userId', {initialValue: '-1'})(
                      <Select style={{width: 200}}>
                        <Select.Option value="-1" key="-1">全部坐席</Select.Option>
                        <Select.Option value="-11" key="-11">未分配</Select.Option>
                        {user.map((v: any) => <Select.Option key={v.id} value={v.id}>{v.username}</Select.Option>)}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Select
                      style={{width: 200}}
                      onChange={(value: number) => distributeSeats(value)}
                      placeholder='分配坐席'
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input: any, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      {user.map((u:any)=> <Select.Option value={u.id} key={u.id}>
                        {u.username}
                      </Select.Option>)}
                    </Select>
                  </Form.Item>
                </Fragment> : null
            }
            <Form.Item>
              <Button type="primary" onClick={() => setSearch({...search, offset: 1})}>搜索 </Button>
            </Form.Item>
            <Form.Item>
              <Button.Group>
                <Button type="primary" onClick={() => handleDelete()}> 解绑坐席 </Button>
                <Button type="danger" onClick={() => handleDisabled()}> 禁用微信 </Button>
              </Button.Group>
            </Form.Item>
          </Form>
          <BaseTableComponent
            columns={newColumns}
            dataSource={result.data}
            components={components}
            total={result.total}
            loading={result.loading}
            rowSelection={rowSelection}
            rowKey="id"
            offset
            scroll={{x: 1550}}
            onChange={handleTableChange}
            bordered/>
        </Tabs.TabPane>
      </Tabs>

      <Modal visible={uploadShow}
             title="客服二维码"
             onOk={onSubmitFile}
             onCancel={() => setUploadInfo({uploadShow: false, fileContent: {id: '', importfile: ''}})}>
        <Upload
          onChange={(content: any) => handleUploadChange(content)}
          accept="image/*"
          action={`/apiv1/robot/file/uploadFile?access_token=${localStorage.getItem('access_token')}`}
          data={file => ({name: file.name, chunk: 0, chunks: 1})}>
          {
            !fileContent.importfile ? <Button type="primary" size="small">
              <Icon type="upload"/> 上传文件
            </Button> : null
          }
        </Upload>
      </Modal>
    </div>
  )
}

export default Form.create()(WechatManage)
