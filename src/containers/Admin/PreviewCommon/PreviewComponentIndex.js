import React from "react";
import {Button,Message} from "antd"; 


export default class PreviewComponentIndex extends React.PureComponent{
	constructor(props){
		super(props);
		this.goBack=this.goBack.bind(this);
		this.state={
			isPdfOrVideo:2,// 0 为pdf 1为视频 2为空
			pdfOrVideo:"",
			canvasContainBgStyle:"initial",
			buttonLoading:true,
			buttonText:"正在努力加载..."
		};
	}

	goBack(){
		const {history} = this.props;
		history.goBack();
	}

	// canvas draw img
	drawImg(imgSrc,cb){
		let _thisComponent=this;
		let canvas=document.getElementById("canvasImg");
		let cavnasContext=canvas.getContext("2d");
		var img = new Image();
		img.src = imgSrc;

		// pay attention 在使用canvas画图时，可以使用获取img的宽高
    	img.onload = function(){
    		canvas.width=1800;
    		canvas.height=1800*(this.height/this.width);
    		cavnasContext.drawImage(img,0,0,1800,1800*(this.height/this.width));
    		canvas.style.width="900px";
    		_thisComponent.setState({canvasContainBgStyle:"#777777"});
      		if(cb)cb();
      		_thisComponent.setState({buttonLoading:false,buttonText:"返回"});
    	};
    	img.onerror=()=>{
    		Message.error("图片加载出错!");
    		_thisComponent.setState({buttonLoading:false,buttonText:"返回"});
    	};

	};

	// 禁用contextmenu
	forbiddenAccessTheImg(){
		const domForbidden=document.getElementById("canvasImg").parentNode;
		domForbidden.oncontextmenu=(e)=>{
			e.preventDefault();
			return;
		};
	}

	// initialize video play
	initializeVideoPlay(playId){
        new window.YKU.Player('youkuplayer', {
            styleid: '0',
            client_id: '5afd675be4b081b107183b4b',
            vid: playId,

            events:{
                onPlayEnd: function(){
                },
            }
        });
        this.setState({buttonLoading:false,buttonText:"返回"});
	}

	componentDidMount(){
		const pdfOrVideo=window.localStorage.getItem("pdfOrVideo");
		if(!pdfOrVideo){
			this.setState({isPdfOrVideo:2});
			Message.error("图片或者视频地址不能为空");
			return;
		};
		if(pdfOrVideo.match(/\.jpg$|\.png$|.gif$|\.jpeg$/)){
			this.setState({isPdfOrVideo:0},()=>{
				this.drawImg(pdfOrVideo,this.forbiddenAccessTheImg);
			});
		  return;
		};
		// 视频播放
		this.setState({isPdfOrVideo:1,pdfOrVideo:pdfOrVideo},()=>{
			let playId=pdfOrVideo.match(/(id\_){1}[a-zA-Z-0-9]{1,}/g);
			if(playId&&playId[0]){
				playId=playId[0].split("_")[1];
				this.initializeVideoPlay(playId);
			}else{
				Message.error("视频地址不存在");
			};
		});
	}

	componentWillUnmount(){
		window.localStorage.removeItem("pdfOrVideo");
		window.localStorage.removeItem("sourceNameForTitle");
	}

	render(){
		const {isPdfOrVideo,pdfOrVideo,canvasContainBgStyle,buttonLoading,buttonText} = this.state;
		const sourceNameForTitle=window.localStorage.getItem("sourceNameForTitle");
		const canvasContainStyle={
			  width:"100%",
			  backgroundColor:canvasContainBgStyle,
			  paddingTop:"10px",
			  paddingBottom:"10px"
		};
		const canvasStyle={
			display:"block",
			margin:"0 auto"
		};
		const divContainer={
			width:"100%",
			position:"relative"
		};
		const titleStyle={
			fontSize:"14px",
			textAlign:"center",
			paddingBottom:"10px",
			width:"920px"
		};
		let videoOrPdf=(<div style={{width:"100%",textAlign:"center",fontSize:"14px"}}>
			视频或者图片地址不能为空
		</div>);
		if(isPdfOrVideo===0){
			videoOrPdf=(<div style={canvasContainStyle} >
				<canvas 
					width="0"
					height="0"
					style={canvasStyle} id="canvasImg"></canvas>
				</div>);
		};
		if(isPdfOrVideo===1){
			videoOrPdf=(
				<div>
					<h3 style={titleStyle}>{sourceNameForTitle}</h3>
					<div id="youkuplayer" style={{width:"920px",height: "452px"}}></div>
				</div>
				);
		}
		return (<div style={divContainer} >
					{videoOrPdf}
					<div style={{marginTop:"15px"}}>
						<Button 
							style={{backgroundColor:"#cccbcb",border:"solid .5px #cccbcb"}}
							loading={buttonLoading}
							onClick={this.goBack}
							type="primary">
							{buttonText}
						</Button>
					</div>
			   </div>);
	}
} 