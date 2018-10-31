import React, { Component } from 'react';
import { Button, Input, Layout, message, Popconfirm, Table, Select, Modal, Message, DatePicker } from "antd";
import { $axios} from "../../../utils";
import "./StudentListStyle.less";

class StudentList extends Component {

    constructor(props) {
        super(props);
        this.handleAccountValueChange = this.handleAccountValueChange.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleStudentSexChange = this.handleStudentSexChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onStartChange = this.onStartChange.bind(this);
        this.handleStartOpenChange = this.handleStartOpenChange.bind(this);
        this.handleEndOpenChange = this.handleEndOpenChange.bind(this);
        this.onEndChange = this.onEndChange.bind(this);
        this.disabledEndDate = this.disabledEndDate.bind(this);
    }

    state = {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        studentList: [],
        user_name: '',
        user_account: '',
        user_phone: '',
        user_class: '',
        // 账户类型
        account_type: "",
        nick_name: "",
        page: 0,
        total: 0,
        classList: [],
        visible: false,
        className: "",
        studentId: "",
        modalTitle: "重新分配班级",
        modalLoding: false,
        classId: "",
        showError: false,
        selectDisabled: false,
        _className: "",
        // 查询学生出生年月...开始时间
        startValue: null,
        // 查询学生出生年月...结束时间
        endValue: null,
        // 学生性别
        studentSex: "",
        endOpen: false,
        user: JSON.parse(localStorage.getItem('userInfo'))
    };

    // 弹窗指示状态
    confirmLoading = false;



    handleClassChange(value) {
        // 设置classId
        const { classList, className } = this.state;
        if (className === value) {
            this.setState({ showError: true, classId: "", _className: value });
        } else {
            this.setState({ showError: false });
            classList.forEach((classObj) => {
                if (classObj["class_name"] === value)
                    this.setState({ classId: classObj["class_id"], _className: classObj["class_name"] });
            });
        };
    };

    onChange(field, value) {
        this.setState({
            [field]: value,
        });
    };

    disabledEndDate(endValue) {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onStartChange(value) {
        this.onChange("startValue", value);
    };

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }

    onEndChange(value) {
        this.onChange("endValue", value);
    }

    handleOk() {
        const { classId } = this.state;
        if (!classId || !classId.trim()) {
            this.setState({ showError: true });
            return;
        }
        // 提交中不允许关闭弹窗
        this.confirmLoading = true;
        this.setState({ modalLoding: true, selectDisabled: !0 }, () => {
            const { classId: class_id, studentId: student_id } = this.state;
            // 提交操作
            $axios("/Eduunit/Student/student_distribute_class", { class_id, student_id }, "post").then((data) => {
                data = data || {};
                const { ret_code: retCode } = data;
                if (retCode === "0000000") {
                    this.setState({ visible: false, _className: "", className: "", studentId: "", classId: "" }, () => {
                        this.setState({ selectDisabled: !1, modalLoding: false }, () => {
                            Message.success("分配班级成功!");
                            const { user_name, user_account, user_phone, user_class, account_type, nick_name, startValue: start_time, endValue: end_time, studentSex: student_sex } = this.state;
                            const paramObj = {
                                user_name,
                                user_account,
                                user_phone,
                                user_class,
                                account_type,
                                nick_name,
                                page: 0,
                                student_sex,
                                start_time: (start_time && start_time.format("YYYY-MM") || ""),
                                end_time: (end_time && end_time.format("YYYY-MM") || "")
                            };
                            this.getStudentList(paramObj);
                        });
                        this.confirmLoading = !1;
                    });
                } else {
                    Message.error(data.ret_msg || "数据错误!");
                }
            });
        });
    }

    handleCancel() {
        if (this.confirmLoading) return;
        // 清空状态，提升体验。
        this.setState({ visible: false, classId: "" }, () => {
            this.setState({ className: "", studentId: "", showError: false, _className: "" });
        });
    };

