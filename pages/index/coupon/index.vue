<template>
  <Header title="领券中心" />
  <image
    src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60s0brX12kDO0AhEKFROpqrdTYTJ1Im4N8BjSHN15rvt2cTmJhAgZJ8kw/0?wx_fmt=png"
    mode="widthFix" class="background" />
  <view class="all">
    <view v-for="coupon in couponList" :key="coupon.id" class="card tn-flex-center-start" @click="receive(coupon)">
      <image :src="coupon.path" style="width:140rpx;height:140rpx;margin:15rpx;" mode="scaleToFill" />
      <view class="main">
        <view class="title" :style="coupon.state !== 2 ? 'color:#FFC542' : 'color:#D4D1D4'">{{
      coupon.name }}</view>
        <view class="price" :style="coupon.state !== 2 ? 'color:#FFC542' : 'color:#D4D1D4'">
          <text v-if="coupon.type === 0 || coupon.type === 3">￥{{ coupon.number }}</text>
          <text v-if="coupon.type === 1">￥{{ coupon.reduce }} </text>
          <text v-if="coupon.type === 2">{{ '打' + coupon.number + '折' }}</text>
          <!-- ￥ {{ coupon.reduce }} -->
        </view>
        <view class="info" v-if="coupon.type === 0">
          无门槛立减{{ coupon.number }} 有效期：{{ coupon.start }} 至 {{ coupon.end }}
        </view>
        <view class="info" v-if="coupon.type === 1">
          满{{ coupon.full }}减{{ coupon.reduce }} 有效期：{{ coupon.start }} 至 {{ coupon.end }}
        </view>
        <view class="info" v-if="coupon.type === 2">
          打{{ coupon.number }}折 {{ coupon.start }} 至 {{ coupon.end }}
        </view>
        <view class="info" v-if="coupon.type === 3">
          {{ coupon.com_type.name }}券 {{ coupon.start }} 至 {{ coupon.end }}
        </view>
      </view>
      <image
        :src="coupon.state === 1 ? 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60sPN43gkSgn4XhJ8ib3vZpficlzmgXSnLvcIJ8YvK1xibHfPOjjiaNCXH6iaA/0?wx_fmt=png' : coupon.state === 0 ? 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60syBFvpaTcxb9OsUtYiaN6seficm7qdEP1PQBQFbXtfZTjY2ojMj0Me0rA/0?wx_fmt=png' : 'http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQBUncZc0XfkLMM4nGSp60svNDORcQiaciasXbIZibLqMc5ibUtbIBe2tM0Am72rwEkmov24JjaaJQWyg/0?wx_fmt=png'"
        mode="heightFix" class="right" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'
import { get_coupon_list, receive_coupon } from '@/api/coupon/coupon'

const couponList = ref([])

// 领取优惠券
const receive = (coupon) => {
  // 还有优惠券未领取
  if (coupon.state === 0) {
    receive_coupon(id).then(res => {
      console.log(res)
      if (res.code === 200) {
        uni.showToast({
          title: '领取成功',
          icon: 'none'
        })
        getData()
      }
    })
  }
}

// 获取优惠券列表
const getData = () => {
  // 获取优惠券列表
  get_coupon_list(1).then(res => {
    console.log(res)
    couponList.value = res.data.data
  })
}

onShow(() => {
  getData()
  console.log(couponList.value);
})

// 是否触底进行加载中
const isReaching = ref(false)

let page = 1

onReachBottom(() => {
  if (isReaching.value) return
  isReaching.value = true
  page++
  get_coupon_list(page).then(res => {
    console.log(res)
    couponList.value = couponList.value.concat(res.data.data)
    isReaching.value = false
  })
})
</script>

<style lang="scss" scoped>
.background {
  width: 100%;
  margin-top: 175rpx;
}

.all {
  margin-top: -10rpx;
  min-height: 700rpx;
  background: #F59854;
  display: flex;
  flex-direction: column;
  align-items: center;

  .card {
    position: relative;
    margin: 30rpx 0 20rpx;
    width: 90%;
    border-radius: 10rpx;
    background: #FFFFFF;

    .main {
      height: 140rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        font-family: Inter, Inter;
        font-weight: 400;
        font-size: 35rpx;
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

    .right {
      height: 190rpx;
      position: absolute;
      right: 0;
    }
  }
}
</style>