import React from "react";
import { Form, Icon, Input, Button, Upload,Layout,Modal,Message,Cascader,DatePicker} from 'antd';
import {$axios} from '../../../../utils';
import "../InsititutionStyle/InsititutionLess.less";
import {NavLink} from "react-router-dom"; 
import locale from 'antd/lib/date-picker/locale/zh_CN';
import axios from "axios"; 
import moment from 'moment';
const FormItem = Form.Item;
const devPrefixTwo=(()=>{
	   let {href}=window.location;
	   	if(href.indexOf("localhost")>=0)
	   	 	return "http://localhost:8080/index.php";
	   	if(href.indexOf("testuone")>=0)
	   		return "http://uone.doubei.com/index.php";
	   	if(href.indexOf("teacher")>=0)
	   		return "http://www.uonestem.com/index.php"
})();
class InisititionSetEdit extends React.PureComponent{
	constructor(props){
		super(props);
		this.state={
			addr:"",
			loc_options: [],
			certificateAntiSrc:"",
			certificateAntiSrcFront:"",
			businessLicensePicSrc:"",
			loadingBusiness:false,
			loadingCertificateOne:false,
			loadingCertificateTwo:false,
			loadingOne:false,
			loadingTwo:false,
			loadingThree:false,
			businessErrorText:" ",
			storePicLoadingOne:false,
			storePicLoadingTwo:false,
			storePicLoadingThree:false,
			storePicSrcOne:"",
			storePicSrcTwo:"",
			storePicSrcThree:"",
		};
		this.handleSubmit=this.handleSubmit.bind(this);
		this.abordSubmit=this.abordSubmit.bind(this);
		this.handleCertificateImgChange=this.handleCertificateImgChange.bind(this);
		this.handleCertificateImgChangeFront=this.handleCertificateImgChangeFront.bind(this);
		this.handleBusinessPicChange=this.handleBusinessPicChange.bind(this);
		this.handleStorePicUploadOne=this.handleStorePicUploadOne.bind(this);
		this.handleStorePicUploadTwo=this.handleStorePicUploadTwo.bind(this);
		this.handleStorePicUploadThree=this.handleStorePicUploadThree.bind(this);
		this.loadLocationData=this.loadLocationData.bind(this);
		this.onLocationChange=this.onLocationChange.bind(this);
		this.getLocationData=this.getLocationData.bind(this);
		this.handleDatePickerChange=this.handleDatePickerChange.bind(this);
		this.handleFetchOk=this.handleFetchOk.bind(this);
		this.handleTimeBug=this.handleTimeBug.bind(this);
	}

	// 处理antd的bug
	// 营业执照照片
	certificatePics=[{frontPic:""},{backPic:""}];

	// 门店照片
	storePics=[{storePicOne:""},{storePicTwo:""},{storePicThree:""}];

	selectedLoc={};

	// 地区参数
	locationParams={};

	// 处理时间对接造成的bug
	handleTimeBug(){
		const {form} = this.props;
		const { user_add_time, user_edit_time, user_examine_time} = this.state;
		const fieldsValue = { 
			registerTime: moment(user_add_time ? user_add_time : "2018-00-00 00:00:00", 'YYYY-MM-DD HH:mm:ss'),
			examineTime: moment(user_examine_time ? user_examine_time : "2018-00-00 00:00:00", 'YYYY-MM-DD HH:mm:ss')
		 }
		form.setFieldsValue(fieldsValue);
	}

