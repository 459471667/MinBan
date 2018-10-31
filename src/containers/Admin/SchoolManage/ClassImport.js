import React from 'react';
import {Button, Layout, message} from "antd";
import {navPage} from "../../../utils";
import axios from 'axios';
import "../index.css";
import PropTypes from "prop-types";

export default class ClassImport extends React.Component {
    static propTypes={
        location:PropTypes.object
    };
    constructor(props){
        super(props);
        this.state = {
            listUrl: '',
            titleText: '',
            downloadUrl: '',
            files: [],
            showError:false,
            showCommon:true,
            studentOrTeacherDataList:[]
        };
        this.handleUpload=this.handleUpload.bind(this);
        this.handleStudentOrTeacherDataList=this.handleStudentOrTeacherDataList.bind(this);
    };
    componentDidMount() {
        const type = this.props.location.pathname.split('/')[3];
        switch (type) {
            case 'class_import':
                this.setState({titleText: '班级',listUrl:"class_list"});
                break;
            case 'student_import':
                this.setState({titleText: '学生',listUrl:"student_list",downloadUrl:"http://hd.uonestem.com/Public/Excel/student.xlsx"});
                break;
            case 'teacher_import':
                this.setState({titleText: '老师',listUrl:"teacher_list",downloadUrl:"http://hd.uonestem.com/Public/Excel/teacher.xlsx"});
                break;
            default:
                break;
        };
    };
    handleUpload = () => {
        let type = this.props.location.pathname.split('/')[3];
        let {titleText,files} = this.state;
        let {history,match} = this.props;
        let urlMap={
            "学生":"/Eduunit/EduunitTeacher/student_upload",
            "老师":"/Eduunit/EduunitTeacher/upload"
        };
        let uplaodUrl=urlMap[titleText];
        let fd = new FormData();
        fd.append('type', this.props.location.pathname.split('/')[3]);
        fd.append('name', files[files.length - 1]);
        fd.append("token",localStorage.getItem("token"));    
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        axios.post(uplaodUrl,fd, config).then(resp => {
            this.setState({files: []});
            this.refs["excelFile"].value="";
            let {data} = resp;
            if (resp.data.ret_code === '0000000') {
                message.success(resp.data.ret_msg);
            } else if(resp.data.ret_code === '6011'){
                message.error("导入的数据不能超过500条!");
            }else {
                this.setState({showError:!0,showCommon:!0,studentOrTeacherDataList:this.handleStudentOrTeacherDataList(data["ret_data"]||[],type)||[]});
                message.error(data["ret_msg"]||"ops,发生了一些错误!");
            }
        }).catch(error => {
            this.refs["excelFile"].value="";
            message.error(error);
        });
    };

    handleExcelChange = (e) => {
        let {target}=e;
        if(target.hasAttribute("data-specify")){
            this.setState({showCommon:false,files:target.files});
        }else{
            this.setState({files: target.files});
        };
    };

    // 同质化studentOrTeacherDataListh
    handleStudentOrTeacherDataList(data,type){
        if(Object.prototype.toString.call(data)!=="[object Array]"){
            throw new TypeError("argument[0] must be an array");
        };
        let numMap={
            "student_import":7,
            "teacher_import":5
        };
        let num=numMap[type];
        data=data.map((dataObj)=>{
                        let keys=Object.keys(dataObj);
                        let obj={};
                        let errorValue=dataObj["data_msg"];
                        let randomKey = Math.random().toString(36).slice(2);
                        if(keys.length<num){
                                keys.forEach((key)=>{
                                        if(key!=="data_msg")obj[key]=(dataObj[key]===null?"空":dataObj[key]);
                                    });
                                for(let i =keys.length-1;i<num-1;i++){
                                        let randomKey = Math.random().toString(36).slice(2);
                                        obj[randomKey]="空";
                                };
                                obj["data_msg"]=errorValue;
                                return obj;
                        };
                
                        if(keys.length>num){
                            keys.forEach((key,index)=>{
                                if(key!=="data_msg"&&index<(num-1))obj[key]=(dataObj[key]===null?"空":dataObj[key]);
                                if(index===(num-1))obj["data_msg"]=dataObj["data_msg"]
                            });
                            return obj;
                        };
                         for(let _key in dataObj){
                            if(dataObj[_key]===null)dataObj[_key]="空";
                         };
                        dataObj["_key"]=randomKey;
                        return dataObj;
            });
        return data;
    };

