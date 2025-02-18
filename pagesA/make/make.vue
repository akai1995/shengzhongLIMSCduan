<template>
	<view>
		<ut-nav title="检测登记" border></ut-nav>
		<ut-tabs :tabList="tabList" :current="current" @onItem="onItem"></ut-tabs>

		<view class="content" v-if="current == 1">
			<view class="title">个人信息</view>
			<view class="form">
				<u--form labelPosition="left" :model="form" labelWidth="150rpx" ref='form' :rules="rules">
					<u-form-item label="姓名" prop="fdName" borderBottom required>
						<u--input v-model="form.fdName" border="none" placeholder="请输入"></u--input>
					</u-form-item>
					<u-form-item label="性别" prop="fdSex" borderBottom required>
						<u-radio-group v-model="form1.fdSex">
							<view class="width flex j-end">
								<u-radio :customStyle="{marginRight: '30rpx'}" label="男" name='男'></u-radio>
								<u-radio :customStyle="{marginRight: '30rpx'}" label="女" name='女'></u-radio>
							</view>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="年龄" prop="fdAge" borderBottom required>
						<u--input v-model="form.fdAge" border="none" placeholder="请输入"></u--input>
						<template slot="suffix">
							<view>岁</view>
						</template>
					</u-form-item>
					<u-form-item label="身份证号" prop="fdIdcard" borderBottom required>
						<u--input v-model="form.fdIdcard" border="none" placeholder="请输入" maxlength="18"></u--input>
					</u-form-item>
					<u-form-item label="住院号" prop="fdHospital" borderBottom>
						<u--input v-model="form.fdHospital" border="none" placeholder="请输入"></u--input>
					</u-form-item>
					<u-form-item label="门诊号" prop="fdPatientNo" borderBottom>
						<u--input v-model="form.fdPatientNo" border="none" placeholder="请输入"></u--input>
					</u-form-item>
					<u-form-item label="籍贯" prop="fdNative" borderBottom>
						<u--input v-model="form.fdNative" border="none" placeholder="请输入"></u--input>
					</u-form-item>
					<u-form-item label="职业" prop="fdVocation" borderBottom @click="showType = true">
						<u--input v-model="form.fdVocation" required readonly border="none"
							placeholder="请选择"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
						<u-picker :show="showType" :columns="columns1" closeOnClickOverlay @confirm="confirm1"
							@cancel="showType = false" @close="showType = false"></u-picker>
					</u-form-item>
					<u-form-item label="民族" prop="fdNation" borderBottom @click="show = true">
						<u--input v-model="form.fdNation" required readonly border="none" placeholder="请选择"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
						<u-picker :show="show" :columns="columns" closeOnClickOverlay @confirm="confirm"
							@cancel="show = false" @close="show = false"></u-picker>
					</u-form-item>
					<u-form-item label="联系电话" prop="fdTel">
						<u--input v-model="form.fdTel" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</u--form>
				<u-picker :show="isType" :columns="typeList" @confirm='confirmType' @close="isType = false"
					@cancel="isType = false"></u-picker>
			</view>
			<view class="title">个人史</view>
			<view class="form">
				<u--form labelPosition="left" :model="form1" labelWidth="220rpx" ref='form1'>
					<u-form-item label="是否初治" prop="fdTreatment" borderBottom>
						<u-radio-group v-model="form1.fdTreatment">
							<view class="width flex j-end">
								<u-radio :customStyle="{marginRight: '30rpx'}" label="是" name='是'></u-radio>
								<u-radio :customStyle="{marginRight: '30rpx'}" label="否" name='否'></u-radio>
							</view>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="有无吸烟史" prop="fdSmoke" borderBottom>
						<u-radio-group v-model="form1.fdSmoke">
							<view class="width flex j-end">
								<u-radio :customStyle="{marginRight: '30rpx'}" label="有" name='有'></u-radio>
								<u-radio :customStyle="{marginRight: '30rpx'}" label="无" name='无'></u-radio>
							</view>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="有无饮酒史" prop="fdAlcohol" borderBottom>
						<u-radio-group v-model="form1.fdAlcohol">
							<view class="width flex j-end">
								<u-radio :customStyle="{marginRight: '30rpx'}" label="有" name='有'></u-radio>
								<u-radio :customStyle="{marginRight: '30rpx'}" label="无" name='无'></u-radio>
							</view>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="有无煤气接触史" prop="fdCoal" borderBottom>
						<u-radio-group v-model="form1.fdCoal">
							<view class="width flex j-end">
								<u-radio :customStyle="{marginRight: '30rpx'}" label="有" name='有'></u-radio>
								<u-radio :customStyle="{marginRight: '30rpx'}" label="无" name='无'></u-radio>
							</view>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="既往患病史" prop="fdCancerHistory">
						<u--input v-model="form1.fdCancerHistory" border="none" placeholder="请输入"></u--input>
						<!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
					</u-form-item>
