import React, {FunctionComponent} from 'react'
import {Collapse, Statistic, Row, Col} from 'antd'
interface IProps {
  companyInfo: any
}

const CompanyPanel: FunctionComponent<IProps> = (props) => {
  const {companyInfo:info} = props

  return (
    <Collapse defaultActiveKey={['1']} style={{marginBottom: 10}}>
      <Collapse.Panel header="公司信息" key="1">
        <Row>
          <Col span={4}>
            <Statistic title="公司名" value={info && info.contact} valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="用户名" value={info && info.name} valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="开户时间" value={info && info.timeCreate} valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="手机号" value={info && info.mobilephone ? info.mobilephone : ' '}
                       valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="邮箱" value={info && info.email ? info.email : ' '} valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="余额" value={info && info.balance + '元'} valueStyle={{fontSize: '16px'}}/>
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  )
}

export default CompanyPanel
