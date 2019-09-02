import React,{Fragment} from 'react'
import BaseMenuComponent from './BaseMenuComponent'
import { connect } from 'react-redux'

class BaseHeaderComponent extends React.Component {
  render() {
    return (
      <Fragment>
        <BaseMenuComponent />
      </Fragment>
    )
  }
}

export default connect()(BaseHeaderComponent)
