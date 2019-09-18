import React, {useState, useEffect, FunctionComponent} from 'react'
import {connect} from 'react-redux'
import {Tabs, Form, Empty, message, Steps} from 'antd'
import fetch from 'fetch/axios'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'

const {Step} = Steps;
const formItemLayout = {
  labelCol: {span: 10},
  wrapperCol: {span: 14},
};

interface IProps {
  currentUser: any;
  setSendShow: (flag: boolean) => any;
}

const CarOffer: FunctionComponent<IProps> = (props) => {
  const {currentUser} = props
  const [carOffer, setCarOffer] = useState([])
  useEffect(() => {
    getOffer()
    getOfferStatus()
  }, [currentUser])

  const getOfferStatus = () => {
    if (!currentUser) return false;
    const params = {
      insurance: currentUser.license,
      unionId: currentUser.id,
    }
    fetch.get(`/apiv1/insurance/offerStatus`, {params}).then((res: any) => {
      if (res.code === 20000) {

      }
    })
  }

  const getOffer = () => {
    if (currentUser) {
      const params = {
        insurance: currentUser.license,
        unionId: currentUser.id,
      }
      fetch.post(`/apiv1/insurance/offer`, null, {params}).then((res: any) => {
        if (res.code === 20000 || res.code === 20003) {
          setCarOffer(res.data)
        }
      })
    }
  }

  const onSendWechat = () => {
    const params = {
      insurance: currentUser.license,
      unionId: currentUser.id,
    }
    fetch.post(`/apiv1/insurance/wxOfferPic`, null, {params}).then((res: any) => {
      if (res.code === 20000) {
        message.success('发送成功')
      }
    })
  }

  const onSendMsg = () => {
    props.setSendShow(true)
  }
  const wx = currentUser && currentUser.server_wx && currentUser.target_wx;
  const mobile = currentUser && currentUser.mobile && currentUser.auto_add_aes_mobile
  return <div className="right-panel-container">
    <Steps current={1} progressDot style={{marginTop: 10}} size="small" initial={1}>
      <Step title="获取车辆信息" description="06/12 12:!2:12"/>
      <Step title="提交报价请求" description="06/12 12:!2:12"/>
      <Step title="获取报价结果" description="06/12 12:!2:12"/>
    </Steps>
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
      {!carOffer.length ? null :
        <div className="send-btn">
          <div
            className={`send-wechat ${wx ? '' : 'disabled'}`}
            onClick={() => wx ? onSendWechat() : ''}>
            发送微信
          </div>
          <div className={`send-msg ${mobile ? '' : 'disabled'}`}
               onClick={() => mobile ? onSendMsg() : ''}>
            发送短信
          </div>
        </div>}
    </div>
  </div>
}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setSendShow: (flag: boolean) => dispatch(actions.setSendShow(flag)),
})
export default connect(mapStateToProps, mapDispatchToProps)(CarOffer)

