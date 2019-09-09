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

// 数据管理
import RobotDataManage from 'pages/data_manage/robot_data'
import AgentDataManage from 'pages/data_manage/agent_data'
import AgentDataDetail from 'pages/data_manage/agent_data/AgentDataDetail'
import RobotDataDetail from 'pages/data_manage/robot_data/RobotDataDetail'
// 机器人管理
import CallPlan from 'pages/robot_manage/call_plan/CallPlan'
import CallList from 'pages/robot_manage/call_list/CallList'
import CallDetail from 'pages/robot_manage/call_detail/CallDetail'
// 报表管理
import FollowUp from 'pages/report_form/follow_up/FollowUp'
import Outbound from 'pages/report_form/outbound/Outbound'
import ShortMessageReport from 'pages/report_form/short_message/ShortMessage'
import OfferReport from 'pages/report_form/offer_report/OfferReport'
const PageRouter = () => {
  return <Switch>
    {/* 工作台 */}
    <Route path="/app/work" component={Work}/>
    <Route path="/app/search_car" component={SearchCar}/>
    {/* 数据管理 */}
    <Route exact path="/app/robot_data" component={RobotDataManage}/>
    <Route exact path="/app/agent_data" component={AgentDataManage}/>
    <Route path="/app/agent_data/:id" component={AgentDataDetail}/>
    <Route path="/app/robot_data/:id" component={RobotDataDetail}/>
    {/* 机器人管理 */}
    <Route path="/app/call_plan" component={CallPlan}/>
    <Route path="/app/call_list" component={CallList}/>
    <Route path="/app/call_details" component={CallDetail}/>
    {/* 作业管理 */}
    <Route path="/app/phone_task" component={PhoneTask}/>
    <Route path="/app/wechat_manage" component={WechatManage}/>
    <Route path="/app/short_message" component={ShortMessage}/>
    {/* 报表管理 */}
    <Route path="/app/follow_up" component={FollowUp}/>
    <Route path="/app/outbound" component={Outbound}/>
    <Route path="/app/short_message_report" component={ShortMessageReport}/>
    <Route path="/app/offer_report" component={OfferReport}/>
  </Switch>
}

export default PageRouter
