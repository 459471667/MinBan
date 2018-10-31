import React from "react";
import {Button,Message,Pagination,Input,DatePicker,Select} from "antd"; 
import locale from 'antd/lib/date-picker/locale/zh_CN';
import "./BookListComponentStyle/BookListComponentStyle.less";
import {NavLink} from "react-router-dom"; 
import axios from "axios"; 

const Option=Select.Option;

export default class BookListComponent extends React.Component{
	constructor(props){
		super(props);
		this.state={
			bookList:"",
			totalCount:0,
			startValue: null,
    		endValue: null,
    		endOpen:false
		};
		this.handlePageSizeChange=this.handlePageSizeChange.bind(this);
		this.handleSearch=this.handleSearch.bind(this);
		this.selectAndConfirmTime=this.selectAndConfirmTime.bind(this);
		this.selectStatus=this.selectStatus.bind(this);
		this.disabledEndDate=this.disabledEndDate.bind(this);
		this.disabledStartDate=this.disabledStartDate.bind(this);
		this.onStartChange=this.onStartChange.bind(this);
		this.onEndChange=this.onEndChange.bind(this);
	}

	// 查询参数
	orderNumber="";
	status="";

	// 选择日期
	selectAndConfirmTime(flag,moment){
		if(!moment&&flag==="start"){
			this.buyTimeStart="";
			return;
		};
		if(!moment&&flag==="end"){
			this.buyTimeEnd="";
			return;
		};
		let timeValue=moment.format("YYYY-MM-DD HH:mm:ss");
		if(flag==="start")this.buyTimeStart=timeValue;
		if(flag==="end")this.buyTimeEnd=timeValue;		
	};

	// 选择状态
	selectStatus(statusValue){
		this.status=statusValue;
	};

	handleInputValue(key,event){
		let {target} =event;
		let {value} = target;
		this[key]=value;
	};

	jumpToDetail(id){
		const {history} = this.props;
		history.push("/admin/book_manage/book_detail/"+id+"");
	};

	// initial search
	initialSearch(paramObj){
		axios.post("/Eduunit/EduunitBooks/books_index",paramObj).then((result)=>{
			return result.data;
		}).then((result)=>{
			if(result.ret_code!=="0000000"){
				Message.error(result.ret_msg);
				return;
			}else{
				let {ret_data:data}=result;
				let totalCount=data.total;
				let bookList=(data.books||[]).map((dataObj)=>{
					dataObj.operation="详情";
					return dataObj;
				});
				this.setState({
					totalCount,
					bookList
				});
			}
		});
	}

	doSearch(pageIndex){

		const {
				orderNumber:doub_books_order_id,
				status:doub_books_order_status
			}=this;
		const {
				startValue:doub_books_order_pay_time_one,
				endValue:doub_books_order_pay_time_two
			}=this.state;
		const paramObj={
							doub_books_order_id,
							doub_books_order_pay_time_one,
							doub_books_order_pay_time_two,
							doub_books_order_status,
							token:window.localStorage.getItem("token"),
							page:pageIndex||1
						};
		paramObj.doub_books_order_pay_time_one=(paramObj.doub_books_order_pay_time_one===null)?"":
												paramObj.doub_books_order_pay_time_one.format("YYYY-MM-DD HH:mm:ss");
		paramObj.doub_books_order_pay_time_two=(doub_books_order_pay_time_two===null)?"":
												paramObj.doub_books_order_pay_time_two.format("YYYY-MM-DD HH:mm:ss");
		if(new Date(paramObj.doub_books_order_pay_time_two).getTime()<=new Date(paramObj.doub_books_order_pay_time_one).getTime()){
			Message.error("结束时间必须大于开始时间，亲，请重新选择!");
			return;
		};
		this.initialSearch(paramObj);
	}


	handlePageSizeChange(size){
		this.doSearch(parseInt(size));
	};

	handleSearch(){
		this.doSearch();
	};

	disabledStartDate(startValue){
		const endValue = this.state.endValue;
    	if (!startValue || !endValue) {
      		return false;
    	}
   		return startValue.valueOf() > endValue.valueOf();
	}

	disabledEndDate(endValue){
    		const startValue = this.state.startValue;
    		if (!endValue || !startValue) {
      			return false;
    		}
    		return endValue.valueOf() <= startValue.valueOf();
  	}

  	onChange(field, value){
    	this.setState({
      		[field]: value,
    	});
  	}

  	onStartChange(value){
    	this.onChange("startValue", value);
  	}

  	onEndChange(value){
    	this.onChange("endValue", value);
  	}

  	handleStartOpenChange = (open) => {
    		if (!open) {
      			this.setState({ endOpen: true });
    		}
  	}

   handleEndOpenChange = (open) => {
       this.setState({ endOpen: open });
   }

