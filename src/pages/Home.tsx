import React from 'react'
import BaseTableComponent from 'components/BaseTableComponent'

function Home() {
  console.log(1)
  const columns = [
    {title: 'aaaa', dataIndex: 'a', key: 'a'},
    {title: 'baaa', dataIndex: 'b', key: 'b'},
    {title: 'caaa', dataIndex: 'c', key: 'c'},
    {title: 'daaa', dataIndex: 'd', key: 'd'},
    {title: 'eaaa', dataIndex: 'e', key: 'e'},
  ]
  return (
    <div>
      <BaseTableComponent dataSource={[]} columns={columns} bordered />
    </div>
  )
}

export default Home

