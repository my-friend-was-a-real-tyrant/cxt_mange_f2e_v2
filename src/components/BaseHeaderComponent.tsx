import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import BaseMenuComponent from './BaseMenuComponent'
import BaseUserComponent from './BaseUserComponent'

class BaseHeaderComponent extends React.Component {
  render() {
    return (
      <Fragment>
        <BaseMenuComponent/>
        <BaseUserComponent/>
      </Fragment>
    )
  }
}

export default connect()(BaseHeaderComponent)
