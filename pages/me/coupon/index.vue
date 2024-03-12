<template>
  <Header title="优惠券页面"></Header>
  <view class="all">
    <view class="card" v-for="(card, index) in cardList" :key="index">
      <image :src="card.img" mode="scaleToFill" style="width:142rpx; height:142rpx;" />
      <view class="main">
        <view class="title">{{ card.title }}</view>
        <view>
          <view class="price">￥{{ card.price }}</view>
          <view class="info">满{{ card.threshold }}可用 有效期：{{ card.start_time }}-{{ card.end_time }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'

const cardList = ref([])

const getData = () => {
  const list = [
    {
      img: 'https://source.unsplash.com/random',
      title: '优惠券1',
      price: 100,
      threshold: 200,
      start_time: '8-23',
      end_time: '8-30',
      status: 0//0已过期，1待使用
    },
    {
      img: 'https://source.unsplash.com/random',
      title: '优惠券2',
      price: 100,
      threshold: 200,
      start_time: '8-23',
      end_time: '8-30',
      status: 1
    },
    {
      img: 'https://source.unsplash.com/random',
      title: '优惠券3',
      price: 100,
      threshold: 200,
      start_time: '8-23',
      end_time: '8-30',
      status: 0
    },
    {
      img: 'https://source.unsplash.com/random',
      title: '优惠券4',
      price: 100,
      threshold: 200,
      start_time: '8-23',
      end_time: '8-30',
      status: 1
    }
  ]
  cardList.value = list
}

onShow(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.all {
  padding-top: 200rpx;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #F7F7F7;

  .card {
    margin-bottom: 30rpx;
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