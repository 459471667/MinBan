import React from 'react';
import {NavLink, Route, Switch} from "react-router-dom";
import NewsAdd from "./NewsAdd";
import NewsList from "./NewsList";
import './NewsManage.less';
import {Layout, Menu} from "antd";

class NewsManage extends React.Component {

    render() {
        return (
            <Layout style={{flexDirection: 'row'}}>
            <div style={{width:"158px",display:"flex",flexDirection:"column"}}>
            <Layout style={{position:"fixed"}}>
                <Menu
                    mode="inline"
                    selectedKeys={["/admin/news_manage/news_list"]}
                    style={{height: '100%', width: 158}}
                    className="menu-item-custom"
                >
                    <Menu.Item key="/admin/news_manage/news_list"><NavLink
                        to="/admin/news_manage/news_list">资讯管理</NavLink></Menu.Item>
                </Menu>
            </Layout>
            </div>
                <Switch>
                    <Route path='/admin/news_manage/news_add' component={NewsAdd}/>
                    <Route path='/admin/news_manage/news_edit/:news_id' component={NewsAdd}/>
                    <Route path='/admin/news_manage/news_list' component={NewsList}/>
                </Switch>
            </Layout>
        );
    }
}

export default NewsManage;