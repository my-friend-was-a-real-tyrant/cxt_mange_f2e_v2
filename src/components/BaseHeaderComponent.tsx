import React from 'react'
import BaseMenuComponent from './BaseMenuComponent'
import { connect } from 'react-redux'

class BaseHeaderComponent extends React.Component {
  render() {
    return (
      <div>
        <BaseMenuComponent />
      </div>
    )
  }
}

export default connect()(BaseHeaderComponent)