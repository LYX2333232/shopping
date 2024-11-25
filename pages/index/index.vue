<template>
	<view class="all">
		<view class="contain">
			<view class="map" @click="address_visible = true">
				<TnIcon name="map" size="40" />
				<view class="text">
					{{ address.address ?? '定位失败' }}
				</view>
				<TnIcon name="down" size="40" />
			</view>
			<view class="tab">
				<view class="pic">
					<image src="/static/index/title.png" mode="scaleToFill" />
				</view>
				<view class="search" @click="toSearch">
					<view style="flex:1">
						<TnIcon name="search" size="40" />
					</view>
					<input style="flex:auto" type="text" disabled />
					<view>
						<TnButton type="success" shape="round">搜索</TnButton>
					</view>
				</view>
			</view>
			<TnSwiper loop autoplay :data="swiperData" width="100%" height="280" indicator indicator-type="dot"
				indicator-active-bg-color="#FFF" indicator-bg-color="rgba(255,255,255,0.6)">
				<template #default="{ data }">
					<view class="swiper-data">
						<image style="width: 710rpx;height: 274rpx;" :src="data.path" mode="scaleToFill"
							@click="toWeb(data.path)"></image>
					</view>
				</template>
			</TnSwiper>
			<view class="desc">
				<view class="item">
					<TnIcon name="/static/index/self.png" size="25" />
					<view style="margin-left:20rpx">
						官方自营
					</view>
				</view>
				<view class="item">
					<TnIcon name="/static/index/time.png" size="25" />
					<view style="margin-left:20rpx">
						同城30分钟达
					</view>
				</view>
				<view class="item">
					<TnIcon name="/static/index/sale.png" size="25" />
					<view style="margin-left:20rpx">
						售后无忧
					</view>
				</view>
			</view>
			<view class="functions">
				<image class="item" v-for="(_, index) in 4" :src="`/static/index/item${index}.png`" :key="index"
					@click="top_button(index)" />
			</view>
			<view class="seckill" v-if="seckill_list.length > 0" @click="toSeckill">
				<view class="top">
					<view style="z-index:2">全场低价秒</view>
					<TnButton type="success" shape="round">去看看></TnButton>
				</view>
				<view class="items">
					<view v-for="card in seckill_list" :key="card.id" class="item">
						<image :src="card.path" mode="scaleToFill" class="image" />
						<view class="flash">
							￥{{ card.flash_price }}
						</view>
						<view class="old">
							￥{{ card.price }}
						</view>
					</view>
				</view>
			</view>
			<view class="today" v-if="today_list.length > 0" @click="toToday">
				<view class="more">
					<view style="z-index:2">
						查看更多
					</view>
					<view class="icon">></view>
				</view>
				<view class="item" v-for="item in today_list" :key="item.id">
					<image :src="item.path" mode="scaleToFill" class="image" />
					<view>
						<view class="name">
							{{ item.name }}
						</view>
						<view class="doing">
							<image :src="image.avatar" mode="scaleToFill" v-for="image in item.seng" :key="image.id"
								class="avatar" />
							已有{{ item.seng_count }}人拼团
						</view>
						<TnTag font-size="22" border bg-color="transparent" text-color="#FF1F25" border-color="#FF1F25"
							shape="circle">
							立省{{ (item.teamwork_price - item.price).toFixed(2) }}元
						</TnTag>
						<view class="bottom">
							<view class="left">
								<view class="price">
									拼团价￥ <text style="font-size:25rpx;">{{ item.price }}</text>
								</view>
								<view class="old">
									￥{{ item.teamwork_price }}
								</view>
							</view>
							<view class="button">
								立即拼团
							</view>
						</view>
					</view>
				</view>
			</view>
			<TnWaterFall ref="waterfall" :data="infoList" mode="calc">
				<template #left="{ item }">
					<view class="block3" @click="toDetail(item.id)">
						<image :src="item.path" mode="aspectFit" class="image"></image>
						<view class="name">
							{{ item.name }}
						</view>
						<view class="good-desc">
							{{ item.desc }}
						</view>
						<view class="bottom">
							<view class="left">
								<view class="price">
									¥{{ item.price }}
								</view>
								<view v-if="item.or_price" class="old">
									￥{{ item.or_price }}
								</view>
							</view>
							<TnButton icon="cart" type="success" shape="circle" font-size="40"></TnButton>
						</view>
					</view>
				</template>
				<template #right="{ item }">
					<view class="block3" @click="toDetail(item.id)">
						<image :src="item.path" mode="aspectFit" class="image"></image>
						<view class="name">
							{{ item.name }}
						</view>
						<view class="good-desc">
							{{ item.desc }}
						</view>
						<view class="bottom">
							<view class="left">
								<view class="price">
									¥{{ item.price }}
								</view>
								<view v-if="item.or_price" class="old">
									￥{{ item.or_price }}
								</view>
							</view>
							<TnButton icon="cart" type="success" shape="circle" font-size="40"></TnButton>
						</view>
					</view>
				</template>
			</TnWaterFall>
		</view>
		<AddressPopup :visible="address_visible" :select_id="address.id" @changeAddress="changeAddress"
			@close="address_visible = false" />
	</view>
