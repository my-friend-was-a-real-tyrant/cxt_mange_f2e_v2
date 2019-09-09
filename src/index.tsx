import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from "redux-devtools-extension"
import {ConfigProvider, message} from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import rootReducers from 'store/reducers'
import AppRouter from 'router/AppRouter'
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('cn');
const applyMiddle = process.env.NODE_ENV === 'production' ? applyMiddleware(thunk) : composeWithDevTools(applyMiddleware(thunk));
const store = createStore(rootReducers, applyMiddle)
message.config({top: 100, maxCount: 1,});
ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <AppRouter/>
    </Provider>
  </ConfigProvider>, document.getElementById('root') as HTMLElement);

serviceWorker.unregister();
