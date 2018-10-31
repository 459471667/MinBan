import React from 'react';
import {Button, Layout} from "antd";
import './OrgDetail.less';
import {$axios, navPage} from "../../../utils";

const DetailItem = Layout;

class OrgDetail extends React.Component {

    //  0学校 1 教育局 2 老师
    state = {
        orgData: {}
    };

    componentDidMount() {
        $axios('/Eduunit/Organization/orgDetail', {user_id: this.props.match.params.user_id})
            .then(data => {
                if (!data) return;
                if (data.ret_code === '0000000') {
                    this.setState({orgData: data.ret_data});
                }
            });
    }

    render() {
        const {orgData} = this.state;
        return (<Layout>
                    <Layout className="org-detail" style={{marginLeft:"initial"}} >
                <h3>单位详情</h3>
                <DetailItem className="detail-item">
                    <span>单位名称：</span>
                    <span>{orgData.org_name}</span>
                </DetailItem>
                <DetailItem className="detail-item">
                    <span>管理员账号：</span>
                    <span>{orgData.admin_account}</span>
                </DetailItem>
                <DetailItem className="detail-item">
                    <span>单位类型：</span>
                    <span>{orgData.org_type === '0' && '学校'}{orgData.org_type === '1' && '教育局'}
                        {orgData.org_type === '2' && '老师'}</span>
                </DetailItem>
                <DetailItem className="detail-item">    
                    <span>是否可用：</span>
                    <span>{orgData.available === '0' && '是'}{orgData.available === '1' && '否'}</span>
                </DetailItem>
                <DetailItem className="detail-item">
                    <span>所在地区：</span>
                    <span>{orgData.user_prov_name}{orgData.user_city_name}{orgData.user_dist_name}{orgData.user_stre_name}</span>
                </DetailItem>
                <DetailItem className="detail-item">
                    <span>详细地址：</span>
                    <span>{orgData.org_location}</span>
                </DetailItem>
                <DetailItem className="detail-item">
                    <span>负责人：</span>
                    <span>{orgData.admin_name}</span>
                </DetailItem>
                <DetailItem className="detail-item">
                    <span>电话：</span>
                    <span>{orgData.admin_tel}</span>
                </DetailItem>
                <DetailItem className="detail-item">
                    <span>备注：</span>
                    <p>{orgData.remark}</p>
                </DetailItem>
                <div style={{paddingTop: 20}}>
                    <Button className="btn-gray" onClick={() => navPage('../org_list')}>返回</Button>
                </div>
            </Layout>
                </Layout>
        );
    }
}

export default OrgDetail;