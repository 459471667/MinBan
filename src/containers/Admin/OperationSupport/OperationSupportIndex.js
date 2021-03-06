import React from "react";
import {Link} from "react-router-dom";
import "./OperationSupportStyle/OperationSupportStyle.less"; 
import {$axios} from "../../../utils";
import {Message} from "antd";

export default class OperationSupportIndex extends React.PureComponent{
	constructor(props){
		super(props);
		this.state={
			moduleOne:[],
			moduleTwo:[]
		};
		this.handleDownloadOrPreWatch=this.handleDownloadOrPreWatch.bind(this);
	}
	
	handleDownloadOrPreWatch(source){
		if(!source){
			Message.error("资源地址为空!");
			return;
		};
		if(source.indexOf("youku")<0&&!source.match(/\.jpg$|\.png$|\.gif$|\.jpeg$/))return;
		const {history} = this.props;
		history.push("/admin/teach_manage/common_preview_operation_support");
		window.localStorage.setItem("pdfOrVideo",source);
	}

	// make two demension
	makeTwoDemensionArr(arr){
		if(Object.prototype.toString.call(arr)!=="[object Array]"){
			throw new TypeError("arguments[0] must be an array");
		};
		if(arr.length===0)return arr;
		let dataContain=[];
		arr.forEach((elObj,index)=>{
			let _dataContain=void 0;
			if((index+1)%2===0){
				_dataContain=[arr[index-1],arr[index]];
				dataContain.push(_dataContain);
			}
			if(index%2===0&&arr[index+1]===void 0){
				_dataContain=[arr[index]];
				dataContain.push(_dataContain)
			}
		});
		return dataContain;
	};


	// 获取数据
	fetchData(){
			$axios('Eduunit/EduunitOperate/index', {token:window.localStorage.getItem("token")}).then(resp => {
				console.log(resp,"resp");
            	if (!resp) return;
            	if (resp.ret_code === '0000000') {
            		let result=resp.ret_data;
            		let moduleOne=this.makeTwoDemensionArr(result["operate_1"]);
            		let moduleTwo=this.makeTwoDemensionArr(result["operate_2"]);
            		this.setState({moduleOne,moduleTwo});
           	 	}else{
           	 		Message.error("请求发生错误!");
           	 	}
        	});
	}

	componentDidMount(){
		this.fetchData();
	}
	render(){
		const {moduleOne,moduleTwo,moduleThree} = this.state;
		const ContainerStyle={
			   width:"100%",
			   heiht:"100%",
			   backgroundColor:"white",
			   paddingLeft:"20px",
			   paddingRight:"20px",
			   paddingBottom:"20px"
		};
		const TitleStyle={
			   paddingLeft:"20px",
			   paddingTop:"10px",
			   paddingBottom:"10px",
			   width:"48%",
			   backgroundColor:"#f1f1f1",
			   cursor:"pointer"
		};
		const TitleContainer={
			display:"flex",
			justifyContent:"space-between"
		};
		const dataNoneStyle={
			textAlign:"center",
			color:"#c2c2c2",
			fontSize:"13px"
		};
		return (<div style={ContainerStyle} className="doubei-teacher-train" >
				   <div style={{marginTop:"10px"}}>
				   	 <h3 style={{paddingTop:"initial"}} >
				   	 	宣传素材
				   	 </h3>
				   	 <div>
				   	 	{moduleOne.length===0?<h4 style={dataNoneStyle} >暂无数据</h4>:moduleOne.map((elObj,index)=>{
				   	 		return (<div 
				   	 					className="title-contain-style"
				   	 					style={TitleContainer}
				   	 					key={index}>
				   	 					{elObj.map((dataObj)=>{
				   	 						let source=dataObj.operate_thumb||"";
				   	 						if(source.indexOf("youku")<0&&!source.match(/\.jpg$|\.png$|\.gif$|\.jpeg$/))
				   	 						return (<a
				   	 									key={dataObj.operate_id}
				   	 									style={TitleStyle} 
				   	 									href={source}
				   	 									className="doubei-teacher-train-cell">
				   	 									<span>{dataObj.operate_title}</span>
				   	 									<span>{dataObj.operate_add_time}</span>
				   	 								</a>)
				   	 						
				   	 						return (<div 
				   	 									key={dataObj.operate_id}
				   	 									style={TitleStyle} 
				   	 									onClick={this.handleDownloadOrPreWatch.bind(this,source)}
				   	 									className="doubei-teacher-train-cell">
				   	 									<span>{dataObj.operate_title}</span>
				   	 									<span>{dataObj.operate_add_time}</span>
				   	 								</div>)
				   	 					})}
				   	 				</div>)	
				   	 	})}
				   	 </div>
				   </div>
				   <div>
				   	 <h3>
				   	 	招生资料
				   	 </h3>
				   	 <div>
				   	 	{moduleTwo.length===0?<h4 style={dataNoneStyle}>暂无数据</h4>:moduleTwo.map((elObj,index)=>{
				   	 		return (<div 
				   	 					className="title-contain-style"
				   	 					style={TitleContainer}
				   	 					key={index}>
				   	 					{elObj.map((dataObj)=>{
				   	 						let source=dataObj.operate_thumb||"";
				   	 						if(source.indexOf("youku")<0&&!source.match(/\.jpg$|\.png$|\.gif$|\.jpeg$/))
				   	 						return (<a
				   	 									key={dataObj.train_id}
				   	 									style={TitleStyle} 
				   	 									href={source}
				   	 									className="doubei-teacher-train-cell">
				   	 									<span>{dataObj.operate_title}</span>
				   	 									<span>{dataObj.operate_add_time}</span>
				   	 								</a>)
				   	 						
				   	 						return (<div 
				   	 									key={dataObj.operate_id}
				   	 									style={TitleStyle} 
				   	 									onClick={this.handleDownloadOrPreWatch.bind(this,source)}
				   	 									className="doubei-teacher-train-cell">
				   	 									<span>{dataObj.operate_title}</span>
				   	 									<span>{dataObj.operate_add_time}</span>
				   	 								</div>)
				   	 					})}
				   	 				</div>)	
				   	 	})}
				   	 </div>
				   </div>
			    </div>);
	}
}  