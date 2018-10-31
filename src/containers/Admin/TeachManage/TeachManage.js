import React, {Component} from 'react';
import {Layout, Menu,Icon,Button} from "antd";
import {NavLink, Route, Switch} from "react-router-dom";
import Loadable from "react-loadable";
import PreviewComponentIndex from "../PreviewCommon/PreviewComponentIndex";

const WorksManage=Loadable({
    loader: () => import("./WorksManage"),
    loading:(props)=>{
        return null;
    }
});

const CommentManage=Loadable({
    loader: () => import("./CommentManage"),
    loading:(props)=>{
        return null;
    }
});

const CourseManage=Loadable({
    loader: () => import("./CourseManage"),
    loading:({error,pastDelay,retry})=>{
        const containerStyle={
              width:"100%",
              height:"185px"  
        };
        if(error){
            return (<div style={containerStyle}>
                <h3 style={{marginLeft:"20px",marginTop:"20px"}} >ops，发生了一些错误，点击按钮重试!</h3>
                <div>
                    <Button
                        style={{marginLeft:"20px",marginBottom:"20px"}}
                        type="primary"
                        onClick={()=>{
                            retry();
                        }}
                    ></Button>
                </div>
                
            </div>);
            // only if the loaded component takes long time than the setted delay
        }else if(pastDelay){
            return (<div style={containerStyle}>
                 <Icon type="loading" style={{display:"block",marginTop:"20px"}} />
            </div>)
        }else{
            return null;
        }
    }
});

const TeacherTrainIndex=Loadable({
    loader: () => import("../TeacherTrain/TeacherTrainIndex"),
    loading:()=>{
        return null;
    }
});

const OperationSupportIndex=Loadable({
    loader: () => import("../OperationSupport/OperationSupportIndex"),
    loading:()=>{
        return null;
    }
});

const {Sider} = Layout;

class TeachManage extends Component {
    constructor(props){
        super(props);
    }
    match(){
        const {location} = this.props;
        let matchUrl=location.pathname.split('/')[3];
        if(matchUrl==="common_preview_teacher_train")
           matchUrl="teacher_train";
        if(matchUrl==="common_preview_operation_support")
           matchUrl="operation_support";
        if(matchUrl==="common_preview_course_manage")
            matchUrl="course_manage"
        return matchUrl;
    }
    render() {
       let urlArr = ['/admin/teach_manage/works_manage', '/admin/teach_manage/comment_manage',
            '/admin/teach_manage/course_manage', "/admin/teach_manage/teacher_train","/admin/teach_manage/operation_support"];
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        let matchUrl=this.match();
     
        return (
            <Layout style={{ backgroundColor: '#edf1f7'}}>
                <Sider width={158} style={{ backgroundColor: "#edf1f7" }}>
                    <Layout style={{position:"fixed"}}>
                        <Menu
                        mode="inline"
                        selectedKeys={[matchUrl]}
                        style={{ height: '100%', backgroundColor: '#edf1f7'}}
                        className="menu-item-custom"
                    >
                        
                        {userInfo.user_type !== '1' && userInfo.user_type !== '2' &&
                        <Menu.Item key={urlArr[0].split('/')[3]}><NavLink to={urlArr[0]}>作品管理</NavLink></Menu.Item>
                        }
                        
                        {userInfo.user_type !== '1' &&
                        <Menu.Item key={urlArr[1].split('/')[3]}><NavLink to={urlArr[1]}>评论管理</NavLink></Menu.Item>
                        }
                        {userInfo.user_type !== '2' &&
                        <Menu.Item key={urlArr[2].split('/')[3]}><NavLink to={urlArr[2]}>课程管理</NavLink></Menu.Item>
                        }
                        
                        <Menu.Item key={urlArr[3].split('/')[3]}><NavLink to={urlArr[3]}>教师培训</NavLink></Menu.Item>
                        <Menu.Item key={urlArr[4].split('/')[3]}><NavLink to={urlArr[4]}>运营支持</NavLink></Menu.Item>
                    </Menu>
                    </Layout>
                </Sider>
                <Switch>
                    <Route path='/admin/teach_manage/works_manage' component={WorksManage}/>
                    <Route path='/admin/teach_manage/comment_manage' component={CommentManage}/>
                    <Route path='/admin/teach_manage/course_manage' component={CourseManage}/>
                    <Route path='/admin/teach_manage/teacher_train' component={TeacherTrainIndex}/>
                    <Route path='/admin/teach_manage/operation_support' component={OperationSupportIndex}/>
                    {/**不在首页提供入口的视频或者pdf预览组件**/}
                    <Route path='/admin/teach_manage/common_preview_teacher_train' component={PreviewComponentIndex}/>
                    <Route path='/admin/teach_manage/common_preview_operation_support' component={PreviewComponentIndex}/>
                    {/***课件视频预览****/}
                    <Route path='/admin/teach_manage/common_preview_course_manage' component={PreviewComponentIndex}/>
                    <Route render={(props) => {
                        let index = 0, intervalId = setInterval(() => {
                            index++;
                            if (index === 3) {
                                clearInterval(intervalId);
                                props.history.goBack();
                            };
                        }, 1000);
                        const style = { textAlign: "center", marginTop: "40px",flexGrow:"1" }
                        return <h2 style={style}>404,糟糕页面不见了,跳转中...!</h2>;
                    }} />
                </Switch>
            </Layout>
        );
    }
}

export default TeachManage;
