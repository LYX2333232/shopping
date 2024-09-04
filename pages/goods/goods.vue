<template>
	<view class=" tab">
		<view class="pic">
			<image :src="user.userInfo.avatar"></image>
		</view>
		<view style="width: 580rpx;height: 50rpx;">
			<uni-section title="图标" type="line" padding>
				<uni-easyinput prefixIcon="search" v-model="searchInfo" placeholder="请输入商品关键词" :styles="styles"
					@change="getInfoList"></uni-easyinput>
			</uni-section>
		</view>
	</view>
	<view class="goods" style="display: flex;background-color:rgba(255, 255, 255, 1) ;">
		<view class="left">
			<view class="select" v-for="item in showSelectList" :key="item.id ?? item.t_id ?? item.f_t_id"
				:style="(item.children ? '' : 'background-color: #FFFFFF;') + (item.id === (select.t_id ?? select.f_t_id) ? 'font-weight: 800' : '')"
				@click="changeIndex(item)">
				<text v-for="(text, index) in item.name" :key="text + index">{{ text }}</text>
			</view>
		</view>
		<view class="right">
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
				<view class="block3" v-for="(item, index) in infolist" :key="index" @click="toDetail(item.id)">
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
import {
	ref
} from 'vue'
import {
	onShow,
	onHide,
	onReachBottom
} from '@dcloudio/uni-app'
import {
	get_type_list,
	get_goods_list
} from '@/api/goods/goods'

import {
	UserStore
} from '@/store'

let t_id = undefined

const searchInfo = ref('')

const user = UserStore()


let styles = ref({
	color: 'rgba(182, 176, 167, 1)',
	borderColor: 'rgba(182, 176, 167, 1)'
})

// 选中的list的index
const select = ref(0)
const selectlist = ref([])
const showSelectList = ref([])

let page = 1

const changeIndex = (item) => {
	select.value = item
	if (item.children)
		changeShowList(item.id)
	page = 1
	getInfoList()
}

const changeShowList = (id) => {
	showSelectList.value = [{
		id: 0,
		name: '全部商品',
		children: []
	}]
	selectlist.value.forEach(item => {
		showSelectList.value.push(item)
		if (item.id === id) {
			showSelectList.value.push(...item.children)
		}
	})
}

// 记录价格升序降序
const price = ref(null)
// 记录销量升序降序
const sale = ref(null)
// 选中头部的index
const upIndex = ref(0)

const changeUpIndex = (index) => {
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
	const history = uni.getStorageSync('history')
	if (searchInfo.value !== '') {
		if (history.includes(searchInfo.value)) {
			// 将该项放到第一位
			history.splice(history.indexOf(searchInfo.value), 1)
		}
		history.unshift(searchInfo.value)
		uni.setStorageSync('history', history)
	}
	const option = {}
	// 搜索商品
	option.value = searchInfo.value
	// 选中的类目
	if (select.value.f_t_id)
		option.f_t_id = select.value.f_t_id
	else if (select.value.t_id)
		option.t_id = select.value.t_id
	// 排序
	if (upIndex.value === 1) {
		option.order = 1
	} else if (upIndex.value === 2) {
		option.price_order = price.value === 'down' ? 1 : 2
		price.value = price.value === 'down' ? 'up' : 'down'
	} else if (upIndex.value === 3) {
		option.sell_order = sale.value === 'down' ? 1 : 2
		sale.value = sale.value === 'down' ? 'up' : 'down'
	}
	// 页码
	option.page = page

	const res = await get_goods_list(option)
	if (res.data.data.length === 0) {
		page--
		if (page === 0) infolist.value = []
		return
	}
	if (page > 1)
		infolist.value = infolist.value.concat(res.data.data)
	else infolist.value = res.data.data
}

const getData = () => {
	// 获取分类列表
	get_type_list(t_id).then(res => {
		selectlist.value = res.data.map(data => {
			const children = [{
				f_t_id: data.id,
				name: '全部商品'
			}]
			data.new_children.forEach(child => {
				children.push({
					t_id: child.id,
					name: child.name
				})
			})
			return {
				...data,
				f_t_id: data.id,
				children
			}
		})
		showSelectList.value = [{
			name: '全部商品',
			children: []
		}, ...selectlist.value]
		select.value = showSelectList.value[0]
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

.pages {
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	overflow: hidden;

}

.tab {
	position: fixed;
	top: 0;
	width: 100%;
	margin: 0 auto;
	padding-top: 110rpx;
	height: 209rpx;
	padding-buttom: 24rpx;
	display: flex;
	background: #ffffff;
	z-index: 3333333;

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
	display: flex;
	// height: 100vh;
	margin-top: 30rpx;
	border-radius: 40rpx 40rpx 0 0;
	margin-top: 208rpx;


	.left {
		width: 200rpx;
		height: 100%;
		background-color: #F1EDE9;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: fixed;

		.select {

			width: 200rpx;
			padding: 20rpx 0;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 30rpx;
			color: #555555;
			font-style: normal;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			letter-spacing: 0.1rem;
		}
	}

	.right {
		display: block;
		margin-left: 200rpx;
	}


	.select1 {
		position: fixed;
		top: 95px;
		width: 550rpx;
		height: 120rpx;
		font-family: Inter, Inter;
		font-weight: normal;
		color: #7E755C;
		display: flex;
		align-items: center;
		justify-content: space-around;
		z-index: 3333333;
		background-color: #ffffff;

		ov .p2 {
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
		overflow: auto;
		margin-top: 70rpx;

	}

	.block3 {
		display: flex;
		margin-left: 15rpx;

		.image {
			width: 250rpx;
			height: 250rpx;
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