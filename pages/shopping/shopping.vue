<template>
	<view class="all">
		<view style="display: flex; margin-left: 30rpx;">
			<text style="font-size: 38rpx;font-weight: 600;">购物车</text>
			<view v-if="!edit" class="control" @click="changeEdit(true)">
				管理
			</view>
			<view v-else class="control" @click="changeEdit(false)">
				退出管理
			</view>
		</view>
		<view style="margin-left: 30rpx;display:flex;" @click="addressChange">
			<view class="address">
				地址：{{ address.address }}
			</view>
			<TnIcon name="down"></TnIcon>
		</view>

		<shoppingCard v-for="(data, index) in dataList" :index="index" :data="data" :edit="edit" @del="del"
			@change="change" @changeNum="changeNum"></shoppingCard>
	</view>

	<view class="bottom">
		<view style="width:90%;display: flex;justify-content: space-between;margin: 30rpx auto;">
			<view>{{ select_coupon !== undefined ? select_coupon.name : '暂无优惠券' }} </view>
			<text style="color: #C7BAA5;text-decoration: underline;" @click="openPopup">选择优惠券></text>
		</view>
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
	<TnPopup v-model="couponVisible" open-direction="bottom" height="60%">
		<view class="popup">
			<view class="card" v-for="(coupon, index) in couponList" :key="index">
				<image :src="coupon.path" mode="scaleToFill" style="width:142rpx; height:142rpx;" />
				<view class="main">
					<view class="title" :style="coupon.state !== 2 ? 'color:#FFC542' : 'color:#D4D1D4'">{{
				coupon.name }}</view>
					<view class="price" :style="coupon.state !== 2 ? 'color:#FFC542' : 'color:#D4D1D4'">
						<text v-if="coupon.type === 0 || coupon.type === 3">￥{{ coupon.number }}</text>
						<text v-if="coupon.type === 1">￥{{ coupon.reduce }} </text>
						<text v-if="coupon.type === 2">{{ '打' + coupon.number + '折' }}</text>
						<!-- ￥ {{ coupon.reduce }} -->
					</view>
					<view class="info" v-if="coupon.type === 0">
						无门槛立减{{ coupon.number }}
					</view>
					<view class="info" v-if="coupon.type === 1">
						满{{ coupon.full }}减{{ coupon.reduce }}
					</view>
					<view class="info" v-if="coupon.type === 2">
						打{{ coupon.number }}折
					</view>
					<view class="info" v-if="coupon.type === 3">
						{{ coupon.couup.com_type.name }}券
					</view>
				</view>
				<button style="height: 50rpx;background: #C8B697;color:white;font-size:20rpx"
					@click="select(coupon)">使用</button>
			</view>
		</view>
	</TnPopup>

</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow, onLoad, onReachBottom } from '@dcloudio/uni-app'
import shoppingCard from '@/components/shopping/shoppingCard.vue'
import TnCheckbox from '@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
import { get_cart_list, del_cart, get_coupon } from '@/api/cart/cart'
import { get_default_address } from '@/api/address/address'
import { new_order } from '@/api/order/order'
import { AddressStore } from '@/store'

const address = AddressStore()
let page = 1

const edit = ref(false)

const changeEdit = (e) => {
	console.log(e)
	edit.value = e
}

const addressChange = () => {
	uni.navigateTo({
		url: '/pages/shopping/selectAddress/index'
	})
}

const dataList = ref([])

// 改变选中状态
const change = (e, i, j) => {
	if (e)
		dataList.value.forEach((item, index) => {
			if (index !== j) {
				item.order = false
			}
		})
	dataList.value[j].order = e
	if (select_coupon.value) {
		uni.showToast({
			title: '请重新选择优惠券',
			icon: 'none'
		})
	}
	select_coupon.value = undefined
}

// 修改数量
const changeNum = (e, i, j) => {
	// console.log('e', e, 'i', i, 'j', j);
	dataList.value[j].cont = e
}

// 全选
const orderAll = computed({
	get: () => {
		return dataList.value.every(item => item.order)
	},
	set: (val) => {
		dataList.value.forEach(item => {
			item.order = val
		})
	}
})

// 部分选中
const ordertSome = computed(() => {
	return dataList.value.some(item => item.order)
})

// 全选
const changeOrderAll = (e) => {
	orderAll.value = e
}

const total = computed(() => {
	let total = 0
	dataList.value.forEach(item => {
		if (item.order) {
			total += item.price * item.cont
		}
	})
	return total.toFixed(2)
})

const del = (id) => {
	console.log('删除', id)
	del_cart(id).then(res => {
		if (res.code === 200) {
			uni.showToast({
				title: '删除成功',
				icon: 'none'
			})
			dataList.value = dataList.value.filter(item => item.id !== id)
		}
	})
}

