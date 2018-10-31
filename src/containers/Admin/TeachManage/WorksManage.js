import React, {Component} from 'react';
import {Button, Input, Layout, Menu, Table} from 'antd';
import {$axios, navPage} from "../../../utils";
import {Link} from "react-router-dom";
import CheckModal from "../../../components/Admin/CheckModal";
import '../AdminBase.less';
import CommentModal from "../../../components/Admin/CommentModal";
import moment from "moment";

const {Content} = Layout;

class WorksManage extends Component {

    //1已通过，2待审核，3审核不通过

    state = {
        works_status: 2,
        works_name: '',
        student_name: '',
        tableData: [],
        page: 0,
        total: 0
    };

    componentDidMount() {
        navPage('/admin/teach_manage/works_manage?state=wait_check');
        const {works_status, works_name, student_name, page} = this.state;
        this.getWorksList({works_status, works_name, student_name, page});
    }

    handleSearch = () => {
        const {works_status, works_name, student_name} = this.state;
        this.getWorksList({works_status, works_name, student_name, page: 0});
    };

    onPageChange = (pageNumber) => {
        this.setState({page: pageNumber});
        const {works_status, works_name, student_name} = this.state;
        this.getWorksList({works_status, works_name, student_name, page: pageNumber});
    };

    handleInput = (e, labelName) => {
        this.setState({[labelName]: e.target.value});
    };

    handleStateChange = (stateCode) => {
        const baseUrl = '/admin/teach_manage';
        const {works_name, student_name} = this.state;
        this.setState({works_status: stateCode});
        this.getWorksList({works_status: stateCode, works_name, student_name, page: 0});
        switch (stateCode) {
            case 2:
                navPage(`${baseUrl}/works_manage?state=wait_check`);
                break;
            case 1:
                navPage(`${baseUrl}/works_manage?state=passed_check`);
                break;
            case 3:
                navPage(`${baseUrl}/works_manage?state=notpass_check`);
                break;
            default:
                break;
        }
    };

    getWorksList = (searchParams) => {
        $axios('/Eduunit/EduunitWorks/works_index', {...searchParams}).then(data => {
            if (!data) return;
            data.ret_data.works=data.ret_data.works.map((elObj)=>{
                elObj.works_url="http://www.uonestem.com/User/Index/showDetail.html?md5="+elObj.works_md5;
                return elObj;
            });
            data.ret_data.works = data.ret_data.works || [];
            if (data.ret_code === '0000000') {
                this.setState({tableData: data.ret_data.works});
                this.setState({total: parseInt(data.ret_data.total, 10)});
            } else if (data.ret_code === '6003') {
                this.setState({tableData: []});
            }
        });
    };

    render() {
        const {location} = this.props;
        let columns = this.columns;
        let {tableData, total, student_name, works_name, works_status} = this.state;
        tableData = tableData.map((item, index) => {
            return Object.assign({...item, key: index});
        });
        if (works_status === 1) {
            columns = this.doneColumns;
        }
        const containerStyle={
            backgroundColor:"white",
            minHeight:"280",
            paddingLeft:"20px",
            paddingRight:"20px"
        };
        return (
            <Content style={containerStyle} className="works-manage">
                <Menu
                    defaultSelectedKeys={['wait_check']}
                    selectedKeys={[location.search.split('=')[1]]}
                    mode="horizontal"
                    className="menu-item-horizontal"
                >
                    <Menu.Item key="wait_check">
                        <span onClick={() => this.handleStateChange(2)}>待审核</span>
                    </Menu.Item>
                    <Menu.Item key="passed_check">
                        <span onClick={() => this.handleStateChange(1)}>已通过</span>
                    </Menu.Item>
                    <Menu.Item key="notpass_check">
                        <span onClick={() => this.handleStateChange(3)}>未通过</span>
                    </Menu.Item>
                </Menu>
                <Content>
                    <div className="search-block">
                        <div>
                            <label>作品名称</label>
                            <Input value={works_name} onChange={e => this.handleInput(e, 'works_name')}/>
                            <label>作者</label>
                            <Input value={student_name} onChange={e => this.handleInput(e, 'student_name')}/>
                        </div>
                        <Button onClick={this.handleSearch}>查询</Button>
                    </div>
                    <div className="table-container">
                        <Table columns={columns} dataSource={tableData}
                               pagination={{
                                   showQuickJumper: true,
                                   onChange: this.onPageChange,
                                   defaultPageSize: 10,
                                   total: total
                               }}/>
                    </div>
                </Content>
                <CheckModal ref='checkModal' {...works_status} onConfirm={this.getWorksList}/>
                <CommentModal ref='commentModal' {...works_status}/>
            </Content>
        );
    }


    // 待审核和未来通过公用一套模板
    columns = [{
        title: '作品名称',
        width: '340px',
        dataIndex: 'works_name',
        key: 'works_name',
        render: (text, record) => <a onClick={(e)=>{
            e.preventDefault();
            window.open(record.works_url);
        }} href={record.works_url}>{text}</a>,
    }, {
        title: '作者',
        width: '260px',
        dataIndex: 'student_name',
        key: 'student_name',
    }, {
        title: '发布时间',
        width: '322px',
        dataIndex: 'works_add_time',
        key: 'works_add_time',
    }, {
        title: '操作',
        width: '100px',
        key: 'action',
        render: (text, record) => {
            let {works_status} = this.state;
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            // 用户的类型 "0"为老师的类型
            if (userInfo.user_type === '0') return;
            if (works_status === 2) {
                return (
                    <span>
                        <Link to="?state=wait_check"
                              onClick={() => this.refs.checkModal.showModal(record.works_id, 2)}>审核</Link>
                    </span>
                );
            } else if (works_status === 3) {
                return (
                    <span>
                        <Link to="?state=notpass_check"
                              onClick={() => this.refs.checkModal.showModal(record.works_id, 3)}>重新审核</Link>
                    </span>
                );
            }
        }
    }];
    doneColumns = [{
        title: '作品名称',
        width: '340px',
        dataIndex: 'works_name',
        key: 'works_name',
        render: (text, record) => <a target="_blank"  href={record.works_url}>{text}</a>,
    }, {
        title: '作者',
        width: '260px',
        dataIndex: 'student_name',
        key: 'student_name',
    }, {
        title: '发布时间',
        width: '222px',
        dataIndex: 'works_add_time',
        key: 'works_add_time',
    }, {
        title: '类型',
        width: '122px',
        dataIndex: 'works_class_name',
        key: 'works_class_name',
    }, {
        title: '浏览量',
        width: '100px',
        dataIndex: 'works_browse',
        key: 'works_browse',
    }, {
        title: '点赞数',
        width: '100px',
        dataIndex: 'works_praise',
        key: 'works_praise',
    }, {
        title: '收藏数',
        width: '100px',
        dataIndex: 'collect_count',
        key: 'collect_count',
    }, {
        title: '操作',
        width: '100px',
        key: 'action',
        render: (text, record) => {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo.user_type === '0') return;
            return (
                <span>
                    <Link to="?state=passed_check"
                          onClick={() => this.refs.commentModal.showModal(record.works_id, 1, record.works_class_code)}>评价</Link>
                </span>
            );
        }
    }];
}

export default WorksManage;
