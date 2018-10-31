import React from "react";
import {Input, message, Modal, Radio, Select} from 'antd';
import './CheckModal.less';
import {$axios} from "../../utils";

class CheckModal extends React.Component {
    // 2未审核 1以通过 3未通过
    currStatus = '';
    state = {
        ModalText: '作品审核',
        visible: false,
        confirmLoading: false,
        works_id: '',
        works_status: 1,
        works_code: '',
        evaluate_content: ''
    };

    componentDidMount() {
        // todo:请求作品审核所有作品类型，请求已审核的信息
    }

    showModal = (works_id, works_status) => {
        this.currStatus = works_status;
        this.setState({
            visible: true,
            works_id: works_id,
            works_status: works_status,
            works_code: '',
            evaluate_content: ''
        });
    };
    handleOk = () => {
        const {works_id, works_status, works_code, evaluate_content} = this.state;
        let params = {works_id, works_status, works_code, evaluate_content};
        if (!works_status) {
            message.error('请选择是否通过审核！');
            return;
        }
        if (!works_code) {
            message.error('请选择作品类型！');
            return;
        }
        if (!evaluate_content) {
            message.error('请输入老师评语！');
            return;
        }
        if (evaluate_content.length > 100) {
            message.error('评价内容必须在100字以内');
            return;
        }
        this.setState({
            ModalText: '作品审核',
            confirmLoading: true,
        });
        $axios('/Eduunit/EduunitWorks/works_status', params).then(data => {
            if (!data) {
                this.setState({confirmLoading: false});
                return;
            }
            if (data.ret_code === '0000000') {
                this.setState({
                    visible: false,
                    confirmLoading: false,
                    works_id: '',
                    works_status: '',
                    works_code: '',
                    evaluate_content: ''
                });
                this.props.onConfirm({works_status: this.currStatus, works_name: '', student_name: '', page: 0});
                message.success(data.ret_msg);
            }
            this.setState({
                confirmLoading: false,
            });

        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
            works_id: '',
            works_status: '',
            works_code: '',
            evaluate_content: ''
        });
    };

    handleChange = (e, labelName) => {
        // 当改变select时e返回的就是选中的值没有target要进行判断单独处理
        if (e.target) {
            this.setState({[labelName]: e.target.value});
        } else {
            this.setState({[labelName]: e});
        }
    };

    render() {
        const {visible, confirmLoading, works_status, works_code, evaluate_content} = this.state;
        return (
            <div>
                <Modal title="作品审核"
                       visible={visible}
                       width="516px"
                       onOk={this.handleOk}
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                >
                    <div className="modal-body">
                        <div>
                            <label>审核意见：</label>
                            <Radio.Group onChange={e => this.handleChange(e, 'works_status')} value={works_status}>
                                <Radio value={1}>通过</Radio>
                                <Radio value={3}>不通过</Radio>
                            </Radio.Group>
                        </div>
                        <div style={{marginBottom: 10}}><label style={{marginRight: 24}}>类型：</label>
                            <Select onChange={e => this.handleChange(e, 'works_code')} style={{width: 100}}
                                    value={works_code}
                            >
                                <Select.Option value={'100001'} key={'100001'}>游戏</Select.Option>
                                <Select.Option value={'100002'} key={'100002'}>动画</Select.Option>
                                <Select.Option value={'100003'} key={'100002'}>故事</Select.Option>
                            </Select>
                        </div>
                        <div><label>老师评语：</label>
                            <Input.TextArea value={evaluate_content}
                                            onChange={e => this.handleChange(e, 'evaluate_content')}/></div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default CheckModal;