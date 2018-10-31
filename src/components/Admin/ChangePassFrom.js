import React from 'react';
import {Button, Form, Input, message, } from 'antd';
import {$axios, navPage} from "../../utils";

const {TextArea} = Input;
const FormItem = Form.Item;

class ChangePassFrom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
        };
    }
    
    // 提交表单 参数：user_id，old_user_pass，user_pass， confirm_pass
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $axios('Eduunit/Organization/update_password',
                    {...values, user_id: this.props.user_id}).then(data => {
                    if (!data) return;
                    if (data.ret_code === '0000000') {
                        message.success(data.ret_msg);
                        navPage('/admin/org_set/institution_detail');
                    }
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
        if (value && value !== form.getFieldValue('user_pass')) {
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

    

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24}, sm: {span: 2},
            },
            wrapperCol: {
                xs: {span: 24}, sm: {span: 16},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {span: 24, offset: 2}, sm: {span: 16},
            },
        };


        return (
            <Form onSubmit={this.handleSubmit} autoComplete='false'>
              
                <FormItem
                    {...formItemLayout}
                    label="旧密码"
                >
                        {getFieldDecorator('old_user_pass', {
                            rules: [{required: true, message: '请输入旧密码'}],
                        })(
                            <Input style={{margin:"initial",width:"160px !important"}} type="text" placeholder="请输入旧密码"/>
                        )}
                </FormItem>   
                <FormItem
                    {...formItemLayout}
                    label="新密码"
                >
                        {getFieldDecorator('user_pass', {
                             rules: [{
                                min: 6, max: 16, message: '请输入6-16位密码',
                            }, {
                                required: true, message: '请输入新密码',
                            }, {
                                validator: this.validateToNextPassword,
                            },{
                                pattern:/^[a-zA-Z0-9_]{0,}$/, message: '密码不能包含中文'
                            }],
                        })(
                            <Input onBlur={this.handleConfirmBlur} style={{margin:"initial",width:"160px !important"}} type="text" placeholder="请输入6-16位密码"/>
                        )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="确认新密码"
                >
                        {getFieldDecorator('confirm_pass', {
                             rules: [{
                                min: 6, max: 16, message: '请输入6-16位确认密码',
                            }, {
                                required: true, message: '请输入确认密码!',
                            }, {
                                validator: this.compareToFirstPassword,
                            }],
                        })(
                            <Input style={{margin:"initial",width:"160px !important"}} type="text" placeholder="请再次输入密码"/>
                        )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
                
                
            </Form>
        );
    }
}

export default ChangePassFrom;
