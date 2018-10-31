import React from "react";
import {Redirect, Route,Router, Switch} from "react-router-dom";
import App from "./containers/App/App";
import About from "./containers/App/About";
import Admin from "./containers/Admin/Admin";
import {history} from './utils/history';
import Login from "./Login";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {LocaleProvider} from "antd";

/**
 * root routes
 * @returns {*}
 */
export default () => {
    return (
        <LocaleProvider locale={zhCN}>
            <Router history={history}>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to="/admin/index"/>}/>
                    <Route path="/app" component={App}/>
                    <Route path="/about" component={About}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/Admin" render={props => (
                        localStorage.getItem('userInfo') ? <Admin {...props} /> :
                            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                    )} />
                    <Route render={(props) => {
                        let index = 0, intervalId = setInterval(() => {
                            index++;
                            if (index === 3) {
                                clearInterval(intervalId);
                                props.history.goBack();
                            };
                        }, 1000);
                        const style = { textAlign: "center", marginTop: "100px" }
                        return <h2 style={style}>404,糟糕页面不见了,跳转中...!</h2>;
                    }} />
                </Switch>
            </Router>
        </LocaleProvider>
    )
}

export const PrivateRoute = ({component: Admin,path:path}) => (
    <Route path={path} render={props => (
        localStorage.getItem('userInfo')? <Admin {...props} />:
        <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
    )}/>
);
