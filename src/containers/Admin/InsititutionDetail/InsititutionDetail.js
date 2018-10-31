import React from "react";
import { Layout, Button } from "antd";
import { NavLink } from "react-router-dom";
import "./InsititutionStyle/InsititutionLess.less";
import { $axios } from "../../../utils";
import { Message } from "antd";
export default class InsititutionDetail extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
		};
		this.fetchData = this.fetchData.bind(this);
	}
	fetchData() {
		$axios("/Eduunit/EduunitUnituser/user_update").then((result) => {
			if (!result) return;
			if (result.ret_code === "0000000") {
				console.log(result.ret_data, "this is request data");
				this.setState({ ...result.ret_data });
			} else {
				Message.error(result.ret_msg);
			}
		});
	}
	componentDidMount() {
		this.fetchData();
	}
	render() {
		const tableStyle = {
			width: "100%"
		};
		const expiresDisplayModuleStyle = {
			display: "inline-block",
			fontWeight: "600",
			marginLeft: "300px",
			fontFamily: "monospace"
		};
		const { user_province_name,
			user_city_name,
			user_expire_time: user_expires_time,
			user_district_name,
			user_street_name,
			user_identity_one,
			user_identity_two,
			user_store_one,
			user_store_two,
			user_store_three } = this.state;

		let certificates = [user_identity_one, user_identity_two].filter((el) => {
			return el !== undefined && el !== null;
		});

		let storePics = [user_store_one, user_store_two, user_store_three].filter((elObj) => {
			return elObj !== undefined && elObj !== null;
		});
		const containerStyle={
			  paddingLeft:"20px",
			  paddingRight:"20px"	
		};

		return (<Layout className="org-add custom-define-style" style={{ width: "350px",...containerStyle}} >
			<div className="doubei-org-detail-nav-bar" style={{marginTop:"10px"}} >
				<span>机构信息</span>
				<NavLink
					to="/admin/org_set/institution_set" style={{ marginLeft: "20px" }}>
					<Button type="primary">
						编辑
							</Button>
				</NavLink>
				{/* 加了一个过期时间 */}
				{!user_expires_time ? null : <div
					style={expiresDisplayModuleStyle}
				>机构账号到期时间:{user_expires_time}</div>}
			</div>
			{/***table区域***/}
			<table style={tableStyle} className="doubei-table-style">
				<tbody>
					<tr>
						<td>入驻时间:</td>
						<td>{this.state.user_add_time}</td>
					</tr>
					<tr>
						<td>审核时间:</td>
						<td>{this.state.user_examine_time}</td>
					</tr>
					<tr>
						<td>机构名称:</td>
						<td>{this.state.user_unit_name}</td>
					</tr>
					<tr>
						<td>所在地区:</td>
						<td>{user_province_name}{user_city_name}{user_district_name}{user_street_name}</td>
					</tr>
					<tr>
						<td>机构地址:</td>
						<td>{this.state.user_addr}</td>
					</tr>
					<tr>
						<td>联系人:</td>
						<td>{this.state.user_person}</td>
					</tr>
					<tr>
						<td>手机:</td>
						<td>{this.state.user_phone}</td>
					</tr>
					<tr>
						<td>营业执照照片:</td>
						<td>
							{this.state.user_business ? <div>
								<img alt="_picture is missing" src={this.state.user_business} />
							</div> : null}
						</td>
					</tr>
					<tr>
						<td>身份证照片:</td>
						<td>{certificates.map((picSrc) => {
							return (<div key={picSrc}>
								<img alt="_picture is missing"  src={picSrc} />
							</div>)
						})}</td>
					</tr>
					<tr>
						<td>门店照片:</td>
						<td>{storePics.map((picSrc) => {
							return (<div key={picSrc}>
								<img alt="_picture is missing" src={picSrc} />
							</div>)
						})}</td>
					</tr>
				</tbody>
			</table>
		</Layout>)
	}
} 