import React from 'react'
import {Upload, message, Button, Form, Modal, Select, Popover} from 'antd'
import {FormComponentProps} from 'antd/es/form'
import $ from 'jquery'
import fetch from 'fetch/axios'
import 'assets/styles/wechat.less'
import faceList from './faceList'

interface IProps extends FormComponentProps {
  sendMsg: (value: any) => any;
  wsState: string;
}

interface IState {
  show: boolean;
  msgTemp: any;
  groupArr: any;
  cText: string;
  innerTextValue: string;
}

class SendMessage extends React.Component<IProps, IState> {
  state = {
    show: false,
    msgTemp: [],
    groupArr: [],
    cText: '',
    innerTextValue: '',
  }

  componentDidMount() {
    this.getMsgTemp()
    $(document).on('paste', '.text-area', (e: any) => {
      this.textInit(e)
      const area = $('.text-area')
      const html = area.html().replace(/<[^>]+>/gi, '')
      area.html(html)
    })
  }

  getMsgTemp = () => {
    fetch.get(`/apiv1/robot/wx-msg-temp`).then((res: any) => {
      if (res.code === 20000) {
        const data = res.data || []
        let groupArr: any = []
        data.forEach((v: any) => {
          if (groupArr.indexOf(v.msg_group) === -1) {
            groupArr.push(v.msg_group)
          }
        })
        this.setState({groupArr: groupArr, msgTemp: data})
      }
    })
  }

  handleSetValue = (e: any) => {
    const {cText} = this.state
    this.setState({show: false, innerTextValue: `${$('.text-area').html()}${cText}`})
  }

  textInit = (e: any) => {
    let win: any = window
    let docu: any = document
    e.preventDefault();//阻止默认事件
    var text;
    var clp = (e.originalEvent || e).clipboardData;
    if (clp === undefined || clp === null) {
      text = win.clipboardData.getData("text") || "";
      if (text !== "") {
        if (window.getSelection) {
          var newNode = document.createElement("span");
          newNode.innerHTML = text;
          win.getSelection().getRangeAt(0).insertNode(newNode);
        } else {
          docu.selection.createRange().pasteHTML(text);
        }
      }
    } else {
      text = clp.getData('text/plain') || "";
      if (text !== "") {
        document.execCommand('insertText', false, text);
      }
    }
  }

  onPaste = (event: React.ClipboardEvent) => {

    // 添加到事件对象中的访问系统剪贴板的接口
    var clipboardData = event.clipboardData,
      i = 0,
      items,
      item,
      types

    if (clipboardData) {
      items = clipboardData.items

      if (!items) {
        return
      }

      item = items[0]
      // 保存在剪贴板中的数据类型
      types = clipboardData.types || []

      for (; i < types.length; i++) {
        if (types[i] === 'Files') {
          item = items[i]
          break
        }
      }

      // 判断是否为图片数据
      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        // 读取该图片
        this.imgReader(item)
      }
    }
  }

  imgReader = (item: any) => {
    const {sendMsg} = this.props
    var file = item.getAsFile(),
      reader = new FileReader()
    // 读取文件后将其显示在网页中
    reader.onload = function (e: any) {
      var img = new Image()

      img.src = e.target.result

      // document.body.appendChild(img)
      Modal.confirm({
        title: '发送图片?',
        content: <img src={e.target.result} style={{width: 300, height: 300}}/>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const formData = new FormData()
          formData.append('file', file)
          fetch.post(``, formData).then((res: any) => {
            if (res.code === 20000) {
              sendMsg({message: res.data, type: 1, time: new Date().getTime()})
            }
          })
        },
      })
    }
    // 读取文件
    reader.readAsDataURL(file)
  }


  handleFace = (v: any) => {
    this.setState({
      innerTextValue: `${$('.text-area').html()}<img class="face ${v.className}" data-text="${v.title}" src="//wx.qq.com/zh_CN/htmledition/v2/images/spacer.gif" alt=""/>`
    })
  }

  handleSubmit = (e?: any) => {
    if (e) {
      e.preventDefault()
    }
    if (this.props.wsState !== 'ready') {
      message.error({
        message: '无法与服务器建立连接',
        placement: 'bottomRight',
        duration: 1,
      })

      return
    }

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {picture} = values
        const textArea = document.querySelector('.text-area')
        const innerHTML = textArea && textArea.innerHTML;
        const text = innerHTML && innerHTML.replace(/<img(.*?)>/gi, (match, p1) => `[${$(match).data('text')}]`)

        if (!innerHTML && !picture) {
          console.log('输入的字符为空')
          return false;
        }
        const type = text ? '0' : picture ? '1' : '2'
        const message = text || picture
        this.props.sendMsg({message, type, time: new Date().getTime()})
        $('.text-area').html('')
        this.setState({innerTextValue: ''})
      }
    })
  }


  render() {
    const {sendMsg} = this.props
    const { getFieldDecorator} = this.props.form
    const uploadConfig = {
      action: '',
      showUploadList: false,
      onChange(info: any) {
        if (info.file.status === 'done') {
          if (info.file.response.code === 20000) {
          }
        } else if (info.file.status === 'error') {
          message.error('图片上传失败')
        }
      }
    }
    const onKeyDown = (e: any) => {
      if (e.keyCode === 13 && !(e.shiftKey)) {
        e.preventDefault();
        this.handleSubmit()
      }
    }

    const face = <div className="qq_face">
      {
        faceList.map(v => <a title={v.title}
                             key={v.title}
                             type="qq"
                             className={`face ${v.className}`}
                             onClick={() => this.handleFace(v)}> </a>)
      }
    </div>
    return (
      <div id="send-message">
        <Form>
          <Form.Item className="toolbar">
            <Popover placement="top" content={face} trigger="click">
              <span className="web_wechat_face" title="表情"> </span>
            </Popover>
            {getFieldDecorator('picture')(
              <Upload {...uploadConfig}>
              <span className="web_wechat_pic webuploader-container" title="图片">
                <div className="webuploader-pick"/>
              </span>
              </Upload>,
            )}
            <span>快捷回复</span>
          </Form.Item>
          <Form.Item>
            <pre contentEditable={true}
                 dangerouslySetInnerHTML={{__html: `${this.state.innerTextValue}`}}
                 onKeyDown={onKeyDown}
                 onChange={(e: any) => this.setState({innerTextValue: e.target.value})}
                 className="text-area"/>
          </Form.Item>
          <Form.Item style={{marginBottom: '0', textAlign: 'right'}}>
            <Button htmlType="submit"> 发送</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}


export default Form.create<IProps>()(SendMessage)
