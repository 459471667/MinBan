import React from 'react';
import {Form, Layout} from 'antd';
import './ClassAdd.less';
import TeacherEditForm from "../../../components/Admin/TeacherEditForm";
import {$axios} from "../../../utils";

class TeacherEdit extends React.Component {

    state = {
        teacher_id: this.props.match.params.teacher_id,
        fields: {}
    };

    componentDidMount() {
        const teacher_id = this.props.match.params.teacher_id;
        $axios('/Eduunit/Teacher/teacherDetail', {teacher_id: teacher_id}).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                this.setState({fields: data.ret_data});
            }
        });
    }

    render() {
        const {fields, teacher_id} = this.state;
        const WrappedTeacherEditForm = Form.create({
            mapPropsToFields(props) {
                // 已经存在的数据渲染到form item
                return {
                    teacher_name: Form.createFormField({
                        ...props.teacher_name,
                        value: props.teacher_name,
                    }), teacher_sex: Form.createFormField({
                        ...props.teacher_sex,
                        value: props.teacher_sex,
                    }), teacher_phone: Form.createFormField({
                        ...props.teacher_phone,
                        value: props.teacher_phone,
                    }), teacher_remark: Form.createFormField({
                        ...props.teacher_remark,
                        value: props.teacher_remark,
                    })
                };
            }
        })(TeacherEditForm);
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px"
        };
        return (
            <Layout className="class-add" style={containerStyle}>
                <h3>编辑老师</h3>
                <WrappedTeacherEditForm {...fields} teacher_id={teacher_id}/>
            </Layout>
        );
    }
}

export default TeacherEdit;
