import React, {useState, FunctionComponent, useEffect} from 'react'
import SearchForm from './SearchForm'
import BaseTableComponent from 'components/BaseTableComponent'
import fetch from 'fetch/axios'

enum EPlanStatus {
  "未计划" = 0,
  "计划中",
  "计划完成",
  "计划已经停用"
}

enum EPlanTag {
  "warn" = 0,
  "primary",
  "normal",
  "danger"
}

enum EPhoneStatus {
  "未拨打" = 1,
  "已拨打",
}

const CallPlan: FunctionComponent = () => {
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [searchValues, setSearchValues] = useState({})
  const [search, setSearch] = useState({limit: 10, offset: 1})

  useEffect(() => getList(), [search, searchValues])

  // 获取计划
  const getList = () => {
    setLoading(true)
    const params = {
      ...searchValues,
      ...search,
      offset: (search.offset - 1) * search.limit + 1,
    }
    fetch.get(`/apiv1/phonecallplan/dgj/list`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setResult({data: res.data || [], total: res.count || 0})
      }
    })
  }

  // 搜索
  const onSearch = (values: any) => {
    setSearch({...search, offset: 1})
    setSearchValues(values)
  }

  // 选中操作
  const onSelectChange = (value: any) => {
    setSelectedRowKeys(value)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleTableChange = (pagination: any) => {
    setSearch({offset: pagination.current, limit: pagination.pageSize})
  }

  const columns = [
    {
      title: '优先级',
      dataIndex: 'priority',
      sorter: true,
      width: 100,
      render: (priority: number) => priority === 1 ? '高' : '低'
    },
    {title: '展示名称', dataIndex: 'show_name', sorter: true},
    {title: '电话号码', dataIndex: 'phone', width: 320, sorter: true},
    {
      title: '计划状态',
      dataIndex: 'plan_status',
      width: 100,
      sorter: true,
      render: (planStatus: number) => (
        <span className={`mjoys-tag mjoys-tag__${EPlanTag[planStatus]}`}>{EPlanStatus[planStatus]}</span>
      )
    },
    {
      title: '号码状态',
      width: 100,
      dataIndex: 'phone_status',
      sorter: true,
      render: (phoneStatus: number) => (
        <span className={`mjoys-tag mjoys-tag__${phoneStatus === 1 ? 'disabled' : 'normal'}`}>
          {EPhoneStatus[phoneStatus]}
        </span>
      )
    },
    {title: '上传时间', dataIndex: 'upload_time', width: 180, sorter: true},
    {title: '业务', dataIndex: 'business_name', width: 150, sorter: true},
  ]


  return (
    <div style={{padding: '10px'}}>
      <SearchForm onSearch={(values: any) => onSearch(values)} selectedRowKeys={selectedRowKeys}/>
      <BaseTableComponent
        rowSelection={rowSelection}
        columns={columns}
        dataSource={result.data}
        total={result.total}
        onChange={handleTableChange}
        loading={loading}/>
    </div>
  )
}

export default CallPlan
