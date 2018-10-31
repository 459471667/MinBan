import React from "react";
import {Input, message, Modal} from 'antd';
import './CheckModal.less';
import {$axios} from "../../utils";

class CheckModal extends React.Component {
    // 2未审核 1以通过 3未通过
    state = {
        ModalText: '作品审核',
        visible: false,
        confirmLoading: false,
        works_id: '',
        works_status: '',
        works_code: '',
        evaluate_content: ''
    };

    componentDidMount() {
        // todo:请求作品审核所有作品类型，请求已审核的信息
    }

    showModal = (works_id, works_status, code) => {
        this.setState({
            visible: true,
            works_id: works_id,
            works_status: works_status,
            works_code: code,
            evaluate_content: ''
        });
    };
    handleOk = () => {
        const {works_id, works_status, works_code, evaluate_content} = this.state;
        let params = {works_id, works_status, works_code, evaluate_content, test_status: 1};
        if (works_status === 1) {
            params = {works_id, evaluate_content, test_status: 1};
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
            if (!data) return;
            if (data.ret_code === '0000000') {
                this.setState({
                    visible: false,
                    confirmLoading: false,
                    works_id: '',
                    works_status: '',
                    works_code: '',
                    evaluate_content: ''
                });
                message.success(data.ret_msg);
            }
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
        const {visible, confirmLoading, evaluate_content} = this.state;
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