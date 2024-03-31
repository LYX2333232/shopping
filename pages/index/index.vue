<template>
	<view v-if="!isSearching" style="background-color: #FEF0D6;">
		<TnSwiper :data="swiperData" width="100%" height="720" indicator indicator-type="dot">
			<template #default="{ data }">
				<view class="swiper-data">
					<image style="width: 750rpx;height: 780rpx;" :src="data" mode="aspectFill"></image>
				</view>
			</template>
		</TnSwiper>
	</view>

	<view v-if="!isSearching" class="white_boxs">
		<view style="width: 92%;margin: 0 auto;">
			<view class=" tab">
				<view class="pic">
					<image
						:src="user.userInfo ? user.userInfo.avatar : 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60siayiaB6TSiaibhbOM8bAnxKkpQLG0o0oUJaUw9jf2FOme0iayWCK9O7PCmw/0?wx_fmt=png'"
						mode="" style=""></image>
				</view>
				<view style="width: 580rpx;height: 50rpx;">
					<uni-section title="图标" type="line" padding>
						<uni-easyinput prefixIcon="search" v-model="value" placeholder="请输入商品关键词" :styles="styles"
							@focus="inputFocus"></uni-easyinput>
					</uni-section>
				</view>
			</view>
			<view class="function">
				<view class="tofunction" v-for="(item, index) in funList" @click="top_button(index)">
					<view class="img">
						<image :src="item.icon" alt="" mode="aspectFill" />
					</view>
					<view style="font-size: 22rpx;">
						{{ item.name }}
					</view>
				</view>
			</view>

			<view class="show_words">
				<view class="words_left">
					{{ words_left }}
				</view>
				<view style="width: 280rpx;text-align: right;border-bottom: 3rpx solid #eee7d7;">
					<view class="words_right1">{{ words_right1 }}</view>
					<view class="words_right2" style="">{{ words_right2 }}</view>
				</view>
			</view>
			<view class="area">
				<TnWaterFall :data="areaList" width="100%">
					<template #left="{ item }">
						<view class="toarea" @click="tap_item(item.id)">
							<image :src="item.icon" mode=""
								style="position: absolute; z-index: -999;width: 100%;height: 100%;"></image>
							<view class="name">
								{{ item.name }}
							</view>
							<view style="font-size: 22rpx;margin-left: 20rpx;margin-top: 10rpx;">
								查看全部
							</view>
						</view>
					</template>
					<template #right="{ item }">
						<view class="toarea" @click="tap_item(item.id)">
							<image :src="item.icon" mode=""
								style="position: absolute; z-index: -999;width: 100%;height: 100%;"></image>
							<view class="name">
								{{ item.name }}
							</view>
							<view style="font-size: 22rpx;margin-left: 20rpx;margin-top: 10rpx;">
								查看全部
							</view>
						</view>
					</template>
				</TnWaterFall>
			</view>
		</view>
	</view>

	<view v-if="isSearching" style="width:95%;margin: 180rpx auto 0;">
		<view class="tn-flex-center-start">
			<TnIcon name="left" size="50" color="#C7BAA7" @click="isSearching = false"
				:custom-style="{ marginRight: '20rpx' }">
			</TnIcon>
			<uni-easyinput prefixIcon="search" v-model="value" placeholder="请输入商品关键词" :styles="styles"
				@focus="inputFocus" @change="search">
				<template #right>
					<TnButton bg-color="#C7BAA7" text-color="#FFFFFF" width="90" height="50"
						:custom-style="{ marginRight: '10rpx' }" @click="search" shape="round">搜索</TnButton>
				</template>
			</uni-easyinput>
		</view>
		<view class="history">
			历史搜索
		</view>
		<view class="history_tag">
			<TnTag v-for="(item, index) in historyList" :key="index" shape="round" bg-color="#E7E3E1"
				text-color="#949494" :custom-style="{ marginRight: '20rpx', marginTop: '30rpx' }" @click="search(item)">
				{{ item }}</TnTag>
		</view>
	</view>
