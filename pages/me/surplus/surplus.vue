<template>
  <Header title="账户余额"></Header>
  <view class="all">
    <view class="main">
      <view class="total">
        <text class="label">可提现</text>
        <text>{{ usable }}</text>
      </view>
      <view class="bottom">
        <view>
          <view class="label">累计佣金（元）</view>
          <view class="price">{{ total }}</view>
        </view>
        <view>
          <view class="label">冻结佣金（元）</view>
          <view class="price">{{ frozen }}</view>
        </view>
      </view>
    </view>
    <button class="btn">立即提现</button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/header.vue'

// 保留两位小数
const toFixed = (num) => {
  return num.toFixed(2)
}

const usable = ref(toFixed(0))

const total = ref(toFixed(0))

const frozen = ref(toFixed(0))

</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  padding-top: 180rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .main {
    width: 95%;
    padding: 50rpx 0 30rpx;
    background: #C4A37D;
    border-radius: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .total {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: Sarala, Sarala;
      font-weight: bold;
      font-size: 69rpx;
      color: #FFFFFF;
      line-height: 104rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }

    .label {
      font-family: Inter, Inter;
      font-weight: 400;
      font-size: 35rpx;
      color: rgba(255, 255, 255, 0.6);
      line-height: 46rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
      margin-top: 50rpx;
    }

    .bottom {
      width: 100%;
      display: flex;
      justify-content: space-around;
      margin-top: 40rpx;

      .price {
        font-family: Sarala, Sarala;
        font-weight: 400;
        font-size: 46rpx;
        color: #FFFFFF;
        line-height: 69rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }
    }
  }

  .btn {
    width: 60%;
    height: 100rpx;
    background: #C4A37D;
    color: #FFFFFF;
    margin-top: 60rpx;
    border-radius: 65rpx;
  }
}
</style>