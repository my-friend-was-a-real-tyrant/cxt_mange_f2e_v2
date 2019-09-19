import React, {FunctionComponent, useState, useEffect} from 'react'
import fetch from 'fetch/axios'
import moment from 'moment'
import {Tabs} from 'antd'
import BaseTableComponent from 'components/BaseTableComponent'

interface IProps {
  logRow: any;
}

const WechatLog: FunctionComponent<IProps> = (props) => {
  const [search, setSearch] = useState({offset: 1, limit: 10})
  const [key, setKey] = useState<string>('1')
  const [result, setResult] = useState({data: [], total: 0})
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    getServerLog(key)
  }, [key, search])

  const getServerLog = (type: string) => {
    const {logRow} = props
    console.log(logRow)
    const params = {
      accountId: -1,
      operator: '',
      operateType: '业务管理',
      operate: type === '1' ? '修改二次营销' : '修改业务',
      operateObject: `业务:${logRow && logRow.business_name}`,
      startTime: moment(logRow.time_create).format('YYYYMMDD'),
      endTime: moment(logRow.time_create).add(+1, 'days').format('YYYYMMDD'),
      limit: search.limit,
      offset: (search.offset - 1) * search.limit + 1,
    }
    setLoading(true)
    fetch.get(`/apiv1/uac/serverLog/getServerLogList`, {params}).then((res: any) => {
      setLoading(false)
      if (res.code === 20000 || res.code === 20003) {
        setResult({data: res.data, total: res.count})
      }
    })
  }

  const handleTableChange = (pagiation: any) => {
    setSearch({offset: pagiation.current, limit: pagiation.pageSize})
  }

  const columns = [
    {title: '操作人', dataIndex: 'operator'},
    {title: '所在公司', dataIndex: 'accountName'},
    {title: '操作时间', dataIndex: 'timeCreate'},
    {title: '操作类型', dataIndex: 'operateType'},
    {title: '操作', dataIndex: 'operate'},
    {title: '操作对象', dataIndex: 'operateObject'},
  ]

  return <div>
    <Tabs activeKey={key} onChange={(key: string) => {
      setSearch({...search, offset: 1})
      setKey(key)
    }}>
      <Tabs.TabPane key="1" tab="线路调整记录">
        <BaseTableComponent
          columns={columns}
          dataSource={result.data}
          loading={loading}
          onChange={handleTableChange}
          current={search.offset === 1 ? search.offset : undefined}
          total={result.total}/>
      </Tabs.TabPane>
      <Tabs.TabPane key="2" tab="微信号开关记录">
        <BaseTableComponent
          columns={columns}
          loading={loading}
          onChange={handleTableChange}
          current={search.offset === 1 ? search.offset : undefined}
          dataSource={result.data}
          total={result.total}/>
      </Tabs.TabPane>
    </Tabs>
  </div>
}
export default WechatLog