</template>

<script setup>
import TnSwiper from '@/uni_modules/tuniaoui-vue3/components/swiper/src/swiper.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import TnTag from '@/uni_modules/tuniaoui-vue3/components/tag/src/tag.vue'
import TnWaterFall from '@/uni_modules/tuniaoui-vue3/components/water-fall/src/water-fall.vue'
import { ref } from 'vue'
import { onHide, onShow } from '@dcloudio/uni-app'
import { UserStore } from '@/store'

const user = UserStore()

let words_left = "特产鲜果 有机蔬菜"
let words_right1 = "sharing love"
let words_right2 = "健康 x 营养 x 有机"

// 判断是否为搜索页
const isSearching = ref(false)
const currentSwiperIndex = ref(0)
// 轮播图数据
const swiperData = [
	'https://source.unsplash.com/random',
	'https://source.unsplash.com/random',
	'https://source.unsplash.com/random'
]

// 历史搜索数据
const historyList = ref([])

let funList = [
	{
		name: '限时秒杀',
		icon: 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60syLs1fACHZWQW3HGlicCWjxHocAllod7ceklU8PPCgWuyCzdicULVAjicg/0?wx_fmt=png'
	}, {
		name: '今日开团',
		icon: 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60s2E0Ey2Kg4KYhwWice4m1QuLwO2wa3u0zWCcucVmlibQrSbfm1o7BuANA/0?wx_fmt=png'
	}, {
		name: '领券中心',
		icon: 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60srm92zvWgCkNp5ruHn4AaRbRHavgKOsw1kWIARx9kIttxNYnvaIO5ww/0?wx_fmt=png'
	},
]
let areaList = [
	{
		id: 0,
		name: '生鲜食养',
		icon: 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sIu0aPfSmbL3SSbXRLkMiciby05PI3Hp2SC8Ys0nfjBKsVqRLXnPSVgnA/0?wx_fmt=png'
	},
	{
		id: 1,
		name: '有机专区',
		icon: 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sRLpUzyvIWGFG83tlVvjHmshjQJ4H1XjLhp5rhVkbTez9X6G9Af9icxQ/0?wx_fmt=png'
	},
	{
		id: 2,
		name: '臻臻鲜果',
		icon: 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60s7qZzOhLeibsXxQ4ZQ2iaic1CZ1IaiaJoTes1t9CoHHTJL7E5SLGkrV1L6g/0?wx_fmt=png'
	},
	{
		id: 3,
		name: '美容养颜',
		icon: 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sShq5UlxRPhOMibLxWGNmJmOdAXuWiaq09U1pp71FnfMSeh5wM7ibl96tg/0?wx_fmt=png'
	}
]
let value = ref('');
let styles = ref({
	color: 'rgba(182, 176, 167, 1)',
	borderColor: 'rgba(182, 176, 167, 1)'
})

// 顶部的按钮
const top_button = (index) => {
	if (index == 0) {
		uni.navigateTo({
			url: '/pages/index/seckill/index'
		})
	}
	if (index == 1) {
		uni.navigateTo({
			url: '/pages/index/today/index'
		})
	}
	if (index == 2) {
		uni.navigateTo({
			url: '/pages/index/coupon/index'
		})
	}
}

// 底部的图片按钮
const tap_item = (index) => {
	console.log(index)
}

const getData = () => {
	// 获取数据
	// const history = [
	// 	'芒果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'苹果干',
	// 	'车厘子'
	// ]
	// historyList.value = history
	if (!uni.getStorageSync('history')) {
		uni.setStorageSync('history', [])
	}
	historyList.value = uni.getStorageSync('history')
	console.log('history', historyList.value)
}

// 点击输入框
const inputFocus = () => {
	isSearching.value = true
	getData()
}

