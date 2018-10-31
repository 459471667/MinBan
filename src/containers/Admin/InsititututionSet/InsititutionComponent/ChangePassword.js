import React, {Component} from 'react';
import {Button, Layout, Form, Input, message} from "antd";
import {$axios} from '../../../../utils';
import Loadable from "react-loadable";
import "../InsititutionStyle/ChangePassword.less";

const { Content} = Layout;

const ChangePassFrom=Loadable({
    loader: () => import("../../../../components/Admin/ChangePassFrom"),
    loading:(props)=>{
        return null;
    }
});

class ChangePassword extends Component {
    render () {
        
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "10px"
        };

        const WrappedChangePassFrom= Form.create()(ChangePassFrom);

        return (
            <Layout  style={containerStyle}>
                <Content className="change-content">
                    <div className="chang-title">
                        <span>修改本机构管理员密码</span>
                    </div>
                    <WrappedChangePassFrom user_id={this.props.match.params.user_id}/>
                    
                    
                </Content>  
            </Layout>
        );
    }
}
export default ChangePassword;