    componentDidMount() {
        let { user_name, user_account, user_phone, user_class, page } = this.state;
        this.getStudentList({ user_name, user_account, user_phone, user_class, page });
        this.fetchAllClass().then((classList) => {
            this.setState({ classList });
        });
    }

    onPageChange = (pageNumber) => {
        let { user_name, user_account, user_phone, user_class, page } = this.state;
        this.getStudentList({ user_name, user_account, user_phone, user_class, page: pageNumber });
    };

    handleInput = (e, inputName) => {
        this.setState({ [inputName]: e.target.value });
    };

    search = () => {
        this.setState({ page: 0 });
        const { user_name, user_account, user_phone, user_class, account_type, nick_name, startValue: start_time, endValue: end_time, studentSex: student_sex } = this.state;
        if ((start_time && !end_time) || (!start_time && end_time)) {
            Message.error("开始时间和结束时间只能同时为空!");
            return;
        };
        if ((start_time && end_time)
            && (new Date(start_time.format("YYYY-MM")).getTime() - new Date(end_time.format("YYYY-MM")).getTime() > 0)) {
            Message.error("开始时间必须小于结束时间，请重新选择!");
            return;
        };
        const paramObj = {
            user_name,
            user_account,
            user_phone,
            user_class,
            account_type,
            nick_name,
            page: 0,
            student_sex,
            start_time: (start_time && start_time.format("YYYY-MM") || ""),
            end_time: (end_time && end_time.format("YYYY-MM") || "")
        };
        this.getStudentList(paramObj);
    };

    handleAccountValueChange = (value) => {
        this.setState({ account_type: value });
    };

    confirmDelete = (studentId) => {
        let params = { student_id: studentId };
        const { user_name, user_account, user_phone, user_class, page } = this.state;
        $axios('/Eduunit/Student/studentDelete', params).then(resp => {
            if (!resp) return;
            if (resp.ret_code === '0000000') {
                this.getStudentList({ user_name, user_account, user_phone, user_class, page });
                message.success(resp.ret_msg);
            }
        });
    };

    // 获取全量的班级
    /**
     * 
     * @param(noen)
     * @return(Promise)
     * 
     * */
    fetchAllClass() {
        return new Promise((resolve, reject) => {
            $axios('/Eduunit/Student/getClass').then(data => {
                if (!data) return;
                if (data.ret_code === '0000000' && data.ret_data) {
                    resolve(data.ret_data);
                }
                if (data.ret_code === '6003' && data.ret_data) {
                    resolve(data.ret_data);
                }
            });
        });
    };

    handleStudentSexChange(value) {
        this.setState({ studentSex: value });
    };

