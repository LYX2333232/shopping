<template>
	<view class="all">
		<view class="top">
			<view class="avatar">
				<image
					:src="store.userInfo ? store.userInfo.avatar : 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60siayiaB6TSiaibhbOM8bAnxKkpQLG0o0oUJaUw9jf2FOme0iayWCK9O7PCmw/0?wx_fmt=png'"
					mode="widthFix" class="image"></image>
				<view class="tabel"
					:style="!store.userInfo.is_up ? 'background: linear-gradient(90deg,rgba(255, 232, 184, 0.77) 20%,rgba(250, 197, 82, 1)100%);color: rgba(152, 99, 40, 1);' : 'background: linear-gradient( 90deg, #686464 0%, #423F40 50%, #423F40 100%);color:#FFFFFF'">
					{{ !store.userInfo.is_up ? '个人买家' : '分销商' }}
				</view>
			</view>
			<view v-if="store.userInfo" style="margin-left:30rpx">
				<view class="tn-flex-center-start">
					<view class="denglu">
						{{ store.userInfo.name }}
					</view>
				</view>

				<view class="bianhao">
					编号：{{ store.userInfo.uid }}
				</view>
			</view>
			<view style="margin-left:30rpx;" class="denglu" v-else @click="showLogin">
				点击授权登录
			</view>
		</view>

		<view v-if="!store.userInfo.is_up" class="middle" @click="addUsVisible = true">
			<image
				src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sSmjibpjv8Z5qibB903ribzg1FcHicDLicj8dvleS7ib7E2Ae9H1Me6kcJEdw/0?wx_fmt=png"
				mode="aspectFill" style="width: 100%;height: 140rpx;border-radius: 11.54rpx;">
			</image>

		</view>

		<view v-else class="block1">
			<view style="display: flex;justify-content: space-between;">
				<view class="myorder">
					分销中心
				</view>
			</view>
			<view class="function">
				<view class="tofunction" v-for="(item, index) in funList0" :key="'function0' + index"
					@click="tap_item(index)">
					<view class="img">
						<img :src="item.icon" alt="" mode="aspectFill" />
					</view>
					<view style="font-size: 27rpx;color: rgba(102, 102, 102, 1);">
						{{ item.name }}
					</view>

				</view>
			</view>
		</view>

		<view class="block1">
			<view style="display: flex;justify-content: space-between;">
				<view class="myorder">
					我的订单
				</view>
				<view style="padding-top: 15rpx;color: rgba(124, 124, 124, 1);margin-right: 20rpx;"
					@click="tap_order(-1)">
					全部订单
					<uni-icons type="right" size="14" color=" rgba(124, 124, 124, 1)"
						style="margin-left: -5rpx;"></uni-icons>
				</view>
			</view>
			<view class="function">
				<view class="tofunction" v-for="(item, index) in funList" :key="'function1' + index"
					@click="tap_order(index)">
					<view class="img">
						<TnBadge :value="order_count[index] > 0 ? order_count[index] : ''" :max="99" type="danger"
							size="40" />
						<img :src="item.icon" alt="" mode="aspectFill" />
					</view>
					<view style="font-size: 27rpx;color: rgba(102, 102, 102, 1);">
						{{ item.name }}
					</view>

				</view>
			</view>
		</view>

		<view class="block2">

			<view class="myorder">
				我的应用
			</view>

			<view class="function">
				<view class="tofunction" v-for="(item, index) in funList1" :key="'function2' + index"
					@click="tap_application(index)">
					<!-- button删除原有样式，改为view -->
					<button v-if="index === 1" open-type="contact"
						style="background:none;border:none;padding:0;margin:-15rpx;width:100%;height:120%;">
						<view class="img">
							<img :src="item.icon" alt="" mode="aspectFill" />
						</view>
						<view style="font-size: 27rpx;color: rgba(102, 102, 102, 1);">
							{{ item.name }}
						</view>
					</button>
					<view v-else>
						<view class="img">
							<img :src="item.icon" alt="" mode="aspectFill" />
						</view>
						<view style="font-size: 27rpx;color: rgba(102, 102, 102, 1);">
							{{ item.name }}
						</view>
					</view>
				</view>
			</view>

		</view>
		<view style="display:flex">
			<text>您的备案号：</text>
			<!-- 样式与a标签相同 -->
			<uni-link href="https://beian.miit.gov.cn/" text="粤ICP备2024204458号" color="#007aff"
				fontSize="12"></uni-link>
		</view>

		<TnPopup v-model="feedback" bg-color="#FFFFFF" width="660" @close="cancelFeedback">
			<view style="margin: 30rpx">
				<TnForm>
					<TnFormItem label="手机号" label-width="180" prop="phone">
						<TnInput type="number" :maxlength="11" v-model="phone" placeholder="手机号" />
					</TnFormItem>
					<TnFormItem label="反馈内容" label-width="180" prop="content">
						<TnInput type="textarea" placeholder="请输入反馈内容" height="150" v-model="feedbackContent" />
					</TnFormItem>
				</TnForm>
			</view>
			<view class="footer" style="margin-bottom: 30rpx;">
				<TnButton type="info" width="160" height="52" @click="cancelFeedback">取消</TnButton>
				<TnButton bg-color="#C8B697" text-color="#FFFFFF" width="160" height="52" @click="submitFeedback">提交
				</TnButton>
			</view>
		</TnPopup>
		<TnPopup v-model="loginVisible" open-direction="bottom">
			<view class="user_popup">
				<view class="title_border_text align_center">
					获取用户昵称，头像
				</view>
				<view class="user_text" style="padding: 0 15rpx;">
					获取用户头像、昵称，主要用于向用户提供具有辨识度的用户体验
				</view>
				<button class="up_avatar" open-type="chooseAvatar" @chooseavatar="chooseavatar">
					<image v-if="login_form.avatar" :src="login_form.avatar" mode=""></image>
					<TnIcon v-else name="upload" size="70" color="#e4e9ec" />
				</button>
				<view class="user_name">
					<input type="nickname" v-model="login_form.name" placeholder="请输入昵称" />
				</view>

				<button class="login center" @click="getphonenumber"
					:style="login_form.name && login_form.avatar ? 'background:#0066cc !important;color:#fff' : ''">
					<text>登 录</text>
				</button>
			</view>
		</TnPopup>
		<TnPopup v-model="addUsVisible" width="600">
			<view style="width: 100%;display: flex;flex-direction:column;align-items:center;padding: 50rpx;">
				<view class="title">{{ add_us_title }}</view>
				<view class="content">{{ add_us_content }}</view>
				<TnForm :model="add_us_form" :rules="add_us_rules">
					<TnFormItem label="手机号" prop="phone">
						<TnInput type="number" placeholder="请输入手机号" v-model="add_us_form.phone" :maxlength="11">
						</TnInput>
					</TnFormItem>
					<TnFormItem prop="agree">
						<TnCheckbox checked-shape="circle" active-color="#C8B697"
							:custom-style="{ width: '500rpx', margin: '40rpx 0', color: '#C8B697' }"
							v-model="add_us_form.agree">
							我同意相关服务条款</TnCheckbox>
					</TnFormItem>
				</TnForm>
				<button style="background:#C8B697;color: #fff;height: 80rpx;width: 500rpx;border-radius: 40rpx;"
					class="tn-flex-center-center" @click="addUs">申请加盟</button>
			</view>
		</TnPopup>

	</view>
