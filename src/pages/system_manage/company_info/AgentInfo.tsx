import React, {FunctionComponent, useState, useEffect} from 'react'
import {Collapse, Statistic, Row, Col} from 'antd'
import fetch from 'fetch/axios'

const charging: any = {
  '0': '有效调用',
  '1': '全号码',
}
interface IProps {
  companyInfo: any
}
const AgentInfo: FunctionComponent<IProps> = (props) => {
  const {companyInfo} = props
  const [info, setInfo] = useState<any>(null)

  useEffect(() => getAgentInfo(), [])

  const getAgentInfo = () => {
    fetch.get(`/apiv1/uac/account/fee/${localStorage.getItem('mjoys_account_id')}`).then((res: any) => {
      if (res.code === 20000) {
        setInfo(res.data[0])
      }
    })
  }

  return (
    <Collapse defaultActiveKey={['1']}  style={{marginBottom: 10}}>
      <Collapse.Panel header="语音机器人" key="1">
        <Row>
          <Col span={4}>
            <Statistic title="收费方式" value={info && charging[info.charging_mode]} valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="收费方式" value={info && info.user_count + '个'} valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="坐席上限" value={info && info.data_price + '条'} valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="调用规则" value={info && info.effective_rule + '秒'} valueStyle={{fontSize: '16px'}}/>
          </Col>
          <Col span={4}>
            <Statistic title="通讯费用" value={info && info.phone_rate ? info.phone_rate : ' '} valueStyle={{fontSize: '16px'}}/>
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  )
}

export default AgentInfo
