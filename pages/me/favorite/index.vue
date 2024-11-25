<template>
  <Header title="我的收藏" />
  <view class="all">
    <TnWaterFall :data="list" mode="calc">
      <template #left="{ item }">
        <view class="item" @click="toDetail(item)">
          <image :src="item.path" class="image" mode="aspectFit" />
          <view class="title">
            <text v-if="item.teamwork" class="group">{{ item.teamwork.teamwork_count }}人团 | </text>
            {{ item.name }}
          </view>
          <view class="bottom">
            <view class="left">
              <view v-if="item.teamwork" class="text">拼团价</view>
              <view class="price">
                ￥{{ item.price }}
              </view>
              <view v-if="item.or_price" class="old">
                ￥{{ item.or_price }}
              </view>
            </view>
            <TnBadge :value="item.shopping_count > 0 ? item.shopping_count : ''" type="danger">
              <image class="btn" :src="item.teamwork ? ping : cart" mode="scaleToFill" />
            </TnBadge>
          </view>
        </view>
      </template>
      <template #right="{ item }">
        <view class="item">
          <image :src="item.path" class="image" mode="aspectFit" />
          <view class="title">
            <text v-if="item.teamwork" class="group">{{ item.teamwork.teamwork_count }}人团 | </text>
            {{ item.name }}
          </view>
          <view class="bottom">
            <view class="left">
              <view v-if="item.teamwork" class="text">拼团价</view>
              <view class="price">
                ￥{{ item.price }}
              </view>
              <view v-if="item.or_price" class="old">
                ￥{{ item.or_price }}
              </view>
            </view>
            <TnBadge :value="item.shopping_count > 0 ? item.shopping_count : ''" type="danger">
              <image class="btn" :src="item.teamwork ? ping : cart" mode="scaleToFill" />
            </TnBadge>
          </view>
        </view>
      </template>
    </TnWaterFall>
    <view class="cart" @click="toCart">
      <TnBadge :value="store.cart > 0 ? store.cart : ''" type="danger">
        <TnIcon name="cart" color="#999" size="40" />
      </TnBadge>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnBadge from '@tuniao/tnui-vue3-uniapp/components/badge/src/badge.vue'
import TnWaterFall from '@tuniao/tnui-vue3-uniapp/components/water-fall/src/water-fall.vue'

import Header from '@/components/header.vue'
import { get_favorite_list } from '@/api/goods/goods'
import { CartStore } from '@/store'

const store = CartStore()

const list = ref([])

const cart = ref("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhTI3ZyKPRVmOb7uAqavN1ZFiaiacKOZnOm4M1rUUamiczAoMHWz01FWia5lpS2X83Oicn4zoN5655zDBrw/0?wx_fmt=png")
const ping = ref("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhTI3ZyKPRVmOb7uAqavN1ZFbGE4iapWDl1A7oNfJfoc8FTdVSTo0BpMFlwACIb2pWs1hWwdHdeIFyw/0?wx_fmt=png")

const getData = () => {
  get_favorite_list().then(res => {
    list.value = res.data.data
  })
}

const toDetail = item => {
  // 拼团商品
  if (item.teamwork) uni.navigateTo({ url: '/pages/index/today/detail/index?id=' + item.id })
  else uni.navigateTo({ url: '/pages/goods/goods_detail?id=' + item.id })
}

const toCart = () => uni.switchTab({ url: '/pages/shopping/shopping' })

onShow(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: #F6F6F6;
  padding: 200rpx 20rpx 0;

  .item {
    width: 345rpx;
    background: #FFF;
    margin-bottom: 20rpx;
    border-radius: 15rpx;

    image {
      width: 350rpx;
      height: 350rpx;
    }

    .title {
      margin: 15rpx;
      width: 320rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      //最多两行显示
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;

      .group {
        color: #14BF20;
      }
    }

    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14rpx;

      .left {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        color: #EE2532;

        .text {
          font-size: 24rpx;
        }

        .price {
          font-size: 36rpx;
        }

        .old {
          font-size: 24rpx;
          color: #999999;
          text-decoration-line: line-through;
        }
      }

      .btn {
        width: 56rpx;
        height: 56rpx;
      }

    }
  }

  .cart {
    position: fixed;
    left: 10rpx;
    bottom: 20vh;
    background: #FFF;
    border-radius: 50%;
    padding: 10rpx;
    box-shadow: 3rpx 3rpx 5rpx #999999;
  }
}
</style>