/**
 * @Author: sunyonghua
 * @Date: 2019-08-26 15:59:56
 * @Description: pages route 配置
 */
import React from 'react'
import {Route, Switch} from 'react-router-dom'

// 工作台
import Work from 'pages/work_bench/work'
import SearchCar from 'pages/work_bench/search_car'

// 作业管理
import PhoneTask from 'pages/task_manage/phone_task';
import WechatManage from 'pages/task_manage/wechat_manage';
import ShortMessage from 'pages/task_manage/short_message';
// 报表管理

// 数据管理
import RobotDataManage from 'pages/robot_manage/robot_data'
import AgentDataManage from 'pages/robot_manage/agent_data'

const PageRouter = () => {
  return <Switch>
    {/* 工作台 */}
    <Route path="/app/work" component={Work}/>
    <Route path="/app/search_car" component={SearchCar}/>
    {/* 数据管理 */}
    <Route path="/app/robot_data" component={RobotDataManage}/>
    <Route path="/app/agent_data" component={AgentDataManage}/>
    {/* 作业管理 */}
    <Route path="/app/phone_task" component={PhoneTask}/>
    <Route path="/app/wechat_manage" component={WechatManage}/>
    <Route path="/app/short_message" component={ShortMessage}/>
  </Switch>
}

export default PageRouter