</template>

<script setup>
import {
	onMounted,
	ref
} from 'vue'
import {
	onShow
} from '@dcloudio/uni-app'
import {
	UserStore
} from '@/store'
import {
	uploadImage,
	Login,
	add_us
} from '@/api/user/user'
import {
	get_order_count
} from '@/api/order/order'
import {
	post_feedback
} from '@/api/feedback/feedback'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
import TnForm from '@/uni_modules/tuniaoui-vue3/components/form/src/form.vue'
import TnFormItem from '@/uni_modules/tuniaoui-vue3/components/form/src/form-item.vue'
import TnInput from '@/uni_modules/tuniaoui-vue3/components/input/src/input.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import TnCheckbox from '@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue'
import TnBadge from '@/uni_modules/tuniaoui-vue3/components/badge/src/badge.vue'

onMounted(() => {
	if (!store.userInfo) {
		nextTick(() => {
			loginVisible.value = true
		})
	}
})

const store = UserStore()

const funList0 = ref([{
	name: '账户余额',
	icon: '../../static/icon/me/wallet.png'
},
{
	name: '我的团队',
	icon: '../../static/icon/me/team.png'
},
{
	name: '销售记录',
	icon: '../../static/icon/me/sell.png'
},
{
	name: '邀请好友',
	icon: '../../static/icon/me/person.png'
}
])

