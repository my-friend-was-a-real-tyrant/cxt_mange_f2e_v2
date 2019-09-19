import React from 'react'
import {Popover, Icon, Form, Button, DatePicker, Select, Modal} from 'antd'
import fetch from 'fetch/axios'
import {FormComponentProps} from 'antd/es/form'
import BaseTableComponent from 'components/BaseTableComponent'
import WechatLog from './WechatLog'
import {quickTimeSelect} from "utils/utils"
import moment from 'moment'

interface IObj {
  children: any;
  props: any;
}

const renderContent = (value: any) => {
  const obj: IObj = {
    children: value,
    props: {},
  }
  obj.props.colSpan = 0
  return obj
}

class WechatBefore extends React.Component<FormComponentProps> {
  state = {
    loading: false,
    data: [],
    total: 0,
    accountList: [],
    businessList: [],
    buss: '',
    timeBegin: moment().add(-1, 'week').startOf('week').format('YYYY-MM-DD'),
    timeEnd: moment().format('YYYY-MM-DD'),
    contact: '',
    page: 1,
    pageSize: 10,
    show: false,
    logRow: null,
  }

  componentDidMount() {
    this.getWxReport()
    this.getAccount()
  }


  // 获取公司
  getAccount = () => {
    fetch.get(`/apiv1/uac/account/getAccountListForSel`).then((res: any) => {
      console.log(res)
      if (res.code === 20000 || res.code === 20003) {
        this.setState({accountList: res.data || []})
      }
    })
  }

