import React from 'react';
import {Form, Layout, message} from 'antd';
import './OrgAdd.less';
import axios from "axios";
import OrgEditForm from "../../../components/Admin/OrgEditForm";
import {$axios} from "../../../utils";

const WrappedOrgEditForm = Form.create({
    mapPropsToFields(props) {
        // 已经存在的数据渲染到form item
        let residence = [props.user_prov_code, props.user_city_code, props.user_dist_code, props.user_stre_code];
        return {
            org_name: Form.createFormField({
                ...props.org_name,
                value: props.org_name,
            }), admin_account: Form.createFormField({
                ...props.admin_account,
                value: props.admin_account,
            }), passwd: Form.createFormField({
                ...props.passwd,
                value: props.passwd,
            }), repasswd: Form.createFormField({
                ...props.passwd,
                value: props.passwd,
            }), org_type: Form.createFormField({
                ...props.org_type,
                value: props.org_type,
            }), available: Form.createFormField({
                ...props.available,
                value: props.available,
            }), residence: Form.createFormField({
                ...residence,
                value: residence,
            }), org_location: Form.createFormField({
                ...props.org_location,
                value: props.org_location,
            }), admin_name: Form.createFormField({
                ...props.admin_name,
                value: props.admin_name,
            }), admin_tel: Form.createFormField({
                ...props.admin_tel,
                value: props.admin_tel,
            }), remark: Form.createFormField({
                ...props.remark,
                value: props.remark,
            }),
        };
    }
})(OrgEditForm);

class OrgEdit extends React.Component {

    userId = '';
    state = {
        loc_options: [],
        fields: {},
    };

    constructor(props) {
        super(props);
        this.userId = this.props.match.params.user_id || '';
    }

    componentDidMount() {
        this.getOrgDetail(this.userId)
            .then(orgDetail => {
                if (orgDetail.ret_code === '0000000') {
                    this.setState({fields: orgDetail.ret_data});
                } else {
                    message.error(orgDetail.ret_msg);
                }
            });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {fields} = nextState;
        if (this.state.loc_options !== nextState.loc_options) {
            return true;
        }
        if (this.state.fields !== nextState.fields) {

            let areaCodeArr = [0, fields.user_prov_code, fields.user_city_code, fields.user_dist_code];

            axios.all([this.getLocationData(areaCodeArr[0]), this.getLocationData(areaCodeArr[1]),
                this.getLocationData(areaCodeArr[2]), this.getLocationData(areaCodeArr[3])])
                .then(axios.spread((loc0, loc1, loc2, loc3) => {
                        if (loc0.data.status === 0) {
                            let options = [];
                            let options1 = [];
                            let options2 = [];
                            let options3 = [];
                            for (let item3 of loc3.data.data.area) {
                                let {area_code: value, area_name: label, ...rest} = item3;
                                options3.push({value, label, isLeaf: true, rest});
                            }
                            for (let item2 of loc2.data.data.area) {
                                let {area_code: value, area_name: label, ...rest} = item2;
                                if (areaCodeArr[3] === value) {
                                    options2.push({value, label, children: [...options3], isLeaf: false, rest});
                                } else {
                                    options2.push({value, label, isLeaf: false, rest});
                                }
                            }
                            for (let item1 of loc1.data.data.area) {
                                let {area_code: value, area_name: label, ...rest} = item1;
                                if (areaCodeArr[2] === value) {
                                    options1.push({value, label, children: [...options2], isLeaf: false, rest});
                                } else {
                                    options1.push({value, label, isLeaf: false, rest});
                                }
                            }
                            for (let item0 of loc0.data.data.area) {
                                let {area_code: value, area_name: label, ...rest} = item0;
                                if (areaCodeArr[1] === value) {
                                    options.push({value, label, children: [...options1], isLeaf: false, rest});
                                } else {
                                    options.push({value, label, isLeaf: false, rest});
                                }
                            }
                            this.setState({loc_options: options});
                        }
                    })
                );
            return true;
        }
        return false;
    }

    getLocationData = (loc_code) => {
        let params = {area_f_code: loc_code, method: "LoginSupplier.post_area", token: ''};
        return axios.post('http://www.doubei365.com/index.php?g=Supplier&m=LoginSupplier&a=post_area', params);
    };

    getOrgDetail = (userId) => {
        let params = {user_id: userId};
        return $axios('/Eduunit/Organization/orgDetail', params);
    };

    render() {
        const {fields, loc_options} = this.state;
        return (
            <Layout className="org-add">
                <h3>编辑单位</h3>
                <WrappedOrgEditForm {...fields} loc_options={loc_options}/>
            </Layout>
        );
    }
}

export default OrgEdit;
