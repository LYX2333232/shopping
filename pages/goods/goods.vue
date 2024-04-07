<template>
	<view class=" tab">
		<view class="pic">
			<image :src="user.userInfo.avatar" mode="" style=""></image>
		</view>
		<view style="width: 580rpx;height: 50rpx;">
			<uni-section title="图标" type="line" padding>
				<uni-easyinput prefixIcon="search" v-model="searchInfo" placeholder="请输入商品关键词" :styles="styles"
					@change="getInfoList"></uni-easyinput>
			</uni-section>
		</view>
	</view>


	<view class="goods" style="display: flex;background-color:rgba(255, 255, 255, 1) ;">
		<view style="width: 113rpx;height: 100%;background-color: #F1EDE9; ">
			<view class="select" v-for="(item, index) in selectlist" :key="index"
				:style="item.id === selectIndex ? 'background-color: #FFFFFF;' : ''" @click="changeIndex(item.id)">
				{{ item.name }}
			</view>
		</view>
		<view style="display: block;">
			<view class="select1">
				<view :style="upIndex === 0 ? 'color: #75694A;font-size: 1.1rem' : ''" @click="changeUpIndex(0)">
					综合
				</view>
				<view :style="upIndex === 1 ? 'color: #75694A;font-size: 1.1rem' : ''" @click="changeUpIndex(1)">
					最新
				</view>
				<view class="p2" :style="upIndex === 2 ? 'color: #75694A;font-size: 1.1rem' : ''"
					@click="changeUpIndex(2)">
					价格
					<view class="arrow">
						<uni-icons type="up" size="10"
							:style="price === 'up' ? ' font-weight: 800;' : 'font-weight:100'"
							:color="price === 'up' ? '#75694A' : '#7E755C'"></uni-icons>
						<uni-icons type="down" :style="price === 'down' ? ' font-weight: 800;' : 'font-weight:100'"
							size="10" :color="price === 'down' ? '#75694A' : '#7E755C'"></uni-icons>
					</view>
				</view>
				<view class="p2" :style="upIndex === 3 ? 'color: #75694A;font-size: 1.1rem' : ''"
					@click="changeUpIndex(3)">
					销量
					<view class="arrow">
						<uni-icons type="up" size="10" :style="sale === 'up' ? ' font-weight: 800;' : 'font-weight:100'"
							:color="sale === 'up' ? '#75694A' : '#7E755C'"></uni-icons>
						<uni-icons type="down" size="10"
							:style="sale === 'down' ? ' font-weight: 800;' : 'font-weight:100'"
							:color="sale === 'down' ? '#75694A' : '#7E755C'"></uni-icons>
					</view>
				</view>
			</view>
			<view class="main">
				<view class="block3" v-for="item in infolist" :key="index" @click="toDetail(item.id)">
					<view style="display: block;">
						<image :src="item.path" mode="" class="image"></image>
						<view style="width: 96%;margin: 0 auto;font-size: 24rpx;">
							{{ item.name }}
						</view>
						<view style="display: flex;justify-content: space-between;width: 94%;margin-top: 15rpx;">
							<view class="text1">
								¥{{ item.price }}
							</view>
							<view class="text2">
								已售{{ item.num }}包
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>

</template>

