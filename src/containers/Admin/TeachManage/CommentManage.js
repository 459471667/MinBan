import React, {Component} from 'react';
import {Button, DatePicker, Input, Layout, message, Popconfirm, Table} from 'antd';
import '../AdminBase.less';
import {Link} from "react-router-dom";
import {$axios} from "../../../utils";
import moment from "moment";

const {Content} = Layout;

class CommentManage extends Component {

    state = {
        tableData: [],
        evaluate_name: '',
        student_name: '',
        evaluate_add_time: '',
        evaluate_edit_time: '',
        page: 0,
        total: 0
    };

    componentDidMount() {
        this.getCommentList(0);
    }

    handleSearch = () => {
        const {evaluate_add_time, evaluate_edit_time, page} = this.state;
        if (evaluate_add_time > evaluate_edit_time) {
            message.error('起始时间必须小于结束时间');
            return false;
        }
        this.getCommentList(page);
    };

    onPageChange = (pageNumber) => {
        this.setState({page: pageNumber});
        this.getCommentList(pageNumber);
    };

    onStartDateChange = (date, dateString) => {
        this.setState({evaluate_add_time: date.unix()});
    };

    onEndDateChange = (date, dateString) => {
        this.setState({evaluate_edit_time: date.unix()});
    };

    handleInput = (e, labelName) => {
        this.setState({[labelName]: e.target.value})
    };

    confirmDelete = (evaluate_id) => {
        let params = {evaluate_id: evaluate_id};
        const {page} = this.state;
        $axios('/Eduunit/EduunitEvaluate/evaluate_delete', params).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                this.getCommentList(page);
                message.success(data.ret_msg);
            }
        });
    };

    confirmForbid = (evaluate_id) => {
        let params = {evaluate_id: evaluate_id};
        const {page} = this.state;
        $axios('/Eduunit/EduunitEvaluate/evaluate_stop', params).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                this.getCommentList(page);
                message.success(data.ret_msg);
            }
        });
    };

    getCommentList = (page) => {
        const {evaluate_name, student_name, evaluate_add_time, evaluate_edit_time} = this.state;
        let params = {evaluate_name, student_name, evaluate_add_time, evaluate_edit_time, page};
        $axios('/Eduunit/EduunitEvaluate/evaluate_index', params).then(data => {
            if (!data) return;
             data.ret_data.evaluate=data.ret_data.evaluate.map((elObj)=>{
                elObj.works_url="http://www.uonestem.com/User/Index/showDetail.html?md5="+elObj.works_md5;
                return elObj;
            });
            if (data.ret_code === '0000000' && data.ret_data.evaluate) {
                this.setState({tableData: data.ret_data.evaluate});
                this.setState({total: parseInt(data.ret_data.total, 10)});
            } else if (data.ret_code === '6003') {
                this.setState({tableData: []});
            }
        });
    };

    render() {
        let {tableData, evaluate_name, student_name, total} = this.state;
        tableData = tableData.map((item, index) => {
            return Object.assign({...item, key: index});
        });
        const containerStyle={
            backgroundColor:"white",
            minHeight:"280px",
            paddingLeft:"20px",
            paddingRight:"20px"
        };
        return (
            <Content style={containerStyle}>
                <div className="search-block">
                    <div>
                        <label>作品名称</label>
                        <Input value={evaluate_name} onChange={e => this.handleInput(e, 'evaluate_name')}/>
                        <label>评论人</label>
                        <Input value={student_name} onChange={e => this.handleInput(e, 'student_name')}/>
                        <label>评论时间</label>
                        <DatePicker onChange={this.onStartDateChange}/>&nbsp;-&nbsp;
                        <DatePicker onChange={this.onEndDateChange}/>
                    </div>
                    <Button onClick={this.handleSearch}>查询</Button>
                </div>
                <div className="table-container">
                    <Table columns={this.columns} dataSource={tableData}
                           pagination={{
                               showQuickJumper: true,
                               onChange: this.onPageChange,
                               defaultPageSize: 10,
                               total: total
                           }}/>
                </div>
            </Content>
        );
    }

    columns = [{
        title: '作品名称',
        width: '250px',
        dataIndex: 'evaluate_name',
        key: 'evaluate_name',
        render: (text, record) => (
            <span>
                <a href={record.works_url} onClick={(e)=>{
                    e.preventDefault();
                    window.open(record.works_url);
                }}>{text}</a>
            </span>
        ),
    }, {
        title: '评论内容',
        width: '300px',
        dataIndex: 'evaluate_content',
        key: 'evaluate_content',
    }, {
        title: '评论人',
        width: '100px',
        dataIndex: 'student_name',
        key: 'student_name',
    }, {
        title: '发布时间',
        width: '160px',
        dataIndex: 'evaluate_add_time',
        key: 'evaluate_add_time'
    }, {
        title: '操作',
        width: '196px',
        key: 'action',
        render: (text, record) => {
            let {comment} = record;
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (parseInt(userInfo.user_type, 10) === 2) return;
            return (
                <span>
                    <Popconfirm title="确定要删除吗?" onConfirm={() => this.confirmDelete(record.evaluate_id)}>
                        <Link to="#">删除</Link>
                    </Popconfirm>
                    {comment?<Popconfirm title="确定要禁止吗?" onConfirm={() => this.confirmForbid(record.evaluate_id)}>
                        <Link to="#">禁止该评论人评论</Link>
                    </Popconfirm>:null}
                </span>
            )
        }
    }];
}

export default CommentManage;
