import React, {useState, useEffect, FunctionComponent} from 'react'
import {Table, Form, Button, DatePicker, Select, Checkbox, message} from 'antd'
import fetch from 'fetch/axios';
import moment from 'moment'
import {FormComponentProps} from 'antd/lib/form';
import {quickTimeSelect, formatTime} from "utils/utils"

interface ISearch {
  page: number;
  pageSize: number;
  orderBy: string;
  is_allot: number;
}

interface IResult {
  data: any[];
  total: number;
}

interface IProps extends FormComponentProps {
  serialData: Array<object>
}

const renderContent = (value: any, row: any, index: number) => {
  return {
    children: value,
    props: {
      colSpan: 0
    },
  }
}

const Allocated: FunctionComponent<IProps> = props => {
  const [result, setResult] = useState<IResult>({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<ISearch>({page: 1, pageSize: 10, orderBy: 'time_create desc', is_allot: 1})
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [prevSearch, setPrevSearch] = useState({serialno_id: '', reg_date_b: '', reg_date_e: ''})
  const [company, setCompany] = useState<Array<object>>([])
  const [checked, setChecked] = useState<boolean>(false)


  const getReport = () => {
    const regDate = props.form.getFieldValue('regDate') || []
    const timeAssign = props.form.getFieldValue('time_assign') || []
    const show_name = props.form.getFieldValue('show_name') || ''
    const user_id = props.form.getFieldValue('user_id') || ''
    const serialno_id = props.form.getFieldValue('serialno_id').split('%')[1] || ''

    const params = {
      ...search,
      show_name,
      user_id,
      serialno_id,
      reg_date_b: formatTime(regDate)[0],
      reg_date_e: formatTime(regDate)[1],
      time_assign_b: formatTime(timeAssign)[0],
      time_assign_e: formatTime(timeAssign)[1],
    }
    setLoading(true)
    fetch.get(`/apiv1/otb/task/getTaskManageList`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        const data = res.data || []
        data.forEach((v: any) => {
          v.carInfo = v.car_info ? JSON.parse(v && v.car_info) : []
        })
        setResult({data, total: res.count})
      } else {
      }
    })
  }

  // 获取坐席
  const getCompany = () => {
    fetch.get(`/apiv1/otb/seatmanagement/seat/listForSelByAccountId`).then((res: any) => {
      if (res.code === 20000) {
        setCompany(res.data || [])
      } else {
        setCompany([])
      }
    })
  }

  // init
  useEffect(() => {
    getCompany()
  }, [])

  // update
  useEffect(() => getReport(), [search])

  // 数据回收
  const handleRecovery = () => {
    const regDate = props.form.getFieldValue('regDate') || []
    const timeAssign = props.form.getFieldValue('time_assign') || []
    const show_name = props.form.getFieldValue('show_name') || ''
    const user_id = props.form.getFieldValue('user_id') || ''
    const serialno_id = props.form.getFieldValue('serialno_id').split('%')[1] || ''
    delete search.page;
    delete search.pageSize
    const params = {
      ...search,
      show_name,
      user_id,
      serialno_id,
      reg_date_b: formatTime(regDate)[0],
      reg_date_e: formatTime(regDate)[1],
      time_assign_b: formatTime(timeAssign)[0],
      time_assign_e: formatTime(timeAssign)[1],
      ids: checked ? '' : selectedRowKeys.join(',')
    }

    fetch.put(`/apiv1/otb/task/reAllotInTaskManage`, null, {params}).then((res: any) => {
      if (res.code === 20000) {
        message.success('回收成功')
        setChecked(false)
        getReport()
      }
    })
  }

  // 选中操作
  const onSelectChange = (value: any) => {
    setSelectedRowKeys(value)
  }

  const onSearch = () => {
    const regDate = props.form.getFieldValue('regDate') || []
    const serialno_id = props.form.getFieldValue('serialno_id') || ''
    setPrevSearch({
      serialno_id,
      reg_date_b: regDate.length > 0 && regDate[0] ? moment(regDate[0]).clone().set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      }).format('MM-DD') : '',
      reg_date_e: regDate.length > 0 && regDate[1] ? moment(regDate[1]).clone().set({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 59
      }).format('MM-DD') : '',
    })
    setSearch({...search, page: 1})
  }

  // 分页操作
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSearch({
      ...search,
      page: pagination.current,
      pageSize: pagination.pageSize,
      orderBy: sorter.order === 'ascend' ? (sorter.field ? sorter.field + ' asc' : '') : sorter.field ? sorter.field + ' desc' : '',
    })
  }
  const carColumns = [
    {title: '车主姓名', dataIndex: 'cry_name', width: 100},
    {title: '车牌', dataIndex: 'insurance', width: 100},
    {title: '车辆品牌', dataIndex: 'brand', width: 100},
    {title: '车型', dataIndex: 'model', width: 100},
    {title: '车架号', dataIndex: 'cry_frame_no', width: 200},
    {title: '发动机号', dataIndex: 'cry_engine_no', width: 200},
    {title: '保险日期', dataIndex: 'reg_date', width: 100},
    {title: '城市', dataIndex: 'city', width: 100},
    {title: '注册日期', dataIndex: 'src_tme', width: 100},
  ]

  const columns = [
    {title: '数据批次', dataIndex: 'show_name', width: 200, sorter: true,},
    {title: '电话', dataIndex: 'mobile', width: 130, sorter: true,},
    {
      title: '上传时间',
      dataIndex: 'time_create',
      width: 230,
      sorter: true,
      render: (time: number) => time ? moment(time).format('YYYY/MM/DD HH:mm:ss') : ''
    },
    {
      title: '车辆信息',
      children: [
        {title: '车主姓名', key: 'cry_name', width: 100, render: renderContent},
        {title: '车牌', key: 'insurance', width: 100, render: renderContent},
        {
          title: '车辆品牌',
          width: 100,
          dataIndex: 'carInfo',
          key: '0-1',
          render: (car: Array<object>): object => {
            return {
              children: car.length > 0 ? <Table
                showHeader={false}
                columns={carColumns}
                dataSource={car}
                pagination={false}
                size="middle"
                rowKey="id"
                bordered={false}
              /> : null,
              props: {
                colSpan: 9,
              },
            }
          },
        },
        {title: '车型', key: 'model', width: 100, render: renderContent},
        {title: '车架号', key: 'cry_frame_no', width: 200, render: renderContent},
        {title: '发动机号', key: 'cry_engine_no', width: 200, render: renderContent},
        {title: '保险日期', key: 'reg_date', width: 100, render: renderContent},
        {title: '城市', key: 'city', width: 100, render: renderContent},
        {title: '注册日期', key: 'src_tme', width: 100, render: renderContent},
      ],
      sorter: true,
    },
    {
      title: '分配日期',
      dataIndex: 'time_assign',
      width: 150,
      render: (time_assign: number) => time_assign ? moment(time_assign).format('YYYY-MM-DD') : null
    },
    {title: '分配坐席', dataIndex: 'user', width: 100},
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const {getFieldDecorator} = props.form;

  const regDate = props.form.getFieldValue('regDate') || []
  const reg_date_b = regDate.length > 0 && regDate[0] ? moment(regDate[0]).clone().set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  }).format('MM-DD') : ''
  const reg_date_e = regDate.length > 0 && regDate[1] ? moment(regDate[1]).clone().set({
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 59
  }).format('MM-DD') : ''
  const flag = prevSearch.reg_date_b === reg_date_b && prevSearch.reg_date_e === reg_date_e && prevSearch.serialno_id === props.form.getFieldValue('serialno_id')


  return <div style={{padding: '0 10px'}}>
    <Form layout="inline">
      <Form.Item label="数据批次" className="serialno">
        {getFieldDecorator('serialno_id', {initialValue: ''})(
          <Select
            showSearch>
            <Select.Option key="000" value={''}>全部批次 </Select.Option>
            {props.serialData.map((v: any) => <Select.Option key={v.id} value={`${v.show_name}%${v.id}`}>
              {v.show_name}
            </Select.Option>)}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="保险到期日">
        {getFieldDecorator('regDate', {initialValue: []})(
          <DatePicker.RangePicker
            style={{width: '180px'}}
            format="MM-DD"
            suffixIcon=" "
            placeholder={['开始日期', '结束日期']}
            ranges={quickTimeSelect()}
          />
        )}
      </Form.Item>
      <Form.Item label="分配时间">
        {getFieldDecorator('time_assign', {initialValue: []})(
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            style={{width: '180px'}}
            suffixIcon=" "
            placeholder={['开始日期', '结束日期']}
            ranges={quickTimeSelect()}
          />
        )}
      </Form.Item>
      <Form.Item label="分配坐席">
        {getFieldDecorator('user_id', {initialValue: ''})(
          <Select style={{width: 150}} placeholder="请选择坐席">
            <Select.Option key="-1" value={''}>全部</Select.Option>
            {company.map((v: any) => <Select.Option key={v.id} value={v.id}>{v.contact}</Select.Option>)}
          </Select>
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={() => onSearch()}>搜索</Button>
      </Form.Item>
      <Form.Item>
        <Checkbox onChange={(e) => setChecked(e.target.checked)}
                  checked={checked}
                  disabled={!flag}>
          勾选所有
        </Checkbox>
        <Button type="primary"
                onClick={() => handleRecovery()}
                disabled={!checked && !selectedRowKeys.length}>
          数据回收
        </Button>
      </Form.Item>
    </Form>
    <Table columns={columns}
           loading={loading}
           rowKey="id"
           rowSelection={rowSelection}
           dataSource={result.data}
           size="middle"
           onChange={handleTableChange}
           bordered
           scroll={{x: 1700}}
           pagination={{
             showQuickJumper: true,
             showSizeChanger: true,
             total: result.total,
             current: search.page,
             pageSizeOptions: ['10', '50', '100', '500', '1000'],
             showTotal: total => `总共 ${total} 条`,
           }}/>
  </div>
}

export default Form.create<IProps>()(Allocated)