    getStudentList = (searchParams) => {
        let params = { ...searchParams };
        $axios('/Eduunit/Student/index', params).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                console.log("fetch data", data.ret_data.student_list);
                this.setState({ studentList: data.ret_data.student_list, total: parseInt(data.ret_data.total, 10) });
            } else if (data.ret_code === '6003') {
                this.setState({ studentList: [] });
            }
        });
    };

    distributionClass(studentId, className) {
        if (!className || className.trim() === "") {
            this.setState((prevState) => {
                prevState.classList.unshift({ class_id: "__doubei_@@_random", class_name: "请选择班级", class_id: "" });
                return Object.assign(prevState, { visible: true, studentId: studentId, className: "", modalTitle: "分配班级" });
            });
            return;
        };
        this.setState({ visible: true, studentId: studentId, modalTitle: "重新分配班级", className: className, _className: className });
    };

    render() {
        let { studentList,
            user_name,
            modalTitle,
            selectDisabled,
            user_account,
            _className,
            showError,
            modalLoding,
            visible,
            classList,
            className,
            student_nick_name,
            user_phone,
            user_class,
            startValue,
            endValue,
            total,
            userInfo,
            endOpen,
            nick_name } = this.state;
        studentList = studentList.map((item, index) => {
            return Object.assign({ ...item, key: index });
        });
        const columns = [{
            title: '学生姓名',
            width: '120px',
            dataIndex: 'student_name',
            key: 'student_name',
        }, {
            title: '出生年月',
            width: '120px',
            dataIndex: 'student_birth',
            key: 'student_birth',
        }, {
            title: '性别',
            width: '70px',
            dataIndex: 'student_sex',
            key: 'student_sex',
        },
        // {
        //     title: '登录名',
        //     width: '156px',
        //     dataIndex: 'student_user_account',
        //     key: 'student_user_account',
        // },
        {
            title: '昵称',
            width: '156px',
            dataIndex: 'student_nick_name',
            key: 'student_nick_name',
        },
        {
            title: '手机',
            width: '135px',
            dataIndex: 'student_phone',
            key: 'student_phone',
        }, {
            title: '班级',
            width: '126px',
            dataIndex: 'class_name',
            key: 'class_name',
        }, {
            title: '创建时间',
            width: '200px',
            dataIndex: 'student_add_time',
            key: 'student_add_time',
        },
        {
            title: '账户类型',
            width: '200px',
            key: 'student_account_type',
            render: (text, colData) => {
                const { student_account_type, student_account_status } = colData;
                let expirenceStatus = "";
                if (student_account_status === "1") {
                    expirenceStatus = "体验中";
                }
                if (student_account_status === "2") {
                    expirenceStatus = "体验到期";
                }
                return (student_account_type === "1" ? (<span>体验账号{"(" + expirenceStatus + ")"}</span>) : "普通账号");
            }
        },
        {
            title: '操作',
            width: '150px',
            key: 'action',
            render: (text, data) => {
                {/* <Link to={`/admin/school_manage/student_edit/${record.student_id}`}>编辑</Link>
                        <Popconfirm title="确定要删除吗?" onConfirm={() => this.confirmDelete(record.student_id)}>
                            <Link to="#">删除</Link>
                        </Popconfirm> */}
                const {userInfo} = this.state;
                if(userInfo.user_type==="2")return void 0;
                const { class_name: className, student_id: studentId } = data;
                const distributionClassStyle = {
                    color: "#218ed1",
                    cursor: "pointer"
                };
                let distributionText = "分配班级";
                if (className && className.trim() !== "")
                    distributionText = "重新分配班级";
                return <span
                    onClick={this.distributionClass.bind(this, studentId, className)}
                    style={distributionClassStyle}>{distributionText}</span>
            }
        }];
        // input width 60 60 90 120 60 
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "10px"
        };
        const splitSimple = {
            position: "relative",
            top: "6px",
            fontSize: "15px"
        };
        return (
            <Layout style={containerStyle} >
                <Layout className="search-btn-block">
                    <div className="search-block" style={{ height: "initial", lineHeight: "initial" }}>
                        <div style={{ marginTop: "10px" }}>
                            <label>学生姓名</label>
                            <Input
                                className="input-search"
                                value={user_name} style={{ width: 120 }}
                                onChange={(e) => this.handleInput(e, 'user_name')} />
                            {/* <label>登录名</label>
                            <Input
                                className="input-search"
                                value={user_account} style={{ width: 120 }}
                                onChange={(e) => this.handleInput(e, 'user_account')} /> */}
                            <label>昵称</label>
                            <Input
                                className="input-search"
                                value={nick_name} style={{ width: 70 }}
                                onChange={(e) => this.handleInput(e, 'nick_name')} />
                            <label>手机</label>
                            <Input
                                className="input-search"
                                value={user_phone} style={{ width: 120 }}
                                onChange={(e) => this.handleInput(e, 'user_phone')} />
                            <label>班级</label>
                            <Input
                                className="input-search"
                                value={user_class} style={{ width: 80 }}
                                onChange={(e) => this.handleInput(e, 'user_class')} />
                            
                        </div>
                        <div style={{ justifyContent: "space-between", display: "flex", marginTop: "10px", marginBottom: "10px", flexDirection: "row" }}>
                            <div style={{ display: "inline-block" }} className="container-input-radius">
                                出生年月
                                <DatePicker.MonthPicker
                                    style={{ marginLeft: "5px" }}
                                    className="doubei-custom-define"
                                    mode="month"
                                    format="YYYY-MM"
                                    placeholder="开始时间"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                                <span style={splitSimple}> ~ </span>
                                <DatePicker.MonthPicker
                                    className="doubei-custom-define"
                                    disabledDate={this.disabledEndDate}
                                    mode="month"
                                    format="YYYY-MM"
                                    placeholder="结束时间"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </div>
                            <div style={{marginLeft:"10px"}}>
                                <label>账户类型</label>
                                <Select
                                    style={{ verticalAlign: "middle", borderRadius: "3px" }}
                                    defaultValue="" onChange={this.handleAccountValueChange}>
                                    <Select.Option key="___111__1" value="">全部</Select.Option>
                                    <Select.Option key="___1323__1322131" value="0">普通账号</Select.Option>
                                    <Select.Option key="__22__222" value="1">体验账户</Select.Option>
                                </Select>
                            </div>
                            <div
                                className="container-input-radius"
                                style={{ display: "inline-block" }} className="container-input-radius">
                                性别
                                <Select
                                    style={{ marginLeft: "5px",width:"69px" }}
                                    onChange={this.handleStudentSexChange}
                                    defaultValue="">
                                    <Select.Option value="" key="__1__1">全部</Select.Option>
                                    <Select.Option value="1" key="__2__2" >男</Select.Option>
                                    <Select.Option value="2" key="__3_3">女</Select.Option>
                                </Select>
                            </div>
                            <div>
                                <Button
                                    style={{ backgroundColor: "#218ed1", marginRight: "20px" }}
                                    type="primary"
                                    className="input-search"
                                    onClick={this.search}>查询</Button>
                            </div>
                        </div>
                    </div>
                    {/* {userInfo.user_type !== '1' &&
                        <div className="top-btn-group">
                        <Button type="primary"
                                onClick={() => navPage('/admin/school_manage/student_add')}>添加学生</Button>
                            <Button type="primary"
                                onClick={() => navPage('/admin/school_manage/student_import')}>导入</Button>
                        </div>} */}
                </Layout>

                <div className="table-container">
                    <Table columns={columns} dataSource={studentList}
                        pagination={{
                            showQuickJumper: true,
                            onChange: this.onPageChange,
                            defaultPageSize: 10,
                            total: total
                        }} />
                </div>
                <Modal
                    className="doubei-studentList-modal"
                    visible={visible}
                    width={400}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button
                            loading={modalLoding}
                            key="sbumit" type="primary" onClick={this.handleOk}>
                            确定
                        </Button>,
                        <Button key="cancel" onClick={this.handleCancel}>取消</Button>
                    ]}
                >
                    <div
                        style={{ marginTop: "20px", fontFamily: "微软雅黑", fontSize: "13px", marginBottom: "10px", textAlign: "center" }}
                    >{modalTitle}</div>
                    <div style={{ textAlign: "center" }}>
                        <Select
                            disabled={selectDisabled}
                            onChange={this.handleClassChange.bind(this)}
                            value={_className}
                            style={{ width: "300px", borderRadius: "3px" }}>
                            {classList.map((dataEl) => {
                                return (<Select.Option
                                    value={dataEl.class_name}
                                    key={dataEl.class_id} >
                                    {dataEl.class_name}
                                </Select.Option>)
                            })}
                        </Select>
                    </div>
                    {showError ? <div style={{ color: "red", paddingLeft: "25px" }}>请先选择或更换班级!</div> : null}
                </Modal>
            </Layout>
        );
    }
}

export default StudentList;
