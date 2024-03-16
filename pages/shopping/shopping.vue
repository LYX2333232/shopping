<template>
	<view class="all">
		<view style="display: flex; margin-left: 30rpx;">
			<text style="font-size: 38rpx;font-weight: 600;">购物车</text>
			<view class="control">
				管理
			</view>
		</view>

		<shoppingCard v-for="(data, index) in dataList" :index="index" :data="data" @change="change"
			@changeNum="changeNum" @changeSelect="changeSelect"></shoppingCard>
	</view>

	<view class="bottom">
		<view style="width: 90%;margin: 0 auto;display: flex;align-items: center;">
			<TnCheckbox v-model="orderAll" :indeterminate="ordertSome" @change="changeOrderAll" checked-shape="circle"
				size="lg" active-color="#C7BAA5"></TnCheckbox>

			<view class="text2">全选</view>
			<view class="text3">总计</view>
			<view class="text4">¥{{ total }} </view>
			<view class="button" @click="tocaculate">
				结算
			</view>
		</view>

	</view>

</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'
import shoppingCard from '@/components/shopping/shoppingCard.vue'
import TnCheckbox from '@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue'
import { get_cart_list } from '@/api/cart/cart'

let page = 1

const dataList = ref([])

// 改变选中状态
const change = (e, i, j) => {
	console.log('e', e, 'i', i, 'j', j);
	dataList.value[j].items[i].order = e
}

// 修改数量
const changeNum = (e, i, j) => {
	console.log('e', e, 'i', i, 'j', j);
	dataList.value[j].items[i].number = e
}

// 修改选择
const changeSelect = (e, i, j) => {
	console.log('e', e, 'i', i, 'j', j);
	dataList.value[j].items[i].select = e
}

// 全选
const orderAll = computed({
	get: () => {
		return dataList.value.every(item => item.items.every(item => item.order))
	},
	set: (val) => {
		dataList.value.forEach(item => {
			item.items.forEach(item => {
				item.order = val
			})
		})
	}
})

// 部分选中
const ordertSome = computed(() => {
	return dataList.value.some(item => item.items.some(item => item.order))
})

// 全选
const changeOrderAll = (e) => {
	orderAll.value = e
}

const total = computed(() => {
	let total = 0
	dataList.value.forEach(item => {
		item.items.forEach(item => {
			if (item.order) {
				total += item.selections[item.select].price * item.number
			}
		})
	})
	return total
})

const getData = () => {
	console.log('获取数据');
	// const list = [
	// 	{
	// 		business: '三只松鼠官方特卖',
	// 		items: [
	// 			{
	// 				name: '休闲芒果干大礼包，50g一包超值',
	// 				selections: [
	// 					{
	// 						type: '1袋',
	// 						price: 28.8
	// 					},
	// 					{
	// 						type: '2袋',
	// 						price: 56.8
	// 					},
	// 					{
	// 						type: '3袋',
	// 						price: 84.8
	// 					},
	// 					{
	// 						type: '4袋',
	// 						price: 112.8
	// 					}
	// 				],
	// 				img: 'https://img.yzcdn.cn/vant/apple-1.jpg',
	// 				select: 0,
	// 				number: 2,
	// 				order: true
	// 			},
	// 			{
	// 				name: '休闲芒果干大礼包，50g一包超值',
	// 				selections: [
	// 					{
	// 						type: '1袋',
	// 						price: 28.8
	// 					},
	// 					{
	// 						type: '2袋',
	// 						price: 56.8
	// 					},
	// 					{
	// 						type: '3袋',
	// 						price: 84.8
	// 					},
	// 					{
	// 						type: '4袋',
	// 						price: 112.8
	// 					}
	// 				],
	// 				img: 'https://img.yzcdn.cn/vant/apple-1.jpg',
	// 				select: 2,
	// 				number: 1,
	// 				order: false
	// 			}
	// 		]
	// 	},
	// 	{
	// 		business: '三只松鼠官方特卖',
	// 		items: [
	// 			{
	// 				name: '休闲芒果干大礼包，50g一包超值',
	// 				selections: [
	// 					{
	// 						type: '11111111111111111111111111袋',
	// 						price: 28.8
	// 					},
	// 					{
	// 						type: '2袋',
	// 						price: 56.8
	// 					},
	// 					{
	// 						type: '3袋',
	// 						price: 84.8
	// 					},
	// 					{
	// 						type: '4袋',
	// 						price: 112.8
	// 					}
	// 				],
	// 				img: 'https://img.yzcdn.cn/vant/apple-1.jpg',
	// 				select: 0,
	// 				number: 2,
	// 				order: false
	// 			},
	// 			{
	// 				name: '休闲芒果干大礼包，50g一包超值',
	// 				selections: [
	// 					{
	// 						type: '1袋',
	// 						price: 28.8
	// 					},
	// 					{
	// 						type: '2袋',
	// 						price: 56.8
	// 					},
	// 					{
	// 						type: '3袋',
	// 						price: 84.8
	// 					},
	// 					{
	// 						type: '4袋',
	// 						price: 112.8
	// 					}
	// 				],
	// 				img: 'https://img.yzcdn.cn/vant/apple-1.jpg',
	// 				select: 0,
	// 				number: 2,
	// 				order: false
	// 			}
	// 		]
	// 	}
	// ]
	get_cart_list(1).then(res => {
		console.log('res', res)
		dataList.value = res.data.data
	})
}
onShow(() => {
	getData()
})

onReachBottom(() => {
	page++
	get_cart_list(page).then(res => {
		console.log('res', res)
		dataList.value = dataList.value.concat(res.data.data)
	})
})
</script>

<style lang="scss" scoped>
page {
	background-color: rgba(247, 247, 247, 1);
	padding-top: 100rpx;
}

.all {
	padding-bottom: 100rpx;
}

.control {
	width: 73rpx;
	height: 38rpx;
	background: #E2D6BF;
	border-radius: 98rpx;
	font-family: Inter, Inter;
	font-weight: 400;
	font-size: 21rpx;
	color: rgba(255, 255, 255, 1);
	line-height: 36rpx;
	text-align: center;
	margin-left: 20rpx;
	margin-top: 8rpx;
	margin-bottom: 20rpx;
}

.bottom {
	width: 750rpx;
	height: 96rpx;
	background: #FFFFFF;
	position: fixed;
	bottom: 0;

	.text2 {
		color: rgba(153, 153, 153, 1);
		margin-left: 10rpx;
	}

	.text3 {
		margin-left: 90rpx;
		width: 55rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 27rpx;
		color: #000000;
	}

	.text4 {
		width: 119rpx;
		font-family: Inter, Inter;
		font-weight: normal;
		font-size: 38rpx;
		color: #834820;
		margin-left: 20rpx;
	}

	.button {
		width: 258rpx;
		height: 71rpx;
		background: #C8B697;
		border-radius: 10rpx;
		font-weight: 500;
		font-size: 31rpx;
		color: #FFFFFF;
		text-align: center;
		margin-left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>