import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import App from './App';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from "redux-devtools-extension"
import reducers from 'store/reducers'
const applyMiddle = process.env.NODE_ENV === 'production' ? applyMiddleware(thunk) : composeWithDevTools(applyMiddleware(thunk));
const store = createStore(reducers,applyMiddle)
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>, document.getElementById('root'));

serviceWorker.unregister();
