import React from "react";
import {Button,Message} from "antd"; 
import {NavLink} from "react-router-dom"; 
import axios from "axios"; 
import "./BookIndexStyle/BookDetailIndex.less"; 

export default class BookDetailIndex extends React.PureComponent{
	constructor(props){
		super(props);
		this.state={
		};
	}
	componentDidMount(){
		let {match} = this.props;
		let {bookOrderId}=match.params;
		console.log(bookOrderId);
		axios.post("/Eduunit/EduunitBooks/books_save",{doub_books_order_id:bookOrderId,token:window.localStorage.getItem("token")}).then((result)=>{
			return result.data||"";
		}).then((result)=>{
			if(!result){
				Message.error("暂时获取不到数据！");
				return;
			};
			if(result.ret_code!=="0000000"){
				Message.error(result.ret_msg);
			}else{
				let {ret_data:data} = result;
				this.setState(data);
			};
		});
	};

	render(){
		const {
			doub_books_order_id,
			doub_books_my_sn,
			doub_books_order_pay_time,
			doub_books_order_one_price,
			doub_books_order_num,
			doub_books_order_freight,
			doub_books_order_prices,
			doub_books_order_consignee,
			doub_books_order_consignee_phone,
			doub_books_order_address,
			doub_books_order_distribution_type,
			doub_books_order_status,
			doub_books_order_express_id,
			doub_books_order_express,
			doub_books_order_express_add_time,
			doub_books_name,
			doub_books_press,
			doub_books_author
		} = this.state;
		const mainContainerStyle={
			width:"60%"
		};
		const titleStyle={
			fontFamily:"-webkit-body"
		};
		const bodyContainerStyle={
			paddingLeft:"30px",
			boxSizing:"border-box"
		};
		const buttonContain={
			marginTop:"60px"
		};
		const containerStyle={
			  paddingLeft:"20px",
			  paddingRight:"20px",
			  paddingBottom:"20px"
		}
		return (<div style={Object.assign(mainContainerStyle, containerStyle)}>
					{/***详情主体****/}
					<div style={{marginTop:"10px"}}>
						<div className="doubei-book-order-detail">
							<h3 style={titleStyle}>
								订单信息
							</h3>
							<div style={bodyContainerStyle}>
								<table className="doubei-container-detail">
								<tbody>
									<tr>
										<td>订单编号：</td>
										<td>{doub_books_my_sn}</td>
										<td>购买时间：</td>
										<td>{doub_books_order_pay_time}</td>
									</tr>
									<tr>
										<td>单价：</td>
										<td>{doub_books_order_one_price}</td>
										<td>数量：</td>
										<td>{doub_books_order_num}</td>
									</tr>
									<tr>
										<td>快递费：</td>
										<td>{doub_books_order_freight}</td>
										<td>订单总价：</td>
										<td>{doub_books_order_prices}</td>
									</tr>
								</tbody>
								</table>
							</div>
						</div>
						<div className="doubei-book-order-detail">
							<h3 style={titleStyle}>
								收货信息
							</h3>
							<div style={bodyContainerStyle}>
								<table className="doubei-container-detail">
								<tbody>
									<tr>
										<td>收货人：</td>
										<td>{doub_books_order_consignee}</td>
										<td>联系电话：</td>
										<td>{doub_books_order_consignee_phone}</td>
									</tr>
									<tr>
										<td>收货地址：</td>
										<td>{doub_books_order_address}</td>
										<td>递送方式：</td>
										<td>{doub_books_order_distribution_type}</td>
									</tr>
									<tr>
										<td>状态：</td>
										<td>{doub_books_order_status}</td>
										<td>单号：</td>
										<td>{doub_books_order_express_id}</td>
									</tr>
									<tr>
										<td>快递公司：</td>
										<td>{doub_books_order_express}</td>
									</tr>
								</tbody>
								</table>
							</div>
						</div>
						<div className="doubei-book-order-detail">
							<h3 style={titleStyle}>
								书籍信息
							</h3>
							<div style={bodyContainerStyle}>
								<table className="doubei-container-detail">
								<tbody>
									<tr>
										<td>书籍名称：</td>
										<td>{doub_books_name}</td>
										<td>作者：</td>
										<td>{doub_books_author}</td>
									</tr>
									<tr>
										<td>出版社：</td>
										<td>{doub_books_press}</td>
										<td>单价：</td>
										<td>{doub_books_order_one_price}</td>
									</tr>
								</tbody>
								</table>
							</div>
						</div>
					</div>
					<div style={buttonContain}>
					<NavLink to="/admin/book_manage/book_list">
						<Button
							type="primary"
						>返回</Button>
					</NavLink>
					</div>
			    </div>);
	}
} 