    render() {
        const {studentOrTeacherDataList,files, titleText, listUrl, downloadUrl,showCommon} = this.state;
        const colorRed={
            color:"red"
        };
        const borderTd={
            border:"1px solid black"
        };
        const type = this.props.location.pathname.split('/')[3];

        // studentOrTeacherDataList 进行同质化处理

        const styleMap={
            student_import:"559px",
            teacher_import:"420px"
        };

        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px"
        };

        const trMap={
            student_import:(<tr>
                                    <td>姓名</td>
                                    <td>性别</td>
                                    <td>学号</td>
                                    <td>手机</td>
                                    <td>班级</td>
                                    <td>备注</td>
                                    <td>结果</td>
                                </tr>),
            teacher_import:(<tr>
                                    <td>姓名</td>
                                    <td>性别</td>
                                    <td>手机</td>
                                    <td>备注</td>
                                    <td>结果</td>
                                </tr>)
        };
        let labelBtnStyle={
            display:"inlineBlock",
            borderRadius:"3px",
            backgroundColor:"#0074c5",
            padding:"3px 10px",
            color:"white",
            lineHeight:"23px",
            height:"28px",
            marginRight:"20px",
            cursor:"pointer"
        };
        let errorTr=trMap[type];
        let tableWidth=styleMap[type];
        let importStudent=(<Layout className="btn-group">
                                <label style={labelBtnStyle} htmlFor="importBtnFile" className={!files.length?"show":"hide"}>
                                    上传模板
                                    <input  id="importBtnFile" accept=".xlsx" ref="excelFile" type="file" onChange={this.handleExcelChange} style={{display: 'none'}}/>
                                </label>
                                <Button type="primary" 
                                        className={files.length ? 'show' : 'hide'} 
                                        onClick={this.handleUpload}>保存</Button>
                                 <Button 
                                        className="btn-gray" 
                                        onClick={() => navPage(`/admin/school_manage/${listUrl}`)}>返回</Button>
                           </Layout>);
        let errorCommon=(<div>
                            <dd style={colorRed}>导入失败！请根据以下提示重新修改和导入!</dd>
                            <table className="table-error" style={{width:tableWidth}}>
                            <tbody>
                                {errorTr}
                                {studentOrTeacherDataList.map((dataEl,index)=>{
                                    let dataObjKeys=Object.keys(dataEl);
                                    return (<tr key={dataEl["_key"]}>
                                                {dataObjKeys.map((_key)=>{
                                                    if(_key==="_key")return null;
                                                    if(_key==="data_msg")return (<td style={colorRed} key={_key}>{dataEl["data_msg"]}</td>)
                                                    return (<td key={_key}>{dataEl[_key]}</td>)
                                                })}
                                            </tr>)
                                })}
                            </tbody>
                            </table>
                        </div>);

        let errorDisplay=(<Layout>
                {showCommon?errorCommon:null}
                <Layout className="btn-group">
                    <label htmlFor="importBtnFile" className={!files.length?"show":"hide"} style={labelBtnStyle}>
                        重新上传模板
                        <input id="importBtnFile" accept=".xlsx" ref="excelFile" type="file" data-specify onChange={this.handleExcelChange} style={{display: 'none'}}/>
                    </label>
                    <Button type="primary" className={files.length ? 'show' : 'hide'}
                            onClick={this.handleUpload}>保存</Button>
                    <Button className="btn-gray" onClick={() => navPage(`/admin/school_manage/${listUrl}`)}>返回</Button>
                </Layout>
                </Layout>);

        return (<Layout className="class-import" style={{overflowY:"hidden",...containerStyle}}>
                <h3>导入{titleText}</h3>
                <ul style={{paddingBottom:0}}>
                    <li>第一步： 下载模板<a href={downloadUrl}>点击下载</a></li>
                    <li>第二步： 按照要求在模板内填入{titleText}信息</li>
                    <li>第三步： 上传已填写完成的模板</li>
                    <li>第四步： 点击保存，导入完成</li>
                </ul>
                    {(files.length-1)>=0?<div style={colorRed}>上传成功，点击保存即可完成导入!</div>:null}
                    {this.state.showError?errorDisplay:importStudent}
                </Layout>);
    }
};