let funList = [{
	name: '待付款',
	icon: '../../static/icon/me/topay.png'
},
{
	name: '待发货',
	icon: '../../static/icon/me/wait.png'
},
{
	name: '待收货',
	icon: '../../static/icon/me/truck.png'
},
{
	name: '退款/售后',
	icon: '../../static/icon/me/after.png'
},
]
const funList1 = ref([])

const order_count = ref([])

// 反馈的弹出窗
const feedback = ref(false)

const phone = ref()

// 反馈的内容
const feedbackContent = ref()

// 登录弹窗
const loginVisible = ref(false)

const login_form = ref({
	name: undefined,
	avatar: undefined,
	upload: undefined
})

// 展示登录弹窗
const showLogin = () => {
	loginVisible.value = true
}

const compare = (a, b) => {
	const a_array = a.split('.').map(e => parseInt(e))
	const b_array = b.split('.').map(e => parseInt(e))
	for (let i = 0; i < a_array.length; i++) {
		if (a_array[i] > b_array[i]) {
			return 1
		} else if (a_array[i] < b_array[i]) {
			return -1
		}
	}
	return 0
}

// 点击分销
const tap_item = (index) => {
	if (index === 0) {
		uni.navigateTo({
			url: '/pages/me/surplus/surplus',
		})
	}
	if (index === 1) {
		uni.navigateTo({
			url: '/pages/me/team/team',
		})
	}
	if (index === 2) {
		uni.navigateTo({
			url: '/pages/me/record/record',
		})
	}
	if (index === 3) {
		uni.navigateTo({
			url: '/pages/me/invite/invite',
		})
	}
}

// 点击订单
const tap_order = (index) => {
	uni.navigateTo({
		url: '/pages/me/order/index?index=' + index
	})
}

// 点击我的应用的内容
const tap_application = (index) => {
	// 收货地址
	if (index === 0) {
		uni.navigateTo({
			url: '/pages/me/address/index'
		})
	}
	// 我的优惠券
	if (index === 2) {
		uni.navigateTo({
			url: '/pages/me/coupon/index'
		})
	}
	// 点击反馈
	if (index === 3) {
		feedback.value = true
	}
	if (index === 4) {
		uni.navigateTo({
			url: '/pages/me/favorite/index'
		})
	}
	if (index === 5) { // 退出登录
		uni.showModal({
			title: '提示',
			content: '确定要退出登录吗？',
			success: (res) => {
				if (res.confirm) {
					store.set_user_info(null)
					uni.clearStorageSync()
					// 重新加载当前页面
					uni.switchTab({
						url: '/pages/me/me',
					})
				}
			}
		})
	}
}

