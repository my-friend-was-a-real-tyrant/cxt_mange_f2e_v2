import React, {FC} from 'react'
import {Avatar} from 'antd'
import {getWechatTime} from "utils/utils"
import faceList from './faceList'
import RcViewer from '@hanyk/rc-viewer'
import 'assets/styles/message.less'

interface IMessage {
  isMe: boolean;
  status: string;
  type: number;
  time: number | null;
  cTime: number | null;
  message: any;
}

interface ITime {
  time: null | number;
  cTime: number | null;
}

const ShowTime: FC<ITime> = (props) => {
  return (
    <span
      className="time">{props.time ? getWechatTime(props.time) : props.cTime ? getWechatTime(props.cTime) : ''}</span>
  )
}

interface IAvatar {
  url: string | number;
}

// 展示头像
const ShowAvatar: FC<IAvatar> = (props) => {
  return <div className="avatar">
    <Avatar size={40} icon="user" shape="square"/>
  </div>
}

// 展示文本
const ShowText: FC<IMessage> = (props) => {
  const value = props.message.replace(/\[(.+?)]/gi, (match: any) => {
    if (!faceList.filter(v => `[${v.title}]` === match).length) return match;
    const className = faceList.filter(v => `[${v.title}]` === match)[0].className;
    return `<img src="//wx.qq.com/zh_CN/htmledition/v2/images/spacer.gif" class="face ${className}" alt=""/>`
  })
  return <div className="text">
    <pre dangerouslySetInnerHTML={{__html: value}}/>
  </div>
}

// 展示图片
const ShowPicture: FC<IMessage> = (props) => {
  return <RcViewer>
    <img className="msg-img" src={`${process.env.REACT_APP_PIC_URL}${props.message}`} style={{width: '100%'}}/>
  </RcViewer>
}

const filterType = (props: IMessage) => {
  switch (props.type) {
    case 0:
      return <ShowText {...props}/>
    case 1:
      return <ShowPicture {...props}/>
  }
}


const Message: FC<IMessage> = (props) => {
  return (
    <div className={`message ${props.isMe ? 'me' : ''}`} id="message">
      <ShowAvatar url={121212}/>
      <div className="message-container">
        <ShowTime time={props.time} cTime={props.cTime}/>
        {filterType(props)}
        {props.isMe ? <span className="status">{props.status}</span> : ''}
      </div>
    </div>
  )
}

export default Message
