import React from 'react';
import {Form, Layout} from 'antd';
import './ClassAdd.less';
import TeacherAddForm from "../../../components/Admin/TeacherAddForm";

class TeacherAdd extends React.Component {

    render() {
        const WrappedTeacherAddForm = Form.create()(TeacherAddForm);
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px"
        };
        return (
            <Layout className="class-add" style={containerStyle}>
                <h3>添加老师</h3>
                <WrappedTeacherAddForm/>
            </Layout>
        );
    }
}

export default TeacherAdd;
