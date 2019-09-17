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
        console.log('wsmessage======' + msg)
        switch (msg) {
          case $.verto.enum.message.pvtEvent:
            // console.error("pvtEvent", data.pvtData);
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
            //            console.error("clientReady", data);
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
        console.log(d.state, $.verto.enum.state.ringing)
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
      onWSLogin: function (v, success) {
        console.log('onWSLogin', success)
      },
      onWSClose: function (v, success) {
        console.log('wsclose======' + v)
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
    console.log(__act, __str)
    if (__act === 'calldisplayuuid') {
      message.info('电话接通了')
      this.setState({
        timerId: setInterval(this.timer, 50)
      })
    } else if (__act === 'hangup') {
      clearInterval(this.state.timerId)
      this.setState({buttonText: '拨打', hour: 0, minute: 0, second: 0, millisecond: 0, timerId: 0})
    } else if (__act === 'call') {
      this.docall(__str)
    }
  }


  docall = (caller) => {
    const {code, bindPreNumber} = this.state;
    const preNumber = `${code}${bindPreNumber}${caller}`
    window.postMessage(`trying~${preNumber}`, window.sipSDK || window.location.origin);

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
      mute: 'off'
    })
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
