<template>
  <Header title="优惠券页面"></Header>
  <view class="all">
    <view class="tabs">
      <view :class="['tab', active_index === 0 ? 'active' : '']" @click="changeTab(0)">
        <view class="title">优惠券</view>
        <view class="desc">
          {{ cardList.length }}张
        </view>
      </view>
      <view class="block"></view>
      <view :class="['tab', active_index === 1 ? 'active' : '']" @click="changeTab(1)">
        <view class="title">过期券</view>
        <view class="desc">历史优惠</view>
      </view>
    </view>
    <view v-if="active_index === 0" class="list usable">
      <view v-for="coupon in cardList" :key="coupon.id" class="card">
        <view class="tn-flex-center-start">
          <view class="left">
            <view class="coupon-top">
              {{ type[coupon.type] }}
            </view>
            <view class="price">
              ￥{{ coupon.number }}
            </view>
            <view class="desc">
              {{ coupon.type === 0 ? '无门槛立减' : coupon.type === 1 ? '满减' : coupon.type === 2 ? '折扣' : coupon.type === 3 ?
                '类目' : '新人' }}
            </view>
          </view>
          <view class="main">
            <view class="title">{{
              coupon.name }}</view>
            <!-- <view class="info" v-if="coupon.type === 0">
              无门槛立减{{ coupon.number }}
            </view>
            <view class="info" v-if="coupon.type === 1">
              满{{ coupon.full }}减{{ coupon.reduce }}
            </view>
            <view class="info" v-if="coupon.type === 2">
              打{{ coupon.number }}折
            </view> -->
            <view class="info" v-if="coupon.type === 3">
              {{ coupon.com_type.name }}券
            </view>
            <view class="time">
              有效期：{{ coupon.start }} 至 {{ coupon.end }}
            </view>
          </view>
        </view>
        <TnButton :type="isUsable(coupon) ? 'danger' : 'info'" shape="round" @click="toCart">
          {{ buttonText(coupon) }}
        </TnButton>
      </view>
    </view>
    <view v-else class="list unusable">
      <view v-for="coupon in cardList" :key="coupon.id" class="card">
        <view class="tn-flex-center-start">
          <view class="left">
            <view class="coupon-top">
              {{ type[coupon.type] }}
            </view>
            <view class="price">
              ￥{{ coupon.number }}
            </view>
            <view class="desc">
              {{ coupon.type === 0 ? '无门槛立减' : coupon.type === 1 ? '满减' : coupon.type === 2 ? '折扣' : coupon.type === 3 ?
                '类目' : '新人' }}
            </view>
          </view>
          <view class="main">
            <view class="title">{{
              coupon.name }}</view>
            <!-- <view class="info" v-if="coupon.type === 0">
              无门槛立减{{ coupon.number }}
            </view>
            <view class="info" v-if="coupon.type === 1">
              满{{ coupon.full }}减{{ coupon.reduce }}
            </view>
            <view class="info" v-if="coupon.type === 2">
              打{{ coupon.number }}折
            </view> -->
            <view class="info" v-if="coupon.type === 3">
              {{ coupon.com_type.name }}券
            </view>
            <view class="time">
              有效期：{{ coupon.start }} 至 {{ coupon.end }}
            </view>
          </view>
        </view>
        <TnButton :type="isUsable(coupon) ? 'danger' : 'info'" shape="round">
          {{ buttonText(coupon) }}
        </TnButton>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'

import TnButton from '@tuniao/tnui-vue3-uniapp/components/button/src/button.vue'
import { get_my_coupon } from '@/api/coupon/coupon'
import Header from '@/components/header.vue'

const active_index = ref(0)
const changeTab = index => {
  active_index.value = index
}

const cardList = ref([])

const type = ['无门槛券', '满减券', '折扣券', '类目券', '新人券']

let page = 1

const isUsable = coupon => {
  return true
  return coupon.state === 0 && new Date(coupon.end) > new Date() && new Date(coupon.start) < new Date()
}

const buttonText = coupon => {
  if (coupon.state === 0) return ''
  // 结束了
  if (new Date(coupon.end) < new Date())
    return '已过期'
  // 没开始
  const start_time = new Date(coupon.start)
  if (start > new Date())
    return `${start_time.getMonth() + 1}月${start_time.getDate()}日开始`
  // 可用
  return '去使用'
}

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
  background: #F6F6F6;

  .tabs {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .tab {
      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 40rpx;
        color: #333;
        line-height: 56rpx;
        text-align: right;
        font-style: normal;
        margin-bottom: 15rpx;
      }

      .desc {
        width: 130rpx;
        height: 32rpx;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 24rpx;
        color: #999;
        line-height: 33rpx;
        text-align: right;
        font-style: normal;
      }
    }

    .active {
      .title {
        color: #E8002A;
      }

      .desc {
        background: #E8002A;
        color: #FFF;
      }
    }

    .block {
      width: 1rpx;
      height: 60rpx;
      background: #D8D8D8;
    }
  }

  .list {
    width: 100%;
    margin-top: 30rpx;
    padding: 30rpx 20rpx;
    background: #FFF;

    .card {
      margin-bottom: 20rpx;
      width: 100%;
      height: 180rpx;
      padding-right: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        width: 200rpx;
        height: 180rpx;
        margin-right: 30rpx;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .coupon-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 136rpx;
          height: 40rpx;
          border-radius: 8rpx 0rpx 8rpx 0rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .price {
          font-family: WeChat-Sans-Std, WeChat-Sans-Std;
          font-weight: bold;
          font-size: 60rpx;
          line-height: 66rpx;
          text-align: left;
          font-style: normal;
        }

        .desc {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 22rpx;
          line-height: 30rpx;
          text-align: left;
          font-style: normal;
        }
      }

      .main {
        height: 180rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;


        .title {
          font-family: PingFangSC, PingFang SC;
          font-weight: bold;
          font-size: 28rpx;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;
        }

        .info {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 22rpx;
          line-height: 30rpx;
          text-align: left;
          font-style: normal;
        }

        .time {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 22rpx;
          line-height: 30rpx;
          text-align: left;
          font-style: normal;
        }
      }

      .right {
        height: 190rpx;
      }
    }
  }

  .usable {
    .card {
      background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhSicr23JD01fOs8hzEmFwb8vfCq3Kefaic0OH4dos360FCvZwQ2ib43ohBUcIfm3Wy0FaweEgFuFzhZA/0?wx_fmt=png") no-repeat center center;
      background-size: 100% 100%;

      .left {
        color: #FF4121;

        .coupon-top {
          background: #FF4121;
          color: #FFF;
        }
      }
    }
  }

  .unusable {
    .card {
      background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhTI3ZyKPRVmOb7uAqavN1ZF59gticJiaib4FjoiaiacA1T8cjpOyiaODPPXic8twn38VlFvmHfdgW2ialLNXA/0?wx_fmt=png") no-repeat center center;
      background-size: 100% 100%;

      .left {
        color: #C2C2C2;

        .coupon-top {
          background: #C2C2C2;
          color: #FFF;
        }
      }
    }
  }
}
</style>