  // 获取业务列表
  getBusiness = (value: any, e: any) => {
    const params = {
      companyUserId: e.key ? parseInt(e.key) : 0,
    }
    fetch.get(`/apiv1/oper/businesses`, {params}).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        this.setState({businessList: res.data || []})
      }
    })
  }

  // 获取列表数据
  getWxReport = () => {
    this.setState({loading: true})
    const {timeBegin, timeEnd, page, pageSize, contact, buss} = this.state
    const params = {
      timeBegin,
      timeEnd,
      page,
      pageSize,
      contact,
      buss,
    }
    fetch.get(`/apiv1/wx/wxDialReport`, {params}).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        let data = res.data || []
        data.forEach((v: any) => v.call_data = JSON.parse(v.call_data))
        this.setState({
          data,
          total: res.count || 0,
          loading: false,
          extent: res.extent && res.extent[0],
        })
      }
    })
  }

  // 搜索
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        page: 1,
        timeBegin: values.time.length > 0 ? moment(values.time[0]).format('YYYY-MM-DD') : '',
        timeEnd: values.time.length > 0 ? moment(values.time[1]).format('YYYY-MM-DD') : '',
        buss: values.buss,
        contact: values.contact,
      }, () => this.getWxReport())
    })
  }

  // 分页操作
  handleTableChange = (pagination: any) => {
    this.setState({
      page: pagination.current,
      pageSize: pagination.pageSize,
    }, () => this.getWxReport())
  }

  render() {
    const {data, total, loading, accountList, businessList, page, show, logRow} = this.state
    const {getFieldDecorator} = this.props.form
    const question = (content: string, title: string) => <Popover content={content}>
      {title} <Icon type="question-circle" theme="filled" className="question"/>
    </Popover>
    const callColumns = [
      {title: '拨打', dataIndex: 'sum', width: 95},
      {title: '接通', dataIndex: 'connect_count', width: 100},
      {
        title: '接通率',
        dataIndex: '6',
        width: 100,
        render: (text: number, row: any) => (row.connect_count / row.sum * 100).toFixed(2) + '%',
      },
      {title: '意向', dataIndex: 'need_count', width: 100,},
      {
        title: '意向率',
        dataIndex: '232',
        width: 100,
        render: (text: number, row: any) => row.connect_count ? (row.need_count / row.connect_count * 100).toFixed(2) + '%' : '0.00%',
      },
      {title: '数据批次', dataIndex: 'b_show_name', width: 193},
    ]

    const columns = [
      {title: '日期', dataIndex: 'time_create', width: 150},
      {title: '公司', dataIndex: 'contact', width: 150},
      {title: '业务', dataIndex: 'business_name', width: 150},
      {
        title: '批次数据拨打',
        className: 'row-th-p',
        children: [
          {
            title: '拨打', dataIndex: 'call_data', width: 100, render: (callData: any) => ({
              children: <BaseTableComponent
                pagiation={false}
                showHeader={false}
                columns={callColumns}
                dataSource={callData}
                pagination={false}
                size="middle"
                className="table-bordered-normal"
              />,
              props: {colSpan: 6, className: 'table-td-p0'},
            }),
          },
          {title: '接通', dataIndex: '111', width: 100, render: renderContent},
          {
            title: question('接通率 = 接通/拨打', '接通率'),
            dataIndex: '6',
            width: 100,
            render: renderContent,
          },
          {title: '意向', dataIndex: '8', width: 100, render: renderContent},
          {
            title: question('意向率 = 意向/接通', '意向率'), dataIndex: '232', width: 100, render: renderContent,
          },
          {title: '数据批次', dataIndex: '1111', width: 200, render: renderContent},
        ],
      },
      {title: '微信个数', dataIndex: 'wxsum', width: 100},
      {title: '总意向', dataIndex: 'all_connect', width: 100},
      {title: '总拨打', dataIndex: 'fcallsum', width: 100},
      {title: '总接通', dataIndex: 'fcontact', width: 100},
      {
        title: '微信添加成功',
        dataIndex: 'fsum',
        width: 120,
        render: (sum: number) => sum ? sum : 0,
      },
      {
        title: question('微信添加率 = 微信添加/意向', '微信添加率'), width: 120, render: (row: any) =>
          Object.prototype.toString.call(row.fsum) === '[object Null]' ? '0.00%' : (row.fsum / row.all_connect) ? (row.fsum / row.all_connect * 100).toFixed(2) + '%' : '0.00%',
      },
      {
        title: 'log',
        dataIndex: '2222',
        width: 50,
        render: (text:number, row: any) => <Button
          type="link" style={{padding: '0'}}
          onClick={() => this.setState({logRow: row, show: true})}>详情</Button>
      },
      {title: '备注', dataIndex: 'memo', width: 200, editable: true},
    ]
    const detailColumns = [
      {title: '微信ID(备注名)', dataIndex: 'wx_account'},
      {title: '总意向', dataIndex: 'tsum'},
      {title: '微信添加成功', dataIndex: 'fsum'},
      {title: '微信添加率', render: (row: any) => row.tsum ? (row.fsum / row.tsum * 100).toFixed(2) + '%' : '0.00%'},
    ]
    const expandedRowRender = (row: any) =>
      <BaseTableComponent
        columns={detailColumns}
        dataSource={row.wxdetail && JSON.parse(row.wxdetail)}
        bordered
        size="small"
        pagination={false}/>
    return (
      <div style={{padding: '0 20px'}}>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item label="日期">
            {getFieldDecorator('time', {initialValue: [moment().add(-1, 'week'), moment()]})(
              <DatePicker.RangePicker ranges={quickTimeSelect()}/>)}
          </Form.Item>
          <Form.Item label="公司">
            {getFieldDecorator('contact', {initialValue: ''})(
              <Select style={{width: '150px'}}
                      onChange={(value, e) => this.getBusiness(value, e)}>
                <Select.Option value="">所有公司</Select.Option>
                {accountList.map((v: any) => <Select.Option value={v.contact}
                                                            key={v.account_id}>{v.contact}</Select.Option>)}
              </Select>)}
          </Form.Item>
          <Form.Item label="业务">
            {getFieldDecorator('buss', {initialValue: ''})(
              <Select style={{width: '150px'}}>
                <Select.Option value="">所有业务</Select.Option>
                {businessList.map((v: any) => <Select.Option value={v.businessName} key={v.businessId}>
                  {v.businessName}
                </Select.Option>)}
              </Select>,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">搜索</Button>
          </Form.Item>
        </Form>
        <BaseTableComponent
          columns={columns}
          dataSource={data}
          total={total}
          loading={loading}
          onChange={this.handleTableChange}
          current={page}
          expandedRowRender={(row: any) => <div style={{padding: '0 20px'}}>{expandedRowRender(row)}</div>}
          scroll={{x: 1800}}
        />
        <Modal title="log详情" visible={Boolean(show && logRow)}
               onCancel={() => this.setState({show: false, logRow: null})} destroyOnClose>
          <WechatLog logRow={logRow}/>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(WechatBefore)
