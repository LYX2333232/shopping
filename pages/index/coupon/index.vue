<template>
  <Header title="领券中心" />
  <view class="all">
    <image
      src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhSicr23JD01fOs8hzEmFwb8vDIPykt0L9jfBf2aEMpNfKwmfPBMCq5nCPcITfB139nnhrHm1RhfqaA/0?wx_fmt=png"
      mode="scaleToFill" class="top" />
    <view v-for="coupon in couponList" :key="coupon.id"
      :class="['card', 'tn-flex-center-start', isUsable(coupon) ? 'usable' : 'unusable']"
      :style="{ background: `url(${isUsable(coupon) ? usable_image : unusable_image}) no-repeat center center`, backgroundSize: '100% 100%' }"
      @click="receive(coupon)">
      <view class="tn-flex-center-start">
        <view class="left">
          <view class="coupon-top">
            {{ coupon.type_text }}
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
          <view class="title">
            {{ coupon.name }}
          </view>
          <view class="time">
            有效期至 {{ coupon.end }}
          </view>
        </view>
      </view>
      <TnButton :type="isUsable(coupon) ? 'danger' : 'info'" :plain="coupon.state = 1" shape="round">
        {{ coupon.state === 0 ? '立即领取' : '已领取' }}
      </TnButton>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'

import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import Header from '@/components/header.vue'
import { get_coupon_list, receive_coupon } from '@/api/coupon/coupon'

const couponList = ref([])

// 可用、不可用、已领取
const usable_image = ref("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhSicr23JD01fOs8hzEmFwb8vfCq3Kefaic0OH4dos360FCvZwQ2ib43ohBUcIfm3Wy0FaweEgFuFzhZA/0?wx_fmt=png")
const unusable_image = ref("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhSicr23JD01fOs8hzEmFwb8vLNxgsBK2ficyplPp60mpfuVmGd1mwzITWiamyQFZ02S3vcicAKUxM07Ag/0?wx_fmt=png")

/**
 * 判断优惠券是否可领
 * @param coupon 优惠券
 */
const isUsable = coupon => {
  return coupon.state === 0
}

const type = ['无门槛券', '满减券', '折扣券', '类目券', '新人券']

// 领取优惠券
const receive = (coupon) => {
  // 还有优惠券未领取
  if (coupon.state === 0) {
    receive_coupon(coupon.id).then(res => {
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
    couponList.value = res.data.data
  })
}

onShow(() => {
  getData()
})

// 是否触底进行加载中
const isReaching = ref(false)

let page = 1

onReachBottom(() => {
  if (isReaching.value) return
  isReaching.value = true
  page++
  get_coupon_list(page).then(res => {
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
  width: 100%;
  min-height: 100vh;
  padding-top: 176rpx;
  background: #F6F6F6;
  display: flex;
  flex-direction: column;
  align-items: center;

  .top {
    width: 100%;
    height: 340rpx;
  }

  .card {
    margin-top: 20rpx;
    width: 710rpx;
    height: 180rpx;
    border-radius: 10rpx;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-size: 100% 100%;
    padding-right: 20rpx;

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
        font-weight: 500;
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

  .usable {
    .left {
      .coupon-top {
        background: #FF4121;
      }

      .price {
        color: #EE2532;
      }

      .desc {
        color: #EE2532;
      }
    }

    .main {
      color: #666;

      .title {
        color: #131313;
      }
    }
  }

  .unusable {
    .left {
      .coupon-top {
        background: #C2C2C2;
      }

      .price {
        color: #999;
      }

      .desc {
        color: #999;
      }
    }

    .main {
      color: #999;
    }
  }
}
</style>