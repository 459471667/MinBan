import React from 'react';
import { Button, Form, Input, message, Select, Message } from 'antd';
import { $axios, navPage } from "../../utils";

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;


class StudentEditForm extends React.Component {
    student_id = '';
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        grade_list: [],
        class_list: [],
        copyPhoneNumber: "",
        showPhoneSmsCode: false,
        loading: false,
        buttonDisabled: false,
        buttonText: "获取短信验证码",
        showExpirenceTime: false
    };

    constructor(props) {
        super(props);
        this.student_id = this.props.student_id;
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this);
        this.validatorExpirenceTime = this.validatorExpirenceTime.bind(this);
    }

    handleAccountTypeChange() {
        const { student_account_status,form}= this.props;
        this.setState((prevState) => {
            return { showExpirenceTime: !prevState.showExpirenceTime };
        },()=>{
            const {showExpirenceTime}=this.state;
            if (student_account_status==="1"&&showExpirenceTime){
                form.setFieldsValue({student_account_status:"1"});
            }
        });
    }

    validatorExpirenceTime(rule, value, cb) {
        if (!value) {
            cb();
            return;
        }
        if (value.match(/\D/g)) {
            cb("体验时间只能是数字");
            return;
        };
        if (parseInt(value) <= 0 || parseInt(value) > 3) {
            cb("体验时间必须小于3天");
            return;
        }
        cb();

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            grade_list: nextProps.grade_list,
            class_list: nextProps.class_list,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { student_experience_times } = this.props;
        // 体验账号上线需要把这个注释掉
        // if (parseInt(student_experience_times) === 2) {
        //     Message.error("一个手机号只能有两次体验机会!")
        //     return;
        // };
        let student_id = this.student_id;
        
            this.props.form.validateFieldsAndScroll((err, values) => {
                const { student_account_type, student_account_status, student_experience_days } = values;
                values["account_type"] = student_account_type;
                values["account_status"] = student_account_status;
                values["account_time"] = student_experience_days;
   
                if (!err) {
                    $axios('/Eduunit/Student/studentEdit', { ...values, student_id })
                        .then(data => {
                            if (!data) return;
                            if (data.ret_code === '0000000') {
                                message.success(data.ret_msg);
                                navPage('/admin/school_manage/student_list');
                            }
                        });
                }
            });
        
    };

    handlePhoneNumberChange(e) {
        e.persist();
        const { copyPhoneNumber } = this.state;
        const phoneNumber = e.target.value;
        setTimeout(() => {
            let errorsText = this.props.form.getFieldError("student_phone");
            if (errorsText) {
                this.setState({ showPhoneSmsCode: false });
                return;
            };
            if (copyPhoneNumber === phoneNumber) {
                this.setState({ showPhoneSmsCode: false });
            } else {
                this.setState({ showPhoneSmsCode: true });
            };
        }, 100);
    };

    // 获取短信验证码
    fetchSmsCode = () => {
        const { getFieldValue } = this.props.form;
        const newPhoneValue = getFieldValue("student_phone");
        const studentId = this.props["student_id"];
        const paramObj = {
            token: window.localStorage.getItem("token"),
            student_id: studentId,
            student_phone: newPhoneValue
        };
        $axios("/Eduunit/Student/get_sms", paramObj).then((result) => {
            if (!result) return;
            this.setState({ loading: true, buttonDisabled: true });
            let i = 60;
            this._interVal = setInterval(() => {
                i = i - 1;
                if (i === 0) {
                    this.setState({ buttonText: "获取短信验证码", buttonDisabled: false, loading: false });
                    clearInterval(this._interVal);
                    return;
                };
                this.setState({ buttonText: "" + i + " 秒后重新获取" });
            }, 1000);
        });
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    };
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    componentDidMount() {
        const { student_experience_days } = this.props;
        if (student_experience_days && parseInt(student_experience_days) > 0 && student_experience_days < 4) {
            this.setState({ showExpirenceTime: true });
        }
        this.setState({ copyPhoneNumber: this.props["student_phone"] });

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { showPhoneSmsCode, showExpirenceTime, showStatus } = this.state;
        const { student_account_type, student_account_status } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 }, sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 }, sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 }, sm: { span: 16 },
            },
        };

        return (
            <Form onSubmit={this.handleSubmit} autoComplete='false'>
                <FormItem
                    {...formItemLayout}
                    label="学生姓名："
                >
                    {getFieldDecorator('student_name', {
                        rules: [{
                            required: true, message: '请输入学生姓名!',
                        }]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="性别："
                >
                    {getFieldDecorator('student_sex', {
                        rules: [{
                            required: true, message: '请选择性别!',
                        }]
                    })(
                        <Select
                            placeholder="请选择"
                        >
                            <Option value="1">男</Option>
                            <Option value="2">女</Option>
                        </Select>
                    )}
                </FormItem>
                {/***
                <FormItem
                    {...formItemLayout}
                    label="学号："
                >
                    {getFieldDecorator('student_no', {
                        rules: [{required: false, message: '请输入学号'}],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="年级："
                >
                    {getFieldDecorator('grade_code', {
                        rules: [{required: true, message: '请选择年级'}],
                    })(
                        <Select
                            placeholder="请选择"
                            onChange={this.props.onGradeChange}
                        >
                            {this.state.grade_list.map(item => {
                                return <Option key={item.grade_code}>{item.grade_name}</Option>;
                            })}
                        </Select>
                    )}
                </FormItem>***/}
                <FormItem
                    {...formItemLayout}
                    label="班级："
                >
                    {getFieldDecorator('class_id', {
                        rules: [{ required: true, message: '请选择班级' }],
                    })(
                        <Select
                            placeholder="请选择"
                            onChange={this.props.onClassChange}
                        >
                            {this.state.class_list.map((item) => {
                                return <Option key={item.class_id}>{item.grade_class_name}</Option>;
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="手机："
                >
                    {getFieldDecorator('student_phone', {
                        rules: [{
                            pattern: /(^(\d{3,4}-)?\d{7,8})$|(^1\d{10})/g, message: '请输入正确的电话号！'
                        }, {
                            min: 11, max: 13, message: '电话号最长为13位最短为11位！'
                        }, {
                            required: true, message: '请输入电话号码!'
                        }]
                    })(
                        <Input onChange={this.handlePhoneNumberChange} />
                    )}
                </FormItem>
                {showPhoneSmsCode ? <FormItem
                    {...formItemLayout}
                    label="验证码："
                >
                    {getFieldDecorator('sms_code', {
                        rules: [{
                            pattern: /\d/, message: '验证码只能是数字'
                        }, {
                            min: 6, max: 6, message: '请输入6位验证码'
                        }, {
                            required: true, message: '请输入验证码!'
                        }]
                    })(
                        <Input />
                    )}
                    <Button
                        disabled={this.state.buttonDisabled}
                        onClick={this.fetchSmsCode}
                        loading={this.state.loading}
                        style={{ marginLeft: "10px" }}
                    >{this.state.buttonText}</Button>
                </FormItem> : null}
                <FormItem
                    {...formItemLayout}
                    label="密码："
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: false, message: '请输入密码!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="确认密码："
                >
                    {getFieldDecorator('repasswd', {
                        rules: [{
                            required: false, message: '请输入确认密码!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </FormItem>
                {/* <FormItem
                    {...formItemLayout}
                    label="账号类型:"
                >
                    {getFieldDecorator('student_account_type', {
                        rules: [{
                            required: true, message: '请选择账号类型!',
                        }]
                    })(
                        <Select
                            disabled={student_account_type === "1" ? false : true}
                            onChange={this.handleAccountTypeChange}
                        >
                            <Select.Option
                                value="0"
                            >
                                普通账户
                            </Select.Option>
                            <Select.Option
                                value="1"
                            >体验账户</Select.Option>
                        </Select>
                    )}
                </FormItem> */}
                {/* {showExpirenceTime && student_account_type === "1" ? <FormItem
                    {...formItemLayout}
                    label="体验时间:"
                >
                    {getFieldDecorator('student_experience_days', {
                        rules: [{
                            required: true, message: "请输入体验时间!",
                        }, { validator: this.validatorExpirenceTime }]
                    })(

                        <Input />
                    )}
                </FormItem> : null} */}
                {/* {student_account_type === "1" && showExpirenceTime ? <FormItem
                    {...formItemLayout}
                    label="账号状态:"
                >
                    {getFieldDecorator('student_account_status', {
                        rules: [{
                            required: true, message: "请选择账号状态!",
                        }]
                    })(
                        <Select disabled={student_account_status==="1"?true:false}>
                            <Select.Option
                                value="1"
                            >
                                体验中
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >体验到期</Select.Option>
                        </Select>
                    )}
                </FormItem> : <FormItem
                    {...formItemLayout}
                    label="账号状态:"
                >
                        <Input value="正常" disabled={true} />
                    </FormItem>} */}

                <FormItem
                    {...formItemLayout}
                    label="备注："
                >
                    {getFieldDecorator('remark', {
                        rules: [{ required: false, message: '请输入备注!' }],
                    })(
                        <TextArea rows={4} style={{ width: '424px', height: '82px', resize: 'none' }} />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button style={{ marginLeft: '20px' }} className="btn-gray"
                        onClick={() => navPage('../student_list')}>返回</Button>
                </FormItem>
            </Form>
        );
    }
};
export default StudentEditForm;
