/**
 * @Author: sunyonghua
 * @Date: 2019-08-26 15:59:56
 * @Description: pages route 配置
 */
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from 'pages/Home'
import CloudChat from 'pages/wechat/CloudChat'

const PageRouter = () => {
  return <Switch>
    <Route path="/app/home" component={Home}/>
    <Route path="/app/cloud-chat" component={CloudChat}/>
  </Switch>
}

export default PageRouter