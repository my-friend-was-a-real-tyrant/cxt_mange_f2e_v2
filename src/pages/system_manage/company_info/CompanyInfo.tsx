import React, {useState,useEffect,FunctionComponent} from 'react'
import CompanyPanel from './CompanyPanel'
import RobotInfo from './RobotInfo'
import AgentInfo from './AgentInfo'
import RechargeList from './RechargeList'
import fetch from "../../../fetch/axios"

const CompanyInfo: FunctionComponent = () => {
  const [info, setInfo] = useState<any>(null)

  useEffect(() => getCompanyInfo(), [])

  const getCompanyInfo = () => {
    fetch.get(`/apiv1/uac/account/${localStorage.getItem('mjoys_account_id')}`).then((res: any) => {
      if (res.code === 20000) {
        setInfo(res.data)
      }
    })
  }


  return (
    <div style={{padding: 20}}>
      <CompanyPanel companyInfo={info}/>
      <RobotInfo companyInfo={info}/>
      <AgentInfo companyInfo={info}/>
      <RechargeList/>
    </div>
  )
}

export default CompanyInfo
