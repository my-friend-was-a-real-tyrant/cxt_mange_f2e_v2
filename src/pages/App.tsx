import React from 'react';
import { Layout } from 'antd';
import PageRouter from '../router/PageRouter';
import BaseHeaderComponent from 'components/BaseHeaderComponent';
import 'assets/styles/app.less'

const { Content, Header } = Layout
const App: React.FC = () => {
  return (
    <Layout className="App">
      <Header className="App-header">
        <BaseHeaderComponent />
      </Header>
      <Content className="App-container">
        <div className="App-container__inner">
          <PageRouter />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
