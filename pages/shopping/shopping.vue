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
import { onShow, onLoad, onReachBottom } from '@dcloudio/uni-app'
import shoppingCard from '@/components/shopping/shoppingCard.vue'
import TnCheckbox from '@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import { get_cart_list, del_cart } from '@/api/cart/cart'
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
	// console.log('e', e, 'i', i, 'j', j);
	dataList.value[j].order = e
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
	return total
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
	for (var good of dataList.value) {
		console.log('good', good)
		if (good.order) {
			new_order({
				com_id: good.item_id,
				address_id: address.address_id,
				com_cont: good.cont
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
							// 删除该商品
							del_cart(good.id).then(res => {
								if (res.code === 200) {
									getData()
								}
							})
						}
					},
					fail: function (err) {
						console.log('fail', err)
					}
				})
			})
		}
	}
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