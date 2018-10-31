import React from 'react';
import {Button, Input, Layout, message, Select} from "antd";
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {Editor} from "react-draft-wysiwyg";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {$axios, navPage} from "../../../utils";
import axios from 'axios';

class NewsAdd extends React.Component {

    constructor(props) {
        super(props);
        const {news_id} = this.props.match.params;
        const contentBlock = htmlToDraft('');
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const news_content = EditorState.createWithContent(contentState);
        this.state = {
            news_id: news_id ? news_id : '',
            news_column_code: '000001',
            news_column_name: '最新资讯',
            news_title: '',
            hasContent: false,
            news_content,
        };
    }

    componentDidMount() {
        let {news_id} = this.state;
        if (news_id) {
            this.getNewsDetail(news_id);
        }
    }

    publishNews = () => {
        let {news_id, news_column_code, news_column_name, news_title, news_content} = this.state;
        let url = '';
        const content = draftToHtml(convertToRaw(news_content.getCurrentContent()));
        if (!news_column_code) {
            return;
        }
        if (!news_title) {
            return;
        }
        if (content.replace(/\s+/g, "") === "<p></p>") {
            this.setState({hasContent: false});
            return;
        }
        if (news_id) {
            url = '/Eduunit/EduunitNews/news_save';
        } else {
            url = '/Eduunit/EduunitNews/news_add';
        }
        $axios(url, {news_id, news_column_code, news_column_name, news_title, content})
            .then(data => {
                if (!data) return;
                if (data.ret_code === '0000000') {
                    navPage('/admin/news_manage/news_list');
                    message.success(data.ret_msg);
                }
            });
    };

    handleChange = (e, labelName) => {
        if (e.target) {
            this.setState({[labelName]: e.target.value});
        } else {
            this.setState({[labelName]: e});
        }
    };

    onEditorStateChange = (news_content) => {
        const content = draftToHtml(convertToRaw(news_content.getCurrentContent()));
        if (content.replace(/\s+/g, "") === "<p></p>") {
            this.setState({news_content, hasContent: false});
        } else {
            this.setState({news_content, hasContent: true});
        }
    };

    getNewsDetail = (news_id) => {
        $axios('/Eduunit/EduunitNews/news_info', {news_id}).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                let contentBlock = htmlToDraft(data.ret_data.news_info.news_content);
                let contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                let news_content = EditorState.createWithContent(contentState);
                this.setState({
                    news_column_code: data.ret_data.news_info.news_column_code,
                    news_column_name: data.ret_data.news_info.news_column_name,
                    news_title: data.ret_data.news_info.news_title,
                    hasContent: true,
                    news_content
                });
            }
        });
    };

    uploadImageCallBack = (file) => {
         const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        let fd = new FormData();
            fd.append('news_pic', file);
            fd.append("token",localStorage.getItem("token"));
            return new Promise((resolve,reject)=>{
                    // 封装地址前缀在此封装的方法中
                    axios.post('/Eduunit/EduunitNews/news_pic',fd,config).then((result) => {
                            result=result.data;
                            if (!result) return;
                            if (result.ret_code === '000000') {
                                    console.log(result.ret_data.pic_url);
                                    resolve({data:{link:result.ret_data.pic_url}});
                            }else{
                                    reject(result.ret_msg);
                            }
                });
            });
    };

    render() {
        let {news_column_code, news_column_name, news_title, hasContent, news_content} = this.state;
        return (
            <Layout>
                <Layout className="class-add">
                <h3>新建资讯</h3>
                <Layout className="news-body">
                    <div>
                        <label>所属栏目：</label>
                        <Select value={news_column_code} defaultValue="000001"
                                onChange={e => this.handleChange(e, 'news_column_code')}>
                            <Select.Option value={'000001'} key={'000001'}>{news_column_name}</Select.Option>
                        </Select>
                    </div>
                    <div className={!news_column_code ? "error-tip" : "hide"}>请选择所属栏目</div>
                    <div>
                        <label>标题：</label>
                        <Input value={news_title} onChange={e => this.handleChange(e, 'news_title')}
                               style={{width: '760px'}}/>
                    </div>
                    <div className={!news_title ? "error-tip" : 'hide'}>请输入标题</div>
                    <div>
                        <label>内容：</label>
                        <Editor
                            editorState={news_content}
                            toolbarClassName="rdw-storybook-toolbar"
                            wrapperClassName="rdw-storybook-wrapper"
                            editorClassName="rdw-storybook-editor"
                            localization={{locale: 'zh'}}
                            toolbar={{
                                image: {
                                        urlEnabled: true,
                                        uploadEnabled: true,
                                        alignmentEnabled: true,
                                        uploadCallback: this.uploadImageCallBack, 
                                        previewImage: true,
                                        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                                        defaultSize: {
                                            height: 'auto',
                                            width: 'auto',
                                        }
                                    }
                            }}
                            onEditorStateChange={this.onEditorStateChange}
                        />
                    </div>
                    <div className={!hasContent ? "error-tip" : "hide"}>请输入内容</div>
                    <div>
                        <Button type="primary" onClick={this.publishNews}>发布</Button>
                        <Button style={{marginLeft: '20px'}} className="btn-gray"
                                onClick={() => navPage('/admin/news_manage/news_list')}>返回</Button>
                    </div>
                </Layout>
            </Layout>
            </Layout>)
    }

}

export default NewsAdd;