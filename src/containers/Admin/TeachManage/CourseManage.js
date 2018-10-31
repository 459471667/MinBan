import React, {Component} from 'react';
import {Icon, Layout,Message} from 'antd';
import '../Admin.less';
import './CourseManage.less';
import {$axios} from "../../../utils";

const {Content} = Layout;

class CourseManage extends Component {
    constructor(props){
        super(props);
        this.state = {
            courseList: [],
        };
        this.handleVideoCourse=this.handleVideoCourse.bind(this);
    }
    componentDidMount() {
        let {courseList} = this.state;
        $axios('/Eduunit/EduunitCourse/course_index').then(data => {
            if (!data) return;
            if (data.ret_code === '0000000' && data.ret_data.course) {
                courseList = data.ret_data.course.map((item) => {
                    if (!item.chapter) return undefined;
                    let chapter = item.chapter.map(item1 => {
                        if (!item1.course_points){
                            // 课程知识点
                            item1.course_points=[];
                            return item1;
                        };
                        let course_points = item1.course_points.map(item2 => {
                            return Object.assign(item2, {show: false, key: item2.course_points_id});
                        });
                        return Object.assign(item1, {show: false, key: item1.chapter_id, course_points});
                    });
                    return Object.assign(item, {show: false, key: item.course_id, chapter: chapter || []});
                });
                courseList = courseList.filter(item => item !== undefined);
                this.setState({courseList: courseList});
            }
        });
    };

    childHideShow = (tag, arr) => {
        // 通过tag标识以及arr数组来闭合或展示孩子
        let stateCopy = Object.assign({}, this.state);
        stateCopy.courseList = stateCopy.courseList.slice();
        stateCopy.courseList[arr[0]] = Object.assign({}, stateCopy.courseList[arr[0]]);
        if (arr.length === 1) {
            stateCopy.courseList[arr[0]].show = !stateCopy.courseList[arr[0]].show;
        } else if (arr.length === 2) {
            stateCopy.courseList[arr[0]].chapter[arr[1]].show = !stateCopy.courseList[arr[0]].chapter[arr[1]].show;
        }
        this.setState(stateCopy);
    };

    // 视频课件跳转
    handleVideoCourse(source,name){           
        if(!source){
            Message.error("视频课件地址不能为空");
            return;
        };
        if(source.match(/\.pdf$/)){
            Message.error("pdf文件不受支持，请将pdf文件转为图片(.png,.jpg,.gif,jpeg)!");
            return;
        };
        const {history} = this.props;
        window.localStorage.setItem("pdfOrVideo",source);
        window.localStorage.setItem("sourceNameForTitle",name||" ");
        history.push("/admin/teach_manage/common_preview_course_manage");
    };

    render() {
        return (
            <Content style={{ minHeight: 280, backgroundColor: "white",paddingLeft:"20px",paddingRight:"20px"}}>
                {/*<div className="search-block">*/}
                {/*<div>*/}
                {/*<label>名称</label>*/}
                {/*<Input placeholder=""/>*/}
                {/*</div>*/}
                {/*<Button>查询</Button>*/}
                {/*</div>*/}
                <div className="collapse-container" style={{marginTop:"10px"}}>
                    <Layout className="collapse-head">
                        <div>名称</div>
                        <div>序号</div>
                        <div>操作</div>
                    </Layout>
                    <Layout className="custom-collapse">
                        {this.renderTree()}
                    </Layout>
                </div>
            </Content>
        );
    }

    renderTree() {
        const {courseList} = this.state;
        if (!courseList.length) return <div className="ant-table-placeholder">暂无数据</div>;
        return courseList.map((item, index) => {
            if (!item) return undefined;
            return (
                <ul className={"collapse1"} key={index}>
                    <li>
                        <div className="header1">
                            <div>
                                <Icon
                                    type={`${item.show ? "minus-square-o" : "plus-square-o"}`}
                                    style={{width: '24px'}}
                                    onClick={() => this.childHideShow('chapter', [index])}/>
                                {item.course_name}
                            </div>
                            <div>{item.course_sort}</div>
                            <div></div>
                        </div>
                        {item.chapter ? item.chapter.map((item1, index1) => {
                            if (!item1) return undefined;
                            return (
                                <ul className={`collapse2 ${item.show ? '' : 'hide'}`} key={index1}>
                                    <li>
                                        <div className="header2">
                                            <div>
                                                <Icon type={`${item1.show ? "minus-square-o" : "plus-square-o"}`}
                                                      style={{width: '24px'}}
                                                      onClick={() => this.childHideShow('course_points', [index, index1])}/>
                                                {item1.chapter_name}
                                            </div>
                                            <div>{item1.chapter_sort}</div>
                                            <div></div>
                                        </div>
                                        {item1.course_points.length>0? item1.course_points.map((item2, index2) => {
                                            if (!item2) return undefined;
                                            return (
                                                <ul className={`collapse3 ${item1.show ? '' : 'hide'}`}
                                                    key={index2}>
                                                    <li>
                                                        <div className="header3">
                                                            <div>{item2.course_points_name}</div>
                                                            <div>{item2.course_points_sort}</div>
                                                            <div>
                                                                {item2.courseware_url !== '0' &&
                                                                <a 
                                                                   onClick={this.handleVideoCourse.bind(this, item2.courseware_url)}
                                                                   >文档课件</a>
                                                                }
                                                                {item2.courseware_video !== '0' &&
                                                                <a 
                                                                    onClick={this.handleVideoCourse.bind(this,item2.courseware_video,item2.courseware_name)}
                                                                    >视频课件</a>
                                                                }
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            );
                                        }) :<ul className={`collapse3 ${item1.show ? '' : 'hide'}`}><li style={{textAlign:"center"}} >暂无数据</li></ul>}
                                    </li>
                                </ul>
                            );
                        }) : []}
                    </li>
                </ul>
            );
        });
    }
}

export default CourseManage;
