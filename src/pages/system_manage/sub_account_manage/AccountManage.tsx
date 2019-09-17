import React, {FunctionComponent, useState} from 'react'
import {Tabs} from 'antd'
import RoleManage from './RoleManage'
import SubAccountManage from './SubAccountManage'
import TeamMange from "./TeamManage"

const AccountManage: FunctionComponent = () => {
  return (
    <div>
      <Tabs animated={false} >
        <Tabs.TabPane key="1" tab="角色管理">
          <RoleManage />
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="子账号管理">
          <SubAccountManage/>
        </Tabs.TabPane>
        <Tabs.TabPane key="3" tab="团队管理">
          <TeamMange/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}
export default AccountManage
