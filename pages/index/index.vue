<template>
	<view v-if="!isSearching" style="background-color: #FEF0D6;">
		<TnSwiper loop autoplay :data="swiperData" width="100%" height="900" indicator indicator-type="dot">
			<template #default="{ data }">
				<view class="swiper-data">
					<image style="width: 750rpx;height: 850rpx;" :src="data.path" mode="scaleToFill"
						@click="toWeb(data.path)"></image>
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

			<view class="title">
				{{ recommend }}
			</view>
			<view class="title_bottom">
				<view class="tag">微信小程序下单已上线</view>
				<view>特产鲜果 | 有机蔬菜</view>
			</view>
			<!-- <view class="show_words">
				<view class="words_left">
					{{ words_left }}
				</view>
				<view style="width: 280rpx;text-align: right">
					<view class="words_right2" style="">{{ words_right2 }}</view>
				</view>
			</view> -->
			<view class="area">
				<!-- <view class="toarea" v-for="item in areaList" @click="tap_item(item.id)">
					<image :src="item.path" mode="aspectFill"
						style="position: absolute; z-index: -999;width: 100%;height: 100%;">
					</image>
					<view class="name">
						{{ item.name }}
					</view>
					<view style="font-size: 22rpx;margin-left: 20rpx;margin-top: 10rpx;">
						查看全部
					</view>
				</view> -->
				<view style="width:100%;height:300rpx;display:flex;justify-content:space-between;align-items:center">
					<view class="toarea" style="width:50%;height:100%" @click="tap_item(areaList[0].id)">
						<image :src="areaList[0].path" mode="aspectFill"
							style="position: absolute; z-index: -999;width: 100%;height: 100%;">
						</image>
						<view class="name">
							{{ areaList[0].name }}
						</view>
					</view>
					<view
						style="width:49%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between">
						<view class="toarea" style="width:100%;height:49%" @click="tap_item(areaList[1].id)">
							<image :src="areaList[1].path" mode="aspectFill"
								style="position: absolute; z-index: -999;width: 100%;height: 100%;">
							</image>
							<view class="name">
								{{ areaList[1].name }}
							</view>
						</view>
						<view class="toarea" style="width:100%;height:49%" @click="tap_item(areaList[2].id)">
							<image :src="areaList[2].path" mode="aspectFill"
								style="position: absolute; z-index: -999;width: 100%;height: 100%;">
							</image>
							<view class="name">
								{{ areaList[2].name }}
							</view>
						</view>
					</view>
				</view>
				<view class="toarea"
					style="width:100%;height:150rpx;display:flex;justify-content:center;align-items:center;margin-top:10rpx"
					@click="tap_item(areaList[3].id)">
					<image :src="areaList[3].path" mode="aspectFill"
						style="position: absolute; z-index: -999;width: 100%;height: 100%;">
					</image>
					<view class="name">
						{{ areaList[3].name }}
					</view>
				</view>
			</view>
			<view class="title">POPULAR GOODS</view>
			<view class="title_bottom">
				<view class="tag">点击购买，即日配送</view>
				<view>优选好物 | 价格实惠</view>
			</view>
			<view class="main">
				<view class="block3" v-for="item in infoList" :key="index" @click="toDetail(item.id)">
					<view style="display: block;">
						<image :src="item.path" mode="" class="image"></image>
						<view style="width: 96%;margin: 0 auto;font-size: 24rpx;">
							{{ item.name }}
						</view>
						<view style="display: flex;justify-content: space-between;width: 94%;margin-top: 15rpx;">
							<view class="text1">
								¥{{ item.price }}
							</view>
						</view>
					</view>
				</view>
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
import { onHide, onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import { UserStore, AddressStore } from '@/store'
import { get_default_address } from '@/api/address/address'
import { get_home } from '@/api/index'
import { get_goods_list } from '@/api/goods/goods'

const user = UserStore()
const address = AddressStore()

let recommend = 'RECOMMEND FOR YOU'

// 判断是否为搜索页
const isSearching = ref(false)
// 轮播图数据
const swiperData = ref([])

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
const areaList = ref([
	{
		id: 0,
		name: '生鲜食养',
		path: 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sIu0aPfSmbL3SSbXRLkMiciby05PI3Hp2SC8Ys0nfjBKsVqRLXnPSVgnA/0?wx_fmt=png'
	},
	{
		id: 1,
		name: '有机专区',
		path: 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sRLpUzyvIWGFG83tlVvjHmshjQJ4H1XjLhp5rhVkbTez9X6G9Af9icxQ/0?wx_fmt=png'
	},
	{
		id: 2,
		name: '臻臻鲜果',
		path: 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60s7qZzOhLeibsXxQ4ZQ2iaic1CZ1IaiaJoTes1t9CoHHTJL7E5SLGkrV1L6g/0?wx_fmt=png'
	},
	{
		id: 3,
		name: '美容养颜',
		path: 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sShq5UlxRPhOMibLxWGNmJmOdAXuWiaq09U1pp71FnfMSeh5wM7ibl96tg/0?wx_fmt=png'
	}
])
let value = ref('');
let styles = ref({
	color: 'rgba(182, 176, 167, 1)',
	borderColor: 'rgba(182, 176, 167, 1)'
})

const toWeb = (path) => {
	uni.navigateTo({
		url: '/pages/web/index?src=' + path
	})
}

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
	uni.switchTab({
		url: '/pages/goods/goods?',
	})
	uni.setStorageSync('t_id', index)
}

