import React from 'react'
import {Form, Input, Button, Modal, Icon, message} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import {connect} from 'react-redux'
import fetch from 'fetch/axios'
import {Dispatch} from 'redux'
import * as actions from 'store/actions/work'
import BaseTableComponent from 'components/BaseTableComponent'

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
}

interface IProps extends FormComponentProps {
  currentUser: any;
  decryptMobile: (phone: string) => Promise<string>
}

class CallPanel extends React.Component<IProps> {
  state = {
    sendShow: false,
    callFlag: false,
    msg: {
      total: 0,
      data: []
    },
    page: 1,
    pageSize: 10,
    loading: false,

    inputShow: false,
    inputRow: null,
    inputRandom: [],
    inputMap: null,
    content: '',

  }

  handleMessageRandom = (row: any) => {
    let map: any = {};
    let randomList = row.content.match(/@(.+?)@/g);
    if (row.content.match(/@(.+?)@/g)) {
      randomList = randomList.map((r: any) => {
        row[r] = ''
        map[r] = ''
        return r
      })
      this.setState({inputRow: row, inputShow: true, inputMap: map, inputRandom: randomList, content: row.content})
    } else {
      this.setState({inputRow: row, content: row.content}, () => this.sendMessage())
    }
  }

  // 获取短信模版
  getMsgTemp = () => {
    const {page, pageSize} = this.state;
    const params = {
      page: page,
      pageSize: pageSize,
    }
    this.setState({loading: true})
    fetch.get(`/apiv1/template/shortmsg/list`, {params}).then((res: any) => {
      this.setState({loading: false})
      if (res.code === 20000 || res.code === 20003) {
        const data = res.data || []
        this.setState({msg: {data: data, total: res.count}})
      }
    })
  }

  // 发送短信
  sendMessage = async () => {
    const {inputRow, content}: { inputRow: any, content: string } = this.state
    const {currentUser, decryptMobile} = this.props;
    const adminUser: any = localStorage.getItem('mjoys_user')
    const phone = await decryptMobile(currentUser.auto_add_aes_mobile)
    this.props.form.validateFields(async (err, values) => {
      if (err) return false;
      const params = {
        tempId: inputRow.id,
        receiver: phone,
        tempContent: content,
        userId: localStorage.getItem('mjoys_user_id'),
        accountId: JSON.parse(adminUser).accountId
      }
      await fetch.post(`/apiv1/send/shortmsg`, null, {params}).then((res: any) => {
        if (res.code === 20000 || res.code === 20003) {
          this.setState({sendShow: false, inputShow: false, inputRow: null, content: '', inputMap: null})
          message.success('发送成功')
        } else {
          message.error(res.message || '发送失败')
        }
      })
    });
  }

  // 替换变量
  handleReplace = (random: any, value: any) => {
    const {inputRow, inputMap}: { inputRow: any, inputMap: any } = this.state;
    let inputContent = inputRow.content;
    inputMap[random] = value;
    const keys = Object.keys(inputMap)
    const str = keys.reduce((total, cur) => {
      inputContent = inputContent.replace(cur, inputMap[cur])
      return inputContent.replace(cur, inputMap[cur])
    }, keys[0])
    this.setState({
      inputMap: {
        ...inputMap,
      },
      content: str
    },)
  }


  handleTableChange = () => {

  }


  render() {
    const {getFieldDecorator} = this.props.form
    const {currentUser} = this.props
    const {sendShow, msg, loading, inputShow, inputRandom, content, callFlag} = this.state
    const columns = [
      {title: '模版内容', dataIndex: 'content'},
      {title: '备注', dataIndex: 'description', width: 150,},
      {
        title: '操作',
        render: (row: any) => <Button type="primary" onClick={() => this.handleMessageRandom(row)}>发送</Button>
      }
    ]
    return (
      <div className="call-panel">
        <div className="user-info">
          <div className="avatar"></div>
          <div className="user">
            <span className="username">{currentUser ? currentUser.name : '暂无选中用户'}</span>
            <span className="mobile">{currentUser ? currentUser.mobile : '暂无手机号'}</span>
          </div>
        </div>

        <div className="call-message">

          <div className={`call ${callFlag ? 'active' : ''}`} onClick={() => {
            if (!currentUser) return message.error('请先选中操作用户')
            this.setState({callFlag: !callFlag})
          }}>
            <div className={`icon  icon-call`}>

            </div>
            <span className="content">
              {callFlag ? '挂断' : '拨打'}
            </span>
          </div>

          <div className={`message ${this.state.sendShow ? 'active' : ''}`}
               onClick={() => {
                 if (!currentUser) return message.error('请先选中操作用户')
                 this.setState({sendShow: true})
                 this.getMsgTemp()
               }}>
            <div className={`icon icon-short-message`}>

            </div>
            <span className="content">
               短信
            </span>
          </div>
        </div>

        <Modal visible={sendShow}
               title={'短信模版列表'}
               width={750}
               onCancel={() => this.setState({sendShow: false})}
               footer={null}>
          <BaseTableComponent
            columns={columns}
            dataSource={msg.data}
            loading={loading}
            bordered
            onChange={this.handleTableChange}
            size="small"/>
        </Modal>

        <Modal visible={inputShow} title={'编辑模版参数'} width={550}
               onCancel={() => this.setState({inputShow: false, inputRow: null})}
               onOk={() => this.sendMessage()}
               destroyOnClose>
          <Form>
            {inputRandom.map((v: any, i: number) => <Form.Item label={v} key={i} {...formItemLayout}>
              {
                getFieldDecorator(`${v}`, {
                  initialValue: '', rules: [{
                    required: true,
                    message: `请正确填写参数${v}的对应值!`,
                  },]
                })(
                  <Input placeholder="请输入参数内容" onChange={(e) => this.handleReplace(v, e.target.value)}/>
                )}
            </Form.Item>)}
          </Form>
          <Form.Item label="内容预览">
            <div>
              {content}
            </div>
          </Form.Item>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  currentUser: state.work.currentUser,
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  decryptMobile: (phone: string) => dispatch(actions.decryptMobile(phone))
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CallPanel))
