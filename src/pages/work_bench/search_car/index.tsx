import React, {FunctionComponent, useState} from 'react'
import {Form, Input, Button, Row, Col, Spin, message} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import fetch from "fetch/axios"
import 'assets/styles/search-car.less'
import {checkInsurance} from "utils/utils"

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};
const SearchCar: FunctionComponent<FormComponentProps> = (props) => {
  const [carInfo, setCarInfo] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const getCarInfo = () => {
    props.form.validateFields((err, values) => {
      if (!checkInsurance(values.insurance)) {
        return message.error('请输入正确的车牌号')
      }
      const params = {
        ins: values.insurance
      }
      setLoading(true)
      fetch.get(`/apiv1/car-info/ins`, {params}).then((res: any) => {
        setLoading(false)
        if (res.code === 20000) {
          setCarInfo(res.data)
        } else {
          message.error(res.message || '出现错误')
          setCarInfo(null)
        }
      })
    })
  }

  const {getFieldDecorator} = props.form
  return (
    <div className="search-car">
      <Spin spinning={loading}>
        <Form labelAlign="left" layout="inline">
          <Form.Item label="车牌号">
            {getFieldDecorator('insurance', {initialValue: ''})(
              <Input placeholder="请输入车牌号"/>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={getCarInfo}>搜索</Button>
          </Form.Item>
        </Form>
        <Form labelAlign="left">
          <Row>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="车牌号">
                {carInfo && carInfo.insurance}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="车主姓名">
                {carInfo && carInfo.cryName}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="手机号码">
                {carInfo && carInfo.cry_mobile}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="证件类型">
                身份证
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="证件号码">
                {carInfo && carInfo.cryIdentity}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="品牌型号">
                {carInfo && carInfo.brand}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="发动机号">
                {carInfo && carInfo.cryEngineNo}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="车架号">
                {carInfo && carInfo.cryFrameNo}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="注册登记时间">
                {carInfo && carInfo.srcTime}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="座位数">
                {carInfo && carInfo.seats}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="商业险生效时间">

              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="交强险生效时间">

              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </div>
  )
}

export default Form.create()(SearchCar)
