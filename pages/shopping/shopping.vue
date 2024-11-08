<template>
	<view class="top">
		<view class="map" @click="toEditAddress">
			<TnIcon name="map" size="40" />
			<view class="text">
				{{ address.address ?? '定位失败' }}
			</view>
			<TnIcon name="down" size="40" />
		</view>
		<view class="tn-flex-center-between">
			<view class="title">
				购物车
			</view>
			<view class="delete">
				删除
			</view>
		</view>
	</view>
	<view class="all">
		<view v-if="dataList.length > 0" class="card">
			<shoppingCard v-for="(data, index) in dataList" :key="index" :index="index" :data="data" @change="change"
				@changeNum="changeNum"></shoppingCard>
		</view>
		<view v-if="deleteList.length > 0" class="card">
			<deleteCard v-for="(data, index) in deleteList" :key="index" :data="data" />
		</view>
		<view v-if="dataList.length === 0" class="empty">
			<TnEmpty mode="cart">
				<template #icon>
					<image
						src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhTcBKpUgwer5OCCic51cf2LcV60EdpTKrgv3dLu4wuOFc8iapxtqboZT3lFKDKrgqic8JOzmdT0nQevg/0?wx_fmt=png"
						mode=" scaleToFill" />
				</template>
				<template #tips>
					<view>
						您还没有添加商品
					</view>
				</template>
			</TnEmpty>
		</view>
		<view v-if="dataList.length > 0" class="suggest">
			<image
				src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhTcBKpUgwer5OCCic51cf2LcTZxA5rVFQEGxtVt0kIP1dxic6tTEgrte4Uelyw6FcO7HaVDicj9RUnqA/0?wx_fmt=png"
				mode="scaleToFill" class="logo" />
			<TnWaterFall :data="infoList" mode="calc">
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
	</view>

	<view class="fix-bottom">
		<!-- <view style="width:90%;display: flex;justify-content: space-between;margin: 30rpx auto;">
			<view>{{ select_coupon !== undefined ? select_coupon.name : '暂无优惠券' }} </view>
			<text style="color: #C7BAA5;text-decoration: underline;" @click="openPopup">选择优惠券></text>
		</view> -->
		<view class="bottom">
			<view class="tn-flex-center-start">
				<TnCheckbox v-model="orderAll" :indeterminate="orderSome" @change="changeOrderAll"
					checked-shape="circle" size="lg" active-color="#14bf20"></TnCheckbox>
				<view class="button">全选</view>
			</view>
			<view class="right">
				<view class="text-price">
					<view class="tn-flex-center-start">
						<view class="text">总计</view>
						<view class="price">¥{{ total.toFixed(2) }} </view>
					</view>
					<view class="coupon">
						优惠券
					</view>
				</view>
				<TnButton width="220" type="success" shape="round" font-size="30" @click="tocaculate">
					结算（{{ select_goods.length }}）
				</TnButton>
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
			<view v-for="good in select_goods" class="good" :key="good.id">
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
import { onShow, onReachBottom } from '@dcloudio/uni-app'

import TnCheckbox from '@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
import TnEmpty from '@/uni_modules/tuniaoui-vue3/components/empty/src/empty.vue'
import TnWaterFall from '@/uni_modules/tuniaoui-vue3/components/water-fall/src/water-fall.vue'
import deleteCard from '@/components/shopping/deleteCard.vue'
import shoppingCard from '@/components/shopping/shoppingCard.vue'
import { get_commodity } from '@/api/index/index'
import { get_cart_list, del_cart, get_coupon } from '@/api/cart/cart'
import { new_order, get_order_price } from '@/api/order/order'
import { AddressStore } from '@/store'

const address = AddressStore()
let page = 1

const toEditAddress = () => {
	uni.navigateTo({
		url: '/pages/selectAddress/index'
	})
}

const dataList = ref([])

const select_goods = ref([])

const deleteList = ref([])