</template>

<script setup>
import TnSwiper from '@/uni_modules/tuniaoui-vue3/components/swiper/src/swiper.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnWaterFall from '@/uni_modules/tuniaoui-vue3/components/water-fall/src/water-fall.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import TnTag from '@/uni_modules/tuniaoui-vue3/components/tag/src/tag.vue'
import { ref } from 'vue'
import { onShow, onReachBottom, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

import AddressPopup from '@/components/AddressPopup'
import { AddressStore } from '@/store'
import { get_home, get_commodity } from '@/api/index'
import { get_today_list } from '@/api/index/today/today'

const address = AddressStore()
const address_visible = ref(false)
const changeAddress = item => {
	address.setAddress(item.address_name + item.detail, item.name, item.phone, item.id)
}
// 轮播图数据	
const swiperData = ref([])

const toWeb = path => uni.navigateTo({
	url: '/pages/web/index?src=' + path
})

// 顶部的按钮
const top_button = async index => {
	if (index === 3)
		uni.navigateTo({
			url: '/pages/index/coupon/index'
		})
	else {
		uni.setStorageSync('index', index)
		uni.switchTab({
			url: '/pages/goods/goods',
		})
	}
}

// 秒杀商品
const seckill_list = ref([])

const toSeckill = () => uni.navigateTo({
	url: '/pages/index/seckill/index'
})

// 今日开团商品
const today_list = ref([])

const toToday = () => uni.navigateTo({
	url: '/pages/index/today/index'
})

const waterfall = ref()

// 底部推荐商品
const infoList = ref()

const toDetail = (id) => {
	uni.navigateTo({
		url: '/pages/goods/goods_detail?id=' + id,
	})
}

const getData = () => {
	get_home().then(res => {
		swiperData.value = res.data.swiper
		seckill_list.value = res.data.flash_commodity
	})
	get_commodity({ ids: [] }).then(res => {
		infoList.value = res.data.data
	})
	get_today_list(1).then(res => {
		// 最多获取两个
		today_list.value = res.data.data.slice(0, 2)
	})
}

// 点击输入框
const toSearch = () => {
	uni.navigateTo({
		url: '/pages/index/search/index'
	})
}

onShow(() => {
	getData()
})
onReachBottom(() => {
	const data = {
		ids: infoList.value.map(item => item.id)
	}
	get_commodity(data).then(res => {
		waterfall.value.reset()
		// 将页面滚动到数据顶部
		uni.pageScrollTo({
			selector: '.functions',
			duration: 100
		})
		infoList.value = res.data.data
	})
})

onShareAppMessage(() => {
	return {
		title: '森美臻品',
		path: '/pages/index/index'
	}
})

onShareTimeline(() => {
	return {
		title: '森美臻品',
		path: '/pages/index/index'
	}
})
</script>

<style lang="scss" scoped>
.all {
	width: 100%;
	min-height: 100vh;
	padding-top: 114rpx;
	position: relative;
	background: #F6F6F6;
	z-index: 0;
}

.all::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 500rpx;
	background: url('http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhSVIHwxfRM3wibsshXu5Wh1aanKIwgD6RgKjISicMREfe4cYpZGbfkQqgYMwHqOkI5DMHWckibTYCeJA/0?wx_fmt=png') no-repeat;
	background-size: 100% auto;
	z-index: -1;
}

.contain {
	margin: 0 20rpx;
	background: transparent;
	z-index: 2;
}

.map {
	display: flex;
	align-items: center;

	.text {
		max-width: 333rpx;
		//设置超出长度时用省略号表示
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		z-index: 1;
	}
}

.tab {
	width: 100%;
	margin: 36rpx 0 20rpx;
	display: flex;
	align-items: center;

	.pic {
		width: 162rpx;
		height: 40rpx;
		margin-right: 17rpx;
	}

	.search {
		display: flex;
		align-items: center;
		width: 530rpx;
		background: #FFF;
		border-radius: 40rpx;
		padding: 10rpx 20rpx;
	}

}

.swiper-container {
	width: 100%;
	height: 320rpx;

	.swiper-data {
		width: 100%;
		height: 100%;
		border-radius: 25rpx;

		.image {
			width: 100%;
			height: 100%;
			border-radius: inherit;
		}
	}
}

.desc {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 22rpx 0;
	color: #878787;

	.item {
		vertical-align: middle;
		display: flex;
		align-items: center;
		font-size: 25rpx;
	}
}

.functions {
	display: flex;
	text-align: center;
	justify-content: space-around;

	.item {
		width: 162rpx;
		height: 202rpx;
	}
}

