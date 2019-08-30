import React from 'react';
import PageRouter from '../router/PageRouter';
import BaseHeaderComponent from 'components/BaseHeaderComponent';
import 'assets/styles/app.less'
const App: React.FC = () => {
  return (
    <div className="App">
      <BaseHeaderComponent />
      <PageRouter />
    </div>
  );
}

export default App;
