import React, { Component } from 'react';
import { Link, NavLink, Route, Switch } from "react-router-dom";
import { $axios, navPage } from "../../utils";
import { Layout, Menu, Popconfirm, message } from 'antd';
import OrgManage from "./OrgManage/OrgManage";
import NewsManage from "./NewsManage/NewsManage";
import Index from "./Index";
import './Admin.less';
import qr_code from "../../assets/img/uone_qrcode.png";
import logo_svg from "../../assets/img/logo.svg";
import Loadable from "react-loadable";

const SchoolManage=Loadable({
    loader: () => import("./SchoolManage/SchoolManage"),
    loading:()=>{
        return null;
    }
});

const BookListIndex=Loadable({
    loader: () => import("./BookList/BookListIndex"),
    loading:(props)=>{
        return null;
    }
});

const InsititutionSet=Loadable({
    loader: () => import("./InsititututionSet/InsititutionSet"),
    loading:(props)=>{
        return null;
    }
});

const TeachManage=Loadable({
    loader: () => import("./TeachManage/TeachManage"),
    loading:(props)=>{
        return null;
    }
});

const { Header, Content, Footer } = Layout;
class Admin extends Component {
    constructor(props) {
        super(props);
        // userInfo.user_type: 0学校 1 教育局 2 老师
        this.state = {
            current: 'wait_check',
            userInfo: JSON.parse(localStorage.getItem('userInfo')),
            titleUrl: "编程教育教师平台"
        };
        this.handleHref = this.handleHref.bind(this);
    }

