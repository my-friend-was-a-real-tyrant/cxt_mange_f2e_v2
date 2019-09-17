import React, {useState, useEffect, FunctionComponent} from 'react'
import {Table, Form, Button, DatePicker, Modal, Select, Checkbox, InputNumber, message} from 'antd'
import fetch from 'fetch/axios';
import moment from 'moment'
import BaseTableComponent from 'components/BaseTableComponent'
import {FormComponentProps} from 'antd/lib/form';
import {quickTimeSelect, formatTime} from 'utils/utils'
import 'assets/styles/phone-task.less'

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

const ToBeDistributed: FunctionComponent<IProps> = props => {

  const [result, setResult] = useState<IResult>({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<ISearch>({page: 1, pageSize: 10, orderBy: 'time_create desc', is_allot: 0})
  const [prevSearch, setPrevSearch] = useState({serialno_id: '', reg_date_b: '', reg_date_e: ''})
  const [show, setShow] = useState<boolean>(false)
  const [company, setCompany] = useState<Array<object>>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [selectedRowKeys2, setSelectedRowKeys2] = useState<any>([])
  const [checked, setChecked] = useState<boolean>(false)
  const [editStatus, setEditStatus] = useState<boolean>(false)
  const getReport = () => {
    const regDate = props.form.getFieldValue('regDate') || []
    const serialno_id = props.form.getFieldValue('serialno_id') || ''
    const show_name = props.form.getFieldValue('show_name') || ''
    const params = {
      ...search,
      show_name,
      serialno_id,
      reg_date_b: formatTime(regDate, 'MM-DD')[0],
      reg_date_e: formatTime(regDate, 'MM-DD')[1],
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
      }
    })
  }

  // 请求参数
  const searchParams = () => {
    const regDate = props.form.getFieldValue('regDate') || []
    const show_name = props.form.getFieldValue('show_name') || ''
    const serialno_id = props.form.getFieldValue('serialno_id') || ''
    return {
      ...search,
      show_name,
      serialno_id,
      reg_date_b: formatTime(regDate, 'MM-DD')[0],
      reg_date_e: formatTime(regDate, 'MM-DD')[1],
    }
  }

  // init
  useEffect(() => {
    getCompany()
    getReport()
  }, [])

  // update
  useEffect(() => {
    getReport()
  }, [search])

  // 获取坐席
  const getCompany = () => {
    fetch.get(`/apiv1/otb/taskAllot/findTaskAllotStatus`).then((res: any) => {
      if (res.code === 20000 || res.code === 20003) {
        setCompany(res.data || [])
      }
    })
  }


  // 数据分配
  const handleDistribution = () => {
    setShow(true)
  }

  // 选中操作
  const onSelectChange = (value: any) => {
    setSelectedRowKeys(value)
  }
  // 分配选中操作
  const onSelectChange2 = (value: any) => {
    setSelectedRowKeys2(value)
  }

  // 设置分配数
  const handleCount = (value: any, row: any) => {
    company.forEach((v: any) => {
      if (row.userId === v.userId) {
        if (selectedRowKeys2.indexOf(v.userId) !== -1) {
          v.count = value;
        }
      }
    })
    setCompany([...company])
  }

  // 平均分配
  const handleAverageDistribution = () => {
    const total = checked ? result.total : selectedRowKeys.length;
    const average = parseInt((total / selectedRowKeys2.length).toString());
    const surplus = total % selectedRowKeys2.length;
    company.forEach((v: any) => {
      const index = selectedRowKeys2.indexOf(v.userId)
      if (index !== -1) {
        if (index === selectedRowKeys2.length - 1) {
          v.count = average + surplus
        } else {
          v.count = average
        }
      }
    })
    setCompany([...company])
    setEditStatus(true)
  }

  // 保存分配任务
  const handleSave = async () => {

    const params = {
      ...searchParams(),
      ids: checked ? '' : selectedRowKeys.join(',')
    }
    if (!selectedRowKeys2.length) {
      return message.error('请选中分配坐席');
    }
    const data = company.filter((v: any) => {
      return selectedRowKeys2.indexOf(v.userId) !== -1
    })
    const newData = data.map((v: any) => ({userId: v.userId, count: v.count}))
    const total = checked ? result.total : selectedRowKeys.length;
    let newTotal = newData.reduce((pre: any, cur: any): any => {
      return {count: pre.count + cur.count}
    }, {count: 0})
    if (newTotal.count > total) {
      return message.error('分配任务总数大于待分配任务数，请重新确认分配数')
    }
    for (let i = 0; i < newData.length; i++) {
      if (typeof newData[i].count !== "number" || newData[i].count <= 0) {
        return message.error('请输入正确的分配任务数')
      }
    }
    fetch.put(`/apiv1/otb/task/allotInTaskManage`, newData, {params}).then((res: any) => {
      if (res.code === 20000) {
        setShow(false)
        setChecked(false)
        setEditStatus(false)
        setSelectedRowKeys([])
        setSelectedRowKeys2([])
        company.forEach((v: any) => {
          delete v.count
        })
        setCompany(company)
        getReport()
      }
    })
  }

  const onSearch = () => {
    const regDate = props.form.getFieldValue('regDate') || []
    const serialno_id = props.form.getFieldValue('serialno_id') || ''
    setPrevSearch({
      serialno_id,
      reg_date_b: formatTime(regDate, 'MM-DD')[0],
      reg_date_e: formatTime(regDate, 'MM-DD')[1],
    })
    setSearch({...search, page: 1})
  }

  // 删除操作
  const handleDelete = () => {
    Modal.confirm({
      title: '提示',
      content: '此操作不可恢复，确定要继续?',
      onOk() {
        const params = {
          ...searchParams(),
          ids: checked ? '' : selectedRowKeys.join(',')
        }
        fetch.put(`/apiv1/otb/task/deleteInTaskManage`, null, {params}).then((res: any) => {
          if (res.code === 20000) {
            getReport()
            setChecked(false)
            setSelectedRowKeys([])
          } else {
          }
        })
      }
    })
  }

  const handleTableChange = (pagination: any, orderBy: string) => {
    setSearch({is_allot: 0, page: pagination.current, pageSize: pagination.pageSize, orderBy})
  }

  const carColumns = [
    {title: '车牌', dataIndex: 'insurance', width: 100, className: 'car_insurance'},
    {title: '车辆品牌', dataIndex: 'brand', width: 200},
    {title: '车架号', dataIndex: 'cry_frame_no', width: 200},
    {title: '发动机号', dataIndex: 'cry_engine_no', width: 200},
    {title: '保险日期', dataIndex: 'reg_date', width: 150},
    {title: '车主姓名', dataIndex: 'cry_name', width: 150},
    {title: '省份', dataIndex: 'pro', width: 150},
    {title: '城市', dataIndex: 'city', width: 150},
    {title: '车型', dataIndex: 'model', width: 150},
    {title: '证件号码', dataIndex: 'cry_identity', width: 150},
    {title: '注册日期', dataIndex: 'src_time', width: 150},
    {title: '地址', dataIndex: 'address', width: 200},
  ]

  const columns = [
    {title: '数据批次', dataIndex: 'show_name', width: 200, sorter: true,},
    {title: '电话', dataIndex: 'mobile', width: 130, sorter: true,},
    {
      title: '上传时间',
      dataIndex: 'time_create',
      width: 230,
      sorter: true,
      render: (time: number) => time ? moment(time).format('YYYY/MM/DD HH:mm') : ''
    },
    {
      title: '车辆信息',
      children: [
        {title: '车牌', width: 100, key: '0-0', render: renderContent, className: 'car_insurance'},
        {
          title: '车辆品牌',
          width: 200,
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
                className="car-info-table"
                bordered={false}
              /> : null,
              props: {
                colSpan: 12,
              },
            }
          },
        },
        {title: '车架号', width: 200, key: '0-3', render: renderContent},
        {title: '发动机号', width: 200, key: '0-4', render: renderContent},
        {title: '保险日期', width: 150, key: '0-5', render: renderContent},
        {title: '车主姓名', width: 150, key: '0-6', render: renderContent},
        {title: '省份', width: 150, key: '0-7', render: renderContent},
        {title: '城市', width: 150, key: '0-8', render: renderContent},
        {title: '车型', width: 150, key: '0-9', render: renderContent},
        {title: '证件号码', width: 150, key: '0-10', render: renderContent},
        {title: '注册日期', width: 150, key: '0-11', render: renderContent},
        {title: '地址', width: 200, key: '0-12', render: renderContent},
      ],
      sorter: true,
    },
  ]
  const companyColumns = [
    {title: '坐席', dataIndex: 'user',},
    {
      title: '分配任务数', dataIndex: 'count', render: (count: number, row: any) => {
        return editStatus ? <InputNumber style={{width: "100%"}} defaultValue={count} placeholder="请输入分配任务数"
                                         onChange={e => handleCount(e, row)}/> : null
      }
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const rowSelectionCount = {
    selectedRowKeys2,
    onChange: onSelectChange2,
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
          <Select>
            <Select.Option key="000" value={''}>全部批次 </Select.Option>
            {props.serialData.map((v: any) => <Select.Option key={v.id}>
              {v.show_name}: (剩余 {v.not_allot_count} 条)
            </Select.Option>)}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="保险到期日">
        {getFieldDecorator('regDate', {initialValue: []})(
          <DatePicker.RangePicker
            format="MM-DD"
            suffixIcon=" "
            placeholder={['开始日期', '结束日期']}
            ranges={quickTimeSelect()}
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={() => onSearch()}>搜索</Button>
      </Form.Item>
      <Form.Item>
        <Checkbox onChange={(e) => setChecked(e.target.checked)} checked={checked} disabled={!flag}>勾选所有</Checkbox>
        <Button type="primary" onClick={() => handleDistribution()}
                disabled={!checked && !selectedRowKeys.length}>数据分配</Button>
      </Form.Item>
      <Form.Item>
        <Button type="danger" onClick={() => handleDelete()} disabled={!checked && !selectedRowKeys.length}>删除</Button>
      </Form.Item>
    </Form>
    <BaseTableComponent
      className="phone-table"
      columns={columns}
      loading={loading}
      rowKey="id"
      rowSelection={rowSelection}
      dataSource={result.data}
      size="middle"
      bordered
      total={result.total}
      current={search.page}
      onChange={handleTableChange}
      scroll={{x: 1600}}/>
    <Modal title="分配任务" visible={show} footer={null} destroyOnClose onCancel={() => {
      setSelectedRowKeys2([])
      setShow(false)
      setEditStatus(false)
      setCompany(company.map((v:any)=>({...v,count:''})))
    }}>
      <Table columns={companyColumns}
             dataSource={company}
             loading={loading}
             rowKey="userId"
             rowSelection={rowSelectionCount}
             size="small"
             bordered
             pagination={false}/>
      <div style={{textAlign: 'right', marginTop: '30px'}}>
        <Button style={{marginLeft: '15px'}}
                onClick={() => handleAverageDistribution()}
                type="primary"
                disabled={editStatus}>
          分配新任务
        </Button>
        <Button style={{marginLeft: '15px'}}
                onClick={() => {
                  setEditStatus(false)
                  setShow(false)
                }}
                type="dashed">
          取消
        </Button>
        <Button style={{marginLeft: '15px'}}
                onClick={() => handleSave()}
                type="primary"
                disabled={!editStatus}>
          保存
        </Button>
      </div>
    </Modal>
  </div>
}
export default Form.create<IProps>()(ToBeDistributed)
