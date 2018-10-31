import React from "react";
import "./BookListStyle/BookListStyle.less";
import { Layout, Menu } from "antd";
import { NavLink, Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";

const BookListComponent = Loadable({
  loader: () => import("../BookListComponent/BookListComponent"),
  loading: (props) => {
    return null;
  }
});

const BookDetailIndex = Loadable({
  loader: () => import("../BookOrderDetail/BookDetailIndex"),
  loading: (props) => {
    return null;
  }
});

export default class BookListIndex extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  };
  render() {
    return <Layout style={{ flexDirection: 'row' }}>
      <div style={{ width: "158px", display: "flex", flexDirection: "column", backgroundColor: "#edf1f7" }}>
        <Layout style={{ position: "fixed" }}>
          <Menu
            mode="inline"
            selectedKeys={["/admin/book_manage/book_list"]}
            style={{ height: '100%', width: 158, backgroundColor: "#edf1f7" }}
            className="menu-item-custom"
          >
            <Menu.Item key="/admin/book_manage/book_list">
              <NavLink to="/admin/book_manage/book_list">图书订单</NavLink>
            </Menu.Item>
          </Menu>
        </Layout>
      </div>
      <Switch>
        <Route path="/admin/book_manage/book_list" component={BookListComponent} />
        <Route path="/admin/book_manage/book_order_detail/:bookOrderId" component={BookDetailIndex} />
      </Switch>
    </Layout>
  }
};