<template>
  <Header />
  <view class="all">
    <view class="card header">
      <view class="title">
        {{ title[order.state] }}
      </view>
      <view class="desc">
        15分钟后订单关闭，请尽快支付哦
      </view>
      <TnButton width="100%" height="80" shape="round" type="success">
        去支付
        <TnCountDown :time="Math.floor((order.end - new Date()) / 1000)" text-color="#FFF" separator-color="#FFF" />
      </TnButton>
    </view>
    <view class="card deliver">
      <view class="title">
        配送信息
      </view>
      <view class="tn-flex-start-start tn-m-lg tn-w-full">
        <TnIcon name="map" size="40" />
        <view class="tn-ml-sm">
          <view class="location">
            {{ order.address }}
          </view>
          <view class="info">
            {{ order.name }} {{ order.phone }}
          </view>
        </view>
      </view>
      <view class="tn-flex-center-start tn-m-lg tn-w-full">
        <TnIcon name="clock" size="40" />
        <view class="desc tn-ml-sm">
          尽快送达 预计今天15点送达
        </view>
      </view>
    </view>
    <view class="card goods">
      <view class="tn-flex-center-between tn-w-full"></view>
      <view class="tn-flex-center-start">
        <view class="title">
          商品信息
        </view>
        <view class="type">
          共{{ order.goods.length }}种
        </view>
      </view>
      <TnIcon name="right" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import TnButton from '@tuniao/tnui-vue3-uniapp/components/button/src/button.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnCountDown from '@tuniao/tnui-vue3-uniapp/components/count-down/src/count-down.vue'
import Header from '@/components/header'
import { title } from './constant'

const order = ref({ state: 0, end: new Date().setDate(new Date().getDate() + 1) })
const getDetail = () => {
  order.value = {
    state: 0,
    end: new Date().setDate(new Date().getDate() + 1),
    address: '海街道高新南2路科兴科学园A1栋201',
    name: '张三',
    phone: '13800138000',
    goods: []
  }
}

onLoad(() => {
  getDetail()
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: #F6F6F6;
  padding: 190rpx 20rpx 0;
}

.card {
  width: 100%;
  background: #FFF;
}

.header {
  padding: 30rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 38rpx;
    color: #131313;
    line-height: 53rpx;
    text-align: left;
    font-style: normal;
  }

  .desc {
    margin: 10rpx 0 30rpx;
  }
}

.deliver {
  padding: 30rpx 20rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #131313;
    line-height: 45rpx;
    text-align: left;
    font-style: normal;
    margin: 30rpx 20rpx;
  }

  .location {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 30rpx;
    color: #131313;
    line-height: 42rpx;
    text-align: left;
    font-style: normal;
  }

  .info {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    color: #999999;
    line-height: 37rpx;
    text-align: left;
    font-style: normal;
  }

  .desc {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #131313;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
  }
}

.goods {
  padding: 30rpx 20rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #131313;
    line-height: 45rpx;
    text-align: left;
    font-style: normal;
  }

  .type {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    color: #999999;
    line-height: 37rpx;
    text-align: left;
    font-style: normal;
    margin-left: 20rpx;
  }
}
</style>