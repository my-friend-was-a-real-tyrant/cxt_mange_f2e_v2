import React from 'react';
import {RouteComponentProps} from 'react-router-dom'
import {Layout} from 'antd';
import PageRouter from '../router/PageRouter';
import BaseHeaderComponent from 'components/BaseHeaderComponent';
import 'assets/styles/app.less'

const {Content, Header} = Layout

interface IState {
  routePath: string;
}

class App extends React.Component<RouteComponentProps, IState> {
  state = {
    routePath: ''
  }

  componentDidMount() {
    this.setState({routePath: this.props.location.pathname})
    if (!localStorage.getItem('access_token')) {
      this.props.history.push('/login')
    }
  }

  render() {
    return (
      <Layout className="App">
        <Header className="App-header">
          <BaseHeaderComponent/>
        </Header>
        <Content className={`App-container ${this.state.routePath === '/app/work' ? 'app-work' : ''}`}>
          <PageRouter/>
        </Content>
      </Layout>
    );
  }
}

export default App;
