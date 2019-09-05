import React from 'react'
import WorkLeftPane from './WorkLeftPane'
import WorkRightPane from './WorkRightPane'
import WorkCenterPane from './WorkCenterPane'
import 'assets/styles/work.less'

class Work extends React.Component {
  render() {
    return (
      <div className="work">
        <WorkLeftPane/>
        <WorkRightPane/>
        <WorkCenterPane/>
      </div>
    )
  }
}

export default Work