// 进行搜索
const search = (searching = undefined) => {
	if (searching) {
		value.value = searching
	}
	uni.setStorageSync('searchInfo', value.value)
	if (!Array.isArray(historyList.value)) {
		historyList.value = []
	}
	if (historyList.value.includes(value.value))
		historyList.value.splice(historyList.value.indexOf(value.value), 1)
	// 保存搜索历史并把value作为第一项
	historyList.value.unshift(value.value)
	// 只保留5条历史记录
	if (historyList.value.length > 5) {
		historyList.value.pop()
	}
	uni.setStorageSync('history', historyList.value)
	value.value = ''
	uni.switchTab({
		url: '/pages/goods/goods'
	})
}

onHide(() => {
	isSearching.value = false
})

onShow(() => {
	getData()
})
</script>

<style lang="scss" scoped>
.swiper-container {
	width: 100%;
	height: 320rpx;

	.swiper-data {
		width: 100%;
		height: 100%;
		border-radius: 30rpx;

		.image {
			width: 100%;
			height: 100%;
			border-radius: inherit;
		}
	}
}

.white_boxs {
	height: 70vh;
	background-color: rgba(248, 248, 248, 1);
	margin-top: -40rpx;
	border-radius: 40rpx 40rpx 0 0;
	position: relative;
	z-index: 999;

	.tab {
		height: 100rpx;
		padding-top: 22rpx;
		display: flex;

		.pic {
			width: 32px;
			height: 32px;
			margin-right: 20rpx;
			border-radius: 50rpx;
		}

	}

	.top {
		display: flex;
		flex-direction: row;
	}

	.function {
		margin-top: 50rpx;
		display: flex;
		text-align: center;
		justify-content: space-between;
	}

	.tofunction {
		box-shadow: 0rpx 0rpx 6rpx 0rpx rgba(67, 57, 41, 0.15);
		background-color: rgba(255, 255, 255, 1);
		border-radius: 6rpx;
		width: 200rpx;
		height: 160rpx;

		.img {
			width: 60rpx;
			height: 60rpx;
			text-align: center;
			margin: 0 auto;
			margin-top: 35rpx;
			margin-bottom: 25rpx;
		}
	}

	.show_words {
		display: flex;
		justify-content: space-between;
		margin-top: 25rpx;

		.words_left {
			width: 30%;
			font-size: 20px;
			color: rgba(223, 165, 42, 1);
			font-family: Microsoft YaHei UI-Bold;
			font-weight: 700;
		}

		.words_right1 {
			overflow-wrap: break-word;
			color: rgba(255, 197, 48, 1);
			font-family: Modern Antiqua-Regular;
			;
			font-size: 20px;
			overflow-wrap: break-word;
			font-weight: normal;
			white-space: nowrap;
		}

		.words_right2 {
			overflow-wrap: break-word;
			color: rgba(176, 176, 176, 1);
			font-size: 12px;
			font-family: Inter-Regular;
			font-weight: normal;
			white-space: nowrap;
			line-height: 30px;
		}
	}

	.area {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 10rpx;

		.toarea {
			position: relative;
			margin-top: 10rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 340rpx;
			height: 150rpx;
			color: white;

			.name {
				font-size: 30rpx;
				margin-top: 30rpx;
				margin-bottom: 13rpx;
				margin-left: 20rpx;

			}
		}
	}

	.search {
		display: flex;
		width: 610rpx;
		height: 72rpx;
		margin-top: 20rpx;

		border-radius: 20rpx;
		justify-content: space-between;
		border: 1.5px solid rgba(182, 176, 167, 1);

		.pic1 {
			margin-left: 20rpx;
			width: 40rpx;
			height: 40rpx;
			display: block;
			-webkit-align-self: center;
		}

		.pic2 {
			background-color: #a9abff;
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			display: block;
			-webkit-align-self: center;
		}
	}

}

.history {
	margin-top: 30rpx;
	font-family: Inter, Inter;
	font-weight: 800;
	font-size: 50rpx;
	color: #000000;
	text-align: left;
	font-style: normal;
	text-transform: none;
}

.history_tag {
	width: 90%;
	display: gird;
	grid-template-columns: repeat(auto-fit, minmax(100rpx, 1fr));
	grid-gap: 20rpx;
}
</style>