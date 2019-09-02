/**
 * @Author: sunyonghua
 * @Date: 2019-08-28 15:59:56
 * @Description: table组件封装
 */
import React, {FunctionComponent} from 'react'
import {Table} from 'antd'

interface IProps {
  dataSource: object[];
  columns: object[];
  readonly size?: 'small' | 'middle' | 'default'
  readonly bordered?: boolean;
  readonly loading?: boolean;
  readonly total?: number;

  [propName: string]: any;

  onChange?(pagination: any, order: string): void
}

const BaseTableComponent: FunctionComponent<IProps> = (props) => {

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    const {onChange} = props
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

  const {dataSource, columns, bordered, loading, size, total} = props;
  return (
    <Table {...props}
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
             pageSizeOptions: ['10', '20', '50', '100'],
             showTotal: total => `总共 ${total} 条`
           }}/>
  )
}
BaseTableComponent.defaultProps = {
  dataSource: [],
  columns: [],
  bordered: false,
  loading: false,
  size: 'middle',
  total: 0
}
export default BaseTableComponent
