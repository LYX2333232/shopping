<template>
  <Header title="优惠券页面"></Header>
  <view class="all">
    <view class="card" v-for="(card, index) in cardList" :key="index">
      <image :src="card.path" mode="scaleToFill" style="width:142rpx; height:142rpx;" />
      <view class="main">
        <view class="title" :style="card.state !== 2 ? 'color:#FFC542' : 'color:#D4D1D4'">{{
          card.name }}</view>
        <view class="price" :style="card.state !== 2 ? 'color:#FFC542' : 'color:#D4D1D4'">
          <text v-if="card.type === 0 || card.type === 3">￥{{ card.number }}</text>
          <text v-if="card.type === 1">￥{{ card.reduce }} </text>
          <text v-if="card.type === 2">{{ '打' + card.number + '折' }}</text>
          <!-- ￥ {{ card.reduce }} -->
        </view>
        <view class="info" v-if="card.type === 0">
          无门槛立减{{ card.number }} 有效期：{{ card.start }} 至 {{ card.end }}
        </view>
        <view class="info" v-if="card.type === 1">
          满{{ card.full }}减{{ card.reduce }} 有效期：{{ card.start }} 至 {{ card.end }}
        </view>
        <view class="info" v-if="card.type === 2">
          打{{ card.number }}折 {{ card.start }} 至 {{ card.end }}
        </view>
        <view class="info" v-if="card.type === 3">
          {{ card.couup.com_type.name }}券 {{ card.start }} 至 {{ card.end }}
        </view>
      </view>
      <image v-if="card.state === 0" style="position:absolute;right:0;height:110%"
        src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sUFia07a8IfOLMMxk4ourxSVCMqEDSOgdKoOy3rcAO5FcqZtjFdSvtSQ/0?wx_fmt=png"
        mode="heightFix" />
      <image v-if="card.state === 1" style="position:absolute;right:0;height:110%"
        src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sIUR2By0G9qPtnGrstLg7Vwz62zre4uAWJtQfm4cD77g4goiaSg6BUnQ/0?wx_fmt=png"
        mode="heightFix" @click="toCart" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'
import { get_my_coupon } from '@/api/coupon/coupon'
import Header from '@/components/header.vue'

const cardList = ref([])

let page = 1

const toCart = () => {
  uni.switchTab({
    url: '/pages/shopping/shopping'
  })
}

const getData = () => {
  get_my_coupon(1).then(res => {
    cardList.value = res.data.data
  })
}

onShow(() => {
  getData()
})

onReachBottom(() => {
  page++
  get_my_coupon(page).then(res => {
    cardList.value = cardList.value.concat(res.data.data)
  })
})
</script>

<style lang="scss" scoped>
.all {
  padding-top: 200rpx;
  min-height: 100vh;
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