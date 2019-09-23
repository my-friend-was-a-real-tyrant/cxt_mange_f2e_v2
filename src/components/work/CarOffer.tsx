import React, {useState, useEffect, FunctionComponent} from 'react'
import {connect} from 'react-redux'
import {Tabs, Form, Empty, message, Steps, Popover} from 'antd'
import fetch from 'fetch/axios'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
import moment from 'moment'

const {Step} = Steps;
const formItemLayout = {
  labelCol: {span: 10},
  wrapperCol: {span: 14},
};

interface IProps {
  currentUser: any;
  setSendShow: (flag: boolean) => any;
  key: string;
}

const CarOffer: FunctionComponent<IProps> = (props) => {
  const {currentUser, key} = props
  const [carOffer, setCarOffer] = useState<any>([])
  const [offerStatus, setOfferStatus] = useState([])

  useEffect(() => {
    getOffer()
    // getOfferStatus()
  }, [currentUser, key])

  // const getOfferStatus = () => {
  //   if (!currentUser) return false;
  //   const params = {
  //     insurance: currentUser.license,
  //     unionId: currentUser.id,
  //   }
  //   fetch.get(`/apiv1/insurance/offerStatus`, {params}).then((res: any) => {
  //     if (res.code === 20000) {
  //       setOfferStatus(res.data || [])
  //     }
  //   })
  // }

  const getOffer = () => {
    if (currentUser) {
      const params = {
        insurance: currentUser.license,
        unionId: currentUser.id,
      }
      fetch.post(`/apiv1/insurance/offer`, null, {params}).then((res: any) => {
        if (res.code === 20000 || res.code === 20003) {
          const data = res.data || []
          const newData = data.map((v: any) => ({
            ...v,
            offerDtos: v.offerDtos ? v.offerDtos : [],
            offerProgressList: v.offerProgressList ? v.offerProgressList : []
          }))
          setCarOffer(newData)
        }
      })
    }
  }

  const onSendWechat = (offerId?: number) => {
    const params = {
      insurance: currentUser.license,
      unionId: currentUser.id,
      offerId: offerId ? offerId : ''
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

  const statusMap: any = {
    0: 'wait',
    1: 'finish',
    2: 'error'
  }
  const wx = currentUser && currentUser.server_wx && currentUser.target_wx;
  const mobile = currentUser && currentUser.mobile && currentUser.auto_add_aes_mobile
  return <div className="right-panel-container">
    {
      carOffer.length ?
        carOffer.map((offerItem: any, index: number) => {
          return <div key={index + ''}>
            <Steps progressDot style={{marginTop: 10}} size="small" initial={1}>
              {offerItem.offerProgressList && offerItem.offerProgressList.map((v: any) =>
                <Step
                  title={<Popover content={v.msg}>
                    <div className="offer_title">
                      {v.msg}
                    </div>
                  </Popover>}
                  status={statusMap[v.status]}
                  key={v.id}
                  description={v.time ? moment(v.time).format('YY/MM/DD HH:mm') : ''}/>)}
            </Steps>
            <div className="car-offer-form">
              {
                !offerItem.offerDtos ? <Empty description="无报价结果"
                                                     image={`https://cxt.mjoys.com/api/1019/2019/9/10/2019091019563595t5cmW.png`}/> :
                  <Tabs size="small">
                    {
                      offerItem.offerDtos && offerItem.offerDtos.map((item: any, index: number) => {
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
              {offerItem.offerDtos && !offerItem.offerDtos.length ? null :
                <div className="send-btn">
                  <div
                    className={`send-wechat ${wx ? '' : 'disabled'}`}
                    onClick={() => wx ? onSendWechat(offerItem.offerId) : ''}>
                    发送微信
                  </div>
                  <div className={`send-msg ${mobile ? '' : 'disabled'}`}
                       onClick={() => mobile ? onSendMsg() : ''}>
                    发送短信
                  </div>
                </div>}
            </div>
          </div>
        }) : <Empty description="暂无报价"
                    image={`https://cxt.mjoys.com/api/1019/2019/9/10/2019091019563595t5cmW.png`}/>
    }
  </div>
}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setSendShow: (flag: boolean) => dispatch(actions.setSendShow(flag)),
})
export default connect(mapStateToProps, mapDispatchToProps)(CarOffer)

