import React from 'react';
import {NavLink, Route, Switch} from "react-router-dom";
import OrgAdd from "./OrgAdd";
import OrgList from "./OrgList";
import OrgEdit from "./OrgEdit";
import OrgDetail from "./OrgDetail";
import {Layout, Menu} from "antd";

class OrgManage extends React.Component {

    render() {
        return (
            <Layout style={{flexDirection: 'row'}}>
                <div style={{display:"inlineBlock",display:"flex",flexDirection:"column",width:"158px"}}>
                    <Layout style={{position:"fixed"}}>
                    <Menu
                    mode="inline"
                    selectedKeys={["/admin/org_manage/org_list"]}
                    style={{height: '100%', width: 158}}
                    className="menu-item-custom">
                    <Menu.Item key="/admin/org_manage/org_list"><NavLink
                        to="/admin/org_manage/org_list">单位管理</NavLink></Menu.Item>
                    </Menu>
                    </Layout>
                </div>
                <Switch>
                    <Route path='/admin/org_manage/org_add' component={OrgAdd}/>
                    <Route path='/admin/org_manage/org_edit/:user_id' component={OrgEdit}/>
                    <Route path='/admin/org_manage/org_list' component={OrgList}/>
                    <Route path='/admin/org_manage/org_detail/:user_id' component={OrgDetail}/>
                </Switch>
            </Layout>
        );
    }
}

export default OrgManage;