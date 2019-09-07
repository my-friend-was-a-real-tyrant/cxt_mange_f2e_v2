import React, {useState, useEffect, FunctionComponent} from 'react'
import {connect} from 'react-redux'
import {Tabs, Form, Table} from 'antd'
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
  const [carOffer, setCarOffer] = useState([
    {
      "businessExpireDate": "2019-10-09",
      "carInfo": {
        "carType": "",
        "consumeTimeStartTime": "2019-10-05",
        "engineNo": "18******386",
        "forceInsuranceStartTime": null,
        "hdzk": 5,
        "licenseNumber": "川A45BU4",
        "modelId": "",
        "ownerName": "*婷",
        "standardName": "哈弗CC7154UM0A轿车",
        "useAge": 0,
        "vehicleFrameNo": "LGWEE******531446",
        "yy": ""
      },
      "errorMsg": null,
      "finalPaymentAmount": 3312.44,
      "finalPaymentInfo": "投保地区:四川,保费加车船税3312.44元",
      "forceExpireDate": null,
      "insuranceCompanyId": 4,
      "insuranceCompanyName": "人保",
      "offerDetailList": [
        {
          "amountStr": "113014.0",
          "insuranceName": "车辆损失险",
          "quotesPrice": "￥936.25"
        },
        {
          "amountStr": "100万",
          "insuranceName": "第三者责任险",
          "quotesPrice": "￥805.10"
        },
        {
          "amountStr": "1万",
          "insuranceName": "司机座位责任险",
          "quotesPrice": "￥14.72"
        },
        {
          "amountStr": "1万",
          "insuranceName": "乘客座位责任险",
          "quotesPrice": "￥37.35"
        },
        {
          "amountStr": "车损、三者、司机、乘客",
          "insuranceName": "不计免赔附加",
          "quotesPrice": "￥269.02"
        },
        {
          "amountStr": "",
          "insuranceName": "商业险折扣费",
          "quotesPrice": "0.35910000"
        },
        {
          "amountStr": "",
          "insuranceName": "商业险出单价",
          "quotesPrice": "￥2062.44"
        },
        {
          "amountStr": "",
          "insuranceName": "交强险",
          "quotesPrice": "￥950.00"
        },
        {
          "amountStr": "",
          "insuranceName": "车船税",
          "quotesPrice": "￥300.00"
        },
        {
          "amountStr": "",
          "insuranceName": "出单价总计",
          "quotesPrice": "￥3312.44"
        }
      ],
      "pingAnScore": null,
      "quotesIsSuccessful": true,
      "schemeName": "壁虎人保(0.0)"
    }
  ])
  useEffect(() => getOffer(), [currentUser])

  const getOffer = () => {
    if (currentUser) {
      const params = {
        insurance: '浙A171kk'//currentUser.license
      }
      fetch.post(`/apiv1/insurance/offer`, null, {params}).then((res: any) => {
        if (res.code === 20000) {
          setCarOffer(res.data)
        }
      })
    }
  }

  return <div className="right-panel-container">
    <div className="car-offer-form">
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
    </div>
  </div>
}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser
})
export default connect(mapStateToProps)(CarOffer)

