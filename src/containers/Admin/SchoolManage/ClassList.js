import React, {Component} from 'react';
import {Button, Input, Layout, message, Popconfirm, Select, Table} from "antd";
import {Link} from "react-router-dom";
import {$axios, navPage} from "../../../utils";
import moment from "moment";
import "./ClassListStyle.less";

class ClassList extends Component {

    state = {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        gradeOptionNode: [],
        classList: [],
        class_no: '',
        grade_code: '',
        page: 0,
        total: 0
    };

    componentDidMount() {
        this.renderGradeSelect(this.gradeData);
        // 分页问题
        this.getClassList('', '', 0);
    }

    onPageChange = (pageNumber) => {
        let{classNumber,gradeCode} = this.state;
        this.getClassList(classNumber,gradeCode,pageNumber);
    };

    handleChange = (value) => {
        this.setState({grade_code: value});
    };

    handleInput = (e) => {
        this.setState({class_no: e.target.value});
    };

    handleSearch = () => {
        this.setState({page: 0});
        const {class_no, grade_code} = this.state;
        this.getClassList(class_no, grade_code, 0);
    };

    //删除文档
    confirmDelete = (classId) => {
        let params = {class_id: classId};
        $axios('/Eduunit/EduunitClass/class_del', params).then(resp => {
            if (!resp) return;
            if (resp.ret_code === '0000000') {
                const {class_no, grade_code, page} = this.state;
                this.getClassList(class_no, grade_code, page);
                message.success(resp.ret_msg);
            }
        });
    };

    /***
     *@param("class_no") 班级编号
     * 
     *@param("grade_code") 年级
     ***/ 
    getClassList = (class_no, grade_code, page) => {
        let params = {class_no: class_no, grade_code: grade_code, page};
        $axios('/Eduunit/EduunitClass/index', params)
            .then(data => {
                if (!data) return;
                if (data.ret_code === '0000000') {
                    this.setState({classList: data.ret_data.class_list});
                    this.setState({total: parseInt(data.ret_data.total, 10)});
                } else if (data.ret_code === '6003') {
                    this.setState({classList: []});
                }
            });
    };

    render() {
        let {gradeOptionNode, classList, class_no, total} = this.state;
        const btnSearchAreaStyle={
              height:"72px"
        };
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        classList = classList.map((item, index) => {
            return Object.assign({...item, key: index});
        });
        let columns = [{
            title: '班级编号',
            width: '200px',
            dataIndex: 'class_no',
            key: 'class_no',
        }, {
            title: '班级名称',
            width: '180px',
            dataIndex: 'class_name',
            key: 'class_name',
        }, 
        // {
        //     title: '年级',
        //     width: '210px',
        //     dataIndex: 'grade_name',
        //     key: 'grade_name',
        // }, 
        {
            title: '创建时间',
            width: '270px',
            dataIndex: 'class_add_time',
            key: 'class_add_time'
        }, {
            title: '操作',
            width: '120px',
            key: 'action',
            render: (text, record) => {
                if (userInfo.user_type !== '2') {
                    return (
                        <span>
                            <Link to={`/admin/school_manage/class_edit/${record.class_id}`}>编辑</Link>
                            <Popconfirm title="确定要删除吗?" onConfirm={() => this.confirmDelete(record.class_id)}>
                                <Link to="#">删除</Link>
                            </Popconfirm>
                        </span>
                    );
                }
            }
        }];
        const containerStyle={
            paddingLeft:"20px",
            paddingRight:"20px",
            backgroundColor:"white",
            paddingBottom:"10px",
            
        };
        const inputStyle={
            borderRadius:"3px"
        };
        const searchBtnButton={
            borderRadius:"3px"
        };
        return (
            <Layout style={containerStyle} >
                <Layout className="search-btn-block" style={btnSearchAreaStyle}>
                    <div className="search-block">
                        <div>
                            <label>班级编号</label>
                            <Input style={inputStyle} value={class_no} onChange={this.handleInput}/>
                        {/****<label>年级</label>
                            <Select onChange={this.handleChange} style={{width: 100}}>
                                {gradeOptionNode}
                            </Select>****/}
                        </div>
                        <Button 
                            style={{ backgroundColor:"#218ed1 !important"}}
                            type="primary" style={searchBtnButton} onClick={this.handleSearch}>查询</Button>
                    </div>
                    {userInfo.user_type !== '2' &&
                    <div className="top-btn-group">
                        <Button type="primary" onClick={() => navPage('/admin/school_manage/class_add')}>添加班级</Button>
                    </div>
                    }
                </Layout>

                <div className="table-container">
                    <Table 
                           columns={columns} dataSource={classList}
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

    renderGradeSelect = (gradeData) => {
        let gradeOptionNode = gradeData.map((item, index) => {
            return <Select.Option value={item.value} key={index}>{item.label}</Select.Option>;
        });
        this.setState({gradeOptionNode: gradeOptionNode});
    };


    gradeData = [
        {value: '10001', label: '一年级'},
        {value: '10002', label: '二年级'},
        {value: '10003', label: '三年级'},
        {value: '10004', label: '四年级'},
        {value: '10005', label: '五年级'},
        {value: '10006', label: '六年级'}
    ];
}

export default ClassList;