<script setup>
import { ref } from 'vue'
import { onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { get_type_list, get_goods_list } from '@/api/goods/goods'
import { UserStore } from '@/store'

let t_id = undefined

const searchInfo = ref('')

const user = UserStore()


let styles = ref({
	color: 'rgba(182, 176, 167, 1)',
	borderColor: 'rgba(182, 176, 167, 1)'
})

// 选中的list的index
const selectIndex = ref(0)
const selectlist = ref([])

let page = 1

const changeIndex = (index) => {
	selectIndex.value = index
	page = 1
	getInfoList()
}

// 记录价格升序降序
const price = ref(null)
// 记录销量升序降序
const sale = ref(null)
// 选中头部的index
const upIndex = ref(0)

const changeUpIndex = (index) => {
	console.log('index', index)
	upIndex.value = index
	infolist.value = []
	getInfoList()
}

const infolist = ref([])
const toDetail = (id) => {
	uni.navigateTo({
		url: '/pages/goods/goods_detail?id=' + id
	})
}

const getInfoList = async () => {
	let res
	const history = uni.getStorageSync('history')
	if (searchInfo.value !== '') {
		if (history.includes(searchInfo.value)) {
			// 将该项放到第一位
			history.splice(history.indexOf(searchInfo.value), 1)
		}
		history.unshift(searchInfo.value)
		uni.setStorageSync('history', history)
	}
	if (upIndex.value === 0) {
		res = await get_goods_list({ value: searchInfo.value, page, type: selectIndex.value })
	}
	else if (upIndex.value === 1) {
		res = await get_goods_list({ value: searchInfo.value, page, order: 1, type: selectIndex.value })
	}
	else if (upIndex.value === 2) {
		if (price.value === 'down') {
			price.value = 'up'
			res = await get_goods_list({ value: searchInfo.value, page, price_order: 1, type: selectIndex.value })
		} else {
			price.value = 'down'
			res = await get_goods_list({ value: searchInfo.value, page, price_order: 2, type: selectIndex.value })
		}
	}
	else if (upIndex.value === 3) {
		if (sale.value === 'down') {
			sale.value = 'up'
			res = await get_goods_list({ value: searchInfo.value, page, sell_order: 1, type: selectIndex.value })
		} else {
			sale.value = 'down'
			res = await get_goods_list({ value: searchInfo.value, page, sell_order: 2, type: selectIndex.value })
		}
	}
	console.log('infoList', res)
	infolist.value = infolist.value.concat(res.data.data)
}

const getData = () => {

	// 获取分类列表
	get_type_list(t_id).then(res => {
		console.log('res', res)
		selectlist.value = res.data
		selectIndex.value = selectlist.value[0].id
		page = 1
		infolist.value = []
		// 初始化数据
		getInfoList()
	})

}
onShow(() => {
	searchInfo.value = uni.getStorageSync('searchInfo') ?? ''
	t_id = uni.getStorageSync('t_id') ?? undefined

	getData()
})

onHide(() => {
	uni.setStorageSync('searchInfo', undefined)
	uni.setStorageSync('t_id', undefined)
})

onReachBottom(() => {
	page++
	getInfoList()
})
</script>

<style lang="scss" scoped>
page {
	background-color: #F7F7F7;
}

.tab {
	width: 90%;
	margin: 0 auto;
	margin-top: 110rpx;
	height: 100rpx;
	padding-top: 22rpx;
	display: flex;

	.pic {
		width: 32px;
		height: 32px;
		margin-top: 3rpx;
		margin-right: 28rpx;
		border-radius: 50rpx;
	}
}

.content {
	margin-bottom: -15rpx;
	width: 100%;
	overflow: hidden;
	overflow-x: auto;
	white-space: nowrap;
	text-align: center;
}

.item {
	border-radius: 10rpx 10rpx 10rpx 10rpx;
	display: inline-block;
	background: #fff;
	margin: 10px;
	width: 100px;
	height: 100px;
	box-shadow: 1px 1px 5px #d6cfcc;
}

.goods {
	height: 100vh;
	margin-top: 30rpx;
	border-radius: 40rpx 40rpx 0 0;
	position: relative;
	z-index: 999;

	.select {
		padding: 20rpx 30rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 30rpx;
		color: #555555;
		display: flex;
		justify-content: center;
		align-items: center;
		font-style: normal;
	}

	.select1 {
		width: 620rpx;
		height: 120rpx;
		font-family: Inter, Inter;
		font-weight: normal;
		color: #7E755C;
		display: flex;
		align-items: center;
		justify-content: space-around;

		.p2 {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			.arrow {
				margin-left: 5rpx;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
		}
	}

	.main {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.block3 {
		display: flex;
		margin-left: 15rpx;

		.image {
			width: 290rpx;
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
}
</style>