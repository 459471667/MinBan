import React from 'react';
import {Button, Form, Input, message, Select} from 'antd';
import {$axios, navPage} from "../../utils";
import { CLIENT_RENEG_WINDOW } from 'tls';

const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class StudentAddForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            class_list: [
            // {
            //     "class_id": "1",
            //     "class_name": "一年级1班",
            //     "grade_code": 10001
            // },
            // {
            //     "class_id": "2",
            //     "class_name": "一年级2班",
            //     "grade_code": 10001
            // }
            ],
            grade_list: [],
            loading:false,
            buttonDisabled:false,
            buttonText:"获取短信验证码",
            showExpirenceTime:false
        };
        this.handleAccountTypeChange=this.handleAccountTypeChange.bind(this);
        this.validatorExpirenceTime = this.validatorExpirenceTime.bind(this);
    }

    componentDidMount() {
        $axios('/Eduunit/EduunitClass/grade_list').then(data => {
            if (!data) return;
            if (data.ret_code === '0000000' && data.ret_data.grade_list) {
                this.setState({grade_list: data.ret_data.grade_list});
            }
        });
        // 获取班级
        let webVersion=localStorage.getItem("web_version");
        this.fetchAllOrHandleChangeClass();
    };

    handleAccountTypeChange(){
        // value值总是change
        this.setState((prevState)=>{
            return {showExpirenceTime:!prevState.showExpirenceTime};
        })
    }

    validatorExpirenceTime(rule,value,cb){
        if (!value) {
            cb();
            return;
        }
        if(value.match(/\D/g)){
            cb("体验时间只能是数字");
            return;
        };
        if(parseInt(value)<=0||parseInt(value)>3){
            cb("体验时间必须小于3天");
            return;
        }
        cb();
        
    }

    // 提交表单
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $axios('/Eduunit/Student/studentAdd', {...values})
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


    // 获取全量的班级
    fetchAllOrHandleChangeClass = (value) => {
        let web_version=localStorage.getItem("web_version");
        if(value)this.props.form.setFieldsValue({class_id: ''});
        $axios('/Eduunit/Student/getClass', value?{grade_code: value}:undefined).then(data => {
            console.log(data,"this is data");
            if (!data) return;
            if (data.ret_code === '0000000' && data.ret_data) {
                this.setState({class_list: data.ret_data});
            }
            if (data.ret_code === '6003' && data.ret_data) {
                this.setState({class_list: data.ret_data});
            }
        });
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
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
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };

    // 获取短信验证码
    fetchSmsCode=()=>{
        console.log("获取手机验证码");
        const {getFieldValue,getFieldError} = this.props.form;
        const newPhoneValue=getFieldValue("student_phone");

        if(!newPhoneValue){
            message.error("请先输入手机号!");
            return;
        };
        if(getFieldError("student_phone")){
            message.error("请输入正确的手机号!");
            return;
        };
        const paramObj={
            token:window.localStorage.getItem("token"),
            student_phone:newPhoneValue
        };
        console.log(paramObj);
        $axios("/Eduunit/Student/get_sms",paramObj).then((result)=>{
            if(!result)return;
            this.setState({loading:true,buttonDisabled:true});
            let i =60;
            this._interVal=setInterval(()=>{
                i=i-1;
                if(i===0){
                    this.setState({buttonText:"获取短信验证码",buttonDisabled:false,loading:false});
                    clearInterval(this._interVal);
                    return;
                };
                this.setState({buttonText:""+i+" 秒后重新获取"});
            },1000);
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const WebVersion=localStorage.getItem("web_version");
        const {class_list,showExpirenceTime} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24}, sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24}, sm: {span: 16},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {span: 24, offset: 0}, sm: {span: 16},
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
                        <Input/>
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
                            onChange={this.handleSelectChange}
                        >
                            <Option value="1">男</Option>
                            <Option value="2">女</Option>
                        </Select>
                    )}
                </FormItem>
            {/***<FormItem
                    {...formItemLayout}
                    label="学号："
                >
                    {getFieldDecorator('student_no', {
                        rules: [{required: false, message: '请输入学号'}],
                    })(
                        <Input/>
                    )}
                </FormItem>****/}
                {/****{(WebVersion&&WebVersion==="1")?<FormItem
                    {...formItemLayout}
                    label="年级："
                >
                    {getFieldDecorator('grade_code', {
                        rules: [{required: true, message: '请选择年级'}],
                    })(
                        <Select
                            placeholder="请选择"
                            onChange={this.fetchAllOrHandleChangeClass}
                        >
                            {this.state.grade_list.map(item => {
                                return <Option key={item.grade_code}>{item.grade_name}</Option>;
                            })}
                        </Select>
                    )}
                </FormItem>:null}**/}
                <FormItem
                    {...formItemLayout}
                    label="班级："
                >
                    {getFieldDecorator('class_id', {
                        rules: [{required: true, message: '请输入班级'}]
                        // initialValue:class_list[0]?class_list[0].class_id:""
                    })(
                        <Select>
                            {class_list.map((elObj)=>{
                                return (<Option 
                                            value={elObj.class_id}
                                            key={elObj.class_id}>{elObj.class_name}
                                         </Option>)
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
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="验证码："
                >
                    {getFieldDecorator('sms_code', {
                        rules: [{
                            pattern: /\d/, message: '验证码只能是数字'
                        }, {
                            min: 6, max:6 , message: '请输入6位验证码'
                        }, {
                            required: true, message: '请输入验证码!'
                        }]
                    })(
                        <Input  />
                    )}
                    <Button
                        type="primary"
                        disabled={this.state.buttonDisabled}
                        onClick={this.fetchSmsCode}
                        loading={this.state.loading}
                        style={{marginLeft:"10px"}}
                        >{this.state.buttonText}</Button>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="密码："
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '请输入密码!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="确认密码："
                >
                    {getFieldDecorator('repasswd', {
                        rules: [{
                            required: true, message: '请输入确认密码!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur}/>
                    )}
                </FormItem>
                {/* <FormItem
                    {...formItemLayout}
                    label="账号类型:"
                >
                    {getFieldDecorator('account_type', {
                        rules: [{
                            required: true, message: '请选择账号类型!',
                        }],
                        initialValue:0
                    })(
                        <Select 
                            onChange={this.handleAccountTypeChange}
                        >
                            <Select.Option
                                value={0}
                            >普通账号</Select.Option>
                            <Select.Option
                                value={1}
                            >体验账号</Select.Option>
                        </Select>
                    )}
                </FormItem> */}
                {/* {showExpirenceTime ? <FormItem
                    {...formItemLayout}
                    label="体验时间:"
                >
                    {getFieldDecorator('account_time', {
                        rules: [{
                            required: true, message: '请输入体验时间!',
                        },
                        { validator:this.validatorExpirenceTime}
                    ]
                    })(
                        <Input  />
                    )}
                </FormItem>:null} */}
                <FormItem
                    {...formItemLayout}
                    label="备注："
                >
                    {getFieldDecorator('remark', {
                        rules: [{required: false, message: '请输入备注!'}],
                    })(
                        <TextArea rows={4} style={{width: '424px', height: '82px', resize: 'none'}}/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button style={{marginLeft: '20px'}} className="btn-gray"
                            onClick={() => navPage('../school_manage/student_list')}>返回</Button>
                </FormItem>
            </Form>
        );
    }
}

export default StudentAddForm;
