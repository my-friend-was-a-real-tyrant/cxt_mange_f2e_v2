import React, {FunctionComponent, useState, useEffect} from 'react'
import {Collapse, Statistic, Row, Col} from 'antd'
import fetch from 'fetch/axios'

interface IProps {
  companyInfo: any
}

const RobotInfo: FunctionComponent<IProps> = (props) => {
  const {companyInfo} = props
  const [info, setInfo] = useState<any>(null)

  useEffect(() => getRobotInfo(), [])

  const getRobotInfo = () => {
    fetch.get(`/apiv1/uac/account/robotInfo/${localStorage.getItem('mjoys_account_id')}`).then((res: any) => {
      if (res.code === 20000) {
        setInfo(res.data[0])
      }
    })
  }

  return (
    <Collapse defaultActiveKey={['1']} style={{marginBottom: 10}}>
      <Collapse.Panel header="语音机器人" key="1">
        <Row>
          <Col span={4}>
            <Statistic title="启用业务数" value={info && info.sumbess} valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="话术数量" value={info && info.sumrobo} valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="机器人路数" value={info && info.robotCount} valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="到期时间" value={info && info.robot_disabled_time ? info.robot_disabled_time : ' '}
                       valueStyle={{fontSize: '16px'}}/>
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  )
}

export default RobotInfo
