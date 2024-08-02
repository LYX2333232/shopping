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
    <button class="btn" @click="priceVisible = true">立即提现</button>
    <view class="title">提现记录</view>
    <view class="card" v-for="record in recordList" :key="record.id">
      <view>
        <view class="name">提现至微信零钱</view>
        <view class="time">{{ record.updated_at }}</view>
      </view>
      <view class="price">{{ record.price }}</view>
    </view>
  </view>
  <TnPopup v-model="priceVisible">
    <view style="width: 600rpx;height: 300rpx;padding: 20px;display: flex;flex-direction: column;align-items: center;">
      <view style="display: flex;align-items: center;">
        <view style="width: 150rpx;">提现金额</view>
        <TnInput v-model="price" placeholder="请输入提现金额" type="number"></TnInput>
      </view>
      <view style="margin-top: 80rpx;width: 80%;display: flex;justify-content: space-between;">
        <TnButton width="30%" height="50rpx" type="info" @click="cancel">取消</TnButton>
        <TnButton width="30%" height="50rpx" type="success" @click="confirm">确定</TnButton>
      </view>
    </view>
  </TnPopup>
</template>

<script setup>
import { ref } from 'vue'
import { get_balance, get_record, withdrawal } from '@/api/surplus/surplus'
import Header from '@/components/header.vue'
import { onShow } from '@dcloudio/uni-app'
import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
import TnInput from '@/uni_modules/tuniaoui-vue3/components/input/src/input.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'

// 保留两位小数
const toFixed = (num) => {
  return num.toFixed(2)
}

const usable = ref(toFixed(1))

const total = ref(toFixed(0))

const frozen = ref(toFixed(0))

const priceVisible = ref(false)
const price = ref(undefined)

const recordList = ref([
  {
    id: 1,
    price: '1.00',
    updated_at: '2024-03-16 08:09:29'
  }
])

const cancel = () => {
  priceVisible.value = false
  price.value = undefined
}

const confirm = () => {
  if (price.value === undefined) {
    uni.showToast({
      title: '请输入提现金额',
      icon: 'none'
    })
    return
  }
  if (price.value <= 0) {
    uni.showToast({
      title: '提现金额必须大于0',
      icon: 'none'
    })
    return
  }
  else {
    uni.showLoading({
      title: '正在提交'
    })
    // 提交
    withdrawal(price.value).then(res => {
      uni.hideLoading({
        success: () => {
          uni.showToast({
            title: '提现成功',
            icon: 'none'
          })
          getData()
        }
      })
    })
  }
}

const getData = () => {
  get_balance().then(res => {
    usable.value = toFixed(res.data.balance)
    total.value = res.data.cumulative
    frozen.value = toFixed(res.data.freeze)
  })
  get_record().then(res => {
    recordList.value = res.data.data
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