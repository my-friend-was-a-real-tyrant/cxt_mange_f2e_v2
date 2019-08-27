/*
 * @Author: sunyonghua
 * @Date: 2019-08-26 15:59:56
 * @Description: route 配置
 */
import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Home from 'pages/Home'
import Login from 'pages/Login';


const AppRouter = () => {
  return <Router>
    <Route exact path="/" component={Home}/>
    <Route path="/login" component={Login}/>
    <Route path="/a" component={Home}/>
  </Router>
}

export default AppRouter