import React, { Component } from 'react';
import { Button, Input, Layout, Menu, Icon, Message } from "antd";
import { $axios, navPage } from "./utils";
import './Login.less';
import user_icon from "./assets/img/user.png";
import password_icon from "./assets/img/password.png";
import bg_img from "./assets/img/bg-img.png";
import qr_code from "./assets/img/uone_qrcode.png";
import logo_icon from "./assets/img/logo.png";
import logo_svg from "./assets/img/logo.svg";
class Login extends Component {

    state = {
        user_name: '',
        user_pass: '',
        _mapUrl: ""

    };

    componentDidMount() {
        // url会做一个map，指向不同的市区
        let _mapUrl = window.location.host.split(".")[0];
        let map = {
            "thd": "编程教师平台",
            "txx": "中小学编程教育教师管理平台",
            "tcj": "编程教师平台",
            "thhht": "编程教师平台",
            "tzs": "编程教师平台",
            "tly": "编程教师平台",
            "thz": "编程教师平台",
            "twh": "编程教师平台",
            "tmzl": "编程教师平台",
            "tbt": "编程教师平台",
            "thlbe": "编程教师平台"
        };
        this.setState({ titleUrl: map[_mapUrl] === undefined ? "编程教育教师平台" : map[_mapUrl] });
    };

    handleInput = (e, labelName) => {
        this.setState({ [labelName]: e.target.value });
    };

    handleLogin = () => {
        console.log("name");
        $axios('/Eduunit/EduunitLogin/index', this.state).then((resp) => {
            if (!resp)
                throw new Error("服务端无返回");
            localStorage.setItem("web_version", resp.web_version);
            if (!resp) return;
            if (resp.ret_code === '1003') {
                localStorage.setItem('token', resp.ret_data.login_list.token);
                localStorage.setItem('userInfo', JSON.stringify(resp.ret_data.login_list));
                navPage('/');
            }
        }).catch((e)=>{
            console.log(e);
        });
    };

    render() {
        let _mapUrl = window.location.host.split(".")[0];
        const userIconDiv = {
            width: "40px",
            zIndex: 1,
            position: "absolute",
            left: "1px",
            top: "1.2px",
            backgroundColor: "#d9d9d9",
            height: "37.5px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center"
        };
        const bgDivStyle = {
            flexDirection: "row-reverse",
            background: "url(" + bg_img + ") no-repeat center",
            backgroundSize: "100%",
            backgroundPosition: "0 39px"
        };
        const LogoAreaStyle = {
            position: "relative",
            display: "inline-block",
            verticalAlign: "text-bottom",
            top: "-4px",
            height: "63px",
            lineHeight: "63px"
        };
        const LogoIcon = {
            width: "123px",
            borderRight: "solid 1px #4da3df",
            display: "inline",
            verticalAlign: "middle",
            paddingRight: "9px",
            height: "21px",
            position: "relative",
            top: "-2px"
        };
        return (
            <Layout>
                <Layout className="fixed-header-outer" style={{ backgroundColor: "white" }}>
                    <div className="d-flex">
                        <div></div>
                        <div>
                            {/**登录页**/}
                            <a target="_blank" className="login-a-tag" href="http://www.uonestem.com">首页</a>
                        </div>
                    </div>
                </Layout>
                <Layout className="fixed-header">
                    <div className="header-menu">
                        <div style={LogoAreaStyle}>
                            {/***<div className="logo"/>**/}
                            <div style={{ display: "inline-block" }}>
                                {_mapUrl === "txx" ? null : <object
                                    style={LogoIcon}
                                    data={logo_svg} type="image/svg+xml"></object>}
                            </div>
                            <div
                                style={{
                                    display: "inline-block",
                                    marginLeft: "9px",
                                    marginRight: "20px",
                                    position: "relative",
                                    top: "1px",
                                    height: "63px",
                                    fontFarmily: "-webkit-body",
                                    fontSize: "18px", color: "white"
                                }}>
                                {this.state.titleUrl}
                            </div>
                        </div>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            style={{ height: '63px', lineHeight: '63px', display: "inline-block" }}
                        >
                        </Menu>
                    </div>
                </Layout>
                <Layout style={bgDivStyle}>
                    <div style={{width:1200,margin:"0 auto"}}>
                        <div className="login-form" style={{ marginTop: "20px"}}>
                            <div style={{ display: "inline-block", padding: "20px", backgroundColor: "white" }}>
                                <h3>登录</h3>
                                <div style={{ position: "relative" }}>
                                    <div style={userIconDiv}>
                                        <img src={user_icon} />
                                    </div>
                                    <Input style={{ margin: "initial", paddingLeft: "46px" }} value={this.state.user_name} placeholder="请输入您的用户名"
                                        onChange={(e) => this.handleInput(e, "user_name")} />
                                </div>
                                <div style={{ marginTop: "20px", position: "relative" }}>
                                    <div style={userIconDiv}>
                                        <img src={password_icon} />
                                    </div>
                                    <Input style={{ margin: "initial", paddingLeft: "46px" }} value={this.state.user_pass} placeholder="请输入您的密码" type="password"
                                        onChange={(e) => this.handleInput(e, "user_pass")} />
                                </div>
                                <Button type="primary" onClick={this.handleLogin}>登录</Button>
                            </div>
                        </div>
                    </div>
                </Layout>
                <Layout.Footer className="footer">
                    <div className="b-flex">
                        <div style={{ display: "inline-block", marginTop: "20px" }}>
                            <div className="footer-nav-doubei foot-text">
                                <a target="_blank" href="http://www.uonestem.com/User/Index/aboutus.html">关于我们</a>
                                <a target="_blank" href="http://www.uonestem.com/User/Index/contactus.html">联系我们</a>
                                {/***<a target="_blank" href="http://www.uonestem.com/User/Index/business.html">商务合作</a>***/}
                            </div>
                            <div className="foot-text">Copyright © 2018 浙江优望教育科技有限公司</div>
                            <div className="foot-text">网站备案号：浙ICP备18019568号-1</div>
                        </div>
                        {/***二维码***/}
                        <div style={{ display: "inline-block", float: "right", marginTop: "15px" }}>
                            <img style={{ width: "80px", height: "auto" }} src={qr_code} />
                            <dd style={{ fontSize: "10px", textAlign: "center" }} >UONE创客微信</dd>
                        </div>
                    </div>
                </Layout.Footer>
            </Layout>
        );
    }
}

export default Login;
