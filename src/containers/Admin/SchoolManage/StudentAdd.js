import React from 'react';
import {Form, Layout} from 'antd';
import StudentAddForm from "../../../components/Admin/StudentAddForm";
import './ClassAdd.less';

class StudentAdd extends React.Component {

    render() {
        const WrappedStudentAddForm = Form.create()(StudentAddForm);
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px"
        };
        return (
            <Layout className="class-add" style={containerStyle} >
                <h3>添加学生</h3>
                <WrappedStudentAddForm/>
            </Layout>
        );
    }
}

export default StudentAdd;
