import React from 'react'
import {Form, Select, Checkbox, Button, message} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import {connect} from 'react-redux'
import fetch from 'fetch/axios'
import {checkInsurance} from "../../utils/utils"

const formItemLayout = {
  labelCol: {span: 11},
  wrapperCol: {span: 13},
};

interface IProps extends FormComponentProps {
  currentUser: any;
}

const ComputePrice: React.FC<IProps> = (props) => {
  const {currentUser} = props;
  // 触发车险报价
  const handleOffer = () => {
    props.form.validateFields((err, values) => {
      if (!checkInsurance(currentUser.license)) {
        return message.error('请查看当前用户车牌是否正确')
      }
      const params = {
        insurance: currentUser && currentUser.license,
        unionId: currentUser && currentUser.id,
        buJiMianCheSun: values.buJiMianCheSun ? 1 : 0,
        buJiMianChengKe: values.buJiMianChengKe ? 1 : 0,
        buJiMianDaoQiang: values.buJiMianDaoQiang ? 1 : 0,
        buJiMianHuaHen: values.buJiMianHuaHen ? 1 : 0,
        buJiMianSanZhe: values.buJiMianSanZhe ? 1 : 0,
        buJiMianSheShui: values.buJiMianSheShui ? 1 : 0,
        buJiMianSiJi: values.buJiMianSiJi ? 1 : 0,
        buJiMianZiRan: values.buJiMianZiRan ? 1 : 0,
        boli: values.boli,
        cheSun: values.cheSun,
        chengKe: values.chengKe,
        daoQiang: values.daoQiang,
        huaHen: values.huaHen,
        sanZhe: values.sanZhe,
        sheShui: values.sheShui,
        siJi: values.siJi,
        ziRan: values.ziRan,
        noSanFang: values.noSanFang,
        repairDepot: values.repairDepot,
        buChang: values.buChang,
        holidays: values.holidays,
        buJiMianSheBei: values.buJiMianSheBei ? 1 : 0,
        sheBei: values.sheBei
      }
      fetch.post('/apiv1/insurance/enquiry/bihu', null, {params}).then((res: any) => {
        if (res.code === 20000) {
          message.success(res.message || '报价成功')
        } else {
          message.error(res.message || '报价失败')
        }
      })
    })
  }


  const {getFieldDecorator} = props.form
  return (
    <div className="right-panel-container">
      <Form className="car-price-form" labelAlign="left">
        <h4>基本险</h4>
        <Form.Item label="车辆损失险" {...formItemLayout} >
          {getFieldDecorator('buJiMianCheSun', {valuePropName: 'checked', initialValue: true,})(
            <Checkbox>不计免赔</Checkbox>)}
          {getFieldDecorator('cheSun', {initialValue: 1})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={1}>投保</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="三者责任险" {...formItemLayout}>
          {getFieldDecorator('buJiMianSanZhe', {valuePropName: 'checked', initialValue: true,})(
            <Checkbox>不计免赔</Checkbox>)}
          {getFieldDecorator('sanZhe', {initialValue: 1000000})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={50000}>5万</Select.Option>
              <Select.Option key="2" value={100000}>10万</Select.Option>
              <Select.Option key="3" value={150000}>15万</Select.Option>
              <Select.Option key="4" value={200000}>20万</Select.Option>
              <Select.Option key="5" value={300000}>30万</Select.Option>
              <Select.Option key="6" value={500000}>50万</Select.Option>
              <Select.Option key="7" value={1000000}>100万</Select.Option>
              <Select.Option key="8" value={1500000}>150万</Select.Option>
              <Select.Option key="9" value={2000000}>200万</Select.Option>
              <Select.Option key="19" value={2500000}>250万</Select.Option>
              <Select.Option key="12" value={3000000}>300万</Select.Option>
              <Select.Option key="11" value={5000000}>500万</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="全车盗抢险" {...formItemLayout}>
          {getFieldDecorator('buJiMianDaoQiang', {valuePropName: 'checked', initialValue: false,})(
            <Checkbox>不计免赔</Checkbox>)}
          {getFieldDecorator('daoQiang', {initialValue: 0})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={1}>投保</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="司机座位险" {...formItemLayout}>
          {getFieldDecorator('buJiMianSiJi', {valuePropName: 'checked', initialValue: true,})(
            <Checkbox>不计免赔</Checkbox>)}
          {getFieldDecorator('siJi', {initialValue: 10000})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={10000}>1万</Select.Option>
              <Select.Option key="2" value={20000}>2万</Select.Option>
              <Select.Option key="3" value={30000}>3万</Select.Option>
              <Select.Option key="4" value={40000}>4万</Select.Option>
              <Select.Option key="5" value={50000}>5万</Select.Option>
              <Select.Option key="6" value={100000}>10万</Select.Option>
              <Select.Option key="7" value={200000}>20万</Select.Option>
              <Select.Option key="8" value={300000}>30万</Select.Option>
              <Select.Option key="9" value={500000}>50万</Select.Option>
              <Select.Option key="19" value={1000000}>100万</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="乘客座位险" {...formItemLayout}>
          {getFieldDecorator('buJiMianChengKe', {valuePropName: 'checked', initialValue: true,})(
            <Checkbox>不计免赔</Checkbox>)}
          {getFieldDecorator('chengKe', {initialValue: 10000})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={10000}>1万</Select.Option>
              <Select.Option key="2" value={20000}>2万</Select.Option>
              <Select.Option key="3" value={30000}>3万</Select.Option>
              <Select.Option key="4" value={40000}>4万</Select.Option>
              <Select.Option key="5" value={50000}>5万</Select.Option>
              <Select.Option key="6" value={100000}>10万</Select.Option>
              <Select.Option key="7" value={200000}>20万</Select.Option>
              <Select.Option key="8" value={300000}>30万</Select.Option>
              <Select.Option key="9" value={500000}>50万</Select.Option>
              <Select.Option key="19" value={1000000}>100万</Select.Option>
            </Select>
          )}
        </Form.Item>
        <div className="line"></div>
        <h4>附加险</h4>
        <Form.Item label="划痕险" {...formItemLayout}>
          {getFieldDecorator('buJiMianHuaHen', {valuePropName: 'checked', initialValue: false,})(
            <Checkbox>不计免赔</Checkbox>)}
          {getFieldDecorator('huaHen', {initialValue: 0})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={2000}>2000元</Select.Option>
              <Select.Option key="3" value={5000}>5000元</Select.Option>
              <Select.Option key="4" value={10000}>1万</Select.Option>
              <Select.Option key="5" value={20000}>2万</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="玻璃险" {...formItemLayout}>
          {getFieldDecorator('boli', {initialValue: 0})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={1}>国产</Select.Option>
              <Select.Option key="3" value={2}>进口</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="自燃险" {...formItemLayout}>
          {getFieldDecorator('buJiMianZiRan', {valuePropName: 'checked', initialValue: false,})(
            <Checkbox>不计免赔</Checkbox>)}
          {getFieldDecorator('ziRan', {initialValue: 0})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={1}>投保</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="涉水险" {...formItemLayout}>
          {getFieldDecorator('buJiMianSheShui', {valuePropName: 'checked', initialValue: false,})(
            <Checkbox>不计免赔</Checkbox>)}
          {getFieldDecorator('sheShui', {initialValue: 0})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={1}>投保</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="无法找到第三方险" {...formItemLayout}>
          {getFieldDecorator('noSanFang', {initialValue: 0})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={1}>投保</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="指定修理厂险" {...formItemLayout}>
          {getFieldDecorator('repairDepot', {initialValue: 0})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={1}>国产</Select.Option>
              <Select.Option key="3" value={2}>进口</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="新增设备损失险" {...formItemLayout}>
          {getFieldDecorator('buJiMianSheBei', {valuePropName: 'checked', initialValue: false,})(
            <Checkbox>不计免赔</Checkbox>)}
          {getFieldDecorator('sheBei', {initialValue: 0})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={1}>投保</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="修理期间费用补偿险" {...formItemLayout}>
          {getFieldDecorator('buChang', {initialValue: 0})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="1" value={1}>投保</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="三责险附加法定假日翻倍险" {...formItemLayout}>
          {getFieldDecorator('holidays', {initialValue: 0})(
            <Select size="small">
              <Select.Option key="0" value={0}>不投保</Select.Option>
              <Select.Option key="0" value={1}>投保</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form className="Item">
          <Button type="primary" block onClick={handleOffer} disabled={!currentUser}>确定报价</Button>
        </Form>
      </Form>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser
})
export default connect(mapStateToProps)(Form.create()(ComputePrice))