const getphonenumber = (e) => {
	const up_id = uni.getStorageSync('up_id')
	uni.login({
		success: (s) => {
			// 登录
			Login({
				code: s.code,
				avatar: login_form.value.upload,
				name: login_form.value.name,
				up_id
			}).then(res => {
				// 登录成功
				if (res.code === 200) {
					// 关闭弹窗
					loginVisible.value = false
					// 获取用户信息
					store.set_user_info(res.data)
				}
			})
		},
	})
}


const cancelFeedback = () => {
	feedback.value = false
}

const submitFeedback = () => {
	post_feedback({
		phone: phone.value,
		content: feedbackContent.value
	}).then(res => {
		if (res.code === 200) {
			feedback.value = false
			phone.value = ''
			feedbackContent.value = ''
		}
	})
}

// 选择头像
const chooseavatar = (e) => {
	// 转换为base64
	const base64 = uni.getFileSystemManager().readFileSync(e.detail.avatarUrl, 'base64')
	// 添加前缀
	login_form.value.avatar = 'data:image/png;base64,' + base64
	uploadImage('data:image/png;base64,' + base64).then(res => {
		login_form.value.upload = res.data
	})
}

const addUsVisible = ref(false)
const add_us_title = ref('分销规则')
const add_us_content = ref(
	'分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是分销规则是'
)
const add_us_form = ref({
	phone: undefined,
	agree: false
})
const add_us_rules = ref({
	phone: [{
		required: true,
		message: '请输入手机号',
		trigger: 'blur'
	},
	{
		pattern: /^1[3-9]\d{9}$/,
		message: '手机号格式错误',
		trigger: 'blur'
	}
	]
})

const addUs = () => {
	const pattern = /^1[3-9]\d{9}$/
	if (add_us_form.value.phone.toString().length !== 11 || !pattern.test(add_us_form.value.phone)) {
		uni.showModal({
			title: '提示',
			content: '请输入正确的手机号码',
			showCancel: false
		})
		return
	}
	if (!add_us_form.value.agree) {
		uni.showModal({
			title: '提示',
			content: '请同意相关服务条款',
			showCancel: false
		})
		return
	}
	add_us(add_us_form.value.phone).then(res => {
		if (res.code === 200) {
			uni.showToast({
				title: '提示',
				content: '申请成功'
			})
			addUsVisible.value = false
		} else {
			uni.showToast({
				title: '提示',
				content: res.msg
			})
		}
	})
}

const getData = () => {
	const list = [{
		name: '收货地址',
		icon: '../../static/icon/me/location.png'
	},
	{
		name: '联系客服',
		icon: '../../static/icon/me/service.png'
	},
	{
		name: '我的优惠券',
		icon: '../../static/icon/me/money.png'
	},
	{
		name: '意见反馈',
		icon: '../../static/icon/me/feedback.png'
	},
	{
		name: '收藏商品',
		icon: '../../static/icon/me/star.png'
	},
	{
		name: '退出登录',
		icon: '../../static/icon/me/logout.png'
	}
	]
	funList1.value = list

	get_order_count().then(res => {
		order_count.value = [res.data.pay, res.data.delivery, res.data.collect, 0]
		console.log(order_count.value, "order_count.value")
	})
}

onShow(() => {
	getData()
})
</script>

