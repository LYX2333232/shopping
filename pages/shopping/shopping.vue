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
				地址：{{ address.address ?? '请选择地址' }}
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
		<view style="width: 90%;margin: 10rpx auto;display: flex;align-items: center;">
			<TnCheckbox v-model="orderAll" :indeterminate="ordertSome" @change="changeOrderAll" checked-shape="circle"
				size="lg" active-color="#C7BAA5"></TnCheckbox>

			<view class="text2">全选</view>
			<view class="text3">总计</view>
			<view class="text4">¥{{ total.toFixed(2) }} </view>
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
	<TnPopup v-model="detailVisible" open-direction="bottom" height="80%">
		<view class="goods">
			<view style="font-size:45rpx;margin-top:30rpx">价格详细</view>
			<view class="detail_address" v-if="address.address" @click="addressChange">
				<view
					style="font-size:35rpx;margin-bottom: 20rpx;max-width: 80%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
					{{ address.address }} </view>
				<view style="display:flex">
					<view style="max-width: 200rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
						{{ address.name }}
					</view>
					- {{ address.phone }}
				</view>
			</view>
			<view class="detail_address" style="font-size:35rpx;" v-else @click="addressChange">请先选择地址</view>
			<view v-for="good in select_goods" class="good">
				<image :src="good.path" style="width: 100rpx; height: 100rpx;margin-left: 30rpx;" mode="scaleToFill" />
				<view>
					{{ good.name }}
				</view>
			</view>
			<view class="good" style="color:#C7BAA5;">
				<view>商品价格</view>
				<view style="display:flex;flex-direction:column;align-items:center;">
					<view>
						￥{{ detail_price.price }}
					</view>
					<view style="text-decoration:line-through;color:black;font-size:20rpx;margin-top:10rpx;"
						v-if="detail_price.price != detail_price.show_price">
						原价：￥{{ detail_price.show_price }}
					</view>
				</view>
			</view>
			<view class="good">
				<view>
					运费
				</view>
				<view style="display:flex;flex-direction:column;align-items:center;color:#C7BAA5;">
					￥{{ detail_price.freight }}
				</view>
			</view>
			<view class="btn">
				<view class="total">
					总计：￥{{ (parseFloat(detail_price.freight) + parseFloat(detail_price.price)).toFixed(2) }}
				</view>
				<view class="button" @click="order">
					确认结算
				</view>
			</view>
		</view>
	</TnPopup>

</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onShow, onLoad, onReachBottom } from '@dcloudio/uni-app'
import shoppingCard from '@/components/shopping/shoppingCard.vue'
import TnCheckbox from '@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
import { get_cart_list, del_cart, get_coupon } from '@/api/cart/cart'
import { new_order, get_order_price } from '@/api/order/order'
import { get_default_address } from '@/api/address/address'
import { AddressStore } from '@/store'

const address = AddressStore()
let page = 1

const edit = ref(false)

const changeEdit = (e) => {
	edit.value = e
}

const addressChange = () => {
	uni.navigateTo({
		url: '/pages/shopping/selectAddress/index'
	})
}

const dataList = ref([])

const select_goods = ref([])

const updateTotal = () => {
	let temp = 0
	select_goods.value = []
	dataList.value.forEach(item => {
		if (item.order) {
			select_goods.value.push(item)
			temp += item.price * item.cont
		}
	})
	if (select_coupon.value) {
		if (select_coupon.value.type === 0 || select_coupon.value.type === 3) {
			temp -= select_coupon.value.number
		}
		else if (select_coupon.value.type === 1) {
			temp -= select_coupon.value.reduce
		}
		else if (select_coupon.value.type === 2) {
			temp *= select_coupon.value.number / 10
		}
	}
	total.value = temp
}

