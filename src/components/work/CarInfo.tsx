import React, {FunctionComponent, useState, useEffect} from 'react'
import {Form, Input, Select, DatePicker, Icon, message, Button, Cascader, Empty} from 'antd'
import {connect} from 'react-redux'
import {FormComponentProps} from 'antd/es/form'
import moment from 'moment'
import RegDateOption from './RegDate'
import fetch from 'fetch/axios'
import 'assets/styles/right-panel.less'

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};

interface IProps extends FormComponentProps {
  currentUser: any;
}

const filter = (status: any) => {
  if (status === 1) {
    return '是'
  } else if (status === 0) {
    return '否'
  } else {
    return ''
  }
}

const CarInfo: FunctionComponent<IProps> = (props) => {
  const currentUser: any = props.currentUser;
  const [edit, setEdit] = useState<boolean>(false)
  const [carInfo, setCarInfo] = useState<any>(null)

  useEffect(() => getCarInfo(), [currentUser])

  const getCarInfo = () => {
    if (currentUser) {
      const params = {
        ins: currentUser.license
      }
      fetch.get(`/apiv1/car-info/ins`, {params}).then((res: any) => {
        if (res.code === 20000) {
          setCarInfo(res.data)
        } else {
          setCarInfo(null)
        }
      })
    }
  }

  const handleChangeCarInfo = () => {
    props.form.validateFields((err, values) => {
      if (!values.insurance) {
        setEdit(false)
        return message.info('该用户无车牌，请先在用户信息中添加车牌')
      }
      const params = {
        last_ins_comp: values.last_ins_comp,
        cname: values.cryName,
        mobile: values.cry_mobile,
        displacement: values.displacement,
        frame: values.cryFrameNo,
        engine: values.cryEngineNo,
        price: values.cprice,
        brand: values.brand,
        model: values.model,
        address: values.address,
        verify: values.verify,
        memo: values.memo,
        seats: values.seats,
        transfer: values.transfer,
        renewal: values.renewal,
        transfer_date: values.transfer_date ? moment(values.transfer_date).format('YYYY-MM-DD') : '',
        cryIdentity: values.cryIdentity,
        licensePlate: values.insurance ? values.insurance.toUpperCase() : '',
        srcTime: values.srcTime ? moment(values.srcTime).format('YYYY-MM-DD') : '',
        regDate: values.regDate && values.regDate.length ? `${values.regDate[0]}-${values.regDate[1]}` : '',
      }
      fetch.put(`/apiv1/wx/updateCarInfo`, params).then((res: any) => {
        if (res.code === 20000) {
          message.success('修改成功')
          setEdit(false)
          getCarInfo()
        }
      })
    })
  }

  const {getFieldDecorator} = props.form;
  return (
    <div className="right-panel-container">
      {
        currentUser ? <Form className="car-info-form" labelAlign="left">
          <div className="right-panel-title">
            <span className="title"><b className="icon icon-car"/>车辆信息</span>
            <span className="btn" onClick={() => setEdit(!edit)}>
            <b><Icon type="edit"/></b>&nbsp; {edit ? '取消' : '编辑'}
          </span>
          </div>
          <Form.Item label="车牌" {...formItemLayout}>
            {/* 如果ins接口没获取到车辆信息就把当前的用户信息的车牌号拿来用 */}
            {edit ? getFieldDecorator('insurance', {initialValue: carInfo && carInfo.insurance ? carInfo.insurance : currentUser && currentUser.license})(
              <Input placeholder="请输入车牌号" disabled/>
            ) : carInfo && carInfo.insurance ? carInfo.insurance : currentUser && currentUser.license}
          </Form.Item>
          <Form.Item label="姓名" {...formItemLayout}>
            {edit ? getFieldDecorator('cryName', {initialValue: carInfo && carInfo.cryName})(
              <Input placeholder="请输入姓名"/>
            ) : carInfo && carInfo.cryName}
          </Form.Item>
          <Form.Item label="发动机号" {...formItemLayout}>
            {edit ? getFieldDecorator('cryEngineNo', {initialValue: carInfo && carInfo.cryEngineNo})(
              <Input placeholder="请输入发动机号"/>
            ) : carInfo && carInfo.cryEngineNo}
          </Form.Item>
          <Form.Item label="车架号" {...formItemLayout}>
            {edit ? getFieldDecorator('cryFrameNo', {initialValue: carInfo && carInfo.cryFrameNo})(
              <Input placeholder="请输入车架号"/>
            ) : carInfo && carInfo.cryFrameNo}
          </Form.Item>
          <Form.Item label="品牌" {...formItemLayout}>
            {edit ? getFieldDecorator('brand', {initialValue: carInfo && carInfo.brand})(
              <Input placeholder="请输入品牌"/>
            ) : carInfo && carInfo.brand}
          </Form.Item>
          <Form.Item label="型号" {...formItemLayout}>
            {edit ? getFieldDecorator('model', {initialValue: carInfo && carInfo.model})(
              <Input placeholder="请输入型号"/>
            ) : carInfo && carInfo.model}
          </Form.Item>
          <Form.Item label="座位数" {...formItemLayout}>
            {edit ? getFieldDecorator('seats', {initialValue: carInfo && carInfo.seats})(
              <Input placeholder="请输入型号"/>
            ) : carInfo && carInfo.seats}
          </Form.Item>
          <Form.Item label="排量" {...formItemLayout}>
            {edit ? getFieldDecorator('displacement', {initialValue: carInfo && carInfo.displacement})(
              <Input placeholder="请输入排量"/>
            ) : carInfo && carInfo.displacement}
          </Form.Item>
          <Form.Item label="初登日期" {...formItemLayout}>
            {edit ? getFieldDecorator('srcTime', {initialValue: carInfo && carInfo.srcTime ? moment(carInfo && carInfo.srcTime) : null})(
              <DatePicker format="YYYY/MM/DD"/>
            ) : carInfo && carInfo.srcTime}
          </Form.Item>
          <Form.Item label="保险日期" {...formItemLayout}>
            {edit ? getFieldDecorator('regDate', {
              initialValue: carInfo && carInfo.regDate && carInfo.regDate.split('-')[0] ? [
                carInfo && carInfo.regDate && carInfo.regDate.split('-')[0],
                carInfo && carInfo.regDate && carInfo.regDate.split('-')[1]
              ] : ''
            })(<Cascader options={RegDateOption} placeholder="请选择日期"/>) : carInfo && carInfo.regDate}
          </Form.Item>
          <Form.Item label="身份证号" {...formItemLayout}>
            {edit ? getFieldDecorator('cryIdentity', {initialValue: carInfo && carInfo.cryIdentity})(
              <Input placeholder="请输入身份证号"/>
            ) : carInfo && carInfo.cryIdentity}
          </Form.Item>
          <Form.Item label="地址" {...formItemLayout}>
            {edit ? getFieldDecorator('address', {initialValue: carInfo && carInfo.address})(
              <Input placeholder="请输入地址"/>
            ) : carInfo && carInfo.address}
          </Form.Item>
          <Form.Item label="过户车" {...formItemLayout}>
            {edit ? getFieldDecorator('transfer', {initialValue: carInfo && carInfo.transfer})(
              <Select>
                <Select.Option value={1}>是</Select.Option>
                <Select.Option value={0}>否</Select.Option>
              </Select>
            ) : filter(carInfo && carInfo.transfer)}
          </Form.Item>
          <Form.Item label="过户日期" {...formItemLayout}>
            {edit ? getFieldDecorator('transfer', {initialValue: carInfo && carInfo.transfer_date ? moment(carInfo.transfer_date) : null})(
              <DatePicker disabled/>
            ) : carInfo && carInfo.transfer_date ? moment(carInfo.transfer_date) : null}
          </Form.Item>
          <Form.Item label="是否转保" {...formItemLayout}>
            {edit ? getFieldDecorator('renewal', {initialValue: carInfo && carInfo.renewal})(
              <Select>
                <Select.Option value={1}>是</Select.Option>
                <Select.Option value={0}>否</Select.Option>
              </Select>
            ) : filter(carInfo && carInfo.renewal)}
          </Form.Item>
          <Form.Item label="上年保司" {...formItemLayout}>
            {edit ? getFieldDecorator('last_ins_comp', {initialValue: carInfo && carInfo.last_ins_comp})(
              <Input placeholder="请输入上年保司"/>
            ) : carInfo && carInfo.last_ins_comp}
          </Form.Item>
          <Form.Item>
            {edit ? <Button type="primary" block onClick={handleChangeCarInfo}>确认修改</Button> : null}
          </Form.Item>
        </Form> : <Empty description="暂无车辆信息"
                         image={`https://cxt.mjoys.com/api/1019/2019/9/10/2019091019563595t5cmW.png`}/>
      }

    </div>
  )
}
const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser
})

export default connect(mapStateToProps)(Form.create()(CarInfo))
