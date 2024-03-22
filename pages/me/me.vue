<template>
	<view style="width: 93%; margin: 0 auto;">

		<view class="top">
			<view class="avatar">
				<image :src="store.userInfo ? store.userInfo.avatar : '../../static/icon/avatar.png'" mode="widthFix"
					class="image"></image>
				<view class="tabel"
					:style="isBuyer ? 'background: linear-gradient(90deg,rgba(255, 232, 184, 0.77) 20%,rgba(250, 197, 82, 1)100%);color: rgba(152, 99, 40, 1);' : 'background: linear-gradient( 90deg, #686464 0%, #423F40 50%, #423F40 100%);color:#FFFFFF'">
					{{ isBuyer ? '个人买家' : '分销商' }}
				</view>
			</view>
			<view v-if="store.userInfo" style="margin-left:30rpx">
				<view class="tn-flex-center-start">
					<view class="denglu">
						{{ store.userInfo.name }}
					</view>
					<TnIcon size="40" color="#6D6D6D" name="edit-write" @click="toedit"></TnIcon>
				</view>

				<view class="bianhao">
					编号：{{ store.userInfo.uid }}
				</view>
			</view>
			<view style="margin-left:30rpx" class="denglu" v-else @click="loginVisible = true">
				点击授权登录
			</view>
		</view>

		<view v-if="isBuyer" class="middle">
			<image src="../../static/logo.png" mode="aspectFill"
				style="position: absolute; z-index: -999;width: 700rpx;height: 140.38rpx;border-radius: 11.54rpx;">
			</image>


			<view class="block">
				<view class="image">
					<image src="../../static/icon/tabbar/1.png" mode=""></image>
				</view>

				<view class="p1">
					立即加盟分销商
				</view>
			</view>
			<view class="block">

				<view class="p2">
					多重好礼任你选，各种特权
				</view>
				<view class="p3" @click="tojoin">
					立即加盟
				</view>
			</view>

		</view>

		<view v-else class="block1">
			<view style="display: flex;justify-content: space-between;">
				<view class="myorder">
					分销中心
				</view>
				<view style="padding-top: 15rpx;color: rgba(124, 124, 124, 1);margin-right: 20rpx;" @click="toall">
					全部订单
					<uni-icons type="right" size="14" color=" rgba(124, 124, 124, 1)"
						style="margin-left: -5rpx;"></uni-icons>
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
					<view class="img">
						<img :src="item.icon" alt="" mode="aspectFill" />
					</view>
					<view style="font-size: 27rpx;color: rgba(102, 102, 102, 1);">
						{{ item.name }}
					</view>

				</view>
			</view>

		</view>

		<TnPopup v-model="feedback" bg-color="#FFFFFF" width="660" height="280">
			<view style="margin: 30rpx">
				<TnForm>
					<TnFormItem label="反馈内容" label-width="auto">
						<TnInput type="textarea" placeholder="请输入反馈内容" height="150" v-model="feedbackContent" />
					</TnFormItem>
				</TnForm>
			</view>
			<view class="footer">
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
				<view class="user_text">
					获取用户头像、昵称，主要用于向用户提供具有辨识度的用户体验
				</view>
				<button class="up_avatar" open-type="chooseAvatar" @chooseavatar="chooseavatar">
					<image v-if="login_form.avatar" :src="login_form.avatar" mode=""></image>
					<TnIcon v-else name="upload" size="70" color="#e4e9ec" />
				</button>
				<view class="user_name">
					<input type="nickname" v-model="login_form.name" placeholder="请输入昵称" />
				</view>

				<button class="login center" :open-type="login_form.name && login_form.avatar ? 'getPhoneNumber' : ''"
					@getphonenumber="getphonenumber"
					:style="login_form.name && login_form.avatar ? 'background:#0066cc !important;color:#fff' : ''">
					<text>登 录</text>
				</button>
			</view>
		</TnPopup>

	</view>
</template>
<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { UserStore } from '@/store'
import { uploadImage, Login } from '@/api/user/user'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
import TnForm from '@/uni_modules/tuniaoui-vue3/components/form/src/form.vue'
import TnFormItem from '@/uni_modules/tuniaoui-vue3/components/form/src/form-item.vue'
import TnInput from '@/uni_modules/tuniaoui-vue3/components/input/src/input.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'

const store = UserStore()

const isBuyer = ref(false)

const funList0 = ref([
	{
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

let funList = [
	{
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

// 反馈的弹出窗
const feedback = ref(false)

// 反馈的内容
const feedbackContent = ref('')

// 登录弹窗
const loginVisible = ref(false)

const login_form = ref({
	name: undefined,
	avatar: undefined
})

// 点击分销
const tap_item = (index) => {
	console.log(index)
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
	console.log(index)
	uni.navigateTo({
		url: '/pages/me/order/index?index=' + index
	})
}

// 点击我的应用的内容
const tap_application = (index) => {
	console.log(index)
	// 账号设置
	if (index === 0) {
		uni.navigateTo({
			url: '/pages/me/account/index'
		})
	}
	// 收货地址
	if (index === 1) {
		uni.navigateTo({
			url: '/pages/me/address/index'
		})
	}
	// 我的优惠券
	if (index === 3) {
		uni.navigateTo({
			url: '/pages/me/coupon/index'
		})
	}
	// 点击反馈
	if (index === 4) {
		feedback.value = true
	}
}

const getphonenumber = (e) => {
	console.log(e)
	// 获取成功
	if (e.detail.errMsg === 'getPhoneNumber:ok') {
		uni.login({
			success: (s) => {
				// 登录
				Login({
					code: s.code,
					avatar: login_form.value.avatar,
					name: login_form.value.name
				}).then(res => {
					console.log(res)
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
}

// 选择头像
const chooseavatar = (e) => {
	// 转换为base64
	const base64 = uni.getFileSystemManager().readFileSync(e.detail.avatarUrl, 'base64')
	// 添加前缀
	// console.log(login_form.value.avatar)
	login_form.value.avatar = 'data:image/png;base64,' + base64
	uploadImage(login_form.value.avatar).then(res => {
		console.log(res)
	})
}

const getData = () => {
	const list = [
		{
			name: '账号设置',
			icon: '../../static/icon/me/setting.png'
		},
		{
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
		}
	]
	funList1.value = list
}

onShow(() => {
	getData()
})
</script>

<style lang="scss" scoped>
page {
	width: 750rpx;
	height: auto;
	background: linear-gradient(0deg, rgba(240, 240, 240, 1.0) 67.000002%, rgba(240, 224, 198, 1)100.000002%);

	.top {
		height: 150rpx;
		display: flex;
		margin: 150rpx 0 40rpx;

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

	.footer {
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;


	}
}
</style>