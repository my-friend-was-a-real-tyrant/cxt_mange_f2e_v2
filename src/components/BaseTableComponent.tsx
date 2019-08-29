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

  onChange?(e: React.ChangeEvent<HTMLElement>): void
}

const BaseTableComponent: FunctionComponent<IProps> = (props) => {

  const handleChange = () => {

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
  bordered: true,
  loading: false,
  size: 'middle',
  total: 0
}
export default BaseTableComponent