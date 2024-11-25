<template>
	<view class="top">
		<view class="map" @click="address_visible = true">
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
			<view class="delete" @click="del">
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
			<deleteCard v-for="(data, index) in deleteList" :key="index" :data="data" @delete="Delete" />
		</view>
		<view v-if="is_empty" class="empty">
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
			<TnWaterFall ref="waterfall" :data="infoList" mode="calc">
				<template #left="{ item }">
					<view class="block3" @click="toDetail(item)">
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
					<view class="block3" @click="toDetail(item)">
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
				</view>
				<TnButton width="220" height="80" type="success" shape="round" font-size="30" @click="tocaculate">
					结算（{{ select_goods.length }}）
				</TnButton>
			</view>
		</view>
	</view>
	<AddressPopup :visible="address_visible" :select_id="address.id" @close="address_visible = false"
		@changeAddress="changeAddress" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'

import TnCheckbox from '@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import TnEmpty from '@/uni_modules/tuniaoui-vue3/components/empty/src/empty.vue'
import TnWaterFall from '@/uni_modules/tuniaoui-vue3/components/water-fall/src/water-fall.vue'
import deleteCard from '@/components/shopping/deleteCard.vue'
import shoppingCard from '@/components/shopping/shoppingCard.vue'

import AddressPopup from '@/components/AddressPopup'
import { get_commodity } from '@/api/index/index'
import { get_cart_list, del_cart } from '@/api/cart/cart'
import { AddressStore } from '@/store'

const address = AddressStore()

const address_visible = ref(false)
const changeAddress = item => {
	address.setAddress(item.address_name + item.detail, item.name, item.phone, item.id)
}

let page = 1

// 用来标记是否要显示没有购物车数据，避免用户已进入先看到空
const is_empty = ref(false)

const dataList = ref([])

const select_goods = ref([])

const deleteList = ref([])

const infoList = ref([])

const waterfall = ref()

const updateTotal = () => {
	let temp = 0
	select_goods.value = []
	dataList.value.forEach(item => {
		if (item.order) {
			select_goods.value.push(item)
			temp += item.price * item.cont
		}
	})
	total.value = temp
}

// 改变选中状态
const change = (e, i, j) => {
	dataList.value[j].order = e
}

// 修改数量
const changeNum = (e, i, j) => {
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
const orderSome = computed(() => {
	return dataList.value.some(item => item.order)
})

// 全选
const changeOrderAll = (e) => {
	orderAll.value = e
}

const del = () => {
	const list = []
	uni.showModal({
		title: '提示',
		content: '确定要删除选中的所有商品吗?',
		success: (success) => {
			if (success.confirm) {
				select_goods.value.forEach(item => {
					list.push(del_cart(item.id))
				})
				Promise.all(list).then(res => {
					if (res.code === 200) {
						dataList.value = dataList.value.filter(item => !select_goods.value.includes(item))
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						select_goods.value = []
					}
				})
			}
		},
	})
}

const Delete = id => {
	del_cart(id).then(res => {
		if (res.code === 200) {
			deleteList.value = deleteList.value.filter(item => item.id !== id)
			uni.showToast({
				title: '删除成功',
				icon: 'none'
			})
		}
	})
}

// 点击结算
const tocaculate = () => {
	if (select_goods.value.length === 0) {
		uni.showToast({
			title: '请先选择商品',
			icon: 'none'
		})
		return
	}
	const ids = select_goods.value.map(item => ({ id: item.item_id, cont: item.cont }))
	const shopping = select_goods.value.map(item => item.id)
	uni.navigateTo({
		url: `/pages/me/order/new_order?ids=${JSON.stringify(ids)}&shopping=${JSON.stringify(shopping)}` // 将选中的商品id传到订单页面
	})
}

const total = ref(0)
watch(dataList, () => {
	updateTotal()
}, { deep: true })

const getData = () => {
	get_cart_list(1).then(res => {
		page = 1
		if (res.data.data.length === 0) {
			is_empty.value = true
			return
		}
		dataList.value = res.data.data.filter(item => !item.is_deleted).map(item => {
			return {
				...item,
				order: false
			}
		})
		console.log(dataList.value);
		deleteList.value = res.data.data.filter(item => item.is_deleted).map(item => {
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
})

const toDetail = good => {
	var url = ''
	switch (good.type) {
		case 0:
			url = '/pages/goods/goods_detail?id=' + good.id
			break
		case 1:
			url = '/pages/index/today/detail/index?id=' + good.teamwork_id
			break
		case 2:
			url = '/pages/index/seckill/detail/index?id=' + good.flash_id
			break
	}
	uni.navigateTo({
		url: url
	})
}

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
		waterfall.value.reset()
		// 将页面滚动到数据顶部
		uni.pageScrollTo({
			selector: '.suggest',
			duration: 100
		})
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
		width: 100%;
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
			align-items: center;

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