	fetchData(){
		let {form} = this.props;
		return new Promise((resolve,reject)=>{
				$axios("/Eduunit/EduunitUnituser/user_update").then((result)=>{
						if(!result)return;
						if(result.ret_code==="0000000"){
						this.setState((prevState)=>{
							return Object.assign(prevState,result.ret_data);
						},()=>{
								this.setState({
										addr:result.ret_data["user_addr"],
										businessLicensePicSrc:result.ret_data["user_business"],
										certificateAntiSrc:result.ret_data["user_identity_one"],
										certificateAntiSrcFront:result.ret_data["user_identity_two"],
										storePicSrcOne:result.ret_data["user_store_one"],
										storePicSrcTwo:result.ret_data["user_store_two"],
										storePicSrcThree:result.ret_data["user_store_three"],
								},()=>{
									// 处理time初始化造成的Bug
									this.handleTimeBug();
									// 初始化对接图片
									const {businessLicensePicSrc,storePicSrcOne,storePicSrcTwo,storePicSrcThree,certificateAntiSrc,certificateAntiSrcFront}=this.state;
									this.storePics=[
											{storePicOne:storePicSrcOne},
											{storePicTwo:storePicSrcTwo},
											{storePicThree:storePicSrcThree},
										];
									this.certificatePics=[{frontPic:certificateAntiSrc},{backPic:certificateAntiSrcFront}];
									// 地址对接
									this.locationParams={
										  user_province_name:result.ret_data["user_province_name"],
										  user_province_code:result.ret_data["user_province_code"],
										  user_city_name:result.ret_data["user_city_name"],
										  user_city_code:result.ret_data["user_city_code"],
										  user_district_name:result.ret_data["user_district_name"],
										  user_district_code:result.ret_data["user_district_code"],
										  user_street_name:result.ret_data["user_street_name"],
										  user_street_code:result.ret_data["user_street_code"]
									};
									form.setFieldsValue({
											storePics:this.checkStorePicks(this.storePics),
											certificatePics:this.checkCerticatePicks(this.certificatePics),
											businessPic:businessLicensePicSrc
										});
								});
								resolve([0,
											result.ret_data["user_province_code"],
											result.ret_data["user_city_code"],
											result.ret_data["user_district_code"]
										]);
							});
						}else{
								Message.error(result.ret_msg);
								reject(result.ret_msg);
						}
				});

		});
	}

	// 组件初始化的时候加载所有的地区数据，和获取的省，市，地区，和街道进行匹配
	// 注意拿来匹配的值是value 
	displayAreaData(areaCodeArr){
			console.log(areaCodeArr,"areaCodeArr");
            axios.all([this.getLocationData(areaCodeArr[0]), this.getLocationData(areaCodeArr[1]),
                this.getLocationData(areaCodeArr[2]), this.getLocationData(areaCodeArr[3])])
                .then(axios.spread((loc0, loc1, loc2, loc3) => {
                        if (loc0.data.status === 0) {
                            let options = [];
                            let options1 = [];
                            let options2 = [];
                            let options3 = [];
                            for (let item3 of loc3.data.data.area) {
                                let {area_code: value, area_name: label, ...rest} = item3;
                                options3.push({value, label, isLeaf: true, rest});
                            }
                            for (let item2 of loc2.data.data.area) {
                                let {area_code: value, area_name: label, ...rest} = item2;
                                if (areaCodeArr[3] === value) {
                                    options2.push({value, label, children: [...options3], isLeaf: false, rest});
                                } else {
                                    options2.push({value, label, isLeaf: false, rest});
                                }
                            }
                            for (let item1 of loc1.data.data.area) {
                                let {area_code: value, area_name: label, ...rest} = item1;
                                if (areaCodeArr[2] === value) {
                                    options1.push({value, label, children: [...options2], isLeaf: false, rest});
                                } else {
                                    options1.push({value, label, isLeaf: false, rest});
                                }
                            }
                            for (let item0 of loc0.data.data.area) {
                                let {area_code: value, area_name: label, ...rest} = item0;
                                if (areaCodeArr[1] === value) {
                                    options.push({value, label, children: [...options1], isLeaf: false, rest});
                                } else {
                                    options.push({value, label, isLeaf: false, rest});
                                }
                            }
                            this.setState({loc_options: options});
                        }
                    })
                );
	}

	abordSubmit(proxyObj){
		proxyObj.preventDefault();
		const {history} = this.props;
		history.push("/admin/org_manage/org_list");
	}

	checkCerticatePicks(certificatePics){
		return certificatePics.some((elObj)=>{
			return elObj[Object.keys(elObj)[0]]==="";
		})?undefined:certificatePics;
	}

	checkStorePicks(storePics){
		return storePics.every((elObj)=>{
			return elObj[Object.keys(elObj)[0]]==="";
		})?undefined:storePics;
	}

