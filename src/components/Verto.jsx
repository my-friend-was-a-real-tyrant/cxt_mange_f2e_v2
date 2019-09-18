import React from 'react'
import {message} from 'antd'
import fetch from 'fetch/axios'

/* eslint-disable */

const parentW = window;
const sipUrl = location.origin

class Verto extends React.Component {
  state = {
    sipNumber: '',
    sipPasswd: '',
    hostName: 'devqianwei.mjoys.com',
    bindPreNumber: '',
    wsUrl: 'wss://devqianwei.mjoys.com',
    vertoHandler: null,
    code: '',
    wslogin: false,
    caller: '',//拨打的号码
  }
  currentCall


  componentDidMount() {
    this.getCardSlot()

    if (window.addEventListener) {
      window.addEventListener('message', this.handleMessage, false)
    }
    parentW.postMessage('ready', location.origin);
  }

  init = () => {
    var callbacks = {
      onMessage: function (verto, dialog, msg, data) {
        switch (msg) {
          case $.verto.enum.message.pvtEvent:
            if (data.pvtData) {
              switch (data.pvtData.action) {
                case "conference-liveArray-part":
                  break;
                case "conference-liveArray-join":
                  break;
              }
            }
            break;
          case $.verto.enum.message.clientReady:
            break;
          case $.verto.enum.message.info:
            break;
          case $.verto.enum.message.display:
            break;
          default:
            break;
        }
      },

      onDialogState: function (d) {
        switch (d.state) {
          case $.verto.enum.state.ringing:
            break;
          case $.verto.enum.state.trying:
            break;
          case $.verto.enum.state.early:
          case $.verto.enum.state.active:
            break;
          case $.verto.enum.state.hangup:
            parentW.postMessage('hangup', sipUrl);
            break;
          case $.verto.enum.state.destroy:
            break;
          case $.verto.enum.state.held:
            break;
          default:
            break;
        }
      },
      onWSLogin: (v, success) => {
        console.log('onWSLogin', success)
        this.setState({wslogin: success})
      },
      onWSClose: (v, success) => {
        console.log('onWSClose', success)
        parentW.postMessage('hangup', sipUrl);
        this.setState({wslogin: success})
      },

      onEvent: function (v, e) {
        console.debug("GOT EVENT", e);
      },
    };
    const {sipNumber, sipPasswd, hostName, wsUrl} = this.state;
    this.setState({
      vertoHandler: new $.verto({
        login: sipNumber + '@' + hostName,
        passwd: sipPasswd,
        socketUrl: wsUrl,
        sessid: $.verto.genUUID(),
        ringFile: 'sounds/bell_ring2.wav',
        videoParams: {
          "minWidth": 1280,
          "minHeight": 720,
          "maxWidth": 1280,
          "maxHeight": 720,
          "minFrameRate": 15,
          "vertoBestFrameRate": 30
        },
        deviceParams: {
          // Set to 'none' to disable outbound audio.
          useMic: 'any',
          // Set to 'none' to disable inbound audio.
          useSpeak: 'any',
          // Set to 'none' to disable outbound video.
          useCamera: 'any',
        },
        tag: 'video-container',
        iceServers: true
      }, callbacks)
    })
  }

  getCardSlot = () => {
    fetch.get(`/apiv1/uac/user/getCardSlot`).then((res) => {
      if (res.code === 20000) {
        sessionStorage.setItem('verto-call-flag', '1')
        this.setState({
          sipNumber: res.data.sipnumber,
          sipPasswd: res.data.sippasswd,
          code: res.data.gateWayCode,
          bindPreNumber: res.data.bindPreNumber
        }, () => {
          setTimeout(() => {
            $.verto.init({
              skipPermCheck: false
            }, this.init);
          }, 1000)
        })
      } else if (res.code === 20003) {
        sessionStorage.setItem('verto-call-flag', '0')
        this.setState({
          sipNumber: '',
          sipPasswd: '',
          code: '',
          bindPreNumber: '',
          vertoHandler: null
        })
      }
    })
  }

