<template>
	<view class="header">
		<view class="search">
			<view style="flex:1">
				<TnIcon name="search" size="40" />
			</view>
			<input style="flex:auto" type="text" v-model="searchInfo" @confirm="search" />
			<view class="flex:1">
				<TnButton type="success" shape="round" @click="search">搜索</TnButton>
			</view>
		</view>
		<view class="indexs">
			<view class="index" v-for="(item, index) in indexs" :key="item.id" @click="changeIndexs(index)">
				<image :src="item.path" mode="scaleToFill" class="image" />
				<view :class="indexs_index === index ? 'active' : ''">
					{{ indexs[index].name }}
				</view>
			</view>
		</view>
	</view>
	<view class="goods" style="display: flex;background-color:rgba(255, 255, 255, 1) ;">
		<view class="tags">
			<view :class="['tag', tag.id === tag_index ? 'active' : '']" v-for="tag in tag_list" :key="tag.id"
				@click="changeTag(tag.id)">
				<view class="text" :style="{ borderLeft: tag.id === tag_index ? ' 8rpx solid #14BF20;' : '' }">
					{{ tag.name }}
				</view>
			</view>
		</view>
		<view class="main">
			<view class="good" v-for="good in goods_list" :key="good.id" @click="toDetail(good.id)">
				<image :src="good.path" mode="scaleToFill" class="image" />
				<view class="right">
					<view class="name">
						{{ good.name }}
					</view>
					<view class="bottom">
						<view class="left">
							<view class="price">
								￥{{ good.price }}
							</view>
							<view v-if="good.type != 0">
								<image :src="good.type === 1 ? teamwork_image : flash_image" mode="aspectFill"
									style="height:30rpx;width:90rpx" />
							</view>
							<view v-if="good.or_price" class="old">
								￥{{ good.or_price }}
							</view>
						</view>
						<!-- 普通商品 -->
						<TnButton v-if="good.type === 0" icon="cart" shape="circle" type="success" font-size="40">
						</TnButton>
						<TnButton v-if="good.type === 1" shape="round" type="danger">去参团</TnButton>
						<TnButton v-if="good.type === 2" shape="round" type="danger">立即抢</TnButton>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script setup>
import { ref } from 'vue'
import { onShow, onHide, onReachBottom } from '@dcloudio/uni-app'

import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import { get_type_list, get_goods_list } from '@/api/goods/goods'

let t_id = undefined

const searchInfo = ref('')
const search = () => {
	page = 1
	getGoodsList()
}

const indexs = ref([])
const indexs_index = ref(0)
/**
 * 修改顶部的index
 * @param index 点击的index
 */
const changeIndexs = index => {
	indexs_index.value = index
	tag_list.value = indexs.value[index].new_children
	tag_index.value = indexs.value[index].new_children[0].id
	console.log(indexs.value);
	console.log(indexs.value[index]);
	page = 1
	getGoodsList()
}

// 选中的list的index
const tag_index = ref(1)
const tag_list = ref([])

let page = 1

const changeTag = (item) => {
	tag_index.value = item
	page = 1
	getGoodsList()
}

const flash_image = ref("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQALAl1LiaicbL5icnESbI4SrziajOqDoIHQNbEWZkibQEMnpZbiaKmSDL6gWEk1rJGLMOwBSZw9bw3IGoA/0?wx_fmt=png")
const teamwork_image = ref("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQALAl1LiaicbL5icnESbI4SrztIUKU5XBXWLppz530Olq6E5QlT1iceOzhaZFiat3OtKOfzibMxbBGXN5g/0?wx_fmt=png")

const goods_list = ref([])
const toDetail = (id) => {
	uni.navigateTo({
		url: '/pages/goods/goods_detail?id=' + id
	})
}
// 判断是普通商品(0)、拼团商品(1)、还是秒杀商品(2)
const checkType = good => {
	const { flash_id, flash_price, teamwork_id, teamwork_price } = good
	if (!flash_id)
		if (!teamwork_id)
			return 0
		else return 1
	else if (!teamwork_id)
		return 2
	else if (parseFloat(flash_price) < parseFloat(teamwork_price))
		return 2
	else return 1
}

const getGoodsList = async () => {
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
	// 页码
	option.page = page
	// 类别
	option.t_id = tag_index.value
	option.f_t_id = indexs.value[indexs_index.value].id

	const res = await get_goods_list(option)
	console.log(res)
	if (res.data.data.length === 0) {
		page--
		if (page === 0) goods_list.value = []
		return
	}
	if (page > 1)
		goods_list.value = goods_list.value.concat(res.data.data.map(item => ({ ...item, type: checkType(item) })))
	else goods_list.value = res.data.data.map(item => ({ ...item, type: checkType(item) }))
}

const getData = () => {
	// 获取分类列表
	get_type_list(t_id).then(res => {
		console.log(res)
		indexs.value = res.data
		tag_list.value = res.data[0].new_children
		tag_index.value = res.data[0].new_children[0].id
		getGoodsList()
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
	getGoodsList()
})
</script>

<style lang="scss" scoped>
.header {
	width: 100%;
	padding: 100rpx 20rpx 0;
	height: 25vh;
	background: linear-gradient(180deg, #F1FFE9 0%, #E0FFE3 100%);

	.search {
		display: flex;
		align-items: center;
		width: 530rpx;
		background: #FFF;
		border-radius: 40rpx;
		padding: 10rpx 20rpx;
	}

	.indexs {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;

		.index {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 24rpx;
			color: #333333;
			line-height: 33rpx;
			text-align: left;
			font-style: normal;

			.image {
				width: 72rpx;
				height: 72rpx;
				margin-bottom: 8rpx;
			}

			.active {
				padding: 1rpx 10rpx;
				background: #14BF20;
				color: #FFF;
			}
		}
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

	.tags {
		width: 180rpx;
		min-height: 70vh;
		background-color: #F1EDE9;
		display: flex;
		flex-direction: column;
		align-items: center;

		.tag {
			width: 180rpx;
			padding: 36rpx 0;

			.text {
				width: 180rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

		}

		.active {
			color: #14BF20;
			background: #FFF;
		}
	}

	.main {
		width: 100%;

		.good {
			margin: 30rpx 0;
			padding: 0 20rpx;
			width: 100%;
			min-height: 220rpx;
			display: flex;

			.image {
				width: 188rpx;
				height: 188rpx;
				margin-right: 20rpx;
			}

			.right {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.name {
					font-family: PingFangSC, PingFang SC;
					font-weight: 500;
					font-size: 26rpx;
					color: #333333;
					line-height: 37rpx;
					text-align: left;
					font-style: normal;
				}

				.bottom {
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1rpx solid #DEDEDE;

					padding-bottom: 30rpx;

					.left {
						display: flex;
						flex-wrap: wrap;
						align-items: center;

						.price {
							font-family: PingFangSC, PingFang SC;
							font-weight: 600;
							font-size: 32rpx;
							color: #EE2532;
							line-height: 45rpx;
							text-align: left;
							font-style: normal;
							margin-right: 10rpx;
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
	}
}
</style>