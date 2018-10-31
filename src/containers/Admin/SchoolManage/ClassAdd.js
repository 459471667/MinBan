import React from 'react';
import {Form, Layout} from 'antd';
import './ClassAdd.less';
import {$axios} from "../../../utils";
import Loadable from "react-loadable";

const ClassAddForm=Loadable({
    loader: () => import("../../../components/Admin/ClassAddForm"),
    loading:(props)=>{
        return null;
    }
});

class ClassAdd extends React.Component {

    state = {
        teacher_data: []
    };

    componentDidMount() {
        $axios('/Eduunit/EduunitClass/class_teacher', {teacher_name: ''}).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                this.setState({teacher_data: data.ret_data.teacher_list});
            }
        });
    }

    render() {
        const WrappedClassAddForm = Form.create()(ClassAddForm);
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px"
        };
        return (
            <Layout className="class-add for-custom-define-antd-form-place-holder" style={containerStyle} >
                <h3>创建班级</h3>
                <WrappedClassAddForm teacher_data={this.state.teacher_data}/>
            </Layout>
        );
    }
}

export default ClassAdd;
