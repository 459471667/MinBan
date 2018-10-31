import React from 'react';
import {Form, Layout, message} from 'antd';
import ClassEditForm from "../../../components/Admin/ClassEditForm";
import './ClassAdd.less';
import {$axios, navPage} from "../../../utils";

const WrappedCLassEditForm = Form.create({
    mapPropsToFields(props) {
        // 已经存在的数据渲染到form item
        return {
            grade_code: Form.createFormField({
                ...props.grade_code,
                value: props.grade_code,
            }), class_name: Form.createFormField({
                ...props.class_name,
                value: props.class_name,
            }), teacher_data: Form.createFormField({
                ...props.teacher_selected,
                value: props.teacher_selected,
            }), class_remarks: Form.createFormField({
                ...props.class_remarks,
                value: props.class_remarks,
            })
        };
    }
})(ClassEditForm);

class ClassEdit extends React.Component {

    class_id = '';
    state = {
        fields: {},
        teacher_data: [],
        teacher_selected: []
    };

    constructor(props) {
        super(props);
        this.class_id = this.props.match.params.class_id || '';
    }

    componentDidMount() {
        let params = {class_id: this.class_id};
        if (!this.class_id) {
            message.error('不存在的班级');
            navPage('/admin/school_manage/class_list');
            return;
        }
        $axios('/Eduunit/EduunitClass/class_info', params)
            .then(data => {
                if (!data) return;
                if (data.ret_code === '0000000') {
                    let teacher_selected = data.ret_data.teacher_data.map(item => {
                        return item.teacher_id;
                    });
                    this.setState({fields: data.ret_data.class_info});
                    this.setState({teacher_selected: teacher_selected});
                }
            });

        $axios('/Eduunit/EduunitClass/class_teacher', {teacher_name: ''})
            .then(data => {
                if (!data) return;
                if (data.ret_code === '0000000' && data.ret_data.teacher_list) {
                    this.setState({teacher_data: data.ret_data.teacher_list});
                }
            });
    }

    changeGrade = (value, code) => {
        let {fields} = this.state;
        this.setState({
            fields: Object.assign({}, fields, {grade_name: value, grade_code: code})
        });
    };

    render() {
        const {fields, teacher_data, teacher_selected} = this.state;
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px"
        };
        return (
            <Layout className="org-add" style={containerStyle} >
                <h3 style={{marginTop:"10px"}}>编辑班级</h3>
                <WrappedCLassEditForm onGradeChange={this.changeGrade} {...fields} teacher_selected={teacher_selected}
                                      teacher_data={teacher_data} class_id={this.class_id}/>
            </Layout>
        );
    }
}

export default ClassEdit;