const infoList = ref()

const toDetail = (id) => {
	uni.navigateTo({
		url: '/pages/goods/goods_detail?id=' + id,
	})
}

let page = 1

const getData = () => {
	get_home().then(res => {
		console.log(res)
		swiperData.value = res.data.swiper
		areaList.value = res.data.news
		console.log('areaList', areaList.value)
	})
	if (!uni.getStorageSync('history')) {
		uni.setStorageSync('history', [])
	}
	historyList.value = uni.getStorageSync('history')
	console.log('history', historyList.value)
	get_goods_list({ page }).then(res => {
		console.log('goods', res)
		infoList.value = res.data.data
	})
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
	if (!value.value || value.value === '') {
		return
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
	value.value = undefined
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

onLoad(() => {
	get_default_address().then(res => {
		address.setAddress(JSON.parse(res.data.address).join('-') + '-' + res.data.detail, res.data.name, res.data.phone, res.data.id)
	})
})

onReachBottom(() => {
	page++
	get_goods_list({ page }).then(res => {
		if (res.data.data.length > 0) {
			infoList.value = infoList.value.concat(res.data.data)
		} else {
			page--
		}
	})
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
	margin-top: -55rpx;
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
		align-items: center;
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
			font-size: 20rpx;
			font-family: Inter-Regular;
			font-weight: normal;
			white-space: nowrap;
			line-height: 30px;
		}
	}

	.area {
		width: 100%;
		margin-top: 10rpx;

		.toarea {
			border-radius: 20rpx;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;

			.name {
				font-size: 35rpx;
			}
		}
	}

	.title {
		font-family: Inter, Inter;
		font-weight: 600;
		font-size: 46rpx;
		color: #A09D85;
		line-height: 60rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		margin-top: 30rpx;
	}

	.title_bottom {
		margin: 20rpx 0;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 25rpx;
		color: #B0B0B0;
		line-height: 35rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		width: 100%;
		display: flex;
		justify-content: space-between;

		.tag {
			text-align: center;
			padding: 0 10rpx;
			color: #FFFFFF;
			background: #C7BAA5;
			border-radius: 10rpx;
		}
	}

	.main {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.block3 {
		display: flex;
		margin-bottom: 20rpx;
		margin-right: 25rpx;

		.image {
			width: 337rpx;
			height: 243rpx;
			border-radius: 13rpx 13rpx 13rpx 13rpx;
		}

		.text1 {
			font-family: Inter, Inter;
			font-weight: 600;
			font-size: 33rpx;
			color: #834820;
			line-height: 46rpx;
		}

		.text2 {
			font-family: Inter, Inter;
			font-weight: 500;
			font-size: 23rpx;
			color: #8D8D8D;
			margin-top: 5rpx;
			line-height: 50rpx;
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
		}

		.pic2 {
			background-color: #a9abff;
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			display: block;
		}
	}

}

.history {
	margin-top: 30rpx;
	font-family: Inter, Inter;
	font-weight: 800;
	font-size: 30rpx;
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