	componentDidMount(){
		this.doSearch();
	};

	render(){
		const {bookList,totalCount,startValue,endValue,endOpen} = this.state;
		const spanTageStyle={
			paddingRight:"10px",
			fontSize:"14px",
			fontFamily:"-webkit-body",
			verticalAlign:"middle"
		};
		const tableStyle={
			width:"100%",
			fontFamily:"-webkit-body"
		};
		const theadStyle={
			  backgroundColor:"#f1f1f1",
			  color:"#848282",
			  lineHeight:"29px",
			  fontSize:"13px !important"
		};
		const splitSimple={
			position:"relative",
			top:"6px",
			fontSize:"15px"
		};
		let  tableTdsOrInformation=void 0;
		if((bookList.length===0&&Array.isArray(bookList))){
			  tableTdsOrInformation=(<tr><td colSpan={10}>暂无数据!</td></tr>);
		}
		if(bookList.length>0&&Array.isArray(bookList)){
			  tableTdsOrInformation=bookList.map((dataObj)=>{
									 	const {doub_books_order_id,
									 			doub_books_my_sn,
									 		    doub_books_order_prices,
									 		    doub_books_order_pay_time,
									 		    doub_books_name,
									 		    doub_books_author,
									 		    user_name,
									 		    doub_books_type,
									 		    user_phone,
									 		    doub_books_order_status,
									 		    operation
									 		             }=dataObj;

									 	return (<tr key={doub_books_order_id}>
									 				<td>{doub_books_my_sn}</td>
									 				<td>{doub_books_order_prices}</td>
									 				<td>{doub_books_order_pay_time}</td>
									 				<td>{doub_books_name}</td>
									 				<td>{doub_books_author}</td>
									 				<td>{user_name}</td>
									 				<td>{doub_books_type}</td>
									 				<td>{user_phone}</td>
									 				<td>{doub_books_order_status}</td>
									 				<td>
									 					<NavLink
									 						to={"/admin/book_manage/book_order_detail/"+doub_books_order_id+""}
									 						className="span-to-detail">
									 						{operation}
									 					</NavLink>
									 				</td>
									 			</tr>);
									 });
		};
		const containerStyle={
			  paddingLeft:"20px",
			  paddingRight:"20px",
			  paddingBottom:"20px"	
		};
		return (<div style={{width:"77%",...containerStyle}}>
					<div className="flex-div-contain" style={{marginTop:"10px" }}>
						<label>
							<span style={spanTageStyle}>订单编号</span>
							<Input onChange={this.handleInputValue.bind(this,"orderNumber")}/>
						</label>
						<label>
							<span 
								style={spanTageStyle}>购买时间</span>
								<DatePicker
									style={{width:"159px"}}
									className="doubei-custom-define"
          							showTime
          							format="YYYY-MM-DD HH:mm:ss"
          							value={startValue}
          							placeholder="开始时间"
          							onChange={this.onStartChange}
          							onOpenChange={this.handleStartOpenChange}
        							/>
        						<span style={splitSimple}> ~ </span>
        						<DatePicker
        							className="doubei-custom-define"
        							style={{width:"159px"}}
          							disabledDate={this.disabledEndDate}
          							showTime
          							format="YYYY-MM-DD HH:mm:ss"
          							value={endValue}
          							placeholder="结束时间"
          							onChange={this.onEndChange}
          							open={endOpen}
          							onOpenChange={this.handleEndOpenChange}
        						/>
						</label>
						<label>
							<span style={{...spanTageStyle,verticalAlign:"initial"}}>状态</span>
							<Select 
								onChange={this.selectStatus}
								style={{width:"80px"}}
								defaultValue="" >
								<Option value="">全部</Option>
								<Option value="1">未发货</Option>
								<Option value="2">已发货</Option>
							</Select>
						</label>
						<Button
							onClick={this.handleSearch} 
							type="primary">查询</Button>
					</div>
					<div style={{marginTop:"20px"}} >
						<div>
							<table className="table-book-list" style={tableStyle}>
								<thead style={theadStyle}>
								  <tr>
								  	 <th>订单编号</th>
								  	 <th>订单总价</th>
								  	 <th>购买时间</th>
								  	 <th>书名</th>
								  	 <th>作者</th>
								  	 <th>购买人</th>
								  	 <th>类型</th>
								  	 <th>联系电话</th>
								  	 <th>状态</th>
								  	 <th>操作</th>
								  </tr>
								</thead>
								<tbody>
									 {tableTdsOrInformation}
								</tbody>
							</table>
						</div>
						<div style={{textAlign:"center",marginTop:"20px"}} >
							<Pagination 
								total={parseInt(totalCount)} 
								hideOnSinglePage={true}
								pageSize={10} 
								onChange={this.handlePageSizeChange} />
						</div>
					</div>
		        </div>);
	}
}