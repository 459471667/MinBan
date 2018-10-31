import React, { Component } from 'react';
import { Layout, Menu,Icon,Button } from "antd";
import { NavLink, Route, Switch } from "react-router-dom";
import ClassAdd from "./ClassAdd";
import ClassEdit from "./ClassEdit";
import ClassImport from "./ClassImport";
import TeacherList from "./TeacherList";
import './SchoolManage.less';
import Loadable from "react-loadable";

const StudentAdd = Loadable({
    loader: () => import("./StudentAdd"),
    loading: (props) => {
        return null;
    }
});

const StudentEdit = Loadable({
    loader: () => import("./StudentEdit"),
    loading: (props) => {
        return null;
    }
});

const TeacherEdit = Loadable({
    loader: () => import("./TeacherEdit"),
    loading: (props) => {
        return null;
    }
});

const ClassList = Loadable({
    loader: () => import("./ClassList"),
    loading: () => {
        return null;
    }
});

const TeacherAdd = Loadable({
    loader: () => import("./TeacherAdd"),
    loading: (props) => {
        return null;
    }
});

const StudentList = Loadable({
    loader: () => import("./StudentList"),
    loading: ({error,pastDelay}) => {
        if(error){
            return <div>
                <h3 style={{marginLeft:"20px",marginTop:"20px"}}>ops，发生了一点错误</h3>
                <Button style={{marginLeft:"20px",marginBottom:"20px"}}  type="primary">重试</Button>
            </div>
        }else if(pastDelay){
            return (<div style={{ width: "100%", height: "185px" }}>
                <Icon
                    style={{ margin: "0 auto", marginTop: "60px", display: "block" }}
                    type="loading" />
            </div>);
        }else{
            return null;
        }
    }
});

const { Sider } = Layout;


class SchoolManage extends Component {

    state = {
        userInfo: JSON.parse(localStorage.getItem('userInfo'))
    };

    render() {
        let urlArr = [
            '/admin/school_manage/class_list',
            '/admin/school_manage/student_list',
            '/admin/school_manage/teacher_list'
        ];
        const { location } = this.props;
        const { userInfo } = this.state;
        console.log("userInfo",userInfo);
        
        let selectedKey = location.pathname.split('/')[3];
        if (selectedKey === "class_add") selectedKey = "class_list";
        if (selectedKey === "teacher_add") selectedKey = "teacher_list";
        return (
            <Layout>
                <Sider width={158} style={{ backgroundColor: "#edf1f7" }}>
                    <Layout style={{ position: "fixed" }} >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[urlArr[0].split('/')[3]]}
                            selectedKeys={[selectedKey]}
                            style={{ height: '100%', backgroundColor: "#edf1f7" }}
                            className="menu-item-custom"
                        >
                            {userInfo.user_type !== '2' &&
                                <Menu.Item key={urlArr[0].split('/')[3]}><NavLink to={urlArr[0]}>班级管理</NavLink></Menu.Item>
                            }

                            {userInfo.user_type !== '2' && <Menu.Item key={urlArr[1].split('/')[3]}><NavLink to={urlArr[1]}>学生管理</NavLink></Menu.Item> }                      
                            
                            {userInfo.user_type !== '2' &&
                                <Menu.Item key={urlArr[2].split('/')[3]}><NavLink to={urlArr[2]}>教师管理</NavLink></Menu.Item>
                            }
                        </Menu>
                    </Layout>
                </Sider>
                <Switch>
                    <Route path='/admin/school_manage/class_list' component={ClassList} />
                    <Route path='/admin/school_manage/student_list' component={StudentList} />
                    <Route path='/admin/school_manage/teacher_list' exact={true} component={TeacherList} />
                    <Route path='/admin/school_manage/class_add' component={ClassAdd} />
                    <Route path='/admin/school_manage/class_edit/:class_id' component={ClassEdit} />
                    <Route path='/admin/school_manage/student_add' component={StudentAdd} />
                    <Route path='/admin/school_manage/student_edit/:student_id' component={StudentEdit} />
                    <Route path='/admin/school_manage/teacher_add' component={TeacherAdd} />
                    <Route path='/admin/school_manage/teacher_edit/:teacher_id' component={TeacherEdit} />
                    <Route path='/admin/school_manage/class_import' component={ClassImport} />
                    <Route path='/admin/school_manage/student_import' component={ClassImport} />
                    <Route path='/admin/school_manage/teacher_import' component={ClassImport} />
                    {/* 定制404页面，添加教师支付成功保存状态，关闭支付跳转窗口 */}
                    <Route render={(props) => {
                        const {search} =window.location;
                        let statusArr = search.split("\=");
                        let payStatus = statusArr[1]||"";

                        if(statusArr[0].replace(/\?/g,"")==="__weqsadoo0_rankeyou_ad1wad1131ad1231dasdasf")
                            window.localStorage.setItem("payStatus",payStatus);

                        window.close();
                        let index = 0, intervalId = setInterval(() => {
                            index++;
                            if (index === 2) {
                                clearInterval(intervalId);
                                props.history.goBack();
                            };
                        }, 1000);
                        const style = { textAlign: "center", alignSelf: "center", flexGrow: "1", marginBottom: "initial", paddingTop: "20px", paddingBottom: "20px" }
                        return <h2 style={style}>404,糟糕页面不见了,跳转中...!</h2>;
                    }} />
                </Switch>
            </Layout>
        );
    }
}

export default SchoolManage;