<!-- 					<view class="item-box">
						<view class="width flex j-c">
							<view class="label">申请者与该亲属关系</view>
							<view class="flex j-end" style="width: 200rpx;">
								<u--input border="none" placeholder="请输入内容" v-model="form1.fd_relationship"></u--input>
							</view>
						</view>
					</view> -->
					<u-line></u-line>
					<u-form-item label="近期化疗史" prop="fdChemotherapy" borderBottom>
						<u-radio-group v-model="form1.fdChemotherapy">
							<view class="width flex j-end">
								<u-radio :customStyle="{marginRight: '30rpx'}" label="有" name='有'></u-radio>
								<u-radio :customStyle="{marginRight: '30rpx'}" label="无" name='无'></u-radio>
							</view>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="是否接受过骨髓移植" prop="boneIs" borderBottom labelWidth="400rpx">
						<u-radio-group v-model="form1.boneIs">
							<view class="width flex j-end">
								<u-radio :customStyle="{marginRight: '30rpx'}" label="是" name='是'></u-radio>
								<u-radio :customStyle="{marginRight: '30rpx'}" label="否" name='否'></u-radio>
							</view>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="近期是否接受过输血" prop="isTransfusion" borderBottom labelWidth="400rpx">
						<u-radio-group v-model="form1.isTransfusion">
							<view class="width flex j-end">
								<u-radio :customStyle="{marginRight: '30rpx'}" label="是" name='是'></u-radio>
								<u-radio :customStyle="{marginRight: '30rpx'}" label="否" name='否'></u-radio>
							</view>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="靶向治疗史" prop="egfris">
<!-- 						<u--input v-model="form1.egfris" border="none" placeholder="请选择"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon> -->
						<u-radio-group v-model="form1.egfris">
							<view class="width flex j-end">
								<u-radio :customStyle="{marginRight: '30rpx'}" label="有" name='有'></u-radio>
								<u-radio :customStyle="{marginRight: '30rpx'}" label="无" name='无'></u-radio>
							</view>
						</u-radio-group>
					</u-form-item>
					<view class="item-box" v-if="form1.egfris=='有'">
						<view class="width flex j-c">
							<view class="label">用药中</view>
							<view class="flex" style="width: 300rpx;">
								<u--input type="number" border="none" placeholder="请输入内容"
									v-model="form1.monthgo"></u--input>月
							</view>
						</view>
						<u-line color="#fff"></u-line>
						<view class="width flex j-c">
							<view class="label">停药后</view>
							<view class="flex" style="width: 300rpx;">
								<u--input type="number" border="none" placeholder="请输入内容"
									v-module="form1.monthendend"></u--input>月
							</view>
						</view>
						<u-line color="#fff"></u-line>
						<view class="width flex j-c">
							<view class="label">药物名称</view>
							<view class="flex" style="width: 300rpx;">
								<u--input type="number" border="none" placeholder="请输入内容"
									v-model="form1.egfrName"></u--input>
							</view>
						</view>
					</view>
					<u-line></u-line>
					<u-form-item label="家族史" prop="fdFamily">