    componentDidMount() {
        this.handleHref();
    }
    // 对接title
    handleHref() {
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
    }
    componentWillMount() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navPage('/login');
            return false;
        }
    }


    handleClick = (e) => {
        this.setState({ current: e.key });
    };

    handleQuit = () => {
        $axios('/Eduunit/EduunitLogin/login_out').then(data => {
            if (!data) return;
            if (data.ret_code === '1012') {
                localStorage.clear();
                navPage('/login');
                message.success(data.ret_msg);
            }
        });
    };

    render() {
        let _mapUrl = window.location.host.split(".")[0];
        let { location } = this.props;
        const LogoAreaStyle = {
            position: "relative",
            display: "inline-block",
            verticalAlign: "text-bottom",
            top: "-2px"
        };
        const containerStyle = {
            backgroundColor: "#edf1f7",
            overflowY: "scroll"
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
        const { userInfo } = this.state;
        let urlArr = ['/admin/teach_manage/works_manage?state=wait_check', '/admin/school_manage/class_list',
            '/admin/news_manage/news_list', '/admin/org_manage/org_list', '/admin/index', "/admin/org_set/institution_detail", "/admin/book_manage/book_list"];
        console.log(userInfo.user_type, "this is user_type");
        if (userInfo && userInfo.user_type === '1') {
            urlArr[0] = '/admin/teach_manage/course_manage';
        }
        if (userInfo && userInfo.user_type === '2') {
            urlArr[0] = '/admin/teach_manage/comment_manage';
            urlArr[1] = '/admin/school_manage/student_list';
        }
        return (
            <Layout>
                <div style={{height:"100px"}}></div>
                <Layout style={containerStyle}>
                    <Header className="fixed-header-outer" style={{ backgroundColor: "white" }}>
                        <div className="d-flex">
                            <div>
                                <Link to="#" className="ant-dropdown-link welcome-a-tag">
                                    您好！{userInfo ? userInfo.user_name : ''}
                                    {userInfo.user_type === '2' && '老师'}
                                </Link>
                                <Popconfirm
                                    style={{ position: "fixed" }}
                                    title="确定要退出吗?" onConfirm={this.handleQuit}
                                    okText="确定" cancelText="取消">
                                    <Link to="#">退出</Link>
                                </Popconfirm>
                                <span style={{fontSize:11,marginLeft:"30px",color:"red"}}>
                                    {userInfo.user_type === '2' && '您好，教师角色原来教学管理下的课程管理模块已经移到前台个人中心了哦！'}  
                                </span>
                            </div>
                            <div>
                                {/***学校连接跳转***/}
                                {/**登录页**/}
                                <a rel="noopener noreferrer" target="_blank" className="login-a-tag" href="http://www.uonestem.com">首页</a>
                            </div>
                        </div>
                    </Header>
                    <Header className="fixed-header">
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
                                selectedKeys={[location.pathname.split('/')[2]]}
                                style={{ height: '62px', lineHeight: '62px', display: "inline-block", position: "relative", top: "-1px" }}
                        >
                                <Menu.Item key={urlArr[4].split('/')[2]}><NavLink to={urlArr[4]}>首页</NavLink></Menu.Item>
                                <Menu.Item key={urlArr[0].split('/')[2]}><NavLink to={urlArr[0]}>教学管理</NavLink></Menu.Item>
                                {userInfo.user_type !== '1' && userInfo.user_type !== '2' &&
                                    <Menu.Item key={urlArr[1].split('/')[2]}><NavLink to={urlArr[1]}>机构管理</NavLink></Menu.Item>
                                }
                                {userInfo.user_type === '1' &&
                                    <Menu.Item key={urlArr[2].split('/')[2]}><NavLink to={urlArr[2]}>资讯管理</NavLink></Menu.Item>
                                }
                                {userInfo.user_type === '1' &&
                                    <Menu.Item key={urlArr[3].split('/')[2]}><NavLink to={urlArr[3]}>单位管理</NavLink></Menu.Item>
                                }
                                {/***机构设置***/}
                                {userInfo.user_type === '0' &&
                                    <Menu.Item key={urlArr[5].split('/')[2]}><NavLink to={urlArr[5]}>机构设置</NavLink></Menu.Item>
                                }
                                {userInfo.user_type !== '1' &&
                                    <Menu.Item key={urlArr[6].split('/')[2]}><NavLink to={urlArr[6]}>图书</NavLink></Menu.Item>
                                }
                            </Menu>
                        </div>
                    </Header>
                    <Content style={{ width: "1200px", margin: '0 auto' }}>
                        <Layout style={{ padding: '20px 0', marginTop: '20px', backgroundColor: '#edf1f7' }}>
                            <Switch>
                                <Route path='/admin/teach_manage' component={TeachManage} />
                                <Route path='/admin/school_manage' component={SchoolManage} />
                                <Route path='/admin/news_manage' component={NewsManage} />
                                <Route path='/admin/org_manage' component={OrgManage} />
                                <Route path='/admin/index' component={Index} />
                                <Route path='/admin/org_set' component={InsititutionSet} />
                                {/***图书管理列表****/}
                                <Route path="/admin/book_manage" component={BookListIndex} />
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
                        </Layout>
                    </Content>
                    
                    <Footer
                        className="footer"
                        style={{zIndex: 1, border: "none",backgroundColor: "white"}}
                    >
                        
                            <div className="b-flex">
                                <div style={{ display: "inline-block", marginTop: "20px", marginLeft:"8px" }}>
                                    <div className="footer-nav-doubei foot-text">
                                        <a target="_blank" href="http://www.uonestem.com/User/Index/aboutus.html">关于我们</a>
                                        <a target="_blank" href="http://www.uonestem.com/User/Index/contactus.html">联系我们</a>
                                        {/***<a target="_blank" href="http://www.uonestem.com/User/Index/business.html">商务合作</a>***/}
                                    </div>
                                    <div className="foot-text">Copyright © 2018 浙江优望教育科技有限公司</div>
                                    <div className="foot-text">网站备案号：浙ICP备18019568号-1</div>
                                </div>
                                {/***二维码***/}
                                <div style={{ display: "inline-block", float: "right", marginTop: "15px",marginRight:"-9px" }}>
                                    <img style={{ width: "80px", height: "auto" }} src={qr_code} />
                                    <dd style={{ fontSize: "10px", textAlign: "center" }} >UONE创客微信</dd>
                                </div>
                            </div>
                        
                    </Footer>
                    
                </Layout>
            </Layout>
        );
    }
}

export default Admin;
