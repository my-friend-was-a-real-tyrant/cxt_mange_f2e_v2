import React, {useState, useEffect, FunctionComponent} from 'react'
import {connect} from 'react-redux'
import {Tabs, Form, Empty} from 'antd'
import fetch from 'fetch/axios'

const formItemLayout = {
  labelCol: {span: 10},
  wrapperCol: {span: 14},
};

interface IProps {
  currentUser: any;
}

const CarOffer: FunctionComponent<IProps> = (props) => {
  const {currentUser} = props
  const [carOffer, setCarOffer] = useState([])
  useEffect(() => getOffer(), [currentUser])

  const getOffer = () => {
    if (currentUser) {
      const params = {
        insurance: currentUser.license
      }
      fetch.post(`/apiv1/insurance/offer`, null, {params}).then((res: any) => {
        if (res.code === 20000 || res.code === 20003) {
          setCarOffer(res.data)
        }
      })
    }
  }

  return <div className="right-panel-container">
    <div className="car-offer-form">
      {
        !carOffer.length ? <Empty description="暂无历史报价"
                                  image={`https://cxt.mjoys.com/mjoys_cxt_api/1019/2019/9/10/2019091019563595t5cmW.png`}/> :
          <Tabs size="small">
            {
              carOffer.map((item: any, index: number) => {
                return <Tabs.TabPane tab={`${item.insuranceCompanyName}-${item.schemeName}`} key={index + ''}>
                  <Form labelAlign="left">
                    <Form.Item label="车牌号" {...formItemLayout}>
                      {item.carInfo && item.carInfo.licenseNumber}
                    </Form.Item>
                    <Form.Item label="行驶证所有人名称"  {...formItemLayout}>
                      {item.carInfo && item.carInfo.ownerName}
                    </Form.Item>
                    <Form.Item label="车架号"  {...formItemLayout}>
                      {item.carInfo && item.carInfo.vehicleFrameNo}
                    </Form.Item>
                    <Form.Item label="发动机号"  {...formItemLayout}>
                      {item.carInfo && item.carInfo.engineNo}
                    </Form.Item>
                    <Form.Item label="车辆型号"  {...formItemLayout}>
                      {item.carInfo && item.carInfo.standardName}
                    </Form.Item>
                    <Form.Item label="座位数"  {...formItemLayout}>
                      {item.carInfo && item.carInfo.hdzk}
                    </Form.Item>
                    <Form.Item label="被保险人"  {...formItemLayout}>
                      {item.carInfo && item.carInfo.ownerName}
                    </Form.Item>
                    <Form.Item label="商业险起保日期"  {...formItemLayout}>
                      {item.carInfo && item.carInfo.consumeTimeStartTime}
                    </Form.Item>
                    <Form.Item label="交强险起保日期"  {...formItemLayout}>
                      {item.carInfo && item.carInfo.forceInsuranceStartTime}
                    </Form.Item>
                  </Form>
                  <div>
                    <div className="car-offer-table">
                      <span>险种名称</span>
                      <span>保费额度（元）</span>
                      <span>险种保费（元）</span>
                    </div>
                    {item.offerDetailList && item.offerDetailList.map((v: any, index: number) => <div
                      className="car-offer-table" key={index + ''}>
                      <span>{v.insuranceName}</span>
                      <span>{v.amountStr}</span>
                      <span>{v.quotesPrice}</span>
                    </div>)}
                  </div>
                </Tabs.TabPane>
              })
            }
          </Tabs>
      }
    </div>
  </div>
}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser
})
export default connect(mapStateToProps)(CarOffer)

