import React from 'react';
import {Layout} from "antd";
import './Index.less';
import {$axios, navPage} from "../../utils";
import publish_icon from "../../assets/img/publish.png"; 
import check_icon from "../../assets/img/check.png"; 
import fav_icon from "../../assets/img/fav.png"; 
import good_icon from "../../assets/img/good.png"; 

class Index extends React.Component {

    state = {
        totalData: {},
        userInfo: JSON.parse(localStorage.getItem('userInfo'))
    };

    componentWillMount() {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navPage('/login');
            return false;
        }
    }

    componentDidMount() {
        const {userInfo} = this.state;
        $axios('/Eduunit/EduunitHome/index', {status: userInfo.user_type})
            .then(data => {
                if (!data) return;
                if (data.ret_code === '0000000') {
                    this.setState({totalData: data.ret_data});
                }
            });
    }

    render() {
        const {totalData} = this.state;
        const minStyle={
            minWidth:"93px",
            display:"inline-block",
            lineHeight:"initial",
            fontSize:"14px"
        };
        const divImgStyle={height:"150px",
              width:"150px",
              lineHeight:"initial"};
        const fetchStyle=(url)=>{
                  return {
                        background:' url('+url+') no-repeat 10px 17px',border:"solid 1px #51bafa",
                        backgroundColor:"#cae5f8"
                  }
            };
        const containerStyle = { backgroundColor:"#edf1f7"};
        return (
            <Layout className="admin-index" style={containerStyle}>
                <Layout className="block1" style={containerStyle}>
                    <div style={{textAlign:"center"}}>
                        <div style={divImgStyle} className="total-class">
                        </div>
                        <dd style={minStyle}><span style={{fontSize:36,color:'#333333'}}>{totalData.class}</span>个</dd>
                    </div>
                    <div style={{textAlign:"center"}}>
                        <div style={divImgStyle} className="total-teacher">
                        </div>
                         <dd style={minStyle}><span style={{fontSize:36,color:'#333333'}}>{totalData.teacher}</span>人</dd>
                    </div>
                    <div style={{textAlign:"center"}}>
                        <div style={divImgStyle} className="total-student">
                        </div>
                        <dd style={minStyle}><span style={{fontSize:36,color:'#333333'}}>{totalData.student}</span>人</dd>
                    </div>
                </Layout>
                <Layout className="block2" style={containerStyle} >
                    {/***<Layout>
                        <Layout className="total-time">
                            <p><span>22347</span>小时<span>23</span>分</p><p>教师在线时长</p>
                        </Layout>
                        <Layout className="total-time">
                            <p><span>72</span>小时<span>12</span>分</p><p>教师平均在线时长</p>
                        </Layout>
                        <Layout className="total-time">
                            <p><span>26287</span>小时<span>3</span>分</p><p>学生在线时长</p>
                        </Layout>
                        <Layout className="total-time">
                            <p><span>87</span>小时<span>46</span>分</p><p>学生平均在线时长</p>
                        </Layout>
                    </Layout>***/}
                    <Layout style={containerStyle}>
                        <Layout  
                            style={fetchStyle(publish_icon)}
                            className="total-play">
                            <dd>申请发布作品数</dd><p><span>{totalData.works}</span>个</p>
                        </Layout>
                        <Layout 
                            style={fetchStyle(check_icon)}
                            className="total-play">
                            <dd>审核通过作品数</dd><p><span>{totalData.works_status}</span>个</p>
                        </Layout>
                        <Layout 
                            style={fetchStyle(good_icon)}
                            className="total-play">
                             <dd>作品点赞次数</dd><p><span>{totalData.works_praise}</span>次</p>
                        </Layout>
                        <Layout 
                            style={fetchStyle(fav_icon)}
                            className="total-play">
                            <dd>作品收藏次数</dd><p><span>{totalData.collect}</span>次</p>
                        </Layout>
                       
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

export default Index;