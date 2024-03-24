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
    <view class="title">提现记录</view>
    <view class="card" v-for="record in recordList" :key="record.id">
      <view>
        <view class="name">提现至微信零钱</view>
        <view class="time">{{ record.updated_at }}</view>
      </view>
      <view class="price">{{ record.price }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { get_balance, get_record } from '@/api/surplus/surplus'
import Header from '@/components/header.vue'
import { onShow } from '@dcloudio/uni-app'

// 保留两位小数
const toFixed = (num) => {
  return num.toFixed(2)
}

const usable = ref(toFixed(1))

const total = ref(toFixed(0))

const frozen = ref(toFixed(0))

const recordList = ref([
  {
    id: 1,
    price: '1.00',
    updated_at: '2024-03-16 08:09:29'
  }
])

const getData = () => {
  get_balance().then(res => {
    usable.value = toFixed(res.data.balance)
    total.value = res.data.cumulative
    frozen.value = toFixed(res.data.freeze)
  })
  get_record().then(res => {
    console.log(res.data)
    recordList.value = res.data
  })
}

onShow(() => {
  getData()
})

</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  padding-top: 180rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #F7F7F7;

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

  .title {
    width: 100%;
    border-top: 2rpx solid #999999;
    margin-top: 55rpx;
    padding: 40rpx 50rpx;
    font-family: Inter, Inter;
    font-weight: 400;
    font-size: 35rpx;
    color: #000000;
    line-height: 36rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }

  .card {
    width: 100%;
    background: #FFF;
    margin-top: 10rpx;
    padding: 30rpx 50rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      font-family: Inter, Inter;
      font-weight: 400;
      font-size: 35rpx;
      color: #000000;
      line-height: 32rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
      margin-bottom: 20rpx;
    }

    .time {
      font-family: Inter, Inter;
      font-weight: 400;
      font-size: 25rpx;
      color: #9D9D9D;
      line-height: 27rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

    .price {
      font-family: Inter, Inter;
      font-weight: bold;
      font-size: 35rpx;
      color: #000000;
      line-height: 36rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>