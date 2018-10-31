import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Button, DatePicker, Input, Layout, message, Popconfirm, Table} from 'antd';
import '../AdminBase.less';
import {$axios, navPage} from "../../../utils";
import moment from "moment";

class NewsList extends Component {

    state = {
        newsList: [],
        start_time: '',
        end_time: '',
        news_title: '',
        page: 0,
        total: 0
    };

    componentDidMount() {
        const {start_time, end_time, news_title, page} = this.state;
        this.getNewsList(start_time, end_time, news_title, page);
    }

    onPageChange = (pageNumber) => {
        this.setState({page: pageNumber});
    };

    confirmDelete = (news_id) => {
        const {start_time, end_time, news_title, page} = this.state;
        $axios('/Eduunit/EduunitNews/news_del', {news_id: news_id})
            .then(data => {
                if (!data) return;
                if (data.ret_code === '0000000') {
                    this.getNewsList(start_time, end_time, news_title, page);
                    message.success(data.ret_msg);
                }
            });
    };

    handleSearch = () => {
        const {start_time, end_time, news_title, page} = this.state;
        this.getNewsList(start_time, end_time, news_title, page);
    };

    handleChange = (e, labelName) => {
        // 当改变select时e返回的就是选中的值没有target要进行判断单独处理
        if (e.target) {
            this.setState({[labelName]: e.target.value});
        } else {
            this.setState({[labelName]: e});
        }
    };

    onStartDateChange = (date, dateString) => {
        this.setState({start_time: date.unix()});
    };

    onEndDateChange = (date, dateString) => {
        this.setState({end_time: date.unix()});
    };

    getNewsList = (start_time, end_time, news_title, page) => {
        $axios('/Eduunit/EduunitNews/index', {start_time, end_time, news_title, page})
            .then(data => {
                if (!data) return;
                if (data.ret_code === '0000000') {
                    this.setState({newsList: data.ret_data.news_list});
                    this.setState({total: parseInt(data.ret_data.total, 10)});
                } else if (data.ret_code === '6003') {
                    this.setState({newsList: []});
                }
            });
    };

    render() {
        let {news_title, total, newsList} = this.state;
        newsList = newsList.map((item, index) => {
            return Object.assign({...item, key: index});
        });
        return (
            <Layout>
                <Layout className="search-btn-block">
                    <div className="search-block">
                        <div>
                            <label>标题</label>
                            <Input value={news_title} onChange={e => this.handleChange(e, 'news_title')}/>
                            <label>发布时间</label>
                            <DatePicker onChange={this.onStartDateChange}/>&nbsp;-&nbsp;
                            <DatePicker onChange={this.onEndDateChange}/>
                            {/*<label style={{marginLeft: 20}}>栏目</label>*/}
                            {/*<Select value={type} onChange={e => this.handleChange(e, 'type')}>*/}
                            {/*<Select.Option key={1} value={1}>的撒</Select.Option>*/}
                            {/*</Select>*/}
                        </div>
                        <Button onClick={this.handleSearch}>查询</Button>
                    </div>
                    <div className="top-btn-group">
                        <Button type="primary" onClick={() => navPage('/admin/news_manage/news_add')}>新建资讯</Button>
                    </div>
                </Layout>
                <div className="table-container">
                    <Table columns={this.columns} dataSource={newsList}
                           pagination={{
                               showQuickJumper: true,
                               onChange: this.onPageChange,
                               defaultPageSize: 10,
                               total: total
                           }}/>
                </div>
            </Layout>
        );
    }

    columns = [{
        title: '标题',
        width: '336px',
        dataIndex: 'news_title',
        key: 'news_title'
    }, {
        title: '栏目',
        width: '174px',
        dataIndex: 'news_column_name',
        key: 'news_column_name',
    }, {
        title: '发布者',
        width: '140px',
        dataIndex: 'user_account',
        key: 'user_account',
    }, {
        title: '发布时间',
        width: '220px',
        dataIndex: 'news_add_time',
        key: 'news_add_time',
        render: (text, record) => {
            return record.news_add_time;
        }
    }, {
        title: '操作',
        width: '120px',
        key: 'action',
        render: (text, record) => (
            <span>
                <Link to={`/admin/news_manage/news_edit/${record.news_id}`}>编辑</Link>
                <Popconfirm title="确定要删除吗?" onConfirm={() => this.confirmDelete(record.news_id)}>
                    <Link to="#">删除</Link>
                </Popconfirm>
            </span>
        ),
    }];
}

export default NewsList;
