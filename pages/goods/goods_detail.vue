<template>
	<Header />
	<swiper :indicator-dots="false" autoplay circular style="height:780rpx;">
		<swiper-item v-for="(item, index) in swiperImg" :key="'swiper' + index">
			<image :src="item.path" mode="aspectFill" style="width: 100%;height: 750rpx;" @click="toWeb(item.path)">
			</image>
		</swiper-item>
	</swiper>

	<view class="white_boxs">
		<view style=" width: 90%;margin: 0 auto;">
			<view style="display: flex;">
				<view class="now">
					¥{{ size[sizeIndex].price }}
				</view>
				<view style="color: #767676;padding-top: 26rpx;font-size: 24rpx;">原价：</view>
				<view style="color: #767676;padding-top: 26rpx;font-size: 24rpx;text-decoration:line-through">
					{{ size[sizeIndex].or_price }}
				</view>
			</view>
			<view class="info">
				{{ name }}
			</view>
			<view style="display: flex;">
				<view class="type" v-for="item in typelist">
					{{ item }}
				</view>
			</view>
			<view class="block1">
				已售 {{ sell }}
			</view>
		</view>
	</view>
	<view class="detail">
		<view style="width: 90%;margin: 0 auto;">
			<view>
				规格
			</view>
			<uni-section title="更多样式 - tag" subTitle="使用mode=tag属性使用标签样式" type="line">
				<view class="uni-px-5">
					<uni-data-checkbox mode="tag" v-model="sizeIndex" :localdata="size"
						selectedColor="rgba(202, 199, 193, 1)"></uni-data-checkbox>
				</view>
			</uni-section>
			<view style="display: flex;justify-content: space-between;">
				<text>数量</text>
				<view>
					<uni-section title="基本用法" type="line" padding>
						<uni-number-box v-model="cont" @change="changeValue" :min="1" />
					</uni-section>
				</view>
			</view>
		</view>
	</view>
	<view class="moredetail">
		<view class="text1" style="width: 90%;margin: 0 auto;">
			<text>商品详情</text>
		</view>
		<view style="width: 90%;margin: 10rpx 5%;">
			<rich-text :nodes="content"></rich-text>
		</view>
		<!-- <video style="width: 922px; height: 461px;" controls="controls" width="922" height="461"><source src="https://mpvideo.qpic.cn/0bf2guaaoaaabean5xombzpfanoda42qabya.f10002.mp4?dis_k=a5f90bc0dbc726c4b2ac5b32a0821cca&amp;dis_t=1715919994&amp;play_scene=10120&amp;auth_info=f4Pqm+MDFwMyz/eloHQQBGFKBBVyJW9ZZR5YP1l5d25BVTVgAw1KbFA5aEJjVwc+aw==&amp;auth_key=dd4be7dc4502ca6325fb6791d7dee054&amp;vid=wxv_1357125600510820355&amp;format_id=10002&amp;support_redirect=0&amp;mmversion=false"></video> -->
	</view>

	<GoodNav :id="c_id" :like="like" :normal="true" @buttonClick="buttonClick" @changeLike="changeLike" />
	<!-- 分享定义在组件goods-nav中 -->
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { get_goods_detail } from '@/api/goods/goods'
import { add_to_cart } from '@/api/cart/cart'
import Header from '@/components/header.vue'
import swiper from '@/uni_modules/nutui-uni/components/swiper/swiper.vue'
import GoodNav from '@/components/goodNav'

const swiperImg = ref([])

const c_id = ref('')

const sell = ref(0)
const name = ref('')
const typelist = ref([])

// 商品规格
const size = ref([{}])

const sizeIndex = ref(0)

// 数量
const cont = ref(1)

const content = ref('')

const toWeb = (path) => {
	uni.navigateTo({
		url: '/pages/web/index?src=' + path
	})
}

const like = ref(0)

const changeLike = () => {
	like.value = 1 - like.value
}

