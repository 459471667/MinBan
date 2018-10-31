import React from 'react';
import {Button, Form, Input, message, Select} from 'antd';
import {$axios, navPage} from "../../utils";

const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class TeacherAddForm extends React.Component {

    userId = '';
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        loading:false,
        buttonDisabled:false,
        buttonText:"获取短信验证码",
        payButtonText:"去付款",
        buttonLoading:false,
    };

    constructor(props) {
        super(props);
        const {userId} = this.props;
        this.userId = userId;
    }

    componentDidMount() {

    }
    //模拟点击打开窗口
    openWin = (url, id) => {
        var a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.setAttribute("id", id);
        // 防止反复添加
        if(!document.getElementById(id)) {                     
            document.body.appendChild(a);
        }
        a.click();
        a.remove();
    }

    // // 提交表单
    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     this.props.form.validateFieldsAndScroll((err, values) => {
    //         if (!err) {

    //             new Promise((resolve, reject) => {
    //                 $axios('/Eduunit/Teacher/teacherAdd', {...values})
    //                 .then(data => {
    //                     if (!data){
    //                         //newWindow.close();
    //                         return;
    //                     };
    //                     data.ret_data=data.ret_data||{};
    //                     if (data.ret_code ==="0000000"){
    //                         message.success("添加成功!");
    //                         console.log("添加返回连接",data.ret_data.url);
                            
    //                         // 支付连接跳转
    //                         if (data.ret_data.url && data.ret_data.url !=undefined){
                                
    //                             resolve(data.ret_data.url);
    //                             //newWindow.location.href = data.ret_data.url;
    //                            //this.openWin(data.ret_data.url,"newWindow");
    //                         }
    //                         navPage('/admin/school_manage/teacher_list');
    //                     };
    //                 });
    //             }).then( (url) =>{
    //                 this.openWin(url,"newWindow");
                    
    //                 //newWindow.location.href = url;
    //             }); 



    //         }
            
    //     });
    // };

     // 提交表单
     handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let newWindow = window.open();
                    $axios('/Eduunit/Teacher/teacherAdd', {...values})
                    .then(data => {
                        console.log("初始：",data);
                        if (!data){
                            newWindow.close();
                            return;
                        };
                        data.ret_data=data.ret_data||{};
                        if (data.ret_code ==="0000000"){
                            message.success("添加成功!");
                            
                            
                            // 支付连接跳转
                            if (data.ret_data.url && data.ret_data.url !=undefined){
                                
                                newWindow.location.href = data.ret_data.url;
                               //this.openWin(data.ret_data.url,"newWindow");
                            }else{
                                newWindow.close();
                            }
                            navPage('/admin/school_manage/teacher_list');
                        };
                    });
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
        const newPhoneValue=getFieldValue("teacher_phone");

        if(!newPhoneValue){
            message.error("请先输入手机号!");
            return;
        };
        if(getFieldError("teacher_phone")){
            message.error("请输入正确的手机号!");
            return;
        };
        const paramObj={
            token:window.localStorage.getItem("token"),
            teacher_phone:newPhoneValue
        };
        $axios("/Eduunit/Teacher/get_sms",paramObj).then((result)=>{
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
        const { buttonLoading, payButtonText} = this.state;
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
                    label="教师姓名："
                >
                    {getFieldDecorator('teacher_name', {
                        rules: [{
                            required: true, message: '请输入教师姓名!',
                        }]
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="性别："
                >
                    {getFieldDecorator('teacher_sex', {
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
                <FormItem
                    {...formItemLayout}
                    label="手机："
                >
                    {getFieldDecorator('teacher_phone', {
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
                <FormItem
                    {...formItemLayout}
                    label="备注："
                >
                    {getFieldDecorator('teacher_remark', {
                        rules: [{required: false, message: '请输入备注!'}],
                    })(
                        <TextArea rows={4} style={{width: '424px', height: '82px', resize: 'none'}}/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button loading={buttonLoading} type="primary" htmlType="submit">{payButtonText}</Button>
                    <Button style={{marginLeft: '20px'}} className="btn-gray"
                            onClick={() => navPage('/admin/school_manage/teacher_list')}>返回</Button>
                </FormItem>
            </Form>
        );
    }
}

export default TeacherAddForm;
