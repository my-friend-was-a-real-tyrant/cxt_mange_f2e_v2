import React, {FunctionComponent, useState, useEffect} from 'react';
import {Tabs, Button, Row, Col, message, Modal} from 'antd'
import {FormComponentProps} from 'antd/lib/form';
import fetch from 'fetch/axios'
import BaseTableComponent from 'components/BaseTableComponent'

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

// 短信模版
const ShortMessage: FunctionComponent<FormComponentProps> = (props) => {
  const [messageList, setMessageList] = useState<any>([])
  const [pageInfo, setPageInfo] = useState<ISearchProps>({page: 1, pageSize: 10, orderBy: ''})
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<string>('')
  const [editRow, setEditRow] = useState<any>(null)

  useEffect(() => {
    getMessage()
  }, [pageInfo]);

  // 获取短信模版
  const getMessage = (): void => {
    const {page, pageSize, orderBy} = pageInfo;
    const params = {
      page,
      pageSize,
      orderBy
    }
    setLoading(true)
    fetch.get(`/apiv1/template/shortmsg/list`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setTotal(res.count || 0)
        setMessageList(res.data || [])
      } else {
        setMessageList([])
      }
    })
  }

  // 新增编辑短信模版
  const onSubmitMsgTemplate = (e: any): void => {
    console.log(editRow, visible)
    e.preventDefault();
    // if (visible === 'edit' && !editRow) return message.error('出现错误，请刷新重试')
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        const params: any = {
          'edit': {
            ...values,
            id: editRow && editRow.id,
          },
          'add': {
            ...values,
          }
        }
        fetch[visible === 'edit' ? 'put' : 'post'](`/template/shortmsg`, null, {params: params[visible]}).then((res: any) => {
          if (res.code === 20000) {
            message.success('新增成功')
            setVisible('')
            getMessage()
          } else {
            message.error(res.message || '新增失败')
          }
        })
      }
    });
  }

  // 删除短信模版
  const onDeleteMsgTemplate = async (id: number) => {
    const params = {
      id,
    }
    Modal.confirm({
      title: '提示!',
      content: '此操作不可恢复，确定继续？',
      onOk: () => {
        fetch.delete(`/apiv1/template/shortmsg`, {params}).then((res: any) => {
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

  // 起停短信模版
  const startStopTemplate = ({id, status}: { id: number, status: number }): void => {
    const params = {
      id
    }
    fetch.put(`/apiv1/template/shortmsg/${status === 1 ? 'disable' : 'enable'}`, null, {params}).then((res: any) => {
      if (res.code === 20000) {
        getMessage()
        message.success('操作成功')
      } else {
        message.error(res.message || '操作失败')
      }
    })
  }

  const handleTableChange = (pagination: any, orderBy: string): void => {
    setPageInfo({page: pagination.current, pageSize: pagination.pageSize, orderBy})
  }


  const columns = [
    {title: '短信内容', dataIndex: 'content', width: 450, sorter: true},
    {title: '描述', dataIndex: 'description', width: 100, sorter: true},
    {title: '创建时间', dataIndex: 'timeCreate', width: 180, sorter: true},
    {title: '修改时间', dataIndex: 'timeModified', width: 180, sorter: true},
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status1',
      render: (status: number) => filterStatus[status],
      width: 80,
      sorter: true
    },
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
            setEditRow(row)
            setVisible('edit')
          }}>
            编辑
          </Button>
        </Col>
        <Col span={8}><Button type="danger" onClick={() => onDeleteMsgTemplate(row.id)}>删除</Button></Col>
      </Row>,
      width: 280
    },
  ]
  return (
    <div style={{padding: '0 10px'}}>
      <Tabs animated={false}>
        <Tabs.TabPane key="1" tab="短信模版">
          <BaseTableComponent
            columns={columns}
            dataSource={messageList}
            bordered
            total={total}
            rowKey="id"
            loading={loading}
            onChange={handleTableChange}/>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="已发短信">

        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default ShortMessage
