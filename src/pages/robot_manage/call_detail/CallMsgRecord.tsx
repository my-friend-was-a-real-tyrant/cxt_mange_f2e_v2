import React, {FunctionComponent, useEffect, useState} from 'react'
import fetch from 'fetch/axios'

interface IProps {
  row: any
}

const CallMsgRecord: FunctionComponent<IProps> = (props) => {
  const {row} = props;
  console.log(props.row)

  useEffect(() => {
    getCallTextById()
    getMarketStatusById()
  }, [])

  const getCallTextById = () => {
    fetch.get(`/apiv1/robot/report/getCallTextById/${row.result_id}`).then((res: any) => {
      console.log(res)
    })
  }

  const getMarketStatusById = () => {
    fetch.get(`/apiv1/robot/report/getMarketStatusById/${row.result_id}`).then((res: any) => {
      console.log(res)
    })
  }


  return <div>

  </div>
}

export default CallMsgRecord
