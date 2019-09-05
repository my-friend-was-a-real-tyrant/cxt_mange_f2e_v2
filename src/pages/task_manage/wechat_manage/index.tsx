import React, {useState, useEffect, FunctionComponent, Fragment} from 'react';
import {Tabs, Button, message, Modal, Upload, Icon, Form, Input, Select,} from 'antd'
import fetch from 'fetch/axios'
import BaseTableComponent from 'components/BaseTableComponent'
import {FormComponentProps} from 'antd/lib/form';
import service from 'fetch/service'

interface IResult {
  data: Array<object>[];
  total: any;
  loading: boolean
}

const WechatManage: FunctionComponent<FormComponentProps> = (props) => {
  const [result, setResult] = useState<IResult>({data: [], total: 0, loading: false})
  const [search, setSearch] = useState({offset: 1, limit: 10})
  const [uploadInfo, setUploadInfo] = useState<any>({uploadShow: false, fileContent: {id: '', importfile: ''}})
  const {uploadShow, fileContent} = uploadInfo;
  const [user, setUser] = useState<Array<object>>([])
  const [companies, setCompanies] = useState<Array<object>>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number | string>>([])


  useEffect(() => {
    getWechat()
  }, [search])

  useEffect(() => {
    getCompanies()
    service.getUser()
      .then((res: Array<object>) => setUser(res))
      .catch(() => setUser([]))
  }, [])

  // 获取菜单栏下的公司及坐席树
  const getCompanies = () => {
    fetch.get(`/apiv1/wx/getWxTree`, {params: {commond: 0}}).then((res: any) => {
      if (res.code === 20000) {
        const {treeVo} = res.data;
        setCompanies(treeVo)
      } else {
        message.error(res.message)
      }
    })
  }

  // 获取微信列表
  const getWechat = (wechat?: number | string) => {
    const params = {
      // accountId: props.accountId,
      // userId: props.userId,
      ...search,
      wechat: wechat || props.form.getFieldValue('wechatId'),
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
    fetch.put(`/apiv1/wx/updateWxConfigUser`, {
      userId,
      wxConfigIds: selectedRowKeys.join(','),
    }).then((res: any) => {
      if (res.code === 20000) {
        const newData: any[] = [];
        const {data} = result;
        data.forEach((s: any) => {
          if (selectedRowKeys.indexOf(s.id) === -1) {
            newData.push(s)
          }
        })
        setResult({...result, data: [...newData]})
        message.success('分配成功')
      }
    })
  }

  // 禁用微信
  const handleDisabled = () => {
    if (!selectedRowKeys || selectedRowKeys.length <= 0) return message.warning('请选择操作微信')
    const params = {
      wxConfigIds: selectedRowKeys.join(','),
      newStatus: 0,
    }
    fetch.get(`/apiv1/wx/updateWxConfigStatus`, {params}).then((res: any) => {
      if (res.code === 20000) {
        const newData = [...result.data]
        newData.forEach((s: any) => {
          if (selectedRowKeys.indexOf(s.id) !== -1) {
            s.status = 0
          }
        })
        setResult({...result, data: [...newData]})
      }
    })
  }
  // 删除微信
  const handleDelete = () => {
    if (!selectedRowKeys || selectedRowKeys.length <= 0) return message.warning('请选择操作微信')
    fetch.get(`/apiv1/wx/delWxConfigBind`, {params: {wxConfigIds: selectedRowKeys.join(',')}}).then((res: any) => {
      if (res.code === 20000) {
        const newData: any[] = [];
        const {data} = result;
        data.forEach((s: any) => {
          if (selectedRowKeys.indexOf(s.id) === -1) {
            newData.push(s)
          }
        })
        setResult({...result, data: [...newData]})
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

  const handleTableChange = (pagination: any) => {
    setSearch({offset: pagination.current, limit: pagination.pageSize})
  }

  const columns = [
    {title: '微信id', dataIndex: 'wxAccountId',},
    {title: '微信昵称', dataIndex: 'wxNickname',},
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

  const {getFieldDecorator} = props.form;
  const mjoysUser = JSON.parse(localStorage.getItem('mjoys_user') || '')
  let users: any[] = companies.filter((v: any) => v.accountId === mjoysUser.accountId)
  users = users.length ? users[0].users || [] : []


  return (
    <div style={{padding: '0 10px'}}>
      <Tabs>
        <Tabs.TabPane key="1" tab="企微列表">
          <Form layout="inline">
            <Form.Item>
              {getFieldDecorator('wechat')(
                <Input.Search
                  placeholder="微信id/微信昵称"
                  enterButton="搜索"
                  onSearch={value => getWechat(value)}/>
              )}
            </Form.Item>
            {
              mjoysUser.type === 1 ?
                <Fragment>
                  <Form.Item>
                    {getFieldDecorator('userId', {initialValue: ''})(
                      <Select style={{width: 200}}>
                        <Select.Option value="" key="-1">全部坐席</Select.Option>
                        {user.map((v: any) => <Select.Option key={v.id} value={v.contact}>{v.contact}</Select.Option>)}
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
                      {users.map(u => <Select.Option value={u.userId} key={u.userId}>
                        {u.userName}
                      </Select.Option>)}
                    </Select>
                  </Form.Item>
                </Fragment> : null
            }
            <Form.Item>
              <Button.Group>
                <Button type="primary" onClick={() => handleDelete()}> 解绑 </Button>
                <Button type="danger" onClick={() => handleDisabled()}> 禁用 </Button>
              </Button.Group>
            </Form.Item>
          </Form>
          <BaseTableComponent columns={columns}
                              dataSource={result.data}
                              total={result.total}
                              loading={result.loading}
                              rowSelection={rowSelection}
                              rowKey="wxAccountId"
                              offset
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