<!-- 						<u--input v-model="form1.fdFamily" border="none" placeholder="请选择"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon> -->
						<u-radio-group v-model="form1.fdFamily">
							<view class="width flex j-end">
								<u-radio :customStyle="{marginRight: '30rpx'}" label="有" name='有'></u-radio>
								<u-radio :customStyle="{marginRight: '30rpx'}" label="无" name='无'></u-radio>
							</view>
						</u-radio-group>
					</u-form-item>
					<view class="item-box" v-if="form1.fdFamily=='有'">
						<view class="width flex j-c">
							<view class="label">申请者与该亲属关系</view>
							<view class="flex" style="width: 300rpx;">
								<u--input type="number" border="none" placeholder="请输入内容"
									v-model="form1.fdRelationship"></u--input>
							</view>
						</view>
						<u-line color="#fff"></u-line>
						<view class="width flex j-c">
							<view class="label">该亲属患何种癌</view>
							<view class="flex" style="width: 300rpx;">
								<u--input type="number" border="none" placeholder="请输入内容"
									v-model="form1.fdRelationCancer"></u--input>
							</view>
						</view>
						<u-line color="#fff"></u-line>
						<view class="width flex j-c">
							<view class="label">亲属姓名</view>
							<view class="flex" style="width: 300rpx;">
								<u--input type="number" border="none" placeholder="请输入内容"
									v-model="form1.fdRelationName" /></u--input>
							</view>
						</view>
						<u-line color="#fff"></u-line>
						<view class="width flex j-c">
							<view class="label">亲属分子检测情况</view>
							<view class="flex" style="width: 300rpx;">
								<u--input type="number" border="none" placeholder="请输入内容"
									v-module="form1.fdRelationCondition"></u--input>
							</view>
						</view>

					</view>
				</u--form>
			</view>
			<view class="title">项目信息</view>
			<view class="form">
				<u--form labelPosition="left" :model="form2" labelWidth="150rpx" ref='form2' :rules="rules">
					<u-form-item label="检测项目" prop="fdProjectName"  @click="showTypeProject = true">
						<u--input v-model="form2.fdProjectName" required readonly  border="none" placeholder="请选择" ></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
						<u-picker :show="showTypeProject" :columns="columns2" closeOnClickOverlay @confirm="confirm2"
							@cancel="showTypeProject = false" @close="showTypeProject = false" keyName="fdProjectName"></u-picker>
					</u-form-item>
				</u--form>
			</view>
			<view class="button" @click="subimt">确认提交</view>
		</view>

		<view class="content" style="padding-top: 0;" v-if="current == 2">
			<view class="list" v-for="(item,index) in list" :key="index">
				<view class="ut-view m-t2">
					<view class="h1">
						<text class="m-r2">{{item.fdName}}</text>
						<text>{{item.fdSex}}</text>
					</view>
					<view class="tag" v-if="item.fdJfStatus=='未缴费'">
						<u-tag text="未缴费" size="mini" plain   borderColor="#FEEFEE" bgColor="#FEEFEE"color="#F08986" type="warning"></u-tag>
					</view>
					<view class="tag" v-if="item.fdJfStatus=='已缴费'">
						<u-tag text="已缴费" size="mini" plain  borderColor="#E7FAF1" bgColor="#E7FAF1"color="#3FC998" type="warning"></u-tag>
					</view>
					<view class="tag" v-if="item.fdJfStatus=='已退费'">
						<u-tag text="已退费" size="mini" plain borderColor="#EBF5FF" bgColor="#EBF5FF"color="#6688CC" type="warning"></u-tag>
					</view>


					<view class="vice m-t2">身份证号：{{item.fdIdcard}}</view>
					<view class="vice m-t2">登记时间：{{item.createTime | formatDate}}</view>
				</view>
			</view>

			<ut-nodata v-if="list.length==0"></ut-nodata>
		</view>
	</view>
</template>