// 改变选中状态
const change = (e, i, j) => {
	// if (e)
	// 	dataList.value.forEach((item, index) => {
	// 		if (index !== j) {
	// 			item.order = false
	// 		}
	// 	})
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
	dataList.value[j].cont = e
	if (select_coupon.value) {
		uni.showToast({
			title: '请重新选择优惠券',
			icon: 'none'
		})
	}
	select_coupon.value = undefined
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

const del = (id) => {
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

const detailVisible = ref(false)

const detail_price = ref({
	// 运费,
	freight: 0,
	// 商品价格
	price: 0,
})

// 点击结算
const tocaculate = () => {
	if (select_goods.value.length === 0) {
		uni.showToast({
			title: '请先选择商品',
			icon: 'none'
		})
		return
	}
	//! 根据接口改变字段
	const option = {
		ids: select_goods.value.map(item => {
			return {
				id: item.item_id,
				cont: item.cont
			}
		}),
		address_id: address.address_id
	}
	if (select_coupon.value)
		option.coupon_id = select_coupon.value.coupon_id
	get_order_price(option).then(res => {
		detail_price.value = res.data
		detailVisible.value = true
	})
}

const order = () => {
	if (!address.address_id) {
		uni.showToast({
			title: '请先选择地址',
			icon: 'none',
			duration: 1000
		}).then(() => {
			setTimeout(addressChange, 500);
		})
		return
	}
	new_order({
		ids: select_goods.value.map(item => {
			return {
				id: item.item_id,
				cont: item.cont
			}
		}),
		address_id: address.address_id,
		coupon_id: select_coupon ? select_coupon.id : undefined,
		shopping_cart_ids: select_goods.value.map(item => item.id),
		freight: detail_price.value.freight,
	}).then(async res => {
		await uni.requestPayment({
			provider: 'wxpay',
			timeStamp: res.data.timeStamp,
			nonceStr: res.data.nonceStr,
			package: res.data.package,
			signType: res.data.signType,
			paySign: res.data.paySign,
			success: function (res) {
				if (res.errMsg === 'requestPayment:ok') {
					uni.showToast({
						title: '支付成功',
						icon: 'none'
					})
					// 删除该商品
					select_goods.value = []
					select_coupon.value = undefined
					detail_price.value = {
						// 运费,
						freight: 0,
						price: 0,
					}
					dataList.value = dataList.value.filter(item => !item.order)
				}
			},
			fail: function (err) {
				console.log('fail', err)
			},
			complete: function () {
				detailVisible.value = false
			}
		})

	})
	return



}

const select_coupon = ref(undefined)

const total = ref(0)
watch(dataList, () => {
	updateTotal()
}, { deep: true })

const select = (coupon) => {
	select_coupon.value = coupon
	updateTotal()
	couponVisible.value = false
}

const couponList = ref([])

const couponVisible = ref(false)

// let coupon_page = 0

const openPopup = () => {
	// const item = dataList.value.find(item => item.order)
	if (select_goods.value.length === 0) {
		uni.showToast({
			title: '先请选择商品',
			icon: 'none'
		})
		return

	}
	// coupon_page = 0
	const ids = select_goods.value.map(item => {
		return {
			id: item.item_id,
			cont: item.cont
		}
	})
	get_coupon(ids).then(res => {
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
	// 用以在选择地址后更新地址
	const option = {
		address_id: address.address_id,
		com_id: select_good.value.item_id,
		com_cont: select_good.value.cont
	}
	if (select_coupon.value)
		option.coupon_id = select_coupon.value.coupon_id
	get_order_price(option).then(res => {
		detail_price.value = res.data
	})
})

onLoad(() => {
	get_default_address().then(res => {
		address.setAddress(JSON.parse(res.data.address).join('-') + '-' + res.data.detail, res.data.name, res.data.phone, res.data.id)
	})
})

onReachBottom(() => {
	page++
	get_cart_list(page).then(res => {
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

.goods {
	width: 100%;
	height: 100%;
	overflow-y: auto;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 150rpx;
	background: #F5F5F5;

	.detail_address {
		width: 90%;
		display: flex;
		flex-direction: column;
		margin: 30rpx;
		padding: 20rpx;
		background: #FFFFFF;
	}

	.good {
		width: 90%;
		margin: 10rpx auto;
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 35rpx;
	}

	.btn {
		width: 90%;
		position: fixed;
		bottom: 0;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;

		.total {
			font-size: 35rpx;
			color: #834820;
			margin-right: 20rpx;
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
}
</style>
