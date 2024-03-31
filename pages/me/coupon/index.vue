<template>
  <Header title="优惠券页面"></Header>
  <view class="all">
    <view class="card" v-for="(card, index) in cardList" :key="index">
      <image :src="card.img" mode="scaleToFill" style="width:142rpx; height:142rpx;" />
      <view class="main">
        <view class="title" :style="card.state !== 0 ? 'color:#FFC542' : 'color:#D4D1D4'">{{ card.name }}</view>
        <view>
          <view class="price" :style="card.state !== 0 ? 'color:#FFC542' : 'color:#D4D1D4'">￥{{ card.reduce }}</view>
          <view class="info">满{{ card.full }}可用 有效期：{{ card.start }}-{{ card.end }}</view>
        </view>
      </view>
      <image v-if="card.state === 0" style="position:absolute;right:0;height:110%"
        src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sUFia07a8IfOLMMxk4ourxSVCMqEDSOgdKoOy3rcAO5FcqZtjFdSvtSQ/0?wx_fmt=png"
        mode="heightFix" />
      <image v-if="card.state === 1" style="position:absolute;right:0;height:110%"
        src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sIUR2By0G9qPtnGrstLg7Vwz62zre4uAWJtQfm4cD77g4goiaSg6BUnQ/0?wx_fmt=png"
        mode="heightFix" />
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

const getData = () => {
  // const list = [
  //   {
  //     img: 'https://source.unsplash.com/random',
  //     title: '优惠券1',
  //     price: 100,
  //     threshold: 200,
  //     start_time: '8-23',
  //     end_time: '8-30',
  //     status: 0//0已过期，1待使用，2已使用
  //   },
  //   {
  //     img: 'https://source.unsplash.com/random',
  //     title: '优惠券2',
  //     price: 100,
  //     threshold: 200,
  //     start_time: '8-23',
  //     end_time: '8-30',
  //     status: 1
  //   },
  //   {
  //     img: 'https://source.unsplash.com/random',
  //     title: '优惠券3',
  //     price: 100,
  //     threshold: 200,
  //     start_time: '8-23',
  //     end_time: '8-30',
  //     status: 0
  //   },
  //   {
  //     img: 'https://source.unsplash.com/random',
  //     title: '优惠券4',
  //     price: 100,
  //     threshold: 200,
  //     start_time: '8-23',
  //     end_time: '8-30',
  //     status: 1
  //   },
  //   {
  //     img: 'https://source.unsplash.com/random',
  //     title: '优惠券5',
  //     price: 100,
  //     threshold: 200,
  //     start_time: '8-23',
  //     end_time: '8-30',
  //     status: 2
  //   }
  // ]
  get_my_coupon(1).then(res => {
    console.log(res)
    cardList.value = res.data.data
  })
}

onShow(() => {
  getData()
})

onReachBottom(() => {
  page++
  get_my_coupon(page).then(res => {
    console.log(res)
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