function buttonClick() {
	// 加入购物车
	add_to_cart(size.value[sizeIndex.value].id, cont.value).then(res => {
		if (res.code == 200)
			uni.showToast({
				title: '加入购物车成功',
				icon: 'none'
			})

		else
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})

	})
}

onLoad((options) => {
	const that = this
	get_goods_detail({ id: options.id }).then(res => {
		// 轮播图
		swiperImg.value = res.data.paths

		c_id.value = res.data.id

		// 规格
		size.value = res.data.items.map((item, index) => {
			return {
				...item,
				text: item.name,
				value: index
			}
		})
		sizeIndex.value = 0

		// 商品名称
		name.value = res.data.name

		typelist.value = res.data.labels

		content.value = res.data.content.replace(/(<img [^>]*)(style="[^"]*")?/gi, '$1 style="width:100%;"')

		like.value = res.data.is_like

		sell.value = res.data.volume

		// get_evaluation_list(c_id, 1).then(e => {
		// 	commentList.value = e.data.data.map(item => {
		// 		// 将json转为数组
		// 		item.paths = JSON.parse(item.paths)
		// 		return item
		// 	})
		// })
	})
})
</script>

<style lang="scss" scoped>
page {
	background-color: rgba(248, 248, 248, 1);
}

.white_boxs {
	background-color: rgba(255, 255, 255, 1.0);
	margin-top: -40rpx;
	border-radius: 19rpx 19rpx 0rpx 0rpx;
	position: relative;
	z-index: 10;

	.now {
		height: 75rpx;
		font-family: Inter, Inter;
		font-weight: 600;
		font-size: 40rpx;
		color: #834820;
		line-height: 46rpx;
		text-align: left;
		padding-top: 18rpx;
		margin-right: 30rpx;
	}

	.info {
		font-family: Inter, Inter;
		font-weight: 600;
		font-size: 50rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.type {
		width: 120rpx;
		height: 35rpx;
		margin-top: 20rpx;
		margin-right: 15rpx;
		font-size: 19rpx;
		color: #A79A77;
		background: #FAEBD9;
		line-height: 35rpx;
		text-align: center;
		border-radius: 6rpx 6rpx 6rpx 6rpx;
	}

	.block1 {
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 23rpx;
		margin-top: 15rpx;
		color: #8A8A8A;
		line-height: 35rpx;
		padding-bottom: 40rpx;
	}
}

.detail {
	background-color: #fff;
	margin-top: 10rpx;
	padding-top: 20rpx;
	font-family: Inter, Inter;
	font-weight: 600;
	font-size: 27rpx;
	color: #75694A;
	line-height: 40rpx;
	text-align: left;

	.uni-px-5 {
		padding-top: 15rpx;
		padding-right: 15px;
		padding-bottom: 35rpx;
	}
}

.moredetail {
	width: 100%;
	background-color: #fff;
	margin: 20rpx 0 20rpx;
	padding-bottom: 200rpx;

	.text1 {
		font-family: Inter, Inter;
		font-weight: 600;
		font-size: 27rpx;
		color: #75694A;
		line-height: 40rpx;
		text-align: left;
	}
}

.comment {
	background-color: #fff;
	margin-top: 20rpx;
	padding: 20rpx 0 150rpx;

	.text1 {
		font-family: Inter, Inter;
		font-weight: 600;
		font-size: 27rpx;
		color: #75694A;
		line-height: 40rpx;
		text-align: left;
	}

	.card {
		margin-top: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 200rpx;

		.name {
			font-family: Noto Sans SC, Noto Sans SC;
			font-weight: 500;
			font-size: 23rpx;
			color: #494949;
			line-height: 27rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}
	}
}

.goods-carts {
	height: 146rpx;
	background: #FFFFFF;
	box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.2);
	border-radius: 50rpx 50rpx 0rpx 0rpx;

	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	position: fixed;
	left: 0;
	right: 0;
	/* #ifdef H5 */
	left: var(--window-left);
	right: var(--window-right);
	/* #endif */
	bottom: 0;
	z-index: 100;
}
</style>