const tocaculate = () => {
	console.log('结算')
	if (!address.address_id) {
		uni.showToast({
			title: '请先选择地址',
			icon: 'none',
			duration: 1000
		}).then(() => {
			setTimeout(addressChange, 1000);
		})
		return
	}
	for (var good of dataList.value) {
		console.log('good', good)
		if (good.order) {
			new_order({
				com_id: good.item_id,
				address_id: address.address_id,
				com_cont: good.cont,
				coupon_id: select_coupon ? select_coupon.id : undefined,
				shopping_cart_id: good.id
			}).then(res => {
				console.log('res', res)
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: res.data.timeStamp,
					nonceStr: res.data.nonceStr,
					package: res.data.package,
					signType: res.data.signType,
					paySign: res.data.paySign,
					success: function (res) {
						console.log('success', res)
						if (res.errMsg === 'requestPayment:ok') {
							uni.showToast({
								title: '支付成功',
								icon: 'none'
							})
						}
					},
					fail: function (err) {
						console.log('fail', err)
					}
				})
				// 删除该商品
				dataList.value = dataList.value.filter(item => !item.order)
			})
			return
		}
	}
}

const select_coupon = ref(undefined)

const select = (coupon) => {
	select_coupon.value = coupon
	couponVisible.value = false
}

const couponList = ref([])

const couponVisible = ref(false)

let coupon_page = 0

const openPopup = () => {
	// 如果获取到优惠券
	// const list = [
	// 	{
	// 		path: 'https://img.alicdn.com/tfs/TB1vKwgLpXXXXX1XpXXXXXXXXXX-200-200.png',
	// 		name: '满减优惠券',
	// 		full: '200',
	// 		reduce: '10',
	// 		start: '2021-01-01',
	// 		end: '2021-12-31',
	// 	},
	// 	{
	// 		path: 'https://img.alicdn.com/tfs/TB1vKwgLpXXXXX1XpXXXXXXXXXX-200-200.png',
	// 		name: '满减优惠券',
	// 		full: '200',
	// 		reduce: '10',
	// 		start: '2021-01-01',
	// 		end: '2021-12-31',
	// 	},
	// 	{
	// 		path: 'https://img.alicdn.com/tfs/TB1vKwgLpXXXXX1XpXXXXXXXXXX-200-200.png',
	// 		name: '满减优惠券',
	// 		full: '200',
	// 		reduce: '10',
	// 		start: '2021-01-01',
	// 		end: '2021-12-31',
	// 	},
	// 	{
	// 		path: 'https://img.alicdn.com/tfs/TB1vKwgLpXXXXX1XpXXXXXXXXXX-200-200.png',
	// 		name: '满减优惠券',
	// 		full: '200',
	// 		reduce: '10',
	// 		start: '2021-01-01',
	// 		end: '2021-12-31',
	// 	}
	// ]
	const item = dataList.value.find(item => item.order)
	if (!item) {
		uni.showToast({
			title: '先请选择商品',
			icon: 'none'
		})
		return

	}
	coupon_page = 0
	get_coupon(item.item_id, item.cont, coupon_page).then(res => {
		console.log('res', res)
		couponList.value = res.data.data
		if (couponList.value.length > 0) {
			couponVisible.value = true
		}
		else {
			uni.showToast({
				title: '暂无优惠券',
				icon: 'none'
			})
		}
	})
}

const getData = () => {
	get_cart_list(1).then(res => {
		console.log('res', res)
		dataList.value = res.data.data.map(item => {
			return {
				...item,
				order: false
			}
		})
	})
}
onShow(() => {
	getData()
})

onLoad(() => {
	console.log('onLoad')
	get_default_address().then(res => {
		address.setAddress(JSON.parse(res.data.address).join('-') + '-' + res.data.detail, res.data.id)
	})
})

onReachBottom(() => {
	page++
	get_cart_list(page).then(res => {
		console.log('res', res)
		dataList.value = dataList.value.concat(res.data.data.map(item => {
			return {
				...item,
				order: false
			}
		}))
	})
})
</script>

<style lang="scss" scoped>
page {
	background-color: rgba(247, 247, 247, 1);
	padding-top: 100rpx;
}

.all {
	margin-top: 100rpx;
	padding-bottom: 100rpx;
}

.address {
	font-family: Inter, Inter;
	font-weight: 400;
	font-size: 23rpx;
	color: #666666;
	line-height: 35rpx;
	text-align: left;
	font-style: normal;
	text-transform: none;
	max-width: 200rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.control {
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
	padding: 3rpx 10rpx;
}

.bottom {
	width: 750rpx;
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

.popup {
	padding-top: 50rpx;
	height: 100%;
	overflow: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: #F5F5F5;

	.card {
		margin-bottom: 40rpx;
		width: 85%;
		display: flex;
		align-items: center;
		position: relative;
		background: #FFFFFF;
		border-radius: 8rpx;
		padding: 12rpx;

		.main {
			height: 142rpx;
			width: 300rpx;
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.title {
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 35rpx;
				color: #FFC542;
				line-height: 35rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.price {
				font-family: Inter, Inter;
				font-weight: 500;
				font-size: 35rpx;
				color: #FFC542;
				line-height: 40rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.info {
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 17rpx;
				color: #999999;
				line-height: 26rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}
		}
	}
}
</style>
