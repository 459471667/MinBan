import React, { Component } from 'react';
import { Button, Input, Layout, message, Popconfirm, Table, Modal, Message } from "antd";
import { Link } from "react-router-dom";
import { $axios, navPage } from "../../../utils";
import "./TeacherListStyle.less";

class TeacherList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacherList: [],
            user_name: '',
            user_account: '',
            user_phone: '',
            page: 0,
            total: 0,
            visible: false,
            renewModal: false,
            payStatusText: "付款成功，你已经添加了1位老师!",
        };
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleRenewModalOk = this.handleRenewModalOk.bind(this);
        this.handleRenewModalCancle = this.handleRenewModalCancle.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.pollRequest = this.pollRequest.bind(this);
    }

    handleRenewModalOk() {
        this.handleRequestAliPay();
    }

    handleRenewModalCancle = () => {
        this.setState({ renewModal: false });
        this.handleRequestAliPay = void 0;
    }

    componentDidMount() {
        let { user_name, user_account, user_phone, page } = this.state;
        this.getTeacherList({ user_name, user_account, user_phone, page });
        // 轮询支付的状态
        this.pollRequest();

    }

    onPageChange = (pageNumber) => {
        let { user_name, user_account, user_phone } = this.state;
        this.setState({ page: pageNumber });
        this.getTeacherList({ user_name, user_account, user_phone, page: pageNumber });
    };

    handleInput = (e, inputName) => {
        this.setState({ [inputName]: e.target.value });
    };

    search = () => {
        this.setState({ page: 0 });
        const { user_name, user_account, user_phone } = this.state;
        this.getTeacherList({ user_name, user_account, user_phone, page: 0 });
    };

    confirmDelete = (teacherId) => {
        let params = { teacher_id: teacherId };
        const { user_name, user_account, user_phone } = this.state;
        $axios('/Eduunit/Teacher/teacherDelete', params).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                message.success(data.ret_msg);
                this.getTeacherList({ user_name, user_account, user_phone, page: 0 });
            }
        });
    };

    requestAliPay = (requestUlrl, teacherId) => {
        let newWindow = window.open();
        $axios(requestUlrl, { teacher_id: teacherId }).then((data) => {
            if (data.ret_code === "0000000") {
                if (data.ret_data.url) {
                    newWindow.location.href = data.ret_data.url;
                } else {
                    Message.error("支付连接为空，请联系服务端技术支持人员");
                }
            } else {
                Message.error(data.ret_msg || "请求发生异常!");
            }
        });
    }

    // 续费
    handleTeacherRenewOrPay(teacherId) {
        let requestUlrl = "/Eduunit/Teacher/teacher_pay";
        if (arguments[1] === 0) {
            this.setState({ renewModal: true });
            requestUlrl = "/Eduunit/Teacher/teacher_renew";
            this.handleRequestAliPay = () => {
                this.requestAliPay(requestUlrl, teacherId);
            }
            return;
        }
        this.requestAliPay(requestUlrl, teacherId);


    };

    // 渲染operations
    renderOperations = (record) => {
        let { teacher_account_status, teacher_id: teacherId } = record;

        teacher_account_status = teacher_account_status && parseInt(teacher_account_status, 10);

        let statusOperation = void 0;

        let confirmText = teacher_account_status === 2
            ? <div style={{ width: "200px", wordBreak: "break-word" }}>删除该免费账号后，再次添加账号需要收费，确认删除？</div>
            : "确定要删除吗？";

        if (teacher_account_status === 0)
            statusOperation = (< span
                onClick={this.handleTeacherRenewOrPay.bind(this, teacherId, 1)}
                style={{ marginLeft: "7px", color: "#0074c5", cursor: "pointer" }}>去付款</span>);

        if (teacher_account_status === 1)
            statusOperation = (<span
                onClick={this.handleTeacherRenewOrPay.bind(this, teacherId, 0)}
                style={{ marginLeft: "7px", color: "#0074c5", cursor: "pointer" }}>续费</span>);

        return (<span>
            <Link to={`/admin/school_manage/teacher_edit/${record.teacher_id}`}>编辑</Link>
            <Popconfirm
                title={confirmText} onConfirm={() => this.confirmDelete(record.teacher_id)}>
                <Link to="#" sytle="margin-left:7px" >删除</Link>
            </Popconfirm>
            {statusOperation}
        </span>);
    };

    handleCancel() {
        this.setState({ visible: false });
    };

    getTeacherList = (searchParams) => {
        $axios('/Eduunit/Teacher/index', { ...searchParams }).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                this.setState({ teacherList: data.ret_data.teacher_list });
                this.setState({ total: parseInt(data.ret_data.total, 10) });
            } else if (data.ret_code === '6003') {
                this.setState({ teacherList: [] });
            }
        });
    };

    handleModalOk() {
        console.log("弹窗确定");
        this.setState({ visible: false });
    };

    // 支付状态轮询
    pollRequest() {
        setInterval(() => {
            const payStatus = window.localStorage.getItem("payStatus") || "";

            if (!payStatus) return;

            let payStatusText = "付款成功，您已经添加了1位老师!";

            if (payStatus && parseInt(payStatus) === 2) payStatusText = "续费成功!";

            this.setState({ renewModal: false }, () => {
                localStorage.removeItem("payStatus");
                this.setState({ visible: true, payStatusText: payStatusText });
                let { user_name, user_account, user_phone, page } = this.state;
                this.getTeacherList({ user_name, user_account, user_phone, page });
            });
        }, 1000);
    };

    render() {
        let { teacherList,
            user_name,
            user_account,
            user_phone,
            total,
            payStatusText,
            visible,
            renewModal } = this.state;
        teacherList = teacherList.map((item, index) => {
            return Object.assign({ ...item, key: index });
        });
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "10px"
        };
        return (
            <Layout style={containerStyle} className="contain-doubei-for-set" >
                <Layout className="search-btn-block">
                    <div className="search-block">
                        <div>
                            <label>教师姓名</label>
                            <Input
                                className="input-search"
                                value={user_name} style={{ width: 146 }}
                                onChange={(e) => this.handleInput(e, 'user_name')} />
                            <label>用户名</label>
                            <Input
                                className="input-search"
                                value={user_account} style={{ width: 146 }}
                                onChange={(e) => this.handleInput(e, 'user_account')} />
                            <label>手机</label>
                            <Input
                                className="input-search"
                                value={user_phone} style={{ width: 120 }}
                                onChange={(e) => this.handleInput(e, 'user_phone')} />
                        </div>
                        <Button
                            type="primary"
                            style={{ backgroundColor: "#218ed1" }}
                            className="input-search"
                            onClick={this.search}>查询</Button>
                    </div>
                    <div className="top-btn-group">
                        <Button type="primary" onClick={() => navPage('/admin/school_manage/teacher_add')}>添加老师</Button>
                        {/***民办的需要隐藏掉学生老师导入按钮***/}
                        {/****<Button type="primary"
                                onClick={() => navPage('/admin/school_manage/teacher_import')}>导入</Button>***/}
                    </div>
                </Layout>

                <div className="table-container">
                    <Table columns={this.columns} dataSource={teacherList}
                        pagination={{
                            showQuickJumper: true,
                            onChange: this.onPageChange,
                            defaultPageSize: 10,
                            total: total
                        }} />
                </div>
                <Modal
                    visible={visible}
                    width={280}
                    style={{ top: "150px" }}
                    onOk={this.handleModalOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="ok-close-modal" type="primary" onClick={this.handleModalOk}>
                            确定
                        </Button>
                    ]}
                >
                    <div
                        style={{
                            paddingTop: "20px",
                            fontSize: "13px",
                            fontFamily: "微软雅黑",
                            textAlign: "center"
                        }}
                    >{payStatusText}</div>
                </Modal>
                {/* 续费弹窗 */}
                <Modal
                    visible={renewModal}
                    width={280}
                    style={{ top: "150px" }}
                    onOk={this.handleRenewModalOk}
                    onCancel={this.handleRenewModalCancle}
                    footer={[
                        <Button key="ok-close-modal" type="primary" onClick={this.handleRenewModalOk}>
                            确定，去付款
                        </Button>,
                        <Button
                            onClick={this.handleRenewModalCancle}
                            key="__cancle_button_">
                            取消
                        </Button>
                    ]}
                >
                    <div
                        style={{
                            paddingTop: "20px",
                            fontSize: "13px",
                            fontFamily: "微软雅黑",
                            textAlign: "center"
                        }}
                    >确定给该账户续费一年吗!</div>
                </Modal>

            </Layout>
        );
    }

    columns = [{
        title: '教师姓名',
        width: '120px',
        dataIndex: 'teacher_name',
        key: 'teacher_name',
    }, {
        title: '性别',
        width: '70px',
        dataIndex: 'teacher_sex',
        key: 'teacher_sex',
        render: (text, record) => {
            if (record.teacher_sex === '1') {
                return '男';
            } else if (record.teacher_sex === '2') {
                return '女';
            }
        },
    }, {
        title: '登录名',
        width: '130px',
        dataIndex: 'teacher_phone',
        key: 'teacher_phone'+1,
    }, {
        title: '昵称',
        width: '90px',
        dataIndex: 'teacher_nick_name',
        key: 'teacher_nick_name',
    }, {
        title: '手机',
        width: '135px',
        dataIndex: 'teacher_phone',
        key: 'teacher_phone',
    }, {
        title: '班级',
        width: '126px',
        dataIndex: 'class_data',
        key: 'class_data',
        render: (text, record) => {
            if (!record) return;
            let arr = record.class_data.map(item => {
                return item.class_name
            });
            return arr.join(',');
        }
    }, {
        title: '创建时间',
        width: '200px',
        dataIndex: 'teacher_add_time',
        key: 'teacher_add_time',
    },
    {
        title: "到期时间",
        width: "200px",
        dataIndex: "teacher_account_end_time",
        key: "teacher_account_end_time"
    },
    {
        title: '操作',
        width: '180px',
        key: 'action',
        render: (text, record) => this.renderOperations(record)
    }];
}

export default TeacherList;
