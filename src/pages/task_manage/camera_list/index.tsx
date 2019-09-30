import React, {FunctionComponent, useState, useEffect} from 'react';
import {Tabs, Button, Select, Row, Col, message, Modal, Form, Input} from 'antd'
import {FormComponentProps} from 'antd/lib/form';
import fetch from 'fetch/axios'
import BaseTableComponent from 'components/BaseTableComponent'
import service from "../../../fetch/service";
// import {Select} from "antd/lib/select";

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
};

enum filterStatus {
    "删除" = -1,
    "停用" = 0,
    "正常" = 1
}

interface ISearchProps {
    page: number,
    pageSize: number,
    orderBy: string
}

interface IProps extends FormComponentProps {
    onSearch: (values: any) => any;
    user: any
}

// 摄像头列表
const CameraList: FunctionComponent<IProps> = (props) => {
    const [messageList, setMessageList] = useState<any>([])
    const [pageInfo, setPageInfo] = useState<ISearchProps>({page: 1, pageSize: 10, orderBy: ''})
    const [total, setTotal] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [visible, setVisible] = useState<string>('')
    const [editRow, setEditRow] = useState<any>(null)
    const [user, setUser] = useState<Array<object>>([])
    const [accountList, setAccountList] = useState<Array<object>>([])
    const [businessList, setBusinessList] = useState<Array<object>>([])
    useEffect(() => {
        getMessage()
        getAccount()
        service.getUser()
            .then((res: Array<object>) => setUser(res))
            .catch(() => setUser([]))
    }, [pageInfo]);

    // 获取短信模版
    const getMessage = (): void => {
        const {page, pageSize} = pageInfo;
        props.form.validateFields((err, values) => {
            const params = {
                page,
                pageSize,
                address_code: values.address_code,
                seatId: values.seatId
            }
            setLoading(true)
            fetch.get(`/apiv1/camera/list`, {params}).then((res: any) => {
                setLoading(false)
                if (res.code === 20000 || res.code === 20003) {
                    setTotal(res.count || 0)
                    res.data.map((item: any) => {
                        if (item.user_ids) {
                            item.user_ids = item.user_ids.split(',').map((item: any) => {
                                return parseInt(item)
                            })
                        } else {
                            item.user_ids = []
                        }
                        return item
                    })
                    setMessageList(res.data || [])
                } else {
                    setMessageList([])
                }
            })
        })
    }

    const handleChange = (value: any): void => {
        // console.log(value)
        // console.log(`selected ${value}`);
    }

    // 新增编辑短信模版
    const onSubmitMsgTemplate = (e: any): void => {
        e.preventDefault();
        props.form.validateFields((err: any, values: any) => {
            if (!err) {
                let params: any = {
                    'edit': {
                        "account_id": values.account_id,
                        "address": values.address,
                        "address_code": values.address_code2,
                        "code": values.code,
                        "ip": values.ip,
                        "user_ids": values.user_ids.join(',') + '',
                        id: editRow && editRow.id,
                    },
                    'add': {
                        "account_id": values.account_id,
                        "address": values.address,
                        "address_code": values.address_code2,
                        "code": values.code,
                        "ip": values.ip,
                        "user_ids": values.user_ids.join(',') + '',
                    },
                }
                // console.log(params)
                let url = visible === 'edit' ? '/apiv1/camera/update' : '/apiv1/camera/add'
                fetch[visible === 'edit' ? 'put' : 'post'](url, {...params[visible]}).then((res: any) => {
                    if (res.code === 20000) {
                        message.success('操作成功')
                        setVisible('')
                        getMessage()
                    } else {
                        message.error(res.message || '操作失败')
                    }
                })
            }
        });
    }

    // 删除短信模版
    const onDeleteMsgTemplate = async (id: number) => {
        const params = {
            ids: id,
        }
        Modal.confirm({
            title: '提示!',
            content: '此操作不可恢复，确定继续？',
            onOk: () => {
                fetch.put(`/apiv1/camera/status`, {params}).then((res: any) => {
                    if (res.code === 20000) {
                        message.success('删除成功')
                        getMessage()
                    } else {
                        message.error('删除失败')
                    }
                })
            }
        })
    }
    // 获取公司
    const getAccount = () => {
        fetch.get(`/apiv1/uac/account/getAccountListForSel`).then((res: any) => {
            if (res.code === 20000 || res.code === 20003) {
                setAccountList(res.data || [])
            }
        })
    }
    // 起停短信模版
    const startStopTemplate = ({id, status}: { id: number, status: number }): void => {
        const params = {
            ids: id,
            status: status === 1 ? '0' : '1'
        }
        fetch.put(`/apiv1/camera/status`, null, {params}).then((res: any) => {
            if (res.code === 20000) {
                getMessage()
                message.success('操作成功')
            } else {
                message.error(res.message || '操作失败')
            }
        })
    }
    // 获取业务列表
    const getBusiness = (value: any, e: any) => {
        const params = {
            companyUserId: e.key ? parseInt(e.key) : 0,
        }
        fetch.get(`/apiv1/oper/businesses`, {params}).then((res: any) => {
            if (res.code === 20000 || res.code === 20003) {
                setBusinessList(res.data || [])
            }
        })
    }
    // 删除短信模版
    const deleteStopTemplate = ({id, status}: { id: number, status: number }): void => {
        Modal.confirm({
            title: '提示!',
            content: '此操作不可恢复，确定继续？',
            onOk: () => {
                const params = {
                    ids: id,
                    status: -1
                }
                fetch.put(`/apiv1/camera/status`, null, {params}).then((res: any) => {
                    if (res.code === 20000) {
                        getMessage()
                        message.success('操作成功')
                    } else {
                        message.error(res.message || '操作失败')
                    }
                })

                // fetch.put(`/apiv1/camera/status`, {params}).then((res: any) => {
                //     if (res.code === 20000) {
                //         message.success('删除成功')
                //         getMessage()
                //     } else {
                //         message.error('删除失败')
                //     }
                // })
            }
        })

    }

    const handleTableChange = (pagination: any, orderBy: string): void => {
        setPageInfo({page: pagination.current, pageSize: pagination.pageSize, orderBy})
    }


    const columns = [
        {title: '场地名称', dataIndex: 'address', sorter: true},
        {title: '场地编号', dataIndex: 'address_code', sorter: true},
        {title: '摄像头编号', dataIndex: 'code', sorter: true},
        {title: '摄像头IP', dataIndex: 'ip', sorter: true},
        {title: '绑定业务员', dataIndex: 'users', sorter: true},
        {title: '绑定车险支持坐席', dataIndex: 'account_id', sorter: true},
        {title: '获取车辆信息数量', dataIndex: 'cget_car_info_result', sorter: true},
        /*        {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status1',
                    render: (status: number) => filterStatus[status],
                    width: 80,
                    sorter: true
                },*/
        {
            title: '操作',
            dataIndex: 'status',
            key: 'status',
            render: (status: number, row: any) => <Row>
                <Col span={8}>
                    <Button type={!status ? "primary" : 'danger'}
                            onClick={() => startStopTemplate({...row})}>
                        {status === 1 ? '停用' : '启用'}
                    </Button>
                </Col>
                <Col span={8}>
                    <Button type="dashed" onClick={() => {
                        setVisible('edit')
                        setEditRow(row)
                    }}>
                        编辑
                    </Button>
                </Col>
                <Col span={8}><Button type="danger" onClick={() => deleteStopTemplate({...row})}>删除</Button></Col>
            </Row>,
            width: 240
        },
    ]
    const {getFieldDecorator, resetFields} = props.form;
    // @ts-ignore
    return (
        <div style={{padding: '0 10px'}}>
            <Tabs animated={false}
                  tabBarExtraContent={
                      <Button type="primary" onClick={() =>
                          // setEditRow(null)
                          setVisible('add')
                      }>
                          添加
                      </Button>
                  }>
                <Tabs.TabPane key="1" tab="摄像头列表">
                    <Form layout="inline">
                        <Form.Item label="">
                            {getFieldDecorator('address_code', {
                                initialValue: '', rules: [
                                    {
                                        required: false
                                    },
                                ]
                            })(
                                <Input placeholder="场地编号"/>
                            )}
                        </Form.Item>
                        <Form.Item label="坐席">
                            {getFieldDecorator('seatId', {
                                initialValue: '', rules: [
                                    {
                                        required: false
                                    },
                                ]
                            })(
                                <Select style={{width: 200}}>
                                    <Select.Option value="" key="-1">全部坐席</Select.Option>
                                    {user && user.map((v: any) => <Select.Option key={v.id}
                                                                                 value={v.id}>{v.contact}</Select.Option>)}
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={() => getMessage()}>搜索</Button>
                        </Form.Item>
                    </Form>
                    <BaseTableComponent
                        columns={columns}
                        dataSource={messageList}
                        defaultvalue
                        bordered
                        total={total}
                        rowKey="id"
                        loading={loading}
                        onChange={handleTableChange}/>
                    {
                        Boolean(visible) && (
                            <Modal title={`${visible === 'edit' ? '编辑' : '新增'}跟进说明`}
                                   onCancel={() => {
                                       setEditRow(null)
                                       resetFields()
                                       setVisible('')
                                   }}
                                   visible={(() => {
                                       return Boolean(visible)
                                   })()}
                                   footer={null}
                                   destroyOnClose>
                                <Form onSubmit={e => onSubmitMsgTemplate(e)}>
                                    <Form.Item label="场地名称" {...formItemLayout} >
                                        {getFieldDecorator('address', {
                                            initialValue: editRow && editRow.address, rules: [
                                                {
                                                    required: true,
                                                    message: '请输入场地名称!',
                                                },
                                            ]
                                        })(
                                            <Input placeholder="请输入场地名称"/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="场地编号" {...formItemLayout} >
                                        {getFieldDecorator('address_code2', {
                                            initialValue: editRow && editRow.address_code, rules: [
                                                {
                                                    required: true,
                                                    message: '请输入场地编号!',
                                                },
                                            ]
                                        })(
                                            <Input placeholder="请输入场地编号"/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="设备IP" {...formItemLayout} >
                                        {getFieldDecorator('ip', {
                                            initialValue: editRow && editRow.ip, rules: [
                                                {
                                                    required: true,
                                                    message: '请输入设备IP!',
                                                },
                                            ]
                                        })(
                                            <Input placeholder="请输入设备IP"/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="设备编号" {...formItemLayout} >
                                        {getFieldDecorator('code', {
                                            initialValue: editRow && editRow.code, rules: [
                                                {
                                                    required: true,
                                                    message: '请输入设备编号!',
                                                },
                                            ]
                                        })(
                                            <Input placeholder="请输入设备编号"/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="公司"  {...formItemLayout}>
                                        {getFieldDecorator('account_id', {initialValue: ''})(
                                            <Select onChange={(value, e) => getBusiness(value, e)}>
                                                <Select.Option value="">所有公司</Select.Option>
                                                {accountList.map((v: any) => <Select.Option value={v.account_id}
                                                                                            key={v.account_id}>{v.contact}</Select.Option>)}
                                            </Select>)}
                                    </Form.Item>
                                    <Form.Item label="车检支持坐席" {...formItemLayout} >
                                        {getFieldDecorator('user_ids', {
                                            initialValue: editRow ? editRow.user_ids : [], rules: [
                                                {
                                                    required: true,
                                                    message: '请输入车检支持坐席!',
                                                    type: 'array'
                                                },
                                            ]
                                        })(
                                            <Select
                                                mode="multiple"
                                                style={{width: '100%'}}
                                                placeholder="请输入车检支持坐席!"
                                                onChange={handleChange}>
                                                {user && user.map((v: any) => <Select.Option key={v.id}
                                                                                             value={v.id}>{v.contact}</Select.Option>)}
                                            </Select>)},
                                    </Form.Item>
                                    <Form.Item style={{textAlign: 'right', marginBottom: 0}}>
                                        <Button type="primary" htmlType="submit">提交</Button>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        )
                    }
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default Form.create()(CameraList)