	fetchParametes(fieldsValue){
        	let _dataParam={};
        			_dataParam["user_examine_time"]=fieldsValue["registerTime"];
        			_dataParam["user_unit_name"]=fieldsValue["insititutionName"];
        			_dataParam["user_person"]=fieldsValue["linkMan"];
        			_dataParam["user_phone"]=fieldsValue["phone"];
        			_dataParam["user_addr"]=fieldsValue["addr"];
        			_dataParam["user_business"]=fieldsValue["businessPic"];
        			_dataParam["user_identity_one"]=fieldsValue["certificatePics"][0]["frontPic"];
        			_dataParam["user_identity_two"]=fieldsValue["certificatePics"][1]["backPic"];
        			_dataParam["user_store_one"]=fieldsValue["storePics"][0]["storePicOne"];
        			_dataParam["user_store_two"]=fieldsValue["storePics"][1]["storePicTwo"];
        			_dataParam["user_store_three"]=fieldsValue["storePics"][2]["storePicThree"];
        			_dataParam=Object.assign(_dataParam,this.locationParams);
            return _dataParam;
	}

	summarySubmit(params){
		const {history} =this.props;
		$axios("/Eduunit/EduunitUnituser/user_save",{...params}).then((result)=>{
			console.log(result,"this is result");
			if(result.ret_code="0000000"){
				Message.success("保存成功");
				history.push("/admin/org_set/institution_detail")
			}else{
				Message.error(result.ret_msg);
			}
		});
	}

	handleSubmit(proxyObj){
		proxyObj.persist();
		proxyObj.preventDefault();
		let fieldsValue=this.props.form.getFieldsValue();
		// 获取form表单全部的值
		let {businessPic} = fieldsValue;
		if(!businessPic||businessPic.trim()===""){
			// 处理antd form表单的bug
			console.log(this.props.form.getFieldsValue());
			this.setState({businessErrorText:"请上传营业执照"},()=>{
				this.props.form.validateFields((err, fieldsValue) => {
      				if(Object.keys(fieldsValue).some((key)=>{
						return  !fieldsValue[key];
					})){
						Message.error("请根据信息重新填写或上传。");
						return;
					}
        			fieldsValue={...fieldsValue,
        							registerTime:fieldsValue["registerTime"].format('YYYY-MM-DD HH:mm:ss'),
        							examineTime:fieldsValue["examineTime"].format('YYYY-MM-DD HH:mm:ss')
        					    }
        			console.log(this.fetchParametes(fieldsValue),"this is values");
        			this.summarySubmit(this.fetchParametes(fieldsValue));
        			return;
    			});
			});
		}else{
			this.props.form.validateFields((err, fieldsValue) => {
      			if(Object.keys(fieldsValue).some((key)=>{
						return  !fieldsValue[key];
					})){
						Message.error("请根据信息重新填写或上传。");
						return;
					}
      				fieldsValue={...fieldsValue,
        							registerTime:fieldsValue["registerTime"].format('YYYY-MM-DD HH:mm:ss'),
        							examineTime:fieldsValue["examineTime"].format('YYYY-MM-DD HH:mm:ss')
        					    }
        		    console.log(this.fetchParametes(fieldsValue),"this is values");
        			this.summarySubmit(this.fetchParametes(fieldsValue));
    		});
		}
	}

	fetchBusinessPic(e){
		let {fileList} = e;
		if(fileList[0]&&fileList[0]["response"]){
			let picUrl=fileList[0]["response"]["ret_data"];
			return picUrl;
		};
		return "";
	}

