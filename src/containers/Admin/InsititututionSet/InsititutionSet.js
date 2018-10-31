import React from  "react";
import "./InsititutionStyle/InsititutionLess.less";
import {NavLink,Route,Switch} from "react-router-dom";
import {Layout,Menu} from  "antd";
import Loadable from "react-loadable";

const InsititutionSetEdit=Loadable({
    loader: () => import("./InsititutionComponent/InsititutionSetEdit"),
    loading:(props)=>{
        return null;
    }
});

const InsititutionDetail=Loadable({
    loader: () => import("../InsititutionDetail/InsititutionDetail"),
    loading:(props)=>{
        return null;
    }
});

const ChangePassword=Loadable({
    loader: () => import("./InsititutionComponent/ChangePassword"),
    loading:(props)=>{
        return null;
    }
});

export default class InsititutionSet extends React.PureComponent{
	constructor(props){
		super(props);
    }

    state = {
        userInfo: JSON.parse(localStorage.getItem('userInfo'))
    };

    // 匹配当前url
    match(){
        const {location} = this.props;
        let matchUrl=location.pathname.split('/')[3];
        return matchUrl;
    }

	componentDidMount(){
		console.log(this.props);
	}
	render(){
        
        const containerStyle = { backgroundColor:"#edf1f7",paddingLeft:"20px",paddingRight:"20px"};
        let urlArr = ['/admin/org_set/institution_detail','/admin/org_set/changpassword']
        let matchUrl=this.match();
        const { userInfo } = this.state;

		return <Layout style={{flexDirection: 'row'}}>
            <div style={{ width: "158px", display: "flex", flexDirection: "column", backgroundColor:"#edf1f7"}}>
                <Layout style={{ position: "fixed", backgroundColor:"#edf1f7"}}>
                <Menu
                    mode="inline"
                    selectedKeys={[matchUrl]}
                        style={{ height: '100%', width: 158, backgroundColor:"#edf1f7"}}
                    className="menu-item-custom"
                >
                    <Menu.Item key={urlArr[0].split('/')[3]}>
                    	<NavLink to={urlArr[0]}>机构设置</NavLink>
                    </Menu.Item>
                    <Menu.Item key={urlArr[1].split('/')[3]}>
                    	<NavLink to={urlArr[1]+'/'+userInfo.user_id}>修改密码</NavLink>
                    </Menu.Item>
                </Menu>
            </Layout>
            </div>
                <Switch>
                    <Route path='/admin/org_set/institution_set' component={InsititutionSetEdit}/>
                    <Route path='/admin/org_set/institution_detail' component={InsititutionDetail}/>
                    <Route path='/admin/org_set/changpassword/:user_id' component={ChangePassword}/>
                </Switch>
            </Layout>
	}

} 