<style lang="scss" scoped>
.all {
	width: 750rpx;
	min-height: 100vh;
	//background: linear-gradient(0deg, rgba(240, 240, 240, 1.0) 67.000002%, rgba(240, 224, 198, 1)100.000002%);
	background: linear-gradient(180deg, #FAEBD9 0%, #F0E0C6 10%, #FBF0E2 20%, #F7F7F7 50%, #F7F7F7 100%);
	padding-top: 100rpx;
	display: flex;
	flex-direction: column;
	align-items: center;

	.top {
		width: 90%;
		height: 150rpx;
		display: flex;
		margin: 0 0 40rpx;

		.avatar {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;

			.image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 100%;
			}

			.tabel {
				position: absolute;
				height: 36.54rpx;
				border-radius: 53.85rpx;
				bottom: -20rpx;
				text-align: center;
				padding: 0 20rpx;
			}
		}

		.denglu {
			font-style: Inter-Medium;
			font-size: 34rpx;
			margin: 20rpx 0 10rpx;
		}

		.bianhao {
			color: #6D6D6D;
			font-size: 22rpx;
		}
	}

	.middle {
		width: 95%;
		height: 140.38rpx;
		border-radius: 11.54rpx;

		.block {
			display: flex;
			padding-top: 10rpx;
			padding-left: 26rpx;
			font-family: PingFang SC, PingFang SC;

			.image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
				margin-top: 30rpx;
			}

			.p1 {
				margin-top: 20rpx;
				font-weight: 500;
				font-size: 31rpx;
				color: #FFDFC3;
				line-height: 46rpx;
				text-align: left;
			}

			.p2 {
				font-weight: 400;
				font-size: 23rpx;
				color: #FFDFC3;
				line-height: 35rpx;
			}

			.p3 {
				width: 146rpx;
				height: 56rpx;
				background: linear-gradient(96deg, #EDD3A9 0%, #E0B57E 100%);
				border-radius: 56rpx;
				text-align: center;
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 27rpx;
				color: #835A2C;
				padding-top: 12rpx;
				position: absolute;
				right: 50rpx;
				top: 375rpx;

			}
		}

	}

	.block1 {
		width: 95%;
		height: 232.69rpx;
		background-color: #fff;
		border-radius: 13.46rpx;
		margin-top: 15rpx;

		.myorder {
			font-family: Inter, Inter;
			font-weight: 600;
			font-size: 31rpx;
			color: #000000;
			line-height: 46rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
			padding-left: 20rpx;
			padding-top: 10rpx;
		}
	}

	.block2 {
		width: 95%;
		height: 438.46rpx;
		background-color: #fff;
		border-radius: 13.46rpx;
		margin-top: 15rpx;

		.myorder {
			font-family: Inter, Inter;
			font-weight: 600;
			font-size: 31rpx;
			color: #000000;
			line-height: 46rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
			padding-left: 20rpx;
			padding-top: 10rpx;
		}
	}

	.function {
		margin-top: 15rpx;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
	}

	.tofunction {
		background-color: rgba(255, 255, 255, 1);
		display: flex;
		flex-direction: column;
		align-items: center;

		.img {
			position: relative;
			width: 50rpx;
			height: 50rpx;
			text-align: center;
			margin: 0 auto;
			margin-top: 35rpx;
			margin-bottom: 25rpx;
		}
	}

	.user_popup {
		display: flex;
		flex-direction: column;
		align-items: center;

		.title_border_text {
			font-size: 33rpx;
			font-weight: bold;
			height: 80rpx;
			margin-top: 10rpx;
		}

		.user_text {
			font-size: 26rpx;
			color: #999;
		}

		.up_avatar {
			height: 150rpx;
			width: 150rpx;
			border: 4rpx solid #fff;
			margin-top: 50rpx;
			border-radius: 100rpx;
			background: #f8f7f8;
			box-shadow: 0 0 2.5rem rgba(0, 0, 0, .15);

			image {
				height: 150rpx;
				width: 150rpx;
				border-radius: 50%;
				margin-left: -30rpx;
			}
		}

		.user_name {
			height: 80rpx;
			margin-top: 50rpx;
			border-radius: 10rpx;
			background: #f8f7f8;

			input {
				width: 650rpx;
				height: 100%;
				margin: 0 auto;
			}
		}

		.login {
			height: 80rpx;
			border-radius: 10rpx;
			background: #e6e6e6;
			margin-top: 70rpx;
		}
	}

	.title {
		font-family: PingFang SC, PingFang SC;
		font-weight: 500;
		font-size: 38rpx;
		color: #474747;
		line-height: 45rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
	}

	.content {
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 27rpx;
		color: #474747;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		margin: 30rpx 0;
	}

	.footer {
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
}
</style>