.seckill {
	margin: 20rpx 0;
	width: 709rpx;
	height: 289rpx;
	position: relative;
	background: url('http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQALAl1LiaicbL5icnESbI4SrzibNddNnPdXOx9x0xhMQ0qZqC16ib9gS6UibSa3kbofcg2cYEVj58NU3gw/0?wx_fmt=png') no-repeat center center;
	background-size: 100% 100%;

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 17rpx 20rpx 20rpx 180rpx;
		color: #EB2F0F;
		font-size: 24rpx;
	}

	.items {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;

		.item {
			width: 130rpx;
			display: flex;
			flex-direction: column;
			align-items: center;


			.image {
				width: 105rpx;
				height: 105rpx;
				margin-bottom: 15rpx;
			}

			.flash {
				width: 100%;
				height: 38rpx;
				margin-bottom: 3rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				padding-right: 7rpx;
				color: #FFF;
				background: url('http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQALAl1LiaicbL5icnESbI4SrzuVcyntEnqUiaRv9BMl49AngVibkzPuf503duiadsAP36sIxQJSc6ja5PA/0?wx_fmt=png') no-repeat center center;
				background-size: 100% 100%;
				font-size: 26rpx;
			}

			.old {
				color: #999;
				text-decoration: line-through;
				font-size: 22rpx;
			}
		}
	}
}

.today {
	width: 100%;
	padding-bottom: 20rpx;
	margin: 20rpx 0;
	position: relative;
	//background: url('/static/index/today.png') no-repeat;
	background: url('http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQALAl1LiaicbL5icnESbI4SrzswCuasDY4EnFHhbW5wsBg1ne1icRDZno0yojCJRJLsux4EI3LNd080A/0?wx_fmt=png') no-repeat top center;
	background-size: 100% 584rpx;
	overflow: hidden;

	.more {
		margin: 20rpx 55rpx 34rpx 518rpx;
		display: flex;
		align-items: center;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 26rpx;
		color: #FFFFFF;
		line-height: 37rpx;
		text-align: justify;
		font-style: normal;

		.icon {
			width: 30rpx;
			height: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #FFF;
			color: #14BF20;
			z-index: 2;
			margin-left: 5rpx;
		}
	}

	.item {
		width: 680rpx;
		height: 230rpx;
		display: flex;
		margin: 20rpx;
		border-radius: 10rpx;
		background: #FFF;

		.image {
			width: 230rpx;
			height: 230rpx;
			margin-right: 16rpx;
		}

		.name {
			font-family: PingFangSC, PingFang SC;
			font-weight: bold;
			font-size: 28rpx;
			color: #333333;
			line-height: 40rpx;
			text-align: left;
			font-style: normal;
			margin: 16rpx 0 10rpx;
		}

		.doing {
			display: flex;
			align-items: center;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 22rpx;
			color: #666666;
			line-height: 30rpx;
			text-align: left;
			font-style: normal;
			margin-bottom: 28rpx;

			.avatar {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
			}

			.avatar:nth-child(n+1) {
				margin-left: -10rpx;
			}
		}

		.bottom {
			margin-bottom: 14rpx;
			width: 422rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.price {
					font-family: PingFangSC, PingFang SC;
					font-weight: 600;
					font-size: 20rpx;
					color: #EE2532;
				}

				.old {
					font-family: PingFangSC, PingFang SC;
					font-weight: 400;
					font-size: 20rpx;
					color: #999999;
					line-height: 33rpx;
					text-align: left;
					font-style: normal;
					text-decoration-line: line-through;
					margin-left: 10rpx;
				}
			}

			.button {
				width: 150rpx;
				height: 56rpx;
				background: url('http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQALAl1LiaicbL5icnESbI4SrzEvfywYPjxhicmSNNdFtlQdvwZ2ojtAVpkf77sQ1qsXQ7rXxsjaonk1A/0?wx_fmt=png') no-repeat;
				background-size: 100% 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #FFF;
			}
		}
	}
}

.main {
	display: grid;
	grid-template-columns: 1fr 1fr;
}

.block3 {
	width: 345rpx;
	background: #FFF;
	margin-bottom: 20rpx;
	border-radius: 20rpx;

	.image {
		width: 345rpx;
		height: 345rpx;
	}

	.name {
		margin: 14rpx;
		width: 317rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
		line-height: 40rpx;
		text-align: left;
		font-style: normal;
		//最多两行显示
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.good-desc {
		width: 308rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 22rpx;
		color: #999999;
		line-height: 30rpx;
		text-align: left;
		font-style: normal;
		white-space: no-wrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14rpx 14rpx 20rpx;

		.left {
			display: flex;
			align-items: center;

			.price {
				font-family: PingFangSC, PingFang SC;
				font-weight: 600;
				font-size: 36rpx;
				color: #EE2532;
				line-height: 50rpx;
				text-align: left;
				font-style: normal;
			}

			.old {
				font-family: PingFangSC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;
				line-height: 33rpx;
				text-align: left;
				font-style: normal;
				text-decoration-line: line-through;
			}
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
	}

	.pic2 {
		background-color: #a9abff;
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
		display: block;
	}
}
</style>