	handleCertificateImgChangeFront(fileData){
		if (fileData.file.status === 'uploading') {
      		this.setState({ loadingCertificateOne: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.certificatePics[1]=Object.assign(
				this.certificatePics[1],
				{backPic:response.ret_data}
			);
			this.props.form.setFieldsValue({certificatePics:this.checkCerticatePicks(this.certificatePics)});
			this.setState({certificateAntiSrcFront:response.ret_data});
		}

	}

	handleCertificateImgChange(fileData){
		if (fileData.file.status === 'uploading') {
      		this.setState({ loadingCertificateTwo: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.certificatePics[0]=Object.assign(
				this.certificatePics[0],
				{frontPic:response.ret_data}
			);
			this.props.form.setFieldsValue({certificatePics:this.checkCerticatePicks(this.certificatePics)});
			this.setState({certificateAntiSrc:response.ret_data});
		}
	}
	// 处理上传的bug
	handleBusinessPicChange(fileData){
		this.setState({businessErrorText:" "});
		if (fileData.file.status === 'uploading') {
      		this.setState({ loadingBusiness: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.setState({businessLicensePicSrc:response.ret_data});
		}
	}

	// 门店上传
	handleStorePicUploadOne(fileData){
		if (fileData.file.status === 'uploading') {
      		this.setState({ storePicLoadingOne: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.storePics[0]=Object.assign(
				this.storePics[0],
				{storePicOne:response.ret_data}
			);
			this.props.form.setFieldsValue({storePics:this.checkStorePicks(this.storePics)});
			this.setState({storePicSrcOne:response.ret_data});
		}
	}

	handleStorePicUploadTwo(fileData){
		if (fileData.file.status === 'uploading') {
      		this.setState({ storePicLoadingTwo: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.storePics[1]=Object.assign(
				this.storePics[1],
				{storePicTwo:response.ret_data}
			);
			this.props.form.setFieldsValue({storePics:this.checkStorePicks(this.storePics)});
			this.setState({storePicSrcTwo:response.ret_data});
		}
	}

	handleStorePicUploadThree(fileData){
		if (fileData.file.status === 'uploading') {
      		this.setState({ storePicLoadingThree: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.storePics[2]=Object.assign(
				this.storePics[2],
				{storePicThree:response.ret_data}
			);
			this.props.form.setFieldsValue({storePics:this.checkStorePicks(this.storePics)});
			this.setState({storePicSrcThree:response.ret_data});
		}
	};

	onLocationChange (value, selectedOptions) {
			 let paramMap=[
				  	{"name":"user_province_name",code:"user_province_code"},
				  	{"name":"user_city_name",code:"user_city_code"},
				  	{"name":"user_district_name",code:"user_district_code"},
				  	{"name":"user_street_name",code:"user_street_code"}
				  ];
			selectedOptions.forEach((addrObj,index)=>{
				this.locationParams[paramMap[index]["name"]]=addrObj.label;
				this.locationParams[paramMap[index]["code"]]=addrObj.value;
			});
			let {form} = this.props;
            this.selectedLoc={};
            let mapLocation=[{code:"user_prov_code",name:"user_prov_name"},
                            {code:"user_city_code",name:"user_city_name"},
                            {code:"user_dist_code",name:"user_dist_name"},{code:"user_stre_code",name:"user_stre_name"}];
            selectedOptions.forEach((elObj,index)=>{
                 this.selectedLoc[mapLocation[index].code]=elObj.value;
                 this.selectedLoc[mapLocation[index].name]=elObj.label;
            });
            form.setFieldsValue({residenceLocation:this.selectedLoc});
    };

	loadLocationData (selectedOptions)  {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        // 使用省或市的value去请求城市的地址
        this.getLocationData(targetOption.value)
            .then((resp) => {
                targetOption.loading = false;
                if (resp.data.status === 0) {
                    let options = [];
                    for (let item of resp.data.data.area) {
                        let {area_code: value, area_name: label, ...rest} = item;
                        if (selectedOptions.length === 3) {
                            // 当已经选第三个option时，子option节点设置为叶子leaf
                            options.push({value, label, isLeaf: true, rest});
                        } else {
                            options.push({value, label, isLeaf: false, rest});
                        }
                    }
                    targetOption.children = options;
                    this.setState({
                        loc_options: [...this.state.loc_options],
                    });
                }
            })
            .catch((error) => {
                targetOption.loading = false;
                console.log(error);
            });
    };

      getLocationData  (loc_code) {
        let params = {
            area_f_code: loc_code,
            method: "LoginSupplier.post_area",
            token: ''
        };
        return axios.post('http://www.doubei365.com/index.php?g=Supplier&m=LoginSupplier&a=post_area', params);
    };

	componentDidMount(){
        this.fetchData().then((areaCodeArr)=>{
        		this.displayAreaData(areaCodeArr);
        });
	}
	handleDatePickerChange(value){
		console.log(value,"this is value");
	}
	handleFetchOk(){
		console.log("this is select ok");
	}
	render(){
		const { getFieldDecorator,getFieldsError} = this.props.form;
		// 交互字段
		const {certificateAntiSrc,
			   certificateAntiSrcFront,
			   businessLicensePicSrc,
			   loadingBusiness,
			   loadingCertificateOne,
			   loadingCertificateTwo,
			   loadingOne,
			   loadingTwo,
			   loadingThree,
			   businessErrorText,
			   storePicLoadingOne,
			   storePicLoadingTwo,
			   storePicLoadingThree,
			   storePicSrcOne,
			   storePicSrcTwo,
			   storePicSrcThree}=this.state;
		// 展示对接字段
		const {
			    user_add_time,
				user_edit_time,
				user_examine_time,
                user_unit_name,
                user_province_name,
                user_city_name,
                user_district_name,
                user_street_name,
                user_addr,
                user_person,
                user_phone,
                user_business,
                user_identity_one,
                user_identity_two,
                user_store_one,
                user_store_two,
                user_store_three,
                user_province_code,
                user_city_code,
                user_district_code,
                user_street_code
		} = this.state;
		// 对接地区
		const areaInitialValue=[user_province_code,user_city_code,user_district_code,user_street_code];
		const formItemLayout = {
      			labelCol: { xs: {span: 16}, sm: {span: 16}},
      			wrapperCol: { xs: {span: 20}, sm: {span: 20}}
    	};
    	const uploadButton =(detail,loading)=>{
    		return  (<div>
        				<Icon type={loading ? 'loading' : 'plus'} />
        				<div className="ant-upload-text">{detail}</div>
      				</div>);
		};
		const containerStyle = { backgroundColor: "white", paddingLeft: "20px", paddingRight: "20px" };
		return (<Layout className="org-add custom-define-style" style={{width:"350px",...containerStyle}} ><Form  onSubmit={this.handleSubmit}>
					<FormItem
						label="入驻时间:"
						style={{marginTop:"10px"}}
						{...formItemLayout}
					>
							{getFieldDecorator("registerTime",{
								rules:[{required:true,message:"入驻时间是必填项"}],
							})(
								<DatePicker
									disabled={true}
									className="doubei-data-picker-custom"
									locale={locale}
      								showTime
      								format="YYYY-MM-DD HH:mm:ss"
      								onChange={this.handleDatePickerChange}
      								onOk={this.handleFetchOk}
    							/>
							)}
					</FormItem>
					<FormItem
						label="审核时间:"
						{...formItemLayout}
					>
						{getFieldDecorator("examineTime",{
							rules:[{required:true,message:"审核时间是必填项"}]
						})(
							<DatePicker
									disabled={true}
									className="doubei-data-picker-custom"
									locale={locale}
      								showTime
      								format="YYYY-MM-DD HH:mm:ss"
      								onChange={this.handleDatePickerChange}
      								onOk={this.handleFetchOk}
    							/>
						)}
					</FormItem>
					<FormItem
						label="机构名称:"
						{...formItemLayout}
					>
						{getFieldDecorator("insititutionName",{
							rules:[{required:true,message:"请输入机构名称"}],
							initialValue:user_unit_name
						})(
							<Input style={{width: '417px'}} />
						)}
					</FormItem>
					<FormItem
                    	{...formItemLayout}
                    	label="所在地区："
                	>
                    {getFieldDecorator('residenceLocation', {
                        rules: [{type: 'array', required: true, message: '请选择所在地区!'}],
                        initialValue:areaInitialValue
                    })(
                        <Cascader
                            placeholder="请选择"
                            style={{width: '417px'}}
                            options={this.state.loc_options}
                            loadData={this.loadLocationData}
                            onChange={this.onLocationChange}
                            changeOnSelect
                        />
                    )}
                	</FormItem>
                	<FormItem
						label="详细地址:"
						{...formItemLayout}
					>
						{getFieldDecorator("addr",{
							rules:[{required:true,message:"请输入详细地址"}],
							initialValue:user_addr
						})(
							<Input style={{width: '417px'}} />
						)}
					</FormItem>
					<FormItem
						label="联系人:"
						{...formItemLayout}
					>
						{getFieldDecorator("linkMan",{
							rules:[{required:true,message:"请输入联系人"}],
							initialValue:user_person
						})(
							<Input style={{width: '417px'}} />
						)}
					</FormItem>
					<FormItem
						label="手机:"
						{...formItemLayout}
					>
						{getFieldDecorator("phone",{
							rules:[{required:true,message:"请输入手机"}],
							initialValue:user_phone
						})(
							<Input style={{width: '417px'}} />
						)}
					</FormItem>
					<FormItem
						label="营业执照照片:"
						className="custom-define-img-area"
						{...formItemLayout}
					>
						{getFieldDecorator("businessPic",{
							rules:[{required:true,message:businessErrorText}],
							getValueFromEvent:this.fetchBusinessPic.bind(this)
						})(
								<Upload
										action={devPrefixTwo+"/Eduunit/EduunitUnituser/user_upload"}
										name="user_upload"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleBusinessPicChange}>
              							{businessLicensePicSrc?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={businessLicensePicSrc} alt="营业执照照片" /></div>:uploadButton("营业执照上传",loadingBusiness)}
              					</Upload>
						)}
					</FormItem>
					<FormItem
						label="身份证照片:"
						className="custom-define-img-area"
						{...formItemLayout}
					>
						{getFieldDecorator("certificatePics",{
							rules:[{required:true,message:"请上传身份证正反面照片"}]
						})(
							<div className="upload-style-div">
								<div>
									<Upload
										action={devPrefixTwo+"/Eduunit/EduunitUnituser/user_upload"}
										name="user_upload"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleCertificateImgChangeFront}>
              							{certificateAntiSrcFront?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={certificateAntiSrcFront} alt="身份证正面头像" /></div>:uploadButton("反面",loadingCertificateOne)}
              						</Upload>
								</div>
								<div>
									<Upload
										action={devPrefixTwo+"/Eduunit/EduunitUnituser/user_upload"}
										name="user_upload"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleCertificateImgChange}>
              							{certificateAntiSrc?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={certificateAntiSrc} alt="身份证正面头像" /></div>:uploadButton("正面",loadingCertificateTwo)}
              						</Upload>
								</div>
							</div>
						)}
					</FormItem>
					<FormItem
						label="门店照片:"
						className="custom-define-img-area"
						{...formItemLayout}
					>
						{getFieldDecorator("storePics",{
							rules:[{required:true,message:"请上传至少一张门店照片"}]

						})(
							<div className="upload-style-div">
								<div>
									<Upload
										action={devPrefixTwo+"/Eduunit/EduunitUnituser/user_upload"}
										name="user_upload"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleStorePicUploadOne}>
              							{storePicSrcOne?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={storePicSrcOne} alt="门店照片1" /></div>:uploadButton("门店照片1",storePicLoadingOne)}
              						</Upload>
								</div>
								<div>
									<Upload
										action={devPrefixTwo+"/Eduunit/EduunitUnituser/user_upload"}
										name="user_upload"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleStorePicUploadTwo}>
              							{storePicSrcTwo?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={storePicSrcTwo} alt="门店照片2" /></div>:uploadButton("门店照片2",storePicLoadingTwo)}
              						</Upload>
								</div>
								<div>
									<Upload
										action={devPrefixTwo+"/Eduunit/EduunitUnituser/user_upload"}
										name="user_upload"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleStorePicUploadThree}>
              							{storePicSrcThree?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={storePicSrcThree} alt="门店照片3" /></div>:uploadButton("门店照片3",storePicLoadingThree)}
              						</Upload>
								</div>
							</div>
						)}
					</FormItem>
					<FormItem>
          				<Button
            				type="primary"
            				htmlType="submit"
            				id="submitButton">
            					保存
          				</Button>
          				<NavLink to="/admin/org_set/institution_detail">
          					<Button
            					type="default"
            					style={{color:"white",marginLeft:"30px",backgroundColor:"#c3c3c3",borderColor:"#c3c3c3"}}>
            					取消
          					</Button>
          				</NavLink>
        			</FormItem>
				</Form></Layout>);
	}
};
export default Form.create()(InisititionSetEdit);