const infoList = ref([])


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
const orderSome = computed(() => {
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

const openPopup = () => {
	if (select_goods.value.length === 0) {
		uni.showToast({
			title: '先请选择商品',
			icon: 'none'
		})
		return

	}
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
		page = 1
		dataList.value = res.data.data.map(item => {
			return {
				...item,
				order: false
			}
		})
		deleteList.value = res.data.data.map(item => {
			return {
				...item,
				order: false
			}
		})
	})
	get_commodity({ ids: infoList.value.map(item => item.id) }).then(res => {
		infoList.value = res.data.data
	})
}
onShow(() => {
	getData()
	// 用以在选择地址后更新地址
	// const option = {
	// 	address_id: address.address_id,
	// 	com_id: select_good.value.item_id,
	// 	com_cont: select_good.value.cont
	// }
	// if (select_coupon.value)
	// 	option.coupon_id = select_coupon.value.coupon_id
	// get_order_price(option).then(res => {
	// 	detail_price.value = res.data
	// })
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
	get_commodity({ ids: infoList.value.map(item => item.id) }).then(res => {
		infoList.value = res.data.data
	})
})
</script>

<style lang="scss" scoped>
.top {
	padding: 0 20rpx 20rpx;
	width: 100%;
	height: 20vh;
	position: fixed;
	top: 0;
	left: 0;
	background: #FFF;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	z-index: 999;

	.map {
		display: flex;
		align-items: center;
		margin-bottom: 45rpx;

		.text {
			max-width: 333rpx;
			//设置超出长度时用省略号表示
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			z-index: 1;
			color: #0A3C0B;
		}
	}

	.title {
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 36rpx;
		color: #333333;
		line-height: 50rpx;
		text-align: left;
		font-style: normal;
	}

	.delete {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 28rpx;
		color: #666666;
		line-height: 40rpx;
		text-align: left;
		font-style: normal;
	}
}

.all {
	margin-top: 20vh;
	padding: 20rpx 40rpx 200rpx;
	background: #F7F7F7;
	min-height: 80vh;
	display: flex;
	flex-direction: column;
	align-items: center;

	.card {
		margin: 20rpx 0;
		width: 100%;
		padding: 20rpx;
		background: #FFFFFF;
		border-radius: 13rpx;
	}

	.empty {
		margin-top: 150rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 30rpx;
		color: #666666;
		line-height: 42rpx;

		image {
			width: 240rpx;
			height: 240rpx;
		}
	}
}

.suggest {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;

	.logo {
		width: 225rpx;
		height: 30rpx;
		margin: 40rpx;
	}

	.block3 {
		width: 90%;
		background: #FFF;
		margin-bottom: 20rpx;
		border-radius: 20rpx;

		.image {
			width: 300rpx;
			height: 300rpx;
		}

		.name {
			margin: 14rpx;
			width: 300rpx;
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
			width: 300rpx;
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
}

.fix-bottom {
	width: 750rpx;
	background: #FFFFFF;
	position: fixed;
	bottom: 0;

	.bottom {
		width: 90%;
		margin: 10rpx auto;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.button {
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 26rpx;
			color: #999999;
			line-height: 37rpx;
			text-align: center;
			font-style: normal;
		}

		.right {
			display: flex;

			.text-price {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				margin-right: 22rpx;

				.text {
					font-family: PingFangSC, PingFang SC;
					font-weight: 500;
					font-size: 24rpx;
					color: #333333;
					line-height: 33rpx;
					text-align: left;
					font-style: normal;
				}

				.price {
					font-family: PingFangSC, PingFang SC;
					font-weight: 600;
					font-size: 36rpx;
					color: #EE2532;
					line-height: 50rpx;
					text-align: left;
					font-style: normal;
				}

				.coupon {
					font-family: PingFangSC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #999999;
					line-height: 33rpx;
					text-align: left;
					font-style: normal;
				}
			}
		}
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
