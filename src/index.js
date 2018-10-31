import 'babel-polyfill';
import 'raf/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.less'
import store from './store';
import moment from 'moment';
import 'moment/locale/zh-cn';
import AppRoutes from './routes';
import registerServiceWorker from './registerServiceWorker';

moment.locale('zh-cn');

ReactDOM.render(
    <Provider store={store}>
        <AppRoutes/>
    </Provider>, document.getElementById('root'));
registerServiceWorker();