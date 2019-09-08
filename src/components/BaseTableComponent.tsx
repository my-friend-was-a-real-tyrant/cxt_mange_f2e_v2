/**
 * @Author: sunyonghua
 * @Date: 2019-08-28 15:59:56
 * @Description: table组件封装
 */
import React, {FunctionComponent, useState} from 'react'
import {Table} from 'antd'

interface IProps {
  dataSource: object[];
  columns: object[];
  readonly size?: 'small' | 'middle' | 'default'
  readonly bordered?: boolean;
  readonly loading?: boolean;
  readonly total?: number;
  readonly offset?: boolean;
  readonly current?: number;

  [propName: string]: any;

  onChange?(pagination: any, order: string): void
}

const BaseTableComponent: FunctionComponent<IProps> = (props) => {

  const [current, setCurrent] = useState(1)

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    const {onChange} = props
    setCurrent(pagination.current)
    const field = sorter.field
    let sorterField = ''
    if (field) {
      // 排序时把所有大写转为下划线加小写 方便后端seq查询...
      for (let i = 0; i < field.length; i++) {
        sorterField += /[A-Z]/.test(field[i]) ? '_' + field[i].toLowerCase() : field[i]
      }
    }
    const order = sorter.order === 'ascend' ? (sorterField ? sorterField + ' asc' : '') : sorterField ? sorterField + ' desc' : ''
    onChange && onChange(pagination, order)
  }

  const {dataSource, columns, bordered, loading, size, total, current: pageCurrent} = props;
  console.log(current)
  return (
    <Table
      rowKey={(record: any, index: number) => record.id || index}
      {...props}
      dataSource={dataSource}
      columns={columns}
      bordered={bordered}
      size={size}
      onChange={handleChange}
      loading={loading}
      pagination={{
        showQuickJumper: true,
        showSizeChanger: true,
        total: total,
        current: pageCurrent || current,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `总共 ${total} 条`
      }}/>
  )
}
BaseTableComponent.defaultProps = {
  dataSource: [],
  columns: [],
  bordered: true,
  loading: false,
  size: 'middle',
  total: 0
}
export default BaseTableComponent
