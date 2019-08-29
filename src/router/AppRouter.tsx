/**
 * @Author: sunyonghua
 * @Date: 2019-08-26 15:59:56
 * @Description: route 配置
 */
import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import App from 'pages/App'
import Login from 'pages/Login';


const AppRouter = () => {
  return <Router>
    <Switch>
      <Route exact path="/login" component={Login}/>
      <Route path="/app" component={App}/>
    </Switch>
  </Router>
}

export default AppRouter