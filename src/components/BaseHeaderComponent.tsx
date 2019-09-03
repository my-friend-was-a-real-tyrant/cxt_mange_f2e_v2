import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import BaseMenuComponent from './BaseMenuComponent'
import BaseUserComponent from './BaseUserComponent'

class BaseHeaderComponent extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="header-left-wrapper">
          <span className="logo">AI车险通</span>
          <BaseMenuComponent/>
        </div>
        <BaseUserComponent/>
      </Fragment>
    )
  }
}

export default connect()(BaseHeaderComponent)