  // 无任务id的log
  callNoTaskUuidLog = (uuid) => {
    const {caller, bindPreNumber} = this.state;
    const params = {
      access_token: localStorage.getItem('access_token'),
      mobile: caller,
      uuid: uuid || '',
      caller: bindPreNumber,
    }
    fetch.post(`/apiv1/otb/callRecord/saveCallRecordNoTask`, params, {params}).then(res => {
      if (res.code === 20000) {
        console.log('无任务id 传输 uuid')
      }
    })
  }

  // 有任务id的log
  callUuidLog = (uuid) => {
    var params = {
      callStatus: 1,
      callUuid: uuid || '',
      caller: this.state.caller,
    }
    fetch.post(`/apiv1/otb/callRecord/saveCallRecord/${sessionStorage.getItem('task_id')}`, params, {params}).then(res => {
      if (res.code === 20000) {
        console.log('有任务id 传输 uuid')
      }
    })
  }

  // 接通后的uuid
  callDisplayUuid = (uuid) => {
    const params = {
      uuid
    }
    fetch.post(`/apiv1/otb/callRecord/updateCallResultOutcome`, params, {params}).then(res => {
      if (res.code === 20000) {
        console.log('接通后传输uuid')
      }
    })
  }

  // 进入拨打即调用
  handleCallTaskId = () => {
    fetch.post(`/apiv1/otb/callRecord/saveCallLogfq/${sessionStorage.getItem('task_id')}`).then(res => {
      if (res.code === 20000) {
        console.log('进入拨打有任务id调用')
      }
    })
  }

  handleMessage = (event) => {
    const pmsgOrigin = window.sipSDK || window.location.origin
    event = event || window.event
    if (event.origin !== pmsgOrigin) return
    const msgStr = event.data + ''
    const __act = msgStr.split('~')[0]
    const __str = msgStr.split('~')[1]
    if (__act === 'calldisplayuuid') {
      message.info('电话接通了')
      this.callDisplayUuid(__str)
      this.setState({
        timerId: setInterval(this.timer, 50)
      })
    } else if (__act === 'calluuid') {
      if (sessionStorage.getItem('task_id')) {
        this.callUuidLog(__str)
      } else {
        this.callNoTaskUuidLog(__str)
      }
    } else if (__act === 'hangup') {
      this.currentCall && this.currentCall.hangup()
      clearInterval(this.state.timerId)
      this.setState({buttonText: '拨打', hour: 0, minute: 0, second: 0, millisecond: 0, timerId: 0})
    } else if (__act === 'call') {
      if (sessionStorage.getItem('task_id')) {
        this.handleCallTaskId()
      }
      if (!this.state.wslogin) {
        message.info('socket重连中,暂时不可拨打电话')
        window.postMessage(`hangup~`, pmsgOrigin)
        return false
      } else {
        this.docall(__str)
      }
    }
  }


  docall = (caller) => {
    const {code, bindPreNumber} = this.state;
    const preNumber = `${code}${bindPreNumber}${caller}`
    this.setState({caller})
    if (sessionStorage.getItem('verto-call-flag') === '0') {
      message.info('没有可供使用的sip账号，请联系管理员配置')
      return false
    }
    if (this.state.vertoHandler) {
      // 开始拨打
      this.currentCall = this.state.vertoHandler.newCall({
        destination_number: preNumber,
        caller_id_name: 'mjoys_' + this.generateSalt(6),
        caller_id_number: '81984',
        outgoingBandwidth: 'default',
        incomingBandwidth: 'default',
        // Enable stereo audio.
        useStereo: true,
        // Set to false to disable inbound video.
        useVideo: false,
        // tag: 'video-container',
        dedEnc: false,
        mirrorInput: false,
        userVariables: {},
      })
    }
  }

  generateSalt = (length) => {
    const UIDCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    length = length | 0 || 12;
    var i, r = [];
    for (i = 0; i < length; ++i) {
      r.push(UIDCHARS[Math.floor(Math.random() * UIDCHARS.length)]);
    }
    return r.join('');
  }

  componentWillUnmount() {
    if (this.state.vertoHandler) {
      this.state.vertoHandler.rpcClient.closeSocket()
      window.removeEventListener('message', this.handleMessage)
    }
  }

  render() {
    return (
      <div>
        <video id="video-container" autoPlay="autoplay" style={{display: 'none'}}>
        </video>
        <audio id="audio-container" autoPlay="autoPlay">

        </audio>
      </div>
    )
  }
}

/* eslint-enable */
export default Verto