<script>
	import {
		addPcrInFormation,
		getDicts,
		selectList,
		getProjectList
	} from "@/api/hospitalrelated/hospitalrelated.js"
	export default {
		filters: {
			formatDate: function(item) {
				const date = new Date(item);
				const year = date.getFullYear();
				const month = date.getMonth() + 1; // 月份从0开始，所以需要加1
				const day = date.getDate();
				return year + "/" + month.toString().padStart(2, '0') + '/' + day.toString().padStart(2, '0');
			}
		},
		data() {
			return {
				tabList: [{
					name: '新建检测登记',
					id: 1
				}, {
					name: '历史记录',
					id: 2
				}],
				current: 1,
				form: {
					type: '',
					fdTel:'',
					fdIdcard:'',
					fdJfStatus:'未缴费',
				},
				form1: {
					userId: this.$store.getters.userId,
				},
				form2:{
					fdProjectName:'',
				},
				showTypeProject: false,
				showType: false,
				isType: false,
				list: [],
				typeList: [
					['本院门诊缴费']
				],
				rules: {
					'fdName': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					"fdIdcard":  [{
							required: true,
							message: '请输入身份证号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.idCard(value);
							},
							message: '身份证号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],

					"fdAge": [{
							type: 'integer',
							required: true,
							message: '请输入年龄并且只能输入数字',
							trigger: ['blur', 'change']
						}, 
					],
					'fdTel':[{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						},
					],
					'fdProjectName':{
							type: 'string',
							required: true,
							message: '请选择检测项目',
							trigger: ['change']
					}

				},
				show: false,
				columns: [
					[]
				],
				columns1: [
					[]
				],
				columns2: [
					[]
				],
				dicts: ['ethnic_dictionary', 'career_dictionary'],
			};
		},
		onReady() {
				//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
		    	this.$refs.form.setRules(this.rules)
				// this.$refs.form1.setRules(this.rules)
				this.$refs.form2.setRules(this.rules)
		    },
		onLoad(optinos) {
			if(optinos.type == 2){
				this.current = optinos.type
				let id = this.$store.getters.userId;
				this.onItem({id:2})
			}
			this.getData();
			this.getData1();
		},
		methods: {
			reload(){
				this.form={
					 fdName: '',
					    fdSex: '',
					    fdAge: '',
					    fdIdcard: '',
					    fdHospital: '',
					    fdPatientNo: '',
					    fdNative: '',
					    fdVocation: '',
					    fdNation: '',
					    fdTel: '',
				};
				 this.form1 = {
				    userId: this.$store.getters.userId,
				  };
				  this.form2 = {
				    fdProjectName: '',
				  };
			},
			onItem(e, index) {
				this.current = e.id
				if (this.current == 2) {
					selectList(this.form1.userId).then(res => {
						this.list = res.data;
					})
				}
			},
			confirmType(e) {
				this.form.type = e.value[0]
				this.isType = false
			},
			subimt() {
				if(this.form2.fdProjectName==''){
					uni.$u.toast("请选则检测项目");
				}else{
					var pcrInFormation = Object.assign({},this.form, this.form1,this.form2);
					console.log(pcrInFormation)
					
					this.$refs.form.validate().then(valid => {
					
							addPcrInFormation(pcrInFormation).then(res => {
								if (res.code == 200) {
									this.current = 2;
									selectList(this.form1.userId).then(res => {
										this.list = res.data;
									})
								}
							this.reload();
							});
					
					}).catch(errors => {
						uni.$u.toast(errors[0].message);
					})
				}
				

			},
			confirm(e) {
				this.form.fdNation = e.value[0]
				this.show = false
			},
			confirm1(e) {
				this.form.fdVocation = e.value[0]
				this.showType = false
			},
			confirm2(e) {
				this.form2.fdProjectName = e.value[0].fdProjectName
				this.form2['fdProjectCode']=e.value[0].fdProjectCode
				this.showTypeProject = false
			},
			getData() {
				getDicts(this.dicts[0]).then(res => {
					for (var i = 0; i < res.data.length; i++) {
						this.columns[0].push(res.data[i].dictValue)
					}
				});
				getProjectList().then(res=>{
					for (var i = 0; i < res.data.length; i++) {
						this.columns2[0].push( res.data[i])
					}
				})
			},
			getData1() {
				getDicts(this.dicts[1]).then(res => {
					for (var i = 0; i < res.data.length; i++) {
						this.columns1[0].push(res.data[i].dictLabel)
					}
				});
			},
		}
	}
</script>

<style lang="less">
	.title {
		color: #666;
		font-size: 28rpx;
		line-height: 90rpx;
	}


	.form {
		background: #fff;
		padding: 0 20rpx 20rpx 20rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
	}

	.item-box {
		width: 100%;
		min-height: 80rpx;
		background: #F8F8F8FF;
		padding: 0 20rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;

		.label {
			font-size: 30rpx;
			color: #000;
			line-height: 80rpx;
			white-space: nowrap;
		}
	}

	.button {
		margin-top: 30rpx;
		left: 70rpx;
		right: 70rpx;
		height: 80rpx;
		border-radius: 80rpx;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		font-size: 36rpx;
		font-weight: 500;
		letter-spacing: 2rpx;
	}

	// .content {
	// 	padding: 30rpx;
	// 	box-sizing: border-box;
	// 	position: relative;
	// }


	.vice {
		font-size: 24rpx;
		color: #666;
	}
	.list {
		width: 100%;
		min-height: 200rpx;
		border-radius: 20rpx;
		background: #fff;
		margin-bottom: 30rpx;
		// padding: 30rpx 20rpx;
		box-sizing: border-box;
		position: relative;
		.tag{
			position: absolute;
			top: 30rpx;
			right: 20rpx;
			font-size: 24rpx;
			font-weight: 400;
			padding: 5rpx 15rpx;
			border-radius: 10rpx;
		}

	}


</style>
