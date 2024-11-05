<template>
	<view class="all">
		<image
			src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhSVIHwxfRM3wibsshXu5Wh1aanKIwgD6RgKjISicMREfe4cYpZGbfkQqgYMwHqOkI5DMHWckibTYCeJA/0?wx_fmt=png"
			mode="aspectFit" class="background" />
		<view class="contain">
			<view class="map">
				<TnIcon name="map" size="40" />
				{{ address.address }}
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
					<view class="flex:1">
						<TnButton type="success" size="small">搜索</TnButton>
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
			<view class="seckill">
				<image src="/static/index/seckill.png" mode="scaleToFill" class="seckill-background" />
				<view class="top">
					<view style="z-index:2">全场低价秒</view>
					<TnButton type="success" size="mini" shape="round">去看看></TnButton>
				</view>
				<view class="items">
					<view v-for="card in seckill_list" :key="card.id" class="item">
						<image :src="card.path" mode="scaleToFill" class="image" />
						<view class="flash">
							<image src="/static/index/price.png" mode="scaleToFill" class="flash-background" />
							<view style="z-index:3">
								￥{{ card.flash_price }}
							</view>
						</view>
						<view class="old">
							￥{{ card.price }}
						</view>
					</view>
				</view>
			</view>
			<view class="today">
				<image src="/static/index/today.png" mode="scaleToFill" class="today-background" />
			</view>
			<view class="main">
				<view class="block3" v-for="item in infoList" :key="item.id" @click="toDetail(item.id)">
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
</template>

<script setup>
import TnSwiper from '@/uni_modules/tuniaoui-vue3/components/swiper/src/swiper.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnWaterFall from '@/uni_modules/tuniaoui-vue3/components/water-fall/src/water-fall.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import { ref } from 'vue'
import { onShow, onReachBottom, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

import { AddressStore } from '@/store'
import { get_home, get_commodity } from '@/api/index'
import { get_goods_list } from '@/api/index/seckill/seckill'

const address = AddressStore()
// 轮播图数据	
const swiperData = ref([])

const toWeb = path => uni.navigateTo({
	url: '/pages/web/index?src=' + path
})


// 顶部的按钮
const top_button = (index) => {
	if (index == 0) {
	}
	if (index == 1) {
	}
	if (index == 2) {
	}
	if (index === 3)
		uni.navigateTo({
			url: '/pages/index/coupon/index'
		})
}

// 秒杀商品
const seckill_list = ref([])

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
	})
	get_commodity({ ids: [] }).then(res => {
		infoList.value = res.data.data
	})
	// 静态数据
	seckill_list.value = [
		{
			id: 1,
			name: '商品1',
			path: 'https://loremflickr.com/100/100',
			price: '20.00',
			flash_price: '15.00'
		},
		{
			id: 2,
			name: '商品1',
			path: 'https://loremflickr.com/100/100',
			price: '20.00',
			flash_price: '15.00'
		},
		{
			id: 3,
			name: '商品1',
			path: 'https://loremflickr.com/100/100',
			price: '20.00',
			flash_price: '15.00'
		},
		{
			id: 4,
			name: '商品1',
			path: 'https://loremflickr.com/100/100',
			price: '20.00',
			flash_price: '15.00'
		},
	]
	// get_goods_list(1).then(res => {
	// 	console.log(res)
	// 	seckill_list.value = res.data.data
	// })
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
		infoList.value = res.data.data
		// 将页面滚动到数据顶部
		uni.pageScrollTo({
			selector: '.title',
			duration: 100
		})
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
	background: #F6F6F6;
	z-index: -1;
}

.background {
	position: absolute;
	top: 0;
	width: 100%;
	height: 500rpx;
	z-index: 0;
}

.contain {
	margin: 0 20rpx;
	background: transparent;
	z-index: 2;
}

.map {
	margin-top: 114rpx;
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
		z-index: 2;
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

	.seckill-background {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 17rpx 20rpx 20rpx 180rpx;
		color: #EB2F0F;
		font-size: 24rpx;
		z-index: 2;
	}

	.items {
		width: 100%;
		z-index: 2;
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
				height: 32rpx;
				margin-bottom: 3rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				margin-right: 16rpx;
				color: #FFF;
				z-index: 2;
				position: relative;

				.flash-background {
					width: 130rpx;
					height: 100%;
					position: absolute;
					z-index: 1;
				}
			}

			.old {
				color: #999;
				text-decoration: line-through;
				z-index: 2;
			}
		}
	}
}

.today {
	width: 100%;
	height: 585rpx;

	.today-background {
		width: 100%;
		height: 100%;
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
		width: 330rpx;
		height: 330rpx;
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
</style>