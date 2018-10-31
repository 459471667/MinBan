import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Button, Layout, message, Popconfirm, Table, Tree} from "antd";
import {$axios, navPage} from "../../../utils";
import './OrgList.less';

const {Sider, Content} = Layout;
const TreeNode = Tree.TreeNode;

class OrgList extends Component {

    state = {
        tableData: [],
        treeRoot: [],
        subTree1: [],
        subTree2: [],
        total: 0
    };

    treeRoot = [];
    subTree1 = [];
    subTree2 = [];

    componentDidMount() {
        $axios('/Eduunit/Organization/index', {user_id: '', page: 0}).then(resp => {
            if (!resp) return;
            if (resp.ret_code === '0000000') {
                this.renderTree(resp.ret_data.tree_list);
                this.setState({tableData: resp.ret_data.user_list, total: resp.ret_data.total});
            }
        });
    }

    onSelect = (selectedKeys, info) => {
        this.getOrgList(selectedKeys[0], 0);
    };

    onPageChange = (pageNumber) => {
        this.setState({page: pageNumber});
        this.getOrgList(this.state.user_id, pageNumber);
    };

    /**
     * 根据user_id删除单位
     * @param user_id
     */
    confirmDelete = (user_id) => {
        $axios('/Eduunit/Organization/orgDelete', {user_id: user_id}).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                this.renderTree(data.ret_data.tree_list);
                this.getOrgList({user_id: this.state.user_id, page: this.state.page});
                message.success(data.ret_msg);
            }
        });
    };

    getOrgList = (user_id, page) => {
        $axios('/Eduunit/Organization/index', {user_id, page}).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                this.setState({tableData: data.ret_data.user_list});
                this.setState({total: parseInt(data.ret_data.total, 10)});
            } else if (data.ret_code === '6003') {
                this.setState({tableData: []});
            }
        })
    };

    render() {
        let {treeRoot, tableData, total} = this.state;
        tableData = tableData.map((item, index) => {
            return Object.assign({...item, key: index});
        });
        return (
            <Layout>
                <Layout>
                    <Layout style={{position:"fixed"}}>
                    <Sider className="tree-container">
                        <div className="tree-title">单位</div>
                        <Tree
                            showLine
                            defaultExpandedKeys={['0-0-0']}
                            onSelect={this.onSelect}
                            className="tree-body"
                        >
                            {treeRoot}
                        </Tree>
                    </Sider> 
                </Layout>
                </Layout>
                <Content className="org-content" style={{marginLeft:"240px"}}>
                    <div className="top-btn-group">
                        <Button type="primary" onClick={() => navPage('/admin/org_manage/org_add')}>添加单位</Button>
                    </div>
                    <div className="table-container">
                        <Table columns={this.columns} dataSource={tableData}
                               pagination={{
                                   showQuickJumper: true,
                                   onChange: this.onPageChange,
                                   defaultPageSize: 10,
                                   total: total
                               }}/>
                    </div>
                </Content>
            </Layout>
        );
    }

    renderTree = (tree_list) => {
        let tree = [];
        // 将json数据格式化位树形结构
        for (let d = 0; d < tree_list.length; d++) {
            if (tree_list[d].sort === 0) {
                tree = tree_list.filter((item) => {
                    return item.sort === 0;
                });
            } else {
                for (let tItem of tree) {
                    tItem.children = tree_list.filter((item) => {
                        return item.user_f_id === tItem.user_id;
                    });
                    for (let leaf of tItem.children) {
                        leaf.children = tree_list.filter((item) => {
                            return item.user_f_id === leaf.user_id;
                        });
                    }
                }
            }
        }

        // 渲染tree
        this.treeRoot = tree.map(itemL1 => {
            this.subTree1[itemL1.user_id] = itemL1.children ?
                itemL1.children.map(itemL2 => {
                    this.subTree2[itemL2.user_id] = itemL2.children ?
                        itemL2.children.map(itemL3 => (
                                <TreeNode title={itemL3.user_unit_name} key={itemL3.user_id}/>
                            )
                        ) : [];
                    this.setState({subTree2: this.subTree2});
                    return (
                        <TreeNode key={itemL2.user_id} title={itemL2.user_unit_name}>
                            {this.state.subTree2[itemL2.user_id]}
                        </TreeNode>
                    );
                }) : [];
            this.setState({subTree1: this.subTree1});
            return (
                <TreeNode key={itemL1.user_id} title={itemL1.user_unit_name}>
                    {this.state.subTree1[itemL1.user_id]}
                </TreeNode>
            );
        });
        this.setState({treeRoot: this.treeRoot});
    };

    columns = [{
        title: '单位名称',
        width: '185px',
        dataIndex: 'user_unit_name',
        key: 'user_unit_name',
    }, {
        title: '单位编号',
        width: '156px',
        dataIndex: 'user_no',
        key: 'user_no',
    }, {
        title: '单位类型',
        width: '122px',
        dataIndex: 'user_type',
        key: 'user_type',
    }, {
        title: '创建时间',
        width: '170px',
        dataIndex: 'user_add_time',
        key: 'user_add_time',
    }, {
        title: '操作',
        width: '130px',
        key: 'action',
        render: (text, record) => {
            if (parseInt(record.status, 10) === 1) {
                return (
                    <span>
                        <Link to={`/admin/org_manage/org_edit/${record.user_id}`}>编辑</Link>
                        <Popconfirm title="确定要删除吗?" onConfirm={() => this.confirmDelete(record.user_id)}>
                            <Link to="#">删除</Link>
                        </Popconfirm>
                    </span>
                );
            } else if (parseInt(record.status, 10) === 0) {
                return (
                    <span>
                        <Link to={`/admin/org_manage/org_detail/${record.user_id}`}>详情</Link>
                    </span>
                );
            }
        }
    }];
}

export default OrgList;
